import { test, before, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

process.env.NODE_ENV = 'test';
const testDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'govverify-read-auth-'));
process.env.GOVVERIFY_DB_PATH = path.join(testDirectory, 'isolated.sqlite');

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

beforeEach(() => db.init());

after(async () => {
  await new Promise(resolve => server.close(resolve));
  db.sqlite.close();
  fs.rmSync(testDirectory, { recursive: true, force: true });
});

async function request(method, pathname, { body, cookie } = {}) {
  const response = await fetch(`${base}${pathname}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(cookie ? { Cookie: cookie } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  return { status: response.status, body: await response.json() };
}

async function sessionCookie(role, region) {
  const response = await fetch(`${base}/api/auth/demo-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, region })
  });
  assert.equal(response.status, 200);
  return (response.headers.get('set-cookie') || '').split(';')[0];
}

function stateSnapshot() {
  return {
    applications: JSON.stringify(db.applications),
    auditEvents: JSON.stringify(db.auditChain.events),
    auditLogs: JSON.stringify(db.auditLogs),
    fieldVersions: JSON.stringify(db.fieldVersions),
    ruleRuns: JSON.stringify(db.ruleRuns)
  };
}

const ownApp = 'APP-2026-WRO-1049';
const otherInstitutionApp = 'APP-2026-NRO-8821';

test('all three reads deny requests without a demo session', async () => {
  for (const pathname of [
    `/api/applications/${ownApp}/findings`,
    `/api/applications/${ownApp}/versions`,
    `/api/audit/events?applicationId=${ownApp}`
  ]) {
    const result = await request('GET', pathname);
    assert.equal(result.status, 401, pathname);
    assert.equal(result.body.code, 'DEMO_SESSION_REQUIRED', pathname);
  }
});

test('institution reads its own findings, versions, and audit events but cannot read another institution', async () => {
  const cookie = await sessionCookie('INSTITUTION');

  const findings = await request('GET', `/api/applications/${ownApp}/findings`, { cookie });
  assert.equal(findings.status, 200);
  assert.ok(Array.isArray(findings.body.data.findings));
  const versions = await request('GET', `/api/applications/${ownApp}/versions`, { cookie });
  assert.equal(versions.status, 200);
  assert.equal(versions.body.count, 1);
  const audit = await request('GET', `/api/audit/events?applicationId=${ownApp}`, { cookie });
  assert.equal(audit.status, 200);
  assert.ok(audit.body.data.every(event => event.applicationId === ownApp));
  assert.deepEqual(Object.keys(audit.body.data[0]).sort(), ['action', 'actor', 'applicationId', 'date', 'hash', 'prevHash', 'seq']);
  assert.equal(audit.body.total, db.auditChain.events.filter(event => event.applicationId === ownApp).length);

  const escalationQuery = '?region=ALL&institutionId=1-992384110&actor=BUREAU_HEAD';
  for (const pathname of [
    `/api/applications/${otherInstitutionApp}/findings${escalationQuery}`,
    `/api/applications/${otherInstitutionApp}/versions${escalationQuery}`,
    `/api/audit/events?applicationId=${otherInstitutionApp}&region=ALL&institutionId=1-748920141&actor=BUREAU_HEAD`
  ]) {
    const denied = await request('GET', pathname, { cookie });
    assert.equal(denied.status, 404, pathname);
    assert.equal(denied.body.code, 'APPLICATION_NOT_FOUND', pathname);
  }
});

test('regional officer reads only applications in the session region', async () => {
  const cookie = await sessionCookie('REGIONAL_OFFICER', 'WRO');
  assert.equal((await request('GET', `/api/applications/${ownApp}/findings`, { cookie })).status, 200);
  assert.equal((await request('GET', `/api/applications/${ownApp}/versions`, { cookie })).status, 200);
  assert.equal((await request('GET', `/api/audit/events?applicationId=${ownApp}`, { cookie })).status, 200);

  for (const pathname of [
    `/api/applications/${otherInstitutionApp}/findings?region=ALL`,
    `/api/applications/${otherInstitutionApp}/versions?region=ALL`,
    `/api/audit/events?applicationId=${otherInstitutionApp}&region=ALL`
  ]) {
    assert.equal((await request('GET', pathname, { cookie })).status, 404, pathname);
  }
});

test('bureau head reads findings, versions, and events for any seeded application', async () => {
  const cookie = await sessionCookie('BUREAU_HEAD');
  assert.equal((await request('GET', `/api/applications/${otherInstitutionApp}/findings`, { cookie })).status, 200);
  assert.equal((await request('GET', `/api/applications/APP-2026-SCRO-4421/versions`, { cookie })).status, 200);
  const audit = await request('GET', `/api/audit/events?applicationId=${otherInstitutionApp}`, { cookie });
  assert.equal(audit.status, 200);
  assert.ok(audit.body.data.every(event => event.applicationId === otherInstitutionApp));
});

test('unknown IDs are hidden as 404 and client-supplied scope fields cannot widen reads', async () => {
  const cookie = await sessionCookie('INSTITUTION');
  for (const pathname of [
    '/api/applications/UNKNOWN/findings?region=ALL&institutionId=1-748920141',
    '/api/applications/UNKNOWN/versions?region=ALL&institutionId=1-748920141',
    '/api/audit/events?applicationId=UNKNOWN&region=ALL&institutionId=1-748920141'
  ]) {
    assert.equal((await request('GET', pathname, { cookie })).status, 404, pathname);
  }
  const repeatedApplicationId = await request('GET', `/api/audit/events?applicationId=${ownApp}&applicationId=${otherInstitutionApp}`, { cookie });
  assert.equal(repeatedApplicationId.status, 400);
  assert.equal(repeatedApplicationId.body.code, 'VALIDATION_ERROR');
});

test('audit event reads require applicationId and never disclose global totals', async () => {
  const cookie = await sessionCookie('BUREAU_HEAD');
  const missing = await request('GET', '/api/audit/events', { cookie });
  assert.equal(missing.status, 400);
  assert.equal(missing.body.code, 'VALIDATION_ERROR');
  assert.ok(missing.body.fieldErrors.applicationId);
  assert.equal(Object.hasOwn(missing.body, 'total'), false);
  assert.equal(Object.hasOwn(missing.body, 'count'), false);

  const noSession = await request('GET', '/api/audit/events');
  assert.equal(noSession.status, 401, 'session validation runs before applicationId validation');
});

test('denied reads do not create versions, rule runs, audit events, or other state changes', async () => {
  const cookie = await sessionCookie('INSTITUTION');
  const before = stateSnapshot();
  const results = await Promise.all([
    request('GET', `/api/applications/${otherInstitutionApp}/findings`, { cookie }),
    request('GET', `/api/applications/${otherInstitutionApp}/versions`, { cookie }),
    request('GET', `/api/audit/events?applicationId=${otherInstitutionApp}`, { cookie }),
    request('GET', '/api/applications/UNKNOWN/findings', { cookie }),
    request('GET', '/api/applications/UNKNOWN/versions', { cookie }),
    request('GET', '/api/audit/events?applicationId=UNKNOWN', { cookie })
  ]);
  assert.ok(results.every(result => result.status === 404));
  assert.deepEqual(stateSnapshot(), before);
});
