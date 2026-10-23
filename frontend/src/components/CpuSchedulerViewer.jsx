import React, { useState } from 'react';
import { 
  Cpu, 
  Clock, 
  BarChart2, 
  CheckCircle2, 
  Play, 
  Zap, 
  TrendingUp, 
  Sliders, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { 
  transformAppsToProcesses, 
  scheduleFCFS, 
  scheduleSJF, 
  schedulePriority, 
  scheduleRoundRobin 
} from '../utils/cpuScheduler';

export function CpuSchedulerViewer({ applications }) {
  const [selectedAlgo, setSelectedAlgo] = useState('PRIORITY');
  const [quantum, setQuantum] = useState(2);
  const [lastDispatched, setLastDispatched] = useState(false);

  const processes = transformAppsToProcesses(applications);

  let currentSchedule;
  switch (selectedAlgo) {
    case 'FCFS':
      currentSchedule = scheduleFCFS(processes);
      break;
    case 'SJF':
      currentSchedule = scheduleSJF(processes);
      break;
    case 'ROUND_ROBIN':
      currentSchedule = scheduleRoundRobin(processes, quantum);
      break;
    case 'PRIORITY':
    default:
      currentSchedule = schedulePriority(processes);
      break;
  }

  // Quick comparisons across all algorithms
  const fcfsRes = scheduleFCFS(processes);
  const sjfRes = scheduleSJF(processes);
  const prioRes = schedulePriority(processes);
  const rrRes = scheduleRoundRobin(processes, quantum);

  const handleDispatchSchedule = () => {
    setLastDispatched(true);
    setTimeout(() => setLastDispatched(false), 3500);
  };

  const getPriorityBadge = (prio) => {
    switch (prio) {
      case 1:
        return <span className="badge badge-critical">P1 (Apex Breach)</span>;
      case 2:
        return <span className="badge badge-warning">P2 (Overdue/Deficiency)</span>;
      case 3:
        return <span className="badge badge-info">P3 (Nearing SLA)</span>;
      default:
        return <span className="badge badge-success">P4 (Normal SLA)</span>;
    }
  };

  return (
    <div className="cpu-scheduler-viewer">
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 24px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-purple">
              <Cpu size={13} /> OS CPU Scheduling Algorithm Engine
            </span>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Computer Science Workload Optimization for AICTE Bureau Desks
            </span>
          </div>
          <h2 style={{ fontSize: '1.35rem', marginTop: '6px' }}>
            AICTE Approval CPU Scheduling & Workload Dispatcher
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
            Applies Classical CPU Scheduling algorithms (Priority Preemption, Round Robin, SJF, FCFS) to optimize regional officer processing, eliminate starvation, and prevent SLA breaches.
          </p>
        </div>

        <button 
          className="btn btn-primary btn-sm"
          onClick={handleDispatchSchedule}
          id="btn-dispatch-cpu-schedule"
        >
          <Zap size={14} /> Dispatch Optimal Queue Order
        </button>
      </div>

      {lastDispatched && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '8px',
          padding: '12px 20px',
          marginBottom: '20px',
          color: '#34d399',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.85rem'
        }}>
          <CheckCircle2 size={16} />
          <span>Optimal application dispatch sequence transmitted to Regional Scrutiny Officers! AWT reduced.</span>
        </div>
      )}

      {/* Algorithm Selector Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'PRIORITY', label: 'Preemptive SLA Priority (Recommended)', desc: 'Prevents Overdue Breaches' },
            { id: 'ROUND_ROBIN', label: `Round Robin (Quantum = ${quantum}d)`, desc: 'Fair Regional Allocation' },
            { id: 'SJF', label: 'Shortest Job First (SJF)', desc: 'Minimum Avg Wait Time' },
            { id: 'FCFS', label: 'First-Come First-Served', desc: 'Standard Chronological' },
          ].map(algo => (
            <button
              key={algo.id}
              onClick={() => setSelectedAlgo(algo.id)}
              className={`btn btn-sm ${selectedAlgo === algo.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 14px' }}
            >
              <Cpu size={14} />
              <span>{algo.label}</span>
            </button>
          ))}
        </div>

        {selectedAlgo === 'ROUND_ROBIN' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Time Quantum (Days):</span>
            <select
              value={quantum}
              onChange={(e) => setQuantum(parseInt(e.target.value, 10))}
              className="form-select"
              style={{ width: '80px', padding: '4px 8px', fontSize: '0.78rem' }}
            >
              <option value={1}>1 Day</option>
              <option value={2}>2 Days</option>
              <option value={3}>3 Days</option>
            </select>
          </div>
        )}
      </div>

      {/* Algorithm Performance KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Avg Waiting Time (AWT)</span>
            <div className="kpi-icon-wrap" style={{ color: '#38bdf8' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-value">{currentSchedule.avgWaitingTime} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>Days</span></div>
          <div className="kpi-subtext">Across {processes.length} pending applications</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Avg Turnaround Time (TAT)</span>
            <div className="kpi-icon-wrap" style={{ color: '#818cf8' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="kpi-value">{currentSchedule.avgTurnaroundTime} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>Days</span></div>
          <div className="kpi-subtext">From submission to stage sign-off</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Officer Desk Core Utilization</span>
            <div className="kpi-icon-wrap" style={{ color: '#34d399' }}>
              <Cpu size={18} />
            </div>
          </div>
          <div className="kpi-value">{currentSchedule.cpuUtilization}%</div>
          <div className="kpi-subtext">Zero idle officer capacity</div>
        </div>

        <div className="kpi-card alert-amber">
          <div className="kpi-header">
            <span className="kpi-title">Total Batch Makespan</span>
            <div className="kpi-icon-wrap" style={{ color: '#fbbf24' }}>
              <BarChart2 size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#fbbf24' }}>{currentSchedule.makespan} <span style={{ fontSize: '1rem' }}>Days</span></div>
          <div className="kpi-subtext">Total elapsed processing cycle</div>
        </div>
      </div>

      {/* Gantt Chart Execution Timeline */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">
              <BarChart2 size={20} color="#38bdf8" /> Classical Gantt Chart Execution Schedule ({currentSchedule.algorithm})
            </h3>
            <p style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
              Visual order of application review execution across the processing timeline (Units = Days)
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto', paddingBottom: '12px' }}>
          {/* Gantt Bar */}
          <div style={{
            display: 'flex',
            minWidth: '700px',
            height: '48px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid var(--border-medium)',
            background: 'rgba(15, 23, 42, 0.8)'
          }}>
            {currentSchedule.timeline.map((block, idx) => {
              const widthPct = Math.max(5, (block.duration / currentSchedule.makespan) * 100);
              const colorHue = (parseInt(block.pid.slice(-3), 10) * 45) % 360;
              return (
                <div
                  key={`${block.pid}-${idx}`}
                  style={{
                    width: `${widthPct}%`,
                    background: `hsl(${colorHue}, 70%, 35%)`,
                    borderRight: '1px solid rgba(0,0,0,0.4)',
                    padding: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '0.72rem',
                    color: '#ffffff',
                    fontWeight: 700,
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                  title={`${block.pid}: ${block.name} | [${block.start}d - ${block.end}d] | Duration: ${block.duration}d`}
                >
                  <div>{block.pid.split('-')[2]}-{block.pid.split('-')[3]}</div>
                  <div style={{ fontSize: '0.65rem', opacity: 0.85 }}>{block.duration}d</div>
                </div>
              );
            })}
          </div>

          {/* Time axis marks */}
          <div style={{ display: 'flex', justifyContent: 'space-between', minWidth: '700px', marginTop: '6px', fontSize: '0.72rem', color: '#64748b' }}>
            <span>Day 0</span>
            <span>Day {Math.floor(currentSchedule.makespan * 0.25)}</span>
            <span>Day {Math.floor(currentSchedule.makespan * 0.5)}</span>
            <span>Day {Math.floor(currentSchedule.makespan * 0.75)}</span>
            <span>Day {currentSchedule.makespan} (Completion)</span>
          </div>
        </div>
      </div>

      {/* Comparative Evaluation Matrix Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Comparison Table */}
        <div className="panel" style={{ margin: 0 }}>
          <div className="panel-header">
            <h3 className="panel-title" style={{ fontSize: '1rem' }}>
              <TrendingUp size={16} color="#34d399" /> Algorithm Benchmark
            </h3>
          </div>

          <div className="table-responsive">
            <table className="custom-table" style={{ fontSize: '0.78rem' }}>
              <thead>
                <tr>
                  <th>Algorithm</th>
                  <th>Avg WT</th>
                  <th>Avg TAT</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: selectedAlgo === 'PRIORITY' ? 'rgba(56, 189, 248, 0.1)' : undefined }}>
                  <td><strong>Priority Preemption</strong></td>
                  <td>{prioRes.avgWaitingTime}d</td>
                  <td>{prioRes.avgTurnaroundTime}d</td>
                </tr>
                <tr style={{ background: selectedAlgo === 'ROUND_ROBIN' ? 'rgba(56, 189, 248, 0.1)' : undefined }}>
                  <td><strong>Round Robin (Q={quantum})</strong></td>
                  <td>{rrRes.avgWaitingTime}d</td>
                  <td>{rrRes.avgTurnaroundTime}d</td>
                </tr>
                <tr style={{ background: selectedAlgo === 'SJF' ? 'rgba(56, 189, 248, 0.1)' : undefined }}>
                  <td><strong>SJF (Shortest Job)</strong></td>
                  <td>{sjfRes.avgWaitingTime}d</td>
                  <td>{sjfRes.avgTurnaroundTime}d</td>
                </tr>
                <tr style={{ background: selectedAlgo === 'FCFS' ? 'rgba(56, 189, 248, 0.1)' : undefined }}>
                  <td><strong>FCFS</strong></td>
                  <td>{fcfsRes.avgWaitingTime}d</td>
                  <td>{fcfsRes.avgTurnaroundTime}d</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Process Detail Table */}
        <div className="panel" style={{ margin: 0 }}>
          <div className="panel-header">
            <h3 className="panel-title" style={{ fontSize: '1rem' }}>
              <Cpu size={16} color="#818cf8" /> Scheduled Process Control Blocks (PCBs)
            </h3>
          </div>

          <div className="table-responsive">
            <table className="custom-table" style={{ fontSize: '0.78rem' }}>
              <thead>
                <tr>
                  <th>Process ID</th>
                  <th>Institution</th>
                  <th>Burst (Days)</th>
                  <th>Priority</th>
                  <th>Waiting Time</th>
                  <th>Turnaround Time</th>
                </tr>
              </thead>
              <tbody>
                {currentSchedule.processes.map(p => (
                  <tr key={p.pid}>
                    <td>
                      <span style={{ fontWeight: 700, color: '#38bdf8' }}>{p.pid}</span>
                    </td>
                    <td>{p.name.slice(0, 24)}...</td>
                    <td>{p.burstTime} Days</td>
                    <td>{getPriorityBadge(p.priority)}</td>
                    <td>
                      <span style={{ color: p.waitingTime > 15 ? '#f87171' : '#cbd5e1' }}>
                        {p.waitingTime} Days
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{p.turnaroundTime} Days</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
