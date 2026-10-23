import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Clock, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Users, 
  History, 
  CheckCircle2, 
  ArrowRight,
  Flame,
  FileCheck
} from 'lucide-react';
import { WORKFLOW_ROUTES } from '../data/mockData';

export function ApplicationDetailsModal({ 
  application, 
  onClose, 
  onProgressStage,
  onOpenCaseSummary 
}) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!application) return null;

  const routeInfo = WORKFLOW_ROUTES[application.route] || WORKFLOW_ROUTES.SCRUTINY_EVC;
  const isOverdue = application.daysInCurrentStage > application.slaDays;

  return (
    <div className="modal-backdrop-clean">
      <div className="modal-sheet-clean" style={{ maxWidth: '880px', padding: '28px' }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '16px',
          marginBottom: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {application.id}
              </span>
              <span className="status-pill purple">{application.region} Region</span>
              <span className="status-pill" style={{ background: `${routeInfo.color}14`, color: routeInfo.color, border: `1px solid ${routeInfo.color}35`, borderRadius: '2px' }}>
                {routeInfo.title}
              </span>
            </div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: '4px 0 2px 0' }}>{application.instituteName}</h3>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Permanent ID: {application.instituteId} • {application.city}, {application.state} • Officer: {application.assignedOfficer}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '2px',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: isOverdue ? '#fff1f2' : '#f0fdf4',
                color: isOverdue ? '#b91c1c' : '#15803d',
                border: `1px solid ${isOverdue ? '#fecdd3' : '#bbf7d0'}`
              }}
            >
              <Clock size={13} /> {application.daysInCurrentStage} / {application.slaDays} Days
            </div>
            <button className="btn-icon-sq" onClick={onClose} style={{ borderRadius: '2px' }}>
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {[
            { id: 'overview', label: 'Overview & Route', icon: FileText },
            { id: 'deficiencies', label: `Deficiencies (${application.deficiencies?.length || 0})`, icon: AlertTriangle },
            { id: 'evc', label: 'EVC Inspection', icon: Users },
            { id: 'undertakings', label: `Undertakings (${application.undertakings?.length || 0})`, icon: ShieldCheck },
            { id: 'docs', label: `Documents (${application.documents?.length || 0})`, icon: FileCheck },
            { id: 'audit', label: `Audit Log (${application.auditTrail?.length || 0})`, icon: History },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={isActive ? "btn-mint" : "btn-dark"}
                style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: '2px' }}
              >
                <Icon size={13} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div style={{ minHeight: '280px' }}>
          {activeTab === 'overview' && (
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '14px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                padding: '16px',
                borderRadius: '2px',
                marginBottom: '16px',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)'
              }}>
                <div><strong>Application Category:</strong> {application.type}</div>
                <div><strong>Date of Lodgement:</strong> {application.appliedDate}</div>
                <div><strong>Current Processing Stage:</strong> <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{application.currentStage}</span></div>
                <div><strong>Current Stage Date:</strong> {application.currentStageDate}</div>
                <div><strong>Processing Route:</strong> {routeInfo.title}</div>
                <div><strong>Current Status:</strong> {application.status}</div>
                <div><strong>Escalation Tier:</strong> Level {application.escalationLevel || 0}</div>
                <div><strong>Assigned Regional Officer:</strong> {application.assignedOfficer}</div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Route Stage Progression</h4>
                <div className="progress-stepper">
                  <div className="stepper-track" />
                  {routeInfo.stages.map((st, i) => (
                    <div 
                      key={st}
                      className={`step-node ${i < application.stageIndex ? 'completed' : ''} ${i === application.stageIndex ? 'active' : ''}`}
                    >
                      <div className="step-circle">{i < application.stageIndex ? '✓' : i + 1}</div>
                      <span className="step-title">{st}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deficiencies' && (
            <div>
              {application.deficiencies && application.deficiencies.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {application.deficiencies.map((d, idx) => (
                    <div 
                      key={idx}
                      style={{
                        background: '#fffbeb',
                        border: '1px solid #fde68a',
                        borderRadius: '2px',
                        padding: '14px',
                        fontSize: '0.82rem'
                      }}
                    >
                      <div style={{ fontWeight: 700, color: '#b45309', marginBottom: '4px' }}>
                        {d.id || `DEF-0${idx+1}`}: {d.clause}
                      </div>
                      <div style={{ color: 'var(--text-secondary)' }}>{d.description}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                        Compliance Deadline: <strong>{d.rectificationDeadline}</strong> • Status: {d.resolved ? 'Resolved' : 'Pending Institutional Response'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '36px', color: '#15803d' }}>
                  <CheckCircle2 size={36} style={{ margin: '0 auto 8px auto' }} />
                  <div>No deficiencies recorded for this application.</div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'evc' && (
            <div>
              {application.evcDetails?.required ? (
                <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{
                    background: 'var(--bg-elevated)',
                    padding: '16px',
                    borderRadius: '2px',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)'
                  }}>
                    <div><strong>EVC Requirement:</strong> Mandatory Physical/Hybrid Inspection</div>
                    <div><strong>Scheduled Date:</strong> {application.evcDetails.visitDate || 'Awaiting Scheduling'}</div>
                    <div><strong>Inspection Outcome:</strong> {application.evcDetails.outcome || 'Pending Visit / Report'}</div>
                    <div><strong>Report Uploaded:</strong> {application.evcDetails.reportUploaded ? 'Yes (Verified)' : 'No (Pending)'}</div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  <div>This application follows <strong>{routeInfo.title}</strong> and does not require an Expert Visit Committee (EVC).</div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'undertakings' && (
            <div>
              {application.undertakings && application.undertakings.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {application.undertakings.map((u, i) => (
                    <div key={i} style={{
                      background: 'var(--bg-elevated)',
                      padding: '14px',
                      borderRadius: '2px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.82rem'
                    }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{u.id} - {u.prescribedClause}</div>
                      <div style={{ marginTop: '2px', color: 'var(--text-secondary)' }}>{u.condition}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Stipulated Due Date: <strong>{u.dueDate}</strong> • Status: <strong>{u.status}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  <div>No conditional undertakings recorded.</div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'docs' && (
            <div>
              {application.documents && application.documents.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {application.documents.map((d, i) => (
                    <div key={i} style={{
                      background: 'var(--bg-elevated)',
                      padding: '14px',
                      borderRadius: '2px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.82rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{d.type}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Doc No: {d.documentNo} • Issued: {d.issuedDate}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, color: d.status === 'Critical' ? 'var(--ruby-600)' : 'var(--emerald-600)' }}>
                          Expires: {d.expiryDate}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{d.daysToExpiry} days remaining</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  <div>No document records found.</div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'audit' && (
            <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(application.auditTrail || []).map((log, i) => (
                  <div key={i} style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    padding: '8px 12px',
                    borderRadius: '2px',
                    fontSize: '0.76rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', marginRight: '8px' }}>{log.date}</span>
                      <strong style={{ color: 'var(--text-main)' }}>{log.actor}:</strong> <span style={{ color: 'var(--text-secondary)' }}>{log.action}</span>
                    </div>
                    <span style={{ fontFamily: 'monospace', color: '#059669', fontSize: '0.7rem' }}>
                      {log.hash}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '16px',
          marginTop: '20px'
        }}>
          <button 
            className="btn-dark"
            onClick={() => onOpenCaseSummary(application)}
            style={{ borderRadius: '2px' }}
          >
            <FileText size={14} /> Case Dossier
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            {application.stageIndex < routeInfo.stages.length - 1 && (
              <button 
                className="btn-mint"
                onClick={() => {
                  onProgressStage(application.id);
                  onClose();
                }}
                style={{ borderRadius: '2px' }}
              >
                <span>Advance to {routeInfo.stages[application.stageIndex + 1]}</span>
                <ArrowRight size={14} />
              </button>
            )}
            <button className="btn-dark" onClick={onClose} style={{ borderRadius: '2px' }}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
