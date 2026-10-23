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
  FileCheck
} from 'lucide-react';
import { WORKFLOW_ROUTES } from '../data/mockData';

export function WorkflowAutomation({ 
  applications, 
  onSelectApplication, 
  onProgressStage,
  onRevertWithDeficiency,
  onOpenCaseSummary,
  currentRole
}) {
  const [selectedRouteFilter, setSelectedRouteFilter] = useState('ALL');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Deficiencies modal state
  const [deficiencyModalApp, setDeficiencyModalApp] = useState(null);
  const [deficiencyClause, setDeficiencyClause] = useState('APH Clause 6.4 (Library / Labs)');
  const [deficiencyDescription, setDeficiencyDescription] = useState('');
  const [cureDays, setCureDays] = useState(7);

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

  return (
    <div className="workflow-automation">
      {/* Top Banner explaining APH Routing Engine */}
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
            End-to-End Approval Stage Automation & Routing Engine
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
            Automated routing across standard Scrutiny, Expert Visit Committees (EVC), and Standing Appellate Committee (SAC) with authorized returns and state transitions.
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

      {/* Filter Toolbar */}
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

          <select
            value={selectedRegionFilter}
            onChange={(e) => setSelectedRegionFilter(e.target.value)}
            className="form-select"
            style={{ width: '160px' }}
          >
            <option value="ALL">All Regions</option>
            <option value="WRO">WRO (Mumbai)</option>
            <option value="NRO">NRO (Kanpur)</option>
            <option value="SRO">SRO (Chennai)</option>
            <option value="NWRO">NWRO (Chandigarh)</option>
            <option value="CRO">CRO (Bhopal)</option>
            <option value="ERO">ERO (Kolkata)</option>
            <option value="SCRO">SCRO (Hyderabad)</option>
            <option value="SWRO">SWRO (Bengaluru)</option>
          </select>
        </div>

        <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
          Showing <strong>{filteredApps.length}</strong> active applications
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
                  <div style={{ fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={14} /> Active Discrepancy / Deficiency Memo Recorded
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
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Revert / Return button */}
                  {app.stageIndex < stages.length - 1 && (
                    <button 
                      className="btn btn-warning btn-sm"
                      onClick={() => handleOpenDeficiency(app)}
                      title="Issue Deficiency Memo and return to institution for clarifications"
                    >
                      <RotateCcw size={14} /> Revert for Deficiencies
                    </button>
                  )}

                  {/* Advance to next stage button */}
                  {app.stageIndex < stages.length - 1 ? (
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => onProgressStage(app.id)}
                      id={`btn-progress-${app.id}`}
                    >
                      <span>Approve & Progress to {stages[app.stageIndex + 1]}</span>
                      <ArrowRight size={14} />
                    </button>
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

      {/* Deficiency Revert Modal */}
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
                <label className="form-label">Detailed Deficiency Description & Rectification Requirements:</label>
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

              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                color: '#cbd5e1',
                marginBottom: '20px'
              }}>
                Issuing this deficiency memo will automatically log a cryptographic entry in the digital audit trail, dispatch an automated communication to the applicant institution, and initiate a countdown clock.
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
    </div>
  );
}
