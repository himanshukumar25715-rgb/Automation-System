import express from 'express';
import { db } from '../data/store.js';
import { apiError } from '../utils/http.js';
import { validateRecord, usingEphemeralSecret } from '../services/facultyDetector.js';

const router = express.Router();

// GET /api/faculty/conflicts?institutionId=&status=OPEN|DISMISSED|CONFIRMED_FOR_REVIEW
// Returns masked candidates with reason codes. Never returns names or raw identifiers.
router.get('/conflicts', (req, res) => {
  const data = db.getFacultyConflicts({ institutionId: req.query.institutionId, status: req.query.status });
  res.json({
    success: true,
    count: data.length,
    syntheticDemoData: true,
    ephemeralFingerprintSecret: usingEphemeralSecret,
    data
  });
});

// GET /api/faculty/records?institutionId= - masked records only
router.get('/records', (req, res) => {
  const data = db.getFacultyRecords({ institutionId: req.query.institutionId });
  res.json({ success: true, count: data.length, data });
});

// POST /api/faculty/records - body: { institutionId, name, identifier, role?, employmentType?, startDate, endDate? }
// The identifier is fingerprinted immediately and is not stored or echoed back.
router.post('/records', (req, res) => {
  const fieldErrors = validateRecord(req.body);
  if (Object.keys(fieldErrors).length) return apiError(res, 400, 'VALIDATION_ERROR', 'Invalid faculty record', fieldErrors);
  const record = db.addFacultyRecord(req.body);
  res.status(201).json({ success: true, data: record });
});

// POST /api/faculty/conflicts/:id/disposition - body: { decision, reason, actor? }
// decision: DISMISSED | CONFIRMED_FOR_REVIEW. A reason is mandatory and the action is audited.
router.post('/conflicts/:id/disposition', (req, res) => {
  const { decision, reason, actor } = req.body || {};
  const fieldErrors = {};
  if (!['DISMISSED', 'CONFIRMED_FOR_REVIEW'].includes(decision)) fieldErrors.decision = 'must be DISMISSED or CONFIRMED_FOR_REVIEW';
  if (typeof reason !== 'string' || reason.trim().length < 5) fieldErrors.reason = 'a reason of at least 5 characters is required';
  if (Object.keys(fieldErrors).length) return apiError(res, 400, 'VALIDATION_ERROR', 'Invalid disposition', fieldErrors);

  const result = db.recordFacultyDisposition(req.params.id, { decision, reason: reason.trim(), actor });
  if (!result) return apiError(res, 404, 'CONFLICT_NOT_FOUND', 'Conflict candidate not found');
  res.json({ success: true, data: result });
});

export default router;
