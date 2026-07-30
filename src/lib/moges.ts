export const STATES = [
  "Central Equatoria",
  "Eastern Equatoria",
  "Western Equatoria",
  "Jonglei",
  "Unity",
  "Upper Nile",
  "Warrap",
  "Northern Bahr el Ghazal",
  "Western Bahr el Ghazal",
  "Lakes",
  "Abyei Administrative Area",
  "Pibor Administrative Area",
  "Ruweng Administrative Area",
];

export const SCHOOL_LEVELS = [
  "Early Childhood",
  "Primary",
  "Secondary",
  "Technical & Vocational",
  "Teacher Training Institute",
  "Alternative Education",
];

export const OWNERSHIP = ["Public", "Community", "Faith-based", "Private", "NGO-supported"];

export const SCHOOL_STATUS = ["Active", "Inactive", "Under construction", "Closed", "Occupied"];

export const CLASS_LEVELS = [
  "ECD",
  "P1",
  "P2",
  "P3",
  "P4",
  "P5",
  "P6",
  "P7",
  "P8",
  "S1",
  "S2",
  "S3",
  "S4",
];

export const GENDERS = ["Male", "Female"];

export const STUDENT_STATUS = [
  "Enrolled",
  "Transferred out",
  "Dropped out",
  "Graduated",
  "Repeating",
  "Suspended",
];

export const DISABILITIES = ["None", "Visual", "Hearing", "Physical", "Intellectual", "Other"];

export const QUALIFICATIONS = [
  "Untrained",
  "Certificate",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
];

export const SUBJECTS = [
  "English",
  "Mathematics",
  "Science",
  "Social Studies",
  "Religious Education",
  "Arabic",
  "National Languages",
  "Agriculture",
  "ICT",
  "Physical Education",
];

export const EMPLOYMENT_STATUS = ["Permanent", "Contract", "Volunteer", "Seconded", "Retired"];

export const TEACHER_STATUS = ["Active", "On leave", "Suspended", "Transferred", "Retired"];

export type ModuleEntry = {
  code: string;
  name: string;
  description: string;
  group: string;
  to?: string;
  status: "Operational" | "Registry-backed" | "Planned";
};

/** The 20 subsystems of the National Education Digital Transformation Platform. */
export const MODULES: ModuleEntry[] = [
  {
    code: "SIS",
    name: "Student Information System",
    description: "Learner registration, enrolment, transfers, promotion and graduation records.",
    group: "Core registries",
    to: "/students",
    status: "Operational",
  },
  {
    code: "TMS",
    name: "Teacher Management System",
    description: "Teacher registration, deployment, licensing, appraisal and payroll linkage.",
    group: "Core registries",
    to: "/teachers",
    status: "Operational",
  },
  {
    code: "SMS",
    name: "School Management System",
    description: "School registration, accreditation, licensing and infrastructure profile.",
    group: "Core registries",
    to: "/schools",
    status: "Operational",
  },
  {
    code: "EMIS",
    name: "Education Management Information System",
    description: "National statistics on enrolment, staffing and school coverage.",
    group: "Analytics",
    to: "/emis",
    status: "Registry-backed",
  },
  {
    code: "DASH",
    name: "National Education Dashboard",
    description: "Ministerial indicators drawn live from the national registries.",
    group: "Analytics",
    to: "/dashboard",
    status: "Operational",
  },
  {
    code: "EMS",
    name: "Examination Management System",
    description: "Candidate registration, centres, marking and national certification.",
    group: "Service delivery",
    status: "Planned",
  },
  {
    code: "HRMS",
    name: "Human Resource Management System",
    description: "Establishment, postings, leave and disciplinary case management.",
    group: "Corporate services",
    status: "Planned",
  },
  {
    code: "PAY",
    name: "Payroll Management System",
    description: "Salary scales, payroll runs and treasury reconciliation for teaching staff.",
    group: "Corporate services",
    to: "/payroll",
    status: "Registry-backed",
  },
  {
    code: "FMS",
    name: "Financial Management System",
    description: "Budgets, capitation grants, expenditure tracking and audit trail.",
    group: "Corporate services",
    status: "Planned",
  },
  {
    code: "DMS",
    name: "Document Management System",
    description: "Circulars, policies and official correspondence repository.",
    group: "Corporate services",
    status: "Planned",
  },
  {
    code: "IQA",
    name: "Inspection & Quality Assurance",
    description: "School inspection scheduling, findings and improvement plans.",
    group: "Service delivery",
    status: "Planned",
  },
  {
    code: "CMS",
    name: "Curriculum Management System",
    description: "National curriculum framework, syllabi and textbook distribution.",
    group: "Service delivery",
    status: "Planned",
  },
  {
    code: "GIS",
    name: "GIS & School Mapping",
    description: "Geo-located school network by state, county and payam.",
    group: "Analytics",
    to: "/gis",
    status: "Registry-backed",
  },
  {
    code: "ELP",
    name: "E-Learning Platform",
    description: "Digital lessons and radio/offline learning for hard-to-reach areas.",
    group: "Service delivery",
    status: "Planned",
  },
  {
    code: "CIT",
    name: "Parent & Citizen Portal",
    description: "Public school directory and learner verification for parents.",
    group: "Citizen services",
    to: "/directory",
    status: "Operational",
  },
  {
    code: "AI",
    name: "AI Analytics & Decision Support",
    description: "Out-of-school risk, staffing gaps and resource allocation modelling.",
    group: "Analytics",
    status: "Planned",
  },
  {
    code: "MOB",
    name: "Mobile Applications",
    description: "Field data collection for county education officers on low bandwidth.",
    group: "Citizen services",
    status: "Planned",
  },
  {
    code: "API",
    name: "Integration & API Gateway",
    description: "Interoperability with treasury, civil registry and development partners.",
    group: "Technical",
    status: "Planned",
  },
  {
    code: "SEC",
    name: "Security & Identity Management",
    description: "Accounts, role-based access control and audit of privileged actions.",
    group: "Technical",
    to: "/administration",
    status: "Operational",
  },
  {
    code: "BI",
    name: "Data Warehouse & Business Intelligence",
    description: "Historical data marts and cross-module reporting.",
    group: "Analytics",
    status: "Planned",
  },
];

export function fullName(record: { first_name: string; last_name: string }) {
  return `${record.first_name} ${record.last_name}`.trim();
}
