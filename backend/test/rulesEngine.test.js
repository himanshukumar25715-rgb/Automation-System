import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runPreflight, hashInputs } from '../src/services/rulesEngine.js';
import { preflightSeed } from '../src/data/preflightSeed.js';

const ruleset = JSON.parse(readFileSync(new URL('../src/data/rulesets/aph-demo-v1.json', import.meta.url), 'utf8'));
const asOf = new Date('2026-10-25T00:00:00Z');
const run = id => runPreflight({ applicationId: id, fields: preflightSeed[id], ruleset, asOf });
const finding = (r, key) => r.findings.find(f => f.ruleKey === key);

test('SUCCESS: a clean case is READY with every rule passing', () => {
  const r = run('APP-2026-SCRO-4421');
  assert.equal(r.readiness, 'READY');
  assert.equal(r.summary.pass, r.summary.total);
});

test('NEGATIVE: seeded inconsistencies are detected, with both source values and pages', () => {
  const r = run('APP-2026-NRO-8821');
  assert.equal(r.readiness, 'BLOCKED');
  const land = finding(r, 'R-XDOC-LAND-01');
  assert.equal(land.outcome, 'FAIL');
  assert.deepEqual(land.evidence.map(e => e.value), [8000, 9200]);
  assert.deepEqual(land.evidence.map(e => e.page), [2, 1]);
  assert.equal(finding(r, 'R-XDOC-INTAKE-01').outcome, 'FAIL');
  assert.equal(finding(r, 'R-AREA-01').outcome, 'FAIL');
  assert.match(finding(r, 'R-AREA-01').explanation, /Shortfall/);
});

test('NEGATIVE: a missing document yields a required-field FAIL naming the field', () => {
  const r = run('APP-2026-CRO-3310');
  assert.equal(r.readiness, 'BLOCKED');
  const doc = finding(r, 'R-DOC-01');
  assert.equal(doc.outcome, 'FAIL');
  assert.match(doc.explanation, /FIRE_NOC\.expiryDate/);
});

test('EDGE: low extraction confidence becomes NEEDS_REVIEW, not a silent pass or fail', () => {
  const r = run('APP-2026-NRO-8821');
  const fac = finding(r, 'R-FAC-01');
  assert.equal(fac.outcome, 'NEEDS_REVIEW');
  assert.match(fac.explanation, /Low extraction confidence/);
});

test('EDGE: near-expiry date is NEEDS_REVIEW; expired date is FAIL', () => {
  assert.equal(finding(run('APP-2026-WRO-1049'), 'R-FIRE-01').outcome, 'NEEDS_REVIEW');
  const expired = preflightSeed['APP-2026-WRO-1049'].map(f => (f.docType === 'FIRE_NOC' ? { ...f, value: '2026-10-01' } : f));
  const r = runPreflight({ applicationId: 'x', fields: expired, ruleset, asOf });
  assert.equal(finding(r, 'R-FIRE-01').outcome, 'FAIL');
});

test('EDGE: area tolerance - 0.5% difference passes, 15% fails', () => {
  const base = preflightSeed['APP-2026-SCRO-4421'];
  const withSite = v => base.map(f => (f.docType === 'SITE_PLAN' && f.field === 'landAreaSqm' ? { ...f, value: v } : f));
  assert.equal(finding(runPreflight({ applicationId: 'x', fields: withSite(10050), ruleset, asOf }), 'R-XDOC-LAND-01').outcome, 'PASS');
  assert.equal(finding(runPreflight({ applicationId: 'x', fields: withSite(11500), ruleset, asOf }), 'R-XDOC-LAND-01').outcome, 'FAIL');
});

test('REPRODUCIBLE: same inputs give the same input hash; a changed value changes it; run records the rule version', () => {
  const a = run('APP-2026-SCRO-4421');
  const b = run('APP-2026-SCRO-4421');
  assert.equal(a.inputHash, b.inputHash);
  assert.equal(a.rulesetVersion, '1.0.0');
  const changed = preflightSeed['APP-2026-SCRO-4421'].map(f => (f.field === 'facultyCount' ? { ...f, value: 99 } : f));
  assert.notEqual(hashInputs(changed), a.inputHash);
});

test('SAFETY: engine reports readiness only; it never emits an approve/reject decision', () => {
  const r = run('APP-2026-NRO-8821');
  assert.ok(['READY', 'REVIEW_REQUIRED', 'BLOCKED'].includes(r.readiness));
  assert.equal(r.rulesetStatus, 'DEMO');
  assert.equal('approved' in r, false);
});
