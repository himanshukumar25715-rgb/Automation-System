import React from 'react';
import { 
  BarChart3, 
  MapPin, 
  Download, 
  Printer, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  FileText,
  AlertTriangle,
  Building2
} from 'lucide-react';
import { AICTE_REGIONS } from '../data/mockData';

export function RegionReportsView({ applications, undertakings, leaseDocs, currentUser }) {
  const regionCode = currentUser?.region || 'WRO';
  const regionObj = AICTE_REGIONS.find(r => r.code === regionCode) || AICTE_REGIONS[2];

  // Scoped to Region
  const regApps = applications.filter(a => a.region === regionCode);
  const regUndertakings = undertakings.filter(u => u.region === regionCode);
  const regDocs = leaseDocs.filter(d => d.region === regionCode);

  const total = regApps.length;
  const overdue = regApps.filter(a => a.daysInCurrentStage > a.slaDays).length;
  const complianceRate = total > 0 ? (((total - overdue) / total) * 100).toFixed(1) : 100;
  const avgStageDays = total > 0 
    ? (regApps.reduce((acc, curr) => acc + curr.daysInCurrentStage, 0) / total).toFixed(1)
    : 0;

  const handleExportCSV = () => {
    const headers = ['ApplicationID', 'InstituteName', 'City', 'Type', 'Stage', 'DaysInStage', 'SLA', 'Status'];
    const rows = regApps.map(a => [
      a.id,
      `"${a.instituteName}"`,
      a.city,
      `"${a.type}"`,
      `"${a.currentStage}"`,
      a.daysInCurrentStage,
      a.slaDays,
      a.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `AICTE_${regionCode}_Regional_Performance_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="region-reports-view">
      {/* Top Banner */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-medium)',
        borderRadius: '2px',
        padding: '20px 24px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-success">
              <MapPin size={13} /> Regional Jurisdiction Performance
            </span>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              AICTE {regionObj.name} ({regionObj.hq})
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>
            {regionCode} Regional SLA Compliance & Processing Scorecard
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
            Consolidated metrics for technical institutions, scrutiny turnaround times, and undertaking fulfillment within {regionObj.states.join(', ')}.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
            <Printer size={14} /> Print Report
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleExportCSV} id="btn-export-reg-report">
            <Download size={14} /> Export Regional CSV
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="kpi-grid" style={{ marginBottom: '24px' }}>
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Regional Active Applications</span>
            <div className="kpi-icon-wrap" style={{ color: '#38bdf8' }}>
              <FileText size={18} />
            </div>
          </div>
          <div className="kpi-value">{total}</div>
          <div className="kpi-subtext">Jurisdiction: {regionCode}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">SLA Compliance Rate</span>
            <div className="kpi-icon-wrap" style={{ color: '#34d399' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#34d399' }}>{complianceRate}%</div>
          <div className="kpi-subtext">{total - overdue} of {total} within SLA</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Avg Processing Turnaround</span>
            <div className="kpi-icon-wrap" style={{ color: '#c084fc' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-value">{avgStageDays} Days</div>
          <div className="kpi-subtext">Benchmark: &le;7.0 days</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Undertakings In Region</span>
            <div className="kpi-icon-wrap" style={{ color: '#fbbf24' }}>
              <Building2 size={18} />
            </div>
          </div>
          <div className="kpi-value">{regUndertakings.length}</div>
          <div className="kpi-subtext">Conditional compliances</div>
        </div>
      </div>

      {/* Regional Applications Table */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">
              <FileText size={18} color="#38bdf8" /> Applications Scoped to {regionCode}
            </h3>
            <p style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
              Strict regional isolation: Only applications belonging to {regionObj.name} are accessible
            </p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>App ID</th>
                <th>Institution</th>
                <th>Location</th>
                <th>Category</th>
                <th>Current Stage</th>
                <th>Stage Aging</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {regApps.map(a => {
                const isOverdue = a.daysInCurrentStage > a.slaDays;
                return (
                  <tr key={a.id}>
                    <td>
                      <span style={{ fontWeight: 700, color: '#38bdf8' }}>{a.id}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{a.instituteName}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>ID: {a.instituteId}</div>
                    </td>
                    <td>{a.city}, {a.state}</td>
                    <td style={{ fontSize: '0.78rem' }}>{a.type}</td>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{a.currentStage}</span>
                    </td>
                    <td>
                      <span className={`sla-pill ${isOverdue ? 'sla-breached' : 'sla-normal'}`}>
                        {a.daysInCurrentStage} / {a.slaDays} Days
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${isOverdue ? 'badge-critical' : 'badge-info'}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
