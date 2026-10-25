// Deterministic, versioned rules-as-code evaluator.
//
// No LLM is involved: every outcome comes from a rule definition, so each
// finding is reproducible and explainable. Findings carry the rule key, clause
// reference, the compared values, and the source document/page of each value.
//
// Outcomes:
//   PASS          the rule is satisfied
//   FAIL          the rule is violated (needs institution action)
//   NEEDS_REVIEW  cannot be decided safely: low-confidence extraction, a date
//                 close to expiry, or similar. A human looks at the evidence.
// The engine never approves or rejects an application. It reports readiness.
import { createHash } from 'node:crypto';
import { canonicalize } from './auditChain.js';

const DAY_MS = 86400000;

export const fieldKey = (docType, field) => `${docType}.${field}`;

function indexFields(fields) {
  const idx = new Map();
  for (const f of fields) idx.set(fieldKey(f.docType, f.field), f);
  return idx;
}

const evidenceOf = (f, docType, field) => ({
  docType,
  field,
  value: f ? f.value : null,
  page: f && f.page != null ? f.page : null,
  confidence: f && f.confidence != null ? f.confidence : null
});

const isMissing = f => !f || f.value === null || f.value === undefined || f.value === '';

function toNumber(v) {
  const n = typeof v === 'number' ? v : Number(String(v).replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
}

function toDate(v) {
  const d = new Date(`${String(v).slice(0, 10)}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function lowConfidence(evidence, threshold) {
  return evidence.filter(e => e.confidence != null && e.confidence < threshold);
}

const EVALUATORS = {
  required_fields(rule, idx) {
    const evidence = rule.fields.map(r => evidenceOf(idx.get(fieldKey(r.docType, r.field)), r.docType, r.field));
    const missing = evidence.filter(e => e.value === null || e.value === undefined || e.value === '');
    if (missing.length) {
      return {
        outcome: 'FAIL',
        explanation: `Missing required data: ${missing.map(m => `${m.docType}.${m.field}`).join(', ')}.`,
        evidence: missing
      };
    }
    return { outcome: 'PASS', explanation: 'All mandatory fields are present.', evidence };
  },

  date_not_expired(rule, idx, ctx) {
    const f = idx.get(fieldKey(rule.docType, rule.field));
    const ev = evidenceOf(f, rule.docType, rule.field);
    if (isMissing(f)) return { outcome: 'FAIL', explanation: `${rule.docType}.${rule.field} is missing.`, evidence: [ev] };
    const d = toDate(f.value);
    if (!d) return { outcome: 'NEEDS_REVIEW', explanation: `Could not read "${f.value}" as a date.`, evidence: [ev] };
    const daysLeft = Math.floor((d.getTime() - ctx.asOf.getTime()) / DAY_MS);
    if (daysLeft < 0) {
      return { outcome: 'FAIL', explanation: `Expired on ${f.value} (${Math.abs(daysLeft)} days before ${ctx.asOfISO}).`, evidence: [ev] };
    }
    if (rule.warnWithinDays != null && daysLeft <= rule.warnWithinDays) {
      return {
        outcome: 'NEEDS_REVIEW',
        explanation: `Valid until ${f.value}, but only ${daysLeft} days remain (warning window: ${rule.warnWithinDays} days).`,
        evidence: [ev]
      };
    }
    return { outcome: 'PASS', explanation: `Valid until ${f.value} (${daysLeft} days remaining).`, evidence: [ev] };
  },

  cross_doc_match(rule, idx, ctx) {
    const l = idx.get(fieldKey(rule.left.docType, rule.left.field));
    const r = idx.get(fieldKey(rule.right.docType, rule.right.field));
    const evidence = [
      evidenceOf(l, rule.left.docType, rule.left.field),
      evidenceOf(r, rule.right.docType, rule.right.field)
    ];
    if (isMissing(l) || isMissing(r)) {
      const which = [isMissing(l) && `${rule.left.docType}.${rule.left.field}`, isMissing(r) && `${rule.right.docType}.${rule.right.field}`]
        .filter(Boolean)
        .join(' and ');
      return { outcome: 'FAIL', explanation: `Cannot compare: ${which} missing.`, evidence };
    }
    const tol = rule.tolerancePctParam ? ctx.params[rule.tolerancePctParam] : rule.tolerancePct ?? 0;
    const ln = toNumber(l.value);
    const rn = toNumber(r.value);
    let matches;
    let detail;
    if (ln !== null && rn !== null) {
      const base = Math.max(Math.abs(ln), Math.abs(rn)) || 1;
      const diffPct = (Math.abs(ln - rn) / base) * 100;
      matches = diffPct <= tol;
      detail = `${ln} vs ${rn} (difference ${diffPct.toFixed(2)}%, tolerance ${tol}%)`;
    } else {
      matches = String(l.value).trim().toLowerCase() === String(r.value).trim().toLowerCase();
      detail = `"${l.value}" vs "${r.value}"`;
    }
    return matches
      ? { outcome: 'PASS', explanation: `Values agree across documents: ${detail}.`, evidence }
      : { outcome: 'FAIL', explanation: `Values disagree across documents: ${detail}.`, evidence };
  },

  min_ratio(rule, idx, ctx) {
    const a = idx.get(fieldKey(rule.actual.docType, rule.actual.field));
    const b = idx.get(fieldKey(rule.basis.docType, rule.basis.field));
    const evidence = [
      evidenceOf(a, rule.actual.docType, rule.actual.field),
      evidenceOf(b, rule.basis.docType, rule.basis.field)
    ];
    if (isMissing(a) || isMissing(b)) {
      return { outcome: 'FAIL', explanation: 'Cannot evaluate: required input is missing.', evidence };
    }
    const actual = toNumber(a.value);
    const basis = toNumber(b.value);
    if (actual === null || basis === null) {
      return { outcome: 'NEEDS_REVIEW', explanation: 'Could not read one of the inputs as a number.', evidence };
    }
    let required;
    if (rule.perUnitParam) required = basis * ctx.params[rule.perUnitParam];
    else required = basis / ctx.params[rule.divideByParam];
    if (rule.roundUp) required = Math.ceil(required);
    const ok = actual >= required;
    const expl = `${rule.actual.field} = ${actual} ${rule.unit}; required for ${rule.basis.field} ${basis} = ${required} ${rule.unit} (demo parameter).`;
    return ok
      ? { outcome: 'PASS', explanation: `${expl} Requirement met.`, evidence }
      : { outcome: 'FAIL', explanation: `${expl} Shortfall of ${(required - actual).toFixed(1).replace(/\.0$/, '')} ${rule.unit}.`, evidence };
  }
};

export function validateRuleset(ruleset) {
  const errors = [];
  if (!ruleset || !ruleset.id || !ruleset.version) errors.push('ruleset needs id and version');
  for (const rule of (ruleset && ruleset.rules) || []) {
    if (!rule.key) errors.push('a rule is missing its key');
    if (!EVALUATORS[rule.type]) errors.push(`${rule.key}: unknown rule type "${rule.type}"`);
  }
  return errors;
}

// Hash of the exact inputs a run used, so the run can be reproduced and audited.
export function hashInputs(fields) {
  const normal = [...fields]
    .map(f => ({ docType: f.docType, field: f.field, value: f.value ?? null, page: f.page ?? null, confidence: f.confidence ?? null }))
    .sort((x, y) => fieldKey(x.docType, x.field).localeCompare(fieldKey(y.docType, y.field)));
  return createHash('sha256').update(canonicalize(normal)).digest('hex');
}

export function runPreflight({ applicationId, fields, ruleset, asOf = new Date() }) {
  const errors = validateRuleset(ruleset);
  if (errors.length) throw new Error(`Invalid ruleset: ${errors.join('; ')}`);

  const idx = indexFields(fields);
  const asOfDate = toDate(asOf.toISOString());
  const ctx = { asOf: asOfDate, asOfISO: asOfDate.toISOString().slice(0, 10), params: ruleset.parameters };
  const threshold = ruleset.parameters.lowConfidenceThreshold ?? 0.8;

  const findings = ruleset.rules.map(rule => {
    const res = EVALUATORS[rule.type](rule, idx, ctx);
    let { outcome, explanation } = res;

    // A decision built on a shaky extraction is not safe to make automatically.
    const shaky = lowConfidence(res.evidence, threshold);
    if (shaky.length && outcome !== 'NEEDS_REVIEW') {
      explanation += ` Low extraction confidence on ${shaky
        .map(e => `${e.docType}.${e.field} (${e.confidence})`)
        .join(', ')}: verify against the original document.`;
      outcome = 'NEEDS_REVIEW';
    }
    return {
      ruleKey: rule.key,
      title: rule.title,
      clauseRef: rule.clauseRef,
      severity: rule.severity,
      outcome,
      explanation,
      evidence: res.evidence
    };
  });

  const count = o => findings.filter(f => f.outcome === o).length;
  const criticalFail = findings.some(f => f.outcome === 'FAIL' && f.severity === 'critical');
  const anyOpen = findings.some(f => f.outcome !== 'PASS');

  return {
    applicationId,
    rulesetId: ruleset.id,
    rulesetVersion: ruleset.version,
    rulesetStatus: ruleset.status,
    asOf: ctx.asOfISO,
    inputHash: hashInputs(fields),
    summary: {
      total: findings.length,
      pass: count('PASS'),
      fail: count('FAIL'),
      needsReview: count('NEEDS_REVIEW')
    },
    // Readiness is advice for the institution/officer, never a statutory decision.
    readiness: criticalFail ? 'BLOCKED' : anyOpen ? 'REVIEW_REQUIRED' : 'READY',
    findings
  };
}
