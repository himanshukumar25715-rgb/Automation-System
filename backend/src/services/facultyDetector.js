// Ghost Faculty Detector.
//
// Finds the same (pseudonymous) faculty identity employed at more than one
// institution over overlapping dates.
//
// Privacy design:
//  - The raw identifier (e.g. an employee/PAN-like number) is normalised and
//    turned into a keyed HMAC-SHA-256 fingerprint at ingest. The raw value and
//    the person's full name are NEVER stored or returned.
//  - A plain unsalted hash of a low-entropy identifier can be brute-forced, so a
//    server-held secret key is used. Set FINGERPRINT_SECRET in production; the
//    fallback below is random per process and only suitable for the demo.
//  - Output is a CANDIDATE for human verification, not an accusation.
//  - The demo uses synthetic identifiers only. Do not use real Aadhaar/PAN.
import { createHmac, createHash, randomBytes } from 'node:crypto';

const DAY_MS = 86400000;
const SECRET = process.env.FINGERPRINT_SECRET || randomBytes(32).toString('hex');
export const usingEphemeralSecret = !process.env.FINGERPRINT_SECRET;

export const normaliseIdentifier = id => String(id).toUpperCase().replace(/[^A-Z0-9]/g, '');

export function fingerprint(identifier) {
  return createHmac('sha256', SECRET).update(normaliseIdentifier(identifier)).digest('hex');
}

function maskToken(t) {
  if (t.length <= 2) return `${t[0]}*`;
  return `${t[0]}***${t[t.length - 1]}`;
}
export const maskName = name =>
  String(name)
    .trim()
    .split(/\s+/)
    .map(maskToken)
    .join(' ');

const toDay = s => Math.floor(new Date(`${s}T00:00:00Z`).getTime() / DAY_MS);
const fromDay = d => new Date(d * DAY_MS).toISOString().slice(0, 10);

export function validateRecord(r) {
  const errors = {};
  if (!r || typeof r.institutionId !== 'string' || !r.institutionId) errors.institutionId = 'required';
  if (!r || typeof r.name !== 'string' || !r.name.trim()) errors.name = 'required';
  if (!r || typeof r.identifier !== 'string' || normaliseIdentifier(r.identifier || '').length < 4) {
    errors.identifier = 'required (at least 4 letters/digits)';
  }
  if (!r || !/^\d{4}-\d{2}-\d{2}$/.test(r.startDate || '')) errors.startDate = 'required, format YYYY-MM-DD';
  if (r && r.endDate && !/^\d{4}-\d{2}-\d{2}$/.test(r.endDate)) errors.endDate = 'format YYYY-MM-DD or null';
  if (r && r.startDate && r.endDate && r.endDate < r.startDate) errors.endDate = 'cannot be before startDate';
  if (r && r.employmentType && !['FULL_TIME', 'PART_TIME'].includes(r.employmentType)) {
    errors.employmentType = 'FULL_TIME or PART_TIME';
  }
  return errors;
}

// Turn an input record into a stored record: no name, no raw identifier.
export function toStoredRecord(r, id) {
  return {
    id,
    institutionId: r.institutionId,
    label: maskName(r.name),
    fingerprint: fingerprint(r.identifier),
    role: r.role || 'Faculty',
    employmentType: r.employmentType || 'FULL_TIME',
    startDate: r.startDate,
    endDate: r.endDate || null,
    synthetic: r.synthetic !== false
  };
}

export const publicRecord = r => {
  const { fingerprint: _fp, ...rest } = r;
  return { ...rest, matchRef: r.fingerprint.slice(0, 8) };
};

export function detectConflicts(records, { asOf = new Date(), institutionName = id => id } = {}) {
  const asOfDay = Math.floor(asOf.getTime() / DAY_MS);
  const byFp = new Map();
  for (const r of records) {
    if (!byFp.has(r.fingerprint)) byFp.set(r.fingerprint, []);
    byFp.get(r.fingerprint).push(r);
  }

  const conflicts = [];
  for (const group of byFp.values()) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const a = group[i];
        const b = group[j];
        if (a.institutionId === b.institutionId) continue; // same institution is not a cross-institution conflict
        const aStart = toDay(a.startDate);
        const bStart = toDay(b.startDate);
        const aEnd = a.endDate ? toDay(a.endDate) : asOfDay;
        const bEnd = b.endDate ? toDay(b.endDate) : asOfDay;
        const start = Math.max(aStart, bStart);
        const end = Math.min(aEnd, bEnd);
        if (start > end) continue; // no overlap (adjacent dates do not overlap)

        const bothFull = a.employmentType === 'FULL_TIME' && b.employmentType === 'FULL_TIME';
        const reasonCodes = ['CROSS_INSTITUTION_OVERLAP', bothFull ? 'BOTH_FULL_TIME' : 'PART_TIME_INVOLVED'];
        if (!a.endDate || !b.endDate) reasonCodes.push('OPEN_ENDED_RECORD');
        const overlapDays = end - start + 1;
        const ids = [a.institutionId, b.institutionId].sort();
        const id = `GFC-${createHash('sha256').update(`${a.fingerprint}|${ids.join('|')}|${fromDay(start)}`).digest('hex').slice(0, 10)}`;
        const side = r => ({
          institutionId: r.institutionId,
          institutionName: institutionName(r.institutionId),
          role: r.role,
          employmentType: r.employmentType,
          startDate: r.startDate,
          endDate: r.endDate
        });
        conflicts.push({
          id,
          label: a.label,
          matchRef: a.fingerprint.slice(0, 8),
          institutions: [side(a), side(b)],
          overlapStart: fromDay(start),
          overlapEnd: fromDay(end),
          overlapDays,
          severity: bothFull ? 'high' : 'low',
          reasonCodes,
          explanation: bothFull
            ? `Same pseudonymous identity appears as full-time at two institutions for ${overlapDays} overlapping days. Potential conflict: verify the source records.`
            : `Same identity appears at two institutions for ${overlapDays} overlapping days, with at least one part-time/visiting role. This may be permitted: verify the source records.`,
          disclaimer: 'Candidate for human verification, not a finding of wrongdoing.'
        });
      }
    }
  }
  return conflicts.sort((x, y) => (x.severity === y.severity ? y.overlapDays - x.overlapDays : x.severity === 'high' ? -1 : 1));
}
