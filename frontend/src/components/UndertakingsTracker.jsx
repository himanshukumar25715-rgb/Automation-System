import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  UploadCloud, 
  FileCheck, 
  Flame, 
  Plus, 
  Search,
  Filter,
  ArrowRight,
  Send
} from 'lucide-react';
import { Permission, usePermissions, Role } from '../lib/permissions';

export function UndertakingsTracker({ 
  undertakings, 
  onUploadComplianceEvidence, 
  onVerifyUndertaking,
  onAddNewUndertaking,
  currentRole 
}) {
  const { can, getRestrictionReason } = usePermissions(currentRole);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [uploadModalUndertaking, setUploadModalUndertaking] = useState(null);
  const [evidenceFileName, setEvidenceFileName] = useState('');
  const [evidenceNotes, setEvidenceNotes] = useState('');

  const [verifyModalUndertaking, setVerifyModalUndertaking] = useState(null);
  const [verificationRemarks, setVerificationRemarks] = useState('Compliance verified satisfactorily as per AICTE handbook norms.');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAppId, setNewAppId] = useState('APP-2026-WRO-1049');
  const [newInstitute, setNewInstitute] = useState('Maharashtra Institute of Technology & Research');
  const [newCondition, setNewCondition] = useState('');
  const [newClause, setNewClause] = useState('APH Clause 7.12 (Faculty Cadre Ratio)');
  const [newDueDate, setNewDueDate] = useState('2026-12-31');

  // Filter
  const filtered = undertakings.filter(u => {
    const matchesSearch = u.institute.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const total = undertakings.length;
  const overdue = undertakings.filter(u => u.daysRemaining < 0 || u.status === 'Overdue Breach').length;
  const submitted = undertakings.filter(u => u.status === 'Submitted').length;
  const upcoming = undertakings.filter(u => u.daysRemaining >= 0 && u.daysRemaining <= 30).length;

  const handleOpenUpload = (u) => {
    setUploadModalUndertaking(u);
    setEvidenceFileName(`Compliance_Evidence_${u.id}.pdf`);
    setEvidenceNotes('');
  };

  const handleConfirmUpload = (e) => {
    e.preventDefault();
    if (!uploadModalUndertaking) return;
    onUploadComplianceEvidence(uploadModalUndertaking.id, evidenceFileName, evidenceNotes);
    setUploadModalUndertaking(null);
  };

  const handleOpenVerify = (u) => {
    setVerifyModalUndertaking(u);
  };

  const handleConfirmVerify = (approved) => {
    if (!verifyModalUndertaking) return;
    onVerifyUndertaking(verifyModalUndertaking.id, approved, verificationRemarks);
    setVerifyModalUndertaking(null);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newCondition.trim()) return;
    onAddNewUndertaking({
      appId: newAppId,
      institute: newInstitute,
      condition: newCondition,
      clause: newClause,
      dueDate: newDueDate
    });
    setIsAddModalOpen(false);
    setNewCondition('');
  };

  return (
    <div className="undertakings-tracker">
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
            <span className="badge badge-success">
              <ShieldCheck size={13} /> Institutional Compliance Registry
            </span>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Monitoring Approvals Granted Subject to Time-Bound Conditions (APH 2024–27)
            </span>
          </div>
          <h2 style={{ fontSize: '1.35rem', marginTop: '6px' }}>
            Time-Bound Undertakings & Compliance Evidence Tracker
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
            Automated alerts at 30, 15, and 7 days before deadline; proof upload and verification; auto-escalation of defaults to Standing Appellate Committee.
          </p>
        </div>

        <button 
          className="btn btn-primary btn-sm"
          onClick={() => setIsAddModalOpen(true)}
          id="btn-add-undertaking"
        >
          <Plus size={15} /> Add New Conditional Undertaking
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Active Undertakings</span>
            <div className="kpi-icon-wrap" style={{ color: '#38bdf8' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="kpi-value">{total}</div>
          <div className="kpi-subtext">Across technical institutions</div>
        </div>

        <div className="kpi-card alert-ruby">
          <div className="kpi-header">
            <span className="kpi-title" style={{ color: '#f87171' }}>Overdue Defaults</span>
            <div className="kpi-icon-wrap" style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.15)' }}>
              <Flame size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#f87171' }}>{overdue}</div>
          <div className="kpi-subtext" style={{ color: '#fca5a5' }}>
            Escalated for intake reduction / SAC
          </div>
        </div>

        <div className="kpi-card alert-amber">
          <div className="kpi-header">
            <span className="kpi-title" style={{ color: '#fbbf24' }}>Due in &le;30 Days</span>
            <div className="kpi-icon-wrap" style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#fbbf24' }}>{upcoming}</div>
          <div className="kpi-subtext" style={{ color: '#fde68a' }}>
            Automated SMS & Email dispatched
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Awaiting Verification</span>
            <div className="kpi-icon-wrap" style={{ color: '#34d399' }}>
              <UploadCloud size={18} />
            </div>
          </div>
          <div className="kpi-value">{submitted}</div>
          <div className="kpi-subtext">Evidence submitted by Principal</div>
        </div>
      </div>

      {/* Main Ledger Table Panel */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">
              <FileCheck size={20} color="#34d399" /> Digital Register of Prescribed Institutional Undertakings
            </h3>
            <p style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
              Real-time countdown, proof verification, and authorized AICTE action
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative', width: '240px' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '11px', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search undertaking..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '32px', fontSize: '0.78rem' }}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
              style={{ width: '160px', fontSize: '0.78rem' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending Evidence</option>
              <option value="Submitted">Submitted (Review)</option>
              <option value="Overdue Breach">Overdue Breach</option>
              <option value="Verified & Closed">Verified & Closed</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Undertaking ID & App</th>
                <th>Institution</th>
                <th>Prescribed Condition & APH Clause</th>
                <th>Stipulated Deadline</th>
                <th>Timeline Status</th>
                <th>Evidence Proof</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const isOverdue = u.daysRemaining < 0 || u.status === 'Overdue Breach';
                return (
                  <tr key={u.id}>
                    <td>
                      <span style={{ fontWeight: 700, color: '#38bdf8' }}>{u.id}</span>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{u.appId}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{u.institute}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Region: {u.region}</div>
                    </td>
                    <td style={{ maxWidth: '300px' }}>
                      <div style={{ fontSize: '0.82rem', color: '#e2e8f0' }}>{u.condition}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                        Ref: {u.clause}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{u.dueDate}</div>
                    </td>
                    <td>
                      {isOverdue ? (
                        <span className="sla-pill sla-breached">
                          <Flame size={12} /> {Math.abs(u.daysRemaining)} Days Overdue
                        </span>
                      ) : u.daysRemaining <= 30 ? (
                        <span className="sla-pill sla-warning">
                          <Clock size={12} /> {u.daysRemaining} Days Left
                        </span>
                      ) : (
                        <span className="sla-pill sla-normal">
                          <Clock size={12} /> {u.daysRemaining} Days Left
                        </span>
                      )}
                    </td>
                    <td>
                      {u.evidenceFile ? (
                        <span className="badge badge-info" title={u.evidenceFile}>
                          <FileCheck size={12} /> {u.evidenceFile}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Not Uploaded</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${
                        u.status === 'Overdue Breach' ? 'badge-critical' :
                        u.status === 'Submitted' ? 'badge-warning' :
                        u.status === 'Verified & Closed' ? 'badge-success' : 'badge-info'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {/* Upload Evidence button */}
                        {u.status !== 'Verified & Closed' && (
                          can(Permission.UPLOAD_COMPLIANCE_EVIDENCE) ? (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenUpload(u)}
                              title="Institution portal upload compliance evidence"
                              id={`btn-upload-evidence-${u.id}`}
                            >
                              <UploadCloud size={13} /> Upload Proof
                            </button>
                          ) : (
                            <button
                              className="btn btn-secondary btn-sm"
                              disabled
                              style={{ opacity: 0.5, cursor: 'not-allowed' }}
                              title={getRestrictionReason(Permission.UPLOAD_COMPLIANCE_EVIDENCE)}
                            >
                              <UploadCloud size={13} /> Upload Proof
                            </button>
                          )
                        )}

                        {/* Officer Verify button */}
                        {u.status === 'Submitted' && (
                          can(Permission.VERIFY_REJECT_UNDERTAKING) ? (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleOpenVerify(u)}
                              title="AICTE Regional Officer review & verification"
                              id={`btn-verify-evidence-${u.id}`}
                            >
                              <CheckCircle2 size={13} /> Verify Evidence
                            </button>
                          ) : (
                            <button
                              className="btn btn-secondary btn-sm"
                              disabled
                              style={{ opacity: 0.5, cursor: 'not-allowed' }}
                              title={getRestrictionReason(Permission.VERIFY_REJECT_UNDERTAKING)}
                            >
                              <CheckCircle2 size={13} /> Verify Evidence
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Evidence Modal */}
      {uploadModalUndertaking && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="panel-header">
              <h3 className="panel-title">
                <UploadCloud size={20} color="#38bdf8" /> Online Submission of Compliance Evidence
              </h3>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setUploadModalUndertaking(null)}
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleConfirmUpload}>
              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '0.8rem'
              }}>
                <div><strong>Undertaking:</strong> {uploadModalUndertaking.id}</div>
                <div><strong>Institution:</strong> {uploadModalUndertaking.institute}</div>
                <div><strong>Condition:</strong> {uploadModalUndertaking.condition}</div>
                <div><strong>Stipulated Deadline:</strong> {uploadModalUndertaking.dueDate}</div>
              </div>

              <div className="form-group">
                <label className="form-label">Supporting Compliance Document (PDF):</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={evidenceFileName}
                  onChange={(e) => setEvidenceFileName(e.target.value)}
                  placeholder="e.g. Bescom_NOC_Approval_Solar_Power.pdf"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Institutional Remarks & Reference Numbers:</label>
                <textarea 
                  className="form-textarea"
                  value={evidenceNotes}
                  onChange={(e) => setEvidenceNotes(e.target.value)}
                  placeholder="State transaction reference, competent authority sanction letter no., or date of commissioning..."
                  rows={3}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setUploadModalUndertaking(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  <Send size={15} /> Submit for AICTE RO Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verification Modal for RO */}
      {verifyModalUndertaking && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="panel-header">
              <h3 className="panel-title">
                <CheckCircle2 size={20} color="#10b981" /> AICTE Officer Verification of Compliance Proof
              </h3>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setVerifyModalUndertaking(null)}
              >
                ✕ Close
              </button>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.7)',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '0.8rem'
            }}>
              <div><strong>Undertaking:</strong> {verifyModalUndertaking.id}</div>
              <div><strong>Institution:</strong> {verifyModalUndertaking.institute}</div>
              <div><strong>Uploaded Document:</strong> {verifyModalUndertaking.evidenceFile || 'Proof_Document.pdf'}</div>
              <div><strong>Requirement:</strong> {verifyModalUndertaking.condition}</div>
            </div>

            <div className="form-group">
              <label className="form-label">Officer Scrutiny & Verification Remarks:</label>
              <textarea 
                className="form-textarea"
                value={verificationRemarks}
                onChange={(e) => setVerificationRemarks(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                type="button" 
                className="btn btn-danger"
                onClick={() => handleConfirmVerify(false)}
              >
                Reject & Escalate to SAC
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => handleConfirmVerify(true)}
              >
                <CheckCircle2 size={15} /> Approve & Close Undertaking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Undertaking Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="panel-header">
              <h3 className="panel-title">
                <Plus size={20} color="#38bdf8" /> Issue New Time-Bound Undertaking
              </h3>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setIsAddModalOpen(false)}
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Application ID:</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={newAppId}
                  onChange={(e) => setNewAppId(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Institution Name:</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={newInstitute}
                  onChange={(e) => setNewInstitute(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Prescribed Undertaking Condition:</label>
                <textarea 
                  className="form-textarea"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="e.g. Appointment of 2 Associate Professors or Structural Safety NOC submission..."
                  rows={3}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">APH Clause Reference:</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={newClause}
                    onChange={(e) => setNewClause(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stipulated Deadline Due Date:</label>
                  <input 
                    type="date" 
                    className="form-input"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  <Plus size={15} /> Save & Enforce Undertaking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
