# AICTE PRAGATI-NAV (APH-Flow 360)
### Unified Digital Platform for Approval Automation, CPU Scheduling & Compliance Monitoring

[![AICTE Approval Process Handbook 2024-27](https://img.shields.io/badge/AICTE-APH%202024--27-blue.svg)](https://www.aicte-india.org)
[![SIH Hackathon](https://img.shields.io/badge/SIH-Problem%20Solution-orange.svg)](https://sih.gov.in)
[![Architecture](https://img.shields.io/badge/Architecture-Frontend%20%7C%20Backend-brightgreen.svg)]()
[![Algorithm](https://img.shields.io/badge/Scheduling-Classical%20CPU%20Algorithms-purple.svg)]()

> **Regulatory Safeguard Notice:** AICTE PRAGATI-NAV operates in accordance with the AICTE Act, 1987 and Approval Process Handbook (APH) 2024–27. Automated recommendations, CPU dispatch sequences, and SLA deadline alerts assist statutory processing, while final verification, inspections, and regulatory decisions remain exclusively reserved for competent AICTE authorities.

---

## 📂 Repository Structure

```bash
Automation-System/
├── backend/                        # Express.js REST API & CPU Scheduling Service
│   ├── cpuScheduler.js             # Classical CPU algorithms (FCFS, SJF, Priority, RR)
│   ├── server.js                   # API endpoints & application store
│   └── package.json                # Backend dependencies (express, cors)
│
├── frontend/                       # Modern React + Vite Client Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx                  # National AICTE strip & 4-role switcher
│   │   │   ├── SimulationBar.jsx           # Real-time time travel & SLA escalation tester
│   │   │   ├── PendencyDashboard.jsx       # 8-Region matrix, stage funnel & KPI grid
│   │   │   ├── WorkflowAutomation.jsx      # APH routing engine & deficiency revert modals
│   │   │   ├── EvcHub.jsx                  # EVC panel scheduler & 48h report countdown
│   │   │   ├── UndertakingsTracker.jsx     # Conditional approvals & evidence verify portal
│   │   │   ├── LeaseValidityRadar.jsx      # 30-year land lease expiry & advance notices
│   │   │   ├── EscalationMatrix.jsx        # Multi-tier escalation & formal letter generator
│   │   │   ├── CpuSchedulerViewer.jsx      # Interactive CPU Scheduling & Gantt visualizer
│   │   │   ├── AuditTrailViewer.jsx        # SHA-256 cryptographically hashed audit ledger
│   │   │   ├── AphRuleConfigurator.jsx     # Policy SLA parameter tuner
│   │   │   ├── ApplicationDetailsModal.jsx # Full case file inspector
│   │   │   ├── CaseSummaryModal.jsx        # Official printable AICTE electronic dossier
│   │   │   └── NotificationsModal.jsx      # Automated alerts drawer
│   │   ├── data/mockData.js                # AICTE regional master data & state model
│   │   ├── utils/cpuScheduler.js           # Client-side CPU scheduling engine
│   │   ├── index.css                       # Hand-crafted Vanilla CSS design tokens
│   │   └── App.jsx                         # Main application state orchestration
│   ├── index.html                          # Official Google fonts & favicon
│   └── package.json                        # Frontend dependencies
│
├── .gitignore                      # Git ignore rules for node_modules, build & env
├── package.json                    # Root workspace runner scripts
└── README.md                       # Comprehensive documentation
```

---

## ⚡ CPU Scheduling Algorithm Integration

In high-volume AICTE approval cycles, Scrutiny Officers, EVC Expert Panels, and Regional Desks represent **processing cores / CPUs**, while incoming institutional applications represent **processes / jobs**.

AICTE PRAGATI-NAV integrates classical Operating System CPU Scheduling algorithms to optimize review throughput and eliminate administrative bottlenecks:

| CPU Scheduling Algorithm | Administrative Implementation in AICTE Workflows | Key Benefit |
| :--- | :--- | :--- |
| **Preemptive SLA Priority (EDF)** | Highest priority ($P1$) allocated to Level 3 Member Secretary escalations and critical lease breaches ($P2$). High-priority tasks **preempt** active officer queues. | Eliminates regulatory deadline defaults and stops SLA breaches before they escalate. |
| **Round Robin (RR, $Q = 2$ Days)** | Allocates equal time-slices (2 review days) across applicant institutions and regional offices. | Ensures fairness and prevents large multi-course applications from starving smaller diploma institutes. |
| **Shortest Job First (SJF / SRTF)** | Evaluates standard Extension of Approval (EoA) cases with shortest burst times ($2$ units) before complex multi-phase routes ($8$ units). | Minimizes Average Waiting Time (AWT) across technical institutions. |
| **First-Come, First-Served (FCFS)** | Strictly sequences review based on application lodgement timestamp. | Baseline transparency for chronological accountability. |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js v18+ (tested on Node v24)
- npm v9+

### 2. Backend Setup
```bash
cd backend
npm install
npm start
# Backend API runs on http://127.0.0.1:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Frontend application runs on http://127.0.0.1:5173
```

---

## 🎯 Evaluation Features

1. **Interactive Simulation Bar (Time Travel):**
   - Click `+1 Day`, `+3 Days`, or `+7 Days` to watch SLA clocks advance, badges flash, and Level 1/2/3 hierarchical escalations trigger in real time.
2. **CPU Scheduling Dashboard:**
   - Navigate to the **CPU Dispatcher** tab to compare Gantt charts, Average Waiting Times, and dispatch optimal sequences to regional officers.
3. **Role Switcher:**
   - Toggle between **AICTE Apex Bureau**, **Regional Officer (WRO Mumbai)**, **Committee Chairman (IIT Bombay)**, and **Institution Principal**.
4. **Electronic Case Summary Dossier:**
   - Click *Electronic Case Summary* to preview and print the official AICTE dossier with QR authentication badges and digital signature hashes.

---

## 📜 License & Compliance
Compliant with AICTE Approval Process Handbook (APH) 2024–27 regulations.
Developed for the Smart India Hackathon.
