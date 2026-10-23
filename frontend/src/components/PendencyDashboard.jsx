import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  AlertCircle, 
  ArrowRight, 
  Search, 
  Calendar,
  Clock,
  Layers,
  MapPin,
  ExternalLink,
  Plus
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

  const totalCount = applications.length;
  const passedCount = applications.filter(a => a.currentStage === 'Council Approval' || a.currentStage === 'SAC / SHC Hearing').length;
  const reviewCount = applications.filter(a => a.currentStage === 'Preliminary Scrutiny' || a.currentStage.includes('EVC')).length;
  const overdueCount = applications.filter(a => a.status === 'Overdue' || a.status === 'Critical Alert' || a.daysInCurrentStage > a.slaDays).length;

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
      {/* 1. Page Header (Inspired by the Clean Modern Screenshot) */}
      <div className="page-header-row">
        <div>
          <div className="page-overline">
            OVERVIEW
          </div>
          <h1 className="page-title">
            Dashboard
          </h1>
          <p className="page-subtitle">
            AICTE Approval Workflows • {currentRole?.badge} ({currentRole?.officer})
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            className="btn-dark"
            onClick={() => onNavigateTab('evc')}
          >
            <Calendar size={15} />
            <span>EVC Schedule</span>
          </button>
          
          <button 
            className="btn-mint"
            onClick={() => onNavigateTab('applications')}
            id="btn-new-verification-dashboard"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Workflow Queue</span>
          </button>
        </div>
      </div>

      {/* 2. 4-Card Metric Grid (Directly matching the 4 KPI cards from the reference image) */}
      <div className="metric-grid">
        {/* Metric 1: Total Documents / Applications */}
        <div className="metric-card">
          <div className="metric-card-left">
            <span className="metric-label">TOTAL APPLICATIONS</span>
            <span className="metric-value">{totalCount}</span>
          </div>
          <div className="metric-icon-wrap" style={{ color: 'var(--text-muted)' }}>
            <FileText size={32} strokeWidth={1.8} />
          </div>
        </div>

        {/* Metric 2: Auto-Passed / Compliant */}
        <div className="metric-card">
          <div className="metric-card-left">
            <span className="metric-label">AUTO-PASSED / COMPLIANT</span>
            <span className="metric-value">{passedCount}</span>
          </div>
          <div className="metric-icon-wrap" style={{ color: 'var(--mint-500)' }}>
            <ShieldCheck size={32} strokeWidth={1.8} />
          </div>
        </div>

        {/* Metric 3: Needs Review */}
        <div className="metric-card">
          <div className="metric-card-left">
            <span className="metric-label">NEEDS REVIEW / SCRUTINY</span>
            <span className="metric-value">{reviewCount}</span>
          </div>
          <div className="metric-icon-wrap" style={{ color: 'var(--amber-400)' }}>
            <AlertTriangle size={32} strokeWidth={1.8} />
          </div>
        </div>

        {/* Metric 4: Failed / SLA Overdue */}
        <div className="metric-card">
          <div className="metric-card-left">
            <span className="metric-label">FAILED / SLA OVERDUE</span>
            <span className="metric-value">{overdueCount}</span>
          </div>
          <div className="metric-icon-wrap" style={{ color: 'var(--ruby-500)' }}>
            <AlertCircle size={32} strokeWidth={1.8} />
          </div>
        </div>
      </div>

      {/* 3. Section Header: RECENT APPLICATIONS & View all -> */}
      <div className="section-header-clean">
        <span className="section-label">RECENT APPLICATIONS</span>
        <button 
          className="section-link"
          onClick={() => onNavigateTab('applications')}
          id="btn-view-all-apps"
        >
          <span>View all</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 4. Filter Bar */}
      <div className="filter-bar-clean">
        <div className="search-input-wrap">
          <Search size={15} />
          <input
            type="text"
            className="search-input-clean"
            placeholder="Search by institute name, application ID, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select 
          className="select-clean"
          value={selectedRegionFilter}
          onChange={(e) => setSelectedRegionFilter(e.target.value)}
        >
          <option value="ALL">All Regions (8 Offices)</option>
          {AICTE_REGIONS.map(r => (
            <option key={r.code} value={r.code}>{r.code} - {r.name}</option>
          ))}
        </select>
      </div>

      {/* 5. Recent Applications Table */}
      {filteredApps.length === 0 ? (
        <div className="empty-state-box">
          <FileText size={36} color="var(--text-dim)" />
          <p className="empty-state-text">
            No applications match your filter criteria. Try resetting the search or selecting another region.
          </p>
          <button 
            className="btn-dark"
            onClick={() => { setSearchTerm(''); setSelectedRegionFilter('ALL'); }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="table-wrap-clean" style={{ marginBottom: '32px' }}>
          <table className="table-clean">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Institution</th>
                <th>Region</th>
                <th>Stage</th>
                <th>Days / SLA</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.slice(0, 6).map(app => {
                const isOverdue = app.daysInCurrentStage > app.slaDays;
                return (
                  <tr key={app.id}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-sans)' }}>
                        {app.id}
                      </span>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{app.instituteName}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                          {app.city}, {app.state} • {app.type}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="status-pill purple">
                        {app.region}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        {app.currentStage}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: isOverdue ? 'var(--ruby-600)' : 'var(--emerald-600)'
                      }}>
                        {app.daysInCurrentStage}d / {app.slaDays}d
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${
                        app.status === 'Approved' ? 'mint' :
                        app.status === 'Overdue' || app.status === 'Critical Alert' ? 'ruby' :
                        app.status.includes('Deficiency') ? 'amber' : 'cyan'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-dark"
                        style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '2px' }}
                        onClick={() => onSelectApplication(app)}
                      >
                        <span>Inspect</span>
                        <ArrowRight size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 6. Regional Jurisdictions Performance Grid */}
      <div className="section-header-clean">
        <span className="section-label">REGIONAL PERFORMANCE STATUS (8 OFFICES)</span>
        <button 
          className="section-link"
          onClick={() => onNavigateTab('region_reports')}
        >
          <span>Detailed reports</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '14px',
        marginBottom: '20px'
      }}>
        {regionStats.map(reg => (
          <div 
            key={reg.code}
            className="panel-clean"
            style={{ padding: '16px 18px', cursor: 'pointer', borderRadius: '2px' }}
            onClick={() => { setSelectedRegionFilter(reg.code); }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.92rem' }}>
                {reg.code} ({reg.hq})
              </span>
              <span className={`status-pill ${
                reg.bottleneck === 'Optimal' ? 'mint' :
                reg.bottleneck === 'Moderate Load' ? 'amber' : 'ruby'
              }`}>
                {reg.bottleneck}
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginBottom: '8px' }}>
              {reg.name}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Active Cases: <strong style={{ color: 'var(--text-main)' }}>{reg.count}</strong></span>
              <span style={{ color: reg.overdue > 0 ? 'var(--ruby-600)' : 'var(--text-dim)' }}>
                Overdue: <strong>{reg.overdue}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
