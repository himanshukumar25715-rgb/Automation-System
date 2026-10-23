import express from 'express';
import { db } from '../data/store.js';

const router = express.Router();

// GET /api/evc/experts - Expert panel pool
router.get('/experts', (req, res) => {
  const experts = db.getExperts();
  res.json({
    success: true,
    count: experts.length,
    data: experts
  });
});

// POST /api/evc/schedule - Schedule 3-member EVC for an application
router.post('/schedule', (req, res) => {
  const { applicationId, expertIds, visitDate, actor } = req.body;
  if (!applicationId) {
    return res.status(400).json({ success: false, message: 'applicationId is required' });
  }

  const updated = db.scheduleEVC(applicationId, { expertIds, visitDate, actor });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  res.json({
    success: true,
    message: '3-member EVC successfully constituted and scheduled. 48-hour inspection clock started.',
    data: updated
  });
});

// POST /api/evc/:id/report - Upload geo-tagged inspection report
router.post('/:id/report', (req, res) => {
  const { outcome, fileName, remarks, actor } = req.body;
  const updated = db.uploadEVCReport(req.params.id, { outcome, fileName, remarks, actor });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Application or EVC record not found' });
  }

  res.json({
    success: true,
    message: 'Inspection report uploaded and committee digitally signed off.',
    data: updated
  });
});

export default router;
