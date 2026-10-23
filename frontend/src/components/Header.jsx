import React from 'react';
import { 
  ShieldCheck, 
  Bell, 
  ChevronDown, 
  GraduationCap, 
  Building2, 
  Activity, 
  LayoutGrid,
  CheckCircle2
} from 'lucide-react';
import { Role } from '../lib/permissions';

export function Header({ 
  currentRole, 
  onOpenSwitchRole, 
  simDaysOffset, 
  unreadCount,
  onOpenNotifications,
  overdueCount,
  apiOnline = false,
  activeTab = 'dashboard'
}) {
  const roleType = currentRole?.role || Role.BUREAU_HEAD;

  const tabLabels = {
    dashboard: 'dashboard',
    applications: 'applications',
    evc: 'evc-scheduling',
    undertakings: 'undertakings',
    documents: 'document-validity',
    alerts: 'alerts',
    escalations: 'escalations',
    region_reports: 'region-reports',
    reports: 'reports',
    audit: 'audit-trail',
    rules: 'rules-engine',
    integrations: 'integrations'
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.96)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-medium)',
      padding: '0 24px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)'
    }}>
      {/* Left: Clean Brand Logo & Tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 128 128" 
            style={{ display: 'block', flexShrink: 0 }}
            aria-label="GovVerify Logo"
          >
            <g transform="translate(16 3) scale(0.52)">
              {/* Document outline */}
              <path d="M116 18H47C25 18 10 34 10 56V207C10 229 25 244 47 244H77L58 225H47C36 225 29 218 29 207V56C29 45 36 37 47 37H116Z" fill="#0f172a"/>
              {/* Folded page corner */}
              <path d="M132 18H142L185 61V76H148C138 76 132 70 132 60Z" fill="#16a085"/>
              {/* Document text lines */}
              <path d="M49 89H119M49 111H130M49 133H101" fill="none" stroke="#0f172a" strokeWidth="9" strokeLinecap="round"/>
              {/* Integrated verification check */}
              <path d="M52 174L78 200L157 122" fill="none" stroke="#16a085" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
          </svg>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.18rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              <span>Gov</span>
              <span style={{ color: '#16a085' }}>Verify</span>
            </span>
            <span style={{
              fontSize: '0.66rem',
              fontWeight: 700,
              color: '#0f172a',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              padding: '2px 6px',
              borderRadius: '2px',
              letterSpacing: '0.04em'
            }}>
              AICTE REGULATORY
            </span>
          </div>
        </div>

        {/* Center / Path Breadcrumb */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#f8fafc',
          border: '1px solid var(--border-subtle)',
          padding: '4px 10px',
          borderRadius: '2px',
          fontSize: '0.78rem',
          color: 'var(--text-muted)'
        }}>
          <span style={{ opacity: 0.5 }}>/</span>
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{tabLabels[activeTab] || activeTab}</span>
        </div>
      </div>

      {/* Right Actions & Prominent User Role Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        
        {/* API Status Pill */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: apiOnline ? '#ecfdf5' : '#fffbeb',
            border: `1px solid ${apiOnline ? '#a7f3d0' : '#fde68a'}`,
            borderRadius: '2px',
            padding: '4px 9px',
            fontSize: '0.72rem',
            fontWeight: 600,
            color: apiOnline ? '#065f46' : '#92400e',
            transition: 'all 0.2s ease'
          }}
          title={apiOnline ? 'Express REST API connected' : 'Local standalone mode'}
        >
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: apiOnline ? '#059669' : '#d97706'
          }} />
          <span>{apiOnline ? 'Live API' : 'Standalone'}</span>
        </div>

        {/* Notifications Icon Button */}
        <button
          onClick={onOpenNotifications}
          className="btn-icon-sq"
          style={{ position: 'relative', borderRadius: '2px' }}
          title="Notifications & Escalation Alerts"
          id="notifications-bell-btn"
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--ruby-500)',
              animation: 'alertDotPulse 2s infinite'
            }} />
          )}
        </button>

        {/* Current Role Pill Button (Interactive Switcher) */}
        <div 
          onClick={onOpenSwitchRole}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#ffffff',
            border: '1px solid var(--border-medium)',
            padding: '4px 12px 4px 6px',
            borderRadius: '2px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
          }}
          title="Click to Switch Persona (Demo)"
          id="header-role-badge"
        >
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '2px',
            background: roleType === Role.INSTITUTION ? 'linear-gradient(135deg, #0284c7, #0369a1)' :
                        roleType === Role.REGIONAL_OFFICER ? 'linear-gradient(135deg, #059669, #047857)' :
                        'linear-gradient(135deg, #0f172a, #334155)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            {roleType === Role.INSTITUTION ? <GraduationCap size={14} /> :
             roleType === Role.REGIONAL_OFFICER ? <ShieldCheck size={14} /> :
             <Building2 size={14} />}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.1 }}>
              {currentRole?.badge}
            </span>
            <span style={{ fontSize: '0.66rem', color: 'var(--text-dim)' }}>
              {roleType === Role.INSTITUTION ? currentRole?.institutionId :
               roleType === Role.REGIONAL_OFFICER ? `Region ${currentRole?.region}` : 'Apex HQ'}
            </span>
          </div>

          <ChevronDown size={13} color="var(--text-dim)" />
        </div>
      </div>
    </header>
  );
}
