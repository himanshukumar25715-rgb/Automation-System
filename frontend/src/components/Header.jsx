import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Clock, 
  Bell, 
  UserCheck, 
  FileText, 
  Calendar, 
  Sliders, 
  AlertTriangle, 
  Layers,
  History,
  FileCheck,
  Cpu
} from 'lucide-react';
import { USER_ROLES } from '../data/mockData';

export function Header({ 
  activeTab, 
  setActiveTab, 
  currentRole, 
  setCurrentRole, 
  simDaysOffset, 
  unreadCount,
  onOpenNotifications,
  overdueCount
}) {
  const getSimulatedDate = () => {
    const d = new Date(2026, 9, 23); // 23 Oct 2026
    d.setDate(d.getDate() + simDaysOffset);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard & Pendency', icon: Layers },
    { id: 'workflows', label: 'Approval Workflows', icon: FileText, badge: overdueCount > 0 ? overdueCount : null },
    { id: 'evc', label: 'EVC Scheduling', icon: Calendar },
    { id: 'undertakings', label: 'Institutional Undertakings', icon: ShieldCheck },
    { id: 'leases', label: 'Lease & Doc Validity', icon: FileCheck },
    { id: 'escalations', label: 'Escalations & Alerts', icon: AlertTriangle },
    { id: 'cpu', label: 'CPU Dispatcher', icon: Cpu },
    { id: 'audit', label: 'Audit Trail', icon: History },
    { id: 'rules', label: 'APH Config', icon: Sliders },
  ];

  return (
    <header>
      {/* Top Government Strip */}
      <div className="aicte-top-banner">
        <div className="aicte-emblem-cluster">
          <span className="national-crest">
            <Building2 size={15} /> All India Council for Technical Education (AICTE)
          </span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span>Ministry of Education, Government of India</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span style={{ color: '#38bdf8' }}>Approval Process Handbook (APH) 2024–27</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="sim-time-badge">
            <Clock size={13} />
            <span>Simulated Date: <strong>{getSimulatedDate()}</strong></span>
            {simDaysOffset > 0 && <span style={{ opacity: 0.8 }}>(+{simDaysOffset}d advanced)</span>}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            Portal v2.6-SIH
          </div>
        </div>
      </div>

      {/* Main Brand Navigation Bar */}
      <div className="main-navbar">
        <div className="brand-section">
          <div className="brand-logo-disc">
            <ShieldCheck size={26} color="#ffffff" />
          </div>
          <div>
            <div className="brand-title">
              AICTE PRAGATI-NAV
              <span className="brand-tag">APH 360</span>
            </div>
            <div className="brand-subtitle">
              Automated Approval Workflow & Institutional Compliance Digital Ecosystem
            </div>
          </div>
        </div>

        {/* Tab Pills */}
        <nav className="nav-tab-pills">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-pill-btn ${isActive ? 'active' : ''}`}
                id={`nav-${item.id}`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{
                    background: '#ef4444',
                    color: 'white',
                    padding: '1px 6px',
                    borderRadius: '999px',
                    fontSize: '0.68rem',
                    fontWeight: 700
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions & Role Switcher */}
        <div className="nav-actions">
          {/* Role Switcher */}
          <div className="role-switcher-box" title="Switch active AICTE actor role to test role-based permissions">
            <UserCheck size={16} color="#38bdf8" />
            <div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>Active Role</div>
              <select
                className="role-select"
                value={currentRole.id}
                onChange={(e) => {
                  const selected = USER_ROLES.find(r => r.id === e.target.value);
                  if (selected) setCurrentRole(selected);
                }}
                id="role-switcher-select"
              >
                {USER_ROLES.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.badge}: {role.officer}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notification Bell */}
          <button
            className="btn-notif-trigger"
            onClick={onOpenNotifications}
            title="View Automated Alerts & Escalations"
            id="notifications-bell-btn"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="notif-badge-pill">{unreadCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
