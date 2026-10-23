import React, { useState } from 'react';
import { 
  Layers, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  FileText, 
  TrendingUp, 
  Users, 
  ArrowRight,
  ShieldAlert,
  Flame,
  Calendar,
  Search
} from 'lucide-react';
import { AICTE_REGIONS } from '../data/mockData';

export function PendencyDashboard({ 
  applications, 
  undertakings, 
  leaseDocs, 
  onSelectApplication,
  onNavigateTab,
  currentRole
}) {
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculations
  const filteredApps = applications.filter(app => {
    const matchesRegion = selectedRegionFilter === 'ALL' || app.region === selectedRegionFilter;
    const matchesSearch = app.instituteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const totalActive = applications.length;
  const underScrutiny = applications.filter(a => a.currentStage === 'Preliminary Scrutiny').length;
  const underEvc = applications.filter(a => a.currentStage.includes('EVC')).length;
  const underSac = applications.filter(a => a.currentStage.includes('SAC')).length;
  const overdueCases = applications.filter(a => a.status === 'Overdue' || a.status === 'Critical Alert' || a.daysInCurrentStage > a.slaDays);
  const approvedCases = applications.filter(a => a.currentStage === 'Council Approval');

  // Documents & Undertakings KPI
  const criticalDocs = leaseDocs.filter(d => d.daysRemaining <= 90);
  const pendingUndertakings = undertakings.filter(u => u.status !== 'Verified & Closed');

  // Region stats
  const regionStats = AICTE_REGIONS.map(reg => {
    const appsInReg = applications.filter(a => a.region === reg.code);
    const overdueInReg = appsInReg.filter(a => a.status === 'Overdue' || a.status === 'Critical Alert' || a.daysInCurrentStage > a.slaDays);
    const avgDays = appsInReg.length > 0 
      ? (appsInReg.reduce((acc, curr) => acc + curr.daysInCurrentStage, 0) / appsInReg.length).toFixed(1)
      : 0;

    let bottleneck = 'Optimal';
    if (overdueInReg.length >= 2 || avgDays > 7) {
      bottleneck = 'High Bottleneck';
    } else if (overdueInReg.length === 1 || avgDays > 5) {
      bottleneck = 'Moderate Load';
    }

    return {
      ...reg,
      count: appsInReg.length,
      overdue: overdueInReg.length,
      avgDays,
      bottleneck
    };
  });

  return (
    <div className="pendency-dashboard">
      {/* Top Banner with Role-Specific Overview */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-info">{currentRole.badge}</span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Logged in as: <strong>{currentRole.officer}</strong> ({currentRole.designation})</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', marginTop: '6px' }}>
            National APH Approval Pendency & Workflow Monitor
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
            Centralized tracking of application stages, SLA compliance, inspection scheduling, and institutional undertakings across all 8 AICTE Regions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigateTab('workflows')}
          >
            <FileText size={15} /> View All Applications ({totalActive})
          </button>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => onNavigateTab('evc')}
          >
            <Calendar size={15} /> EVC Inspection Hub
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Active Applications</span>
            <div className="kpi-icon-wrap" style={{ color: '#38bdf8' }}>
              <FileText size={18} />
            </div>
          </div>
          <div className="kpi-value">{totalActive}</div>
          <div className="kpi-subtext">Across 8 Regional Offices</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Under Scrutiny</span>
            <div className="kpi-icon-wrap" style={{ color: '#818cf8' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-value">{underScrutiny}</div>
          <div className="kpi-subtext">Preliminary checklist stage</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">EVC Scheduled / Active</span>
            <div className="kpi-icon-wrap" style={{ color: '#c084fc' }}>
              <Users size={18} />
            </div>
          </div>
          <div className="kpi-value">{underEvc}</div>
          <div className="kpi-subtext">Physical / Virtual Inspections</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">SAC / SHC Appeals</span>
            <div className="kpi-icon-wrap" style={{ color: '#fb923c' }}>
              <ShieldAlert size={18} />
            </div>
          </div>
          <div className="kpi-value">{underSac}</div>
          <div className="kpi-subtext">Standing Appellate Committee</div>
        </div>

        <div className="kpi-card alert-ruby">
          <div className="kpi-header">
            <span className="kpi-title" style={{ color: '#f87171' }}>SLA Overdue Breaches</span>
            <div className="kpi-icon-wrap" style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.15)' }}>
              <Flame size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#f87171' }}>{overdueCases.length}</div>
          <div className="kpi-subtext" style={{ color: '#fca5a5' }}>
            Auto-escalated to RO / Bureau
          </div>
        </div>

        <div className="kpi-card alert-amber">
          <div className="kpi-header">
            <span className="kpi-title" style={{ color: '#fbbf24' }}>Critical Lease Expiry</span>
            <div className="kpi-icon-wrap" style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)' }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#fbbf24' }}>{criticalDocs.length}</div>
          <div className="kpi-subtext" style={{ color: '#fde68a' }}>
            &le;90 days validity remaining
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Pending Undertakings</span>
            <div className="kpi-icon-wrap" style={{ color: '#34d399' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="kpi-value">{pendingUndertakings.length}</div>
          <div className="kpi-subtext">Time-bound conditions tracked</div>
        </div>
      </div>

      {/* Grid: Regional Pendency Matrix & Stage Funnel */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Regional Matrix */}
        <div className="panel" style={{ margin: 0 }}>
          <div className="panel-header">
            <div>
              <h3 className="panel-title">
                <MapPin size={20} color="#38bdf8" /> AICTE Region-Wise Pendency & Workload Matrix
              </h3>
              <p style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                Real-time bottleneck identification across the 8 AICTE Regional Offices (Click a region to filter applications)
              </p>
            </div>
            {selectedRegionFilter !== 'ALL' && (
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedRegionFilter('ALL')}
              >
                Clear Region Filter ({selectedRegionFilter})
              </button>
            )}
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Region</th>
                  <th>Headquarters</th>
                  <th>Active Cases</th>
                  <th>Avg Aging</th>
                  <th>SLA Overdue</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {regionStats.map(reg => {
                  const isSelected = selectedRegionFilter === reg.code;
                  return (
                    <tr 
                      key={reg.code} 
                      style={{ 
                        cursor: 'pointer',
                        background: isSelected ? 'rgba(56, 189, 248, 0.08)' : undefined 
                      }}
                      onClick={() => setSelectedRegionFilter(isSelected ? 'ALL' : reg.code)}
                    >
                      <td>
                        <strong>{reg.code}</strong>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{reg.name}</div>
                      </td>
                      <td>{reg.hq}</td>
                      <td>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{reg.count}</span>
                      </td>
                      <td>
                        <span style={{ color: reg.avgDays > 7 ? '#f87171' : '#cbd5e1' }}>
                          {reg.avgDays} days
                        </span>
                      </td>
                      <td>
                        {reg.overdue > 0 ? (
                          <span className="badge badge-critical">
                            <Flame size={12} /> {reg.overdue} Breached
                          </span>
                        ) : (
                          <span className="badge badge-success">0 Overdue</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${
                          reg.bottleneck === 'High Bottleneck' ? 'badge-critical' :
                          reg.bottleneck === 'Moderate Load' ? 'badge-warning' : 'badge-info'
                        }`}>
                          {reg.bottleneck}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: '#38bdf8', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Filter <ArrowRight size={13} />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stage Funnel / Health Summary */}
        <div className="panel" style={{ margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="panel-header">
              <h3 className="panel-title">
                <TrendingUp size={20} color="#34d399" /> Processing Stage Funnel
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span>Preliminary Scrutiny</span>
                  <span style={{ fontWeight: 700 }}>{underScrutiny} cases ({((underScrutiny/totalActive)*100).toFixed(0)}%)</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${(underScrutiny/totalActive)*100}%`, height: '100%', background: '#38bdf8' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span>EVC Inspection Stage</span>
                  <span style={{ fontWeight: 700 }}>{underEvc} cases ({((underEvc/totalActive)*100).toFixed(0)}%)</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${(underEvc/totalActive)*100}%`, height: '100%', background: '#c084fc' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span>SAC / SHC Hearing</span>
                  <span style={{ fontWeight: 700 }}>{underSac} cases ({((underSac/totalActive)*100).toFixed(0)}%)</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${(underSac/totalActive)*100}%`, height: '100%', background: '#fb923c' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span>Council Approval / Final Orders</span>
                  <span style={{ fontWeight: 700 }}>{approvedCases.length} cases ({((approvedCases.length/totalActive)*100).toFixed(0)}%)</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${(approvedCases.length/totalActive)*100}%`, height: '100%', background: '#10b981' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Regulatory Safeguard note */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '8px',
            padding: '12px',
            marginTop: '20px',
            fontSize: '0.74rem',
            color: '#94a3b8'
          }}>
            <div style={{ fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
              <ShieldAlert size={14} /> AICTE Regulatory Safeguard
            </div>
            Workflows and alerts support statutory processing under the Approval Process Handbook. Final regulatory sanctions are reserved for the Competent Council.
          </div>
        </div>
      </div>

      {/* Priority Action Watchlist Table */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">
              <Flame size={20} color="#ef4444" /> Urgent Action & Overdue SLA Watchlist
            </h3>
            <p style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
              Cases currently requiring immediate officer intervention or automated Level 1/2/3 escalation
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search institute or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '34px', fontSize: '0.78rem' }}
              />
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Institution Details</th>
                <th>Region</th>
                <th>Current Stage</th>
                <th>Time in Stage</th>
                <th>SLA Limit</th>
                <th>Escalation Level</th>
                <th>Responsible Officer</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.slice(0, 6).map(app => {
                const isOverdue = app.daysInCurrentStage > app.slaDays;
                return (
                  <tr key={app.id}>
                    <td>
                      <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)', color: '#38bdf8' }}>
                        {app.id}
                      </span>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Applied: {app.appliedDate}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{app.instituteName}</div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{app.city}, {app.state} • {app.type}</div>
                    </td>
                    <td>
                      <span className="badge badge-info">{app.region}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{app.currentStage}</span>
                    </td>
                    <td>
                      <span className={`sla-pill ${isOverdue ? 'sla-breached' : 'sla-normal'}`}>
                        <Clock size={12} /> {app.daysInCurrentStage} Days
                      </span>
                    </td>
                    <td>{app.slaDays} Days</td>
                    <td>
                      {app.escalationLevel === 3 ? (
                        <span className="badge badge-critical">Level 3 (Member Secy)</span>
                      ) : app.escalationLevel === 2 ? (
                        <span className="badge badge-critical">Level 2 (Bureau Head)</span>
                      ) : app.escalationLevel === 1 ? (
                        <span className="badge badge-warning">Level 1 (Regional Officer)</span>
                      ) : (
                        <span className="badge badge-success">Normal SLA</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{app.assignedOfficer}</td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => onSelectApplication(app)}
                        id={`btn-open-case-${app.id}`}
                      >
                        Inspect Case
                      </button>
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
