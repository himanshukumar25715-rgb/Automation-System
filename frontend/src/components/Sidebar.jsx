import React from 'react';
import { 
  Layers, 
  FileText, 
  ShieldCheck, 
  FileCheck, 
  Bell, 
  Calendar, 
  BarChart3, 
  History, 
  AlertTriangle, 
  Sliders, 
  Network,
  GraduationCap,
  Building2,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { Role } from '../lib/permissions';

export function Sidebar({ 
  activeTab, 
  setActiveTab, 
  currentRole, 
  onOpenSwitchRole,
  counts 
}) {
  const roleType = currentRole?.role || Role.BUREAU_HEAD;

  let navItems = [];

  if (roleType === Role.INSTITUTION) {
    navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Layers },
      { id: 'applications', label: 'My Applications', icon: FileText, badge: counts.applications },
      { id: 'undertakings', label: 'My Undertakings', icon: ShieldCheck, badge: counts.undertakings },
      { id: 'documents', label: 'My Documents', icon: FileCheck, badge: counts.criticalDocs > 0 ? `${counts.criticalDocs} urgent` : null, badgeColor: '#ef4444' },
      { id: 'alerts', label: 'Alerts', icon: Bell, badge: counts.alerts > 0 ? counts.alerts : null },
    ];
  } else if (roleType === Role.REGIONAL_OFFICER) {
    navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Layers },
      { id: 'applications', label: 'Applications', icon: FileText, badge: counts.applications },
      { id: 'evc', label: 'EVC Scheduling', icon: Calendar, badge: counts.evcQueue > 0 ? counts.evcQueue : null, badgeColor: '#fbbf24' },
      { id: 'undertakings', label: 'Undertakings', icon: ShieldCheck, badge: counts.undertakingsPendingVerify > 0 ? counts.undertakingsPendingVerify : null },
      { id: 'documents', label: 'Documents', icon: FileCheck, badge: counts.criticalDocs > 0 ? counts.criticalDocs : null, badgeColor: '#ef4444' },
      { id: 'alerts', label: 'Alerts', icon: Bell, badge: counts.alerts > 0 ? counts.alerts : null },
      { id: 'region_reports', label: 'Region Reports', icon: BarChart3 },
      { id: 'audit', label: 'Audit Trail', icon: History },
    ];
  } else {
    navItems = [
      { id: 'dashboard', label: 'National Dashboard', icon: Layers },
      { id: 'applications', label: 'All Applications', icon: FileText, badge: counts.applications },
      { id: 'escalations', label: 'Escalations', icon: AlertTriangle, badge: counts.escalations > 0 ? counts.escalations : null, badgeColor: '#ef4444' },
      { id: 'reports', label: 'Reports', icon: BarChart3 },
      { id: 'audit', label: 'Audit Trail', icon: History },
      { id: 'rules', label: 'Rules & Policy', icon: Sliders },
      { id: 'integrations', label: 'Integrations', icon: Network },
    ];
  }

  return (
    <aside style={{
      width: '240px',
      background: '#ffffff',
      borderRight: '1px solid var(--border-medium)',
      boxShadow: '2px 0 10px rgba(15, 23, 42, 0.04)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      flexShrink: 0,
      minHeight: 'calc(100vh - 60px)',
      padding: '16px 12px'
    }}>
      <div>
        {/* Navigation Category Label */}
        <div style={{
          fontSize: '0.68rem',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--text-dim)',
          fontWeight: 700,
          padding: '6px 12px 10px 12px'
        }}>
          {roleType === Role.INSTITUTION ? 'Institution' :
           roleType === Role.REGIONAL_OFFICER ? `Regional Desk (${currentRole?.region})` :
           'National Governance'}
        </div>

        {/* Sidebar Nav Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                id={`sidebar-${item.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '2px',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  fontFamily: 'var(--font-sans)',
                  color: isActive ? '#ffffff' : '#334155',
                  background: isActive ? '#0f172a' : 'transparent',
                  border: isActive ? '1px solid #0f172a' : '1px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 1px 3px rgba(15, 23, 42, 0.2)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={16} color={isActive ? '#ffffff' : 'var(--text-dim)'} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span style={{
                    background: item.badgeColor ? '#fee2e2' : isActive ? '#334155' : '#f1f5f9',
                    color: item.badgeColor ? '#b91c1c' : isActive ? '#ffffff' : '#475569',
                    border: item.badgeColor ? '1px solid #fecaca' : '1px solid var(--border-subtle)',
                    padding: '1px 6px',
                    borderRadius: '2px',
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
      </div>

      {/* Switch Role Quick Button at Bottom */}
      <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
        <button
          onClick={onOpenSwitchRole}
          className="btn-dark"
          style={{ width: '100%', fontSize: '0.78rem', padding: '8px 12px', justifyContent: 'space-between', borderRadius: '2px' }}
          id="btn-switch-role-sidebar"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={14} color="#0f172a" />
            <span>Switch Role</span>
          </div>
          <ChevronRight size={13} color="var(--text-dim)" />
        </button>
      </div>
    </aside>
  );
}
