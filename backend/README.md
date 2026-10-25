# AICTE PRAGATI-NAV Backend REST API Server

REST API and statutory state machine for the **AICTE PRAGATI-NAV (APH-Flow 360)** Approval Automation and Compliance Platform.

---

## 🚀 Getting Started

### 1. Installation
```bash
cd backend
npm install
```

### 2. Run in Development Mode
```bash
npm run dev
```
Server runs at `http://localhost:5000` with automated reload on file changes.

### 3. Run the tests
```bash
npm test
```
`api.test.js` starts the real Express app on a random port; the other suites test the services and the store directly.

### 4. Run in Production
```bash
npm start
```

The local demo uses Node 22's built-in SQLite support. By default it creates
`backend/data/govverify.sqlite`; override the location with `GOVVERIFY_DB_PATH`.
Seed application records are inserted idempotently and are marked as synthetic
demo data. The application read endpoints require a synthetic demo session.

Focused read-slice check:

```bash
npm run check:application-reads
```

This verifies institution, regional officer, and bureau-head read scopes,
query-parameter isolation, and availability after a backend restart. The demo
session is not production authentication.

---

### Environment variables (all optional for the demo)
| Variable | Purpose |
| :--- | :--- |
| `PORT` | Server port (default `5000`). |
| `FINGERPRINT_SECRET` | Secret key for faculty identity fingerprints. If unset, a random one is generated per run (fine for the demo only). |
| `DEMO_AS_OF` | Fixed date (e.g. `2026-10-25`) used by pre-flight date checks, for repeatable demos. Defaults to today. |
| `ENABLE_DEMO_TOOLS` | Set to `false` to disable the demo tamper/reset routes. They are always off when `NODE_ENV=production`. |

---

## 📡 REST API Reference

### System & Health
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check endpoint returning uptime and service status. |

### Module A: Applications & Approval Workflow
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/applications` | Read applications within the active synthetic demo session scope. |
| `GET` | `/api/applications/:id` | Get an in-scope application dossier by ID. |
| `POST` | `/api/applications/:id/advance` | Advance application to next prescribed APH stage. |
| `POST` | `/api/applications/:id/revert` | Return application with deficiency clause and start 7-day cure clock. |
| `POST` | `/api/applications/:id/deficiency/:defId/remedy` | Submit institution remedy response evidence. |

### Module C: Expert Visit Committee (EVC)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/evc/experts` | Fetch AICTE approved expert pool with affiliations. |
| `POST` | `/api/evc/schedule` | Schedule 3-member EVC committee and initialize 48-hour clock. |
| `POST` | `/api/evc/:id/report` | Upload geo-tagged inspection report and committee sign-off. |

### Module D: Time-Bound Undertakings
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/undertakings` | List institutional compliance undertakings and due dates. |
| `POST` | `/api/undertakings/:id/evidence` | Institution uploads compliance evidence. |
| `POST` | `/api/undertakings/:id/verify` | Regional Officer marks undertaking compliant or non-compliant. |

### Module E: 30-Year Land Lease & Document Validity Radar
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/leases` | Fetch 30-year land lease deeds and fire safety NOC validity records. |
| `POST` | `/api/leases/:docNo/renew` | Upload renewed registered extension deed. |

### Module F: Escalation Matrix & SLA Monitoring
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/escalations` | List active Tier 1, 2, and 3 automated statutory escalations. |
| `GET` | `/api/regions` | Get workload, aging days, and health status for all 8 Regional Offices. |

### Integrity & Compliance (new)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/audit/verify` | Recomputes the SHA-256 hash chain. Returns `VALID` (with `headHash`) or `BROKEN` with the `firstBrokenSeq`. |
| `GET` | `/api/audit/events` | Requires a demo session and an authorized `applicationId`; optional `limit` and `offset`. Missing/invalid ID returns a validation error; unknown or out-of-scope applications return 404. Event totals are scoped to that application. |
| `POST` | `/api/audit/demo/tamper` | **Demo only.** Body `{ "seq": 4 }` edits an event without recomputing hashes so `verify` can show detection. |
| `POST` | `/api/audit/demo/reset` | **Demo only.** Rebuilds all in-memory state from seed data. Both demo routes are disabled when `NODE_ENV=production`. |
| `GET` | `/api/rules/active` | The rule set in force (id, version, parameters, DEMO notice). |
| `POST` | `/api/applications/:id/preflight` | Runs the versioned rules on the latest version of the extracted data. Returns findings with rule key, clause ref, severity, outcome, compared values and source pages. |
| `GET` | `/api/applications/:id/findings` | Requires a demo session with access to the application. Findings from the latest run. Query: `severity`, `outcome`, `ruleKey`. |
| `GET` | `/api/applications/:id/versions` | Requires a demo session with access to the application. Every submitted version (hash, time, note). |
| `POST` | `/api/applications/:id/resubmit` | Body `{ "fields": [{ "docType", "field", "value", "page?", "confidence?" }], "note?" }`. Fields are a **patch** over the last version (`value: null` removes one). Returns the field diff, which findings were resolved / newly raised / still open, and the new run. |
| `GET` | `/api/faculty/conflicts` | Ghost Faculty Detector candidates, masked. Query: `institutionId`, `status` (`OPEN`, `DISMISSED`, `CONFIRMED_FOR_REVIEW`). |
| `GET` | `/api/faculty/records` | Masked faculty records. |
| `POST` | `/api/faculty/records` | Add a record `{ institutionId, name, identifier, role?, employmentType?, startDate, endDate? }`. The identifier is fingerprinted immediately and never stored or echoed. |
| `POST` | `/api/faculty/conflicts/:id/disposition` | Body `{ "decision": "DISMISSED" \| "CONFIRMED_FOR_REVIEW", "reason": "..." }`. A reason is mandatory and the action is audited. |

