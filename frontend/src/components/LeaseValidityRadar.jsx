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
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div className="page-overline">REGULATORY COMPLIANCE RADAR</div>
          <h1 className="page-title">Document Validity & Leases</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '6px 0 0 0' }}>
            Continuous tracking of registered land deeds, fire NOCs, and building safety certificates.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <div className="status-pill status-danger" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
            <ShieldAlert size={13} /> Expired Deeds Block EoA
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="metric-grid" style={{ marginBottom: '28px' }}>
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Critical (≤90 Days)</span>
            <div className="metric-icon-wrap" style={{ color: 'var(--coral-500)' }}>
              <Flame size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: 'var(--coral-500)' }}>{criticalCount}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Advance Notice (90-180d)</span>
            <div className="metric-icon-wrap" style={{ color: 'var(--amber-500)' }}>
              <Clock size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: 'var(--amber-500)' }}>{advanceCount}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Active & Valid (&gt;180d)</span>
            <div className="metric-icon-wrap" style={{ color: 'var(--mint-500)' }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="metric-value">{validCount}</div>
        </div>
      </div>

      {/* Document Ledger Panel */}
      <div style={{ marginBottom: '28px' }}>
        <div className="section-header-clean">
          <div>
            <div className="page-overline">DOCUMENT REGISTRY</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Land & Statutory Document Register
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search document / institute..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input-clean"
                style={{ width: '100%', fontSize: '0.8rem', padding: '6px 10px 6px 30px' }}
              />
            </div>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
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
              <option value="ALL">All Validity Tiers</option>
              <option value="critical">Critical (≤90 Days)</option>
              <option value="normal">Safe & Valid</option>
            </select>
          </div>
        </div>

        <div className="table-wrap-clean">
          <table className="table-clean">
            <thead>
              <tr>
                <th>Doc ID & App</th>
                <th>Institution</th>
                <th>Document Type & Number</th>
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
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{doc.id}</span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{doc.appId}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{doc.institute}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Region: {doc.region}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{doc.docType}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>No: {doc.docNumber}</div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{doc.registeredDate}</td>
                    <td>
                      <strong style={{ color: isCritical ? 'var(--coral-500)' : 'var(--text-primary)' }}>
                        {doc.expiryDate}
                      </strong>
                    </td>
                    <td>
                      {isCritical ? (
                        <span className="status-pill status-danger">
                          <Flame size={12} /> {doc.daysRemaining}d Left
                        </span>
                      ) : (
                        <span className="status-pill status-neutral">
                          <Clock size={12} /> {doc.daysRemaining}d
                        </span>
                      )}
                    </td>
                    <td style={{ maxWidth: '240px' }}>
                      <span style={{ 
                        fontSize: '0.76rem', 
                        color: isCritical ? 'var(--coral-500)' : 'var(--text-secondary)' 
                      }}>
                        {doc.actionRequired}
                      </span>
                    </td>
                    <td>
                      {can(Permission.UPLOAD_DOCUMENT_RENEWAL) ? (
                        <button
                          className={isCritical ? 'btn-mint' : 'btn-dark'}
                          onClick={() => handleOpenRenewal(doc)}
                          id={`btn-renew-doc-${doc.id}`}
                          style={{ padding: '5px 10px', fontSize: '0.74rem', borderRadius: '2px' }}
                        >
                          <UploadCloud size={12} /> Upload
                        </button>
                      ) : (
                        <button
                          className="btn-dark"
                          disabled
                          style={{ opacity: 0.4, cursor: 'not-allowed', padding: '5px 10px', fontSize: '0.74rem', borderRadius: '2px' }}
                          title={getRestrictionReason(Permission.UPLOAD_DOCUMENT_RENEWAL)}
                        >
                          <UploadCloud size={12} /> Upload
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
        <div className="modal-backdrop-clean" onClick={(e) => { if (e.target === e.currentTarget) setRenewalModalDoc(null); }}>
          <div className="modal-sheet-clean" style={{ maxWidth: '580px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <div className="page-overline">DEED RENEWAL</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
                  Upload Renewed Document
                </h3>
              </div>
              <button 
                className="btn-dark"
                onClick={() => setRenewalModalDoc(null)}
                style={{ width: '32px', height: '32px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitRenewal}>
              <div style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                padding: '12px 14px',
                borderRadius: '2px',
                marginBottom: '16px',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)'
              }}>
                <div><strong>Document:</strong> <span style={{ color: 'var(--text-primary)' }}>{renewalModalDoc.docType}</span></div>
                <div><strong>Institution:</strong> <span style={{ color: 'var(--text-primary)' }}>{renewalModalDoc.institute}</span></div>
                <div><strong>Current Expiry:</strong> <span style={{ color: 'var(--text-primary)' }}>{renewalModalDoc.expiryDate} ({renewalModalDoc.daysRemaining} days left)</span></div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  New Deed / Registration Number:
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
                  value={newDocNumber}
                  onChange={(e) => setNewDocNumber(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  New Validated Expiry Date:
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
                  value={newExpiryDate}
                  onChange={(e) => setNewExpiryDate(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Scanned Certified Copy (PDF):
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
                  value={uploadedProofFile}
                  onChange={(e) => setUploadedProofFile(e.target.value)}
                  required
                />
              </div>

              <div style={{
                background: '#f8fafc',
                border: '1px solid var(--border-subtle)',
                padding: '10px 14px',
                borderRadius: '2px',
                fontSize: '0.74rem',
                color: 'var(--text-secondary)',
                marginBottom: '20px'
              }}>
                Submitting this renewed deed will automatically clear the critical expiry alert, unfreeze the institutional EoA workflow, and record the registration in the immutable audit trail.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  className="btn-dark"
                  onClick={() => setRenewalModalDoc(null)}
                  style={{ borderRadius: '2px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-mint"
                  style={{ borderRadius: '2px' }}
                >
                  <CheckCircle2 size={14} /> Validate Renewal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
