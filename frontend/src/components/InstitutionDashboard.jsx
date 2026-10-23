import React from 'react';
import { 
  Building2, 
  GraduationCap, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  UploadCloud, 
  FileText, 
  ShieldCheck, 
  Flame, 
  ArrowRight,
  Calendar,
  FileCheck
} from 'lucide-react';
import { WORKFLOW_ROUTES } from '../data/mockData';

export function InstitutionDashboard({ 
  applications, 
  undertakings, 
  leaseDocs, 
  notifications,
  onNavigateTab,
  onOpenCaseSummary,
  onOpenUploadUndertaking,
  onOpenUploadLease,
  currentUser 
}) {
  const myApp = applications[0] || {
    id: 'APP-2026-WRO-1049',
    instituteName: 'Maharashtra Institute of Technology & Research',
    type: 'Increase in Intake (AI & ML, Data Science)',
    route: 'SCRUTINY_EVC',
    currentStage: 'EVC Scheduling',
    stageIndex: 2,
    daysInCurrentStage: 9,
    slaDays: 5,
    status: 'Overdue'
  };

  const routeInfo = WORKFLOW_ROUTES[myApp.route] || WORKFLOW_ROUTES.SCRUTINY_EVC;
  const criticalDoc = leaseDocs.find(d => d.daysRemaining <= 90);
  const pendingUndertaking = undertakings.find(u => u.status !== 'Verified & Closed');

  return (
    <div className="institution-dashboard">
      {/* Institutional Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-info" style={{ fontSize: '0.78rem' }}>
              <GraduationCap size={14} /> AICTE Institutional Self-Service Portal
            </span>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Permanent AICTE ID: <strong>{currentUser?.institutionId || '1-748920141'}</strong> • Region: <strong>WRO (Pune)</strong>
            </span>
          </div>
          <h2 style={{ fontSize: '1.45rem', color: '#ffffff' }}>
            {currentUser?.instituteName || 'Maharashtra Institute of Technology & Research'}
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', marginTop: '4px' }}>
            Welcome back, <strong>{currentUser?.officer || 'Dr. Meera Sen'}</strong>. Track your institutional approvals, submit compliance proofs, and monitor document validity.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => onOpenCaseSummary(myApp)}
          >
            <FileText size={14} /> View Case Summary Dossier
          </button>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => onNavigateTab('applications')}
          >
            <span>My Application Tracker</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Urgent Action Banner if Document Critical */}
      {criticalDoc && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.15), rgba(245, 158, 11, 0.15))',
          border: '1px solid rgba(239, 68, 68, 0.45)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f87171'
            }}>
              <Flame size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#f87171', fontSize: '0.9rem' }}>
                Action Required: {criticalDoc.docType} Expiring in {criticalDoc.daysRemaining} Days
              </div>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '2px' }}>
                Document No: <strong>{criticalDoc.docNumber}</strong> (Expires: {criticalDoc.expiryDate}). Please upload certified renewed copy to avoid regulatory hold on your approval.
              </div>
            </div>
          </div>

          <button 
            className="btn btn-warning btn-sm"
            onClick={() => onOpenUploadLease(criticalDoc)}
            id="btn-inst-upload-lease"
          >
            <UploadCloud size={14} /> Upload Renewed Document
          </button>
        </div>
      )}

      {/* 4 KPI Cards for Institution */}
      <div className="kpi-grid" style={{ marginBottom: '24px' }}>
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Active Application</span>
            <div className="kpi-icon-wrap" style={{ color: '#38bdf8' }}>
              <FileText size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ fontSize: '1.4rem' }}>{myApp.id}</div>
          <div className="kpi-subtext">Current Stage: <strong>{myApp.currentStage}</strong></div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Prescribed Route</span>
            <div className="kpi-icon-wrap" style={{ color: '#c084fc' }}>
              <Building2 size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ fontSize: '1.3rem' }}>{routeInfo.title}</div>
          <div className="kpi-subtext">{myApp.type}</div>
        </div>

        <div className="kpi-card alert-amber">
          <div className="kpi-header">
            <span className="kpi-title" style={{ color: '#fbbf24' }}>Active Undertaking</span>
            <div className="kpi-icon-wrap" style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#fbbf24', fontSize: '1.4rem' }}>
            {pendingUndertaking ? `${pendingUndertaking.daysRemaining} Days Left` : 'All Cleared'}
          </div>
          <div className="kpi-subtext" style={{ color: '#fde68a' }}>
            {pendingUndertaking ? `Due: ${pendingUndertaking.dueDate}` : 'Complied'}
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Deficiencies</span>
            <div className="kpi-icon-wrap" style={{ color: '#34d399' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#34d399', fontSize: '1.4rem' }}>0 Pending</div>
          <div className="kpi-subtext">Preliminary Scrutiny Passed</div>
        </div>
      </div>

      {/* Main Panel: Application Stage Progression Stepper */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">
              <Clock size={18} color="#38bdf8" /> Milestone Timeline & Stage Progression
            </h3>
            <p style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
              Live statutory tracking under AICTE Approval Process Handbook (APH)
            </p>
          </div>
          <div className="sla-pill sla-normal">
            <span>Applied: {myApp.appliedDate}</span>
          </div>
        </div>

        <div className="progress-stepper" style={{ margin: '30px 20px 40px 20px' }}>
          <div className="stepper-track" />
          {routeInfo.stages.map((st, i) => {
            const isCompleted = i < myApp.stageIndex;
            const isActive = i === myApp.stageIndex;
            return (
              <div 
                key={st}
                className={`step-node ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
              >
                <div className="step-circle">{isCompleted ? '✓' : i + 1}</div>
                <span className="step-title">{st}</span>
              </div>
            );
          })}
        </div>

        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.86rem', color: '#ffffff' }}>
              Current Status: Awaiting EVC Expert Committee Allocation by WRO
            </div>
            <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '2px' }}>
              Preliminary Scrutiny has been successfully verified. AICTE Western Regional Office is constituting a 3-member Expert Committee.
            </div>
          </div>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigateTab('applications')}
          >
            Track Application Details →
          </button>
        </div>
      </div>

      {/* Two columns: Conditional Undertakings & Document Deadlines */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        
        {/* Undertakings Box */}
        <div className="panel" style={{ margin: 0 }}>
          <div className="panel-header">
            <div>
              <h3 className="panel-title" style={{ fontSize: '1.05rem' }}>
                <ShieldCheck size={18} color="#38bdf8" /> Time-Bound Undertakings
              </h3>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                Conditions attached to previous AICTE approvals
              </p>
            </div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigateTab('undertakings')}
            >
              View All
            </button>
          </div>

          {undertakings.map(u => (
            <div key={u.id} style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '14px',
              marginBottom: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.82rem' }}>{u.id}</span>
                <span className={`badge ${u.status === 'Submitted' ? 'badge-warning' : 'badge-info'}`}>
                  {u.status}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#e2e8f0' }}>{u.condition}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                  Deadline: <strong>{u.dueDate}</strong> ({u.daysRemaining} days left)
                </span>
                {u.status !== 'Submitted' && (
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => onOpenUploadUndertaking(u)}
                    id={`btn-inst-upload-und-${u.id}`}
                  >
                    <UploadCloud size={13} /> Upload Proof
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Documents Box */}
        <div className="panel" style={{ margin: 0 }}>
          <div className="panel-header">
            <div>
              <h3 className="panel-title" style={{ fontSize: '1.05rem' }}>
                <FileCheck size={18} color="#fbbf24" /> Land & Safety Document Expiry Radar
              </h3>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                Continuous statutory document validity tracking
              </p>
            </div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigateTab('documents')}
            >
              View All
            </button>
          </div>

          {leaseDocs.map(d => {
            const isCritical = d.daysRemaining <= 90;
            return (
              <div key={d.id} style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: `1px solid ${isCritical ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-subtle)'}`,
                borderRadius: '8px',
                padding: '14px',
                marginBottom: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#f8fafc' }}>{d.docType}</div>
                  <span className={`badge ${isCritical ? 'badge-critical' : 'badge-success'}`}>
                    {isCritical ? `${d.daysRemaining}d Left` : 'Active'}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>No: {d.docNumber} • Expires: {d.expiryDate}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <span style={{ fontSize: '0.72rem', color: isCritical ? '#fca5a5' : '#94a3b8' }}>
                    {isCritical ? 'Mandatory renewal required' : 'Verified compliance'}
                  </span>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => onOpenUploadLease(d)}
                  >
                    <UploadCloud size={13} /> Upload Renewal
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
