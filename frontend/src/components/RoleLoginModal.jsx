import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Layers, 
  MapPin, 
  CheckCircle2, 
  X, 
  ArrowRight,
  GraduationCap,
  Users,
  Sliders,
  FileCheck,
  AlertTriangle
} from 'lucide-react';
import { Role } from '../lib/permissions';
import { AICTE_REGIONS } from '../data/mockData';

export function RoleLoginModal({ currentRole, onSelectRole, onClose, isOpen }) {
  const [selectedRegion, setSelectedRegion] = useState('WRO');

  if (!isOpen) return null;

  const handleSelectInstitution = () => {
    onSelectRole({
      role: Role.INSTITUTION,
      officer: 'Dr. Meera Sen',
      designation: 'Principal & Head of Institute',
      badge: 'Institution (Applicant)',
      institutionId: '1-748920141',
      instituteName: 'Maharashtra Institute of Technology & Research',
      region: 'WRO',
    });
  };

  const handleSelectRegionalOfficer = () => {
    const regObj = AICTE_REGIONS.find(r => r.code === selectedRegion) || AICTE_REGIONS[2];
    onSelectRole({
      role: Role.REGIONAL_OFFICER,
      officer: `Dr. R.K. Patil (${regObj.code})`,
      designation: `Regional Officer, AICTE ${regObj.name}`,
      badge: `Regional Officer (${regObj.code})`,
      region: regObj.code,
    });
  };

  const handleSelectBureauHead = () => {
    onSelectRole({
      role: Role.BUREAU_HEAD,
      officer: 'Shri A.K. Sharma',
      designation: 'Adviser (Approval Bureau), AICTE HQ New Delhi',
      badge: 'Bureau Head (HQ)',
      region: 'ALL',
    });
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-card" style={{ maxWidth: '1060px', padding: '32px' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-purple" style={{ fontSize: '0.78rem' }}>
                <ShieldCheck size={14} /> AICTE PRAGATI-NAV Role-Based Access Control
              </span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Interactive Role Selection for Evaluation
              </span>
            </div>
            <h2 style={{ fontSize: '1.6rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
              Select User Role Persona
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#94a3b8', marginTop: '4px' }}>
              Experience strict role-based data isolation, custom dashboards, dedicated sidebars, and tailored permission sets.
            </p>
          </div>

          {onClose && (
            <button className="btn btn-secondary btn-sm" onClick={onClose} title="Close without changing">
              <X size={16} />
            </button>
          )}
        </div>

        {/* 3-Card Role Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          
          {/* Card 1: Institution (Applicant) */}
          <div 
            style={{
              background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
              border: currentRole?.role === Role.INSTITUTION ? '2px solid #38bdf8' : '1px solid var(--border-medium)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: currentRole?.role === Role.INSTITUTION ? '0 0 24px rgba(56, 189, 248, 0.25)' : 'var(--shadow-md)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}>
                  <GraduationCap size={24} />
                </div>
                <span className="badge badge-info">Applicant Portal</span>
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Institution (Applicant)</h3>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '14px' }}>
                Dr. Meera Sen, Principal
              </div>

              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '0.78rem',
                marginBottom: '16px'
              }}>
                <div style={{ fontWeight: 600, color: '#f8fafc' }}>Maharashtra Institute of Tech & Research</div>
                <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>ID: 1-748920141 • Region: WRO (Pune)</div>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}>
                  <CheckCircle2 size={14} /> <span>Sees ONLY own applications & deadlines</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}>
                  <CheckCircle2 size={14} /> <span>Respond to returned deficiency items</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}>
                  <CheckCircle2 size={14} /> <span>Upload undertaking proofs & lease renewals</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f87171' }}>
                  <X size={14} /> <span>No access to other colleges or officer remarks</span>
                </div>
              </div>
            </div>

            <button 
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.88rem' }}
              onClick={handleSelectInstitution}
              id="btn-login-institution"
            >
              <span>Enter as Institution</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Card 2: Regional Officer */}
          <div 
            style={{
              background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
              border: currentRole?.role === Role.REGIONAL_OFFICER ? '2px solid #34d399' : '1px solid var(--border-medium)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: currentRole?.role === Role.REGIONAL_OFFICER ? '0 0 24px rgba(16, 185, 129, 0.25)' : 'var(--shadow-md)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #059669, #047857)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}>
                  <ShieldCheck size={24} />
                </div>
                <span className="badge badge-success">Regional Authority</span>
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Regional Officer</h3>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '12px' }}>
                Scrutiny, EVC & Approval Officer
              </div>

              {/* Region Selector for Demo */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                  Select Assigned AICTE Region:
                </label>
                <select 
                  className="form-select"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  style={{ fontSize: '0.8rem', padding: '8px 10px' }}
                >
                  {AICTE_REGIONS.map(reg => (
                    <option key={reg.code} value={reg.code}>
                      {reg.code} - {reg.name} ({reg.hq})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}>
                  <CheckCircle2 size={14} /> <span>Sees ONLY applications in selected region</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}>
                  <CheckCircle2 size={14} /> <span>Advance stage, or revert with deficiency reason</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}>
                  <CheckCircle2 size={14} /> <span>Schedule EVC panels & verify undertakings</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f87171' }}>
                  <X size={14} /> <span>Cannot view other regions or edit rules</span>
                </div>
              </div>
            </div>

            <button 
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.88rem', background: 'linear-gradient(135deg, #059669, #047857)' }}
              onClick={handleSelectRegionalOfficer}
              id="btn-login-ro"
            >
              <span>Enter as Regional Officer ({selectedRegion})</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Card 3: Bureau Head */}
          <div 
            style={{
              background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
              border: currentRole?.role === Role.BUREAU_HEAD ? '2px solid #c084fc' : '1px solid var(--border-medium)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: currentRole?.role === Role.BUREAU_HEAD ? '0 0 24px rgba(192, 132, 252, 0.25)' : 'var(--shadow-md)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}>
                  <Layers size={24} />
                </div>
                <span className="badge badge-purple">National HQ</span>
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Bureau Head</h3>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '14px' }}>
                Shri A.K. Sharma, Adviser (Approval Bureau)
              </div>

              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '0.78rem',
                marginBottom: '16px'
              }}>
                <div style={{ fontWeight: 600, color: '#f8fafc' }}>AICTE Headquarters, New Delhi</div>
                <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>Jurisdiction: Pan-India (All 8 Regional Offices)</div>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}>
                  <CheckCircle2 size={14} /> <span>Sees ALL regions, institutions & officers</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}>
                  <CheckCircle2 size={14} /> <span>Region comparison & bottleneck heatmap</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}>
                  <CheckCircle2 size={14} /> <span>Handle Tier-3 escalations & reassign cases</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}>
                  <CheckCircle2 size={14} /> <span>APH policy rules & system integrations</span>
                </div>
              </div>
            </div>

            <button 
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.88rem', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
              onClick={handleSelectBureauHead}
              id="btn-login-bureau"
            >
              <span>Enter as Bureau Head (HQ)</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Footer info note */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '0.76rem',
          color: '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <strong style={{ color: '#f8fafc' }}>Simplified Escalation Chain:</strong> Institution Reminder &rarr; Regional Officer (Level 2) &rarr; Bureau Head / Member Secretary (Level 3).
          </div>
          <div style={{ color: '#38bdf8' }}>Demo Sandbox Mode</div>
        </div>
      </div>
    </div>
  );
}
