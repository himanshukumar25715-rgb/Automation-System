import React from 'react';
import { FastForward, RotateCcw, AlertOctagon, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

export function SimulationBar({ 
  simDaysOffset, 
  onAdvanceDays, 
  onResetTime, 
  onTriggerTestEscalation,
  lastActionMessage 
}) {
  return (
    <div className="simulation-bar">
      <div className="sim-info">
        <span className="sim-label">
          <Clock size={15} /> Real-Time Workflow & SLA Engine Simulator
        </span>
        <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
          Evaluate automated timeline monitoring, deadline alerts, and hierarchical escalations by advancing simulated time:
        </span>
        {lastActionMessage && (
          <span style={{ 
            color: '#34d399', 
            background: 'rgba(16, 185, 129, 0.12)', 
            padding: '2px 8px', 
            borderRadius: '4px',
            fontSize: '0.74rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <CheckCircle2 size={12} /> {lastActionMessage}
          </span>
        )}
      </div>

      <div className="sim-controls">
        <button 
          className="btn-sim"
          onClick={() => onAdvanceDays(1)}
          title="Advance system clock by 1 day to trigger daily SLA checks"
          id="btn-advance-1d"
        >
          <FastForward size={13} /> +1 Day
        </button>
        <button 
          className="btn-sim"
          onClick={() => onAdvanceDays(3)}
          title="Advance by 3 days to test Level 1 escalation triggers"
          id="btn-advance-3d"
        >
          <FastForward size={13} /> +3 Days
        </button>
        <button 
          className="btn-sim"
          onClick={() => onAdvanceDays(7)}
          title="Advance by 7 days to test Level 2 and Level 3 escalations"
          id="btn-advance-7d"
        >
          <FastForward size={13} /> +7 Days (Weekly Review)
        </button>

        <button 
          className="btn-sim btn-sim-primary"
          onClick={onTriggerTestEscalation}
          title="Directly trigger an urgent SLA breach escalation event"
          id="btn-instant-escalation-test"
        >
          <AlertOctagon size={13} /> Test Automated Breach Escalation
        </button>

        {simDaysOffset > 0 && (
          <button 
            className="btn-sim"
            onClick={onResetTime}
            style={{ color: '#f87171' }}
            title="Reset system clock back to Day 0"
            id="btn-reset-time"
          >
            <RotateCcw size={13} /> Reset Date
          </button>
        )}
      </div>
    </div>
  );
}
