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
  FileCheck,
  AlertCircle,
  Plus
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
      {/* 1. Page Header (Modern Dark Reference Style) */}
      <div className="page-header-row">
        <div>
          <div className="page-overline">
            OVERVIEW
          </div>
          <h1 className="page-title">
            Dashboard
          </h1>
          <p className="page-subtitle">
            {currentUser?.instituteName || 'Maharashtra Institute of Technology & Research'} • AICTE ID: {currentUser?.institutionId || '1-748920141'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            className="btn-dark"
            onClick={() => onOpenCaseSummary(myApp)}
          >
            <FileText size={15} />
            <span>Case Dossier</span>
          </button>
          
          <button 
            className="btn-mint"
            onClick={() => onNavigateTab('documents')}
            id="btn-upload-documents-top"
          >
            <UploadCloud size={16} strokeWidth={2.5} />
            <span>Upload Documents</span>
          </button>
        </div>
      </div>

      {/* 2. 4-Card Metric Grid */}
      <div className="metric-grid">
        {/* Card 1: Application Status */}
        <div className="metric-card">
          <div className="metric-card-left">
            <span className="metric-label">CURRENT STAGE</span>
            <span className="metric-value" style={{ fontSize: '1.75rem', marginTop: '6px' }}>
              {myApp.currentStage}
            </span>
          </div>
          <div className="metric-icon-wrap" style={{ color: 'var(--text-muted)' }}>
            <FileText size={32} strokeWidth={1.8} />
          </div>
        </div>

        {/* Card 2: SLA Status */}
        <div className="metric-card">
          <div className="metric-card-left">
            <span className="metric-label">STAGE DURATION</span>
            <span className="metric-value">
              {myApp.daysInCurrentStage}<span style={{ fontSize: '1.1rem', color: 'var(--text-dim)' }}>/{myApp.slaDays}d</span>
            </span>
          </div>
          <div className="metric-icon-wrap" style={{ color: myApp.daysInCurrentStage > myApp.slaDays ? 'var(--ruby-500)' : 'var(--mint-500)' }}>
            {myApp.daysInCurrentStage > myApp.slaDays ? (
              <AlertCircle size={32} strokeWidth={1.8} />
            ) : (
              <ShieldCheck size={32} strokeWidth={1.8} />
            )}
          </div>
        </div>

        {/* Card 3: Active Undertakings */}
        <div className="metric-card">
          <div className="metric-card-left">
            <span className="metric-label">PENDING UNDERTAKINGS</span>
            <span className="metric-value">{undertakings.filter(u => u.status !== 'Verified & Closed').length}</span>
          </div>
          <div className="metric-icon-wrap" style={{ color: 'var(--amber-400)' }}>
            <AlertTriangle size={32} strokeWidth={1.8} />
          </div>
        </div>

        {/* Card 4: Document Expiry */}
        <div className="metric-card">
          <div className="metric-card-left">
            <span className="metric-label">DOCUMENT VALIDITY</span>
            <span className="metric-value" style={{ color: criticalDoc ? 'var(--ruby-600)' : 'var(--text-main)' }}>
              {criticalDoc ? `${criticalDoc.daysRemaining}d` : 'Valid'}
            </span>
          </div>
          <div className="metric-icon-wrap" style={{ color: criticalDoc ? 'var(--ruby-600)' : 'var(--emerald-600)' }}>
            <FileCheck size={32} strokeWidth={1.8} />
          </div>
        </div>
      </div>

      {/* Critical Alert Banner if Deed or Fire NOC expiring */}
      {criticalDoc && (
        <div style={{
          background: '#fff1f2',
          border: '1px solid #fecdd3',
          borderRadius: '2px',
          padding: '14px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertCircle size={20} color="var(--ruby-600)" />
            <div>
              <div style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.88rem' }}>
                Urgent: {criticalDoc.docType} expires in {criticalDoc.daysRemaining} days!
              </div>
              <div style={{ fontSize: '0.76rem', color: '#7f1d1d' }}>
                Document Ref: {criticalDoc.docNumber}. Per APH 2024–27 Chapter I, expired deeds freeze Extension of Approval (EoA).
              </div>
            </div>
          </div>

          <button 
            className="btn-mint"
            style={{ padding: '7px 14px', fontSize: '0.78rem' }}
            onClick={() => onNavigateTab('documents')}
          >
            Upload Renewal
          </button>
        </div>
      )}

      {/* 3. Section Header: RECENT DOCUMENTS & View all -> */}
      <div className="section-header-clean">
        <span className="section-label">RECENT DOCUMENTS</span>
        <button 
          className="section-link"
          onClick={() => onNavigateTab('documents')}
          id="btn-view-all-docs"
        >
          <span>View all</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Documents Table or Empty State */}
      {leaseDocs.length === 0 ? (
        <div className="empty-state-box">
          <FileText size={36} color="var(--text-dim)" />
          <p className="empty-state-text">
            No documents yet. Upload your registered 30-year lease deed, building safety certificate, or fire NOC to start verifying.
          </p>
          <button 
            className="btn-dark"
            onClick={() => onNavigateTab('documents')}
          >
            <UploadCloud size={15} />
            <span>Upload documents</span>
          </button>
        </div>
      ) : (
        <div className="table-wrap-clean" style={{ marginBottom: '32px' }}>
          <table className="table-clean">
            <thead>
              <tr>
                <th>Document Type</th>
                <th>Registration / Ref No</th>
                <th>Jurisdiction</th>
                <th>Expiry Date</th>
                <th>Days Remaining</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaseDocs.map(doc => {
                const isUrgent = doc.daysRemaining <= 90;
                return (
                  <tr key={doc.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{doc.docType}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>{doc.institute}</div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {doc.docNumber}
                      </span>
                    </td>
                    <td>
                      <span className="status-pill purple">{doc.region}</span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {doc.expiryDate}
                    </td>
                    <td>
                      <span style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: isUrgent ? 'var(--ruby-600)' : 'var(--emerald-600)'
                      }}>
                        {doc.daysRemaining} days left
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${
                        doc.severity === 'critical' ? 'ruby' :
                        doc.severity === 'warning' ? 'amber' : 'mint'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-dark"
                        style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '2px' }}
                        onClick={() => onNavigateTab('documents')}
                      >
                        {isUrgent ? 'Renew Now' : 'Inspect'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. Active Approval Stage Pipeline Stepper */}
      <div className="section-header-clean">
        <span className="section-label">ACTIVE APPROVAL STAGE PIPELINE</span>
        <button 
          className="section-link"
          onClick={() => onNavigateTab('applications')}
        >
          <span>Track Application</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="panel-clean" style={{ borderRadius: '2px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1rem' }}>
              Application ID: {myApp.id}
            </span>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Route: <strong>{routeInfo.title}</strong> • Stage {myApp.stageIndex} of {routeInfo.stages.length}
            </div>
          </div>

          <span className={`status-pill ${
            myApp.status === 'Approved' ? 'mint' :
            myApp.daysInCurrentStage > myApp.slaDays ? 'ruby' : 'cyan'
          }`}>
            {myApp.daysInCurrentStage > myApp.slaDays ? `SLA Breached (${myApp.daysInCurrentStage}d)` : myApp.status}
          </span>
        </div>

        {/* Linear Stepper */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${routeInfo.stages.length}, 1fr)`,
          gap: '10px'
        }}>
          {routeInfo.stages.map((st, idx) => {
            const isCompleted = idx < myApp.stageIndex;
            const isCurrent = idx === myApp.stageIndex;
            return (
              <div 
                key={st}
                style={{
                  background: isCurrent ? '#0f172a' : isCompleted ? '#ffffff' : '#f8fafc',
                  border: isCurrent ? '1px solid #0f172a' : isCompleted ? '1px solid #cbd5e1' : '1px solid var(--border-subtle)',
                  borderRadius: '2px',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  boxShadow: isCurrent ? '0 2px 4px rgba(15, 23, 42, 0.15)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: isCurrent ? '#94a3b8' : isCompleted ? 'var(--emerald-600)' : 'var(--text-dim)'
                  }}>
                    STEP 0{idx + 1}
                  </span>
                  {isCompleted && <CheckCircle2 size={13} color="var(--emerald-600)" />}
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: isCurrent ? 700 : 600,
                  color: isCurrent ? '#ffffff' : isCompleted ? 'var(--text-main)' : 'var(--text-dim)'
                }}>
                  {st}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
