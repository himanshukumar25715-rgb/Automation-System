// SYNTHETIC faculty records for the demo. Identifiers are made up (SYN-...) and
// are turned into keyed fingerprints at ingest; names are masked. No real
// Aadhaar/PAN or real people are used anywhere.
const MIT = '1-748920141';
const QUANTUM = '1-992384110';
const BHOPAL = '1-338291044';
const BENGAL = '1-120938445';
const TELANGANA = '1-667281903';

export const facultySeed = [
  // TRUE CANDIDATE: full-time at two institutions with overlapping dates
  { institutionId: MIT, name: 'Aarav Mehta', identifier: 'SYN-FAC-0001', role: 'Associate Professor', employmentType: 'FULL_TIME', startDate: '2022-07-01', endDate: null },
  { institutionId: QUANTUM, name: 'Aarav Mehta', identifier: 'SYN-FAC-0001', role: 'Professor', employmentType: 'FULL_TIME', startDate: '2025-08-01', endDate: null },

  // NON-OVERLAP: moved institutions, dates are sequential (adjacent, not overlapping)
  { institutionId: BHOPAL, name: 'Neha Verma', identifier: 'SYN-FAC-0002', role: 'Assistant Professor', employmentType: 'FULL_TIME', startDate: '2021-06-01', endDate: '2024-05-31' },
  { institutionId: BENGAL, name: 'Neha Verma', identifier: 'SYN-FAC-0002', role: 'Assistant Professor', employmentType: 'FULL_TIME', startDate: '2024-06-01', endDate: null },

  // SAME INSTITUTION: promotion record, must not be flagged
  { institutionId: TELANGANA, name: 'Suresh Iyer', identifier: 'SYN-FAC-0003', role: 'Assistant Professor', employmentType: 'FULL_TIME', startDate: '2018-07-01', endDate: '2023-06-30' },
  { institutionId: TELANGANA, name: 'Suresh Iyer', identifier: 'SYN-FAC-0003', role: 'Associate Professor', employmentType: 'FULL_TIME', startDate: '2023-07-01', endDate: null },

  // EDGE: overlap involving a part-time/visiting role -> low severity, may be permitted
  { institutionId: MIT, name: 'Kavita Rao', identifier: 'SYN-FAC-0004', role: 'Professor', employmentType: 'FULL_TIME', startDate: '2019-01-01', endDate: null },
  { institutionId: BHOPAL, name: 'Kavita Rao', identifier: 'SYN-FAC-0004', role: 'Visiting Faculty', employmentType: 'PART_TIME', startDate: '2024-01-01', endDate: null },

  // Ordinary single-institution faculty
  { institutionId: QUANTUM, name: 'Imran Qureshi', identifier: 'SYN-FAC-0005', role: 'Lecturer', employmentType: 'FULL_TIME', startDate: '2023-01-15', endDate: null },
  { institutionId: BENGAL, name: 'Debjani Sen', identifier: 'SYN-FAC-0006', role: 'Professor', employmentType: 'FULL_TIME', startDate: '2016-08-01', endDate: null },
  { institutionId: TELANGANA, name: 'Ravi Teja', identifier: 'SYN-FAC-0007', role: 'Assistant Professor', employmentType: 'FULL_TIME', startDate: '2022-09-01', endDate: null }
];
