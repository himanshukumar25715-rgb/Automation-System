/**
 * CPU Scheduling Algorithm Engine for AICTE Approval Workflows (Client-Side Engine)
 * 
 * Maps Administrative Scrutiny & EVC Inspection workflows to Operating System CPU Scheduling Algorithms:
 * - FCFS (First-Come, First-Served)
 * - SJF / SRTF (Shortest Job First - Route Complexity based)
 * - Priority Scheduling (Preemptive SLA Deadline & Escalation based)
 * - Round Robin (RR - Fair Quota Time-Slicing across Regional Desks)
 */

export const ROUTE_BURST_MAP = {
  'ONLY_SCRUTINY': 2,        // Quick standard review
  'SCRUTINY_EVC': 5,         // Scrutiny + Inspection coordination
  'SCRUTINY_EVC_SAC': 8,     // Complex scrutiny, EVC + Appellate Hearing
  'ONLY_EVC': 4,             // Fast-track on-site verification
  'EVC_SAC': 6               // Re-inspection + Appeal
};

export function calculateJobPriority(app) {
  if (app.escalationLevel === 3) return 1;
  if (app.escalationLevel === 2 || app.daysInCurrentStage > app.slaDays) return 2;
  if (app.escalationLevel === 1 || (app.slaDays - app.daysInCurrentStage <= 2)) return 3;
  if (app.status === 'Deficiency Issued') return 2;
  return 4;
}

export function transformAppsToProcesses(applications) {
  return applications.map((app) => {
    const burstTime = ROUTE_BURST_MAP[app.route] || 4;
    const priority = calculateJobPriority(app);
    const arrivalTime = Math.max(0, 10 - app.daysInCurrentStage);

    return {
      pid: app.id,
      name: app.instituteName,
      region: app.region,
      route: app.route,
      currentStage: app.currentStage,
      burstTime,
      remainingTime: burstTime,
      arrivalTime,
      priority,
      status: app.status,
      escalationLevel: app.escalationLevel || 0,
      assignedOfficer: app.assignedOfficer
    };
  });
}

export function scheduleFCFS(processes) {
  const procs = processes.map(p => ({ ...p })).sort((a, b) => a.arrivalTime - b.arrivalTime);
  let currentTime = 0;
  const timeline = [];
  const results = [];

  for (const proc of procs) {
    if (currentTime < proc.arrivalTime) {
      currentTime = proc.arrivalTime;
    }
    const startTime = currentTime;
    const completionTime = startTime + proc.burstTime;
    const turnaroundTime = completionTime - proc.arrivalTime;
    const waitingTime = startTime - proc.arrivalTime;

    timeline.push({
      pid: proc.pid,
      name: proc.name,
      start: startTime,
      end: completionTime,
      duration: proc.burstTime,
      priority: proc.priority
    });

    results.push({
      ...proc,
      startTime,
      completionTime,
      turnaroundTime: Math.max(0, turnaroundTime),
      waitingTime: Math.max(0, waitingTime)
    });

    currentTime = completionTime;
  }

  return summarizeSchedule('FCFS (First-Come, First-Served)', results, timeline);
}

export function scheduleSJF(processes) {
  const procs = processes.map(p => ({ ...p }));
  let currentTime = 0;
  const completed = [];
  const timeline = [];
  const n = procs.length;

  while (completed.length < n) {
    const available = procs.filter(p => p.arrivalTime <= currentTime && !completed.find(c => c.pid === p.pid));

    if (available.length === 0) {
      currentTime++;
      continue;
    }

    available.sort((a, b) => a.burstTime - b.burstTime);
    const proc = available[0];

    const startTime = currentTime;
    const completionTime = startTime + proc.burstTime;
    const turnaroundTime = completionTime - proc.arrivalTime;
    const waitingTime = startTime - proc.arrivalTime;

    timeline.push({
      pid: proc.pid,
      name: proc.name,
      start: startTime,
      end: completionTime,
      duration: proc.burstTime,
      priority: proc.priority
    });

    completed.push({
      ...proc,
      startTime,
      completionTime,
      turnaroundTime: Math.max(0, turnaroundTime),
      waitingTime: Math.max(0, waitingTime)
    });

    currentTime = completionTime;
  }

  return summarizeSchedule('SJF (Shortest Job First / Route Complexity)', completed, timeline);
}

