// SHA-256 hash-chained audit log.
//
// Each event stores the hash of the previous event, so editing or removing any
// earlier event breaks every hash after it. verify() recomputes the whole chain
// and reports the first broken sequence number.
//
// Honest limits (say these out loud in the pitch):
//  - This is a tamper-EVIDENT log, not a blockchain. Someone with write access
//    to the whole store can rewrite every event AND recompute every hash.
//  - Deleting events from the END of the chain cannot be detected from the
//    chain alone. Publish/anchor the head hash somewhere independent (the
//    verify endpoint returns it) to close that gap.
import { createHash } from 'node:crypto';

export const GENESIS_HASH = '0'.repeat(64);

// Deterministic JSON: object keys sorted, so the same data always hashes the same.
export function canonicalize(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  return `{${Object.keys(value)
    .sort()
    .map(k => `${JSON.stringify(k)}:${canonicalize(value[k])}`)
    .join(',')}}`;
}

export function computeHash(prevHash, payload) {
  return createHash('sha256').update(prevHash + canonicalize(payload)).digest('hex');
}

export class AuditChain {
  constructor() {
    this.events = [];
  }

  get headHash() {
    return this.events.length ? this.events[this.events.length - 1].hash : GENESIS_HASH;
  }

  append({ date, actor, applicationId = null, action }) {
    const seq = this.events.length + 1;
    const prevHash = this.headHash;
    const payload = { seq, date, actor, applicationId, action };
    const event = { ...payload, prevHash, hash: computeHash(prevHash, payload) };
    this.events.push(event);
    return event;
  }

  verify() {
    let prev = GENESIS_HASH;
    for (let i = 0; i < this.events.length; i++) {
      const ev = this.events[i];
      const broken = reason => ({
        valid: false,
        checked: i + 1,
        length: this.events.length,
        firstBrokenSeq: ev.seq,
        reason
      });
      if (ev.seq !== i + 1) return broken('sequence number gap or reorder');
      if (ev.prevHash !== prev) return broken('link to previous event does not match');
      const { seq, date, actor, applicationId, action } = ev;
      if (computeHash(prev, { seq, date, actor, applicationId, action }) !== ev.hash) {
        return broken('event content does not match its stored hash');
      }
      prev = ev.hash;
    }
    return { valid: true, checked: this.events.length, length: this.events.length, headHash: prev };
  }

  // DEMO ONLY: edit an event in place WITHOUT recomputing hashes, to show detection.
  tamper(seq, newAction) {
    const ev = this.events.find(e => e.seq === seq);
    if (!ev) return null;
    ev.action = newAction;
    return ev;
  }
}
