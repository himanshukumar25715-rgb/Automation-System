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
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div className="page-overline">WORKFLOW ROUTER & ENGINE</div>
          <h1 className="page-title">
            {isRole(Role.INSTITUTION) ? 'Application Workflow' :
             isRole(Role.REGIONAL_OFFICER) ? `${currentRole?.region} Regional Workflow` :
             'Approval Workflows'}
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '6px 0 0 0' }}>
            {isRole(Role.INSTITUTION) 
              ? 'Real-time stage tracking, deficiency response portal, and electronic case summary.'
              : 'Automated stage advancement, statutory deficiency revert notices, and APH compliance checks.'}
          </p>
        </div>

        {/* Route Quick Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => setSelectedRouteFilter('ALL')}
            className={selectedRouteFilter === 'ALL' ? 'btn-mint' : 'btn-dark'}
            style={{ padding: '7px 14px', fontSize: '0.78rem' }}
          >
            All Routes
          </button>
          {Object.values(WORKFLOW_ROUTES).map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedRouteFilter(selectedRouteFilter === r.id ? 'ALL' : r.id)}
              className="btn-dark"
              style={{
                borderColor: selectedRouteFilter === r.id ? '#0f172a' : undefined,
                color: selectedRouteFilter === r.id ? '#ffffff' : undefined,
                background: selectedRouteFilter === r.id ? '#0f172a' : undefined,
                padding: '7px 12px',
                fontSize: '0.78rem',
                borderRadius: '2px'
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: r.color, display: 'inline-block' }} />
              {r.title}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        gap: '14px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '300px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by ID, institute name, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-clean"
              style={{ width: '100%', borderRadius: '2px' }}
            />
          </div>

          {can(Permission.VIEW_ALL_APPLICATIONS) && (
            <select
              value={selectedRegionFilter}
              onChange={(e) => setSelectedRegionFilter(e.target.value)}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: '2px',
                padding: '8px 12px',
                fontSize: '0.82rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All 8 Regions</option>
              {AICTE_REGIONS.map(reg => (
                <option key={reg.code} value={reg.code}>{reg.code} ({reg.hq})</option>
              ))}
            </select>
          )}
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredApps.length}</strong> {isRole(Role.INSTITUTION) ? 'institutional' : 'regional'} applications
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
              style={{ 
                margin: 0,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderLeft: `3px solid ${isOverdue ? 'var(--coral-500)' : '#0f172a'}`,
                borderRadius: '2px',
                padding: '20px 22px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease',
                animation: 'cardEnter 0.35s ease forwards'
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ 
                      fontSize: '0.95rem', 
                      fontWeight: 700, 
                      letterSpacing: '0.04em',
                      color: 'var(--text-primary)' 
                    }}>
                      {app.id}
                    </span>
                    <span className="status-pill status-neutral">{app.region} Region</span>
                    <span 
                      style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 600, 
                        color: routeInfo.color, 
                        background: `${routeInfo.color}14`, 
                        border: `1px solid ${routeInfo.color}35`,
                        padding: '2px 8px',
                        borderRadius: '2px'
                      }}
                    >
                      {routeInfo.title}
                    </span>
                    {app.deficiencies && app.deficiencies.length > 0 && (
                      <span className="status-pill status-warning">
                        <AlertTriangle size={12} /> {app.deficiencies.length} Deficiency Memo
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.12rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    {app.instituteName}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {app.city}, {app.state} • Type: <strong style={{ color: 'var(--text-primary)' }}>{app.type}</strong> • Assigned: {app.assignedOfficer}
                  </div>
                </div>

                {/* SLA and Status Pill */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div 
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '5px 10px',
                      borderRadius: '2px',
                      fontSize: '0.75rem',
                      background: isOverdue ? 'rgba(255, 77, 106, 0.12)' : 'var(--bg-elevated)',
                      border: `1px solid ${isOverdue ? 'rgba(255, 77, 106, 0.35)' : 'var(--border-subtle)'}`,
                      color: isOverdue ? 'var(--coral-500)' : 'var(--text-secondary)'
                    }}
                  >
                    <Clock size={13} />
                    <span>Stage Aging: <strong style={{ color: isOverdue ? 'var(--coral-500)' : 'var(--text-primary)' }}>{app.daysInCurrentStage} / {app.slaDays}d</strong></span>
                    {isOverdue && <span style={{ fontWeight: 800 }}>({app.daysInCurrentStage - app.slaDays}d overdue)</span>}
                  </div>

                  {app.escalationLevel > 0 && (
                    <span className="status-pill status-danger">
                      L{app.escalationLevel} Escalated
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Stepper for the Assigned Route */}
              <div className="progress-stepper" style={{ margin: '14px 0 16px 0' }}>
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
                        {isCompleted ? <CheckCircle size={16} /> : idx + 1}
                      </div>
                      <span className="step-title">{stageName}</span>
                    </div>
                  );
                })}
              </div>

              {/* Deficiencies Note if present */}
              {app.deficiencies && app.deficiencies.length > 0 && (
                <div style={{
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: '2px',
                  padding: '12px 14px',
                  marginBottom: '16px',
                  fontSize: '0.78rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, color: '#b45309', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertTriangle size={14} /> Active Discrepancy / Deficiency Memo Recorded
                    </div>
                    {isRole(Role.INSTITUTION) && !app.deficiencies[0].resolved && (
                      <button 
                        className="btn-dark"
                        onClick={() => handleOpenRespondDeficiency(app)}
                        id={`btn-respond-def-${app.id}`}
                        style={{ color: '#b45309', borderColor: '#fde68a', padding: '5px 10px', fontSize: '0.75rem', borderRadius: '2px' }}
                      >
                        <Send size={13} /> Submit Response
                      </button>
                    )}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{app.deficiencies[0].clause}:</strong> {app.deficiencies[0].description}
                  </div>
                  <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                    Institutional response deadline: <strong style={{ color: 'var(--text-secondary)' }}>{app.deficiencies[0].rectificationDeadline}</strong>
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
                    className="btn-dark"
                    onClick={() => onSelectApplication(app)}
                    style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: '2px' }}
                  >
                    <FileText size={13} /> Inspect Dossier
                  </button>
                  <button 
                    className="btn-dark"
                    onClick={() => onOpenCaseSummary(app)}
                    style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: '2px' }}
                  >
                    <FileCheck size={13} /> Case Summary
                  </button>

                  {/* Reassign Region (Bureau Head only) */}
                  {canReassign && (
                    <button
                      className="btn-dark"
                      onClick={() => {
                        setReassignModalApp(app);
                        setTargetRegion(app.region === 'WRO' ? 'SRO' : 'WRO');
                      }}
                      title="Reassign application to another AICTE Regional Office to balance workload"
                      id={`btn-reassign-${app.id}`}
                      style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: '2px' }}
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
                        className="btn-dark"
                        onClick={() => handleOpenDeficiency(app)}
                        title="Issue Deficiency Memo and return to institution for clarifications"
                        id={`btn-revert-${app.id}`}
                        style={{ color: '#b45309', borderColor: '#fde68a', padding: '6px 12px', fontSize: '0.78rem', borderRadius: '2px' }}
                      >
                        <RotateCcw size={13} /> Revert for Deficiencies
                      </button>
                    ) : (
                      <button 
                        className="btn-dark"
                        disabled
                        style={{ opacity: 0.4, cursor: 'not-allowed', padding: '6px 12px', fontSize: '0.78rem', borderRadius: '2px' }}
                        title={getRestrictionReason(Permission.REVERT_WITH_DEFICIENCY)}
                      >
                        <RotateCcw size={13} /> Revert for Deficiencies
                      </button>
                    )
                  )}

                  {/* Advance to next stage button */}
                  {app.stageIndex < stages.length - 1 ? (
                    canAdvance ? (
                      <button 
                        className="btn-mint"
                        onClick={() => onProgressStage(app.id)}
                        id={`btn-progress-${app.id}`}
                        style={{ padding: '7px 14px', fontSize: '0.78rem', borderRadius: '2px' }}
                      >
                        <span>Approve & Progress to {stages[app.stageIndex + 1]}</span>
                        <ArrowRight size={13} />
                      </button>
                    ) : (
                      <button 
                        className="btn-dark"
                        disabled
                        style={{ opacity: 0.4, cursor: 'not-allowed', padding: '7px 14px', fontSize: '0.78rem', borderRadius: '2px' }}
                        title={getRestrictionReason(Permission.ADVANCE_APPLICATION_STAGE)}
                      >
                        <span>Approve & Progress to {stages[app.stageIndex + 1]}</span>
                        <ArrowRight size={13} />
                      </button>
                    )
                  ) : (
                    <span className="status-pill status-compliant" style={{ padding: '6px 12px', borderRadius: '2px' }}>
                      <CheckCircle size={13} /> Final Order Issued
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
        <div className="modal-backdrop-clean" onClick={(e) => { if (e.target === e.currentTarget) setDeficiencyModalApp(null); }}>
          <div className="modal-sheet-clean" style={{ maxWidth: '580px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <div className="page-overline" style={{ color: 'var(--amber-500)' }}>REGIONAL SCRUTINY ACTION</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
                  Return with Deficiency Memo
                </h3>
              </div>
              <button 
                className="btn-dark"
                onClick={() => setDeficiencyModalApp(null)}
                style={{ width: '32px', height: '32px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitDeficiency}>
              <div style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                padding: '12px 14px',
                borderRadius: '2px',
                marginBottom: '16px',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)'
              }}>
                <div><strong>Application:</strong> <span style={{ color: 'var(--text-primary)' }}>{deficiencyModalApp.id}</span></div>
                <div><strong>Institution:</strong> <span style={{ color: 'var(--text-primary)' }}>{deficiencyModalApp.instituteName}</span></div>
                <div><strong>Current Stage:</strong> <span style={{ color: 'var(--text-primary)' }}>{deficiencyModalApp.currentStage}</span></div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Applicable APH Regulation / Clause:
                </label>
                <select 
                  style={{
                    width: '100%',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    borderRadius: '2px',
                    padding: '8px 12px',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
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

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Detailed Deficiency Description & Rectification Requirement:
                </label>
                <textarea 
                  style={{
                    width: '100%',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    borderRadius: '2px',
                    padding: '10px 12px',
                    fontSize: '0.82rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                  value={deficiencyDescription}
                  onChange={(e) => setDeficiencyDescription(e.target.value)}
                  placeholder="Specify exact shortfall, missing documents, or physical deficiencies requiring compliance..."
                  rows={4}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Prescribed Rectification Window:
                </label>
                <select 
                  style={{
                    width: '100%',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    borderRadius: '2px',
                    padding: '8px 12px',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
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
                  className="btn-dark"
                  onClick={() => setDeficiencyModalApp(null)}
                  style={{ borderRadius: '2px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-dark"
                  style={{ color: '#b45309', borderColor: '#fde68a', borderRadius: '2px' }}
                >
                  <Send size={14} /> Issue Deficiency Memo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Institution Respond to Deficiency Modal */}
      {respondModalApp && (
        <div className="modal-backdrop-clean" onClick={(e) => { if (e.target === e.currentTarget) setRespondModalApp(null); }}>
          <div className="modal-sheet-clean" style={{ maxWidth: '580px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <div className="page-overline">INSTITUTIONAL COMPLIANCE</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
                  Submit Rectification Response
                </h3>
              </div>
              <button 
                className="btn-dark"
                onClick={() => setRespondModalApp(null)}
                style={{ width: '32px', height: '32px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '2px' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitResponse}>
              <div style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                padding: '12px 14px',
                borderRadius: '2px',
                marginBottom: '16px',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)'
              }}>
                <div><strong>Application:</strong> <span style={{ color: 'var(--text-primary)' }}>{respondModalApp.id}</span></div>
                <div><strong>Recorded Discrepancy:</strong> <span style={{ color: 'var(--text-primary)' }}>{respondModalApp.deficiencies?.[0]?.description}</span></div>
                <div><strong>Norm Reference:</strong> <span style={{ color: 'var(--text-primary)' }}>{respondModalApp.deficiencies?.[0]?.clause}</span></div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Institutional Clarification & Compliance Statement:
                </label>
                <textarea 
                  style={{
                    width: '100%',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    borderRadius: '2px',
                    padding: '10px 12px',
                    fontSize: '0.82rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Attached Evidence Document (PDF):
                </label>
                <input 
                  type="text"
                  style={{
                    width: '100%',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    borderRadius: '2px',
                    padding: '8px 12px',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                  value={responseFile}
                  onChange={(e) => setResponseFile(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  className="btn-dark"
                  onClick={() => setRespondModalApp(null)}
                  style={{ borderRadius: '2px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-mint"
                  style={{ borderRadius: '2px' }}
                >
                  <Send size={14} /> Submit for Re-Scrutiny
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reassign Region Modal (Bureau Head) */}
      {reassignModalApp && (
        <div className="modal-backdrop-clean" onClick={(e) => { if (e.target === e.currentTarget) setReassignModalApp(null); }}>
          <div className="modal-sheet-clean" style={{ maxWidth: '540px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <div className="page-overline">HEADQUARTERS WORKLOAD BALANCING</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
                  Reassign Regional Jurisdiction
                </h3>
              </div>
              <button 
                className="btn-dark"
                onClick={() => setReassignModalApp(null)}
                style={{ width: '32px', height: '32px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '2px' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmReassign}>
              <div style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                padding: '12px 14px',
                borderRadius: '2px',
                marginBottom: '16px',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)'
              }}>
                <div><strong>Application:</strong> <span style={{ color: 'var(--text-primary)' }}>{reassignModalApp.id}</span></div>
                <div><strong>Institution:</strong> <span style={{ color: 'var(--text-primary)' }}>{reassignModalApp.instituteName}</span></div>
                <div><strong>Current Region:</strong> <span style={{ color: 'var(--text-primary)' }}>{reassignModalApp.region}</span></div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Target AICTE Regional Office:
                </label>
                <select 
                  style={{
                    width: '100%',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    borderRadius: '2px',
                    padding: '8px 12px',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
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
                  className="btn-dark"
                  onClick={() => setReassignModalApp(null)}
                  style={{ borderRadius: '2px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-mint"
                  style={{ borderRadius: '2px' }}
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
