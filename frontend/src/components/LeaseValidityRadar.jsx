import React, { useState } from 'react';
import { 
  FileCheck, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  UploadCloud, 
  CheckCircle2, 
  Building2, 
  Flame, 
  Search,
  Send,
  Calendar
} from 'lucide-react';
import { Permission, usePermissions, Role } from '../lib/permissions';

export function LeaseValidityRadar({ 
  leaseDocs, 
  onUploadRenewedDoc, 
  onVerifyRenewedDoc,
  currentRole 
}) {
  const { can, getRestrictionReason } = usePermissions(currentRole);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  // Renewal Modal
  const [renewalModalDoc, setRenewalModalDoc] = useState(null);
  const [newDocNumber, setNewDocNumber] = useState('');
  const [newExpiryDate, setNewExpiryDate] = useState('2056-12-31');
  const [uploadedProofFile, setUploadedProofFile] = useState('');

  const filtered = leaseDocs.filter(d => {
    const matchesSearch = d.institute.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.docNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.docType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || d.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const criticalCount = leaseDocs.filter(d => d.daysRemaining <= 90).length;
  const advanceCount = leaseDocs.filter(d => d.daysRemaining > 90 && d.daysRemaining <= 180).length;
  const validCount = leaseDocs.filter(d => d.daysRemaining > 180).length;

  const handleOpenRenewal = (doc) => {
    setRenewalModalDoc(doc);
    setNewDocNumber(`${doc.docNumber}-REN-2026`);
    setUploadedProofFile(`Registered_Deed_Renewal_${doc.id}.pdf`);
  };

  const handleSubmitRenewal = (e) => {
    e.preventDefault();
    if (!renewalModalDoc) return;
    onUploadRenewedDoc(renewalModalDoc.id, {
      newDocNumber,
      newExpiryDate,
      uploadedProofFile
    });
    setRenewalModalDoc(null);
  };

  return (
    <div className="lease-validity-radar">
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
            <span className="badge badge-warning">
              <FileCheck size={13} /> Land Lease & Mandatory Document Validity Radar
            </span>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              APH 2024–27 Chapter I & Appendix 4 Norms
            </span>
          </div>
          <h2 style={{ fontSize: '1.35rem', marginTop: '6px' }}>
            Document Expiry Monitoring & Advance Renewal Alert Engine
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
            Continuous tracking of 30-year registered land lease deeds, building safety certificates, and fire NOCs with automated advance notices at 180 and 90 days.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <div className="sla-pill sla-breached">
            <ShieldAlert size={14} /> Expired/Non-Renewed Blocks Next EoA
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card alert-ruby">
          <div className="kpi-header">
            <span className="kpi-title" style={{ color: '#f87171' }}>Critical (&le;90 Days)</span>
            <div className="kpi-icon-wrap" style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.15)' }}>
              <Flame size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#f87171' }}>{criticalCount}</div>
          <div className="kpi-subtext" style={{ color: '#fca5a5' }}>
            Immediate show-cause warning sent
          </div>
        </div>

        <div className="kpi-card alert-amber">
          <div className="kpi-header">
            <span className="kpi-title" style={{ color: '#fbbf24' }}>Advance Notice (90-180 Days)</span>
            <div className="kpi-icon-wrap" style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#fbbf24' }}>{advanceCount}</div>
          <div className="kpi-subtext" style={{ color: '#fde68a' }}>
            6-Month advance renewal reminder
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Active & Valid (&gt;180 Days)</span>
            <div className="kpi-icon-wrap" style={{ color: '#34d399' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="kpi-value">{validCount}</div>
          <div className="kpi-subtext">Compliant registered deeds</div>
        </div>
      </div>

      {/* Document Ledger Panel */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">
              <FileCheck size={20} color="#38bdf8" /> Master Institutional Land & Statutory Document Register
            </h3>
            <p style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
              Real-time validity status, registered document numbers, and automated regulatory safeguard actions
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative', width: '240px' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '11px', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search document / institute..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '32px', fontSize: '0.78rem' }}
              />
            </div>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="form-select"
              style={{ width: '160px', fontSize: '0.78rem' }}
            >
              <option value="ALL">All Validity Tiers</option>
              <option value="critical">Critical (&le;90 Days)</option>
              <option value="normal">Safe & Valid</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Doc ID & App</th>
                <th>Institution</th>
                <th>Document Type & Reg. Number</th>
                <th>Registered Date</th>
                <th>Expiry Date</th>
                <th>Days Remaining</th>
                <th>Regulatory Consequence</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(doc => {
                const isCritical = doc.daysRemaining <= 90;
                return (
                  <tr key={doc.id}>
                    <td>
                      <span style={{ fontWeight: 700, color: '#38bdf8' }}>{doc.id}</span>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{doc.appId}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{doc.institute}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Region: {doc.region}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{doc.docType}</div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>No: {doc.docNumber}</div>
                    </td>
                    <td>{doc.registeredDate}</td>
                    <td>
                      <strong style={{ color: isCritical ? '#f87171' : '#cbd5e1' }}>
                        {doc.expiryDate}
                      </strong>
                    </td>
                    <td>
                      {isCritical ? (
                        <span className="sla-pill sla-breached">
                          <Flame size={12} /> {doc.daysRemaining} Days Left
                        </span>
                      ) : (
                        <span className="sla-pill sla-normal">
                          <Clock size={12} /> {doc.daysRemaining} Days
                        </span>
                      )}
                    </td>
                    <td style={{ maxWidth: '240px' }}>
                      <span style={{ 
                        fontSize: '0.74rem', 
                        color: isCritical ? '#fca5a5' : '#94a3b8' 
                      }}>
                        {doc.actionRequired}
                      </span>
                    </td>
                    <td>
                      {can(Permission.UPLOAD_DOCUMENT_RENEWAL) ? (
                        <button
                          className={`btn btn-sm ${isCritical ? 'btn-warning' : 'btn-secondary'}`}
                          onClick={() => handleOpenRenewal(doc)}
                          id={`btn-renew-doc-${doc.id}`}
                        >
                          <UploadCloud size={13} /> Upload Renewal
                        </button>
                      ) : (
                        <button
                          className="btn btn-secondary btn-sm"
                          disabled
                          style={{ opacity: 0.5, cursor: 'not-allowed' }}
                          title={getRestrictionReason(Permission.UPLOAD_DOCUMENT_RENEWAL)}
                        >
                          <UploadCloud size={13} /> Upload Renewal
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Renewal Modal */}
      {renewalModalDoc && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="panel-header">
              <h3 className="panel-title">
                <UploadCloud size={20} color="#fbbf24" /> Upload Renewed Document & Update Validity
              </h3>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setRenewalModalDoc(null)}
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSubmitRenewal}>
              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '0.8rem'
              }}>
                <div><strong>Document:</strong> {renewalModalDoc.docType}</div>
                <div><strong>Institution:</strong> {renewalModalDoc.institute}</div>
                <div><strong>Current Expiry Date:</strong> {renewalModalDoc.expiryDate} ({renewalModalDoc.daysRemaining} days left)</div>
              </div>

              <div className="form-group">
                <label className="form-label">New Registered Deed / Certificate Registration Number:</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={newDocNumber}
                  onChange={(e) => setNewDocNumber(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Validated Expiry Date:</label>
                <input 
                  type="date" 
                  className="form-input"
                  value={newExpiryDate}
                  onChange={(e) => setNewExpiryDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Scanned Certified Copy (PDF):</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={uploadedProofFile}
                  onChange={(e) => setUploadedProofFile(e.target.value)}
                  required
                />
              </div>

              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                color: '#cbd5e1',
                marginBottom: '20px'
              }}>
                Submitting this renewed deed will automatically clear the critical expiry alert, unfreeze the institutional EoA workflow, and record the registration in the immutable audit trail.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setRenewalModalDoc(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  <CheckCircle2 size={15} /> Save & Validate Renewal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
