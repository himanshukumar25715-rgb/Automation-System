# GovVerify
### Unified Digital Platform for AICTE Approval Automation, Compliance & Document Validity Monitoring

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React 19](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)
[![AICTE APH](https://img.shields.io/badge/AICTE-APH%202024--27-orange.svg)](https://www.aicte-india.org/)

---

## 📌 Executive Overview

**GovVerify** is an integrated, secure, and configurable regulatory governance platform designed to automate and monitor technical education approval workflows under the **AICTE Approval Process Handbook (APH) 2024–27**.

The platform resolves fragmented manual coordination across 8 AICTE Regional Offices by implementing automated stage transitions, 3-expert committee scheduling, strict time-bound undertaking tracking, 30-year registered land lease countdowns, and a 3-tier escalation ladder.

---

## 📄 Official Project Documentation

The complete project report and regulatory compliance manual is available in the root repository:
- **PDF Report**: [`AICTE_PRAGATI_NAV_Project_Documentation.pdf`](./AICTE_PRAGATI_NAV_Project_Documentation.pdf) *(Official 4-page ISO A4 PDF)*
- **Interactive HTML Report**: [`report.html`](./report.html) *(Print-ready responsive report)*

---

## 🚀 Key Functional Modules

| Module | Name | Key Capabilities |
| :--- | :--- | :--- |
| **Module A** | **Multi-Stage Approval Workflow Engine** | Automated state machine guiding applications through Scrutiny, EVC, SAC/SHC, and Council approval with deficiency revert mechanisms and official printable dossiers. |
| **Module B** | **Regional Pendency & SLA Monitoring Grid** | Real-time statutory SLA countdowns across all 8 AICTE Regional Offices (WRO, NRO, SWRO, SCRO, CRO, NWRO, ERO, SRO) with automated bottleneck flags. |
| **Module C** | **Automated EVC Scheduling Engine** | Multi-expert committee formulation (Senior Academician, Architect/Civil Expert, RO Representative) with autonomous conflict-of-interest checks and 48-hour report submission clocks. |
| **Module D** | **Time-Bound Undertakings & Compliance Ledger** | Tracks conditional approvals (faculty recruitment, endowment deposits, fire safety NOCs) with proof uploads and regional officer approval gates. |
| **Module E** | **30-Year Land Lease & Document Validity Radar** | 4-tier countdown (>180d, 90–180d, &le;90d, Expired) with automatic regulatory freeze preventing issuance of Extension of Approval (EoA) on lapsed deeds. |
| **Module F** | **3-Tier Automated Escalation Ladder** | Automated escalation on aging cases: **Level 1** (SLA+2d: SMS/Email to Principal), **Level 2** (SLA+5d: Formal Directive to Regional Officer), and **Level 3** (SLA+8d: Apex Docket to Member Secretary). |

---

## 🛡️ Role-Based Access Control (RBAC) Architecture

The platform implements strict permission boundaries across three distinct personas:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 RBAC PERMISSION MATRIX                                 │
├───────────────────────┬──────────────────────────┬─────────────────────────────────────┤
│ Role                  │ Scope                    │ Key Permissions                     │
├───────────────────────┼──────────────────────────┼─────────────────────────────────────┤
│ 1. Institution        │ Isolated to single       │ Track progress, upload evidence,    │
│    (Applicant)        │ institute record         │ respond to deficiencies, view alerts│
├───────────────────────┼──────────────────────────┼─────────────────────────────────────┤
│ 2. Regional Officer   │ Scoped to jurisdiction   │ Advance/revert stages, schedule EVC,│
│    (RO / Committee)   │ (e.g., WRO, SCRO)        │ verify undertakings, validate leases│
├───────────────────────┼──────────────────────────┼─────────────────────────────────────┤
│ 3. Bureau Head        │ Pan-India (All 8         │ National bottleneck heatmaps, SLA   │
│    (Apex Admin - HQ)  │ Regional Offices)        │ policy editor, apex escalations     │
└───────────────────────┴──────────────────────────┴─────────────────────────────────────┘
```

---

## 🛠️ Tech Stack & Design System

- **Frontend Core**: React 19, Vite, ES6+
- **Styling**: Tailored CSS design system with glassmorphism, micro-animations, and AICTE National Identity palette (Saffron `#FF6B00`, Deep Navy `#0F172A`, Emerald `#10B981`)
- **PDF Generation**: `pdf-lib` automated ISO A4 multi-page document generator with official headers, tables, callouts, and digital sign-off badges
- **Role Permissions**: `src/lib/permissions.js`, `usePermissions()` hook, and `<RequireRole>` wrapper

---

## 💻 Local Setup & Execution

### 1. Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 2. Install & Start Application
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
Open `http://localhost:5173` in your browser.

### Synthetic demo mode and current implementation boundary

The current vertical slice uses a server-created synthetic demo session and
SQLite-backed application reads. Institution, regional officer, and bureau-head
read scopes are enforced by the backend session, not by client query
parameters. The SQLite database is created at `backend/data/govverify.sqlite`
and can be overridden with `GOVVERIFY_DB_PATH`.

All seeded application records are labelled synthetic demo data. This slice is
not production authentication and does not use real institution records or
personal identifiers. Application workflow mutations, document uploads,
extraction, EVC checks, alerts, audit verification, QR/public status, and the
other tabs remain local prototype behavior until later implementation slices.

Run the focused backend checks with:

```bash
cd backend
npm run check:application-reads
```

### 3. Generate Official PDF Report
```bash
# Run the standalone PDF generator script
cd frontend
node generate_pdf.js
```
The output file `AICTE_PRAGATI_NAV_Project_Documentation.pdf` will be created in the repository root.

---

## 🔗 National e-Governance Integrations (Architecture Ready)

1. **DigiLocker Integration**: Automated retrieval and verification of institutional registration and accreditation certificates.
2. **State Land Records Bridge**: Integration with Bhoomi, MahaBhulekh, and BanglarBhumi to detect land encumbrances and verify 30-year lease deeds.
3. **e-Sign & Aadhaar OTP**: Legal validity for affidavits, compliance undertakings, and EVC inspection reports under Section 3A of the IT Act.
4. **National SMS & Email Gateway**: Timely automated escalation dispatches via CDAC infrastructure.

---

## 👥 Authors & Hackathon Team
Developed for the **Smart India Hackathon (SIH)** — Problem Statement: Automated AICTE Approval & Compliance Monitoring Platform.
