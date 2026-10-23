import express from 'express';
import { db } from '../data/store.js';

const router = express.Router();

// GET /api/applications - Query by region, status, institutionId
router.get('/', (req, res) => {
  const { region, status, institutionId } = req.query;
  const applications = db.getApplications({ region, status, institutionId });
  res.json({
    success: true,
    count: applications.length,
    data: applications
  });
});

// GET /api/applications/:id - Fetch single application
router.get('/:id', (req, res) => {
  const app = db.getApplicationById(req.params.id);
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
