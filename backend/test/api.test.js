import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV = 'test';
const { default: app } = await import('../app.js');
const { db } = await import('../src/data/store.js');

let server;
let base;
before(async () => {
  await new Promise(resolve => {
    server = app.listen(0, () => {
      base = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});
after(() => server.close());

const call = async (method, path, body, extraHeaders = {}) => {
  const res = await fetch(base + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
    body: body ? JSON.stringify(body) : undefined
  });
  return { status: res.status, body: await res.json(), headers: res.headers };
};
const reset = () => call('POST', '/api/audit/demo/reset');
const AS_OF = '2026-10-25';

test('AUDIT: seeded chain verifies; tamper is detected at the exact seq; reset restores it', async () => {
  await reset();
  assert.equal((await call('GET', '/api/audit/verify')).body.status, 'VALID');
  const t = await call('POST', '/api/audit/demo/tamper', { seq: 4 });
  assert.equal(t.status, 200);
  const v = (await call('GET', '/api/audit/verify')).body;
  assert.equal(v.status, 'BROKEN');
  assert.equal(v.firstBrokenSeq, 4);
  await reset();
  assert.equal((await call('GET', '/api/audit/verify')).body.status, 'VALID');
});

test('AUDIT: workflow actions create real chained events (no more random hashes)', async () => {
  await reset();
  const before = db.auditChain.events.length;
  const r = await call('POST', '/api/applications/APP-2026-NRO-8821/advance', { remarks: 'ok', actor: 'RO NRO' });
  assert.equal(r.status, 200);
  assert.equal(db.auditChain.events.length, before + 1);
  const trail = r.body.data.auditTrail;
  const last = trail[trail.length - 1];
  assert.match(last.hash, /^sha256-[0-9a-f]{12}$/);
  assert.equal(last.eventHash, db.auditChain.events.at(-1).hash);
  assert.equal((await call('GET', '/api/audit/verify')).body.status, 'VALID');
});

test('PREFLIGHT: inconsistent case is BLOCKED with evidence; unknown app is a structured 404', async () => {
  await reset();
  const r = await call('POST', '/api/applications/APP-2026-NRO-8821/preflight');
  assert.equal(r.body.data.readiness, 'BLOCKED');
  const f = await call('GET', '/api/applications/APP-2026-NRO-8821/findings?outcome=FAIL&severity=critical');
  assert.ok(f.body.data.findings.length >= 1);
  assert.ok(f.body.data.findings.every(x => x.outcome === 'FAIL' && x.severity === 'critical'));
  const nf = await call('POST', '/api/applications/NOPE/preflight');
  assert.equal(nf.status, 404);
  assert.equal(nf.body.code, 'APPLICATION_NOT_FOUND');
  assert.ok(nf.body.requestId);
});

test('RESUBMIT: corrected values produce a field diff, resolve findings, and are audited', async () => {
  await reset();
  const id = 'APP-2026-NRO-8821';
  await call('POST', `/api/applications/${id}/preflight`);
  const r = await call('POST', `/api/applications/${id}/resubmit`, {
    note: 'Corrected area and intake',
    fields: [
      { docType: 'LAND_LEASE', field: 'landAreaSqm', value: 9200, page: 2 },
      { docType: 'APPLICATION_FORM', field: 'sanctionedIntake', value: 180, page: 3 }
    ]
  });
  assert.equal(r.status, 200);
  const d = r.body.data;
  assert.equal(d.version, 2);
  assert.equal(d.fieldDiff.changed.length, 2);
  assert.deepEqual(d.fieldDiff.changed.map(c => c.key).sort(), ['APPLICATION_FORM.sanctionedIntake', 'LAND_LEASE.landAreaSqm']);
  const resolved = d.findingDiff.resolved.map(x => x.ruleKey);
  assert.ok(resolved.includes('R-XDOC-LAND-01'));
  assert.ok(resolved.includes('R-XDOC-INTAKE-01'));
  const versions = await call('GET', `/api/applications/${id}/versions`);
  assert.equal(versions.body.count, 2);
  assert.notEqual(versions.body.data[0].fieldsHash, versions.body.data[1].fieldsHash);
  assert.equal((await call('GET', '/api/audit/verify')).body.status, 'VALID');
});

test('RESUBMIT: an unchanged value reports no change; a bad payload is rejected with field errors', async () => {
  await reset();
  const id = 'APP-2026-SCRO-4421';
  const same = await call('POST', `/api/applications/${id}/resubmit`, { fields: [{ docType: 'LAND_LEASE', field: 'landAreaSqm', value: 10000 }] });
  assert.equal(same.body.data.fieldDiff.totalChanges, 0);
  const bad = await call('POST', `/api/applications/${id}/resubmit`, { fields: [{ docType: '', field: 'x', confidence: 5 }] });
  assert.equal(bad.status, 400);
  assert.equal(bad.body.code, 'VALIDATION_ERROR');
  assert.ok(bad.body.fieldErrors['fields[0].docType']);
  assert.ok(bad.body.fieldErrors['fields[0].confidence']);
});

test('FACULTY: conflicts API is masked; disposition needs a reason and is audited', async () => {
  await reset();
  const list = await call('GET', '/api/faculty/conflicts');
  assert.equal(list.body.syntheticDemoData, true);
  const text = JSON.stringify(list.body);
  assert.equal(text.includes('SYN-FAC'), false);
  assert.equal(text.includes('Aarav'), false);
  const high = list.body.data.find(c => c.severity === 'high');
  assert.equal(high.status, 'OPEN');

  const noReason = await call('POST', `/api/faculty/conflicts/${high.id}/disposition`, { decision: 'DISMISSED' });
  assert.equal(noReason.status, 400);
  assert.ok(noReason.body.fieldErrors.reason);

  const before = db.auditChain.events.length;
  const ok = await call('POST', `/api/faculty/conflicts/${high.id}/disposition`, { decision: 'CONFIRMED_FOR_REVIEW', reason: 'Payroll records show both appointments', actor: 'RO WRO' });
  assert.equal(ok.status, 200);
  assert.equal(ok.body.data.status, 'CONFIRMED_FOR_REVIEW');
  assert.equal(db.auditChain.events.length, before + 1);
  const filtered = await call('GET', '/api/faculty/conflicts?status=OPEN');
  assert.equal(filtered.body.data.some(c => c.id === high.id), false);
  assert.equal((await call('POST', '/api/faculty/conflicts/NOPE/disposition', { decision: 'DISMISSED', reason: 'whatever it is' })).status, 404);
});

test('FACULTY: ingesting a record never echoes the identifier; creating an overlap yields a new candidate', async () => {
  await reset();
  const before = (await call('GET', '/api/faculty/conflicts')).body.count;
  const r = await call('POST', '/api/faculty/records', { institutionId: '1-120938445', name: 'Imran Qureshi', identifier: 'SYN-FAC-0005', startDate: '2024-01-01' });
  assert.equal(r.status, 201);
  assert.equal(JSON.stringify(r.body).includes('SYN-FAC-0005'), false);
  assert.equal((await call('GET', '/api/faculty/conflicts')).body.count, before + 1);
  const bad = await call('POST', '/api/faculty/records', { name: 'x' });
  assert.equal(bad.status, 400);
});

test('EXISTING ENDPOINTS: original routes still work', async () => {
  await reset();
  assert.equal((await call('GET', '/api/health')).status, 200);
  const session = await call('POST', '/api/auth/demo-session', { role: 'BUREAU_HEAD' });
  const cookie = session.headers.get('set-cookie').split(';')[0];
  const apps = await call('GET', '/api/applications', undefined, { Cookie: cookie });
  assert.equal(apps.body.count, 5);
  assert.equal((await call('GET', '/api/regions')).status, 200);
  assert.equal((await call('GET', '/api/escalations')).status, 200);
});
