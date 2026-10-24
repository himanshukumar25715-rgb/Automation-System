import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  Handle, 
  Position, 
  MarkerType,
  useNodesState, 
  useEdgesState 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './RealtimeGraphFlow.css';

import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  ArrowRight, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  FileText, 
  Gavel, 
  Users, 
  Sparkles, 
  Calendar, 
  Activity
} from 'lucide-react';
import { WORKFLOW_ROUTES } from '../data/mockData';
import { Role } from '../lib/permissions';

// Map icon string or role to Lucide component
const getStageIcon = (iconName, size = 16) => {
  switch (iconName) {
    case 'file': return <FileText size={size} />;
    case 'scrutiny': return <ShieldCheck size={size} />;
    case 'evc': return <Calendar size={size} />;
    case 'inspect': return <Building2 size={size} />;
    case 'gavel': return <Gavel size={size} />;
    case 'council': return <CheckCircle2 size={size} />;
    case 'warning': return <AlertTriangle size={size} />;
    case 'alert': return <AlertCircle size={size} />;
    case 'users': return <Users size={size} />;
    case 'ai': return <Sparkles size={size} />;
    default: return <Activity size={size} />;
  }
};

/**
 * High-Precision Custom Node for React Flow
 */
function CustomStageNode({ data, selected }) {
  const isBottleneck = data.status === 'bottleneck';
  const isActive = data.status === 'active';
  const isCompleted = data.status === 'completed';
  const isWarning = data.status === 'warning';

  let statusClass = 'node-status-pending';
  let statusText = data.badge || 'QUEUED';
  if (isCompleted) {
    statusClass = 'node-status-completed';
    statusText = data.badge || 'COMPLETED';
  } else if (isBottleneck) {
    statusClass = 'node-status-bottleneck';
    statusText = data.badge || 'SLA OVERDUE';
  } else if (isActive) {
    statusClass = 'node-status-active';
    statusText = data.badge || 'ACTIVE STAGE';
  } else if (isWarning) {
    statusClass = 'node-status-warning';
    statusText = data.badge || 'DEFICIENCY NOTICE';
  }

  const borderAccent = data.accentColor || (isCompleted ? '#059669' : isBottleneck ? '#dc2626' : isActive ? '#0284c7' : isWarning ? '#d97706' : '#cbd5e1');

  return (
    <div 
      className={`custom-flow-node ${selected ? 'selected' : ''} ${data.isDeficiency ? 'deficiency-node' : ''}`}
      style={{
        borderLeft: `4px solid ${borderAccent}`,
      }}
      onClick={() => data.onNodeClick && data.onNodeClick(data)}
    >
      {/* Target handle (incoming left) */}
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ background: borderAccent }}
      />

      {/* Auxiliary handles for vertical branching (top/bottom) */}
      <Handle 
        type="target" 
        position={Position.Top} 
        id="top" 
        style={{ background: borderAccent, opacity: data.hasTopHandle ? 1 : 0 }} 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="bottom" 
        style={{ background: borderAccent, opacity: data.hasBottomHandle ? 1 : 0 }} 
      />

      {/* Radar Ping for Active/Bottleneck Stages */}
      {(isActive || isBottleneck) && (
        <div className="node-radar-wrap">
          <div className="node-radar-ping" style={{ background: isBottleneck ? '#dc2626' : '#0284c7' }} />
          <div className="node-radar-dot" style={{ background: isBottleneck ? '#dc2626' : '#0284c7' }} />
        </div>
      )}

      {/* Top Bar: Code and Status Pill */}
      <div className="node-top-bar">
        <span className="node-step-code">{data.stepCode || 'STAGE'}</span>
        <span className={`node-status-pill ${statusClass}`}>
          {isCompleted && <CheckCircle2 size={10} />}
          {isBottleneck && <AlertCircle size={10} />}
          {isWarning && <AlertTriangle size={10} />}
          {isActive && <Activity size={10} />}
          <span>{statusText}</span>
        </span>
      </div>

      {/* Body: Icon + Title & Subtitle */}
      <div className="node-body">
        <div 
          className="node-icon-wrap" 
          style={{ 
            background: `${borderAccent}14`, 
            color: borderAccent 
          }}
        >
          {getStageIcon(data.icon, 17)}
        </div>
        <div className="node-info">
          <div className="node-title">{data.title}</div>
          <div className="node-subtitle">{data.subtitle}</div>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="node-footer">
        <span className="node-count-badge">
          {data.count !== undefined ? (
            <>
              <strong>{data.count}</strong>
              <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                {data.count === 1 ? 'case' : 'cases'}
              </span>
            </>
          ) : (
            <span style={{ color: 'var(--text-dim)' }}>{data.officer || 'GovVerify'}</span>
          )}
        </span>

        {data.overdueCount > 0 ? (
          <span className="node-overdue-alert">
            {data.overdueCount} Overdue
          </span>
        ) : data.slaDays ? (
          <span className="node-sla-badge">
            SLA: {data.slaDays}d
          </span>
        ) : data.agingText ? (
          <span className="node-sla-badge" style={{ color: isBottleneck ? 'var(--ruby-600)' : undefined, fontWeight: 700 }}>
            {data.agingText}
          </span>
        ) : null}
      </div>

      {/* Source handle (outgoing right) */}
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ background: borderAccent }}
      />
    </div>
  );
}

