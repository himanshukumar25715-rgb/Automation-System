import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectConflicts, toStoredRecord, publicRecord, maskName, fingerprint, validateRecord } from '../src/services/facultyDetector.js';
import { facultySeed } from '../src/data/facultySeed.js';

const asOf = new Date('2026-10-25T00:00:00Z');
const records = facultySeed.map((r, i) => toStoredRecord(r, `F${i}`));
const conflicts = detectConflicts(records, { asOf });

test('SUCCESS: the true cross-institution full-time overlap is surfaced as a high-severity candidate', () => {
  const high = conflicts.filter(c => c.severity === 'high');
  assert.equal(high.length, 1);
  assert.equal(high[0].overlapStart, '2025-08-01');
  assert.ok(high[0].reasonCodes.includes('BOTH_FULL_TIME'));
  assert.match(high[0].disclaimer, /not a finding of wrongdoing/);
});

test('NEGATIVE: sequential (adjacent-date) moves and same-institution promotions are NOT flagged', () => {
  const labels = conflicts.map(c => c.label);
  assert.equal(labels.includes(maskName('Neha Verma')), false);
  assert.equal(labels.includes(maskName('Suresh Iyer')), false);
});

test('EDGE: part-time/visiting overlap is flagged low severity, not high', () => {
  const low = conflicts.filter(c => c.severity === 'low');
  assert.equal(low.length, 1);
  assert.ok(low[0].reasonCodes.includes('PART_TIME_INVOLVED'));
});

test('EDGE: open-ended records overlap up to the as-of date', () => {
  const high = conflicts.find(c => c.severity === 'high');
  assert.equal(high.overlapEnd, '2026-10-25');
  assert.ok(high.reasonCodes.includes('OPEN_ENDED_RECORD'));
});

test('PRIVACY: no raw identifier, no full name, and only masked labels appear in output', () => {
  const dump = JSON.stringify([conflicts, records.map(publicRecord)]);
  assert.equal(dump.includes('SYN-FAC'), false);
  assert.equal(dump.includes('Aarav'), false);
  assert.equal(dump.includes('Mehta'), false);
  assert.ok(dump.includes('A***v M***a'));
  assert.equal(JSON.stringify(records).includes('fingerprint'), true); // stored internally
  assert.equal(JSON.stringify(records.map(publicRecord)).includes('"fingerprint"'), false);
});

test('FINGERPRINT: normalisation makes formatting differences irrelevant; different ids differ', () => {
  assert.equal(fingerprint('syn-fac-0001'), fingerprint(' SYN FAC 0001 '));
  assert.notEqual(fingerprint('SYN-FAC-0001'), fingerprint('SYN-FAC-0002'));
});

test('VALIDATION: bad records are rejected with field errors', () => {
  const errs = validateRecord({ institutionId: '', name: '', identifier: 'ab', startDate: '2020/01/01' });
  assert.ok(errs.institutionId && errs.name && errs.identifier && errs.startDate);
  assert.ok(validateRecord({ institutionId: 'i', name: 'n', identifier: 'ABCD1', startDate: '2024-05-01', endDate: '2024-01-01' }).endDate);
});
