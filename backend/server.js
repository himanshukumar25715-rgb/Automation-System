import express from 'express';
import cors from 'cors';
import { 
  transformAppsToProcesses, 
  scheduleFCFS, 
  scheduleSJF, 
  schedulePriority, 
  scheduleRoundRobin 
} from './cpuScheduler.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Database for AICTE Applications & Workflow State
let applications = [
  {
    id: 'APP-2026-WRO-1049',
    instituteId: '1-748920141',
    instituteName: 'Maharashtra Institute of Technology & Research',
    region: 'WRO',
    state: 'Maharashtra',
    city: 'Pune',
    type: 'Increase in Intake (AI & ML, Data Science)',
    route: 'SCRUTINY_EVC',
    currentStage: 'EVC Scheduling',
    stageIndex: 2,
    appliedDate: '2026-10-05',
    currentStageDate: '2026-10-14',
    daysInCurrentStage: 9,
    slaDays: 5,
    assignedOfficer: 'Dr. R.K. Patil (RO Mumbai)',
    status: 'Overdue',
    escalationLevel: 2,
    deficiencies: [],
    evcDetails: {
      required: true,
      scheduled: false,
      visitDate: null,
      committee: [],
      reportUploaded: false,
      outcome: null
    }
  },
  {
    id: 'APP-2026-NRO-8821',
    instituteId: '1-992384110',
    instituteName: 'Quantum Institute of Technology & Advanced Studies',
    region: 'NRO',
    state: 'Uttar Pradesh',
    city: 'Noida',
    type: 'Setting up New Technical Institution',
    route: 'SCRUTINY_EVC',
    currentStage: 'Preliminary Scrutiny',
    stageIndex: 1,
    appliedDate: '2026-10-18',
    currentStageDate: '2026-10-18',
    daysInCurrentStage: 5,
    slaDays: 7,
    assignedOfficer: 'Shri Manoj Agnihotri (NRO Kanpur)',
    status: 'In Progress',
    escalationLevel: 0,
    deficiencies: [],
    evcDetails: { required: true, scheduled: false }
  },
  {
    id: 'APP-2026-SRO-5542',
    instituteId: '1-338291040',
    instituteName: 'Tamil Nadu College of Engineering & Autonomous Research',
    region: 'SRO',
    state: 'Tamil Nadu',
    city: 'Coimbatore',
    type: 'Extension of Approval (EoA) Standard',
    route: 'ONLY_SCRUTINY',
    currentStage: 'Preliminary Scrutiny',
    stageIndex: 1,
    appliedDate: '2026-10-10',
    currentStageDate: '2026-10-16',
    daysInCurrentStage: 7,
    slaDays: 7,
    assignedOfficer: 'Dr. S. Sundararajan (SRO Chennai)',
    status: 'Deficiency Issued',
    escalationLevel: 0,
    deficiencies: [
      {
        id: 'DEF-SRO-01',
        clause: 'APH Clause 6.4 (Library Resources)',
        description: 'Shortfall of 380 International e-Journals for PG Courses.',
        rectificationDeadline: '2026-10-28',
        resolved: false
      }
    ]
  },
  {
    id: 'APP-2026-CRO-9102',
    instituteId: '1-840294119',
    instituteName: 'Central India Institute of Pharmacy & Bio-Tech',
    region: 'CRO',
    state: 'Madhya Pradesh',
    city: 'Bhopal',
    type: 'New Technical Institution Setup',
    route: 'SCRUTINY_EVC',
    currentStage: 'EVC Inspection',
    stageIndex: 3,
    appliedDate: '2026-09-25',
    currentStageDate: '2026-10-21',
    daysInCurrentStage: 2,
    slaDays: 2,
    assignedOfficer: 'Er. Sandeep Verma (CRO Bhopal)',
    status: 'In Progress',
    escalationLevel: 0,
    evcDetails: { required: true, scheduled: true, visitDate: '2026-10-22' }
  },
  {
    id: 'APP-2026-ERO-7834',
    instituteId: '1-120938445',
    instituteName: 'Bengal Heritage College of Engineering & Tech',
    region: 'ERO',
    state: 'West Bengal',
    city: 'Howrah',
    type: 'Extension of Approval (EoA)',
    route: 'ONLY_SCRUTINY',
    currentStage: 'Preliminary Scrutiny',
    stageIndex: 1,
    appliedDate: '2026-10-12',
    currentStageDate: '2026-10-14',
    daysInCurrentStage: 9,
    slaDays: 7,
    assignedOfficer: 'Dr. Debabrata Roy (ERO Kolkata)',
    status: 'Critical Alert',
    escalationLevel: 2,
    deficiencies: []
  },
  {
    id: 'APP-2026-SCRO-4421',
    instituteId: '1-667281903',
    instituteName: 'Telangana Institute of Applied Sciences & Management',
    region: 'SCRO',
    state: 'Telangana',
    city: 'Hyderabad',
    type: 'Increase in Intake & Division Expansion',
    route: 'SCRUTINY_EVC',
    currentStage: 'EVC Inspection',
    stageIndex: 3,
    appliedDate: '2026-09-18',
    currentStageDate: '2026-10-10',
    daysInCurrentStage: 13,
    slaDays: 2,
    assignedOfficer: 'Dr. G.V. Reddy (SCRO Hyderabad)',
    status: 'Critical Alert',
    escalationLevel: 3,
    deficiencies: []
  },
  {
    id: 'APP-2026-NWRO-3319',
    instituteId: '1-558291024',
    instituteName: 'Punjab Global School of Business & Analytics',
    region: 'NWRO',
    state: 'Punjab',
    city: 'Ludhiana',
    type: 'Change of Site / Location',
    route: 'SCRUTINY_EVC_SAC',
    currentStage: 'SAC / SHC Hearing',
    stageIndex: 3,
    appliedDate: '2026-09-10',
    currentStageDate: '2026-10-15',
    daysInCurrentStage: 8,
    slaDays: 14,
    assignedOfficer: 'Shri Harpreet Singh (NWRO Chandigarh)',
    status: 'In Progress',
    escalationLevel: 0
  },
  {
    id: 'APP-2026-SWRO-2194',
    instituteId: '1-449102931',
    instituteName: 'Bangalore Tech & Autonomous Research Academy',
    region: 'SWRO',
    state: 'Karnataka',
    city: 'Bengaluru',
    type: 'Extension of Approval (EoA) + New Specializations',
    route: 'ONLY_SCRUTINY',
    currentStage: 'Council Approval',
    stageIndex: 2,
    appliedDate: '2026-10-01',
    currentStageDate: '2026-10-20',
    daysInCurrentStage: 3,
    slaDays: 7,
    assignedOfficer: 'Dr. Ramesh Babu (SWRO Bengaluru)',
    status: 'Approved with Undertaking',
    escalationLevel: 0
  }
];

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    platform: 'AICTE PRAGATI-NAV Backend API',
    version: '2.4-SIH',
    timestamp: new Date().toISOString()
  });
});

