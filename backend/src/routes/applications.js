import express from 'express';
import { db } from '../data/store.js';
import { requireDemoSession } from '../middleware/demoSession.js';

const router = express.Router();

// Read-only API-backed slice: scope comes from the synthetic demo session.
router.get('/', requireDemoSession, (req, res) => {
  const { status } = req.query;
  const applications = db.getApplicationsForSession(req.demoSession, { status });
  res.json({
    success: true,
    demoMode: true,
    count: applications.length,
    data: applications
  });
});

// GET /api/applications/:id - Fetch single application
router.get('/:id', requireDemoSession, (req, res) => {
  const app = db.getApplicationByIdForSession(req.params.id, req.demoSession);
  if (!app) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }
  res.json({ success: true, data: app });
});

// POST /api/applications/:id/advance - Advance to downstream stage
router.post('/:id/advance', (req, res) => {
  const { remarks, actor } = req.body;
  const updated = db.advanceApplicationStage(req.params.id, { remarks, actor });
  if (!updated) {
    return res.status(400).json({ success: false, message: 'Unable to advance stage. Application already at terminal stage or not found.' });
  }
  res.json({
    success: true,
    message: `Application advanced to "${updated.currentStage}"`,
    data: updated
  });
});

// POST /api/applications/:id/revert - Revert application with deficiency memo
router.post('/:id/revert', (req, res) => {
  const { clause, description, daysToCure, actor } = req.body;
  const result = db.revertApplicationDeficiency(req.params.id, { clause, description, daysToCure, actor });
  if (!result) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }
  res.json({
    success: true,
    message: 'Application reverted with deficiency memo. 7-day cure window clock initiated.',
    data: result.app,
    deficiency: result.deficiency
  });
});

// POST /api/applications/:id/deficiency/:defId/remedy - Submit remedy response
router.post('/:id/deficiency/:defId/remedy', (req, res) => {
  const { responseText, fileName, actor } = req.body;
  const result = db.submitDeficiencyRemedy(req.params.id, req.params.defId, { responseText, fileName, actor });
  if (!result) {
    return res.status(404).json({ success: false, message: 'Application or deficiency record not found' });
  }
  res.json({
    success: true,
    message: 'Deficiency response evidence submitted successfully.',
    data: result.app,
    deficiency: result.deficiency
  });
});

export default router;
