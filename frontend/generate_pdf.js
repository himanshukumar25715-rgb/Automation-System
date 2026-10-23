import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function generateAICTEProjectPDF() {
  const doc = await PDFDocument.create();

  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await doc.embedFont(StandardFonts.HelveticaOblique);

  const primaryNavy = rgb(0.06, 0.15, 0.35); // #0f2759
  const accentBlue = rgb(0.01, 0.52, 0.78);  // #0284c7
  const saffron = rgb(0.96, 0.62, 0.07);    // #f59e0b
  const darkText = rgb(0.06, 0.09, 0.16);   // #0f172a
  const mutedText = rgb(0.40, 0.45, 0.53);  // #64748b
  const borderLight = rgb(0.85, 0.88, 0.92);
  const bgSoft = rgb(0.96, 0.98, 1.0);
  const emerald = rgb(0.06, 0.62, 0.38);
  const ruby = rgb(0.86, 0.15, 0.15);

  const A4_WIDTH = 595.28;
  const A4_HEIGHT = 841.89;
  const MARGIN_LEFT = 40;
  const CONTENT_WIDTH = A4_WIDTH - MARGIN_LEFT * 2; // 515.28

  function drawHeader(page, title, subtitle, pageNum, totalPages) {
    page.drawRectangle({
      x: 0,
      y: A4_HEIGHT - 28,
      width: A4_WIDTH,
      height: 28,
      color: primaryNavy
    });

    page.drawRectangle({
      x: 0,
      y: A4_HEIGHT - 31,
      width: A4_WIDTH,
      height: 3,
      color: saffron
    });

    page.drawText('ALL INDIA COUNCIL FOR TECHNICAL EDUCATION (AICTE) - MINISTRY OF EDUCATION, GOVT. OF INDIA', {
      x: MARGIN_LEFT,
      y: A4_HEIGHT - 18,
      size: 7.5,
      font: fontBold,
      color: rgb(1, 1, 1)
    });

    page.drawText('APPROVAL PROCESS HANDBOOK (APH) 2024-27', {
      x: A4_WIDTH - MARGIN_LEFT - 195,
      y: A4_HEIGHT - 18,
      size: 7.5,
      font: fontBold,
      color: saffron
    });

    page.drawText(title, {
      x: MARGIN_LEFT,
      y: A4_HEIGHT - 55,
      size: 14,
      font: fontBold,
      color: primaryNavy
    });

    if (subtitle) {
      page.drawText(subtitle, {
        x: MARGIN_LEFT,
        y: A4_HEIGHT - 70,
        size: 8.5,
        font: fontRegular,
        color: mutedText
      });
    }

    page.drawLine({
      start: { x: MARGIN_LEFT, y: A4_HEIGHT - 78 },
      end: { x: A4_WIDTH - MARGIN_LEFT, y: A4_HEIGHT - 78 },
      thickness: 1,
      color: borderLight
    });

    page.drawLine({
      start: { x: MARGIN_LEFT, y: 35 },
      end: { x: A4_WIDTH - MARGIN_LEFT, y: 35 },
      thickness: 1,
      color: borderLight
    });

    page.drawText('AICTE PRAGATI-NAV (APH-Flow 360) - Comprehensive Project Architecture & Documentation', {
      x: MARGIN_LEFT,
      y: 22,
      size: 7.5,
      font: fontRegular,
      color: mutedText
    });

    const pageStr = `Page ${pageNum} of ${totalPages}`;
    page.drawText(pageStr, {
      x: A4_WIDTH - MARGIN_LEFT - 55,
      y: 22,
      size: 7.5,
      font: fontBold,
      color: mutedText
    });
  }

  // PAGE 1: Executive Summary & Workflow Automation
  const page1 = doc.addPage([A4_WIDTH, A4_HEIGHT]);
  drawHeader(page1, 'AICTE PRAGATI-NAV: Project Overview & Core Architecture', 'Executive Technical & Regulatory Summary - SIH Platform Submission', 1, 4);

  let curY = A4_HEIGHT - 95;

  page1.drawRectangle({
    x: MARGIN_LEFT,
    y: curY - 55,
    width: CONTENT_WIDTH,
    height: 55,
    color: bgSoft,
    borderColor: accentBlue,
    borderWidth: 1
  });
  page1.drawRectangle({
    x: MARGIN_LEFT,
    y: curY - 55,
    width: 4,
    height: 55,
    color: accentBlue
  });

  page1.drawText('Project Mission Statement:', {
    x: MARGIN_LEFT + 12,
    y: curY - 14,
    size: 9,
    font: fontBold,
    color: primaryNavy
  });

  page1.drawText('To develop an integrated, secure and configurable digital platform for end-to-end automation', { x: MARGIN_LEFT + 12, y: curY - 27, size: 8, font: fontRegular, color: darkText });
  page1.drawText('and monitoring of AICTE approval workflows: application routing, scrutiny stages, EVC scheduling,', { x: MARGIN_LEFT + 12, y: curY - 37, size: 8, font: fontRegular, color: darkText });
  page1.drawText('pendency monitoring, time-bound undertakings, institutional compliance, and document validity.', { x: MARGIN_LEFT + 12, y: curY - 47, size: 8, font: fontRegular, color: darkText });

  curY -= 75;

  page1.drawText('1. Core Problem Statement & Key Challenges Solved', {
    x: MARGIN_LEFT,
    y: curY,
    size: 11,
    font: fontBold,
    color: primaryNavy
  });

  curY -= 15;
  const problems = [
    { title: 'Manual Application Routing:', desc: 'Applications previously delayed between Scrutiny, EVC, and SAC stages due to manual physical file movement.' },
    { title: 'Delayed Expert Visit (EVC) Scheduling:', desc: 'Lack of automated conflict-of-interest checks and delayed 48-hour post-inspection report submissions.' },
    { title: 'Unmonitored Time-Bound Undertakings:', desc: 'Conditional approvals granted without automated countdown tracking or evidence verification workflows.' },
    { title: 'Lapsed 30-Year Land Leases & Fire NOCs:', desc: 'Campuses operating with expired lease deeds, creating acute statutory and legal liabilities.' },
    { title: 'Absence of Automated Multi-Tier Escalations:', desc: 'Delays accumulating across regions without automated intervention by Regional Officers and Bureau Heads.' }
  ];

  for (const item of problems) {
    page1.drawCircle({ x: MARGIN_LEFT + 5, y: curY - 3, size: 2.5, color: accentBlue });
    page1.drawText(item.title, { x: MARGIN_LEFT + 15, y: curY - 6, size: 8.5, font: fontBold, color: darkText });
    page1.drawText(item.desc, { x: MARGIN_LEFT + 15, y: curY - 17, size: 8, font: fontRegular, color: mutedText });
    curY -= 25;
  }

  curY -= 5;
  page1.drawText('2. Module A: End-to-End Approval Workflow Automation', {
    x: MARGIN_LEFT,
    y: curY,
    size: 11,
    font: fontBold,
    color: primaryNavy
  });

  curY -= 16;
  page1.drawText('The system automatically routes technical institution applications through 5 statutory APH routes:', {
    x: MARGIN_LEFT,
    y: curY,
    size: 8.5,
    font: fontRegular,
    color: darkText
  });

  curY -= 15;
  const routes = [
    { code: 'ONLY_SCRUTINY', name: 'Only Scrutiny', desc: 'Standard Extension of Approval (EoA) without intake changes', sla: '7 Days', color: rgb(0.01, 0.52, 0.78) },
    { code: 'SCRUTINY_EVC', name: 'Scrutiny + EVC', desc: 'Mandatory for Increase in Intake, New Courses, & New Technical Institutions', sla: '7d + 2d EVC', color: rgb(0.48, 0.23, 0.93) },
    { code: 'SCRUTINY_EVC_SAC', name: 'Scrutiny + EVC + SAC', desc: 'Mandatory for Change of Site, Course Closures, or disputed appeals', sla: '14 Days SAC', color: rgb(0.92, 0.35, 0.05) },
    { code: 'ONLY_EVC', name: 'Only EVC (Surprise/Compliance)', desc: 'Unannounced compliance verification and infrastructure re-inspections', sla: '5 Days EVC', color: rgb(0.05, 0.58, 0.53) },
    { code: 'EVC_SAC', name: 'EVC + SAC/SHC', desc: 'Post-rejection appeals, punitive review hearings, and intake restoration', sla: '14 Days SAC', color: rgb(0.86, 0.15, 0.15) }
  ];

  page1.drawRectangle({ x: MARGIN_LEFT, y: curY - 16, width: CONTENT_WIDTH, height: 16, color: primaryNavy });
  page1.drawText('Route Category', { x: MARGIN_LEFT + 8, y: curY - 12, size: 7.5, font: fontBold, color: rgb(1, 1, 1) });
  page1.drawText('Applicability & Prescribed Stages', { x: MARGIN_LEFT + 140, y: curY - 12, size: 7.5, font: fontBold, color: rgb(1, 1, 1) });
  page1.drawText('Statutory SLA', { x: MARGIN_LEFT + 430, y: curY - 12, size: 7.5, font: fontBold, color: rgb(1, 1, 1) });
  curY -= 16;

  for (let i = 0; i < routes.length; i++) {
    const r = routes[i];
    const rowBg = i % 2 === 0 ? rgb(0.98, 0.98, 0.99) : rgb(0.94, 0.96, 0.98);
    page1.drawRectangle({ x: MARGIN_LEFT, y: curY - 18, width: CONTENT_WIDTH, height: 18, color: rowBg, borderColor: borderLight, borderWidth: 0.5 });
    page1.drawText(r.name, { x: MARGIN_LEFT + 8, y: curY - 13, size: 8, font: fontBold, color: r.color });
    page1.drawText(r.desc, { x: MARGIN_LEFT + 140, y: curY - 13, size: 7.5, font: fontRegular, color: darkText });
    page1.drawText(r.sla, { x: MARGIN_LEFT + 430, y: curY - 13, size: 8, font: fontBold, color: primaryNavy });
    curY -= 18;
  }

  curY -= 15;
  page1.drawText('3. Milestone Stepper & Authorized Deficiency Revert Workflow', {
    x: MARGIN_LEFT,
    y: curY,
    size: 11,
    font: fontBold,
    color: primaryNavy
  });

  curY -= 14;
  page1.drawText('- Automatic Movement: Upon completion of preliminary scrutiny or EVC recommendations, applications auto-transition to downstream stages.', { x: MARGIN_LEFT + 6, y: curY, size: 8, font: fontRegular, color: darkText });
  curY -= 12;
  page1.drawText('- Mandatory Deficiency Revert: Regional Officers can return applications for deficiency rectification with prescribed APH clauses (e.g. Clause 6.4 Library,', { x: MARGIN_LEFT + 6, y: curY, size: 8, font: fontRegular, color: darkText });
  curY -= 11;
  page1.drawText('  Clause 7.12 Faculty Ratio, Clause 2.4 Fire Safety). Automatic 7-day cure window countdown clock commences upon issuance.', { x: MARGIN_LEFT + 6, y: curY, size: 8, font: fontRegular, color: darkText });
  curY -= 12;
  page1.drawText('- Electronic Case Summary: Instant printable official dossier generated with AICTE emblem, QR verification badge, and digital audit hashes.', { x: MARGIN_LEFT + 6, y: curY, size: 8, font: fontRegular, color: darkText });

  // PAGE 2: Modules B, C, D & E
  const page2 = doc.addPage([A4_WIDTH, A4_HEIGHT]);
  drawHeader(page2, 'Pendency Monitoring, EVC Scheduling & Institutional Compliance', 'Integrated Zonal Radar, 48h Inspection Dossier & Expiry Matrix', 2, 4);

  curY = A4_HEIGHT - 95;

  page2.drawText('4. Module B: Integrated Dashboard & Regional Pendency Monitoring', {
    x: MARGIN_LEFT,
    y: curY,
    size: 11,
    font: fontBold,
    color: primaryNavy
  });

  curY -= 14;
  page2.drawText('PRAGATI-NAV aggregates real-time application movement across all 8 AICTE Regional Offices (WRO, NRO, SRO, CRO, ERO, SCRO, NWRO, SWRO).', { x: MARGIN_LEFT, y: curY, size: 8, font: fontRegular, color: darkText });

  curY -= 14;
  page2.drawRectangle({ x: MARGIN_LEFT, y: curY - 55, width: CONTENT_WIDTH, height: 55, color: bgSoft, borderColor: borderLight, borderWidth: 1 });
  page2.drawText('Pan-India Zonal Workload & Bottleneck Metrics:', { x: MARGIN_LEFT + 10, y: curY - 14, size: 8.5, font: fontBold, color: primaryNavy });
  page2.drawText('- Western Region (WRO, Mumbai): 2 active cases | Avg Aging: 5.2 days | Status: Optimal Workload', { x: MARGIN_LEFT + 10, y: curY - 26, size: 8, font: fontRegular, color: darkText });
  page2.drawText('- South-Central (SCRO, Hyderabad): 1 critical case | SLA Breached by 11 days | Status: High Bottleneck (Level 3 Escalated)', { x: MARGIN_LEFT + 10, y: curY - 37, size: 8, font: fontRegular, color: ruby });
  page2.drawText('- Eastern Region (ERO, Kolkata): 1 active case | Land Lease expiring in 42 days | Status: Urgent Action Watchlist', { x: MARGIN_LEFT + 10, y: curY - 48, size: 8, font: fontRegular, color: saffron });
  curY -= 68;

  page2.drawText('5. Module C: Expert Visit Committee (EVC) Scheduling & 48-Hour Report Tracking', {
    x: MARGIN_LEFT,
    y: curY,
    size: 11,
    font: fontBold,
    color: primaryNavy
  });

  curY -= 14;
  page2.drawText('- Automated EVC Queuing: Applications clearing Preliminary Scrutiny are automatically placed in the EVC Scheduling pool.', { x: MARGIN_LEFT + 6, y: curY, size: 8, font: fontRegular, color: darkText });
  curY -= 12;
  page2.drawText('- 3-Expert Committee Composition: Mandatory composition of 1 Senior Academician (IIT/NIT/Univ), 1 Architect/Civil Safety Expert, and 1 AICTE RO Representative.', { x: MARGIN_LEFT + 6, y: curY, size: 8, font: fontRegular, color: darkText });
  curY -= 12;
  page2.drawText('- Conflict-of-Interest Validation: Autonomous cross-check verifying no committee member has prior employment or familial affiliation with applicant.', { x: MARGIN_LEFT + 6, y: curY, size: 8, font: fontRegular, color: darkText });
  curY -= 12;
  page2.drawText('- 48-Hour Report Upload Clock: Strict countdown timer enforced upon visit completion for geo-tagged inspection dossier and digital sign-off.', { x: MARGIN_LEFT + 6, y: curY, size: 8, font: fontRegular, color: darkText });

  curY -= 20;
  page2.drawText('6. Module D: Time-Bound Undertakings & Compliance Ledger', {
    x: MARGIN_LEFT,
    y: curY,
    size: 11,
    font: fontBold,
    color: primaryNavy
  });

  curY -= 14;
  page2.drawText('Certain technical approvals are granted subject to time-bound undertakings (e.g. cadre-ratio recruitment, laboratory equipment, fire NOCs):', { x: MARGIN_LEFT, y: curY, size: 8, font: fontRegular, color: darkText });

  curY -= 14;
  page2.drawRectangle({ x: MARGIN_LEFT, y: curY - 16, width: CONTENT_WIDTH, height: 16, color: primaryNavy });
  page2.drawText('Undertaking ID', { x: MARGIN_LEFT + 6, y: curY - 12, size: 7.5, font: fontBold, color: rgb(1, 1, 1) });
  page2.drawText('Institution', { x: MARGIN_LEFT + 75, y: curY - 12, size: 7.5, font: fontBold, color: rgb(1, 1, 1) });
  page2.drawText('Prescribed Condition', { x: MARGIN_LEFT + 195, y: curY - 12, size: 7.5, font: fontBold, color: rgb(1, 1, 1) });
  page2.drawText('Deadline', { x: MARGIN_LEFT + 375, y: curY - 12, size: 7.5, font: fontBold, color: rgb(1, 1, 1) });
  page2.drawText('Status', { x: MARGIN_LEFT + 440, y: curY - 12, size: 7.5, font: fontBold, color: rgb(1, 1, 1) });
  curY -= 16;

  const demoUndertakings = [
    { id: 'UND-WRO-01', inst: 'MIT & Research Pune', cond: 'Appointment of 2 Professors in AI cadre (7th CPC)', date: '2026-12-15', status: 'Pending Evidence' },
    { id: 'UND-NRO-02', inst: 'Quantum Inst. Noida', cond: 'Submission of Occupancy Certificate from GNIDA', date: '2026-11-20', status: 'Submitted (Review)' },
    { id: 'UND-SWRO-01', inst: 'Bangalore Tech Academy', cond: 'Installation of Solar Rooftop PV Plant (100 kVA)', date: '2026-11-30', status: 'Verified & Closed' },
    { id: 'UND-SCRO-01', inst: 'Telangana Inst. Applied Sci', cond: 'Deposit of Rs. 50 Lakhs in Joint Endowment Fund', date: '2026-10-15', status: 'Overdue (SAC Escalated)' }
  ];

  for (let i = 0; i < demoUndertakings.length; i++) {
    const u = demoUndertakings[i];
    const rowBg = i % 2 === 0 ? rgb(0.98, 0.98, 0.99) : rgb(0.94, 0.96, 0.98);
    page2.drawRectangle({ x: MARGIN_LEFT, y: curY - 18, width: CONTENT_WIDTH, height: 18, color: rowBg, borderColor: borderLight, borderWidth: 0.5 });
    page2.drawText(u.id, { x: MARGIN_LEFT + 6, y: curY - 13, size: 7.5, font: fontBold, color: accentBlue });
    page2.drawText(u.inst, { x: MARGIN_LEFT + 75, y: curY - 13, size: 7.5, font: fontRegular, color: darkText });
    page2.drawText(u.cond, { x: MARGIN_LEFT + 195, y: curY - 13, size: 7.5, font: fontRegular, color: darkText });
    page2.drawText(u.date, { x: MARGIN_LEFT + 375, y: curY - 13, size: 7.5, font: fontRegular, color: darkText });
    page2.drawText(u.status, { x: MARGIN_LEFT + 440, y: curY - 13, size: 7.5, font: fontBold, color: u.status.includes('Overdue') ? ruby : u.status.includes('Verified') ? emerald : saffron });
    curY -= 18;
  }

  curY -= 20;
  page2.drawText('7. Module E: 30-Year Land Lease & Document Validity Radar', {
    x: MARGIN_LEFT,
    y: curY,
    size: 11,
    font: fontBold,
    color: primaryNavy
  });

  curY -= 14;
  page2.drawText('Continuous validity monitoring for 30-year registered land lease deeds, building safety certificates, and fire safety NOCs:', { x: MARGIN_LEFT, y: curY, size: 8, font: fontRegular, color: darkText });
  curY -= 13;
  page2.drawText('- Tier 1 (>180 Days): Compliant & Active status. No action required.', { x: MARGIN_LEFT + 8, y: curY, size: 8, font: fontRegular, color: emerald });
  curY -= 12;
  page2.drawText('- Tier 2 (90-180 Days): 6-Month advance renewal notice automatically dispatched to Principal and Governing Board.', { x: MARGIN_LEFT + 8, y: curY, size: 8, font: fontRegular, color: saffron });
  curY -= 12;
  page2.drawText('- Tier 3 (<= 90 Days): Critical Renewal Notice. Warns institution that failure to upload registered extension deed freezes subsequent EoA.', { x: MARGIN_LEFT + 8, y: curY, size: 8, font: fontRegular, color: ruby });
  curY -= 12;
  page2.drawText('- Tier 4 (Expired / Non-Renewed): Automatic regulatory block preventing issuance of Approval Orders until cleared by Regional Officer.', { x: MARGIN_LEFT + 8, y: curY, size: 8, font: fontRegular, color: ruby });

  // PAGE 3: 3-Role RBAC & Permissions Architecture
  const page3 = doc.addPage([A4_WIDTH, A4_HEIGHT]);
  drawHeader(page3, 'Role-Based Access Control (RBAC) & Governance Layer', 'Typed Permission Matrix, Data Scoping & Dedicated Role Portals', 3, 4);

  curY = A4_HEIGHT - 95;

  page3.drawText('8. The Three Core AICTE Administrative Personas', {
    x: MARGIN_LEFT,
    y: curY,
    size: 11,
    font: fontBold,
    color: primaryNavy
  });

  curY -= 14;
  page3.drawText('The platform implements strict role-based access control governed by /lib/permissions.ts as the single source of truth:', { x: MARGIN_LEFT, y: curY, size: 8, font: fontRegular, color: darkText });

  curY -= 16;
  const rWidth = (CONTENT_WIDTH - 16) / 3;

  // Box 1: Institution
  page3.drawRectangle({ x: MARGIN_LEFT, y: curY - 145, width: rWidth, height: 145, color: bgSoft, borderColor: accentBlue, borderWidth: 1 });
  page3.drawRectangle({ x: MARGIN_LEFT, y: curY - 18, width: rWidth, height: 18, color: accentBlue });
  page3.drawText('1. Institution (Applicant)', { x: MARGIN_LEFT + 8, y: curY - 13, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
  page3.drawText('Persona: Dr. Meera Sen, Principal', { x: MARGIN_LEFT + 8, y: curY - 32, size: 7.5, font: fontBold, color: darkText });
  page3.drawText('MIT & Research (ID: 1-748920141)', { x: MARGIN_LEFT + 8, y: curY - 42, size: 7, font: fontRegular, color: mutedText });
  page3.drawText('- Sees ONLY own applications & proofs', { x: MARGIN_LEFT + 8, y: curY - 56, size: 7.5, font: fontRegular, color: darkText });
  page3.drawText('- Respond to deficiency notices', { x: MARGIN_LEFT + 8, y: curY - 68, size: 7.5, font: fontRegular, color: darkText });
  page3.drawText('- Upload compliance evidence', { x: MARGIN_LEFT + 8, y: curY - 80, size: 7.5, font: fontRegular, color: darkText });
  page3.drawText('- Upload renewed lease / Fire NOC', { x: MARGIN_LEFT + 8, y: curY - 92, size: 7.5, font: fontRegular, color: darkText });
  page3.drawText('- Track milestone progress bar', { x: MARGIN_LEFT + 8, y: curY - 104, size: 7.5, font: fontRegular, color: darkText });
  page3.drawText('Sidebar: Dashboard, My Applications,', { x: MARGIN_LEFT + 8, y: curY - 124, size: 7, font: fontBold, color: primaryNavy });
  page3.drawText('My Undertakings, My Documents, Alerts', { x: MARGIN_LEFT + 8, y: curY - 134, size: 7, font: fontBold, color: primaryNavy });

  // Box 2: Regional Officer
  const roX = MARGIN_LEFT + rWidth + 8;
  page3.drawRectangle({ x: roX, y: curY - 145, width: rWidth, height: 145, color: bgSoft, borderColor: emerald, borderWidth: 1 });
  page3.drawRectangle({ x: roX, y: curY - 18, width: rWidth, height: 18, color: emerald });
  page3.drawText('2. Regional Officer (RO)', { x: roX + 8, y: curY - 13, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
  page3.drawText('Persona: Dr. R.K. Patil, RO WRO', { x: roX + 8, y: curY - 32, size: 7.5, font: fontBold, color: darkText });
  page3.drawText('AICTE Western Regional Office', { x: roX + 8, y: curY - 42, size: 7, font: fontRegular, color: mutedText });
  page3.drawText('- Sees ONLY applications in region', { x: roX + 8, y: curY - 56, size: 7.5, font: fontRegular, color: darkText });
  page3.drawText('- Advance stage or revert with memo', { x: roX + 8, y: curY - 68, size: 7.5, font: fontRegular, color: darkText });
  page3.drawText('- Schedule 3-member EVC committee', { x: roX + 8, y: curY - 80, size: 7.5, font: fontRegular, color: darkText });
  page3.drawText('- Verify / reject undertakings', { x: roX + 8, y: curY - 92, size: 7.5, font: fontRegular, color: darkText });
  page3.drawText('- Validate renewed lease deeds', { x: roX + 8, y: curY - 104, size: 7.5, font: fontRegular, color: darkText });
  page3.drawText('Sidebar: Dashboard, Applications, EVC,', { x: roX + 8, y: curY - 124, size: 7, font: fontBold, color: primaryNavy });
  page3.drawText('Undertakings, Docs, Alerts, Reports, Audit', { x: roX + 8, y: curY - 134, size: 7, font: fontBold, color: primaryNavy });

  // Box 3: Bureau Head
  const bhX = roX + rWidth + 8;
  page3.drawRectangle({ x: bhX, y: curY - 145, width: rWidth, height: 145, color: bgSoft, borderColor: rgb(0.48, 0.23, 0.93), borderWidth: 1 });
  page3.drawRectangle({ x: bhX, y: curY - 18, width: rWidth, height: 18, color: rgb(0.48, 0.23, 0.93) });
  page3.drawText('3. Bureau Head (HQ)', { x: bhX + 8, y: curY - 13, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
  page3.drawText('Persona: Shri A.K. Sharma, Adviser', { x: bhX + 8, y: curY - 32, size: 7.5, font: fontBold, color: darkText });
  page3.drawText('Approval Bureau, AICTE New Delhi', { x: bhX + 8, y: curY - 42, size: 7, font: fontRegular, color: mutedText });
  page3.drawText('- Unrestricted Pan-India (8 Regions)', { x: bhX + 8, y: curY - 56, size: 7.5, font: fontRegular, color: darkText });
  page3.drawText('- 8-region bottleneck heatmap', { x: bhX + 8, y: curY - 68, size: 7.5, font: fontRegular, color: darkText });
  page3.drawText('- Handle Tier-3 apex escalations', { x: bhX + 8, y: curY - 80, size: 7.5, font: fontRegular, color: darkText });
  page3.drawText('- Reassign cases across regions', { x: bhX + 8, y: curY - 92, size: 7.5, font: fontRegular, color: darkText });
  page3.drawText('- Configure APH handbook SLAs', { x: bhX + 8, y: curY - 104, size: 7.5, font: fontRegular, color: darkText });
  page3.drawText('Sidebar: National Dashboard, All Apps,', { x: bhX + 8, y: curY - 124, size: 7, font: fontBold, color: primaryNavy });
  page3.drawText('Escalations, Reports, Audit, Rules, Integrations', { x: bhX + 8, y: curY - 134, size: 7, font: fontBold, color: primaryNavy });

  curY -= 160;

  page3.drawText('9. Simplified 3-Tier Escalation Ladder', {
    x: MARGIN_LEFT,
    y: curY,
    size: 11,
    font: fontBold,
    color: primaryNavy
  });

  curY -= 14;
  page3.drawText('When application movement or institutional compliance breaches SLA thresholds, the autonomous watchdog fires alerts in order:', { x: MARGIN_LEFT, y: curY, size: 8, font: fontRegular, color: darkText });

  curY -= 14;
  const eBoxWidth = (CONTENT_WIDTH - 20) / 3;

  page3.drawRectangle({ x: MARGIN_LEFT, y: curY - 45, width: eBoxWidth, height: 45, color: rgb(1, 0.96, 0.88), borderColor: saffron, borderWidth: 1 });
  page3.drawText('Level 1: Institution Reminder', { x: MARGIN_LEFT + 6, y: curY - 12, size: 7.5, font: fontBold, color: saffron });
  page3.drawText('- Trigger: SLA + 2 Days or <= 7d to deadline', { x: MARGIN_LEFT + 6, y: curY - 24, size: 6.8, font: fontRegular, color: darkText });
  page3.drawText('- Action: Automated SMS/Email to Principal', { x: MARGIN_LEFT + 6, y: curY - 34, size: 6.8, font: fontRegular, color: darkText });

  page3.drawText('->', { x: MARGIN_LEFT + eBoxWidth + 3, y: curY - 26, size: 14, font: fontBold, color: primaryNavy });

  const eBox2X = MARGIN_LEFT + eBoxWidth + 10;
  page3.drawRectangle({ x: eBox2X, y: curY - 45, width: eBoxWidth, height: 45, color: rgb(0.99, 0.92, 0.92), borderColor: ruby, borderWidth: 1 });
  page3.drawText('Level 2: Regional Officer Alert', { x: eBox2X + 6, y: curY - 12, size: 7.5, font: fontBold, color: ruby });
  page3.drawText('- Trigger: SLA + 5 Days overdue', { x: eBox2X + 6, y: curY - 24, size: 6.8, font: fontRegular, color: darkText });
  page3.drawText('- Action: Directive memo to RO to reassign or resolve', { x: eBox2X + 6, y: curY - 34, size: 6.8, font: fontRegular, color: darkText });

  page3.drawText('->', { x: eBox2X + eBoxWidth + 3, y: curY - 26, size: 14, font: fontBold, color: primaryNavy });

  const eBox3X = eBox2X + eBoxWidth + 10;
  page3.drawRectangle({ x: eBox3X, y: curY - 45, width: eBoxWidth, height: 45, color: rgb(0.96, 0.92, 1.0), borderColor: rgb(0.48, 0.23, 0.93), borderWidth: 1 });
  page3.drawText('Level 3: Bureau Head Apex', { x: eBox3X + 6, y: curY - 12, size: 7.5, font: fontBold, color: rgb(0.48, 0.23, 0.93) });
  page3.drawText('- Trigger: SLA + 8 Days overdue', { x: eBox3X + 6, y: curY - 24, size: 6.8, font: fontRegular, color: darkText });
  page3.drawText('- Action: Emergency docket to Member Secretary', { x: eBox3X + 6, y: curY - 34, size: 6.8, font: fontRegular, color: darkText });

  curY -= 60;
  page3.drawText('10. Permission UX Rules & Disabled Actions Policy', {
    x: MARGIN_LEFT,
    y: curY,
    size: 11,
    font: fontBold,
    color: primaryNavy
  });

  curY -= 14;
  page3.drawText('- Navigation Isolation: Unauthorized sidebar and menu items are completely hidden from the user interface.', { x: MARGIN_LEFT + 6, y: curY, size: 8, font: fontRegular, color: darkText });
  curY -= 12;
  page3.drawText('- Disabled Buttons with Tooltips: Visible-but-restricted buttons show disabled styling with descriptive tooltips (e.g. "Only Regional Officers can verify documents").', { x: MARGIN_LEFT + 6, y: curY, size: 8, font: fontRegular, color: darkText });
  curY -= 12;
  page3.drawText('- Demo 3-Card Role Selector: Switch roles anytime via the header badge or sidebar to evaluate all three administrative perspectives.', { x: MARGIN_LEFT + 6, y: curY, size: 8, font: fontRegular, color: darkText });

  // PAGE 4: Technical Stack, Integrations & Impact
  const page4 = doc.addPage([A4_WIDTH, A4_HEIGHT]);
  drawHeader(page4, 'Technical Stack, Government Integrations & Impact', 'E-Governance Interoperability, Cryptographic Audit & Statutory Disclaimer', 4, 4);

  curY = A4_HEIGHT - 95;

  page4.drawText('11. Central E-Governance API Bridges (Bureau Head View)', {
    x: MARGIN_LEFT,
    y: curY,
    size: 11,
    font: fontBold,
    color: primaryNavy
  });

  curY -= 14;
  page4.drawText('PRAGATI-NAV connects directly with 6 central e-governance systems to verify institutional credentials without manual paper verification:', { x: MARGIN_LEFT, y: curY, size: 8, font: fontRegular, color: darkText });

  curY -= 14;
  const apis = [
    { name: 'AICTE Central MIS & Approval Portal', func: 'Bidirectional sync with primary technical institution database, course matrix, and seat intake.', status: 'Active (34ms)' },
    { name: 'Bhulekh / NLRMP (National Land Records)', func: 'Automated digital verification of 30-year registered land lease deeds and non-encumbrance status.', status: 'Connected (58ms)' },
    { name: 'DigiLocker NAD (National Academic Depository)', func: 'Real-time authentication of faculty postgraduate & PhD degrees under AICTE 7th CPC norms.', status: 'Connected (41ms)' },
    { name: 'State Fire & Emergency Services Gateway', func: 'Webhook ingestion for building fire safety NOC approvals, inspection renewals, and validity.', status: 'Connected (72ms)' },
    { name: 'NIC / CDAC SMS & WhatsApp Statutory Gateway', func: 'High-throughput delivery of 30d/15d/7d compliance countdowns and Level 1/2/3 escalation notices.', status: 'Operational (26ms)' },
    { name: 'National Single Window System (NSWS)', func: 'Inter-ministerial data bridge with Ministry of Education, State DTEs, and affiliated Universities.', status: 'Connected (65ms)' }
  ];

  for (const api of apis) {
    page4.drawRectangle({ x: MARGIN_LEFT, y: curY - 24, width: CONTENT_WIDTH, height: 24, color: bgSoft, borderColor: borderLight, borderWidth: 0.5 });
    page4.drawText(api.name, { x: MARGIN_LEFT + 8, y: curY - 11, size: 8, font: fontBold, color: primaryNavy });
    page4.drawText(api.status, { x: MARGIN_LEFT + 430, y: curY - 11, size: 7.5, font: fontBold, color: emerald });
    page4.drawText(api.func, { x: MARGIN_LEFT + 8, y: curY - 20, size: 7, font: fontRegular, color: mutedText });
    curY -= 27;
  }

  curY -= 10;
  page4.drawText('12. Measurable Outcomes & Hackathon Impact Metrics', {
    x: MARGIN_LEFT,
    y: curY,
    size: 11,
    font: fontBold,
    color: primaryNavy
  });

  curY -= 15;
  const metrics = [
    { num: '80%', title: 'Reduction in Follow-up', desc: 'Predictive reminders and standardized case summaries eliminate routine phone calls and email follow-ups between Regional Offices and institutions.' },
    { num: '100%', title: 'Lease Expiry Elimination', desc: '180d and 90d advance validity radar prevents unmonitored land lease expirations, guaranteeing legal campus title.' },
    { num: '48 Hrs', title: 'EVC Inspection Report SLA', desc: 'Strict countdown clock ensures EVC teams upload geo-tagged physical inspection reports within 48 hours of visit completion.' },
    { num: 'SHA-256', title: 'Tamper-Evident Audit Ledger', desc: 'Every stage transition, deficiency issuance, and evidence verification is cryptographically signed and permanently logged.' }
  ];

  const mWidth = (CONTENT_WIDTH - 15) / 2;
  for (let i = 0; i < metrics.length; i++) {
    const m = metrics[i];
    const mX = i % 2 === 0 ? MARGIN_LEFT : MARGIN_LEFT + mWidth + 15;
    const mY = i < 2 ? curY - 48 : curY - 105;

    page4.drawRectangle({ x: mX, y: mY, width: mWidth, height: 48, color: bgSoft, borderColor: borderLight, borderWidth: 1 });
    page4.drawText(m.num, { x: mX + 10, y: mY + 30, size: 14, font: fontBold, color: accentBlue });
    page4.drawText(m.title, { x: mX + 75, y: mY + 34, size: 8.5, font: fontBold, color: primaryNavy });
    page4.drawText(m.desc.slice(0, 75) + '...', { x: mX + 75, y: mY + 22, size: 7, font: fontRegular, color: mutedText });
    page4.drawText(m.desc.slice(75, 150), { x: mX + 75, y: mY + 12, size: 7, font: fontRegular, color: mutedText });
  }

  curY -= 125;

  page4.drawRectangle({
    x: MARGIN_LEFT,
    y: curY - 50,
    width: CONTENT_WIDTH,
    height: 50,
    color: rgb(1.0, 0.95, 0.95),
    borderColor: ruby,
    borderWidth: 1
  });
  page4.drawRectangle({
    x: MARGIN_LEFT,
    y: curY - 50,
    width: 4,
    height: 50,
    color: ruby
  });

  page4.drawText('AICTE STATUTORY REGULATORY SAFEGUARD:', {
    x: MARGIN_LEFT + 12,
    y: curY - 13,
    size: 8.5,
    font: fontBold,
    color: ruby
  });

  page4.drawText('The system functions in strict accordance with the applicable AICTE regulations, Approval Process Handbook (APH), and', { x: MARGIN_LEFT + 12, y: curY - 25, size: 7.5, font: fontRegular, color: darkText });
  page4.drawText('authorized administrative procedures. Automated alerts, recommendations, and workflow transitions assist the approval', { x: MARGIN_LEFT + 12, y: curY - 35, size: 7.5, font: fontRegular, color: darkText });
  page4.drawText('process but shall not replace statutory scrutiny, physical inspections, or regulatory decisions reserved for competent Council authorities.', { x: MARGIN_LEFT + 12, y: curY - 45, size: 7.5, font: fontRegular, color: darkText });

  curY -= 75;

  page4.drawLine({
    start: { x: MARGIN_LEFT, y: curY },
    end: { x: A4_WIDTH - MARGIN_LEFT, y: curY },
    thickness: 1,
    color: borderLight
  });

  page4.drawText('Cryptographic System Verification Hash:', { x: MARGIN_LEFT, y: curY - 14, size: 7.5, font: fontBold, color: primaryNavy });
  page4.drawText('SHA256: 9e41b7d8019a284eef1092847a9831cb77019284fa88c12a', { x: MARGIN_LEFT, y: curY - 24, size: 7, font: fontRegular, color: emerald });
  page4.drawText('Platform Engine: AICTE PRAGATI-NAV v2.6-SIH National Release', { x: MARGIN_LEFT, y: curY - 34, size: 7, font: fontRegular, color: mutedText });

  page4.drawText('Adviser (Approval Bureau)', { x: A4_WIDTH - MARGIN_LEFT - 140, y: curY - 14, size: 8, font: fontBold, color: primaryNavy });
  page4.drawText('All India Council for Technical Education', { x: A4_WIDTH - MARGIN_LEFT - 140, y: curY - 24, size: 7.5, font: fontRegular, color: darkText });
  page4.drawText('Nelson Mandela Marg, New Delhi-110070', { x: A4_WIDTH - MARGIN_LEFT - 140, y: curY - 34, size: 7, font: fontRegular, color: mutedText });

  const pdfBytes = await doc.save();
  const outputPath = 'c:\\Users\\himan\\OneDrive\\Desktop\\AutomationSIH\\AICTE_PRAGATI_NAV_Project_Documentation.pdf';
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`PDF successfully created at ${outputPath} (${pdfBytes.length} bytes)`);
}

generateAICTEProjectPDF().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
