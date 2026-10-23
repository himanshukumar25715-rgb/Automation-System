import React, { useState } from 'react';
import { FastForward, RotateCcw, AlertOctagon, Clock, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

export function SimulationBar({ 
  simDaysOffset, 
  onAdvanceDays, 
  onResetTime, 
  onTriggerTestEscalation,
  lastActionMessage 
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="sim-hud-pill" id="simulation-hud">
      <div 
        onClick={() => setIsExpanded(!isExpanded)} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        title="Toggle simulation time-travel controls"
      >
        <Clock size={14} color="#0f172a" />
        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
          Sim Time {simDaysOffset > 0 ? `(+${simDaysOffset}d)` : '(Day 0)'}
        </span>
        <span style={{ 
          color: 'var(--text-muted)', 
          fontSize: '0.68rem',
          background: '#f1f5f9',
          border: '1px solid #e2e8f0',
          padding: '1px 6px',
          borderRadius: '2px',
          fontWeight: 600
        }}>
          {isExpanded ? 'Hide' : 'Time Travel'}
        </span>
      </div>

      {isExpanded && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderLeft: '1px solid var(--border-medium)', paddingLeft: '10px' }}>
          <button 
            className="sim-btn-pill"
            onClick={() => onAdvanceDays(1)}
            title="Advance +1 day"
            id="btn-advance-1d"
          >
            +1d
          </button>
          <button 
            className="sim-btn-pill"
            onClick={() => onAdvanceDays(3)}
            title="Advance +3 days"
            id="btn-advance-3d"
          >
            +3d
          </button>
          <button 
            className="sim-btn-pill"
            onClick={() => onAdvanceDays(7)}
            title="Advance +7 days"
            id="btn-advance-7d"
          >
            +7d
          </button>

          <button 
            className="sim-btn-pill"
            onClick={onTriggerTestEscalation}
            style={{ color: '#b45309', borderColor: '#fde68a' }}
            title="Trigger test breach escalation"
            id="btn-instant-escalation-test"
          >
            <AlertOctagon size={11} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
            Breach
          </button>

          {simDaysOffset > 0 && (
            <button 
              className="sim-btn-pill"
              onClick={onResetTime}
              style={{ color: 'var(--ruby-600)' }}
              title="Reset date"
              id="btn-reset-time"
            >
              <RotateCcw size={11} style={{ display: 'inline', marginRight: '3px', verticalAlign: '-1px' }} />
              Reset
            </button>
          )}
        </div>
      )}

      {lastActionMessage && (
        <span style={{ 
          color: '#065f46', 
          background: '#ecfdf5', 
          border: '1px solid #a7f3d0',
          padding: '2px 8px', 
          borderRadius: '2px',
          fontSize: '0.7rem',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontWeight: 600
        }}>
          <CheckCircle2 size={11} /> {lastActionMessage}
        </span>
      )}
    </div>
  );
}
