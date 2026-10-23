import express from 'express';
import { db } from '../data/store.js';

const router = express.Router();

// GET /api/integrations - Status of national e-gov bridges
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: db.integrations
  });
});

// POST /api/integrations/:id/sync - Trigger sync
router.post('/:id/sync', (req, res) => {
  const integ = db.integrations.find(i => i.id === req.params.id);
  if (!integ) {
    return res.status(404).json({ success: false, message: 'Integration bridge not found' });
  }
  integ.lastSync = 'Just now';
  integ.status = 'Connected';
  res.json({
    success: true,
    message: `Synchronized with ${integ.name}`,
    data: integ
  });
});

export default router;
