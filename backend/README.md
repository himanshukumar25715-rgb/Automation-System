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

### 3. Run in Production
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
├── server.js              # Express app entrypoint & middleware setup
├── README.md              # Backend documentation
└── src/
    ├── config/
    │   └── constants.js   # Regional codes, SLA thresholds, workflow routes
    ├── data/
    │   ├── initialData.js # Seed data for institutions, experts, and applications
    │   └── store.js       # In-memory database with state machine mutators
    ├── middleware/
    │   └── logger.js      # HTTP request logger & centralized error handler
    └── routes/
        ├── applications.js # Stage transitions & deficiency workflows
        ├── auth.js         # RBAC personas & permission matrices
        ├── escalations.js  # 3-tier SLA escalation queries
        ├── evc.js          # Expert assignment & 48-hour report upload
        ├── integrations.js # DigiLocker & Land Registry mock bridges
        ├── leases.js       # 30-year deed validity countdowns & renewals
        ├── regions.js      # 8 regional office workload & heatmap analytics
        ├── reports.js      # National statistics & PDF report distribution
        └── undertakings.js # Compliance evidence & verification
```
