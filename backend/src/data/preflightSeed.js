// Seeded, structured extracted fields per application (what OCR/extraction would
// produce). Each value keeps its source page and extraction confidence.
// Designed to cover every outcome: READY, REVIEW_REQUIRED and BLOCKED.
const f = (docType, field, value, page, confidence = 0.97) => ({ docType, field, value, page, confidence });

export const preflightSeed = {
  // Fire NOC expires in a few days -> NEEDS_REVIEW (REVIEW_REQUIRED)
  'APP-2026-WRO-1049': [
    f('APPLICATION_FORM', 'sanctionedIntake', 180, 3),
    f('APPLICATION_FORM', 'facultyCount', 10, 5),
    f('LAND_LEASE', 'landAreaSqm', 12000, 2),
    f('LAND_LEASE', 'expiryDate', '2031-04-09', 1),
    f('SITE_PLAN', 'landAreaSqm', 12000, 1),
    f('BUILDING_PLAN', 'builtUpAreaSqm', 900, 4),
    f('TRUST_RESOLUTION', 'sanctionedIntake', 180, 1),
    f('FIRE_NOC', 'expiryDate', '2026-10-31', 1)
  ],
  // Deliberately inconsistent -> several FAILs and one NEEDS_REVIEW (BLOCKED)
  'APP-2026-NRO-8821': [
    f('APPLICATION_FORM', 'sanctionedIntake', 240, 3),
    f('APPLICATION_FORM', 'facultyCount', 12, 5, 0.55),
    f('LAND_LEASE', 'landAreaSqm', 8000, 2),
    f('LAND_LEASE', 'expiryDate', '2122-01-14', 1),
    f('SITE_PLAN', 'landAreaSqm', 9200, 1),
    f('BUILDING_PLAN', 'builtUpAreaSqm', 700, 4),
    f('TRUST_RESOLUTION', 'sanctionedIntake', 180, 1),
    f('FIRE_NOC', 'expiryDate', '2027-06-30', 1)
  ],
  // Fire NOC document missing entirely -> required-field FAIL (BLOCKED)
  'APP-2026-CRO-3310': [
    f('APPLICATION_FORM', 'sanctionedIntake', 60, 3),
    f('APPLICATION_FORM', 'facultyCount', 6, 5),
    f('LAND_LEASE', 'landAreaSqm', 5000, 2),
    f('LAND_LEASE', 'expiryDate', '2045-08-11', 1),
    f('SITE_PLAN', 'landAreaSqm', 5000, 1),
    f('BUILDING_PLAN', 'builtUpAreaSqm', 400, 4),
    f('TRUST_RESOLUTION', 'sanctionedIntake', 60, 1)
  ],
  // Land lease expires in ~40 days -> NEEDS_REVIEW (REVIEW_REQUIRED)
  'APP-2026-ERO-7834': [
    f('APPLICATION_FORM', 'sanctionedIntake', 120, 3),
    f('APPLICATION_FORM', 'facultyCount', 8, 5),
    f('LAND_LEASE', 'landAreaSqm', 9000, 2),
    f('LAND_LEASE', 'expiryDate', '2026-12-04', 1),
    f('SITE_PLAN', 'landAreaSqm', 9000, 1),
    f('BUILDING_PLAN', 'builtUpAreaSqm', 600, 4),
    f('TRUST_RESOLUTION', 'sanctionedIntake', 120, 1),
    f('FIRE_NOC', 'expiryDate', '2027-02-28', 1)
  ],
  // Clean -> READY
  'APP-2026-SCRO-4421': [
    f('APPLICATION_FORM', 'sanctionedIntake', 120, 3),
    f('APPLICATION_FORM', 'facultyCount', 9, 5),
    f('LAND_LEASE', 'landAreaSqm', 10000, 2),
    f('LAND_LEASE', 'expiryDate', '2038-05-19', 1),
    f('SITE_PLAN', 'landAreaSqm', 10000, 1),
    f('BUILDING_PLAN', 'builtUpAreaSqm', 650, 4),
    f('TRUST_RESOLUTION', 'sanctionedIntake', 120, 1),
    f('FIRE_NOC', 'expiryDate', '2028-01-15', 1)
  ]
};
