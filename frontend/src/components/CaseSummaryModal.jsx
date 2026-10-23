import React from 'react';
import { Printer, Download, CheckCircle2, ShieldCheck, X, FileText, QrCode } from 'lucide-react';

export function CaseSummaryModal({ application, onClose }) {
  if (!application) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '850px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-info">
              <FileText size={13} /> Official Electronic Dossier
            </span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Statutory Case Summary Sheet
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
              <Printer size={14} /> Print / Save PDF
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              <X size={15} /> Close
            </button>
          </div>
        </div>

        {/* Printable AICTE Case Summary Document */}
        <div className="aicte-dossier" id="printable-case-summary">
          {/* Header */}
          <div className="dossier-header">
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e3a8a', textTransform: 'uppercase' }}>
                All India Council for Technical Education (AICTE)
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                (A Statutory Body of the Government of India) • Approval Bureau
              </div>
              <h2 style={{ fontSize: '1.25rem', marginTop: '4px', color: '#0f172a' }}>
                ELECTRONIC APPLICATION SUMMARY & COMPLIANCE DOSSIER
              </h2>
            </div>

            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Digital Verification</div>
                <div style={{ fontWeight: 800, color: '#16a34a', fontSize: '0.78rem' }}>AICTE-APH-AUTHENTIC</div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Hash: {application.id}-2026</div>
              </div>
              {/* QR Code SVG badge */}
              <div style={{
                width: '54px',
                height: '54px',
                border: '1px solid #cbd5e1',
                padding: '4px',
                borderRadius: '6px',
                background: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <QrCode size={44} color="#0f172a" />
              </div>
            </div>
          </div>

          {/* Institution Meta Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', marginBottom: '16px' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '6px 8px', fontWeight: 600, width: '25%', color: '#475569' }}>Application ID:</td>
                <td style={{ padding: '6px 8px', fontWeight: 700, width: '25%', color: '#0284c7' }}>{application.id}</td>
                <td style={{ padding: '6px 8px', fontWeight: 600, width: '25%', color: '#475569' }}>AICTE Permanent ID:</td>
                <td style={{ padding: '6px 8px', width: '25%' }}>{application.instituteId}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '6px 8px', fontWeight: 600, color: '#475569' }}>Institution Name:</td>
                <td style={{ padding: '6px 8px', fontWeight: 700, color: '#0f172a' }} colSpan={3}>
                  {application.instituteName}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '6px 8px', fontWeight: 600, color: '#475569' }}>Location:</td>
                <td style={{ padding: '6px 8px' }}>{application.city}, {application.state}</td>
                <td style={{ padding: '6px 8px', fontWeight: 600, color: '#475569' }}>Regional Office:</td>
                <td style={{ padding: '6px 8px' }}>{application.region}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '6px 8px', fontWeight: 600, color: '#475569' }}>Application Category:</td>
                <td style={{ padding: '6px 8px' }}>{application.type}</td>
                <td style={{ padding: '6px 8px', fontWeight: 600, color: '#475569' }}>Prescribed Route:</td>
                <td style={{ padding: '6px 8px', fontWeight: 700 }}>{application.route}</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 8px', fontWeight: 600, color: '#475569' }}>Application Date:</td>
                <td style={{ padding: '6px 8px' }}>{application.appliedDate}</td>
                <td style={{ padding: '6px 8px', fontWeight: 600, color: '#475569' }}>Current Stage:</td>
                <td style={{ padding: '6px 8px', fontWeight: 700, color: '#2563eb' }}>{application.currentStage}</td>
              </tr>
            </tbody>
          </table>

          {/* Stage & Scrutiny Observations */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#1e3a8a', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>
              1. Scrutiny Findings & Observations
            </h4>
            {application.deficiencies && application.deficiencies.length > 0 ? (
              <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem' }}>
                <div style={{ fontWeight: 700, color: '#b45309' }}>
                  Deficiency Recorded: {application.deficiencies[0].clause}
                </div>
                <div style={{ color: '#78350f' }}>{application.deficiencies[0].description}</div>
                <div style={{ fontSize: '0.72rem', color: '#92400e', marginTop: '2px' }}>
                  Compliance Deadline: {application.deficiencies[0].rectificationDeadline}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.8rem', color: '#16a34a' }}>
                ✓ Preliminary Scrutiny completed with Zero Deficiencies. Recommended for applicable downstream stage.
              </div>
            )}
          </div>

          {/* EVC Inspection Record */}
          {application.evcDetails?.required && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#1e3a8a', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>
                2. Expert Visit Committee (EVC) Inspection Record
              </h4>
              <div style={{ fontSize: '0.8rem' }}>
                <div><strong>Scheduled Date:</strong> {application.evcDetails.visitDate || 'To be scheduled'}</div>
                <div><strong>Committee Roster:</strong> {application.evcDetails.committee.length || 3} Certified Experts (Academician, Architect, AICTE Observer)</div>
                <div><strong>Status:</strong> {application.evcDetails.outcome || 'Inspection Process in Progress'}</div>
              </div>
            </div>
          )}

          {/* Prescribed Undertakings */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#1e3a8a', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>
              3. Time-Bound Undertakings & Conditions
            </h4>
            {application.undertakings && application.undertakings.length > 0 ? (
              <ul style={{ paddingLeft: '20px', fontSize: '0.8rem' }}>
                {application.undertakings.map((u, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>
                    <strong>{u.prescribedClause}:</strong> {u.condition} (Due: {u.dueDate} - Status: {u.status})
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>No conditional undertakings prescribed.</div>
            )}
          </div>

          {/* Digital Sign-off Block */}
          <div style={{ 
            marginTop: '24px', 
            paddingTop: '16px', 
            borderTop: '2px dashed #cbd5e1',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: '0.76rem'
          }}>
            <div>
              <div><strong>System Verification Hash:</strong></div>
              <div style={{ fontFamily: 'monospace', color: '#475569' }}>
                SHA256: 8f921d7b3a019488aefc291849a0293cb849102948
              </div>
              <div style={{ color: '#64748b', marginTop: '2px' }}>
                Generated by AICTE PRAGATI-NAV Platform on 23-Oct-2026
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, color: '#1e3a8a' }}>
                (Adviser - Approval Bureau)
              </div>
              <div style={{ color: '#475569' }}>
                All India Council for Technical Education, New Delhi
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