export function schedulePriority(processes) {
  const procs = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
  let currentTime = 0;
  let completedCount = 0;
  const n = procs.length;
  const timeline = [];
  let currentProcess = null;
  let sliceStart = 0;

  const maxTicks = 120;
  let ticks = 0;

  while (completedCount < n && ticks < maxTicks) {
    ticks++;
    const available = procs.filter(p => p.arrivalTime <= currentTime && p.remainingTime > 0);

    if (available.length === 0) {
      if (currentProcess) {
        timeline.push({
          pid: currentProcess.pid,
          name: currentProcess.name,
          start: sliceStart,
          end: currentTime,
          duration: currentTime - sliceStart,
          priority: currentProcess.priority
        });
        currentProcess = null;
      }
      currentTime++;
      continue;
    }

    available.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a.remainingTime - b.remainingTime;
    });

    const chosen = available[0];

    if (!currentProcess || currentProcess.pid !== chosen.pid) {
      if (currentProcess) {
        timeline.push({
          pid: currentProcess.pid,
          name: currentProcess.name,
          start: sliceStart,
          end: currentTime,
          duration: currentTime - sliceStart,
          priority: currentProcess.priority
        });
      }
      currentProcess = chosen;
      sliceStart = currentTime;
    }

    chosen.remainingTime--;
    currentTime++;

    if (chosen.remainingTime === 0) {
      chosen.completionTime = currentTime;
      chosen.turnaroundTime = chosen.completionTime - chosen.arrivalTime;
      chosen.waitingTime = chosen.turnaroundTime - chosen.burstTime;
      completedCount++;

      timeline.push({
        pid: chosen.pid,
        name: chosen.name,
        start: sliceStart,
        end: currentTime,
        duration: currentTime - sliceStart,
        priority: chosen.priority
      });
      currentProcess = null;
    }
  }

  const compressedTimeline = [];
  for (const block of timeline) {
    if (block.duration <= 0) continue;
    const last = compressedTimeline[compressedTimeline.length - 1];
    if (last && last.pid === block.pid && last.end === block.start) {
      last.end = block.end;
      last.duration += block.duration;
    } else {
      compressedTimeline.push({ ...block });
    }
  }

  return summarizeSchedule('Priority Preemptive (SLA Urgency & Escalation)', procs, compressedTimeline);
}

export function scheduleRoundRobin(processes, quantum = 2) {
  const procs = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
  let currentTime = 0;
  const queue = [];
  const timeline = [];
  const completed = [];
  const visited = new Set();

  procs.filter(p => p.arrivalTime <= currentTime).forEach(p => {
    queue.push(p);
    visited.add(p.pid);
  });

  let maxTicks = 120;
  let ticks = 0;

  while ((queue.length > 0 || completed.length < procs.length) && ticks < maxTicks) {
    ticks++;

    if (queue.length === 0) {
      const nextArr = procs.filter(p => !visited.has(p.pid)).sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
      if (nextArr) {
        currentTime = nextArr.arrivalTime;
        queue.push(nextArr);
        visited.add(nextArr.pid);
      } else {
        break;
      }
    }

    const current = queue.shift();
    const execTime = Math.min(current.remainingTime, quantum);
    const start = currentTime;
    currentTime += execTime;
    current.remainingTime -= execTime;

    timeline.push({
      pid: current.pid,
      name: current.name,
      start,
      end: currentTime,
      duration: execTime,
      priority: current.priority
    });

    procs.filter(p => p.arrivalTime <= currentTime && !visited.has(p.pid)).forEach(p => {
      queue.push(p);
      visited.add(p.pid);
    });

    if (current.remainingTime > 0) {
      queue.push(current);
    } else {
      current.completionTime = currentTime;
      current.turnaroundTime = current.completionTime - current.arrivalTime;
      current.waitingTime = current.turnaroundTime - current.burstTime;
      completed.push(current);
    }
  }

  return summarizeSchedule(`Round Robin (Quantum = ${quantum} Days)`, procs, timeline);
}

function summarizeSchedule(algorithmName, processes, timeline) {
  const totalWaiting = processes.reduce((acc, p) => acc + (p.waitingTime || 0), 0);
  const totalTurnaround = processes.reduce((acc, p) => acc + (p.turnaroundTime || 0), 0);
  const avgWaitingTime = (totalWaiting / processes.length).toFixed(1);
  const avgTurnaroundTime = (totalTurnaround / processes.length).toFixed(1);
  
  const makespan = timeline.length > 0 ? timeline[timeline.length - 1].end : 0;
  const totalWork = processes.reduce((acc, p) => acc + p.burstTime, 0);
  const cpuUtilization = makespan > 0 ? ((totalWork / makespan) * 100).toFixed(1) : 100;

  return {
    algorithm: algorithmName,
    makespan,
    avgWaitingTime,
    avgTurnaroundTime,
    cpuUtilization: Math.min(100, cpuUtilization),
    timeline,
    processes: processes.map(p => ({
      pid: p.pid,
      name: p.name,
      region: p.region,
      route: p.route,
      burstTime: p.burstTime,
      priority: p.priority,
      waitingTime: p.waitingTime || 0,
      turnaroundTime: p.turnaroundTime || 0,
      completionTime: p.completionTime || 0
    }))
  };
}
