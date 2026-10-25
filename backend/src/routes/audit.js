import express from 'express';
import { db } from '../data/store.js';
import { requireDemoSession } from '../middleware/demoSession.js';
import { apiError } from '../utils/http.js';

const router = express.Router();
// The tamper/reset endpoints exist only to demonstrate detection. Never enable in production.
const demoEnabled = () => process.env.NODE_ENV !== 'production' && process.env.ENABLE_DEMO_TOOLS !== 'false';

// GET /api/audit/verify - recompute the whole chain; report VALID or the first broken sequence number
router.get('/verify', (req, res) => {
  const result = db.auditChain.verify();
  res.json({
    success: true,
    status: result.valid ? 'VALID' : 'BROKEN',
    ...result,
    note: 'SHA-256 hash chain. Detects edits to recorded events; it is not a blockchain. Anchor headHash externally to also detect truncation.'
  });
});

// GET /api/audit/events?applicationId=&limit=&offset=
router.get('/events', requireDemoSession, (req, res) => {
  const applicationId = req.query.applicationId;
  if (typeof applicationId !== 'string' || applicationId.trim() === '') {
    return apiError(
      res,
      400,
      'VALIDATION_ERROR',
      'applicationId is required to read audit events.',
      { applicationId: 'required application ID' }
    );
  }

  const application = db.getApplicationByIdForSession(applicationId, req.demoSession);
  if (!application) {
    return apiError(res, 404, 'APPLICATION_NOT_FOUND', 'Application not found');
  }

  const limit = Math.min(Number(req.query.limit) || 50, 500);
  const offset = Number(req.query.offset) || 0;
  const events = db.auditChain.events.filter(event => event.applicationId === applicationId);
  const data = events.slice(offset, offset + limit).map(({ seq, date, actor, applicationId: eventApplicationId, action, prevHash, hash }) => ({
    seq,
    date,
    actor,
    applicationId: eventApplicationId,
    action,
    prevHash,
    hash
  }));
  res.json({ success: true, total: events.length, count: Math.min(limit, Math.max(events.length - offset, 0)), data });
});

// POST /api/audit/demo/tamper  { seq }  - DEMO ONLY: edits an event without recomputing hashes
router.post('/demo/tamper', (req, res) => {
  if (!demoEnabled()) return apiError(res, 403, 'DEMO_DISABLED', 'Demo tools are disabled');
  const seq = Number(req.body && req.body.seq);
  if (!Number.isInteger(seq)) return apiError(res, 400, 'VALIDATION_ERROR', 'seq must be an integer', { seq: 'required integer' });
  const ev = db.auditChain.tamper(seq, 'TAMPERED: this text was edited after the event was recorded');
  if (!ev) return apiError(res, 404, 'EVENT_NOT_FOUND', `No event with seq ${seq}`);
  res.json({ success: true, message: `Event ${seq} edited without recomputing hashes. Call GET /api/audit/verify.` });
});

// POST /api/audit/demo/reset - DEMO ONLY: rebuild all in-memory state from seed data
router.post('/demo/reset', (req, res) => {
  if (!demoEnabled()) return apiError(res, 403, 'DEMO_DISABLED', 'Demo tools are disabled');
  db.init();
  res.json({ success: true, message: 'Demo state reset to seed data.', eventCount: db.auditChain.events.length });
});

export default router;
