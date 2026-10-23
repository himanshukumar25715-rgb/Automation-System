import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  FileCheck, 
  UserCheck, 
  MapPin, 
  Send,
  UploadCloud,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { INITIAL_EXPERTS_POOL } from '../data/mockData';

export function EvcHub({ 
  applications, 
  onScheduleEvc, 
  onSubmitEvcReport,
  onOpenApplicationDossier,
  currentRole 
}) {
  const [selectedAppForSchedule, setSelectedAppForSchedule] = useState(null);
  const [selectedAppForReport, setSelectedAppForReport] = useState(null);

  // Scheduling Form State
  const [visitDate, setVisitDate] = useState('2026-11-02');
  const [visitMode, setVisitMode] = useState('Physical On-Site Inspection');
  const [selectedExperts, setSelectedExperts] = useState(['EXP-101', 'EXP-102', 'EXP-106']);

  // Report Submission State
  const [infraScore, setInfraScore] = useState(88);
  const [facultyScore, setFacultyScore] = useState(82);
  const [labScore, setLabScore] = useState(90);
  const [evcOutcome, setEvcOutcome] = useState('Recommended');
  const [evcRemarks, setEvcRemarks] = useState('All laboratories, lecture halls, and barrier-free amenities found compliant as per APH 2024-27 norms.');

  // EVC Applications Filtering
  const evcPendingScheduling = applications.filter(a => 
    a.evcDetails?.required && !a.evcDetails?.scheduled
  );

  const evcScheduledAndActive = applications.filter(a => 
    a.evcDetails?.required && a.evcDetails?.scheduled && !a.evcDetails?.reportUploaded
  );

  const evcCompleted = applications.filter(a => 
    a.evcDetails?.required && a.evcDetails?.reportUploaded
  );

  const handleOpenScheduleModal = (app) => {
    setSelectedAppForSchedule(app);
  };

  const handleConfirmSchedule = (e) => {
    e.preventDefault();
    if (!selectedAppForSchedule) return;
    onScheduleEvc(selectedAppForSchedule.id, {
      visitDate,
      visitMode,
      committee: selectedExperts
    });
    setSelectedAppForSchedule(null);
  };

  const handleOpenReportModal = (app) => {
    setSelectedAppForReport(app);
  };

  const handleConfirmReport = (e) => {
    e.preventDefault();
    if (!selectedAppForReport) return;
    onSubmitEvcReport(selectedAppForReport.id, {
      outcome: evcOutcome,
      remarks: evcRemarks,
      infraScore,
      facultyScore,
      labScore
    });
    setSelectedAppForReport(null);
  };

  return (
    <div className="evc-hub">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div className="page-overline">INSPECTION HUB & COMMITTEE MANAGEMENT</div>
          <h1 className="page-title">EVC Scheduling & Panel Allocation</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '6px 0 0 0' }}>
            Automated queuing of scrutiny-cleared applications, conflict-of-interest checks, and 48-hour digital report countdowns.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="status-pill status-warning" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
            <Clock size={13} /> Scheduling SLA: 5 Days
          </div>
          <div className="status-pill status-compliant" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
            <Clock size={13} /> Report Window: 48 Hours
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="metric-grid" style={{ marginBottom: '28px' }}>
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Awaiting Scheduling</span>
            <div className="metric-icon-wrap" style={{ color: 'var(--amber-500)' }}>
              <Clock size={20} />
            </div>
          </div>
          <div className="metric-value">{evcPendingScheduling.length}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Active / Scheduled</span>
            <div className="metric-icon-wrap" style={{ color: 'var(--mint-500)' }}>
              <Calendar size={20} />
            </div>
          </div>
          <div className="metric-value">{evcScheduledAndActive.length}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Completed & Signed</span>
            <div className="metric-icon-wrap" style={{ color: 'var(--mint-500)' }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="metric-value">{evcCompleted.length}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Certified Experts</span>
            <div className="metric-icon-wrap" style={{ color: 'var(--sky-400)' }}>
              <Users size={20} />
            </div>
          </div>
          <div className="metric-value">{INITIAL_EXPERTS_POOL.length}</div>
        </div>
      </div>

      {/* Grid: Pending Scheduling Queue & Active Visits */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        
        {/* Section 1: EVC Pending Scheduling Queue */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '2px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} style={{ color: 'var(--amber-500)' }} /> Awaiting Panel Allocation ({evcPendingScheduling.length})
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Scrutiny-cleared applications awaiting committee dispatch
              </p>
            </div>
          </div>

          {evcPendingScheduling.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={32} style={{ color: 'var(--emerald-600)', margin: '0 auto 8px auto' }} />
              <div style={{ fontSize: '0.85rem' }}>All cleared applications have been scheduled!</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {evcPendingScheduling.map(app => {
                const isOverdue = app.daysInCurrentStage > app.slaDays;
                return (
                  <div 
                    key={app.id}
                    style={{
                      background: 'var(--bg-elevated)',
                      border: `1px solid ${isOverdue ? 'rgba(255, 77, 106, 0.4)' : 'var(--border-subtle)'}`,
                      borderRadius: '2px',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.88rem' }}>{app.id}</span>
                      <span className={`status-pill ${isOverdue ? 'status-danger' : 'status-neutral'}`}>
                        {app.daysInCurrentStage} / 5 Days
                      </span>
                    </div>

                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{app.instituteName}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {app.city}, {app.region} • {app.type}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                      <button 
                        className="btn-dark"
                        onClick={() => onOpenApplicationDossier(app)}
                        style={{ padding: '6px 12px', fontSize: '0.76rem', borderRadius: '2px' }}
                      >
                        Inspect Dossier
                      </button>
                      <button 
                        className="btn-mint"
                        onClick={() => handleOpenScheduleModal(app)}
                        id={`btn-schedule-evc-${app.id}`}
                        style={{ padding: '6px 12px', fontSize: '0.76rem', borderRadius: '2px' }}
                      >
                        <Calendar size={13} /> Schedule Panel
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 2: Active Scheduled Visits & Countdown */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '2px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} style={{ color: 'var(--emerald-600)' }} /> Active Visits & Report Queue ({evcScheduledAndActive.length})
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Committees active; awaiting digital report submission
              </p>
            </div>
          </div>

          {evcScheduledAndActive.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
              <Clock size={32} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
              <div style={{ fontSize: '0.85rem' }}>No pending inspection visits at this moment</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {evcScheduledAndActive.map(app => {
                const isOverdue = app.daysInCurrentStage > app.slaDays;
                return (
                  <div 
                    key={app.id}
                    style={{
                      background: 'var(--bg-elevated)',
                      border: `1px solid ${isOverdue ? 'rgba(255, 77, 106, 0.4)' : 'var(--border-subtle)'}`,
                      borderRadius: '2px',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.88rem' }}>{app.id}</span>
                      <span className="status-pill status-neutral">
                        Visit: {app.evcDetails?.visitDate || 'Scheduled'}
                      </span>
                    </div>

                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{app.instituteName}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Committee: <strong>3 Experts Assigned</strong> (Academic + Civil + Observer)
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                      <span style={{ fontSize: '0.72rem', color: isOverdue ? 'var(--coral-500)' : 'var(--emerald-600)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {isOverdue ? 'Report SLA Exceeded!' : 'Due within 48h'}
                      </span>
                      <button 
                        className="btn-mint"
                        onClick={() => handleOpenReportModal(app)}
                        id={`btn-upload-report-${app.id}`}
                        style={{ padding: '6px 12px', fontSize: '0.76rem', borderRadius: '2px' }}
                      >
                        <UploadCloud size={13} /> Sign & Submit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Roster of Certified AICTE Experts */}
      <div style={{ marginBottom: '28px' }}>
        <div className="section-header-clean">
          <div>
            <div className="page-overline">EXPERT EVALUATORS</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Certified AICTE Expert Roster
            </h3>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Autonomous pool with Conflict-of-Interest verification
          </div>
        </div>

        <div className="table-wrap-clean">
          <table className="table-clean">
            <thead>
              <tr>
                <th>Expert ID & Name</th>
                <th>Institutional Affiliation</th>
                <th>Designation</th>
                <th>Specialization Norm</th>
                <th>Base City</th>
                <th>Conflict Check</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {INITIAL_EXPERTS_POOL.map(exp => (
                <tr key={exp.id}>
                  <td>
                    <strong style={{ color: 'var(--text-primary)' }}>{exp.name}</strong>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{exp.id} • {exp.email}</div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{exp.affiliation}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{exp.designation}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{exp.specialization}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{exp.city}</td>
                  <td>
                    <span className="status-pill status-compliant">
                      <ShieldCheck size={12} /> Clear
                    </span>
                  </td>
                  <td>
                    <span className="status-pill status-neutral">{exp.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule EVC Modal */}
      {selectedAppForSchedule && (
        <div className="modal-backdrop-clean" onClick={(e) => { if (e.target === e.currentTarget) setSelectedAppForSchedule(null); }}>
          <div className="modal-sheet-clean" style={{ maxWidth: '600px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <div className="page-overline">COMMITTEE DISPATCH</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
                  Schedule EVC Expert Panel
                </h3>
              </div>
              <button 
                className="btn-dark"
                onClick={() => setSelectedAppForSchedule(null)}
                style={{ width: '32px', height: '32px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '2px' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmSchedule}>
              <div style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                padding: '12px 14px',
                borderRadius: '2px',
                marginBottom: '16px',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)'
              }}>
                <div><strong>Application ID:</strong> <span style={{ color: 'var(--text-primary)' }}>{selectedAppForSchedule.id}</span></div>
                <div><strong>Institution:</strong> <span style={{ color: 'var(--text-primary)' }}>{selectedAppForSchedule.instituteName}</span></div>
                <div><strong>Location:</strong> <span style={{ color: 'var(--text-primary)' }}>{selectedAppForSchedule.city}, {selectedAppForSchedule.state} ({selectedAppForSchedule.region})</span></div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Inspection Date:
                  </label>
                  <input 
                    type="date"
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
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Visit Mode:
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
                    value={visitMode}
                    onChange={(e) => setVisitMode(e.target.value)}
                  >
                    <option value="Physical On-Site Inspection">Physical On-Site Inspection</option>
                    <option value="Hybrid Digital & Live Video Inspection">Hybrid Digital & Video</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Assigned 3-Member Expert Committee:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {INITIAL_EXPERTS_POOL.slice(0, 3).map(exp => (
                    <div 
                      key={exp.id}
                      style={{
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-subtle)',
                        padding: '10px 14px',
                        borderRadius: '2px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.8rem'
                      }}
                    >
                      <div>
                        <strong style={{ color: 'var(--text-primary)' }}>{exp.name}</strong> <span style={{ color: 'var(--text-muted)' }}>({exp.designation})</span>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{exp.affiliation} • {exp.specialization}</div>
                      </div>
                      <span className="status-pill status-compliant">
                        <ShieldCheck size={11} /> Verified
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                background: '#f8fafc',
                border: '1px solid var(--border-subtle)',
                padding: '10px 14px',
                borderRadius: '2px',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                marginBottom: '20px'
              }}>
                Upon confirmation, automated appointment orders with confidentiality undertakings will be transmitted to the experts and schedule notifications dispatched.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  className="btn-dark"
                  onClick={() => setSelectedAppForSchedule(null)}
                  style={{ borderRadius: '2px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-mint"
                  style={{ borderRadius: '2px' }}
                >
                  <Send size={14} /> Confirm & Dispatch Orders
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload EVC Report Modal */}
      {selectedAppForReport && (
        <div className="modal-backdrop-clean" onClick={(e) => { if (e.target === e.currentTarget) setSelectedAppForReport(null); }}>
          <div className="modal-sheet-clean" style={{ maxWidth: '600px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <div className="page-overline">REPORT DOSSIER</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
                  Upload & Sign EVC Report
                </h3>
              </div>
              <button 
                className="btn-dark"
                onClick={() => setSelectedAppForReport(null)}
                style={{ width: '32px', height: '32px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '2px' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmReport}>
              <div style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                padding: '12px 14px',
                borderRadius: '2px',
                marginBottom: '16px',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)'
              }}>
                <div><strong>Application:</strong> <span style={{ color: 'var(--text-primary)' }}>{selectedAppForReport.id}</span></div>
                <div><strong>Institution:</strong> <span style={{ color: 'var(--text-primary)' }}>{selectedAppForReport.instituteName}</span></div>
                <div><strong>Scheduled Date:</strong> <span style={{ color: 'var(--text-primary)' }}>{selectedAppForReport.evcDetails?.visitDate || 'Recent'}</span></div>
              </div>

              {/* Scoring Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Infra Compliance (%):
                  </label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    style={{
                      width: '100%',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      borderRadius: '2px',
                      padding: '8px 10px',
                      fontSize: '0.82rem',
                      outline: 'none'
                    }}
                    value={infraScore}
                    onChange={(e) => setInfraScore(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Faculty Ratio (%):
                  </label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    style={{
                      width: '100%',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      borderRadius: '2px',
                      padding: '8px 10px',
                      fontSize: '0.82rem',
                      outline: 'none'
                    }}
                    value={facultyScore}
                    onChange={(e) => setFacultyScore(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Labs Compliance (%):
                  </label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    style={{
                      width: '100%',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      borderRadius: '2px',
                      padding: '8px 10px',
                      fontSize: '0.82rem',
                      outline: 'none'
                    }}
                    value={labScore}
                    onChange={(e) => setLabScore(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Committee Recommendation & Finding:
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
                  value={evcOutcome}
                  onChange={(e) => setEvcOutcome(e.target.value)}
                >
                  <option value="Recommended">Recommended for Approval (Full Compliance)</option>
                  <option value="Recommended with Time-Bound Undertaking">Recommended Subject to Time-Bound Undertaking</option>
                  <option value="Deficiency Found - Refer to SAC">Deficiencies Found - Refer to SAC</option>
                  <option value="Rejected">Not Recommended / Fatal Infrastructure Deficiencies</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Committee Evaluation Summary & Remarks:
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
                  value={evcRemarks}
                  onChange={(e) => setEvcRemarks(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  className="btn-dark"
                  onClick={() => setSelectedAppForReport(null)}
                  style={{ borderRadius: '2px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-mint"
                  style={{ borderRadius: '2px' }}
                >
                  <FileCheck size={14} /> Digitally Sign & Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
