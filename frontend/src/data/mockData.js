// AICTE Approval Process Handbook (APH) - Master Data & State Model

export const AICTE_REGIONS = [
  { code: 'NRO', name: 'Northern Regional Office', hq: 'Kanpur', states: ['Uttar Pradesh', 'Uttarakhand'], icon: 'Compass' },
  { code: 'NWRO', name: 'North-Western Regional Office', hq: 'Chandigarh', states: ['Punjab', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Delhi'], icon: 'Compass' },
  { code: 'WRO', name: 'Western Regional Office', hq: 'Mumbai', states: ['Maharashtra', 'Goa'], icon: 'Compass' },
  { code: 'SRO', name: 'Southern Regional Office', hq: 'Chennai', states: ['Tamil Nadu', 'Puducherry'], icon: 'Compass' },
  { code: 'SWRO', name: 'South-Western Regional Office', hq: 'Bengaluru', states: ['Karnataka', 'Kerala', 'Lakshadweep'], icon: 'Compass' },
  { code: 'CRO', name: 'Central Regional Office', hq: 'Bhopal', states: ['Madhya Pradesh', 'Chhattisgarh', 'Gujarat'], icon: 'Compass' },
  { code: 'ERO', name: 'Eastern Regional Office', hq: 'Kolkata', states: ['West Bengal', 'Bihar', 'Jharkhand', 'Odisha', 'North Eastern States'], icon: 'Compass' },
  { code: 'SCRO', name: 'South-Central Regional Office', hq: 'Hyderabad', states: ['Telangana', 'Andhra Pradesh'], icon: 'Compass' },
];

export const WORKFLOW_ROUTES = {
  ONLY_SCRUTINY: {
    id: 'ONLY_SCRUTINY',
    title: 'Only Scrutiny',
    description: 'Applicable for standard Extension of Approval (EoA) without changes in intake or land/building.',
    stages: ['Applied', 'Preliminary Scrutiny', 'Council Approval'],
    color: '#0284c7'
  },
  SCRUTINY_EVC: {
    id: 'SCRUTINY_EVC',
    title: 'Scrutiny + EVC',
    description: 'Mandatory for Increase in Intake, Introduction of New Courses, and New Technical Institutions.',
    stages: ['Applied', 'Preliminary Scrutiny', 'EVC Scheduling', 'EVC Inspection', 'Council Approval'],
    color: '#7c3aed'
  },
  SCRUTINY_EVC_SAC: {
    id: 'SCRUTINY_EVC_SAC',
    title: 'Scrutiny + EVC + SAC/SHC',
    description: 'Mandatory for Change of Site, Closure of Courses, or disputed/deficiency review appeals.',
    stages: ['Applied', 'Preliminary Scrutiny', 'EVC Inspection', 'SAC / SHC Hearing', 'Council Approval'],
    color: '#ea580c'
  },
  ONLY_EVC: {
    id: 'ONLY_EVC',
    title: 'Only EVC (Surprise/Compliance)',
    description: 'Unannounced compliance verification, complaint-based inspection or infrastructure re-check.',
    stages: ['Initiated', 'EVC Scheduling', 'EVC Inspection', 'Council Review'],
    color: '#0d9488'
  },
  EVC_SAC: {
    id: 'EVC_SAC',
    title: 'EVC + SAC/SHC',
    description: 'Follow-up for punitive actions, post-rejection appeals, and non-compliance hearings.',
    stages: ['Appeal Filed', 'EVC Re-Inspection', 'SAC / SHC Hearing', 'Final Appellate Order'],
    color: '#dc2626'
  }
};

export const INITIAL_APH_RULES = {
  scrutinySlaDays: 7,
  reScrutinySlaDays: 5,
  evcSchedulingSlaDays: 5,
  evcReportUploadHours: 48,
  sacHearingSlaDays: 14,
  councilApprovalSlaDays: 7,
  leaseAdvanceWarningDays: 180,
  leaseCriticalWarningDays: 90,
  undertakingWarningDays: 30,
  escalationLevel1Days: 2, // 2 days past SLA -> Regional Officer alert
  escalationLevel2Days: 5, // 5 days past SLA -> Bureau Head alert
  escalationLevel3Days: 8, // 8 days past SLA -> Member Secretary alert
};

export const INITIAL_EXPERTS_POOL = [
  {
    id: 'EXP-101',
    name: 'Prof. V. Ramanathan',
    affiliation: 'IIT Bombay (Dept. of Mechanical Engg)',
    designation: 'Senior Professor & Former Dean',
    specialization: 'Engineering & Technology Infrastructure',
    city: 'Mumbai',
    contact: '+91 98201-44120',
    email: 'v.ramanathan@iitb.ac.in',
    status: 'Available',
    assignedCount: 2
  },
  {
    id: 'EXP-102',
    name: 'Ar. Sunita Deshmukh',
    affiliation: 'Council of Architecture / Sir J.J. College',
    designation: 'Registered Senior Architect',
    specialization: 'Institutional Built-Up Area & Structural Safety',
    city: 'Pune',
    contact: '+91 94223-77890',
    email: 'ar.sunita@deshmukh-architects.in',
    status: 'Available',
    assignedCount: 1
  },
  {
    id: 'EXP-103',
    name: 'Dr. Anandvardhan Rao',
    affiliation: 'NIT Warangal (Computer Science)',
    designation: 'Professor & Head',
    specialization: 'Computing Facilities & Digital Infrastructure',
    city: 'Warangal',
    contact: '+91 97011-33215',
    email: 'arao@nitw.ac.in',
    status: 'Available',
    assignedCount: 3
  },
  {
    id: 'EXP-104',
    name: 'Prof. Nirmala Sen',
    affiliation: 'Jadavpur University (Electrical Engg)',
    designation: 'Professor of Eminence',
    specialization: 'High Voltage Labs & Faculty Qualifications',
    city: 'Kolkata',
    contact: '+91 98310-99231',
    email: 'nsen@jadavpur.edu',
    status: 'Available',
    assignedCount: 1
  },
  {
    id: 'EXP-105',
    name: 'Dr. K. S. Balasubramanian',
    affiliation: 'Anna University (Management Studies)',
    designation: 'Director, Academic Courses',
    specialization: 'MBA/MCA Infrastructure & Faculty Ratio',
    city: 'Chennai',
    contact: '+91 94440-12876',
    email: 'ksbala@annauniv.edu',
    status: 'Available',
    assignedCount: 2
  },
  {
    id: 'EXP-106',
    name: 'Er. Rajeshwar Tyagi',
    affiliation: 'Ex-Chief Engineer, CPWD',
    designation: 'AICTE Nominated Technical Evaluator',
    specialization: 'Barrier-free Access, Fire Safety & Civil Norms',
    city: 'New Delhi',
    contact: '+91 98112-66543',
    email: 'rtyagi.eval@aicte-india.org',
    status: 'Available',
    assignedCount: 4
  }
];

export const INITIAL_APPLICATIONS = [
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
    daysInCurrentStage: 9, // Breached 5-day SLA
    slaDays: 5,
    assignedOfficer: 'Dr. R.K. Patil (RO Mumbai)',
    status: 'Overdue',
    escalationLevel: 2, // Escalated to Bureau Head
    deficiencies: [],
    evcDetails: {
      required: true,
      scheduled: false,
      visitDate: null,
      committee: [],
      reportUploaded: false,
      outcome: null
    },
    undertakings: [
      {
        id: 'UND-WRO-01',
        condition: 'Appointment of 2 Professors in AI & Data Science cadre as per AICTE 7th CPC norms',
        prescribedClause: 'APH 2024-27 Clause 7.12',
        dueDate: '2026-12-15',
        status: 'Pending',
        evidenceSubmitted: null,
        verifiedBy: null
      }
    ],
    documents: [
      {
        type: 'Land Lease Deed (30-Year)',
        documentNo: 'MH-PUN-REG-44910',
        issuedDate: '2001-04-10',
        expiryDate: '2031-04-09',
        status: 'Valid',
        daysToExpiry: 1629
      },
      {
        type: 'Fire Safety Certificate',
        documentNo: 'PMC-FIRE-2025-881',
        issuedDate: '2025-11-01',
        expiryDate: '2026-10-31',
        status: 'Critical',
        daysToExpiry: 8
      }
    ],
    auditTrail: [
      { date: '2026-10-05 10:15', actor: 'Applicant Institution', action: 'Application Submitted Online', hash: 'sha256-4b91f0' },
      { date: '2026-10-08 14:30', actor: 'Scrutiny Committee (WRO)', action: 'Preliminary Scrutiny Passed - Recommended for EVC', hash: 'sha256-8a12e3' },
      { date: '2026-10-14 09:00', actor: 'System Routing Engine', action: 'Queued for EVC Scheduling - SLA Clock Started', hash: 'sha256-7c33d1' },
      { date: '2026-10-20 00:01', actor: 'System Watchdog', action: 'Level 1 Escalation: EVC Scheduling SLA breached by 2 days -> Alert to RO', hash: 'sha256-11f8e9' },
      { date: '2026-10-23 00:01', actor: 'System Watchdog', action: 'Level 2 Escalation: EVC Scheduling SLA breached by 5 days -> Alert to Bureau Head', hash: 'sha256-99c01a' }
    ]
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
    evcDetails: {
      required: true,
      scheduled: false,
      visitDate: null,
      committee: [],
      reportUploaded: false,
      outcome: null
    },
    undertakings: [
      {
        id: 'UND-NRO-02',
        condition: 'Submission of Occupancy Certificate from Greater Noida Industrial Development Authority (GNIDA)',
        prescribedClause: 'APH 2024-27 Clause 2.4.1',
        dueDate: '2026-11-20',
        status: 'Submitted',
        evidenceSubmitted: 'GNIDA_Occupancy_Cert_Ref_9901.pdf',
        verifiedBy: null
      }
    ],
    documents: [
      {
        type: 'Land Lease Deed (99-Year)',
        documentNo: 'UP-GBN-LEAS-892',
        issuedDate: '2023-01-15',
        expiryDate: '2122-01-14',
        status: 'Valid',
        daysToExpiry: 34780
      },
      {
        type: 'Building Structural Safety NOC',
        documentNo: 'PWD-STR-2024-411',
        issuedDate: '2024-06-10',
        expiryDate: '2029-06-09',
        status: 'Valid',
        daysToExpiry: 960
      }
    ],
    auditTrail: [
      { date: '2026-10-18 11:20', actor: 'Applicant Institution', action: 'New Institution Application Submitted', hash: 'sha256-00e12b' },
      { date: '2026-10-19 10:00', actor: 'System Routing Engine', action: 'Automated Routing to NRO Scrutiny Committee Panel 3', hash: 'sha256-34a81f' }
    ]
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
        description: 'Shortfall of 380 International e-Journals for PG Courses as per IEEE/ASME package subscription norms.',
        rectificationDeadline: '2026-10-28',
        resolved: false,
        instituteResponse: null
      }
    ],
    evcDetails: {
      required: false,
      scheduled: false,
      visitDate: null,
      committee: [],
      reportUploaded: false,
      outcome: null
    },
    undertakings: [],
    documents: [
      {
        type: 'Registered Land Deed',
        documentNo: 'TN-CBE-DEED-1092',
        issuedDate: '1998-05-20',
        expiryDate: '2048-05-19',
        status: 'Valid',
        daysToExpiry: 7878
      }
    ],
    auditTrail: [
      { date: '2026-10-10 16:45', actor: 'Applicant Institution', action: 'EoA Application Lodged', hash: 'sha256-55d812' },
      { date: '2026-10-16 12:30', actor: 'Scrutiny Officer SRO', action: 'Deficiency Memo Issued (Library Resources) - 7 Days Response Clock Active', hash: 'sha256-6a99cd' }
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
    slaDays: 2, // 48 hours for report
    assignedOfficer: 'Er. Sandeep Verma (CRO Bhopal)',
    status: 'In Progress',
    escalationLevel: 0,
    deficiencies: [],
    evcDetails: {
      required: true,
      scheduled: true,
      visitDate: '2026-10-22',
      committee: ['EXP-101', 'EXP-102', 'EXP-106'],
      reportUploaded: false,
      outcome: 'Awaiting Report Upload'
    },
    undertakings: [
      {
        id: 'UND-CRO-01',
        condition: 'Installation of Automated Liquid Chromatography Mass Spectrometer (LC-MS) in Central Analytical Lab',
        prescribedClause: 'APH 2024-27 Appendix 4 Norms',
        dueDate: '2027-01-30',
        status: 'Pending',
        evidenceSubmitted: null,
        verifiedBy: null
      }
    ],
    documents: [
      {
        type: '30-Year Registered Lease',
        documentNo: 'MP-BHO-LSE-771',
        issuedDate: '2015-08-12',
        expiryDate: '2045-08-11',
        status: 'Valid',
        daysToExpiry: 6866
      }
    ],
    auditTrail: [
      { date: '2026-09-25 09:30', actor: 'Applicant', action: 'Applied', hash: 'sha256-b01c3d' },
      { date: '2026-10-05 14:00', actor: 'CRO Scrutiny', action: 'Scrutiny Recommended for EVC', hash: 'sha256-d44a21' },
      { date: '2026-10-18 11:15', actor: 'RO Bhopal', action: 'EVC Team Scheduled for 2026-10-22', hash: 'sha256-ff8801' },
      { date: '2026-10-22 17:00', actor: 'EVC Committee Panel', action: 'Physical On-Site Verification Completed', hash: 'sha256-9a22cc' }
    ]
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
    daysInCurrentStage: 9, // Breached
    slaDays: 7,
    assignedOfficer: 'Dr. Debabrata Roy (ERO Kolkata)',
    status: 'Critical Alert',
    escalationLevel: 2,
    deficiencies: [],
    evcDetails: {
      required: false,
      scheduled: false,
      visitDate: null,
      committee: [],
      reportUploaded: false,
      outcome: null
    },
    undertakings: [],
    documents: [
      {
        type: 'Land Lease Deed (30-Year)',
        documentNo: 'WB-HOW-REG-1092',
        issuedDate: '1996-12-05',
        expiryDate: '2026-12-04',
        status: 'Expiring Soon',
        daysToExpiry: 42 // Less than 90 days!
      },
      {
        type: 'WB Fire & Emergency Services NOC',
        documentNo: 'WB-FIRE-99124',
        issuedDate: '2024-03-01',
        expiryDate: '2027-02-28',
        status: 'Valid',
        daysToExpiry: 493
      }
    ],
    auditTrail: [
      { date: '2026-10-12 10:00', actor: 'Applicant Institution', action: 'EoA Application Lodged', hash: 'sha256-aa9081' },
      { date: '2026-10-14 11:00', actor: 'ERO Scrutiny', action: 'Scrutiny Commenced', hash: 'sha256-77e810' },
      { date: '2026-10-21 00:01', actor: 'System Watchdog', action: 'Level 1 Escalation: Scrutiny Overdue by 2 days', hash: 'sha256-32d881' }
    ]
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
    daysInCurrentStage: 13, // Overdue by 11 days (SLA 2 days)
    slaDays: 2,
    assignedOfficer: 'Dr. G.V. Reddy (SCRO Hyderabad)',
    status: 'Critical Alert',
    escalationLevel: 3, // Escalated to Member Secretary
    deficiencies: [],
    evcDetails: {
      required: true,
      scheduled: true,
      visitDate: '2026-10-11',
      committee: ['EXP-103', 'EXP-105', 'EXP-106'],
      reportUploaded: false,
      outcome: 'Report Pending from Lead Expert'
    },
    undertakings: [
      {
        id: 'UND-SCRO-01',
        condition: 'Deposit of ₹50 Lakhs in Joint Endowment Fund with AICTE',
        prescribedClause: 'APH 2024-27 Clause 4.8.2',
        dueDate: '2026-10-15',
        status: 'Overdue Breach',
        evidenceSubmitted: null,
        verifiedBy: null
      }
    ],
    documents: [
      {
        type: '30-Year Land Registered Lease',
        documentNo: 'TG-HYD-LSE-0091',
        issuedDate: '2010-09-01',
        expiryDate: '2040-08-31',
        status: 'Valid',
        daysToExpiry: 5060
      }
    ],
    auditTrail: [
      { date: '2026-09-18 10:20', actor: 'Applicant', action: 'Application Lodged', hash: 'sha256-ee0011' },
      { date: '2026-09-28 15:30', actor: 'SCRO Scrutiny', action: 'Scrutiny Recommended for EVC', hash: 'sha256-dd2211' },
      { date: '2026-10-05 12:00', actor: 'RO Hyderabad', action: 'EVC Panel Scheduled for Oct 11', hash: 'sha256-cc3322' },
      { date: '2026-10-11 18:00', actor: 'EVC Panel', action: 'Physical Visit Finished - Report Due in 48h', hash: 'sha256-bb4433' },
      { date: '2026-10-14 00:01', actor: 'System Watchdog', action: 'Level 1 Escalation: EVC Report 24h past deadline', hash: 'sha256-aa5544' },
      { date: '2026-10-17 00:01', actor: 'System Watchdog', action: 'Level 2 Escalation: EVC Report delayed by 5 days -> RO Alert', hash: 'sha256-996655' },
      { date: '2026-10-21 00:01', actor: 'System Watchdog', action: 'Level 3 Escalation: EVC Report delayed by 8 days -> Member Secretary Apex Alert', hash: 'sha256-887766' }
    ]
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
    escalationLevel: 0,
    deficiencies: [
      {
        id: 'DEF-NWRO-01',
        clause: 'APH Clause 3.2.1 (Land Title & Non-Encumbrance)',
        description: 'Revenue record mutation copy not signed by Competent Revenue Authority (SDM/Tehsildar).',
        rectificationDeadline: '2026-10-26',
        resolved: true,
        instituteResponse: 'Uploaded SDM verified Patwari mutation cert ref SDM/LDH/2026/8991.'
      }
    ],
    evcDetails: {
      required: true,
      scheduled: true,
      visitDate: '2026-10-02',
      committee: ['EXP-101', 'EXP-103', 'EXP-106'],
      reportUploaded: true,
      outcome: 'Disputed Land Access Road -> Referred to SAC'
    },
    undertakings: [
      {
        id: 'UND-NWRO-01',
        condition: 'Demarcation and asphalt carpeting of 12-meter contiguous access road to campus gate',
        prescribedClause: 'APH Clause 3.4 Norms',
        dueDate: '2026-12-30',
        status: 'Pending',
        evidenceSubmitted: null,
        verifiedBy: null
      }
    ],
    documents: [
      {
        type: 'Registered Sale Deed (Freehold Land)',
        documentNo: 'PB-LDH-DEED-3301',
        issuedDate: '2022-01-10',
        expiryDate: '2099-12-31',
        status: 'Valid',
        daysToExpiry: 26732
      }
    ],
    auditTrail: [
      { date: '2026-09-10 14:00', actor: 'Applicant', action: 'Change of Site Applied', hash: 'sha256-123456' },
      { date: '2026-10-02 16:30', actor: 'EVC Committee', action: 'EVC Conducted - Road width discrepancy noted', hash: 'sha256-234567' },
      { date: '2026-10-15 11:00', actor: 'RO Chandigarh', action: 'Referred to Standing Appellate Committee (SAC)', hash: 'sha256-345678' }
    ]
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
    escalationLevel: 0,
    deficiencies: [],
    evcDetails: {
      required: false,
      scheduled: false,
      visitDate: null,
      committee: [],
      reportUploaded: false,
      outcome: null
    },
    undertakings: [
      {
        id: 'UND-SWRO-01',
        condition: 'Installation of Solar Rooftop Photovoltaic Plant (100 kVA) as Green Campus mandate',
        prescribedClause: 'APH 2024-27 Clause 7.18',
        dueDate: '2026-11-30',
        status: 'Submitted',
        evidenceSubmitted: 'Bescom_Solar_Net_Metering_Agreement.pdf',
        verifiedBy: 'Dr. Ramesh Babu'
      }
    ],
    documents: [
      {
        type: '30-Year Registered Lease',
        documentNo: 'KA-BLR-REG-99120',
        issuedDate: '2012-03-15',
        expiryDate: '2042-03-14',
        status: 'Valid',
        daysToExpiry: 5621
      }
    ],
    auditTrail: [
      { date: '2026-10-01 10:00', actor: 'Applicant', action: 'Application Submitted', hash: 'sha256-aaa111' },
      { date: '2026-10-12 15:00', actor: 'SWRO Scrutiny', action: 'Scrutiny Completed & Cleared', hash: 'sha256-bbb222' },
      { date: '2026-10-20 16:00', actor: 'AICTE Council Bureau', action: 'Conditional Approval Order Drafted', hash: 'sha256-ccc333' }
    ]
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-01',
    timestamp: '2026-10-23 10:15',
    title: 'Level 3 Escalation: Immediate Attention Required',
    message: 'Application APP-2026-SCRO-4421 (Telangana Inst.) has breached EVC Report Submission SLA by 11 days. Escalated to Member Secretary.',
    severity: 'critical',
    region: 'SCRO',
    applicationId: 'APP-2026-SCRO-4421',
    read: false
  },
  {
    id: 'NOTIF-02',
    timestamp: '2026-10-23 09:30',
    title: 'Land Lease Expiry Alert (42 Days Remaining)',
    message: 'Bengal Heritage College (APP-2026-ERO-7834) registered lease is expiring on 2026-12-04. Mandatory renewal upload deadline approaching.',
    severity: 'warning',
    region: 'ERO',
    applicationId: 'APP-2026-ERO-7834',
    read: false
  },
  {
    id: 'NOTIF-03',
    timestamp: '2026-10-23 08:45',
    title: 'Level 2 Escalation: EVC Scheduling Delayed',
    message: 'Application APP-2026-WRO-1049 (MIT & Research Pune) has been pending EVC Scheduling for 9 days (SLA: 5 days). Alert dispatched to Bureau Head.',
    severity: 'critical',
    region: 'WRO',
    applicationId: 'APP-2026-WRO-1049',
    read: false
  },
  {
    id: 'NOTIF-04',
    timestamp: '2026-10-22 17:30',
    title: 'EVC Inspection Conducted - Report Due in 48 Hours',
    message: 'EVC Panel completed on-site visit for Central India Inst of Pharmacy (APP-2026-CRO-9102). Report upload countdown initiated.',
    severity: 'info',
    region: 'CRO',
    applicationId: 'APP-2026-CRO-9102',
    read: true
  },
  {
    id: 'NOTIF-05',
    timestamp: '2026-10-22 14:10',
    title: 'Time-Bound Undertaking Evidence Uploaded',
    message: 'Bangalore Tech Academy uploaded compliance documents for Solar PV installation (UND-SWRO-01). Ready for RO verification.',
    severity: 'info',
    region: 'SWRO',
    applicationId: 'APP-2026-SWRO-2194',
    read: true
  }
];

