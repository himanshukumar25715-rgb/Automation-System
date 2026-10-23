import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from '../data/store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// GET /api/reports/summary - National approval overview
router.get('/summary', (req, res) => {
  const summary = db.getNationalSummary();
  res.json({
    success: true,
    data: summary
  });
});

// GET /api/reports/pdf - Download the official project documentation PDF
router.get('/pdf', (req, res) => {
  const pdfPath = path.resolve(__dirname, '../../../AICTE_PRAGATI_NAV_Project_Documentation.pdf');
  if (fs.existsSync(pdfPath)) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="AICTE_PRAGATI_NAV_Project_Documentation.pdf"');
    return fs.createReadStream(pdfPath).pipe(res);
  }
  return res.status(404).json({ success: false, message: 'PDF report not found on server' });
});

export default router;
