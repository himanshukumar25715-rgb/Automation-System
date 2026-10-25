// In-Memory Data Store & Business Mutators for AICTE PRAGATI-NAV Backend
import { initialApplications, initialExperts, initialIntegrations } from './initialData.js';
import { AICTE_REGIONS, APH_SLA_RULES, WORKFLOW_ROUTES } from '../config/constants.js';
import { readFileSync } from 'node:fs';
import { AuditChain } from '../services/auditChain.js';
import { runPreflight } from '../services/rulesEngine.js';
import { applyPatch, diffFields, diffFindings, hashFields } from '../services/diff.js';
import { toStoredRecord, publicRecord, detectConflicts } from '../services/facultyDetector.js';
import { preflightSeed } from './preflightSeed.js';
import { facultySeed } from './facultySeed.js';

const RULESET = JSON.parse(readFileSync(new URL('./rulesets/aph-demo-v1.json', import.meta.url), 'utf8'));
const nowStamp = () => new Date().toISOString().replace('T', ' ').substring(0, 16);

class DataStore {
  constructor() {
    this.init();
  }

  // (Re)build all in-memory state from seed data. Also used by the demo reset.
  init() {
    this.applications = JSON.parse(JSON.stringify(initialApplications));
    this.experts = JSON.parse(JSON.stringify(initialExperts));
    this.integrations = JSON.parse(JSON.stringify(initialIntegrations));
    this.regions = JSON.parse(JSON.stringify(AICTE_REGIONS));
    this.slaRules = { ...APH_SLA_RULES };
    this.workflowRoutes = { ...WORKFLOW_ROUTES };
    this.auditLogs = [];
    this.auditChain = new AuditChain();
    this.ruleset = RULESET;
    this.fieldVersions = {}; // applicationId -> [{ version, fields, fieldsHash, ... }]
    this.ruleRuns = {};      // applicationId -> [run, ...]
    this.facultyRecords = facultySeed.map((r, i) => toStoredRecord(r, `FAC-${String(i + 1).padStart(4, '0')}`));
    this.facultyDispositions = {}; // conflictId -> { decision, reason, actor, at }
    this.seedAuditChain();
  }

  // ---- Audit (real SHA-256 hash chain) ------------------------------------
  // Replays the seeded activity logs into the chain, in time order, so every
  // entry gets a real hash and the full chain verifies from the first event.
  seedAuditChain() {
    const seeded = [];
    this.applications.forEach(app => (app.auditTrail || []).forEach((entry, i) => seeded.push({ app, entry, i })));
    seeded.sort((a, b) => (a.entry.date < b.entry.date ? -1 : a.entry.date > b.entry.date ? 1 : 0));
    seeded.forEach(({ app, entry }) => this.sealEntry(app.id, entry));
  }

  sealEntry(applicationId, entry) {
    const ev = this.auditChain.append({
      date: entry.date,
      actor: entry.actor,
      applicationId,
      action: entry.action
    });
    entry.seq = ev.seq;
    entry.eventHash = ev.hash;
    entry.hash = `sha256-${ev.hash.slice(0, 12)}`; // short form for display
    return entry;
  }

  // Single entry point for every audit event: chains it, then adds it to the
  // application's trail and the global log.
  recordAudit(app, entry) {
    const full = { date: nowStamp(), ...entry };
    this.sealEntry(app ? app.id : null, full);
    if (app) {
      app.auditTrail = app.auditTrail || [];
      app.auditTrail.push(full);
    }
    this.auditLogs.unshift({ ...full, appId: app ? app.id : null });
    return full;
  }

  // Applications
  getApplications({ region, status, institutionId } = {}) {
    let list = this.applications;
    if (region) {
      list = list.filter(app => app.region.toUpperCase() === region.toUpperCase());
    }
    if (status) {
      list = list.filter(app => app.status.toLowerCase() === status.toLowerCase());
    }
    if (institutionId) {
      list = list.filter(app => app.instituteId === institutionId);
    }
    return list;
  }

  getApplicationById(id) {
    return this.applications.find(a => a.id === id) || null;
  }

