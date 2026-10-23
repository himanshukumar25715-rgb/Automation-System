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
              <Users size={13} /> EVC Committee Management System
            </span>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              APH 2024–27 Chapter III (Physical & Hybrid Inspections)
            </span>
          </div>
          <h2 style={{ fontSize: '1.35rem', marginTop: '6px' }}>
            Expert Visit Committee (EVC) Scheduling, Panel Allocation & Reports
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
            Automated queuing of scrutiny-cleared applications, conflict-of-interest checks, 48-hour report upload countdowns, and delay escalations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="sla-pill sla-warning">
            <Clock size={14} /> EVC Scheduling SLA: 5 Days
          </div>
          <div className="sla-pill sla-normal">
            <Clock size={14} /> Report Submission: 48 Hours
          </div>
        </div>
      </div>

      {/* Grid: Pending Scheduling Queue & Active Visits */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        
        {/* Section 1: EVC Pending Scheduling Queue */}
        <div className="panel" style={{ margin: 0 }}>
          <div className="panel-header">
            <div>
              <h3 className="panel-title" style={{ color: '#fbbf24' }}>
                <Clock size={18} /> Queue: Awaiting EVC Scheduling ({evcPendingScheduling.length})
              </h3>
              <p style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                Applications cleared from preliminary scrutiny needing expert panel allocation
              </p>
            </div>
          </div>

          {evcPendingScheduling.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: '#94a3b8' }}>
              <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 8px auto' }} />
              <div>All cleared applications have been scheduled!</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {evcPendingScheduling.map(app => {
                const isOverdue = app.daysInCurrentStage > app.slaDays;
                return (
                  <div 
                    key={app.id}
                    style={{
                      background: 'rgba(15, 23, 42, 0.7)',
                      border: `1px solid ${isOverdue ? 'rgba(239, 68, 68, 0.5)' : 'var(--border-subtle)'}`,
                      borderRadius: '8px',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: '#38bdf8' }}>{app.id}</span>
                      <span className={`sla-pill ${isOverdue ? 'sla-breached' : 'sla-normal'}`}>
                        {app.daysInCurrentStage} / 5 Days
                      </span>
                    </div>

                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{app.instituteName}</div>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                      {app.city}, {app.region} • {app.type}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => onOpenApplicationDossier(app)}
                      >
                        Inspect Scrutiny Dossier
                      </button>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleOpenScheduleModal(app)}
                        id={`btn-schedule-evc-${app.id}`}
                      >
                        <Calendar size={14} /> Schedule Panel & Date
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 2: Active Scheduled Visits & Countdown */}
        <div className="panel" style={{ margin: 0 }}>
          <div className="panel-header">
            <div>
              <h3 className="panel-title" style={{ color: '#38bdf8' }}>
                <Calendar size={18} /> Active Scheduled Visits & Report Queue ({evcScheduledAndActive.length})
              </h3>
              <p style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                Inspection committees assigned; awaiting physical/hybrid verification and digital report upload
              </p>
            </div>
          </div>

          {evcScheduledAndActive.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: '#94a3b8' }}>
              <Clock size={36} color="#64748b" style={{ margin: '0 auto 8px auto' }} />
              <div>No pending inspection visits at this moment</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {evcScheduledAndActive.map(app => {
                const isOverdue = app.daysInCurrentStage > app.slaDays;
                return (
                  <div 
                    key={app.id}
                    style={{
                      background: 'rgba(15, 23, 42, 0.7)',
                      border: `1px solid ${isOverdue ? 'rgba(239, 68, 68, 0.5)' : 'var(--border-subtle)'}`,
                      borderRadius: '8px',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: '#38bdf8' }}>{app.id}</span>
                      <span className="badge badge-purple">
                        Visit: {app.evcDetails?.visitDate || 'Scheduled'}
                      </span>
                    </div>

                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{app.instituteName}</div>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                      Committee: <strong>3 Experts Assigned</strong> (Academic + Civil + Observer)
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.72rem', color: isOverdue ? '#f87171' : '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {isOverdue ? 'Report Submission SLA Exceeded!' : 'Report Due within 48h'}
                      </span>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleOpenReportModal(app)}
                        id={`btn-upload-report-${app.id}`}
                      >
                        <UploadCloud size={14} /> Upload & Sign Report
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
      <div className="panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">
              <UserCheck size={20} color="#34d399" /> Certified AICTE Expert Evaluator Roster
            </h3>
            <p style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
              Autonomous pool with automatic Conflict-of-Interest verification against institutional applications
            </p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
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
                    <strong>{exp.name}</strong>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{exp.id} • {exp.email}</div>
                  </td>
                  <td>{exp.affiliation}</td>
                  <td>{exp.designation}</td>
                  <td>{exp.specialization}</td>
                  <td>{exp.city}</td>
                  <td>
                    <span className="badge badge-success">
                      <ShieldCheck size={12} /> Clear (Verified)
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-info">{exp.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule EVC Modal */}
      {selectedAppForSchedule && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="panel-header">
              <h3 className="panel-title">
                <Calendar size={20} color="#38bdf8" /> Schedule EVC Expert Panel
              </h3>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedAppForSchedule(null)}
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleConfirmSchedule}>
              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '0.8rem'
              }}>
                <div><strong>Application ID:</strong> {selectedAppForSchedule.id}</div>
                <div><strong>Institution:</strong> {selectedAppForSchedule.instituteName}</div>
                <div><strong>Location:</strong> {selectedAppForSchedule.city}, {selectedAppForSchedule.state} ({selectedAppForSchedule.region})</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Inspection Date:</label>
                  <input 
                    type="date"
                    className="form-input"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Visit Mode:</label>
                  <select 
                    className="form-select"
                    value={visitMode}
                    onChange={(e) => setVisitMode(e.target.value)}
                  >
                    <option value="Physical On-Site Inspection">Physical On-Site Inspection (Mandatory for New Inst)</option>
                    <option value="Hybrid Digital & Live Video Inspection">Hybrid Digital & Live Video Inspection</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Selected 3-Member Expert Committee (No Conflict of Interest):</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {INITIAL_EXPERTS_POOL.slice(0, 3).map(exp => (
                    <div 
                      key={exp.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        padding: '10px 14px',
                        borderRadius: '6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.8rem'
                      }}
                    >
                      <div>
                        <strong>{exp.name}</strong> ({exp.designation})
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{exp.affiliation} • {exp.specialization}</div>
                      </div>
                      <span className="badge badge-success">
                        <ShieldCheck size={12} /> Auto-Verified
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                color: '#cbd5e1',
                marginBottom: '20px'
              }}>
                Upon confirmation, automated appointment orders with confidentiality undertakings will be transmitted to the experts and schedule notification to the institution.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setSelectedAppForSchedule(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  <Send size={15} /> Confirm & Dispatch EVC Orders
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload EVC Report Modal */}
      {selectedAppForReport && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="panel-header">
              <h3 className="panel-title">
                <UploadCloud size={20} color="#34d399" /> Upload & Digitally Sign EVC Report Dossier
              </h3>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedAppForReport(null)}
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleConfirmReport}>
              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '0.8rem'
              }}>
                <div><strong>Application:</strong> {selectedAppForReport.id}</div>
                <div><strong>Institution:</strong> {selectedAppForReport.instituteName}</div>
                <div><strong>Scheduled Date:</strong> {selectedAppForReport.evcDetails?.visitDate || 'Recent'}</div>
              </div>

              {/* Scoring Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Infrastructure Compliance (%):</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    className="form-input"
                    value={infraScore}
                    onChange={(e) => setInfraScore(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Faculty Cadre Ratio (%):</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    className="form-input"
                    value={facultyScore}
                    onChange={(e) => setFacultyScore(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Laboratory & Computing (%):</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    className="form-input"
                    value={labScore}
                    onChange={(e) => setLabScore(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Committee Recommendation & Finding:</label>
                <select 
                  className="form-select"
                  value={evcOutcome}
                  onChange={(e) => setEvcOutcome(e.target.value)}
                >
                  <option value="Recommended">Recommended for Approval (Full Compliance)</option>
                  <option value="Recommended with Time-Bound Undertaking">Recommended Subject to Time-Bound Undertaking</option>
                  <option value="Deficiency Found - Refer to SAC">Deficiencies Found - Refer to Standing Appellate Committee (SAC)</option>
                  <option value="Rejected">Not Recommended / Fatal Infrastructure Deficiencies</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Committee Evaluation Summary & Geo-tagged Verification Remarks:</label>
                <textarea 
                  className="form-textarea"
                  value={evcRemarks}
                  onChange={(e) => setEvcRemarks(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setSelectedAppForReport(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  <FileCheck size={15} /> Digitally Sign & Submit EVC Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
