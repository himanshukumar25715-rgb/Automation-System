import express from 'express';
import { db } from '../data/store.js';
import { requireDemoSession } from '../middleware/demoSession.js';
import { apiError } from '../utils/http.js';

const router = express.Router();

function requireScopedApplication(req, res, next) {
  const application = db.getApplicationByIdForSession(req.params.id, req.demoSession);
  if (!application) {
    return apiError(res, 404, 'APPLICATION_NOT_FOUND', 'Application not found');
  }
  req.application = application;
  return next();
}

// Read-only API-backed slice: scope comes from the synthetic demo session.
router.get('/', requireDemoSession, (req, res) => {
  const { status } = req.query;
  const applications = db.getApplicationsForSession(req.demoSession, { status });
  res.json({
    success: true,
    demoMode: true,
    count: applications.length,
    data: applications
  });
});

// POST /api/applications/:id/advance - Advance to downstream stage
router.post('/:id/advance', (req, res) => {
  const { remarks, actor } = req.body;
  const updated = db.advanceApplicationStage(req.params.id, { remarks, actor });
  if (!updated) {
    return res.status(400).json({ success: false, message: 'Unable to advance stage. Application already at terminal stage or not found.' });
  }
  res.json({
    success: true,
    message: `Application advanced to "${updated.currentStage}"`,
    data: updated
  });
});

// POST /api/applications/:id/revert - Revert application with deficiency memo
router.post('/:id/revert', (req, res) => {
  const { clause, description, daysToCure, actor } = req.body;
  const result = db.revertApplicationDeficiency(req.params.id, { clause, description, daysToCure, actor });
  if (!result) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }
  res.json({
    success: true,
    message: 'Application reverted with deficiency memo. 7-day cure window clock initiated.',
    data: result.app,
    deficiency: result.deficiency
  });
});

// POST /api/applications/:id/deficiency/:defId/remedy - Submit remedy response
router.post('/:id/deficiency/:defId/remedy', (req, res) => {
  const { responseText, fileName, actor } = req.body;
  const result = db.submitDeficiencyRemedy(req.params.id, req.params.defId, { responseText, fileName, actor });
  if (!result) {
    return res.status(404).json({ success: false, message: 'Application or deficiency record not found' });
  }
  res.json({
    success: true,
    message: 'Deficiency response evidence submitted successfully.',
    data: result.app,
    deficiency: result.deficiency
  });
});

// ---- Pre-flight rules, findings, versions and deficiency diff ----------------

// POST /api/applications/:id/preflight - run the versioned rule set on the latest version
router.post('/:id/preflight', (req, res) => {
  const run = db.runPreflightFor(req.params.id, { actor: req.body && req.body.actor });
  if (!run) return apiError(res, 404, 'APPLICATION_NOT_FOUND', 'Application not found');
  res.json({ success: true, data: run });
});

// GET /api/applications/:id/findings?severity=&outcome=&ruleKey=
router.get('/:id/findings', requireDemoSession, requireScopedApplication, (req, res) => {
  const result = db.getFindings(req.params.id, req.query);
  if (!result) return apiError(res, 404, 'APPLICATION_NOT_FOUND', 'Application not found');
  res.json({ success: true, data: result });
});

// GET /api/applications/:id/versions - every submitted version of the extracted data
router.get('/:id/versions', requireDemoSession, requireScopedApplication, (req, res) => {
  const versions = db.getFieldVersions(req.params.id);
  if (!versions) return apiError(res, 404, 'APPLICATION_NOT_FOUND', 'Application not found');
  res.json({
    success: true,
    count: versions.length,
    data: versions.map(v => ({ version: v.version, fieldsHash: v.fieldsHash, createdAt: v.createdAt, note: v.note, submittedBy: v.submittedBy, fieldCount: v.fields.length }))
  });
});

// Keep the detail route after the more-specific GET subroutes above.
// Scope is still derived exclusively from the synthetic demo session.
router.get('/:id', requireDemoSession, (req, res) => {
  const app = db.getApplicationByIdForSession(req.params.id, req.demoSession);
  if (!app) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }
  res.json({ success: true, demoMode: true, data: app });
});

// POST /api/applications/:id/resubmit - body: { fields:[{docType,field,value,page?,confidence?}], note?, actor? }
// Fields are a PATCH over the previous version; value:null removes a field.
router.post('/:id/resubmit', (req, res) => {
  const { fields, note, actor } = req.body || {};
  const fieldErrors = {};
  if (!Array.isArray(fields) || fields.length === 0) {
    fieldErrors.fields = 'must be a non-empty array';
  } else {
    fields.forEach((f, i) => {
      if (!f || typeof f.docType !== 'string' || !f.docType) fieldErrors[`fields[${i}].docType`] = 'required';
      if (!f || typeof f.field !== 'string' || !f.field) fieldErrors[`fields[${i}].field`] = 'required';
      if (f && f.confidence != null && !(f.confidence >= 0 && f.confidence <= 1)) fieldErrors[`fields[${i}].confidence`] = 'must be between 0 and 1';
    });
  }
  if (Object.keys(fieldErrors).length) return apiError(res, 400, 'VALIDATION_ERROR', 'Invalid resubmission payload', fieldErrors);

  const result = db.resubmit(req.params.id, { fields, note, actor });
  if (!result) return apiError(res, 404, 'APPLICATION_NOT_FOUND', 'Application not found');
  res.json({ success: true, message: `Resubmitted as version ${result.version}`, data: result });
});

export default router;
