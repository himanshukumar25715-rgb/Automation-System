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
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '680px' }}>
        <div className="panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <Bell size={18} />
            </div>
            <div>
              <h3 className="panel-title">Automated Notifications & Escalation Alerts</h3>
              <p style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                System-generated timeline alerts, EVC updates, and hierarchical SLA breaches
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" onClick={onMarkAllRead}>
              <CheckCircle2 size={13} /> Mark All Read
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              <X size={15} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '480px', overflowY: 'auto' }}>
          {notifications.map(n => (
            <div
              key={n.id}
              style={{
                background: n.read ? 'rgba(15, 23, 42, 0.4)' : 'rgba(15, 23, 42, 0.85)',
                border: `1px solid ${
                  n.severity === 'critical' ? 'rgba(239, 68, 68, 0.4)' :
                  n.severity === 'warning' ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-subtle)'
                }`,
                borderRadius: '8px',
                padding: '12px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '12px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                  <span className={`badge ${
                    n.severity === 'critical' ? 'badge-critical' :
                    n.severity === 'warning' ? 'badge-warning' : 'badge-info'
                  }`}>
                    {n.severity.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{n.timestamp}</span>
                  {n.region && <span className="badge badge-info">{n.region}</span>}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.86rem' }}>{n.title}</div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '3px' }}>{n.message}</div>

                {n.applicationId && (
                  <button
                    onClick={() => {
                      onSelectApplicationById(n.applicationId);
                      onClose();
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#38bdf8',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      marginTop: '6px',
                      padding: 0,
                      textDecoration: 'underline'
                    }}
                  >
                    Jump to Case {n.applicationId} →
                  </button>
                )}
              </div>

              {!n.read && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onMarkRead(n.id)}
                  title="Acknowledge notification"
                >
                  <CheckCircle2 size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
