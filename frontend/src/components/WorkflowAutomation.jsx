import React, { useState } from 'react';
import { 
  GitBranch, 
  Search, 
  Filter, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight, 
  FileText, 
  AlertTriangle,
  Send,
  RotateCcw,
  ShieldCheck,
  Calendar,
  Layers,
  FileCheck,
  MapPin,
  UploadCloud
} from 'lucide-react';
import { WORKFLOW_ROUTES, AICTE_REGIONS } from '../data/mockData';
import { Role, Permission, usePermissions } from '../lib/permissions';

export function WorkflowAutomation({ 
  applications, 
  onSelectApplication, 
  onProgressStage,
  onRevertWithDeficiency,
  onOpenCaseSummary,
  onReassignRegion,
  onRespondToDeficiency,
  currentRole
}) {
  const { can, getRestrictionReason, isRole } = usePermissions(currentRole);

  const [selectedRouteFilter, setSelectedRouteFilter] = useState('ALL');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Deficiency Revert Modal (RO)
  const [deficiencyModalApp, setDeficiencyModalApp] = useState(null);
  const [deficiencyClause, setDeficiencyClause] = useState('APH Clause 6.4 (Library / Labs)');
  const [deficiencyDescription, setDeficiencyDescription] = useState('');
  const [cureDays, setCureDays] = useState(7);

  // Deficiency Response Modal (Institution)
  const [respondModalApp, setRespondModalApp] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [responseFile, setResponseFile] = useState('');

  // Reassign Region Modal (Bureau Head)
  const [reassignModalApp, setReassignModalApp] = useState(null);
  const [targetRegion, setTargetRegion] = useState('SRO');

  const filteredApps = applications.filter(app => {
    const matchesRoute = selectedRouteFilter === 'ALL' || app.route === selectedRouteFilter;
    const matchesRegion = selectedRegionFilter === 'ALL' || app.region === selectedRegionFilter;
    const matchesSearch = app.instituteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRoute && matchesRegion && matchesSearch;
  });

  const handleOpenDeficiency = (app) => {
    setDeficiencyModalApp(app);
    setDeficiencyDescription('');
  };

  const handleSubmitDeficiency = (e) => {
    e.preventDefault();
    if (!deficiencyDescription.trim()) return;
    onRevertWithDeficiency(deficiencyModalApp.id, {
      clause: deficiencyClause,
      description: deficiencyDescription,
      cureDays: parseInt(cureDays, 10)
    });
    setDeficiencyModalApp(null);
  };

  const handleOpenRespondDeficiency = (app) => {
    setRespondModalApp(app);
    setResponseText('We have rectified the recorded discrepancy and attached certified documentation.');
    setResponseFile(`Compliance_Rectification_${app.id}.pdf`);
  };

  const handleSubmitResponse = (e) => {
    e.preventDefault();
    if (!respondModalApp) return;
    if (onRespondToDeficiency) {
      onRespondToDeficiency(respondModalApp.id, responseText, responseFile);
    }
    setRespondModalApp(null);
  };

  const handleConfirmReassign = (e) => {
    e.preventDefault();
    if (!reassignModalApp) return;
    if (onReassignRegion) {
      onReassignRegion(reassignModalApp.id, targetRegion);
    }
    setReassignModalApp(null);
  };

  const canAdvance = can(Permission.ADVANCE_APPLICATION_STAGE);
  const canRevert = can(Permission.REVERT_WITH_DEFICIENCY);
  const canReassign = can(Permission.REASSIGN_APPLICATION_REGION);

  return (
    <div className="workflow-automation">
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 24px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-purple">
              <GitBranch size={13} /> AICTE Dynamic Workflow Router
            </span>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Compliant with APH 2024–27 Chapter II & III
            </span>
          </div>
          <h2 style={{ fontSize: '1.35rem', marginTop: '6px' }}>
            {isRole(Role.INSTITUTION) ? 'My Institutional Application Workflow' :
             isRole(Role.REGIONAL_OFFICER) ? `${currentRole?.region} Regional Applications Workflow Engine` :
             'National End-to-End Approval Workflows (All Regions)'}
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
            {isRole(Role.INSTITUTION) 
              ? 'Real-time stage tracking, deficiency response portal, and electronic case summary.'
              : 'Automated stage advancement, statutory deficiency revert notices, and APH compliance checks.'}
          </p>
        </div>

        {/* Route Quick Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Object.values(WORKFLOW_ROUTES).map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedRouteFilter(selectedRouteFilter === r.id ? 'ALL' : r.id)}
              className="btn btn-secondary btn-sm"
              style={{
                borderColor: selectedRouteFilter === r.id ? r.color : undefined,
                background: selectedRouteFilter === r.id ? `${r.color}25` : undefined,
                color: selectedRouteFilter === r.id ? '#ffffff' : undefined,
                fontSize: '0.75rem'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: r.color }} />
              {r.title}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Toolbar (Only show Region selector if user is Bureau Head) */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '18px',
        gap: '14px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '300px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search by ID, institute name, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '36px' }}
            />
          </div>

          {can(Permission.VIEW_ALL_APPLICATIONS) && (
            <select
              value={selectedRegionFilter}
              onChange={(e) => setSelectedRegionFilter(e.target.value)}
              className="form-select"
              style={{ width: '160px' }}
            >
              <option value="ALL">All 8 Regions</option>
              {AICTE_REGIONS.map(reg => (
                <option key={reg.code} value={reg.code}>{reg.code} ({reg.hq})</option>
              ))}
            </select>
          )}
        </div>

        <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
          Showing <strong>{filteredApps.length}</strong> {isRole(Role.INSTITUTION) ? 'institutional' : 'regional'} applications
        </div>
      </div>

      {/* Applications Workflow Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {filteredApps.map(app => {
          const routeInfo = WORKFLOW_ROUTES[app.route] || WORKFLOW_ROUTES.SCRUTINY_EVC;
          const stages = routeInfo.stages;
          const isOverdue = app.daysInCurrentStage > app.slaDays;

          return (
            <div 
              key={app.id} 
              className="panel" 
              style={{ 
                margin: 0,
                borderLeft: `4px solid ${isOverdue ? '#ef4444' : routeInfo.color}`,
                transition: 'all 0.2s ease'
              }}
            >
              {/* Card Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ 
                      fontSize: '1rem', 
                      fontWeight: 800, 
                      fontFamily: 'var(--font-display)', 
                      color: '#38bdf8' 
                    }}>
                      {app.id}
                    </span>
                    <span className="badge badge-info">{app.region} Region</span>
                    <span className="badge" style={{ background: `${routeInfo.color}25`, color: routeInfo.color, border: `1px solid ${routeInfo.color}50` }}>
                      {routeInfo.title}
                    </span>
                    {app.deficiencies && app.deficiencies.length > 0 && (
                      <span className="badge badge-warning">
                        <AlertTriangle size={12} /> {app.deficiencies.length} Deficiency Memo
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.15rem' }}>{app.instituteName}</h3>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                    {app.city}, {app.state} • Type: <strong>{app.type}</strong> • Assigned: {app.assignedOfficer}
                  </div>
                </div>

                {/* SLA and Status Pill */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className={`sla-pill ${isOverdue ? 'sla-breached' : 'sla-normal'}`}>
                    <Clock size={13} />
                    <span>Stage Aging: <strong>{app.daysInCurrentStage} / {app.slaDays} Days</strong></span>
                    {isOverdue && <span style={{ fontWeight: 800 }}>({app.daysInCurrentStage - app.slaDays}d overdue)</span>}
                  </div>

                  {app.escalationLevel > 0 && (
                    <span className="badge badge-critical">
                      Level {app.escalationLevel} Escalated
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Stepper for the Assigned Route */}
              <div className="progress-stepper">
                <div className="stepper-track" />
                {stages.map((stageName, idx) => {
                  const isCompleted = idx < app.stageIndex;
                  const isActive = idx === app.stageIndex;
                  return (
                    <div 
                      key={stageName} 
                      className={`step-node ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                    >
                      <div className="step-circle">
                        {isCompleted ? <CheckCircle size={18} /> : idx + 1}
                      </div>
                      <span className="step-title">{stageName}</span>
                    </div>
                  );
                })}
              </div>

              {/* Deficiencies Note if present */}
              {app.deficiencies && app.deficiencies.length > 0 && (
                <div style={{
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginBottom: '16px',
                  fontSize: '0.78rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertTriangle size={14} /> Active Discrepancy / Deficiency Memo Recorded
                    </div>
                    {isRole(Role.INSTITUTION) && !app.deficiencies[0].resolved && (
                      <button 
                        className="btn btn-warning btn-sm"
                        onClick={() => handleOpenRespondDeficiency(app)}
                        id={`btn-respond-def-${app.id}`}
                      >
                        <Send size={13} /> Submit Rectification Response
                      </button>
                    )}
                  </div>
                  <div style={{ color: '#cbd5e1', marginTop: '4px' }}>
                    <strong>{app.deficiencies[0].clause}:</strong> {app.deficiencies[0].description}
                  </div>
                  <div style={{ color: '#94a3b8', marginTop: '4px' }}>
                    Institutional response deadline: <strong>{app.deficiencies[0].rectificationDeadline}</strong>
                  </div>
                </div>
              )}

              {/* Action Buttons Toolbar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '14px',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => onSelectApplication(app)}
                  >
                    <FileText size={14} /> Inspect Full Dossier
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => onOpenCaseSummary(app)}
                  >
                    <FileCheck size={14} /> Electronic Case Summary
                  </button>

                  {/* Reassign Region (Bureau Head only) */}
                  {canReassign && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setReassignModalApp(app);
                        setTargetRegion(app.region === 'WRO' ? 'SRO' : 'WRO');
                      }}
                      title="Reassign application to another AICTE Regional Office to balance workload"
                      id={`btn-reassign-${app.id}`}
                    >
                      <MapPin size={13} /> Reassign Region
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Revert / Return button */}
                  {app.stageIndex < stages.length - 1 && (
                    canRevert ? (
                      <button 
                        className="btn btn-warning btn-sm"
                        onClick={() => handleOpenDeficiency(app)}
                        title="Issue Deficiency Memo and return to institution for clarifications"
                        id={`btn-revert-${app.id}`}
                      >
                        <RotateCcw size={14} /> Revert for Deficiencies
                      </button>
                    ) : (
                      <button 
                        className="btn btn-secondary btn-sm"
                        disabled
                        style={{ opacity: 0.5, cursor: 'not-allowed' }}
                        title={getRestrictionReason(Permission.REVERT_WITH_DEFICIENCY)}
                      >
                        <RotateCcw size={14} /> Revert for Deficiencies
                      </button>
                    )
                  )}

                  {/* Advance to next stage button */}
                  {app.stageIndex < stages.length - 1 ? (
                    canAdvance ? (
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => onProgressStage(app.id)}
                        id={`btn-progress-${app.id}`}
                      >
                        <span>Approve & Progress to {stages[app.stageIndex + 1]}</span>
                        <ArrowRight size={14} />
                      </button>
                    ) : (
                      <button 
                        className="btn btn-secondary btn-sm"
                        disabled
                        style={{ opacity: 0.5, cursor: 'not-allowed' }}
                        title={getRestrictionReason(Permission.ADVANCE_APPLICATION_STAGE)}
                      >
                        <span>Approve & Progress to {stages[app.stageIndex + 1]}</span>
                        <ArrowRight size={14} />
                      </button>
                    )
                  ) : (
                    <span className="badge badge-success" style={{ padding: '6px 14px' }}>
                      <CheckCircle size={14} /> Final Order Issued
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deficiency Revert Modal (RO) */}
      {deficiencyModalApp && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="panel-header">
              <h3 className="panel-title">
                <RotateCcw size={20} color="#fbbf24" /> Authorized Return / Revert with Deficiency Memo
              </h3>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setDeficiencyModalApp(null)}
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSubmitDeficiency}>
              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '0.8rem'
              }}>
                <div><strong>Application:</strong> {deficiencyModalApp.id}</div>
                <div><strong>Institution:</strong> {deficiencyModalApp.instituteName}</div>
                <div><strong>Current Stage:</strong> {deficiencyModalApp.currentStage}</div>
              </div>

              <div className="form-group">
                <label className="form-label">Applicable APH Regulation / Clause:</label>
                <select 
                  className="form-select"
                  value={deficiencyClause}
                  onChange={(e) => setDeficiencyClause(e.target.value)}
                >
                  <option value="APH Clause 6.4 (Library & Digital Subscriptions)">APH Clause 6.4 (Library & Digital Subscriptions)</option>
                  <option value="APH Clause 7.12 (Faculty Cadre Ratio & Qualifications)">APH Clause 7.12 (Faculty Cadre Ratio & Qualifications)</option>
                  <option value="APH Clause 3.2.1 (Land Title & Non-Encumbrance Certificate)">APH Clause 3.2.1 (Land Title & Non-Encumbrance Certificate)</option>
                  <option value="APH Clause 2.4 (Fire Safety & Building Occupancy NOC)">APH Clause 2.4 (Fire Safety & Building Occupancy NOC)</option>
                  <option value="APH Clause 4.8.2 (Endowment Fund / Joint AICTE Deposit)">APH Clause 4.8.2 (Endowment Fund / Joint AICTE Deposit)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Deficiency Description & Mandatory Rectification Requirement:</label>
                <textarea 
                  className="form-textarea"
                  value={deficiencyDescription}
                  onChange={(e) => setDeficiencyDescription(e.target.value)}
                  placeholder="Specify exact shortfall, missing documents, or physical deficiencies requiring compliance..."
                  rows={4}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Prescribed Rectification Window (Days):</label>
                <select 
                  className="form-select"
                  value={cureDays}
                  onChange={(e) => setCureDays(e.target.value)}
                >
                  <option value={5}>5 Days (Urgent Scrutiny Rectification)</option>
                  <option value={7}>7 Days (Standard APH Window)</option>
                  <option value={10}>10 Days (SAC Appellate Clarification)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setDeficiencyModalApp(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-warning"
                >
                  <Send size={15} /> Issue Deficiency Memo & Revert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Institution Respond to Deficiency Modal */}
      {respondModalApp && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="panel-header">
              <h3 className="panel-title">
                <UploadCloud size={20} color="#38bdf8" /> Submit Institutional Rectification Response
              </h3>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setRespondModalApp(null)}
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSubmitResponse}>
              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '0.8rem'
              }}>
                <div><strong>Application:</strong> {respondModalApp.id}</div>
                <div><strong>Recorded Discrepancy:</strong> {respondModalApp.deficiencies?.[0]?.description}</div>
                <div><strong>Norm Reference:</strong> {respondModalApp.deficiencies?.[0]?.clause}</div>
              </div>

              <div className="form-group">
                <label className="form-label">Institutional Clarification & Compliance Statement:</label>
                <textarea 
                  className="form-textarea"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Attached Rectification Evidence File (PDF):</label>
                <input 
                  type="text"
                  className="form-input"
                  value={responseFile}
                  onChange={(e) => setResponseFile(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setRespondModalApp(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  <Send size={15} /> Submit for Regional Officer Re-Scrutiny
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reassign Region Modal (Bureau Head) */}
      {reassignModalApp && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="panel-header">
              <h3 className="panel-title">
                <MapPin size={20} color="#c084fc" /> Reassign Application Jurisdiction
              </h3>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setReassignModalApp(null)}
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleConfirmReassign}>
              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '0.8rem'
              }}>
                <div><strong>Application:</strong> {reassignModalApp.id}</div>
                <div><strong>Institution:</strong> {reassignModalApp.instituteName}</div>
                <div><strong>Current Region:</strong> {reassignModalApp.region}</div>
              </div>

              <div className="form-group">
                <label className="form-label">Transfer / Reassign to Target AICTE Regional Office:</label>
                <select 
                  className="form-select"
                  value={targetRegion}
                  onChange={(e) => setTargetRegion(e.target.value)}
                >
                  {AICTE_REGIONS.map(reg => (
                    <option key={reg.code} value={reg.code}>
                      {reg.code} - {reg.name} ({reg.hq})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setReassignModalApp(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
                >
                  Confirm Reassignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
