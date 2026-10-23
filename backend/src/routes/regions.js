import express from 'express';
import { db } from '../data/store.js';

const router = express.Router();

// GET /api/regions - 8 AICTE Regional Offices with workload and SLA health
router.get('/', (req, res) => {
  const regions = db.getRegionalAnalytics();
  res.json({
    success: true,
    count: regions.length,
    data: regions
  });
});

export default router;
