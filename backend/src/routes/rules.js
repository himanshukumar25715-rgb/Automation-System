import express from 'express';
import { db } from '../data/store.js';

const router = express.Router();

// GET /api/rules/active - the rule set in force, including its version and DEMO notice
router.get('/active', (req, res) => {
  res.json({ success: true, data: db.ruleset });
});

export default router;
