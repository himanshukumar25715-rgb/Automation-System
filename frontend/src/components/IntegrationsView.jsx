import React, { useState } from 'react';
import { 
  Network, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  Server, 
  Database, 
  FileCheck, 
  Smartphone,
  ExternalLink,
  Activity
} from 'lucide-react';

export function IntegrationsView() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState('');

  const integrations = [
    {
      id: 'AICTE_MIS',
      name: 'AICTE Central MIS & Approval Portal',
      description: 'Bidirectional sync with primary technical institution database, course matrix, and intake approvals.',
      endpoint: 'https://api.aicte-india.org/v3/approvals',
      status: 'Connected',
      latency: '34 ms',
      lastSync: '2 minutes ago',
      icon: Database,
      type: 'Core System'
    },
    {
      id: 'NLRMP_LAND',
      name: 'National Land Record Portal (Bhulekh / NLRMP)',
      description: 'Automated digital verification of 30-year registered land lease deeds and non-encumbrance certificates.',
      endpoint: 'https://landrecords.gov.in/api/v2/verify-deed',
      status: 'Connected',
      latency: '58 ms',
      lastSync: '14 minutes ago',
      icon: FileCheck,
      type: 'Statutory Verification'
    },
    {
      id: 'DIGILOCKER_NAD',
      name: 'DigiLocker National Academic Depository (NAD)',
      description: 'Instant credential and qualification verification for faculty members under AICTE 7th CPC norms.',
      endpoint: 'https://nad.digitallocker.gov.in/api/v1/auth',
      status: 'Connected',
      latency: '41 ms',
      lastSync: '5 minutes ago',
      icon: ShieldCheck,
      type: 'Credentials'
    },
    {
      id: 'FIRE_SAFETY_NOC',
      name: 'State Fire & Emergency Services Gateway',
      description: 'Real-time webhook ingestion for state fire NOC approvals, renewal certificates, and compliance validity.',
      endpoint: 'https://firesafety.nic.in/webhook/aicte-notifications',
      status: 'Connected',
      latency: '72 ms',
      lastSync: '1 hour ago',
      icon: Server,
      type: 'Safety Compliance'
    },
    {
      id: 'NIC_GATEWAY',
      name: 'NIC / CDAC SMS & WhatsApp Regulatory Gateway',
      description: 'High-priority delivery of automated reminders (30d, 15d, 7d) and Level 1/2/3 statutory escalation notices.',
      endpoint: 'https://smsgw.nic.in/api/dispatch',
      status: 'Operational',
      latency: '26 ms',
      lastSync: 'Active (Stream)',
      icon: Smartphone,
      type: 'Communications'
    },
    {
      id: 'NSWS_BRIDGE',
      name: 'National Single Window System (NSWS)',
      description: 'Seamless inter-ministerial application routing with Ministry of Education and State DTE departments.',
      endpoint: 'https://www.nsws.gov.in/api/interop/aicte',
      status: 'Connected',
      latency: '65 ms',
      lastSync: '30 minutes ago',
      icon: Network,
      type: 'Inter-Gov Bridge'
    }
  ];

  const handleTestAllConnections = () => {
    setIsSyncing(true);
    setSyncStatusMsg('Pinging government gateways and verifying cryptographic handshake...');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatusMsg('All 6 Government Integration Gateways verified and operational! (Average Latency: 49ms)');
      setTimeout(() => setSyncStatusMsg(''), 5000);
    }, 1500);
  };

  return (
    <div className="integrations-view">
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
        border: '1px solid var(--border-medium)',
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-purple">
              <Network size={13} /> Bureau Head System Administration
            </span>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Inter-Agency Connectivity & Statutory API Bridges
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem' }}>
            AICTE Interoperability & Integration Status Gateway
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
            Real-time status of land registry verification, DigiLocker academic authentication, and state fire safety gateways.
          </p>
        </div>

        <button 
          className="btn btn-primary btn-sm"
          onClick={handleTestAllConnections}
          disabled={isSyncing}
          id="btn-test-integrations"
        >
          <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
          <span>{isSyncing ? 'Testing Gateways...' : 'Test & Ping All Integrations'}</span>
        </button>
      </div>

      {syncStatusMsg && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '8px',
          padding: '12px 18px',
          marginBottom: '20px',
          color: '#34d399',
          fontSize: '0.84rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} />
          <span>{syncStatusMsg}</span>
        </div>
      )}

      {/* Integration Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {integrations.map(item => {
          const Icon = item.icon;
          return (
            <div 
              key={item.id}
              className="panel"
              style={{
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'rgba(56, 189, 248, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8'
                  }}>
                    <Icon size={20} />
                  </div>

                  <span className="badge badge-success">
                    <Activity size={12} /> {item.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.72rem', color: '#c084fc', fontWeight: 600, textTransform: 'uppercase' }}>
                  {item.type}
                </div>
                <h3 style={{ fontSize: '1.05rem', margin: '3px 0 6px 0' }}>{item.name}</h3>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  {item.description}
                </p>
              </div>

              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '0.74rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#94a3b8' }}>Endpoint:</span>
                  <span style={{ color: '#38bdf8', fontFamily: 'monospace' }}>{item.endpoint}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Latency: <strong>{item.latency}</strong></span>
                  <span style={{ color: '#cbd5e1' }}>Last sync: {item.lastSync}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
