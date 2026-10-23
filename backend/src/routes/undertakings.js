import express from 'express';
import { db } from '../data/store.js';

const router = express.Router();

// GET /api/undertakings
router.get('/', (req, res) => {
  const { institutionId, status } = req.query;
  const list = db.getAllUndertakings({ institutionId, status });
  res.json({
    success: true,
    count: list.length,
    data: list
  });
});

// POST /api/undertakings/:id/evidence
router.post('/:id/evidence', (req, res) => {
  const { fileName, remarks, actor } = req.body;
  const updated = db.submitUndertakingEvidence(req.params.id, { fileName, remarks, actor });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Undertaking record not found' });
  }
  res.json({
    success: true,
    message: 'Compliance evidence submitted for Regional Officer review.',
    data: updated
  });
});

// POST /api/undertakings/:id/verify
router.post('/:id/verify', (req, res) => {
  const { approved, remarks, actor } = req.body;
  const updated = db.verifyUndertaking(req.params.id, { approved, remarks, actor });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Undertaking record not found' });
  }
  res.json({
    success: true,
    message: `Undertaking ${approved ? 'verified and marked compliant' : 'rejected / non-compliant'}`,
    data: updated
  });
});

export default router;
