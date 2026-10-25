import { randomUUID } from 'node:crypto';

const SESSION_COOKIE = 'govverify_demo_session';
const sessions = new Map();

const DEMO_INSTITUTION = {
  role: 'INSTITUTION',
  officer: 'Synthetic Institution Coordinator',
  designation: 'Synthetic Demo Institution Coordinator',
  badge: 'Institution (Synthetic Demo)',
  // This existing seeded identifier is synthetic demo data, not a production institution ID.
  institutionId: '1-748920141',
  instituteName: 'Synthetic Western Technical Institute',
  region: 'WRO'
};

const DEMO_BUREAU_HEAD = {
  role: 'BUREAU_HEAD',
  officer: 'Synthetic Bureau Head',
  designation: 'Synthetic Demo Bureau Head',
  badge: 'Bureau Head (Synthetic Demo)',
  region: 'ALL'
};

function buildProfile(role, region) {
  if (role === 'INSTITUTION') return { ...DEMO_INSTITUTION, isSynthetic: true };
  if (role === 'BUREAU_HEAD') return { ...DEMO_BUREAU_HEAD, isSynthetic: true };
  if (role === 'REGIONAL_OFFICER') {
    return {
      role,
      officer: `Synthetic Regional Officer (${region})`,
      designation: `Synthetic Demo Regional Officer, ${region}`,
      badge: `Regional Officer (${region}, Synthetic Demo)`,
      region,
      isSynthetic: true
    };
  }
  return null;
}

function readCookie(req, name) {
  const cookies = req.headers.cookie || '';
  const value = cookies
    .split(';')
    .map(part => part.trim())
    .find(part => part.startsWith(`${name}=`));
  return value ? decodeURIComponent(value.slice(name.length + 1)) : null;
}

export function createDemoSession({ role, region = 'WRO' } = {}) {
  const allowedRegions = new Set(['NRO', 'NWRO', 'WRO', 'SRO', 'SWRO', 'CRO', 'ERO', 'SCRO']);
  const selectedRegion = allowedRegions.has(region) ? region : 'WRO';
  const profile = buildProfile(role, selectedRegion);
  if (!profile) return null;

  const sessionId = randomUUID();
  sessions.set(sessionId, profile);
  return { sessionId, profile };
}

export function getDemoSession(req) {
  const sessionId = readCookie(req, SESSION_COOKIE);
  return sessionId ? sessions.get(sessionId) || null : null;
}

export function setDemoSessionCookie(res, sessionId) {
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${encodeURIComponent(sessionId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=28800`
  );
}

export function clearDemoSessionCookie(res) {
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

export function requireDemoSession(req, res, next) {
  const session = getDemoSession(req);
  if (!session) {
    return res.status(401).json({
      success: false,
      code: 'DEMO_SESSION_REQUIRED',
      message: 'Select a synthetic demo persona before reading applications.'
    });
  }
  req.demoSession = session;
  return next();
}

export { SESSION_COOKIE };
