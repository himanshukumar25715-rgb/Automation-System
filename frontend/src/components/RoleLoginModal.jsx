import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  ArrowRight,
  GraduationCap,
  Users
} from 'lucide-react';
import { Role } from '../lib/permissions';
import { AICTE_REGIONS } from '../data/mockData';

export function RoleLoginModal({ currentRole, onSelectRole, onClose, isOpen }) {
  const [selectedRegion, setSelectedRegion] = useState('WRO');

  if (!isOpen) return null;

  const handleSelectInstitution = () => {
    onSelectRole({
      role: Role.INSTITUTION,
      officer: 'Synthetic Institution Coordinator',
      designation: 'Synthetic Demo Institution Coordinator',
      badge: 'Institution (Applicant)',
      institutionId: '1-748920141',
      instituteName: 'Synthetic Western Technical Institute',
      region: 'WRO',
    });
  };

  const handleSelectRegionalOfficer = () => {
    const regObj = AICTE_REGIONS.find(r => r.code === selectedRegion) || AICTE_REGIONS[2];
    onSelectRole({
      role: Role.REGIONAL_OFFICER,
      officer: `Synthetic Regional Officer (${regObj.code})`,
      designation: `Synthetic Demo Regional Officer, ${regObj.name}`,
      badge: `Regional Officer (${regObj.code}, Synthetic Demo)`,
      region: regObj.code,
    });
  };

  const handleSelectBureauHead = () => {
    onSelectRole({
      role: Role.BUREAU_HEAD,
      officer: 'Synthetic Bureau Head',
      designation: 'Synthetic Demo Bureau Head',
      badge: 'Bureau Head (Synthetic Demo)',
      region: 'ALL',
    });
  };

  return (
    <div className="modal-backdrop-clean">
      <div className="modal-sheet-clean" style={{ maxWidth: '980px', padding: '32px' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div className="page-overline">
              PERSONA SELECTOR
            </div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', letterSpacing: '-0.025em', margin: '4px 0 0 0' }}>
              Select Role Persona
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Switch between synthetic demo personas to evaluate server-enforced application read isolation.
            </p>
          </div>

          {onClose && (
            <button className="btn-icon-sq" onClick={onClose} title="Close without changing" style={{ borderRadius: '2px' }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* 3-Card Role Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '24px' }}>
          
          {/* Card 1: Institution (Applicant) */}
          <div 
            style={{
              background: '#ffffff',
              border: currentRole?.role === Role.INSTITUTION ? '2px solid #0f172a' : '1px solid var(--border-medium)',
              borderRadius: '2px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: currentRole?.role === Role.INSTITUTION ? '0 4px 12px rgba(15, 23, 42, 0.12)' : '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '2px',
                  background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}>
                  <GraduationCap size={20} />
                </div>
                <span className="status-pill cyan">Applicant</span>
              </div>

              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '2px' }}>Institution</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '14px' }}>
                Synthetic Institution Coordinator
              </div>

              <div style={{
                background: '#f8fafc',
                border: '1px solid var(--border-subtle)',
                borderRadius: '2px',
                padding: '10px 12px',
                fontSize: '0.76rem',
                marginBottom: '14px'
              }}>
                <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Synthetic Western Technical Institute</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>Synthetic scope • Region: WRO</div>
              </div>

              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#065f46' }}>
                  <CheckCircle2 size={13} color="#059669" /> <span>Sees ONLY own applications & deadlines</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#065f46' }}>
                  <CheckCircle2 size={13} color="#059669" /> <span>Respond to returned deficiency items</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#065f46' }}>
                  <CheckCircle2 size={13} color="#059669" /> <span>Upload undertaking proofs & lease renewals</span>
                </div>
              </div>
            </div>

            <button 
              className={currentRole?.role === Role.INSTITUTION ? "btn-mint" : "btn-dark"}
              style={{ width: '100%', justifyContent: 'center', borderRadius: '2px' }}
              onClick={handleSelectInstitution}
              id="btn-login-institution"
            >
              <span>{currentRole?.role === Role.INSTITUTION ? 'Currently Active' : 'Enter as Institution'}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Card 2: Regional Officer */}
          <div 
            style={{
              background: '#ffffff',
              border: currentRole?.role === Role.REGIONAL_OFFICER ? '2px solid #0f172a' : '1px solid var(--border-medium)',
              borderRadius: '2px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: currentRole?.role === Role.REGIONAL_OFFICER ? '0 4px 12px rgba(15, 23, 42, 0.12)' : '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '2px',
                  background: 'linear-gradient(135deg, #059669, #047857)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}>
                  <ShieldCheck size={20} />
                </div>
                <span className="status-pill mint">Regional Desk</span>
              </div>

              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '2px' }}>Regional Officer</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '14px' }}>
                Synthetic Regional Officer ({selectedRegion})
              </div>

              <div style={{
                background: '#f8fafc',
                border: '1px solid var(--border-subtle)',
                borderRadius: '2px',
                padding: '10px 12px',
                fontSize: '0.76rem',
                marginBottom: '14px'
              }}>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem', marginBottom: '4px' }}>Select Regional Office:</div>
                <select 
                  className="select-clean"
                  style={{ width: '100%', padding: '6px 10px', fontSize: '0.78rem', borderRadius: '2px' }}
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  {AICTE_REGIONS.map(r => (
                    <option key={r.code} value={r.code}>{r.code} - {r.name} ({r.hq})</option>
                  ))}
                </select>
              </div>

              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#065f46' }}>
                  <CheckCircle2 size={13} color="#059669" /> <span>Advance stages & issue deficiency notices</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#065f46' }}>
                  <CheckCircle2 size={13} color="#059669" /> <span>Formulate 3-expert EVC committee</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#065f46' }}>
                  <CheckCircle2 size={13} color="#059669" /> <span>Verify undertakings & land deeds</span>
                </div>
              </div>
            </div>

            <button 
              className={currentRole?.role === Role.REGIONAL_OFFICER ? "btn-mint" : "btn-dark"}
              style={{ width: '100%', justifyContent: 'center', borderRadius: '2px' }}
              onClick={handleSelectRegionalOfficer}
              id="btn-login-ro"
            >
              <span>{currentRole?.role === Role.REGIONAL_OFFICER ? 'Currently Active' : `Enter as RO (${selectedRegion})`}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Card 3: Bureau Head (HQ) */}
          <div 
            style={{
              background: '#ffffff',
              border: currentRole?.role === Role.BUREAU_HEAD ? '2px solid #0f172a' : '1px solid var(--border-medium)',
              borderRadius: '2px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: currentRole?.role === Role.BUREAU_HEAD ? '0 4px 12px rgba(15, 23, 42, 0.12)' : '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '2px',
                  background: 'linear-gradient(135deg, #0f172a, #334155)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}>
                  <Building2 size={20} />
                </div>
                <span className="status-pill purple">National HQ</span>
              </div>

              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '2px' }}>Bureau Head (Apex)</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '14px' }}>
                Synthetic Bureau Head
              </div>

              <div style={{
                background: '#f8fafc',
                border: '1px solid var(--border-subtle)',
                borderRadius: '2px',
                padding: '10px 12px',
                fontSize: '0.76rem',
                marginBottom: '14px'
              }}>
                <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Synthetic Approval Bureau demo scope</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>Full Jurisdiction: All 8 Regional Offices</div>
              </div>

              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#065f46' }}>
                  <CheckCircle2 size={13} color="#059669" /> <span>Pan-India bottleneck & SLA tracking</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#065f46' }}>
                  <CheckCircle2 size={13} color="#059669" /> <span>Apex Level 3 escalation adjudications</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#065f46' }}>
                  <CheckCircle2 size={13} color="#059669" /> <span>Reassign applications between regions</span>
                </div>
              </div>
            </div>

            <button 
              className={currentRole?.role === Role.BUREAU_HEAD ? "btn-mint" : "btn-dark"}
              style={{ width: '100%', justifyContent: 'center', borderRadius: '2px' }}
              onClick={handleSelectBureauHead}
              id="btn-login-bureau"
            >
              <span>{currentRole?.role === Role.BUREAU_HEAD ? 'Currently Active' : 'Enter as Bureau Head'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
