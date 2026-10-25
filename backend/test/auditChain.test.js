import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AuditChain, GENESIS_HASH, canonicalize } from '../src/services/auditChain.js';

const sample = () => {
  const c = new AuditChain();
  c.append({ date: '2026-10-01 10:00', actor: 'A', applicationId: 'APP-1', action: 'Submitted' });
  c.append({ date: '2026-10-02 10:00', actor: 'B', applicationId: 'APP-1', action: 'Scrutiny passed' });
  c.append({ date: '2026-10-03 10:00', actor: 'C', applicationId: 'APP-2', action: 'Returned' });
  return c;
};

test('SUCCESS: an untouched chain verifies and links to genesis', () => {
  const c = sample();
  assert.equal(c.events[0].prevHash, GENESIS_HASH);
  assert.equal(c.events[1].prevHash, c.events[0].hash);
  const v = c.verify();
  assert.equal(v.valid, true);
  assert.equal(v.checked, 3);
  assert.equal(v.headHash, c.events[2].hash);
});

test('NEGATIVE: editing an event is detected and the first broken seq is reported', () => {
  const c = sample();
  c.tamper(2, 'edited');
  const v = c.verify();
  assert.equal(v.valid, false);
  assert.equal(v.firstBrokenSeq, 2);
});

test('NEGATIVE: removing a middle event is detected', () => {
  const c = sample();
  c.events.splice(1, 1);
  const v = c.verify();
  assert.equal(v.valid, false);
  assert.equal(v.firstBrokenSeq, 3);
});

test('EDGE: empty chain is valid; canonicalisation ignores key order', () => {
  assert.equal(new AuditChain().verify().valid, true);
  assert.equal(canonicalize({ b: 1, a: [2, { d: 1, c: 2 }] }), canonicalize({ a: [2, { c: 2, d: 1 }], b: 1 }));
});

test('LIMITATION (documented): deleting the LAST event is not detectable from the chain alone', () => {
  const c = sample();
  const head = c.headHash;
  c.events.pop();
  assert.equal(c.verify().valid, true);
  assert.notEqual(c.headHash, head); // detectable only by comparing an externally anchored head hash
});
