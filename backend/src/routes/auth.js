import express from 'express';

const router = express.Router();

const ROLES_METADATA = [
  {
    role: 'INSTITUTION',
    title: 'Institution (Applicant)',
    persona: 'Dr. Meera Sen, Principal',
    organization: 'Maharashtra Institute of Technology & Research (ID: 1-748920141)',
    region: 'WRO',
    description: 'Isolated portal: submit applications, upload compliance evidence, respond to deficiencies, monitor 30-year lease deeds.',
    sidebar: ['Dashboard', 'My Applications', 'My Undertakings', 'My Documents', 'Alerts']
  },
  {
    role: 'REGIONAL_OFFICER',
    title: 'Regional Officer (RO / Committee)',
    persona: 'Dr. R.K. Patil, Regional Officer',
    organization: 'AICTE Western Regional Office (WRO Mumbai)',
    region: 'WRO',
    description: 'Regional workflow portal: advance/revert stages, schedule 3-member EVC committee, verify undertakings, review lease renewals.',
    sidebar: ['Dashboard', 'Applications', 'EVC Scheduling', 'Undertakings', 'Lease Documents', 'Alerts', 'Regional Reports', 'Audit Trail']
  },
  {
    role: 'BUREAU_HEAD',
    title: 'Bureau Head / Apex Admin',
    persona: 'Shri A.K. Sharma, Adviser & Bureau Head',
    organization: 'Approval Bureau, AICTE Headquarters, New Delhi',
    region: 'ALL (National HQ)',
    description: 'Apex administrative console: pan-India 8-region bottleneck heatmap, Level-3 escalations, SLA rule configuration, e-Gov API bridges.',
    sidebar: ['National Dashboard', 'All Applications', 'Escalations', 'Regional Heatmap', 'Audit Trail', 'SLA Policies', 'Integrations']
  }
];

// GET /api/auth/roles - Available administrative roles
router.get('/roles', (req, res) => {
  res.json({
    success: true,
    data: ROLES_METADATA
  });
});

export default router;
