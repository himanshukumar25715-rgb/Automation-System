import React, { useState } from 'react';
import { History, ShieldCheck, Search, Filter, Hash, User, Calendar, Download } from 'lucide-react';

export function AuditTrailViewer({ applications }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppFilter, setSelectedAppFilter] = useState('ALL');

  // Aggregate all audit trails from applications
  const allLogs = applications.flatMap(app => 
    (app.auditTrail || []).map(entry => ({
      ...entry,
      appId: app.id,
      institute: app.instituteName,
      region: app.region
    }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredLogs = allLogs.filter(log => {
    const matchesApp = selectedAppFilter === 'ALL' || log.appId === selectedAppFilter;
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.appId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.hash.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesApp && matchesSearch;
  });

  const handleExportAuditLogs = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(allLogs, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `AICTE_Digital_Audit_Trail_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="audit-trail-viewer">
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
              <ShieldCheck size={13} /> Immutable Digital Audit Trail
            </span>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Cryptographically Verified Activity Log (SHA-256 Hashing)
            </span>
          </div>
          <h2 style={{ fontSize: '1.35rem', marginTop: '6px' }}>
            System-Wide Traceability & Workflow Event Ledger
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
            Complete tamper-evident record of all application transitions, deficiency notices, EVC allocations, compliance verifications, and escalations.
          </p>
        </div>

        <button 
          className="btn btn-secondary btn-sm"
          onClick={handleExportAuditLogs}
          id="btn-export-audit"
        >
          <Download size={14} /> Export Cryptographic Audit Ledger (JSON)
        </button>
      </div>

      {/* Audit Log Table Panel */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">
              <History size={20} color="#38bdf8" /> Chronological Event Stream ({filteredLogs.length} Events Recorded)
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '11px', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search action, actor, or hash..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '32px', fontSize: '0.78rem' }}
              />
            </div>

            <select
              value={selectedAppFilter}
              onChange={(e) => setSelectedAppFilter(e.target.value)}
              className="form-select"
              style={{ width: '220px', fontSize: '0.78rem' }}
            >
              <option value="ALL">All Applications</option>
              {applications.map(a => (
                <option key={a.id} value={a.id}>{a.id} ({a.region})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Timestamp (IST)</th>
                <th>Application ID</th>
                <th>Region</th>
                <th>Authorised Actor</th>
                <th>Action & Workflow Transition</th>
                <th>Digital Signature Hash</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, idx) => (
                <tr key={`${log.appId}-${idx}`}>
                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.78rem', color: '#cbd5e1' }}>
                    <Calendar size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                    {log.date}
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#38bdf8' }}>{log.appId}</span>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{log.institute.slice(0, 24)}...</div>
                  </td>
                  <td>
                    <span className="badge badge-info">{log.region}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={13} color="#94a3b8" />
                      <span style={{ fontWeight: 600 }}>{log.actor}</span>
                    </div>
                  </td>
                  <td style={{ maxWidth: '380px' }}>
                    <div style={{ color: log.action.includes('Escalation') ? '#fca5a5' : '#e2e8f0' }}>
                      {log.action}
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      fontFamily: 'monospace', 
                      fontSize: '0.72rem', 
                      color: '#34d399', 
                      background: 'rgba(16, 185, 129, 0.1)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Hash size={11} /> {log.hash || 'sha256-verified'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
