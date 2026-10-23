// Initial Seed Data for AICTE PRAGATI-NAV Backend Store

export const initialExperts = [
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

export const initialApplications = [
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
      }
    ],
    auditTrail: [
      { date: '2026-10-18 11:20', actor: 'Applicant Institution', action: 'Application Lodged with Security Deposit', hash: 'sha256-10a99c' },
      { date: '2026-10-19 10:00', actor: 'NRO Scrutiny Cell', action: 'Assigned Scrutiny Officer Shri Manoj Agnihotri', hash: 'sha256-55d8b2' }
    ]
  },
  {
    id: 'APP-2026-CRO-3310',
    instituteId: '1-338291044',
    instituteName: 'Bhopal Institute of Pharmaceutical Sciences',
    region: 'CRO',
    state: 'Madhya Pradesh',
    city: 'Bhopal',
    type: 'Introduction of New Course (M.Pharm Pharmacology)',
    route: 'SCRUTINY_EVC',
    currentStage: 'EVC Inspection',
    stageIndex: 3,
    appliedDate: '2026-09-25',
    currentStageDate: '2026-10-22',
    daysInCurrentStage: 1,
    slaDays: 2,
    assignedOfficer: 'Dr. Alok Verma (CRO Bhopal)',
    status: 'In Progress',
    escalationLevel: 0,
    deficiencies: [],
    evcDetails: {
      required: true,
      scheduled: true,
      visitDate: '2026-10-22',
      committee: ['EXP-101', 'EXP-102', 'EXP-106'],
      reportUploaded: false,
      reportDueHours: 26,
      outcome: null
    },
    undertakings: [
      {
        id: 'UND-CRO-03',
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
    daysInCurrentStage: 9,
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
        daysToExpiry: 42
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
    daysInCurrentStage: 13,
    slaDays: 2,
    assignedOfficer: 'Dr. G.V. Reddy (SCRO Hyderabad)',
    status: 'Critical Alert',
    escalationLevel: 3,
    deficiencies: [],
    evcDetails: {
      required: true,
      scheduled: true,
      visitDate: '2026-10-11',
      committee: ['EXP-103', 'EXP-105', 'EXP-106'],
      reportUploaded: false,
      reportDueHours: -264,
      outcome: null
    },
    undertakings: [
      {
        id: 'UND-SCRO-01',
        condition: 'Deposit of Rs. 50 Lakhs in Joint AICTE Endowment Fund',
        prescribedClause: 'APH 2024-27 Clause 1.8',
        dueDate: '2026-10-15',
        status: 'Overdue',
        evidenceSubmitted: null,
        verifiedBy: null
      }
    ],
    documents: [
      {
        type: '30-Year Registered Lease',
        documentNo: 'TG-HYD-LSE-332',
        issuedDate: '2008-05-20',
        expiryDate: '2038-05-19',
        status: 'Valid',
        daysToExpiry: 4225
      }
    ],
    auditTrail: [
      { date: '2026-09-18 12:00', actor: 'Applicant', action: 'Applied', hash: 'sha256-54a88f' },
      { date: '2026-10-01 15:30', actor: 'SCRO Scrutiny', action: 'Passed Scrutiny', hash: 'sha256-cc1123' },
      { date: '2026-10-06 10:00', actor: 'SCRO RO', action: 'EVC Scheduled for 2026-10-11', hash: 'sha256-88ab12' },
      { date: '2026-10-14 00:01', actor: 'System Watchdog', action: 'Level 1 Escalation: 48h EVC Report Deadline Expired', hash: 'sha256-65de12' },
      { date: '2026-10-17 00:01', actor: 'System Watchdog', action: 'Level 2 Escalation: EVC Report Overdue by 5 days -> Notice to Committee', hash: 'sha256-43ad09' },
      { date: '2026-10-20 00:01', actor: 'System Watchdog', action: 'Level 3 Escalation: EVC Report Overdue by 8+ days -> Docket to Member Secretary', hash: 'sha256-99fe33' }
    ]
  }
];

export const initialIntegrations = [
  {
    id: 'DIGILOCKER',
    name: 'DigiLocker National Depository Bridge',
    category: 'Document Verification',
    endpoint: 'https://api.digitallocker.gov.in/v2/verify',
    status: 'Connected',
    uptime: '99.98%',
    lastSync: '2 mins ago',
    latencyMs: 142,
    verifiedCount: '18,492',
    description: 'Instant cryptographically verified retrieval of Land Lease deeds, Fire NOCs, and Municipal Building Approvals directly from state issuers.'
  },
  {
    id: 'LAND_REGISTRY',
    name: 'State Land Records & Revenue Portal (Bhoomi / MahaBhulekh)',
    category: 'Land & Lease Records',
    endpoint: 'https://landrecords.gov.in/api/v1/lease-ledger',
    status: 'Connected',
    uptime: '99.85%',
    lastSync: '12 mins ago',
    latencyMs: 280,
    verifiedCount: '4,108',
    description: 'Real-time 30-year lease deed validation, encumbrance certificate lookup, and title mutation tracking directly against Sub-Registrar databases.'
  },
  {
    id: 'ESIGN_GATEWAY',
    name: 'e-Sign & Aadhaar OTP Authentication Bridge',
    category: 'Legal Affidavits',
    endpoint: 'https://esign.gov.in/v3/auth-service',
    status: 'Connected',
    uptime: '99.94%',
    lastSync: 'Just now',
    latencyMs: 95,
    verifiedCount: '62,810',
    description: 'Legally binding Aadhaar-based e-Sign verification for Institutional Undertakings, Committee Declarations, and Scrutiny Summary signing under IT Act Section 3A.'
  },
  {
    id: 'SMS_GATEWAY',
    name: 'National SMS & Email Gateway (C-DAC / NIC)',
    category: 'Escalation Notifications',
    endpoint: 'https://mgov.gov.in/api/sms/v2/dispatch',
    status: 'Connected',
    uptime: '99.99%',
    lastSync: 'Just now',
    latencyMs: 45,
    verifiedCount: '142,500',
    description: 'Autonomous dispatch of critical statutory countdown SMS alerts and email escalation memos to Principals, Regional Officers, and Bureau Heads.'
  }
];
