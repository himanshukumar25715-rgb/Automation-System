import React, { useState } from 'react';
import { Sliders, CheckCircle2, ShieldCheck, RotateCcw, AlertTriangle, Layers } from 'lucide-react';
import { INITIAL_APH_RULES } from '../data/mockData';

export function AphRuleConfigurator({ rules, onUpdateRules, currentRole }) {
  const [formData, setFormData] = useState({ ...rules });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isAuthorized = currentRole.id === 'APEX_BUREAU';

  const handleChange = (field, val) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseInt(val, 10) || 0
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateRules(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDefaults = () => {
    setFormData({ ...INITIAL_APH_RULES });
    onUpdateRules({ ...INITIAL_APH_RULES });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="aph-rule-configurator">
      {/* Top Banner */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-medium)',
        borderRadius: '2px',
        padding: '18px 24px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-purple">
              <Sliders size={13} /> APH Dynamic Policy Rule Engine
            </span>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Statutory Parameter Configuration & Threshold Tuning
            </span>
          </div>
          <h2 style={{ fontSize: '1.35rem', marginTop: '6px', color: 'var(--text-main)' }}>
            Configurable APH Timelines, SLAs & Escalation Triggers
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
            Adjust statutory deadlines and reminder periods in alignment with annual AICTE Approval Process Handbook revisions.
          </p>
        </div>

        {!isAuthorized && (
          <div className="badge badge-warning">
            <AlertTriangle size={13} /> Read-Only: Apex Bureau authorization required to modify
          </div>
        )}
      </div>

      {savedSuccess && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: '2px',
          padding: '12px 20px',
          marginBottom: '20px',
          color: '#065f46',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.85rem'
        }}>
          <CheckCircle2 size={16} />
          <span>APH Policy Rules updated successfully! Workflow engines and SLA timers recalculated.</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          
          {/* Section 1: Processing Stage SLAs */}
          <div className="panel" style={{ margin: 0 }}>
            <h3 className="panel-title" style={{ marginBottom: '16px', color: '#38bdf8' }}>
              Stage Processing SLAs (Days)
            </h3>

            <div className="form-group">
              <label className="form-label">Preliminary Scrutiny SLA (Days):</label>
              <input 
                type="number"
                min="1"
                max="30"
                className="form-input"
                value={formData.scrutinySlaDays}
                onChange={(e) => handleChange('scrutinySlaDays', e.target.value)}
                disabled={!isAuthorized}
              />
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Standard APH default: 7 days</span>
            </div>

            <div className="form-group">
              <label className="form-label">Institutional Deficiency Re-Scrutiny Window (Days):</label>
              <input 
                type="number"
                min="1"
                max="21"
                className="form-input"
                value={formData.reScrutinySlaDays}
                onChange={(e) => handleChange('reScrutinySlaDays', e.target.value)}
                disabled={!isAuthorized}
              />
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Time granted to applicant to cure deficiencies</span>
            </div>

            <div className="form-group">
              <label className="form-label">EVC Expert Panel Scheduling SLA (Days):</label>
              <input 
                type="number"
                min="1"
                max="15"
                className="form-input"
                value={formData.evcSchedulingSlaDays}
                onChange={(e) => handleChange('evcSchedulingSlaDays', e.target.value)}
                disabled={!isAuthorized}
              />
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Max days from Scrutiny Clearance to Visit Date</span>
            </div>

            <div className="form-group">
              <label className="form-label">EVC Report Upload Deadline (Hours):</label>
              <input 
                type="number"
                min="12"
                max="96"
                className="form-input"
                value={formData.evcReportUploadHours}
                onChange={(e) => handleChange('evcReportUploadHours', e.target.value)}
                disabled={!isAuthorized}
              />
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Standard APH requirement: 48 hours</span>
            </div>
          </div>

          {/* Section 2: Expiry & Compliance Timelines */}
          <div className="panel" style={{ margin: 0 }}>
            <h3 className="panel-title" style={{ marginBottom: '16px', color: '#fbbf24' }}>
              Document Expiry & Compliance Thresholds
            </h3>

            <div className="form-group">
              <label className="form-label">Lease Advance Warning Window (Days):</label>
              <input 
                type="number"
                min="30"
                max="365"
                className="form-input"
                value={formData.leaseAdvanceWarningDays}
                onChange={(e) => handleChange('leaseAdvanceWarningDays', e.target.value)}
                disabled={!isAuthorized}
              />
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Initial notification dispatched to institution (e.g. 180 days)</span>
            </div>

            <div className="form-group">
              <label className="form-label">Lease Critical Warning Window (Days):</label>
              <input 
                type="number"
                min="15"
                max="120"
                className="form-input"
                value={formData.leaseCriticalWarningDays}
                onChange={(e) => handleChange('leaseCriticalWarningDays', e.target.value)}
                disabled={!isAuthorized}
              />
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Triggers EoA Freeze Warning (e.g. 90 days)</span>
            </div>

            <div className="form-group">
              <label className="form-label">Time-Bound Undertaking Notice Window (Days):</label>
              <input 
                type="number"
                min="7"
                max="60"
                className="form-input"
                value={formData.undertakingWarningDays}
                onChange={(e) => handleChange('undertakingWarningDays', e.target.value)}
                disabled={!isAuthorized}
              />
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Advance alert dispatched prior to condition deadline</span>
            </div>
          </div>

          {/* Section 3: Automated Escalation Hierarchy */}
          <div className="panel" style={{ margin: 0 }}>
            <h3 className="panel-title" style={{ marginBottom: '16px', color: '#f87171' }}>
              Automated Escalation Triggers
            </h3>

            <div className="form-group">
              <label className="form-label">Level 1 Escalation (Days Past SLA):</label>
              <input 
                type="number"
                min="1"
                max="5"
                className="form-input"
                value={formData.escalationLevel1Days}
                onChange={(e) => handleChange('escalationLevel1Days', e.target.value)}
                disabled={!isAuthorized}
              />
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Dispatches reminder to Scrutiny Officer / Expert</span>
            </div>

            <div className="form-group">
              <label className="form-label">Level 2 Escalation (Days Past SLA):</label>
              <input 
                type="number"
                min="3"
                max="10"
                className="form-input"
                value={formData.escalationLevel2Days}
                onChange={(e) => handleChange('escalationLevel2Days', e.target.value)}
                disabled={!isAuthorized}
              />
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Dispatches urgent memo to Regional Officer (RO)</span>
            </div>

            <div className="form-group">
              <label className="form-label">Level 3 Escalation (Days Past SLA):</label>
              <input 
                type="number"
                min="5"
                max="15"
                className="form-input"
                value={formData.escalationLevel3Days}
                onChange={(e) => handleChange('escalationLevel3Days', e.target.value)}
                disabled={!isAuthorized}
              />
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Dispatches emergency docket to Member Secretary (AICTE HQ)</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isAuthorized && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleResetDefaults}
            >
              <RotateCcw size={15} /> Reset to APH Standard Defaults
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              id="btn-save-aph-rules"
            >
              <CheckCircle2 size={15} /> Save & Apply Policy Rules
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