// Memoized custom node registration for React Flow
const nodeTypes = {
  stageNode: CustomStageNode,
};

/**
 * Main RealtimeGraphFlow Component
 * Tailored dynamically for Institution, Regional Officer, and Bureau Head
 */
export function RealtimeGraphFlow({
  role,
  currentUser,
  applications = [],
  onSelectApplication,
  onProgressStage,
  onOpenCaseSummary,
  onNavigateTab
}) {
  const [selectedRoute, setSelectedRoute] = useState('ALL');
  const [selectedNodeData, setSelectedNodeData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const currentRoleType = currentUser?.role || role || Role.REGIONAL_OFFICER;

  // Handle clicking a node
  const handleNodeClick = useCallback((nodeData) => {
    setSelectedNodeData(nodeData);
  }, []);

  // Generate Flow Graph (Nodes & Edges) based on Role & Live Data
  const { initialNodes, initialEdges } = useMemo(() => {
    // -------------------------------------------------------------
    // ROLE: INSTITUTION (Single Application Progress Journey Flow)
    // -------------------------------------------------------------
    if (currentRoleType === Role.INSTITUTION) {
      const myApp = applications[0] || {
        id: 'APP-2026-WRO-1049',
        instituteName: 'Maharashtra Institute of Technology & Research',
        route: 'SCRUTINY_EVC',
        currentStage: 'EVC Scheduling',
        stageIndex: 2,
        daysInCurrentStage: 9,
        slaDays: 5,
        status: 'Overdue',
        assignedOfficer: 'Dr. R.K. Patil (RO Mumbai)',
        deficiencies: []
      };

      const routeDef = WORKFLOW_ROUTES[myApp.route] || WORKFLOW_ROUTES.SCRUTINY_EVC;
      const stages = routeDef.stages;
      const hasDeficiency = myApp.deficiencies && myApp.deficiencies.length > 0;

      const nodes = [];
      const edges = [];

      const xSpacing = 270;
      const startX = 40;
      const startY = 130;

      stages.forEach((stageName, idx) => {
        const isCompleted = idx < myApp.stageIndex;
        const isActive = idx === myApp.stageIndex;
        const isOverdue = isActive && myApp.daysInCurrentStage > myApp.slaDays;

        let iconName = 'file';
        if (stageName.toLowerCase().includes('scrutiny')) iconName = 'scrutiny';
        else if (stageName.toLowerCase().includes('schedule')) iconName = 'evc';
        else if (stageName.toLowerCase().includes('inspect')) iconName = 'inspect';
        else if (stageName.toLowerCase().includes('sac') || stageName.toLowerCase().includes('hearing')) iconName = 'gavel';
        else if (stageName.toLowerCase().includes('council') || stageName.toLowerCase().includes('approval')) iconName = 'council';

        nodes.push({
          id: `inst-stage-${idx}`,
          type: 'stageNode',
          position: { x: startX + idx * xSpacing, y: startY },
          data: {
            stepCode: `STEP 0${idx + 1}`,
            title: stageName,
            subtitle: isActive 
              ? `${myApp.daysInCurrentStage}d in current stage • ${myApp.assignedOfficer}`
              : isCompleted 
              ? 'Statutory requirement verified & cleared' 
              : `Pending prior stage approval (SLA: ${myApp.slaDays}d)`,
            icon: iconName,
            status: isOverdue ? 'bottleneck' : isActive ? 'active' : isCompleted ? 'completed' : 'pending',
            badge: isOverdue ? 'SLA OVERDUE' : isActive ? 'LIVE NOW' : isCompleted ? 'CLEARED' : 'UPCOMING',
            agingText: isActive ? `${myApp.daysInCurrentStage} / ${myApp.slaDays}d` : null,
            slaDays: myApp.slaDays,
            officer: myApp.assignedOfficer,
            matchedApps: [myApp],
            stageIndex: idx,
            onNodeClick: handleNodeClick,
            hasBottomHandle: hasDeficiency && idx === 1,
            hasTopHandle: hasDeficiency && idx === 1
          }
        });

        // Connect edges
        if (idx > 0) {
          const edgeActive = idx <= myApp.stageIndex;
          edges.push({
            id: `edge-${idx - 1}-${idx}`,
            source: `inst-stage-${idx - 1}`,
            target: `inst-stage-${idx}`,
            animated: edgeActive,
            style: {
              stroke: isOverdue ? '#dc2626' : edgeActive ? '#059669' : '#cbd5e1',
              strokeWidth: edgeActive ? 2.5 : 1.5,
              strokeDasharray: edgeActive ? '6, 4' : undefined
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: isOverdue ? '#dc2626' : edgeActive ? '#059669' : '#cbd5e1',
            }
          });
        }
      });

      // Deficiency Memo Return Loop Node if active
      if (hasDeficiency) {
        const def = myApp.deficiencies[0];
        nodes.push({
          id: 'inst-deficiency-node',
          type: 'stageNode',
          position: { x: startX + 1 * xSpacing, y: startY + 160 },
          data: {
            stepCode: 'RECTIFICATION',
            title: 'Deficiency Memo Recorded',
            subtitle: `${def.clause}: Cure by ${def.rectificationDeadline}`,
            icon: 'warning',
            status: 'warning',
            badge: 'ACTION REQUIRED',
            isDeficiency: true,
            agingText: 'Cure Period Active',
            matchedApps: [myApp],
            onNodeClick: handleNodeClick,
            hasTopHandle: true,
            hasBottomHandle: false
          }
        });

        // Edge down from Scrutiny to Deficiency
        edges.push({
          id: 'edge-scrutiny-deficiency',
          source: 'inst-stage-1',
          sourceHandle: 'bottom',
          target: 'inst-deficiency-node',
          targetHandle: 'top',
          animated: true,
          style: { stroke: '#d97706', strokeWidth: 2, strokeDasharray: '5, 5' },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#d97706' }
        });

        // Edge loop back from Deficiency to Scrutiny
        edges.push({
          id: 'edge-deficiency-resubmit',
          source: 'inst-deficiency-node',
          target: 'inst-stage-1',
          targetHandle: 'top',
          animated: true,
          style: { stroke: '#b45309', strokeWidth: 2, strokeDasharray: '4, 4' },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#b45309' }
        });
      }

      return { initialNodes: nodes, initialEdges: edges };
    }

    // -------------------------------------------------------------
    // ROLE: REGIONAL_OFFICER (Regional Pipeline & Stage Throughput)
    // -------------------------------------------------------------
    if (currentRoleType === Role.REGIONAL_OFFICER) {
      const targetRegion = currentUser?.region || 'WRO';
      const regApps = applications.filter(a => selectedRoute === 'ALL' || a.route === selectedRoute);

      const stagesConfig = [
        { 
          id: 'ro-intake', 
          code: 'PHASE 01', 
          title: 'Regional Intake Gateway', 
          subtitle: `${targetRegion} Document Ingestion & AI Check`, 
          icon: 'file', 
          stageName: 'Applied', 
          sla: 3 
        },
        { 
          id: 'ro-scrutiny', 
          code: 'PHASE 02', 
          title: 'Preliminary Scrutiny Cell', 
          subtitle: 'APH Clause 2.4 Land, Building & Faculty', 
          icon: 'scrutiny', 
          stageName: 'Preliminary Scrutiny', 
          sla: 7 
        },
        { 
          id: 'ro-evc-sched', 
          code: 'PHASE 03', 
          title: 'EVC Committee Scheduling', 
          subtitle: 'Expert Allocation & Biometric Scheduling', 
          icon: 'evc', 
          stageName: 'EVC Scheduling', 
          sla: 5 
        },
        { 
          id: 'ro-evc-inspect', 
          code: 'PHASE 04', 
          title: 'EVC Inspection & Report Hub', 
          subtitle: '48-hr Sealed Geo-Tagged Report Upload', 
          icon: 'inspect', 
          stageName: 'EVC Inspection', 
          sla: 2 
        },
        { 
          id: 'ro-sac', 
          code: 'PHASE 05', 
          title: 'SAC / SHC Hearing Bureau', 
          subtitle: 'Appellate Committee & Deficiency Review', 
          icon: 'gavel', 
          stageName: 'SAC / SHC Hearing', 
          sla: 14 
        },
        { 
          id: 'ro-council', 
          code: 'PHASE 06', 
          title: 'Council Final EoA Approval', 
          subtitle: 'Digital Signature & SHA-256 Ledger Entry', 
          icon: 'council', 
          stageName: 'Council Approval', 
          sla: 7 
        }
      ];

      const nodes = [];
      const edges = [];
      const xSpacing = 260;
      const startX = 40;
      const startY = 130;

      // Deficiency count in region
      const deficiencyApps = regApps.filter(a => a.deficiencies && a.deficiencies.length > 0);

      stagesConfig.forEach((cfg, idx) => {
        const matched = regApps.filter(a => {
          if (idx === 0) return a.currentStage === 'Applied' || a.stageIndex === 0;
          return a.currentStage === cfg.stageName || a.currentStage.includes(cfg.stageName.split(' ')[0]);
        });

        const overdueList = matched.filter(a => a.daysInCurrentStage > a.slaDays || a.status === 'Overdue');
        const count = matched.length;
        const overdueCount = overdueList.length;

        const isBottleneck = overdueCount > 0;
        const isActive = count > 0;

        nodes.push({
          id: cfg.id,
          type: 'stageNode',
          position: { x: startX + idx * xSpacing, y: startY },
          data: {
            stepCode: cfg.code,
            title: cfg.title,
            subtitle: cfg.subtitle,
            icon: cfg.icon,
            count,
            overdueCount,
            slaDays: cfg.sla,
            status: isBottleneck ? 'bottleneck' : isActive ? 'active' : 'pending',
            badge: isBottleneck ? `${overdueCount} BOTTLENECK` : isActive ? `${count} ACTIVE` : 'CLEAR',
            matchedApps: matched,
            stageName: cfg.stageName,
            onNodeClick: handleNodeClick,
            hasBottomHandle: idx === 1,
            hasTopHandle: idx === 1
          }
        });

        // Edge between consecutive stages
        if (idx > 0) {
          const prevMatched = regApps.filter(a => stagesConfig[idx - 1].stageName === a.currentStage);
          const hasFlow = count > 0 || prevMatched.length > 0;

          edges.push({
            id: `ro-edge-${idx - 1}-${idx}`,
            source: stagesConfig[idx - 1].id,
            target: cfg.id,
            animated: hasFlow,
            style: {
              stroke: isBottleneck ? '#dc2626' : hasFlow ? '#0284c7' : '#cbd5e1',
              strokeWidth: isBottleneck ? 3 : hasFlow ? 2.5 : 1.5,
              strokeDasharray: isBottleneck ? '4, 4' : undefined
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: isBottleneck ? '#dc2626' : hasFlow ? '#0284c7' : '#cbd5e1'
            }
          });
        }
      });

      // Branch: Deficiency Loop
      nodes.push({
        id: 'ro-deficiency-hub',
        type: 'stageNode',
        position: { x: startX + 1 * xSpacing, y: startY + 160 },
        data: {
          stepCode: 'STATUTORY BRANCH',
          title: 'Deficiency Memo Return Loop',
          subtitle: 'Reverted to institution for 7-day cure & re-verification',
          icon: 'warning',
          count: deficiencyApps.length,
          overdueCount: 0,
          status: deficiencyApps.length > 0 ? 'warning' : 'pending',
          badge: deficiencyApps.length > 0 ? `${deficiencyApps.length} PENDING CURE` : 'NO DEFICIENCY',
          isDeficiency: true,
          matchedApps: deficiencyApps,
          onNodeClick: handleNodeClick,
          hasTopHandle: true,
          hasBottomHandle: false
        }
      });

      // Edges to/from Deficiency Branch
      edges.push({
        id: 'ro-edge-scrutiny-def',
        source: 'ro-scrutiny',
        sourceHandle: 'bottom',
        target: 'ro-deficiency-hub',
        targetHandle: 'top',
        animated: deficiencyApps.length > 0,
        style: { stroke: '#d97706', strokeWidth: 2, strokeDasharray: '5, 5' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#d97706' }
      });

      edges.push({
        id: 'ro-edge-def-reverify',
        source: 'ro-deficiency-hub',
        target: 'ro-scrutiny',
        targetHandle: 'top',
        animated: deficiencyApps.length > 0,
        style: { stroke: '#b45309', strokeWidth: 2, strokeDasharray: '4, 4' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#b45309' }
      });

      return { initialNodes: nodes, initialEdges: edges };
    }

    // -------------------------------------------------------------
    // ROLE: BUREAU_HEAD (National Multi-Track Routing & SLA Monitor)
    // -------------------------------------------------------------
    const allApps = applications;
    const l1Count = allApps.filter(a => a.escalationLevel === 1).length;
    const l2Count = allApps.filter(a => a.escalationLevel === 2).length;
    const l3Count = allApps.filter(a => a.escalationLevel >= 3).length;
    const totalEscalations = l1Count + l2Count + l3Count;

    const fastTrackApps = allApps.filter(a => a.route === 'ONLY_SCRUTINY');
    const standardApps = allApps.filter(a => a.route === 'SCRUTINY_EVC');
    const complexApps = allApps.filter(a => a.route === 'SCRUTINY_EVC_SAC' || a.route === 'EVC_SAC');
    const approvedApps = allApps.filter(a => a.currentStage === 'Council Approval' || a.status === 'Approved');

    const nodes = [
      // 1. National Ingestion Gateway
      {
        id: 'bh-nat-gate',
        type: 'stageNode',
        position: { x: 30, y: 190 },
        data: {
          stepCode: 'GATEWAY 01',
          title: '8 AICTE Regional Offices',
          subtitle: 'NRO, WRO, SRO, CRO, ERO, NWRO, SWRO, SCRO',
          icon: 'file',
          count: allApps.length,
          overdueCount: 0,
          status: 'completed',
          badge: 'NATIONAL INTAKE',
          matchedApps: allApps,
          onNodeClick: handleNodeClick
        }
      },

      // 2. Automated Rule Engine
      {
        id: 'bh-ai-engine',
        type: 'stageNode',
        position: { x: 280, y: 190 },
        data: {
          stepCode: 'AI ENGINE 02',
          title: 'APH Rule & Document Validator',
          subtitle: 'Instant Land Lease, Fire NOC & Faculty Auditing',
          icon: 'ai',
          count: allApps.length,
          overdueCount: 0,
          status: 'active',
          badge: 'AUTO-VALIDATION',
          matchedApps: allApps,
          onNodeClick: handleNodeClick
        }
      },

      // 3A. Top Branch: Fast-Track Auto-Approval
      {
        id: 'bh-track-fast',
        type: 'stageNode',
        position: { x: 550, y: 50 },
        data: {
          stepCode: 'TRACK A',
          title: 'Fast-Track Extension of Approval',
          subtitle: 'Direct AI-Validated Extension (EoA) Stream',
          icon: 'council',
          count: fastTrackApps.length,
          overdueCount: fastTrackApps.filter(a => a.daysInCurrentStage > a.slaDays).length,
          status: 'completed',
          badge: 'FAST-TRACK',
          accentColor: '#059669',
          matchedApps: fastTrackApps,
          onNodeClick: handleNodeClick
        }
      },

      // 3B. Middle Branch: Standard Scrutiny + EVC
      {
        id: 'bh-track-std',
        type: 'stageNode',
        position: { x: 550, y: 190 },
        data: {
          stepCode: 'TRACK B',
          title: 'Standard Track (Scrutiny + EVC)',
          subtitle: 'Increase in Intake & New Technical Institutions',
          icon: 'scrutiny',
          count: standardApps.length,
          overdueCount: standardApps.filter(a => a.daysInCurrentStage > a.slaDays).length,
          status: standardApps.some(a => a.daysInCurrentStage > a.slaDays) ? 'bottleneck' : 'active',
          badge: 'STANDARD TRACK',
          accentColor: '#7c3aed',
          matchedApps: standardApps,
          onNodeClick: handleNodeClick
        }
      },

      // 3C. Bottom Branch: Complex Route (Land, Legal & SAC)
      {
        id: 'bh-track-complex',
        type: 'stageNode',
        position: { x: 550, y: 330 },
        data: {
          stepCode: 'TRACK C',
          title: 'Complex Route (Land, Site & Appeals)',
          subtitle: 'Mandatory Standing Hearing Committee (SHC)',
          icon: 'gavel',
          count: complexApps.length,
          overdueCount: complexApps.filter(a => a.daysInCurrentStage > a.slaDays).length,
          status: 'warning',
          badge: 'HIGH SCRUTINY',
          accentColor: '#ea580c',
          matchedApps: complexApps,
          onNodeClick: handleNodeClick
        }
      },

      // 4. SLA Escalation Watchdog (Special Central Node)
      {
        id: 'bh-watchdog',
        type: 'stageNode',
        position: { x: 550, y: 470 },
        data: {
          stepCode: 'WATCHDOG',
          title: 'National SLA Escalation Monitor',
          subtitle: `Active: L1 (${l1Count}) • L2 (${l2Count}) • L3 (${l3Count})`,
          icon: 'alert',
          count: totalEscalations,
          overdueCount: totalEscalations,
          status: totalEscalations > 0 ? 'bottleneck' : 'completed',
          badge: totalEscalations > 0 ? `${totalEscalations} ESCALATED` : 'SLA HEALTHY',
          accentColor: '#dc2626',
          matchedApps: allApps.filter(a => a.escalationLevel > 0),
          onNodeClick: handleNodeClick
        }
      },

      // 5. Expert Pool Dispatch Hub
      {
        id: 'bh-expert-hub',
        type: 'stageNode',
        position: { x: 820, y: 190 },
        data: {
          stepCode: 'DIRECTORATE',
          title: 'National Expert Allocation Hub',
          subtitle: 'Autonomous Evaluator Dispatch & Integrity Match',
          icon: 'users',
          count: standardApps.length + complexApps.length,
          overdueCount: 0,
          status: 'active',
          badge: 'EXPERT ALLOCATED',
          matchedApps: [...standardApps, ...complexApps],
          onNodeClick: handleNodeClick
        }
      },

      // 6. Central AICTE Council
      {
        id: 'bh-council',
        type: 'stageNode',
        position: { x: 1090, y: 190 },
        data: {
          stepCode: 'STATUTORY ENDPOINT',
          title: 'AICTE Central Council Approval',
          subtitle: 'Digital EoA Generation & Cryptographic SHA-256 Ledger',
          icon: 'council',
          count: approvedApps.length,
          overdueCount: 0,
          status: 'completed',
          badge: 'FINAL ORDER',
          accentColor: '#059669',
          matchedApps: approvedApps,
          onNodeClick: handleNodeClick
        }
      }
    ];

    const edges = [
      // Intake -> AI Validator
      {
        id: 'bh-edge-1-2',
        source: 'bh-nat-gate',
        target: 'bh-ai-engine',
        animated: true,
        style: { stroke: '#0284c7', strokeWidth: 2.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#0284c7' }
      },
      // AI Validator splits into 3 Tracks
      {
        id: 'bh-edge-ai-fast',
        source: 'bh-ai-engine',
        target: 'bh-track-fast',
        animated: true,
        style: { stroke: '#059669', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#059669' }
      },
      {
        id: 'bh-edge-ai-std',
        source: 'bh-ai-engine',
        target: 'bh-track-std',
        animated: true,
        style: { stroke: '#7c3aed', strokeWidth: 2.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#7c3aed' }
      },
      {
        id: 'bh-edge-ai-complex',
        source: 'bh-ai-engine',
        target: 'bh-track-complex',
        animated: true,
        style: { stroke: '#ea580c', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#ea580c' }
      },
      // Standard & Complex -> Expert Hub
      {
        id: 'bh-edge-std-expert',
        source: 'bh-track-std',
        target: 'bh-expert-hub',
        animated: true,
        style: { stroke: '#7c3aed', strokeWidth: 2.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#7c3aed' }
      },
      {
        id: 'bh-edge-complex-expert',
        source: 'bh-track-complex',
        target: 'bh-expert-hub',
        animated: true,
        style: { stroke: '#ea580c', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#ea580c' }
      },
      // Expert Hub -> Central Council
      {
        id: 'bh-edge-expert-council',
        source: 'bh-expert-hub',
        target: 'bh-council',
        animated: true,
        style: { stroke: '#059669', strokeWidth: 2.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#059669' }
      },
      // Fast-Track bypasses Expert Hub directly to Council
      {
        id: 'bh-edge-fast-council',
        source: 'bh-track-fast',
        target: 'bh-council',
        animated: true,
        style: { stroke: '#059669', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#059669' }
      },
      // Standard & Complex feed into SLA Escalation Watchdog if overdue
      {
        id: 'bh-edge-std-watchdog',
        source: 'bh-track-std',
        target: 'bh-watchdog',
        animated: totalEscalations > 0,
        style: { stroke: '#dc2626', strokeWidth: 2, strokeDasharray: '4, 4' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#dc2626' }
      }
    ];

    return { initialNodes: nodes, initialEdges: edges };
  }, [currentRoleType, applications, selectedRoute, currentUser, handleNodeClick]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes and edges whenever initialNodes/initialEdges recalculate
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Fit view when instance is ready or expanded
  useEffect(() => {
    if (reactFlowInstance) {
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.15, duration: 400 });
      }, 100);
    }
  }, [reactFlowInstance, isExpanded, currentRoleType, selectedRoute]);

  const handleResetView = () => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.15, duration: 400 });
    }
  };

  return (
    <div className={`realtime-graph-container ${isExpanded ? 'expanded' : ''}`}>
      {/* Top Header Bar */}
      <div className="graph-header">
        <div className="graph-header-left">
          <div className="live-pulse-badge">
            <span className="live-pulse-dot" />
            <span>REAL-TIME ENGINE</span>
          </div>
          <div>
            <h2 className="graph-title">
              {currentRoleType === Role.INSTITUTION ? (
                <>Application Approval Journey • Live Flow</>
              ) : currentRoleType === Role.REGIONAL_OFFICER ? (
                <>{currentUser?.region || 'WRO'} Regional Pipeline • Live Stage Dispatch</>
              ) : (
                <>National Multi-Track Approval Flow • Live SLA Watchdog</>
              )}
            </h2>
            <div className="graph-subtitle">
              {currentRoleType === Role.INSTITUTION
                ? 'Interactive stage milestones, statutory deficiency loops, and live SLA tracking'
                : currentRoleType === Role.REGIONAL_OFFICER
                ? 'Regional caseload throughput, live bottleneck detection, and EVC dispatch queues'
                : 'Central 8-region intake routing, APH rule engine streams, and statutory escalation flow'}
            </div>
          </div>
        </div>

        {/* Right Toolbar Actions */}
        <div className="graph-header-actions">
          {/* Route Filter Pills for Regional Officer */}
          {currentRoleType === Role.REGIONAL_OFFICER && (
            <div className="graph-route-pills">
              <button 
                className={`graph-route-pill ${selectedRoute === 'ALL' ? 'active' : ''}`}
                onClick={() => setSelectedRoute('ALL')}
              >
                All Routes
              </button>
              <button 
                className={`graph-route-pill ${selectedRoute === 'SCRUTINY_EVC' ? 'active' : ''}`}
                onClick={() => setSelectedRoute('SCRUTINY_EVC')}
              >
                Scrutiny + EVC
              </button>
              <button 
                className={`graph-route-pill ${selectedRoute === 'ONLY_SCRUTINY' ? 'active' : ''}`}
                onClick={() => setSelectedRoute('ONLY_SCRUTINY')}
              >
                EoA Fast-Track
              </button>
            </div>
          )}

          {/* Reset Zoom Button */}
          <button 
            className="btn-dark"
            onClick={handleResetView}
            style={{ padding: '6px 10px', fontSize: '0.75rem', borderRadius: '2px' }}
            title="Reset Graph Zoom & Fit View"
          >
            <RotateCcw size={13} />
            <span>Fit View</span>
          </button>

          {/* Expand/Collapse Canvas */}
          <button 
            className="btn-dark"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ padding: '6px 10px', fontSize: '0.75rem', borderRadius: '2px' }}
            title={isExpanded ? 'Collapse Canvas Height' : 'Expand Full Graph Canvas'}
          >
            {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
          </button>
        </div>
      </div>

      {/* React Flow Canvas Area */}
      <div className={`graph-canvas-wrap ${isExpanded ? 'expanded' : ''}`}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onInit={setReactFlowInstance}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.4}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#cbd5e1" gap={20} size={1} />
          <Controls showInteractive={false} position="bottom-left" />
          <MiniMap 
            nodeStrokeWidth={2}
            nodeColor={(node) => {
              if (node.data?.status === 'bottleneck') return '#dc2626';
              if (node.data?.status === 'active') return '#0284c7';
              if (node.data?.status === 'completed') return '#059669';
              if (node.data?.status === 'warning') return '#d97706';
              return '#cbd5e1';
            }}
            maskColor="rgba(248, 250, 252, 0.75)"
            style={{ height: 80, width: 120, borderRadius: '2px', border: '1px solid #cbd5e1' }}
            position="top-right"
          />
        </ReactFlow>
      </div>

      {/* Bottom Interactive Inspector Tray (Slides in when a node is selected) */}
      {selectedNodeData && (
        <div className="stage-inspector-tray">
          <div className="inspector-stage-info">
            <div className="inspector-icon">
              {getStageIcon(selectedNodeData.icon, 20)}
            </div>
            <div>
              <div className="inspector-title">
                {selectedNodeData.title}
              </div>
              <div className="inspector-meta">
                <span>{selectedNodeData.subtitle}</span>
                <span>•</span>
                <strong style={{ color: selectedNodeData.status === 'bottleneck' ? 'var(--ruby-600)' : 'var(--text-main)' }}>
                  {selectedNodeData.matchedApps?.length || 0} active application(s)
                </strong>
                {selectedNodeData.overdueCount > 0 && (
                  <span className="status-pill status-danger" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                    {selectedNodeData.overdueCount} Overdue
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="inspector-actions">
            {selectedNodeData.matchedApps && selectedNodeData.matchedApps.length > 0 && (
              <>
                <button 
                  className="btn-dark"
                  onClick={() => {
                    const firstApp = selectedNodeData.matchedApps[0];
                    if (onSelectApplication && firstApp) onSelectApplication(firstApp);
                  }}
                  style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: '2px' }}
                >
                  <FileText size={13} />
                  <span>Inspect ({selectedNodeData.matchedApps[0].id})</span>
                </button>

                {onOpenCaseSummary && (
                  <button 
                    className="btn-dark"
                    onClick={() => onOpenCaseSummary(selectedNodeData.matchedApps[0])}
                    style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: '2px' }}
                  >
                    <span>Case Summary</span>
                  </button>
                )}

                {onProgressStage && selectedNodeData.matchedApps[0].stageIndex !== undefined && (
                  <button 
                    className="btn-mint"
                    onClick={() => onProgressStage(selectedNodeData.matchedApps[0].id)}
                    style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: '2px' }}
                  >
                    <span>Approve & Progress</span>
                    <ArrowRight size={13} />
                  </button>
                )}

                {onNavigateTab && (
                  <button 
                    className="btn-dark"
                    onClick={() => onNavigateTab('applications')}
                    style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: '2px' }}
                    title="View Full Applications Queue"
                  >
                    <span>Full Queue</span>
                  </button>
                )}
              </>
            )}

            <button 
              className="btn-dark"
              onClick={() => setSelectedNodeData(null)}
              style={{ padding: '6px 10px', fontSize: '0.75rem', borderRadius: '2px' }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Legend & Real-Time Status Bar */}
      <div className="graph-legend-bar">
        <div className="legend-items">
          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Graph Legend:</span>
          <div className="legend-item">
            <span className="legend-swatch" style={{ background: '#059669' }} />
            <span>Passed / Verified</span>
          </div>
          <div className="legend-item">
            <span className="legend-swatch" style={{ background: '#0284c7' }} />
            <span>Active Stage In-Progress</span>
          </div>
          <div className="legend-item">
            <span className="legend-swatch" style={{ background: '#d97706' }} />
            <span>Deficiency / Revert Notice</span>
          </div>
          <div className="legend-item">
            <span className="legend-swatch" style={{ background: '#dc2626' }} />
            <span>SLA Overdue / Bottleneck Alert</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={12} color="#0284c7" />
          <span>Click any stage node to inspect matched dossiers & quick-action controls</span>
        </div>
      </div>
    </div>
  );
}
