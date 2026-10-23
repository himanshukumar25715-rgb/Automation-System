import React, { useState } from 'react';
import { 
  INITIAL_APPLICATIONS, 
  INITIAL_UNDERTAKINGS, 
  INITIAL_LEASE_DOCUMENTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_APH_RULES, 
  USER_ROLES,
  WORKFLOW_ROUTES 
} from './data/mockData';

import { Header } from './components/Header';
import { SimulationBar } from './components/SimulationBar';
import { PendencyDashboard } from './components/PendencyDashboard';
import { WorkflowAutomation } from './components/WorkflowAutomation';
import { EvcHub } from './components/EvcHub';
import { UndertakingsTracker } from './components/UndertakingsTracker';
import { LeaseValidityRadar } from './components/LeaseValidityRadar';
import { EscalationMatrix } from './components/EscalationMatrix';
import { AuditTrailViewer } from './components/AuditTrailViewer';
import { AphRuleConfigurator } from './components/AphRuleConfigurator';
import { CpuSchedulerViewer } from './components/CpuSchedulerViewer';
import { ApplicationDetailsModal } from './components/ApplicationDetailsModal';
import { CaseSummaryModal } from './components/CaseSummaryModal';
import { NotificationsModal } from './components/NotificationsModal';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Master State
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [undertakings, setUndertakings] = useState(INITIAL_UNDERTAKINGS);
  const [leaseDocs, setLeaseDocs] = useState(INITIAL_LEASE_DOCUMENTS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [aphRules, setAphRules] = useState(INITIAL_APH_RULES);
  const [currentRole, setCurrentRole] = useState(USER_ROLES[0]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [simDaysOffset, setSimDaysOffset] = useState(0);

  // Modals
  const [inspectingApp, setInspectingApp] = useState(null);
  const [summaryApp, setSummaryApp] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [lastActionMessage, setLastActionMessage] = useState('');

  const triggerToast = (msg) => {
    setLastActionMessage(msg);
    setTimeout(() => setLastActionMessage(''), 4000);
  };

  // Helper for hash generation
  const generateAuditHash = () => {
    return 'sha256-' + Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 6);
  };

  const getSimulatedDateString = (offset) => {
    const d = new Date(2026, 9, 23);
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
  };

  // ==========================================
  // SIMULATION & TIME ADVANCEMENT ENGINE
  // ==========================================
  const handleAdvanceDays = (daysToAdd) => {
    const newOffset = simDaysOffset + daysToAdd;
    setSimDaysOffset(newOffset);
    const simDateStr = getSimulatedDateString(newOffset);

    let newlyTriggeredNotifs = [];

    // 1. Advance applications stage aging
    const updatedApps = applications.map(app => {
      // Don't age if completed
      if (app.currentStage === 'Council Approval' || app.status === 'Approved') {
        return app;
      }

      const newDaysInStage = app.daysInCurrentStage + daysToAdd;
      const isBreached = newDaysInStage > app.slaDays;
      const daysPastSla = newDaysInStage - app.slaDays;

      let newEscalationLevel = app.escalationLevel;
      let newStatus = app.status;

      if (isBreached) {
        if (daysPastSla >= aphRules.escalationLevel3Days) {
          if (newEscalationLevel < 3) {
            newEscalationLevel = 3;
            newStatus = 'Critical Alert';
            newlyTriggeredNotifs.push({
              id: `NOTIF-AUTO-${Date.now()}-${app.id}-L3`,
              timestamp: `${simDateStr} 00:01`,
              title: `Level 3 Apex Escalation: SLA breached by ${daysPastSla} days`,
              message: `Application ${app.id} (${app.instituteName}) has severely breached stage SLA. Emergency docket dispatched to Member Secretary.`,
              severity: 'critical',
              region: app.region,
              applicationId: app.id,
              read: false
            });
          }
        } else if (daysPastSla >= aphRules.escalationLevel2Days) {
          if (newEscalationLevel < 2) {
            newEscalationLevel = 2;
            newStatus = 'Critical Alert';
            newlyTriggeredNotifs.push({
              id: `NOTIF-AUTO-${Date.now()}-${app.id}-L2`,
              timestamp: `${simDateStr} 00:01`,
              title: `Level 2 Bureau Escalation: SLA breached by ${daysPastSla} days`,
              message: `Application ${app.id} (${app.instituteName}) delay escalated to Adviser (Approval Bureau), AICTE HQ.`,
              severity: 'critical',
              region: app.region,
              applicationId: app.id,
              read: false
            });
          }
        } else if (daysPastSla >= aphRules.escalationLevel1Days) {
          if (newEscalationLevel < 1) {
            newEscalationLevel = 1;
            newStatus = 'Overdue';
            newlyTriggeredNotifs.push({
              id: `NOTIF-AUTO-${Date.now()}-${app.id}-L1`,
              timestamp: `${simDateStr} 00:01`,
              title: `Level 1 Regional Escalation: SLA breached by ${daysPastSla} days`,
              message: `Application ${app.id} is overdue at ${app.currentStage}. Alert dispatched to Regional Officer (${app.region}).`,
              severity: 'warning',
              region: app.region,
              applicationId: app.id,
              read: false
            });
          }
        }
      }

      // Add audit entry if escalation occurred
      let newAuditTrail = [...(app.auditTrail || [])];
      if (newEscalationLevel > app.escalationLevel) {
        newAuditTrail.unshift({
          date: `${simDateStr} 00:01`,
          actor: 'System Watchdog Engine',
          action: `Automated Level ${newEscalationLevel} Escalation Triggered (${daysPastSla} days past SLA)`,
          hash: generateAuditHash()
        });
      }

      return {
        ...app,
        daysInCurrentStage: newDaysInStage,
        status: newStatus,
        escalationLevel: newEscalationLevel,
        auditTrail: newAuditTrail
      };
    });

    // 2. Advance Undertakings
    const updatedUndertakings = undertakings.map(u => {
      if (u.status === 'Verified & Closed') return u;
      const newDaysRemaining = u.daysRemaining - daysToAdd;
      let newStatus = u.status;
      let newSeverity = u.severity;

      if (newDaysRemaining < 0 && u.status !== 'Overdue Breach') {
        newStatus = 'Overdue Breach';
        newSeverity = 'critical';
        newlyTriggeredNotifs.push({
          id: `NOTIF-UND-${Date.now()}-${u.id}`,
          timestamp: `${simDateStr} 00:01`,
          title: `Time-Bound Undertaking Overdue: ${u.id}`,
          message: `${u.institute} has defaulted on condition "${u.condition}". Escalated to SAC for punitive action.`,
          severity: 'critical',
          region: u.region,
          applicationId: u.appId,
          read: false
        });
      } else if (newDaysRemaining <= aphRules.undertakingWarningDays && newDaysRemaining >= 0) {
        newSeverity = 'warning';
      }

      return {
        ...u,
        daysRemaining: newDaysRemaining,
        status: newStatus,
        severity: newSeverity
      };
    });

    // 3. Advance Lease Documents
    const updatedLeaseDocs = leaseDocs.map(d => {
      const newDaysRemaining = d.daysRemaining - daysToAdd;
      let newSeverity = d.severity;
      let newStatus = d.status;

      if (newDaysRemaining <= aphRules.leaseCriticalWarningDays && d.severity !== 'critical') {
        newSeverity = 'critical';
        newStatus = 'Critical Renewal Needed';
        newlyTriggeredNotifs.push({
          id: `NOTIF-DOC-${Date.now()}-${d.id}`,
          timestamp: `${simDateStr} 00:01`,
          title: `Critical Document Expiry Alert (${newDaysRemaining} Days Left)`,
          message: `${d.docType} for ${d.institute} is expiring soon. Urgent registered renewal deed required.`,
          severity: 'critical',
          region: d.region,
          applicationId: d.appId,
          read: false
        });
      } else if (newDaysRemaining <= aphRules.leaseAdvanceWarningDays && newDaysRemaining > aphRules.leaseCriticalWarningDays) {
        newSeverity = 'warning';
        newStatus = 'Advance Renewal Notice';
      }

      return {
        ...d,
        daysRemaining: newDaysRemaining,
        severity: newSeverity,
        status: newStatus
      };
    });

    setApplications(updatedApps);
    setUndertakings(updatedUndertakings);
    setLeaseDocs(updatedLeaseDocs);

    if (newlyTriggeredNotifs.length > 0) {
      setNotifications(prev => [...newlyTriggeredNotifs, ...prev]);
      triggerToast(`Advanced +${daysToAdd} days: ${newlyTriggeredNotifs.length} new automated escalations triggered!`);
    } else {
      triggerToast(`Advanced system clock by +${daysToAdd} days.`);
    }
  };

  const handleResetTime = () => {
    setSimDaysOffset(0);
    setApplications(INITIAL_APPLICATIONS);
    setUndertakings(INITIAL_UNDERTAKINGS);
    setLeaseDocs(INITIAL_LEASE_DOCUMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    triggerToast('System calendar reset to Day 0.');
  };

  const handleTriggerTestEscalation = () => {
    const simDateStr = getSimulatedDateString(simDaysOffset);
    const targetApp = applications[0];

    const testNotif = {
      id: `NOTIF-TEST-${Date.now()}`,
      timestamp: `${simDateStr} 12:00`,
      title: `Simulated Immediate Escalation Test on ${targetApp.id}`,
      message: `Automated test trigger: Scrutiny delay breached statutory limit. Escalation alerts generated for Regional Officer and Bureau Head.`,
      severity: 'critical',
      region: targetApp.region,
      applicationId: targetApp.id,
      read: false
    };

    const updatedApps = applications.map(a => {
      if (a.id === targetApp.id) {
        return {
          ...a,
          escalationLevel: 3,
          status: 'Critical Alert',
          daysInCurrentStage: a.slaDays + 8,
          auditTrail: [
            {
              date: `${simDateStr} 12:00`,
              actor: 'Automated Escalation Simulator',
              action: 'Manual Test: Level 3 Apex Escalation Fired to Member Secretary',
              hash: generateAuditHash()
            },
            ...(a.auditTrail || [])
          ]
        };
      }
      return a;
    });

    setApplications(updatedApps);
    setNotifications(prev => [testNotif, ...prev]);
    triggerToast('Simulated test breach escalation successfully triggered!');
  };

  // ==========================================
  // STAGE PROGRESSION & ROUTING ACTIONS
  // ==========================================
  const handleProgressStage = (appId) => {
    const simDateStr = getSimulatedDateString(simDaysOffset);

    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;

      const routeInfo = WORKFLOW_ROUTES[app.route] || WORKFLOW_ROUTES.SCRUTINY_EVC;
      const nextIndex = app.stageIndex + 1;
      if (nextIndex >= routeInfo.stages.length) return app;

      const nextStageName = routeInfo.stages[nextIndex];

      // Determine next SLA
      let nextSla = 7;
      if (nextStageName.includes('EVC Scheduling')) nextSla = aphRules.evcSchedulingSlaDays;
      else if (nextStageName.includes('EVC Inspection')) nextSla = 2; // 48 hours for report
      else if (nextStageName.includes('SAC')) nextSla = aphRules.sacHearingSlaDays;
      else if (nextStageName.includes('Approval')) nextSla = aphRules.councilApprovalSlaDays;

      const auditEntry = {
        date: `${simDateStr} 14:00`,
        actor: `${currentRole.officer} (${currentRole.badge})`,
        action: `Stage Approved: Moved from "${app.currentStage}" to "${nextStageName}"`,
        hash: generateAuditHash()
      };

      // Check if entering EVC queue
      let evcUpdate = { ...app.evcDetails };
      if (nextStageName.includes('EVC Scheduling') || nextStageName.includes('EVC Inspection')) {
        evcUpdate.required = true;
      }

      return {
        ...app,
        stageIndex: nextIndex,
        currentStage: nextStageName,
        currentStageDate: simDateStr,
        daysInCurrentStage: 0,
        slaDays: nextSla,
        status: nextIndex === routeInfo.stages.length - 1 ? 'Approved' : 'In Progress',
        escalationLevel: 0,
        evcDetails: evcUpdate,
        auditTrail: [auditEntry, ...(app.auditTrail || [])]
      };
    }));

    triggerToast(`Application ${appId} successfully advanced to next stage!`);
  };

  const handleRevertWithDeficiency = (appId, deficiencyData) => {
    const simDateStr = getSimulatedDateString(simDaysOffset);

    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;

      const newDeficiency = {
        id: `DEF-${Date.now().toString().slice(-4)}`,
        clause: deficiencyData.clause,
        description: deficiencyData.description,
        rectificationDeadline: getSimulatedDateString(simDaysOffset + deficiencyData.cureDays),
        resolved: false,
        instituteResponse: null
      };

      const auditEntry = {
        date: `${simDateStr} 15:30`,
        actor: `${currentRole.officer} (${currentRole.badge})`,
        action: `Deficiency Memo Issued: Returned for rectification under ${deficiencyData.clause}`,
        hash: generateAuditHash()
      };

      return {
        ...app,
        status: 'Deficiency Issued',
        deficiencies: [newDeficiency, ...(app.deficiencies || [])],
        auditTrail: [auditEntry, ...(app.auditTrail || [])]
      };
    }));

    // Dispatch notification
    setNotifications(prev => [
      {
        id: `NOTIF-DEF-${Date.now()}`,
        timestamp: `${simDateStr} 15:30`,
        title: `Deficiency Memo Dispatched: ${appId}`,
        message: `Discrepancy notice issued to applicant for "${deficiencyData.clause}". 7-day cure window active.`,
        severity: 'warning',
        region: currentRole.region,
        applicationId: appId,
        read: false
      },
      ...prev
    ]);

    triggerToast(`Deficiency Memo issued for ${appId}. Case reverted to institution.`);
  };

  // EVC Scheduling
  const handleScheduleEvc = (appId, scheduleData) => {
    const simDateStr = getSimulatedDateString(simDaysOffset);

    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;

      return {
        ...app,
        currentStage: 'EVC Inspection',
        stageIndex: 3,
        daysInCurrentStage: 0,
        slaDays: 2,
        status: 'In Progress',
        escalationLevel: 0,
        evcDetails: {
          ...app.evcDetails,
          scheduled: true,
          visitDate: scheduleData.visitDate,
          committee: scheduleData.committee,
          reportUploaded: false,
          outcome: 'Scheduled - Awaiting Visit'
        },
        auditTrail: [
          {
            date: `${simDateStr} 11:00`,
            actor: `${currentRole.officer} (${currentRole.badge})`,
            action: `EVC Panel Constituted for visit on ${scheduleData.visitDate} (${scheduleData.committee.length} Experts)`,
            hash: generateAuditHash()
          },
          ...(app.auditTrail || [])
        ]
      };
    }));

    triggerToast(`EVC Inspection scheduled for ${appId} on ${scheduleData.visitDate}`);
  };

  // EVC Report Submission
  const handleSubmitEvcReport = (appId, reportData) => {
    const simDateStr = getSimulatedDateString(simDaysOffset);

    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;

      const nextStage = reportData.outcome.includes('SAC') ? 'SAC / SHC Hearing' : 'Council Approval';
      const nextIndex = (WORKFLOW_ROUTES[app.route] || WORKFLOW_ROUTES.SCRUTINY_EVC).stages.indexOf(nextStage);

      return {
        ...app,
        currentStage: nextStage,
        stageIndex: nextIndex !== -1 ? nextIndex : app.stageIndex + 1,
        daysInCurrentStage: 0,
        slaDays: nextStage.includes('SAC') ? aphRules.sacHearingSlaDays : aphRules.councilApprovalSlaDays,
        status: reportData.outcome.includes('Recommended') ? 'Recommended' : 'Referred to SAC',
        escalationLevel: 0,
        evcDetails: {
          ...app.evcDetails,
          reportUploaded: true,
          outcome: reportData.outcome
        },
        auditTrail: [
          {
            date: `${simDateStr} 17:00`,
            actor: 'EVC Committee Panel',
            action: `Digital EVC Report Submitted & Signed: ${reportData.outcome} (Infra: ${reportData.infraScore}%, Faculty: ${reportData.facultyScore}%)`,
            hash: generateAuditHash()
          },
          ...(app.auditTrail || [])
        ]
      };
    }));

    triggerToast(`EVC Report submitted & digitally signed for ${appId}`);
  };

  // Undertakings actions
  const handleUploadComplianceEvidence = (undertakingId, filename, notes) => {
    const simDateStr = getSimulatedDateString(simDaysOffset);

    setUndertakings(prev => prev.map(u => {
      if (u.id !== undertakingId) return u;
      return {
        ...u,
        status: 'Submitted',
        evidenceFile: filename,
        severity: 'warning'
      };
    }));

    setNotifications(prev => [
      {
        id: `NOTIF-EVID-${Date.now()}`,
        timestamp: `${simDateStr} 14:00`,
        title: `Compliance Proof Submitted: ${undertakingId}`,
        message: `Institution uploaded ${filename}. Ready for Regional Officer verification.`,
        severity: 'info',
        region: 'ALL',
        read: false
      },
      ...prev
    ]);

    triggerToast(`Compliance evidence uploaded for ${undertakingId}`);
  };

  const handleVerifyUndertaking = (undertakingId, approved, remarks) => {
    setUndertakings(prev => prev.map(u => {
      if (u.id !== undertakingId) return u;
      return {
        ...u,
        status: approved ? 'Verified & Closed' : 'Overdue Breach',
        severity: approved ? 'normal' : 'critical'
      };
    }));

    triggerToast(approved ? `Undertaking ${undertakingId} approved & closed!` : `Undertaking ${undertakingId} rejected & escalated to SAC.`);
  };

  const handleAddNewUndertaking = (newU) => {
    const item = {
      id: `UND-${newU.appId.split('-')[2] || 'GEN'}-${Math.floor(Math.random()*90 + 10)}`,
      appId: newU.appId,
      institute: newU.institute,
      region: newU.appId.split('-')[2] || 'WRO',
      condition: newU.condition,
      clause: newU.clause,
      dueDate: newU.dueDate,
      daysRemaining: Math.ceil((new Date(newU.dueDate) - new Date(2026, 9, 23 + simDaysOffset)) / (1000 * 60 * 60 * 24)),
      status: 'Pending',
      severity: 'normal',
      evidenceFile: null
    };

    setUndertakings(prev => [item, ...prev]);
    triggerToast(`New time-bound undertaking issued for ${newU.appId}`);
  };

  // Lease Document Renewal
  const handleUploadRenewedDoc = (docId, renewalData) => {
    setLeaseDocs(prev => prev.map(d => {
      if (d.id !== docId) return d;
      return {
        ...d,
        docNumber: renewalData.newDocNumber,
        expiryDate: renewalData.newExpiryDate,
        daysRemaining: 10950, // ~30 years
        status: 'Valid (Renewed)',
        severity: 'normal',
        actionRequired: 'None - Active compliance'
      };
    }));

    triggerToast(`Registered lease/statutory document renewed & validated!`);
  };

  // Notifications
  const handleMarkNotificationRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSelectApplicationById = (appId) => {
    const found = applications.find(a => a.id === appId);
    if (found) setInspectingApp(found);
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const overdueCount = applications.filter(a => a.daysInCurrentStage > a.slaDays).length;

  return (
    <div className="app-container">
      {/* 1. Header with Government AICTE Branding & Multi-Role Selector */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        simDaysOffset={simDaysOffset}
        unreadCount={unreadCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        overdueCount={overdueCount}
      />

      {/* 2. Interactive Time-Travel & Escalation Simulation Bar */}
      <SimulationBar
        simDaysOffset={simDaysOffset}
        onAdvanceDays={handleAdvanceDays}
        onResetTime={handleResetTime}
        onTriggerTestEscalation={handleTriggerTestEscalation}
        lastActionMessage={lastActionMessage}
      />

      {/* 3. Main Workspace depending on active navigation tab */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <PendencyDashboard
            applications={applications}
            undertakings={undertakings}
            leaseDocs={leaseDocs}
            onSelectApplication={(app) => setInspectingApp(app)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            currentRole={currentRole}
          />
        )}

        {activeTab === 'workflows' && (
          <WorkflowAutomation
            applications={applications}
            onSelectApplication={(app) => setInspectingApp(app)}
            onProgressStage={handleProgressStage}
            onRevertWithDeficiency={handleRevertWithDeficiency}
            onOpenCaseSummary={(app) => setSummaryApp(app)}
            currentRole={currentRole}
          />
        )}

        {activeTab === 'evc' && (
          <EvcHub
            applications={applications}
            onScheduleEvc={handleScheduleEvc}
            onSubmitEvcReport={handleSubmitEvcReport}
            onOpenApplicationDossier={(app) => setInspectingApp(app)}
            currentRole={currentRole}
          />
        )}

        {activeTab === 'undertakings' && (
          <UndertakingsTracker
            undertakings={undertakings}
            onUploadComplianceEvidence={handleUploadComplianceEvidence}
            onVerifyUndertaking={handleVerifyUndertaking}
            onAddNewUndertaking={handleAddNewUndertaking}
            currentRole={currentRole}
          />
        )}

        {activeTab === 'leases' && (
          <LeaseValidityRadar
            leaseDocs={leaseDocs}
            onUploadRenewedDoc={handleUploadRenewedDoc}
            onVerifyRenewedDoc={() => {}}
            currentRole={currentRole}
          />
        )}

        {activeTab === 'escalations' && (
          <EscalationMatrix
            notifications={notifications}
            onMarkNotificationRead={handleMarkNotificationRead}
            applications={applications}
            undertakings={undertakings}
            leaseDocs={leaseDocs}
            onOpenCaseSummary={(app) => setSummaryApp(app)}
          />
        )}

        {activeTab === 'cpu' && (
          <CpuSchedulerViewer
            applications={applications}
          />
        )}

        {activeTab === 'audit' && (
          <AuditTrailViewer
            applications={applications}
          />
        )}

        {activeTab === 'rules' && (
          <AphRuleConfigurator
            rules={aphRules}
            onUpdateRules={(newRules) => {
              setAphRules(newRules);
              triggerToast('APH Rules & SLA parameters saved.');
            }}
            currentRole={currentRole}
          />
        )}
      </main>

      {/* 4. Bottom Regulatory Safeguard Banner */}
      <footer className="regulatory-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="regulatory-badge">
            <ShieldAlert size={12} /> AICTE STATUTORY SAFEGUARD
          </span>
          <span>
            Automated recommendations, workflow movements, and deadline notifications assist the approval process under the AICTE Approval Process Handbook (APH). All statutory inspections, verifications, and regulatory approvals remain exclusively reserved for competent AICTE authorities.
          </span>
        </div>
        <div style={{ whiteSpace: 'nowrap', opacity: 0.7 }}>
          National Informatics Platform • SIH 2024–27
        </div>
      </footer>

      {/* Modals */}
      {inspectingApp && (
        <ApplicationDetailsModal
          application={inspectingApp}
          onClose={() => setInspectingApp(null)}
          onProgressStage={handleProgressStage}
          onOpenCaseSummary={(app) => {
            setInspectingApp(null);
            setSummaryApp(app);
          }}
        />
      )}

      {summaryApp && (
        <CaseSummaryModal
          application={summaryApp}
          onClose={() => setSummaryApp(null)}
        />
      )}

      {isNotificationsOpen && (
        <NotificationsModal
          notifications={notifications}
          onClose={() => setIsNotificationsOpen(false)}
          onMarkRead={handleMarkNotificationRead}
          onMarkAllRead={handleMarkAllNotificationsRead}
          onSelectApplicationById={handleSelectApplicationById}
        />
      )}
    </div>
  );
}
