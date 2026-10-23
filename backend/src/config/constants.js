// AICTE PRAGATI-NAV Backend Constants

export const PORT = process.env.PORT || 5000;

export const AICTE_REGIONS = [
  { code: 'NRO', name: 'Northern Regional Office', hq: 'Kanpur', states: ['Uttar Pradesh', 'Uttarakhand'], icon: 'Compass' },
  { code: 'NWRO', name: 'North-Western Regional Office', hq: 'Chandigarh', states: ['Punjab', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Delhi'], icon: 'Compass' },
  { code: 'WRO', name: 'Western Regional Office', hq: 'Mumbai', states: ['Maharashtra', 'Goa'], icon: 'Compass' },
  { code: 'SRO', name: 'Southern Regional Office', hq: 'Chennai', states: ['Tamil Nadu', 'Puducherry'], icon: 'Compass' },
  { code: 'SWRO', name: 'South-Western Regional Office', hq: 'Bengaluru', states: ['Karnataka', 'Kerala', 'Lakshadweep'], icon: 'Compass' },
  { code: 'CRO', name: 'Central Regional Office', hq: 'Bhopal', states: ['Madhya Pradesh', 'Chhattisgarh', 'Gujarat'], icon: 'Compass' },
  { code: 'ERO', name: 'Eastern Regional Office', hq: 'Kolkata', states: ['West Bengal', 'Bihar', 'Jharkhand', 'Odisha', 'North Eastern States'], icon: 'Compass' },
  { code: 'SCRO', name: 'South-Central Regional Office', hq: 'Hyderabad', states: ['Telangana', 'Andhra Pradesh'], icon: 'Compass' }
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

export const APH_SLA_RULES = {
  scrutinySlaDays: 7,
  reScrutinySlaDays: 5,
  evcSchedulingSlaDays: 5,
  evcReportUploadHours: 48,
  sacHearingSlaDays: 14,
  councilApprovalSlaDays: 7,
  leaseAdvanceWarningDays: 180,
  leaseCriticalWarningDays: 90,
  undertakingWarningDays: 30,
  escalationLevel1Days: 2, // 2 days past SLA -> RO alert
  escalationLevel2Days: 5, // 5 days past SLA -> Bureau Head alert
  escalationLevel3Days: 8  // 8 days past SLA -> Member Secretary alert
};
