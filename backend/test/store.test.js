// Exercises the real store (state, audit chain, versions, faculty) without Express,
// so it runs even before `npm install`. HTTP-level checks live in api.test.js.
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../src/data/store.js';

const AS_OF = '2026-10-25';
beforeEach(() => db.init());

test('seeded activity logs are re-sealed into a verifiable chain, with display hashes derived from it', () => {
  assert.equal(db.auditChain.verify().valid, true);
  const entry = db.applications[0].auditTrail[0];
  assert.match(entry.hash, /^sha256-[0-9a-f]{12}$/);
  assert.equal(entry.eventHash.slice(0, 12), entry.hash.slice(7));
});

test('every workflow mutation appends a chained event (no random hashes remain)', () => {
  const before = db.auditChain.events.length;
  db.advanceApplicationStage('APP-2026-NRO-8821', { actor: 'RO NRO', remarks: 'ok' });
  db.revertApplicationDeficiency('APP-2026-NRO-8821', { clause: 'Demo', description: 'x' });
  const def = db.getApplicationById('APP-2026-NRO-8821').deficiencies.at(-1);
  db.submitDeficiencyRemedy('APP-2026-NRO-8821', def.id, { responseText: 'fixed' });
  db.scheduleEVC('APP-2026-NRO-8821', { expertIds: ['EXP-101'] });
  db.uploadEVCReport('APP-2026-NRO-8821', { outcome: 'Recommended' });
  assert.equal(db.auditChain.events.length, before + 5);
  assert.equal(db.auditChain.verify().valid, true);
});

test('tampering with a stored event is detected at that sequence number; reset restores', () => {
  db.auditChain.tamper(5, 'edited');
  const v = db.auditChain.verify();
  assert.equal(v.valid, false);
  assert.equal(v.firstBrokenSeq, 5);
  db.init();
  assert.equal(db.auditChain.verify().valid, true);
});

test('preflight: stored run records version, ruleset and input hash; findings can be filtered', () => {
  const run = db.runPreflightFor('APP-2026-NRO-8821', { asOf: AS_OF });
  assert.equal(run.readiness, 'BLOCKED');
  assert.equal(run.applicationVersion, 1);
  assert.equal(run.rulesetVersion, '1.0.0');
  assert.match(run.inputHash, /^[0-9a-f]{64}$/);
  const crit = db.getFindings('APP-2026-NRO-8821', { outcome: 'fail', severity: 'critical' });
  assert.ok(crit.findings.length >= 1 && crit.findings.every(f => f.outcome === 'FAIL' && f.severity === 'critical'));
  assert.equal(db.runPreflightFor('NOPE'), null);
  assert.equal(db.getFindings('NOPE'), null);
});

test('resubmit: field diff + findings resolved + new version + audited, history never rewritten', () => {
  const id = 'APP-2026-NRO-8821';
  db.runPreflightFor(id, { asOf: AS_OF });
  const v1Hash = db.getFieldVersions(id)[0].fieldsHash;
  const r = db.resubmit(id, {
    asOf: AS_OF,
    note: 'Corrected',
    fields: [
      { docType: 'LAND_LEASE', field: 'landAreaSqm', value: 9200, page: 2 },
      { docType: 'APPLICATION_FORM', field: 'sanctionedIntake', value: 180, page: 3 }
    ]
  });
  assert.equal(r.version, 2);
  assert.deepEqual(r.fieldDiff.changed.map(c => c.key).sort(), ['APPLICATION_FORM.sanctionedIntake', 'LAND_LEASE.landAreaSqm']);
  const resolved = r.findingDiff.resolved.map(x => x.ruleKey);
  assert.ok(resolved.includes('R-XDOC-LAND-01') && resolved.includes('R-XDOC-INTAKE-01'));
  assert.equal(r.findingDiff.newlyRaised.length, 0);
  const versions = db.getFieldVersions(id);
  assert.equal(versions.length, 2);
  assert.equal(versions[0].fieldsHash, v1Hash); // v1 untouched
  assert.equal(db.ruleRuns[id].length, 2); // both runs kept
  assert.equal(db.auditChain.verify().valid, true);
});

test('resubmit: unchanged value = zero changes; removing a field (value null) is reported as removed', () => {
  const same = db.resubmit('APP-2026-SCRO-4421', { asOf: AS_OF, fields: [{ docType: 'LAND_LEASE', field: 'landAreaSqm', value: 10000 }] });
  assert.equal(same.fieldDiff.totalChanges, 0);
  const rem = db.resubmit('APP-2026-SCRO-4421', { asOf: AS_OF, fields: [{ docType: 'FIRE_NOC', field: 'expiryDate', value: null }] });
  assert.equal(rem.fieldDiff.removed.length, 1);
  assert.ok(rem.findingDiff.newlyRaised.some(x => x.ruleKey === 'R-DOC-01'));
});

test('resubmit on a returned application moves it back to In Progress once nothing new is raised', () => {
  const id = 'APP-2026-SCRO-4421';
  db.revertApplicationDeficiency(id, { clause: 'Demo', description: 'x' });
  assert.equal(db.getApplicationById(id).status, 'Returned for Deficiency');
  db.resubmit(id, { asOf: AS_OF, fields: [{ docType: 'LAND_LEASE', field: 'landAreaSqm', value: 10000 }] });
  assert.equal(db.getApplicationById(id).status, 'In Progress');
});

test('faculty: conflicts are masked, dispositions are stored, audited and change status', () => {
  const list = db.getFacultyConflicts({ asOf: AS_OF });
  const high = list.find(c => c.severity === 'high');
  assert.equal(high.status, 'OPEN');
  assert.equal(high.institutions[0].institutionName.length > 5, true); // resolved from existing applications
  const before = db.auditChain.events.length;
  const out = db.recordFacultyDisposition(high.id, { decision: 'DISMISSED', reason: 'Resigned before joining', actor: 'RO' });
  assert.equal(out.status, 'DISMISSED');
  assert.equal(db.auditChain.events.length, before + 1);
  assert.equal(db.getFacultyConflicts({ asOf: AS_OF, status: 'open' }).some(c => c.id === high.id), false);
  assert.equal(db.recordFacultyDisposition('NOPE', { decision: 'DISMISSED', reason: 'whatever' }), null);
  assert.equal(JSON.stringify(db.getFacultyRecords()).includes('SYN-FAC'), false);
});

test('faculty: filtering by institution and adding a new overlapping record', () => {
  const quantum = db.getFacultyConflicts({ asOf: AS_OF, institutionId: '1-992384110' });
  assert.ok(quantum.length >= 1 && quantum.every(c => c.institutions.some(i => i.institutionId === '1-992384110')));
  const before = db.getFacultyConflicts({ asOf: AS_OF }).length;
  db.addFacultyRecord({ institutionId: '1-120938445', name: 'Imran Qureshi', identifier: 'SYN-FAC-0005', startDate: '2024-01-01' });
  assert.equal(db.getFacultyConflicts({ asOf: AS_OF }).length, before + 1);
});

test('original read APIs still return the same shapes', () => {
  assert.equal(db.getApplications().length, 5);
  assert.equal(db.getApplications({ region: 'wro' }).length, 1);
  assert.ok(db.getEscalations().length >= 1);
  assert.equal(db.getRegionalAnalytics().length, 8);
  assert.equal(db.getNationalSummary().totalApplications, 5);
});
