import express from 'express';
import { db } from '../data/store.js';

const router = express.Router();

// GET /api/escalations - Get active aging and SLA escalation cases
router.get('/', (req, res) => {
  const escalations = db.getEscalations();
  res.json({
    success: true,
    count: escalations.length,
    data: escalations
  });
});

export default router;
