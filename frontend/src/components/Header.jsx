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
  ChevronDown,
  GraduationCap
} from 'lucide-react';
import { Role } from '../lib/permissions';

export function Header({ 
  currentRole, 
  onOpenSwitchRole, 
  simDaysOffset, 
  unreadCount,
  onOpenNotifications,
  overdueCount
}) {
  const getSimulatedDate = () => {
    const d = new Date(2026, 9, 23);
    d.setDate(d.getDate() + simDaysOffset);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const roleType = currentRole?.role || Role.BUREAU_HEAD;

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
          {/* Simplified Escalation Chain Display */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#cbd5e1' }}>
            <span style={{ color: '#94a3b8' }}>Escalation Chain:</span>
            <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '1px 6px', borderRadius: '4px' }}>1. Institution</span>
            <span>&rarr;</span>
            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '1px 6px', borderRadius: '4px' }}>2. Regional Officer</span>
            <span>&rarr;</span>
            <span style={{ background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', padding: '1px 6px', borderRadius: '4px' }}>3. Bureau Head</span>
          </div>

          <div className="sim-time-badge">
            <Clock size={13} />
            <span>Date: <strong>{getSimulatedDate()}</strong></span>
            {simDaysOffset > 0 && <span style={{ opacity: 0.8 }}>(+{simDaysOffset}d)</span>}
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
              Unified Digital Platform for Approvals, Institutional Undertakings & Document Validity
            </div>
          </div>
        </div>

        {/* Right Actions & Prominent Role Badge with Switcher */}
        <div className="nav-actions">
          {/* Current Role & Region Badge (Mandated UX Rule) */}
          <div 
            onClick={onOpenSwitchRole}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(30, 41, 59, 0.9)',
              border: '1px solid var(--border-medium)',
              padding: '6px 14px',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Click to Switch User Role (Demo Selector)"
            id="header-role-badge"
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: roleType === Role.INSTITUTION ? '#0284c7' :
                          roleType === Role.REGIONAL_OFFICER ? '#059669' : '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              {roleType === Role.INSTITUTION ? <GraduationCap size={15} /> :
               roleType === Role.REGIONAL_OFFICER ? <ShieldCheck size={15} /> :
               <Building2 size={15} />}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f8fafc' }}>
                  {currentRole?.badge}
                </span>
                <span className="badge badge-info" style={{ fontSize: '0.66rem', padding: '1px 6px' }}>
                  {roleType === Role.INSTITUTION ? `ID: ${currentRole?.institutionId}` :
                   roleType === Role.REGIONAL_OFFICER ? `Region: ${currentRole?.region}` :
                   'National HQ'}
                </span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                {currentRole?.officer} • <span style={{ color: '#38bdf8', textDecoration: 'underline' }}>Switch Role</span>
              </div>
            </div>

            <ChevronDown size={14} color="#94a3b8" />
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