New endpoints return structured errors: `{ success:false, code, message, fieldErrors?, requestId }`.

These protections cover the three reads documented above only; other application and audit routes require separate authorization review.

#### How the new pieces behave (be ready to explain these to judges)
- **Audit chain:** every workflow action appends an event whose hash covers the previous event's hash, so editing any earlier event breaks everything after it. This is a *tamper-evident hash chain*, not a blockchain: someone who can rewrite the whole store and recompute every hash can still forge it, and deleting the last events is only detectable if `headHash` was recorded somewhere else.
- **Pre-flight rules:** deterministic JSON rules (`src/data/rulesets/aph-demo-v1.json`), no AI involved. Outcomes are `PASS`, `FAIL` or `NEEDS_REVIEW` (low extraction confidence, date close to expiry). The engine reports *readiness* (`READY`, `REVIEW_REQUIRED`, `BLOCKED`); it never approves or rejects. **Rule parameters and clause references are demo placeholders, not official AICTE norms.**
- **Ghost Faculty Detector:** identifiers become keyed HMAC-SHA-256 fingerprints; names are masked; output is a *candidate for human verification*, not an accusation. Demo data is synthetic. Set `FINGERPRINT_SECRET` outside the demo.
- **Seeded demo cases:** `APP-2026-SCRO-4421` is clean (READY); `APP-2026-WRO-1049` and `APP-2026-ERO-7834` need review (documents near expiry); `APP-2026-NRO-8821` is deliberately inconsistent (BLOCKED); `APP-2026-CRO-3310` is missing a document (BLOCKED).

#### Demo sequence
1. `POST /api/audit/demo/reset`, then `GET /api/audit/verify` -> `VALID`.
2. `POST /api/applications/APP-2026-NRO-8821/preflight` -> `BLOCKED`, with land area 8000 vs 9200 and the source pages.
3. `POST /api/applications/APP-2026-NRO-8821/resubmit` with `{ "note": "Corrected", "fields": [{ "docType": "LAND_LEASE", "field": "landAreaSqm", "value": 9200, "page": 2 }, { "docType": "APPLICATION_FORM", "field": "sanctionedIntake", "value": 180, "page": 3 }] }` -> shows what changed and which findings were resolved.
4. `GET /api/faculty/conflicts` -> one high-severity candidate; `POST .../disposition` with a reason.
5. `POST /api/audit/demo/tamper` with `{ "seq": 4 }`, then `GET /api/audit/verify` -> `BROKEN` at sequence 4.

### Governance, Integrations & Reports
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/auth/roles` | RBAC role definitions (Institution, Regional Officer, Bureau Head). |
| `POST` | `/api/auth/demo-session` | Start an explicitly labelled synthetic demo session. |
| `GET` | `/api/auth/demo-session` | Read the active synthetic demo session. |
| `DELETE` | `/api/auth/demo-session` | Clear the synthetic demo session. |
| `GET` | `/api/integrations` | Real-time connectivity status of DigiLocker, Land Records, e-Sign & SMS. |
| `POST` | `/api/integrations/:id/sync` | Trigger verification sync with national e-Gov APIs. |
| `GET` | `/api/reports/summary` | High-level national approval metrics and statutory compliance rate. |
| `GET` | `/api/reports/pdf` | Download the official ISO A4 project documentation PDF. |

---

## 📁 Architecture Directory Structure

```
backend/
├── package.json
├── app.js                 # Express app (routes + middleware), importable by tests
├── server.js              # Starts the server on PORT
├── test/                  # node:test suites (npm test)
├── README.md              # Backend documentation
└── src/
    ├── config/
    │   └── constants.js   # Regional codes, SLA thresholds, workflow routes
    ├── services/          # Pure logic: auditChain, rulesEngine, diff, facultyDetector
    ├── utils/http.js      # Structured error helper
    ├── data/
    │   ├── rulesets/      # Versioned rule definitions (JSON)
    │   ├── preflightSeed.js / facultySeed.js  # Synthetic demo inputs
    │   ├── initialData.js # Seed data for institutions, experts, and applications
    │   └── store.js       # In-memory database with state machine mutators
    ├── middleware/
    │   └── logger.js      # HTTP request logger & centralized error handler
    └── routes/
        ├── applications.js # Stage transitions & deficiency workflows
        ├── audit.js        # Hash-chain verify, events, demo tamper/reset
        ├── faculty.js      # Ghost Faculty Detector
        ├── rules.js        # Active rule set
        ├── auth.js         # RBAC personas & permission matrices
        ├── escalations.js  # 3-tier SLA escalation queries
        ├── evc.js          # Expert assignment & 48-hour report upload
        ├── integrations.js # DigiLocker & Land Registry mock bridges
        ├── leases.js       # 30-year deed validity countdowns & renewals
        ├── regions.js      # 8 regional office workload & heatmap analytics
        ├── reports.js      # National statistics & PDF report distribution
        └── undertakings.js # Compliance evidence & verification
```
