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

  // Build role-specific sidebar navigation items as explicitly mandated
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
      { id: 'audit', label: 'Audit Trail (Regional)', icon: History },
    ];
  } else {
    // Bureau Head
    navItems = [
      { id: 'dashboard', label: 'National Dashboard', icon: Layers },
      { id: 'applications', label: 'All Applications', icon: FileText, badge: counts.applications },
      { id: 'escalations', label: 'Escalations', icon: AlertTriangle, badge: counts.escalations > 0 ? counts.escalations : null, badgeColor: '#ef4444' },
      { id: 'reports', label: 'Reports', icon: BarChart3 },
      { id: 'audit', label: 'Audit Trail (Full)', icon: History },
      { id: 'rules', label: 'Rules & Configuration', icon: Sliders },
      { id: 'integrations', label: 'Integrations', icon: Network },
    ];
  }

  return (
    <aside className="app-sidebar" style={{
      width: '260px',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(16px)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      flexShrink: 0,
      minHeight: 'calc(100vh - 100px)'
    }}>
      {/* Top User Role Profile Box */}
      <div>
        <div style={{
          padding: '18px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(30, 41, 59, 0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: roleType === Role.INSTITUTION ? 'linear-gradient(135deg, #0284c7, #0369a1)' :
                          roleType === Role.REGIONAL_OFFICER ? 'linear-gradient(135deg, #059669, #047857)' :
                          'linear-gradient(135deg, #7c3aed, #6d28d9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              {roleType === Role.INSTITUTION ? <GraduationCap size={18} /> :
               roleType === Role.REGIONAL_OFFICER ? <ShieldCheck size={18} /> :
               <Building2 size={18} />}
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.2 }}>
                {currentRole?.badge}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                {roleType === Role.INSTITUTION ? `ID: ${currentRole?.institutionId}` :
                 roleType === Role.REGIONAL_OFFICER ? `Region: ${currentRole?.region}` :
                 'All 8 Regions (HQ)'}
              </div>
            </div>
          </div>

          <div style={{
            fontSize: '0.72rem',
            color: '#cbd5e1',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '6px 10px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)'
          }}>
            {currentRole?.officer}
          </div>
        </div>

        {/* Sidebar Navigation Items */}
        <nav style={{ padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{
            fontSize: '0.68rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: '#64748b',
            fontWeight: 700,
            padding: '4px 10px 8px 10px'
          }}>
            {roleType === Role.INSTITUTION ? 'Institution Portal' :
             roleType === Role.REGIONAL_OFFICER ? `Regional Menu (${currentRole?.region})` :
             'Apex Governance'}
          </div>

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
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-sans)',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  background: isActive ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.35)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={16} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span style={{
                    background: item.badgeColor || '#334155',
                    color: 'white',
                    padding: '2px 7px',
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
      </div>

      {/* Switch Role Quick Button at Bottom */}
      <div style={{ padding: '16px 14px', borderTop: '1px solid var(--border-subtle)' }}>
        <button
          onClick={onOpenSwitchRole}
          className="btn btn-secondary"
          style={{ width: '100%', fontSize: '0.78rem', padding: '10px', justifyContent: 'space-between' }}
          id="btn-switch-role-sidebar"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={15} color="#38bdf8" />
            <span>Switch Role (Demo)</span>
          </div>
          <ChevronRight size={14} color="#64748b" />
        </button>
      </div>
    </aside>
  );
}
