import express from 'express';
import {
  clearDemoSessionCookie,
  createDemoSession,
  getDemoSession,
  setDemoSessionCookie
} from '../middleware/demoSession.js';

const router = express.Router();

const ROLES_METADATA = [
  {
    role: 'INSTITUTION',
    title: 'Institution (Applicant)',
    persona: 'Synthetic Institution Coordinator',
    organization: 'Synthetic Western Technical Institute (demo scope)',
    region: 'WRO',
    description: 'Isolated portal: submit applications, upload compliance evidence, respond to deficiencies, monitor 30-year lease deeds.',
    sidebar: ['Dashboard', 'My Applications', 'My Undertakings', 'My Documents', 'Alerts']
  },
  {
    role: 'REGIONAL_OFFICER',
    title: 'Regional Officer (RO / Committee)',
    persona: 'Synthetic Regional Officer',
    organization: 'Synthetic WRO demo scope',
    region: 'WRO',
    description: 'Regional workflow portal: advance/revert stages, schedule 3-member EVC committee, verify undertakings, review lease renewals.',
    sidebar: ['Dashboard', 'Applications', 'EVC Scheduling', 'Undertakings', 'Lease Documents', 'Alerts', 'Regional Reports', 'Audit Trail']
  },
  {
    role: 'BUREAU_HEAD',
    title: 'Bureau Head / Apex Admin',
    persona: 'Synthetic Bureau Head',
    organization: 'Synthetic national bureau demo scope',
    region: 'ALL (National HQ)',
    description: 'Apex administrative console: pan-India 8-region bottleneck heatmap, Level-3 escalations, SLA rule configuration, e-Gov API bridges.',
    sidebar: ['National Dashboard', 'All Applications', 'Escalations', 'Regional Heatmap', 'Audit Trail', 'SLA Policies', 'Integrations']
  }
];

// This is an explicit synthetic demo session, not production authentication.
router.post('/demo-session', (req, res) => {
  const session = createDemoSession({ role: req.body?.role, region: req.body?.region });
  if (!session) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_DEMO_ROLE',
      message: 'Choose one of the supported synthetic demo personas.'
    });
  }

  setDemoSessionCookie(res, session.sessionId);
  return res.json({ success: true, demoMode: true, data: session.profile });
});

router.get('/demo-session', (req, res) => {
  const session = getDemoSession(req);
  if (!session) {
    return res.status(401).json({
      success: false,
      code: 'DEMO_SESSION_REQUIRED',
      message: 'No synthetic demo session is active.'
    });
  }
  return res.json({ success: true, demoMode: true, data: session });
});

router.delete('/demo-session', (req, res) => {
  clearDemoSessionCookie(res);
  return res.json({ success: true, demoMode: true });
});

// GET /api/auth/roles - Available administrative roles
router.get('/roles', (req, res) => {
  res.json({
    success: true,
    data: ROLES_METADATA
  });
});

export default router;
