// SQLite-backed demo store & business mutators for AICTE PRAGATI-NAV Backend
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { initialApplications, initialExperts, initialIntegrations } from './initialData.js';
import { AICTE_REGIONS, APH_SLA_RULES, WORKFLOW_ROUTES } from '../config/constants.js';

class DataStore {
  constructor() {
    const moduleDir = path.dirname(fileURLToPath(import.meta.url));
    this.dbPath = process.env.GOVVERIFY_DB_PATH || path.resolve(moduleDir, '../../data/govverify.sqlite');
    fs.mkdirSync(path.dirname(this.dbPath), { recursive: true });
    this.sqlite = new DatabaseSync(this.dbPath);
    this.sqlite.exec(`
      CREATE TABLE IF NOT EXISTS applications (
        id TEXT PRIMARY KEY,
        institute_id TEXT NOT NULL,
        region TEXT NOT NULL,
        payload TEXT NOT NULL,
        is_synthetic INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const seedApplication = this.sqlite.prepare(`
      INSERT OR IGNORE INTO applications (id, institute_id, region, payload, is_synthetic)
      VALUES (?, ?, ?, ?, 1)
    `);
    for (const source of initialApplications) {
      const application = { ...JSON.parse(JSON.stringify(source)), isSynthetic: true };
      seedApplication.run(
        application.id,
        application.instituteId,
        application.region,
        JSON.stringify(application)
      );
    }

    this.applications = this._readApplications();
    this.experts = initialExperts.map(expert => ({ ...expert, isSynthetic: true }));
    this.integrations = initialIntegrations.map(integration => ({ ...integration, isSynthetic: true }));
    this.regions = JSON.parse(JSON.stringify(AICTE_REGIONS));
    this.slaRules = { ...APH_SLA_RULES };
    this.workflowRoutes = { ...WORKFLOW_ROUTES };
    this.auditLogs = [];
  }

  _readApplications() {
    return this.sqlite
      .prepare('SELECT payload FROM applications ORDER BY id')
      .all()
      .map(row => ({ ...JSON.parse(row.payload), isSynthetic: true }));
  }

  _refreshApplications() {
    this.applications = this._readApplications();
    return this.applications;
  }

  _persistApplication(application) {
    const payload = { ...application, isSynthetic: true };
    this.sqlite.prepare(`
      INSERT INTO applications (id, institute_id, region, payload, is_synthetic, updated_at)
      VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        institute_id = excluded.institute_id,
        region = excluded.region,
        payload = excluded.payload,
        is_synthetic = 1,
        updated_at = CURRENT_TIMESTAMP
    `).run(payload.id, payload.instituteId, payload.region, JSON.stringify(payload));
  }

  // Applications
  getApplications({ region, status, institutionId } = {}) {
    let list = this._refreshApplications();
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
    return this._refreshApplications().find(a => a.id === id) || null;
  }

  getApplicationsForSession(session, { status } = {}) {
    let list = this._refreshApplications();
    if (session.role === 'INSTITUTION') {
      list = list.filter(app => app.instituteId === session.institutionId);
    } else if (session.role === 'REGIONAL_OFFICER') {
      list = list.filter(app => app.region === session.region);
    }
    if (status) {
      list = list.filter(app => app.status.toLowerCase() === status.toLowerCase());
    }
    return list;
  }

  getApplicationByIdForSession(id, session) {
    return this.getApplicationsForSession(session).find(app => app.id === id) || null;
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
        action: `Advanced to "${nextStage}". ${remarks || ''}`.trim(),
        hash: `sha256-${Math.random().toString(16).substring(2, 8)}`
      };
      app.auditTrail.push(log);
      this.auditLogs.unshift({ ...log, appId: id });
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
      action: `Returned under ${newDeficiency.clause}. 7-day cure window clock initiated.`,
      hash: `sha256-${Math.random().toString(16).substring(2, 8)}`
    };
    app.auditTrail.push(log);
    this.auditLogs.unshift({ ...log, appId: id });

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
      action: `Deficiency remedy response submitted for ${def.clause}`,
      hash: `sha256-${Math.random().toString(16).substring(2, 8)}`
    };
    app.auditTrail.push(log);
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
        app.auditTrail.push({
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          actor,
          action: `Submitted compliance evidence for undertaking ${u.id}`,
          hash: `sha256-${Math.random().toString(16).substring(2, 8)}`
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
        app.auditTrail.push({
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          actor,
          action: `Undertaking ${u.id} ${approved ? 'verified and closed' : 'marked non-compliant'}`,
          hash: `sha256-${Math.random().toString(16).substring(2, 8)}`
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
        app.auditTrail.push({
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          actor,
          action: `Renewal deed uploaded for ${doc.type} (${doc.documentNo})`,
          hash: `sha256-${Math.random().toString(16).substring(2, 8)}`
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
      action: `Scheduled 3-member EVC for ${app.evcDetails.visitDate}. 48h report clock initialized.`,
      hash: `sha256-${Math.random().toString(16).substring(2, 8)}`
    };
    app.auditTrail.push(log);
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
      action: `EVC Inspection Report uploaded: ${outcome}. Ready for Council Approval.`,
      hash: `sha256-${Math.random().toString(16).substring(2, 8)}`
    };
    app.auditTrail.push(log);
    return app;
  }

  // Escalations
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