  advanceApplicationStage(id, { remarks, actor = 'Regional Officer' } = {}) {
    const app = this.getApplicationById(id);
    if (!app) return null;

    const routeConfig = this.workflowRoutes[app.route] || this.workflowRoutes.SCRUTINY_EVC;
    const stages = routeConfig.stages;
    const currentIndex = stages.indexOf(app.currentStage);

    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      app.currentStage = nextStage;
      app.stageIndex = currentIndex + 1;
      app.daysInCurrentStage = 0;
      app.currentStageDate = new Date().toISOString().split('T')[0];
      app.status = nextStage === 'Council Approval' ? 'Approved' : 'In Progress';
      app.escalationLevel = 0;

      const log = {
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        actor,
        action: `Advanced to "${nextStage}". ${remarks || ''}`.trim()
      };
      this.recordAudit(app, log);
    }
    return app;
  }

  revertApplicationDeficiency(id, { clause, description, daysToCure = 7, actor = 'Regional Officer' }) {
    const app = this.getApplicationById(id);
    if (!app) return null;

    const newDeficiency = {
      id: `DEF-${Date.now()}`,
      clause: clause || 'APH Clause 6.4 (Infrastructure & Norms)',
      description: description || 'Mandatory clarification requested',
      issuedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + daysToCure * 86400000).toISOString().split('T')[0],
      status: 'Action Required',
      cureWindowDays: daysToCure
    };

    app.deficiencies = app.deficiencies || [];
    app.deficiencies.push(newDeficiency);
    app.status = 'Returned for Deficiency';

    const log = {
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      actor,
      action: `Returned under ${newDeficiency.clause}. 7-day cure window clock initiated.`
    };
    this.recordAudit(app, log);
    //this.auditLogs.unshift({ ...log, appId: id });

    return { app, deficiency: newDeficiency };
  }

  submitDeficiencyRemedy(id, deficiencyId, { responseText, fileName, actor = 'Applicant Institution' }) {
    const app = this.getApplicationById(id);
    if (!app) return null;

    const def = (app.deficiencies || []).find(d => d.id === deficiencyId);
    if (!def) return null;

    def.status = 'Submitted for Review';
    def.responseEvidence = fileName || 'Compliance_Clarification_Dossier.pdf';
    def.institutionRemarks = responseText || 'Rectification documents submitted.';
    app.status = 'In Progress';

    const log = {
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      actor,
      action: `Deficiency remedy response submitted for ${def.clause}`
    };
    this.recordAudit(app, log);
    return { app, deficiency: def };
  }

  // Undertakings
  getAllUndertakings({ institutionId, status } = {}) {
    let list = [];
    this.applications.forEach(app => {
      (app.undertakings || []).forEach(u => {
        list.push({
          ...u,
          applicationId: app.id,
          instituteId: app.instituteId,
          instituteName: app.instituteName,
          region: app.region
        });
      });
    });

    if (institutionId) {
      list = list.filter(u => u.instituteId === institutionId);
    }
    if (status) {
      list = list.filter(u => u.status.toLowerCase() === status.toLowerCase());
    }
    return list;
  }

  submitUndertakingEvidence(undertakingId, { fileName, remarks, actor = 'Applicant Institution' }) {
    for (const app of this.applications) {
      const u = (app.undertakings || []).find(x => x.id === undertakingId);
      if (u) {
        u.status = 'Submitted (Under Review)';
        u.evidenceSubmitted = fileName || 'Certified_Evidence_Submission.pdf';
        u.remarks = remarks || 'Compliance proof uploaded.';
        this.recordAudit(app, {
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          actor,
          action: `Submitted compliance evidence for undertaking ${u.id}`
        });
        return u;
      }
    }
    return null;
  }

  verifyUndertaking(undertakingId, { approved = true, remarks, actor = 'Regional Officer' }) {
    for (const app of this.applications) {
      const u = (app.undertakings || []).find(x => x.id === undertakingId);
      if (u) {
        u.status = approved ? 'Verified & Closed' : 'Rejected / Non-Compliant';
        u.verifiedBy = actor;
        u.verifiedDate = new Date().toISOString().split('T')[0];
        u.verificationRemarks = remarks || '';
        this.recordAudit(app, {
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          actor,
          action: `Undertaking ${u.id} ${approved ? 'verified and closed' : 'marked non-compliant'}`
        });
        return u;
      }
    }
    return null;
  }

  // Leases
  getAllLeases({ institutionId } = {}) {
    let list = [];
    this.applications.forEach(app => {
      (app.documents || []).forEach(doc => {
        list.push({
          ...doc,
          applicationId: app.id,
          instituteId: app.instituteId,
          instituteName: app.instituteName,
          region: app.region
        });
      });
    });

    if (institutionId) {
      list = list.filter(d => d.instituteId === institutionId);
    }
    return list;
  }

  renewDocument(documentNo, { newExpiryDate, fileName, actor = 'Applicant Institution' }) {
    for (const app of this.applications) {
      const doc = (app.documents || []).find(d => d.documentNo === documentNo);
      if (doc) {
        doc.expiryDate = newExpiryDate || '2056-04-09';
        doc.status = 'Renewal Submitted';
        doc.uploadedFile = fileName || 'Registered_Lease_Extension_Deed.pdf';
        doc.daysToExpiry = Math.max(365, doc.daysToExpiry + 365);
        this.recordAudit(app, {
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          actor,
          action: `Renewal deed uploaded for ${doc.type} (${doc.documentNo})`
        });
        return doc;
      }
    }
    return null;
  }

  // EVC
  getExperts() {
    return this.experts;
  }

  scheduleEVC(appId, { expertIds, visitDate, actor = 'Regional Officer' }) {
    const app = this.getApplicationById(appId);
    if (!app) return null;

    app.evcDetails = app.evcDetails || {};
    app.evcDetails.scheduled = true;
    app.evcDetails.visitDate = visitDate || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];
    app.evcDetails.committee = expertIds || ['EXP-101', 'EXP-102', 'EXP-106'];
    app.evcDetails.reportUploaded = false;
    app.evcDetails.reportDueHours = 48;
    app.currentStage = 'EVC Inspection';
    app.stageIndex = 3;
    app.daysInCurrentStage = 0;

    // Increment assigned count for selected experts
    this.experts.forEach(exp => {
      if ((expertIds || []).includes(exp.id)) {
        exp.assignedCount += 1;
      }
    });

    const log = {
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      actor,
      action: `Scheduled 3-member EVC for ${app.evcDetails.visitDate}. 48h report clock initialized.`
    };
    this.recordAudit(app, log);
    return app;
  }

  uploadEVCReport(appId, { outcome = 'Recommended', fileName, remarks, actor = 'EVC Committee Panel' }) {
    const app = this.getApplicationById(appId);
    if (!app || !app.evcDetails) return null;

    app.evcDetails.reportUploaded = true;
    app.evcDetails.outcome = outcome;
    app.evcDetails.reportFile = fileName || 'GeoTagged_EVC_Inspection_Dossier.pdf';
    app.evcDetails.reportDate = new Date().toISOString().split('T')[0];
    app.evcDetails.remarks = remarks || 'Physical infrastructure norms verified.';

    const log = {
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      actor,
      action: `EVC Inspection Report uploaded: ${outcome}. Ready for Council Approval.`
    };
    this.recordAudit(app, log);
    return app;
  }

  // ---- Pre-flight rules, versions and deficiency diff ----------------------
  getFieldVersions(appId) {
    if (!this.getApplicationById(appId)) return null;
    if (!this.fieldVersions[appId]) {
      const fields = (preflightSeed[appId] || []).map(f => ({ ...f }));
      this.fieldVersions[appId] = [
        { version: 1, fields, fieldsHash: hashFields(fields), createdAt: new Date().toISOString(), note: 'Initial submission', submittedBy: 'Applicant Institution' }
      ];
    }
    return this.fieldVersions[appId];
  }

  latestVersion(appId) {
    const versions = this.getFieldVersions(appId);
    return versions ? versions[versions.length - 1] : null;
  }

  latestRun(appId) {
    const runs = this.ruleRuns[appId];
    return runs && runs.length ? runs[runs.length - 1] : null;
  }

  runPreflightFor(appId, { asOf, actor = 'Applicant Institution' } = {}) {
    const app = this.getApplicationById(appId);
    if (!app) return null;
    const version = this.latestVersion(appId);
    const asOfDate = asOf ? new Date(asOf) : process.env.DEMO_AS_OF ? new Date(process.env.DEMO_AS_OF) : new Date();
    const run = runPreflight({ applicationId: appId, fields: version.fields, ruleset: this.ruleset, asOf: asOfDate });
    const stored = { runId: `RUN-${appId}-${(this.ruleRuns[appId] || []).length + 1}`, applicationVersion: version.version, executedAt: new Date().toISOString(), ...run };
    (this.ruleRuns[appId] = this.ruleRuns[appId] || []).push(stored);
    this.recordAudit(app, {
      actor,
      action: `Pre-flight check run on v${version.version} (ruleset ${run.rulesetId} ${run.rulesetVersion}): ${run.summary.pass} pass, ${run.summary.fail} fail, ${run.summary.needsReview} need review. Readiness: ${run.readiness}.`
    });
    return stored;
  }

  getFindings(appId, { severity, outcome, ruleKey } = {}) {
    if (!this.getApplicationById(appId)) return null;
    const run = this.latestRun(appId) || this.runPreflightFor(appId, { actor: 'System Pre-flight' });
    let findings = run.findings;
    if (severity) findings = findings.filter(f => f.severity === severity);
    if (outcome) findings = findings.filter(f => f.outcome === outcome.toUpperCase());
    if (ruleKey) findings = findings.filter(f => f.ruleKey === ruleKey);
    return { runId: run.runId, applicationVersion: run.applicationVersion, rulesetVersion: run.rulesetVersion, readiness: run.readiness, summary: run.summary, findings };
  }

  // Create a new version from a patch of corrected fields, diff it against the
  // previous version, re-run the rules, and report which findings changed.
  resubmit(appId, { fields, note, actor = 'Applicant Institution', asOf }) {
    const app = this.getApplicationById(appId);
    if (!app) return null;
    if (!this.latestRun(appId)) this.runPreflightFor(appId, { asOf, actor: 'System Pre-flight' });
    const prevRun = this.latestRun(appId);
    const prev = this.latestVersion(appId);

    const nextFields = applyPatch(prev.fields, fields);
    const fieldDiff = diffFields(prev.fields, nextFields);
    const version = {
      version: prev.version + 1,
      fields: nextFields,
      fieldsHash: hashFields(nextFields),
      createdAt: new Date().toISOString(),
      note: note || 'Resubmission',
      submittedBy: actor
    };
    this.fieldVersions[appId].push(version);

    const nextRun = this.runPreflightFor(appId, { asOf, actor: 'System Pre-flight' });
    const findingDiff = diffFindings(prevRun, nextRun);
    if (app.status === 'Returned for Deficiency' && findingDiff.newlyRaised.length === 0) app.status = 'In Progress';
    this.recordAudit(app, {
      actor,
      action: `Resubmitted as v${version.version}: ${fieldDiff.totalChanges} field change(s); ${findingDiff.resolved.length} finding(s) resolved, ${findingDiff.newlyRaised.length} newly raised, ${findingDiff.stillOpen.length} still open.`
    });
    return { version: version.version, fieldsHash: version.fieldsHash, fieldDiff, findingDiff, run: nextRun };
  }

  // ---- Faculty conflicts -----------------------------------------------------
  institutionName(instituteId) {
    const app = this.applications.find(a => a.instituteId === instituteId);
    return app ? app.instituteName : instituteId;
  }

  addFacultyRecord(input) {
    const id = `FAC-${String(this.facultyRecords.length + 1).padStart(4, '0')}`;
    const rec = toStoredRecord({ ...input, synthetic: input.synthetic }, id);
    this.facultyRecords.push(rec);
    return publicRecord(rec);
  }

  getFacultyRecords({ institutionId } = {}) {
    const list = institutionId ? this.facultyRecords.filter(r => r.institutionId === institutionId) : this.facultyRecords;
    return list.map(publicRecord);
  }

  getFacultyConflicts({ institutionId, status, asOf } = {}) {
    let list = detectConflicts(this.facultyRecords, { asOf: asOf ? new Date(asOf) : new Date(), institutionName: id => this.institutionName(id) });
    list = list.map(c => ({ ...c, status: this.facultyDispositions[c.id] ? this.facultyDispositions[c.id].decision : 'OPEN', disposition: this.facultyDispositions[c.id] || null }));
    if (institutionId) list = list.filter(c => c.institutions.some(i => i.institutionId === institutionId));
    if (status) list = list.filter(c => c.status === status.toUpperCase());
    return list;
  }

  recordFacultyDisposition(conflictId, { decision, reason, actor = 'Scrutiny Officer' }) {
    const conflict = this.getFacultyConflicts().find(c => c.id === conflictId);
    if (!conflict) return null;
    const disposition = { decision, reason, actor, at: new Date().toISOString() };
    this.facultyDispositions[conflictId] = disposition;
    this.recordAudit(null, {
      actor,
      action: `Faculty conflict candidate ${conflictId} (${conflict.label}) marked ${decision}. Reason: ${reason}`
    });
    return { ...conflict, status: decision, disposition };
  }

  // ---- Escalations
  getEscalations() {
    const list = [];
    this.applications.forEach(app => {
      if (app.escalationLevel > 0 || app.status === 'Overdue' || app.status === 'Critical Alert') {
        list.push({
          id: `ESC-${app.id}`,
          applicationId: app.id,
          instituteName: app.instituteName,
          region: app.region,
          stage: app.currentStage,
          agingDays: app.daysInCurrentStage,
          slaDays: app.slaDays,
          level: app.escalationLevel || (app.daysInCurrentStage > app.slaDays + 8 ? 3 : app.daysInCurrentStage > app.slaDays + 5 ? 2 : 1),
          triggerDate: app.currentStageDate,
          actionRequired: app.escalationLevel === 3
            ? 'Emergency Docket to Member Secretary'
            : app.escalationLevel === 2
            ? 'Directive Memo to Regional Officer'
            : 'SMS & Email Reminder to Principal'
        });
      }
    });
    return list;
  }

  // Regional Analytics
  getRegionalAnalytics() {
    return this.regions.map(r => {
      const regionApps = this.applications.filter(a => a.region.toUpperCase() === r.code.toUpperCase());
      const total = regionApps.length;
      const overdue = regionApps.filter(a => a.status === 'Overdue' || a.status === 'Critical Alert').length;
      const avgAging = total > 0 ? (regionApps.reduce((acc, curr) => acc + curr.daysInCurrentStage, 0) / total).toFixed(1) : 0;
      return {
        ...r,
        activeApplications: total,
        overdueCount: overdue,
        avgAgingDays: Number(avgAging),
        healthStatus: overdue > 0 ? 'Action Required' : 'Optimal'
      };
    });
  }

  // National Summary
  getNationalSummary() {
    const totalApps = this.applications.length;
    const pendingScrutiny = this.applications.filter(a => a.currentStage === 'Preliminary Scrutiny').length;
    const inEVC = this.applications.filter(a => a.currentStage.includes('EVC')).length;
    const councilReady = this.applications.filter(a => a.currentStage === 'Council Approval').length;
    const overdue = this.applications.filter(a => a.status === 'Overdue' || a.status === 'Critical Alert').length;
    const totalUndertakings = this.getAllUndertakings().length;
    const pendingUndertakings = this.getAllUndertakings().filter(u => u.status === 'Pending' || u.status === 'Overdue').length;

    return {
      totalApplications: totalApps,
      pendingScrutiny,
      inEVC,
      councilReady,
      overdueCount: overdue,
      totalUndertakings,
      pendingUndertakings,
      statutoryComplianceRate: '94.2%',
      averageResolutionDays: '8.4 Days'
    };
  }
}

export const db = new DataStore();
