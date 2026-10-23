import express from 'express';
import { db } from '../data/store.js';

const router = express.Router();

// GET /api/leases - Land lease deeds & statutory document validity
router.get('/', (req, res) => {
  const { institutionId } = req.query;
  const list = db.getAllLeases({ institutionId });
  res.json({
    success: true,
    count: list.length,
    data: list
  });
});

// POST /api/leases/:docNo/renew - Upload renewal deed
router.post('/:docNo/renew', (req, res) => {
  const { newExpiryDate, fileName, actor } = req.body;
  const updated = db.renewDocument(req.params.docNo, { newExpiryDate, fileName, actor });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Document record not found' });
  }
  res.json({
    success: true,
    message: 'Registered renewal extension deed submitted for Regional Office validation.',
    data: updated
  });
});

export default router;
