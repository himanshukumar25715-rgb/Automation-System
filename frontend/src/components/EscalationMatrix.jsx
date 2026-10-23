import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Flame, 
  Send, 
  Bell, 
  FileText, 
  CheckCircle2, 
  Printer, 
  Download, 
  Layers, 
  ShieldAlert,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export function EscalationMatrix({ 
  notifications, 
  onMarkNotificationRead,
  applications,
  undertakings,
  leaseDocs,
  onOpenCaseSummary
}) {
  const [selectedTemplate, setSelectedTemplate] = useState('DEFICIENCY_MEMO');
  const [previewAppId, setPreviewAppId] = useState(applications[0]?.id || 'APP-2026-WRO-1049');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const selectedApp = applications.find(a => a.id === previewAppId) || applications[0];

  const filteredNotifs = notifications.filter(n => {
    if (severityFilter === 'ALL') return true;
    return n.severity === severityFilter;
  });

  // Standardized Letter Templates
  const renderTemplateContent = () => {
    switch (selectedTemplate) {
      case 'DEFICIENCY_MEMO':
        return (
          <div className="aicte-dossier" style={{ fontSize: '0.86rem', lineHeight: '1.6' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px solid #1e3a8a', paddingBottom: '12px', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', color: '#1e3a8a' }}>ALL INDIA COUNCIL FOR TECHNICAL EDUCATION</h2>
              <div style={{ fontSize: '0.78rem', color: '#475569' }}>Nelson Mandela Marg, Vasant Kunj, New Delhi-110070 | Approval Bureau</div>
              <div style={{ fontWeight: 700, color: '#b91c1c', marginTop: '6px' }}>OFFICIAL DEFICIENCY MEMORANDUM / REVERT NOTICE</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div><strong>Ref No:</strong> AICTE/{selectedApp.region}/DEF/{selectedApp.id}</div>
              <div><strong>Date:</strong> 23-Oct-2026</div>
            </div>

            <p><strong>To:</strong> The Principal / Director,<br />{selectedApp.instituteName}, {selectedApp.city}, {selectedApp.state}</p>

            <p style={{ marginTop: '10px' }}>
              <strong>Subject:</strong> Scrutiny Observations & Discrepancies regarding Application ID <strong>{selectedApp.id}</strong> under APH 2024–27.
            </p>

            <p style={{ marginTop: '8px' }}>
              Sir/Madam,<br />
              During preliminary scrutiny of your application for <em>{selectedApp.type}</em>, the Scrutiny Committee constituted under the provisions of the AICTE Approval Process Handbook (APH) has identified deficiencies requiring rectification.
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '10px 14px', borderRadius: '2px', margin: '12px 0' }}>
              <strong>Recorded Discrepancy:</strong>
              <div>• {selectedApp.deficiencies?.[0]?.description || 'Shortfall in cadre-ratio faculty and lab equipment manuals.'}</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                Relevant Norm: {selectedApp.deficiencies?.[0]?.clause || 'APH 2024-27 Norms'}
              </div>
            </div>

            <p>
              You are hereby directed to upload supporting rectification documents on the AICTE Portal within <strong>7 days</strong> from the receipt of this communication. Failure to do so will result in transfer to the Standing Appellate Committee (SAC) or rejection.
            </p>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                *This is an automated system generated notice signed digitally.
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong>(Authorized Signatory)</strong><br />
                Regional Officer, AICTE {selectedApp.region}
              </div>
            </div>
          </div>
        );

      case 'EVC_APPOINTMENT':
        return (
          <div className="aicte-dossier" style={{ fontSize: '0.86rem', lineHeight: '1.6' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px solid #1e3a8a', paddingBottom: '12px', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', color: '#1e3a8a' }}>ALL INDIA COUNCIL FOR TECHNICAL EDUCATION</h2>
              <div style={{ fontSize: '0.78rem', color: '#475569' }}>Nelson Mandela Marg, Vasant Kunj, New Delhi-110070</div>
              <div style={{ fontWeight: 700, color: '#1e3a8a', marginTop: '6px' }}>ORDER OF CONSTITUTION - EXPERT VISIT COMMITTEE (EVC)</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div><strong>Order No:</strong> AICTE/EVC/CONF/{selectedApp.id}</div>
              <div><strong>Date:</strong> 23-Oct-2026</div>
            </div>

            <p>
              Under the powers vested under Section 10 of the AICTE Act, 1987, the Competent Authority is pleased to constitute an Expert Visit Committee to conduct on-site verification of <strong>{selectedApp.instituteName}</strong> for <em>{selectedApp.type}</em>.
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '10px 14px', borderRadius: '2px', margin: '12px 0' }}>
              <strong>Mandated Panel:</strong>
              <div>1. Senior Academic Expert (Lead Member - IIT/NIT/Univ)</div>
              <div>2. Senior Architect / Structural Engineer (Civil & Safety Nominee)</div>
              <div>3. AICTE Regional Representative / Bureau Observer</div>
              <div style={{ marginTop: '6px', fontSize: '0.78rem', color: '#16a34a' }}>
                ✓ Conflict of Interest: Negative Declaration Verified across all panel members
              </div>
            </div>

            <p>
              The committee is instructed to complete the inspection and upload the geo-tagged dossier within <strong>48 hours</strong> of visit completion.
            </p>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <strong>Adviser (Approval Bureau)</strong><br />
              AICTE Headquarters, New Delhi
            </div>
          </div>
        );

      case 'SHOW_CAUSE_LEASE':
        return (
          <div className="aicte-dossier" style={{ fontSize: '0.86rem', lineHeight: '1.6' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px solid #b91c1c', paddingBottom: '12px', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', color: '#b91c1c' }}>AICTE URGENT REGULATORY SHOW-CAUSE NOTICE</h2>
              <div style={{ fontSize: '0.78rem', color: '#475569' }}>Approval Process Handbook Regulatory Non-Compliance Action</div>
            </div>

            <p>
              <strong>Subject:</strong> Immediate Show Cause regarding Expiry of 30-Year Registered Land Lease Deed - {selectedApp.instituteName}.
            </p>

            <p style={{ marginTop: '8px' }}>
              Notice is hereby given that the registered lease deed for the technical campus of your institution is due to expire. Under APH Chapter I Clause 2.3, unbroken registered leasehold title is a non-negotiable statutory condition of approval.
            </p>

            <div style={{ background: '#fef2f2', border: '1px solid #f87171', padding: '10px 14px', borderRadius: '2px', margin: '12px 0', color: '#991b1b' }}>
              <strong>Regulatory Consequence:</strong> Extension of Approval (EoA) for Academic Year 2027–28 shall remain in abeyance / frozen until certified registered lease renewal deed is uploaded and approved.
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <strong>By Order of Member Secretary</strong><br />
              AICTE New Delhi
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // CSV Report Generator
  const handleExportCSV = () => {
    const headers = ['ApplicationID', 'InstituteName', 'Region', 'CurrentStage', 'DaysInStage', 'SLA', 'Status', 'EscalationLevel'];
    const rows = applications.map(a => [
      a.id,
      `"${a.instituteName}"`,
      a.region,
      `"${a.currentStage}"`,
      a.daysInCurrentStage,
      a.slaDays,
      a.status,
      a.escalationLevel
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AICTE_APH_Pendency_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="escalation-matrix">
      {/* Top Banner */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-medium)',
        borderRadius: '2px',
        padding: '18px 24px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-critical">
              <Flame size={13} /> Hierarchical Escalation & Notification Engine
            </span>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Automated Follow-up Reduction & Multi-Tier Governance
            </span>
          </div>
          <h2 style={{ fontSize: '1.35rem', marginTop: '6px', color: 'var(--text-main)' }}>
            Automated Escalations, Alerts & Standardized Communications
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
            Auto-dispatched notifications, strict SLA escalation tiers, and standardized regulatory communications.
          </p>
        </div>

        <button 
          className="btn btn-primary btn-sm"
          onClick={handleExportCSV}
          id="btn-export-csv"
        >
          <Download size={14} /> Download National Pendency Report (CSV)
        </button>
      </div>

      {/* Grid: Escalation Tiers & Live Alert Stream */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Tier Diagram */}
        <div className="panel" style={{ margin: 0, borderRadius: '2px' }}>
          <div className="panel-header">
            <h3 className="panel-title">
              <ShieldAlert size={18} color="#ef4444" /> Multi-Tier Escalation Matrix
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              padding: '12px 14px',
              borderRadius: '2px'
            }}>
              <div style={{ fontWeight: 700, color: '#dc2626', display: 'flex', justifyContent: 'space-between' }}>
                <span>Level 3 Escalation</span>
                <span>SLA + 8 Days</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#991b1b', marginTop: '4px' }}>
                <strong>Authority:</strong> AICTE Member Secretary & Apex Council
              </div>
              <div style={{ fontSize: '0.72rem', color: '#b91c1c' }}>
                Action: Automated emergency docket, punitive notice to RO, daily flash report.
              </div>
            </div>

            <div style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              padding: '12px 14px',
              borderRadius: '2px'
            }}>
              <div style={{ fontWeight: 700, color: '#d97706', display: 'flex', justifyContent: 'space-between' }}>
                <span>Level 2 Escalation</span>
                <span>SLA + 5 Days</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#92400e', marginTop: '4px' }}>
                <strong>Authority:</strong> Adviser (Approval Bureau), AICTE HQ
              </div>
              <div style={{ fontSize: '0.72rem', color: '#b45309' }}>
                Action: Directive memo to Regional Officer to reassign or resolve bottleneck.
              </div>
            </div>

            <div style={{
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              padding: '12px 14px',
              borderRadius: '2px'
            }}>
              <div style={{ fontWeight: 700, color: '#0284c7', display: 'flex', justifyContent: 'space-between' }}>
                <span>Level 1 Escalation</span>
                <span>SLA + 2 Days</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#0369a1', marginTop: '4px' }}>
                <strong>Authority:</strong> Regional Officer (RO)
              </div>
              <div style={{ fontSize: '0.72rem', color: '#0284c7' }}>
                Action: Direct SMS/Email reminder to Scrutiny Committee / Lead EVC Expert.
              </div>
            </div>
          </div>
        </div>

        {/* Live Notification Feed */}
        <div className="panel" style={{ margin: 0 }}>
          <div className="panel-header">
            <div>
              <h3 className="panel-title">
                <Bell size={18} color="#38bdf8" /> Real-Time Automated Alerts & Escalation Feed
              </h3>
              <p style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                System-generated notifications dispatched across SMS, email, and portal webhooks
              </p>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button 
                className={`btn btn-sm ${severityFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSeverityFilter('ALL')}
              >
                All
              </button>
              <button 
                className={`btn btn-sm ${severityFilter === 'critical' ? 'btn-danger' : 'btn-secondary'}`}
                onClick={() => setSeverityFilter('critical')}
              >
                Critical
              </button>
              <button 
                className={`btn btn-sm ${severityFilter === 'warning' ? 'btn-warning' : 'btn-secondary'}`}
                onClick={() => setSeverityFilter('warning')}
              >
                Warnings
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '360px', overflowY: 'auto' }}>
            {filteredNotifs.map(n => (
              <div 
                key={n.id}
                style={{
                  background: n.read ? '#f8fafc' : '#ffffff',
                  border: `1px solid ${
                    n.severity === 'critical' ? '#fca5a5' :
                    n.severity === 'warning' ? '#fde68a' : 'var(--border-subtle)'
                  }`,
                  borderRadius: '2px',
                  padding: '12px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '12px',
                  boxShadow: n.read ? 'none' : '0 1px 3px rgba(15, 23, 42, 0.04)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span className={`badge ${
                      n.severity === 'critical' ? 'badge-critical' :
                      n.severity === 'warning' ? 'badge-warning' : 'badge-info'
                    }`}>
                      {n.severity.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{n.timestamp}</span>
                    {n.region && <span className="badge badge-info">{n.region}</span>}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>{n.title}</div>
                  <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '2px' }}>{n.message}</div>
                </div>

                {!n.read && (
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => onMarkNotificationRead(n.id)}
                    title="Mark as acknowledged"
                  >
                    <CheckCircle2 size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Standardized Communication Generator */}
      <div className="panel" style={{ borderRadius: '2px' }}>
        <div className="panel-header">
          <div>
            <h3 className="panel-title">
              <FileText size={20} color="#059669" /> Standardized Communication & Order Generator
            </h3>
            <p style={{ fontSize: '0.76rem', color: '#64748b' }}>
              Automated drafting of statutory deficiency memos, EVC appointment orders, and show-cause notices
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="form-select"
              style={{ width: '220px', fontSize: '0.78rem', borderRadius: '2px' }}
            >
              <option value="DEFICIENCY_MEMO">Deficiency Memorandum Letter</option>
              <option value="EVC_APPOINTMENT">EVC Panel Constitution Order</option>
              <option value="SHOW_CAUSE_LEASE">Show Cause Notice (Lease Expiry)</option>
            </select>

            <select
              value={previewAppId}
              onChange={(e) => setPreviewAppId(e.target.value)}
              className="form-select"
              style={{ width: '240px', fontSize: '0.78rem', borderRadius: '2px' }}
            >
              {applications.map(a => (
                <option key={a.id} value={a.id}>{a.id} - {a.instituteName.slice(0, 24)}...</option>
              ))}
            </select>

            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => window.print()}
            >
              <Printer size={14} /> Print Document
            </button>
          </div>
        </div>

        {/* Live Document Preview Box */}
        <div style={{
          background: '#f1f5f9',
          padding: '24px',
          borderRadius: '2px',
          border: '1px solid var(--border-medium)',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{ maxWidth: '780px', width: '100%' }}>
            {renderTemplateContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