export const INITIAL_UNDERTAKINGS = [
  {
    id: 'UND-SCRO-01',
    appId: 'APP-2026-SCRO-4421',
    institute: 'Telangana Institute of Applied Sciences & Management',
    region: 'SCRO',
    condition: 'Deposit of ₹50 Lakhs in Joint Endowment Fund with AICTE',
    clause: 'APH Clause 4.8.2',
    dueDate: '2026-10-15',
    daysRemaining: -8,
    status: 'Overdue Breach',
    severity: 'critical',
    evidenceFile: null
  },
  {
    id: 'UND-WRO-01',
    appId: 'APP-2026-WRO-1049',
    institute: 'Maharashtra Institute of Technology & Research',
    region: 'WRO',
    condition: 'Appointment of 2 Professors in AI & Data Science cadre as per 7th CPC norms',
    clause: 'APH Clause 7.12',
    dueDate: '2026-12-15',
    daysRemaining: 53,
    status: 'Pending',
    severity: 'normal',
    evidenceFile: null
  },
  {
    id: 'UND-NRO-02',
    appId: 'APP-2026-NRO-8821',
    institute: 'Quantum Institute of Technology & Advanced Studies',
    region: 'NRO',
    condition: 'Submission of Occupancy Certificate from GNIDA Authority',
    clause: 'APH Clause 2.4.1',
    dueDate: '2026-11-20',
    daysRemaining: 28,
    status: 'Submitted',
    severity: 'warning',
    evidenceFile: 'GNIDA_Occupancy_Cert_Ref_9901.pdf'
  },
  {
    id: 'UND-SWRO-01',
    appId: 'APP-2026-SWRO-2194',
    institute: 'Bangalore Tech & Autonomous Research Academy',
    region: 'SWRO',
    condition: 'Installation of Solar Rooftop Photovoltaic Plant (100 kVA)',
    clause: 'APH Clause 7.18',
    dueDate: '2026-11-30',
    daysRemaining: 38,
    status: 'Submitted',
    severity: 'info',
    evidenceFile: 'Bescom_Solar_Net_Metering_Agreement.pdf'
  },
  {
    id: 'UND-CRO-01',
    appId: 'APP-2026-CRO-9102',
    institute: 'Central India Institute of Pharmacy & Bio-Tech',
    region: 'CRO',
    condition: 'Installation of LC-MS Instrument in Analytical Lab',
    clause: 'APH Appendix 4',
    dueDate: '2027-01-30',
    daysRemaining: 99,
    status: 'Pending',
    severity: 'normal',
    evidenceFile: null
  }
];

