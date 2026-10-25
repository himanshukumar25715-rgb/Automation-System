import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { initialApplications } from '../src/data/initialData.js';

const port = 5317;
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'govverify-read-slice-'));
const dbPath = path.join(tempDir, 'demo.sqlite');
let server;

function cookieFrom(response) {
  const value = response.headers.get('set-cookie') || '';
  return value.split(';')[0];
}

async function request(pathname, options = {}) {
  const response = await fetch(`http://127.0.0.1:${port}${pathname}`, {
    ...options,
    headers: {
      ...(options.headers || {})
    }
  });
  const body = await response.json().catch(() => ({}));
  return { response, body };
}

async function waitForHealth() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const result = await request('/api/health');
      if (result.response.ok) return;
    } catch {
      // The child process may still be starting.
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('Backend did not become healthy in time.');
}

function startServer() {
  server = spawn(process.execPath, ['server.js'], {
    cwd: path.resolve(import.meta.dirname, '..'),
    env: { ...process.env, PORT: String(port), GOVVERIFY_DB_PATH: dbPath },
    stdio: ['ignore', 'ignore', 'pipe']
  });
  return waitForHealth();
}

function stopServer() {
  if (!server || server.exitCode !== null || server.signalCode) {
    server = null;
    return Promise.resolve();
  }
  return new Promise(resolve => {
    const finish = () => {
      server = null;
      resolve();
    };
    server.once('exit', finish);
    server.kill('SIGTERM');
    setTimeout(finish, 1000);
  });
}

async function createSession(role, region) {
  const result = await request('/api/auth/demo-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, region })
  });
  assert.equal(result.response.status, 200, `session creation failed for ${role}`);
  return cookieFrom(result.response);
}

async function readApplications(cookie, query = '') {
  return request(`/api/applications${query}`, { headers: { Cookie: cookie } });
}

async function readApplicationDetail(cookie, id, query = '') {
  return request(`/api/applications/${encodeURIComponent(id)}${query}`, { headers: { Cookie: cookie } });
}

try {
  await startServer();

  let result = await request('/api/applications');
  assert.equal(result.response.status, 401, 'application list must require a demo session');
  result = await request('/api/applications/APP-2026-WRO-1049');
  assert.equal(result.response.status, 401, 'application detail must require a demo session');

  const institutionCookie = await createSession('INSTITUTION');
  result = await readApplications(institutionCookie, '?region=ALL&institutionId=not-my-institution');
  assert.equal(result.response.status, 200);
  assert.equal(result.body.count, 1, 'institution scope should return only its seeded application');
  assert.ok(result.body.data.every(app => app.isSynthetic === true), 'application records must be labelled synthetic');
  assert.ok(result.body.data.every(app => app.instituteId === '1-748920141'));

  result = await readApplicationDetail(institutionCookie, 'APP-2026-WRO-1049', '?region=NRO&institutionId=not-my-institution');
  assert.equal(result.response.status, 200, 'institution must fetch its application despite widening query values');
  assert.equal(result.body.data.id, 'APP-2026-WRO-1049');

  result = await readApplicationDetail(institutionCookie, 'APP-2026-NRO-8821', '?region=ALL&institutionId=1-748920141');
  assert.equal(result.response.status, 404, 'institution must not fetch another institution application');

  const regionalCookie = await createSession('REGIONAL_OFFICER', 'WRO');
  result = await readApplications(regionalCookie, '?region=ALL&institutionId=not-my-institution');
  assert.equal(result.response.status, 200);
  assert.ok(result.body.data.every(app => app.region === 'WRO'), 'regional scope must be server-enforced');

  result = await readApplicationDetail(regionalCookie, 'APP-2026-WRO-1049', '?region=NRO&institutionId=not-my-institution');
  assert.equal(result.response.status, 200, 'regional officer must fetch an application in the assigned region');
  result = await readApplicationDetail(regionalCookie, 'APP-2026-NRO-8821', '?region=ALL&institutionId=not-my-institution');
  assert.equal(result.response.status, 404, 'regional officer must not fetch an application outside the assigned region');

  const bureauCookie = await createSession('BUREAU_HEAD');
  result = await readApplications(bureauCookie, '?region=NONE&institutionId=not-my-institution');
  assert.equal(result.response.status, 200);
  assert.equal(result.body.count, initialApplications.length, 'bureau head should read all seeded applications');

  result = await readApplicationDetail(bureauCookie, 'APP-2026-SCRO-4421', '?region=NONE&institutionId=not-my-institution');
  assert.equal(result.response.status, 200, 'bureau head must fetch an application from any region');
  assert.equal(result.body.data.id, 'APP-2026-SCRO-4421');

  await stopServer();
  await startServer();
  const restartedCookie = await createSession('BUREAU_HEAD');
  result = await readApplications(restartedCookie);
  assert.equal(result.body.count, initialApplications.length, 'seeded applications must remain after restart');

  console.log('Application read slice checks passed.');
} finally {
  await stopServer();
  fs.rmSync(tempDir, { recursive: true, force: true });
}