// Applications API
app.get('/api/applications', (req, res) => {
  res.json({ success: true, count: applications.length, data: applications });
});

// ==========================================
// CPU SCHEDULING ALGORITHM DISPATCHER API
// ==========================================
app.post('/api/cpu-schedule', (req, res) => {
  const { algorithm = 'PRIORITY', quantum = 2 } = req.body;
  const processes = transformAppsToProcesses(applications);

  let result;
  switch (algorithm.toUpperCase()) {
    case 'FCFS':
      result = scheduleFCFS(processes);
      break;
    case 'SJF':
      result = scheduleSJF(processes);
      break;
    case 'ROUND_ROBIN':
    case 'RR':
      result = scheduleRoundRobin(processes, parseInt(quantum, 10) || 2);
      break;
    case 'PRIORITY':
    case 'PREEMPTIVE':
    default:
      result = schedulePriority(processes);
      break;
  }

  // Also calculate comparison matrix across all 4 algorithms
  const comparativeMetrics = {
    fcfs: {
      name: 'FCFS',
      avgWT: scheduleFCFS(processes).avgWaitingTime,
      avgTAT: scheduleFCFS(processes).avgTurnaroundTime
    },
    sjf: {
      name: 'SJF (Shortest Job)',
      avgWT: scheduleSJF(processes).avgWaitingTime,
      avgTAT: scheduleSJF(processes).avgTurnaroundTime
    },
    priority: {
      name: 'Preemptive SLA Priority',
      avgWT: schedulePriority(processes).avgWaitingTime,
      avgTAT: schedulePriority(processes).avgTurnaroundTime
    },
    roundRobin: {
      name: 'Round Robin (Q=2)',
      avgWT: scheduleRoundRobin(processes, 2).avgWaitingTime,
      avgTAT: scheduleRoundRobin(processes, 2).avgTurnaroundTime
    }
  };

  res.json({
    success: true,
    appliedAlgorithm: result.algorithm,
    metrics: {
      makespan: result.makespan,
      avgWaitingTime: result.avgWaitingTime,
      avgTurnaroundTime: result.avgTurnaroundTime,
      cpuUtilization: result.cpuUtilization
    },
    comparativeMetrics,
    timeline: result.timeline,
    processes: result.processes
  });
});

app.listen(PORT, () => {
  console.log(`[AICTE PRAGATI-NAV] Backend API Server listening on port ${PORT}`);
});