export const INITIAL_LEASE_DOCUMENTS = [
  {
    id: 'DOC-ERO-01',
    appId: 'APP-2026-ERO-7834',
    institute: 'Bengal Heritage College of Engineering & Tech',
    region: 'ERO',
    docType: '30-Year Registered Land Lease Deed',
    docNumber: 'WB-HOW-REG-1092',
    registeredDate: '1996-12-05',
    expiryDate: '2026-12-04',
    daysRemaining: 42,
    status: 'Critical Renewal Needed',
    actionRequired: 'Block EoA 2027 if lease extension deed not registered before Dec 04',
    severity: 'critical'
  },
  {
    id: 'DOC-WRO-02',
    appId: 'APP-2026-WRO-1049',
    institute: 'Maharashtra Institute of Technology & Research',
    region: 'WRO',
    docType: 'Fire Safety Certificate & NOC',
    docNumber: 'PMC-FIRE-2025-881',
    registeredDate: '2025-11-01',
    expiryDate: '2026-10-31',
    daysRemaining: 8,
    status: 'Expiring in 8 Days',
    actionRequired: 'Urgent renewal notice dispatched to Principal',
    severity: 'critical'
  },
  {
    id: 'DOC-WRO-01',
    appId: 'APP-2026-WRO-1049',
    institute: 'Maharashtra Institute of Technology & Research',
    region: 'WRO',
    docType: 'Land Lease Deed (30-Year)',
    docNumber: 'MH-PUN-REG-44910',
    registeredDate: '2001-04-10',
    expiryDate: '2031-04-09',
    daysRemaining: 1629,
    status: 'Valid',
    actionRequired: 'None - Active compliance',
    severity: 'normal'
  },
  {
    id: 'DOC-NRO-01',
    appId: 'APP-2026-NRO-8821',
    institute: 'Quantum Institute of Technology & Advanced Studies',
    region: 'NRO',
    docType: 'Building Structural Safety NOC',
    docNumber: 'PWD-STR-2024-411',
    registeredDate: '2024-06-10',
    expiryDate: '2029-06-09',
    daysRemaining: 960,
    status: 'Valid',
    actionRequired: 'None',
    severity: 'normal'
  },
  {
    id: 'DOC-SCRO-01',
    appId: 'APP-2026-SCRO-4421',
    institute: 'Telangana Institute of Applied Sciences & Management',
    region: 'SCRO',
    docType: 'Land Registered Lease Deed',
    docNumber: 'TG-HYD-LSE-0091',
    registeredDate: '2010-09-01',
    expiryDate: '2040-08-31',
    daysRemaining: 5060,
    status: 'Valid',
    actionRequired: 'None',
    severity: 'normal'
  }
];

export const USER_ROLES = [
  {
    id: 'APEX_BUREAU',
    name: 'AICTE Apex Bureau / Headquarters',
    officer: 'Shri A.K. Sharma',
    designation: 'Adviser (Approval Bureau), AICTE New Delhi',
    region: 'ALL (HQ)',
    badge: 'Apex Authority'
  },
  {
    id: 'REGIONAL_OFFICER',
    name: 'Regional Officer (RO - Western Region)',
    officer: 'Dr. R.K. Patil',
    designation: 'Regional Officer, AICTE WRO Mumbai',
    region: 'WRO',
    badge: 'Regional Officer'
  },
  {
    id: 'COMMITTEE_EXPERT',
    name: 'Scrutiny & EVC Committee Chairman',
    officer: 'Prof. V. Ramanathan',
    designation: 'Senior Professor, IIT Bombay & Lead Evaluator',
    region: 'WRO/CRO',
    badge: 'Expert Evaluator'
  },
  {
    id: 'INSTITUTE_APPLICANT',
    name: 'Institution Principal / Representative',
    officer: 'Dr. Meera Sen',
    designation: 'Principal, Maharashtra Inst. of Tech & Research',
    region: 'WRO',
    badge: 'Applicant Institute'
  }
];
