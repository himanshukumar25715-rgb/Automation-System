import React from 'react';
import { Bell, X, CheckCircle2, Flame, AlertTriangle, Clock } from 'lucide-react';

export function NotificationsModal({ 
  notifications, 
  onClose, 
  onMarkRead, 
  onMarkAllRead,
  onSelectApplicationById 
}) {
  return (
    <div className="modal-backdrop-clean" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-sheet-clean" style={{ maxWidth: '640px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', gap: '16px' }}>
          <div>
            <div className="page-overline" style={{ marginBottom: '4px' }}>ALERTS & ESCALATIONS</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              System Notifications
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Real-time timeline alerts, EVC scheduling updates, and SLA breach warnings
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button className="btn-dark" onClick={onMarkAllRead} style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
              <CheckCircle2 size={13} style={{ color: 'var(--mint-500)' }} /> Mark all read
            </button>
            <button 
              className="btn-dark" 
              onClick={onClose}
              style={{ width: '32px', height: '32px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '460px', overflowY: 'auto', paddingRight: '4px' }}>
          {notifications.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No notifications at this time.
            </div>
          ) : (
            notifications.map(n => {
              const isCrit = n.severity === 'critical';
              const isWarn = n.severity === 'warning';
              const bgCol = isCrit ? '#fff1f2' : isWarn ? '#fffbeb' : n.read ? '#f8fafc' : '#ffffff';
              const borderCol = isCrit ? '#fecdd3' : isWarn ? '#fde68a' : 'var(--border-subtle)';
              const textBadgeCol = isCrit ? '#b91c1c' : isWarn ? '#b45309' : '#15803d';

              return (
                <div
                  key={n.id}
                  style={{
                    background: bgCol,
                    border: `1px solid ${borderCol}`,
                    borderRadius: '2px',
                    padding: '14px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '14px',
                    transition: 'all 0.15s ease',
                    boxShadow: !n.read ? '0 1px 3px rgba(0,0,0,0.04)' : 'none'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span 
                        style={{ 
                          fontSize: '0.65rem', 
                          fontWeight: 700, 
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          padding: '2px 8px',
                          borderRadius: '2px',
                          background: isCrit ? '#fee2e2' : isWarn ? '#fef3c7' : '#dcfce7',
                          color: textBadgeCol,
                          border: `1px solid ${borderCol}`
                        }}
                      >
                        {n.severity}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{n.timestamp}</span>
                      {n.region && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', background: '#f1f5f9', padding: '2px 6px', borderRadius: '2px' }}>
                          {n.region}
                        </span>
                      )}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>{n.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.45 }}>{n.message}</div>

                    {n.applicationId && (
                      <button
                        onClick={() => {
                          onSelectApplicationById(n.applicationId);
                          onClose();
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#0f172a',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          marginTop: '8px',
                          padding: 0,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          textDecoration: 'underline'
                        }}
                      >
                        Jump to Case {n.applicationId} →
                      </button>
                    )}
                  </div>

                  {!n.read && (
                    <button
                      className="btn-dark"
                      onClick={() => onMarkRead(n.id)}
                      title="Acknowledge notification"
                      style={{ padding: '6px 10px', fontSize: '0.75rem', flexShrink: 0, borderRadius: '2px' }}
                    >
                      <CheckCircle2 size={13} style={{ color: '#059669' }} />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
