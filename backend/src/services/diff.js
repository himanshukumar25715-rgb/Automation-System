// Deficiency diff: what exactly changed between two versions of an application's
// extracted data, and which findings that resolved or newly raised.
import { createHash } from 'node:crypto';
import { canonicalize } from './auditChain.js';
import { fieldKey } from './rulesEngine.js';

const norm = v => (v === null || v === undefined ? null : typeof v === 'number' ? v : String(v).trim());

export function hashFields(fields) {
  const sorted = [...fields].sort((a, b) => fieldKey(a.docType, a.field).localeCompare(fieldKey(b.docType, b.field)));
  return createHash('sha256').update(canonicalize(sorted)).digest('hex');
}

// patch mode: given fields override matching keys; value === null removes a field.
export function applyPatch(baseFields, patchFields) {
  const map = new Map(baseFields.map(f => [fieldKey(f.docType, f.field), { ...f }]));
  for (const p of patchFields) {
    const key = fieldKey(p.docType, p.field);
    if (p.value === null || p.value === undefined || p.value === '') map.delete(key);
    else map.set(key, { ...map.get(key), ...p });
  }
  return [...map.values()];
}

export function diffFields(oldFields, newFields) {
  const oldMap = new Map(oldFields.map(f => [fieldKey(f.docType, f.field), f]));
  const newMap = new Map(newFields.map(f => [fieldKey(f.docType, f.field), f]));
  const added = [];
  const removed = [];
  const changed = [];
  let unchanged = 0;

  for (const [key, nf] of newMap) {
    const of = oldMap.get(key);
    if (!of) added.push({ key, to: { value: nf.value, page: nf.page ?? null } });
    else if (norm(of.value) !== norm(nf.value)) {
      changed.push({
        key,
        from: { value: of.value, page: of.page ?? null },
        to: { value: nf.value, page: nf.page ?? null }
      });
    } else unchanged += 1;
  }
  for (const [key, of] of oldMap) {
    if (!newMap.has(key)) removed.push({ key, from: { value: of.value, page: of.page ?? null } });
  }
  return { added, removed, changed, unchanged, totalChanges: added.length + removed.length + changed.length };
}

const OPEN = new Set(['FAIL', 'NEEDS_REVIEW']);

// Compare two pre-flight runs rule by rule.
export function diffFindings(prevRun, nextRun) {
  const prev = new Map((prevRun ? prevRun.findings : []).map(f => [f.ruleKey, f]));
  const resolved = [];
  const stillOpen = [];
  const newlyRaised = [];
  for (const f of nextRun.findings) {
    const p = prev.get(f.ruleKey);
    const wasOpen = p && OPEN.has(p.outcome);
    const isOpen = OPEN.has(f.outcome);
    if (wasOpen && !isOpen) resolved.push({ ruleKey: f.ruleKey, title: f.title, from: p.outcome, to: f.outcome });
    else if (wasOpen && isOpen) stillOpen.push({ ruleKey: f.ruleKey, title: f.title, from: p.outcome, to: f.outcome });
    else if (!wasOpen && isOpen) newlyRaised.push({ ruleKey: f.ruleKey, title: f.title, from: p ? p.outcome : null, to: f.outcome });
  }
  return { resolved, stillOpen, newlyRaised };
}
