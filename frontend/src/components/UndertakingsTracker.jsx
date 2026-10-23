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
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div className="page-overline">COMPLIANCE REGISTRY</div>
          <h1 className="page-title">Time-Bound Undertakings</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '6px 0 0 0' }}>
            Automated tracking of approvals granted subject to time-bound conditions and evidence verification.
          </p>
        </div>

        <button 
          className="btn-mint"
          onClick={() => setIsAddModalOpen(true)}
          id="btn-add-undertaking"
          style={{ padding: '8px 16px', fontSize: '0.82rem' }}
        >
          <Plus size={15} /> Add Undertaking
        </button>
      </div>

      {/* 4-Card Metric Grid */}
      <div className="metric-grid" style={{ marginBottom: '28px' }}>
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Active Undertakings</span>
            <div className="metric-icon-wrap" style={{ color: 'var(--sky-400)' }}>
              <ShieldCheck size={20} />
            </div>
          </div>
          <div className="metric-value">{total}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Overdue Defaults</span>
            <div className="metric-icon-wrap" style={{ color: 'var(--coral-500)' }}>
              <Flame size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: 'var(--coral-500)' }}>{overdue}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Due in ≤30 Days</span>
            <div className="metric-icon-wrap" style={{ color: 'var(--amber-500)' }}>
              <Clock size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: 'var(--amber-500)' }}>{upcoming}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Awaiting Verification</span>
            <div className="metric-icon-wrap" style={{ color: 'var(--mint-500)' }}>
              <UploadCloud size={20} />
            </div>
          </div>
          <div className="metric-value">{submitted}</div>
        </div>
      </div>

      {/* Main Ledger Table Panel */}
      <div style={{ marginBottom: '28px' }}>
        <div className="section-header-clean">
          <div>
            <div className="page-overline">REGISTER LEDGER</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Prescribed Undertakings Register
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search undertaking..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input-clean"
                style={{ width: '100%', fontSize: '0.8rem', padding: '6px 10px 6px 30px' }}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: '2px',
                padding: '6px 12px',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending Evidence</option>
              <option value="Submitted">Submitted (Review)</option>
              <option value="Overdue Breach">Overdue Breach</option>
              <option value="Verified & Closed">Verified & Closed</option>
            </select>
          </div>
        </div>

        <div className="table-wrap-clean">
          <table className="table-clean">
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
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{u.id}</span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{u.appId}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.institute}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Region: {u.region}</div>
                    </td>
                    <td style={{ maxWidth: '280px' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{u.condition}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Ref: {u.clause}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.82rem' }}>{u.dueDate}</div>
                    </td>
                    <td>
                      {isOverdue ? (
                        <span className="status-pill status-danger">
                          <Flame size={12} /> {Math.abs(u.daysRemaining)}d Overdue
                        </span>
                      ) : u.daysRemaining <= 30 ? (
                        <span className="status-pill status-warning">
                          <Clock size={12} /> {u.daysRemaining}d Left
                        </span>
                      ) : (
                        <span className="status-pill status-neutral">
                          <Clock size={12} /> {u.daysRemaining}d Left
                        </span>
                      )}
                    </td>
                    <td>
                      {u.evidenceFile ? (
                        <span className="status-pill status-neutral" title={u.evidenceFile}>
                          <FileCheck size={11} style={{ color: 'var(--mint-500)' }} /> {u.evidenceFile}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Not Uploaded</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-pill ${
                        u.status === 'Overdue Breach' ? 'status-danger' :
                        u.status === 'Submitted' ? 'status-warning' :
                        u.status === 'Verified & Closed' ? 'status-compliant' : 'status-neutral'
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
                              className="btn-dark"
                              onClick={() => handleOpenUpload(u)}
                              title="Institution portal upload compliance evidence"
                              id={`btn-upload-evidence-${u.id}`}
                              style={{ padding: '5px 10px', fontSize: '0.74rem' }}
                            >
                              <UploadCloud size={12} /> Upload
                            </button>
                          ) : (
                            <button
                              className="btn-dark"
                              disabled
                              style={{ opacity: 0.4, cursor: 'not-allowed', padding: '5px 10px', fontSize: '0.74rem' }}
                              title={getRestrictionReason(Permission.UPLOAD_COMPLIANCE_EVIDENCE)}
                            >
                              <UploadCloud size={12} /> Upload
                            </button>
                          )
                        )}

                        {/* Officer Verify button */}
                        {u.status === 'Submitted' && (
                          can(Permission.VERIFY_REJECT_UNDERTAKING) ? (
                            <button
                              className="btn-mint"
                              onClick={() => handleOpenVerify(u)}
                              title="AICTE Regional Officer review & verification"
                              id={`btn-verify-evidence-${u.id}`}
                              style={{ padding: '5px 10px', fontSize: '0.74rem' }}
                            >
                              <CheckCircle2 size={12} /> Verify
                            </button>
                          ) : (
                            <button
                              className="btn-dark"
                              disabled
                              style={{ opacity: 0.4, cursor: 'not-allowed', padding: '5px 10px', fontSize: '0.74rem' }}
                              title={getRestrictionReason(Permission.VERIFY_REJECT_UNDERTAKING)}
                            >
                              <CheckCircle2 size={12} /> Verify
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
        <div className="modal-backdrop-clean" onClick={(e) => { if (e.target === e.currentTarget) setUploadModalUndertaking(null); }}>
          <div className="modal-sheet-clean" style={{ maxWidth: '580px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <div className="page-overline">COMPLIANCE SUBMISSION</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
                  Submit Compliance Evidence
                </h3>
              </div>
              <button 
                className="btn-dark"
                onClick={() => setUploadModalUndertaking(null)}
                style={{ width: '32px', height: '32px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmUpload}>
              <div style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                padding: '12px 14px',
                borderRadius: '2px',
                marginBottom: '16px',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)'
              }}>
                <div><strong>Undertaking:</strong> <span style={{ color: 'var(--text-primary)' }}>{uploadModalUndertaking.id}</span></div>
                <div><strong>Institution:</strong> <span style={{ color: 'var(--text-primary)' }}>{uploadModalUndertaking.institute}</span></div>
                <div><strong>Condition:</strong> <span style={{ color: 'var(--text-primary)' }}>{uploadModalUndertaking.condition}</span></div>
                <div><strong>Stipulated Deadline:</strong> <span style={{ color: 'var(--text-primary)' }}>{uploadModalUndertaking.dueDate}</span></div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Supporting Compliance Document (PDF):
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
                  value={evidenceFileName}
                  onChange={(e) => setEvidenceFileName(e.target.value)}
                  placeholder="e.g. Bescom_NOC_Approval_Solar_Power.pdf"
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Institutional Remarks & Reference Numbers:
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
                  className="btn-dark"
                  onClick={() => setUploadModalUndertaking(null)}
                  style={{ borderRadius: '2px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-mint"
                  style={{ borderRadius: '2px' }}
                >
                  <Send size={14} /> Submit for Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verification Modal for RO */}
      {verifyModalUndertaking && (
        <div className="modal-backdrop-clean" onClick={(e) => { if (e.target === e.currentTarget) setVerifyModalUndertaking(null); }}>
          <div className="modal-sheet-clean" style={{ maxWidth: '580px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <div className="page-overline">OFFICER VERIFICATION</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
                  Verify Compliance Proof
                </h3>
              </div>
              <button 
                className="btn-dark"
                onClick={() => setVerifyModalUndertaking(null)}
                style={{ width: '32px', height: '32px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>

            <div style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              padding: '12px 14px',
              borderRadius: '2px',
              marginBottom: '16px',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)'
            }}>
              <div><strong>Undertaking:</strong> <span style={{ color: 'var(--text-primary)' }}>{verifyModalUndertaking.id}</span></div>
              <div><strong>Institution:</strong> <span style={{ color: 'var(--text-primary)' }}>{verifyModalUndertaking.institute}</span></div>
              <div><strong>Uploaded Document:</strong> <span style={{ color: 'var(--text-primary)' }}>{verifyModalUndertaking.evidenceFile || 'Proof_Document.pdf'}</span></div>
              <div><strong>Requirement:</strong> <span style={{ color: 'var(--text-primary)' }}>{verifyModalUndertaking.condition}</span></div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Officer Scrutiny & Verification Remarks:
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
                value={verificationRemarks}
                onChange={(e) => setVerificationRemarks(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                type="button" 
                className="btn-dark"
                style={{ color: 'var(--coral-500)', borderColor: 'rgba(255, 77, 106, 0.4)', borderRadius: '2px' }}
                onClick={() => handleConfirmVerify(false)}
              >
                Reject & Escalate
              </button>
              <button 
                type="button" 
                className="btn-mint"
                style={{ borderRadius: '2px' }}
                onClick={() => handleConfirmVerify(true)}
              >
                <CheckCircle2 size={14} /> Approve & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Undertaking Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop-clean" onClick={(e) => { if (e.target === e.currentTarget) setIsAddModalOpen(false); }}>
          <div className="modal-sheet-clean" style={{ maxWidth: '580px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <div className="page-overline">ISSUE COMPLIANCE CONDITION</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
                  New Time-Bound Undertaking
                </h3>
              </div>
              <button 
                className="btn-dark"
                onClick={() => setIsAddModalOpen(false)}
                style={{ width: '32px', height: '32px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Application ID:
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
                  value={newAppId}
                  onChange={(e) => setNewAppId(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Institution Name:
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
                  value={newInstitute}
                  onChange={(e) => setNewInstitute(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Prescribed Undertaking Condition:
                </label>
                <textarea 
                  style={{
                    width: '100%',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    borderRadius: '2px',
                    padding: '8px 12px',
                    fontSize: '0.82rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="e.g. Appointment of 2 Associate Professors or Structural Safety NOC submission..."
                  rows={3}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    APH Clause Reference:
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
                    value={newClause}
                    onChange={(e) => setNewClause(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Stipulated Deadline:
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
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  className="btn-dark"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ borderRadius: '2px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-mint"
                  style={{ borderRadius: '2px' }}
                >
                  <Plus size={14} /> Save & Enforce
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
