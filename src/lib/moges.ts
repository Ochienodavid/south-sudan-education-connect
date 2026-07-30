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

export const EXAM_SERIES = [
  "Primary Leaving Examination",
  "South Sudan Certificate of Secondary Education",
  "Mock Examination",
  "Technical & Vocational Assessment",
];

export const EXAM_STATUS = ["Registered", "Sat", "Absent", "Marked", "Certified", "Withheld"];

export const GRADES = ["A", "B", "C", "D", "E", "F", "Pending"];

export const HR_ACTION_TYPES = [
  "Posting",
  "Transfer",
  "Promotion",
  "Annual leave",
  "Maternity leave",
  "Study leave",
  "Disciplinary case",
  "Retirement",
];

export const HR_STATUS = ["Pending", "Approved", "Rejected", "Completed"];

export const BUDGET_CATEGORIES = [
  "Capitation grant",
  "Salaries & wages",
  "Infrastructure",
  "Teaching & learning materials",
  "Examinations",
  "Administration",
  "Teacher training",
];

export const FUNDING_SOURCES = [
  "Government of South Sudan",
  "GPE",
  "World Bank",
  "UNICEF",
  "UNESCO",
  "Bilateral partner",
  "Community contribution",
];

export const BUDGET_STATUS = ["Draft", "Approved", "Committed", "Disbursed", "Closed"];

export const DOCUMENT_CATEGORIES = [
  "Circular",
  "Policy",
  "Ministerial order",
  "Guideline",
  "Report",
  "Correspondence",
  "Form",
];

export const DIRECTORATES = [
  "Office of the Minister",
  "Directorate of General Education",
  "Directorate of Planning & Budgeting",
  "Directorate of Quality Assurance",
  "Directorate of Human Resources",
  "National Examinations Council",
  "Directorate of Curriculum Development",
];

export const DOCUMENT_STATUS = ["Active", "Superseded", "Withdrawn", "Draft"];

export const INSPECTION_TYPES = [
  "Routine",
  "Accreditation",
  "Follow-up",
  "Complaint investigation",
  "Examination centre audit",
];

export const INSPECTION_RATINGS = ["Outstanding", "Good", "Satisfactory", "Weak", "Critical"];

export const INSPECTION_STATUS = ["Scheduled", "Completed", "Report issued", "Action pending"];

export const CURRICULUM_TYPES = ["Syllabus", "Textbook", "Teacher guide", "Assessment framework"];

export const CURRICULUM_STATUS = ["Draft", "Under review", "Approved", "In distribution", "Retired"];

export const LESSON_MEDIA = ["Radio", "Video", "Audio", "Printed pack", "Interactive"];

export const LESSON_LANGUAGES = ["English", "Arabic", "Dinka", "Nuer", "Bari", "Zande", "Shilluk"];

export const LESSON_STATUS = ["Draft", "Published", "Broadcast", "Archived"];

export const INTEGRATION_DIRECTIONS = ["Inbound", "Outbound", "Bi-directional"];

export const INTEGRATION_STATUS = ["Active", "Testing", "Suspended", "Retired"];

export const FIELD_REPORT_TYPES = [
  "School visit",
  "Attendance spot-check",
  "Infrastructure survey",
  "Textbook delivery",
  "Emergency report",
];

export const FIELD_REPORT_STATUS = ["Submitted", "Under review", "Verified", "Rejected"];

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
    to: "/exams",
    status: "Operational",
  },
  {
    code: "HRMS",
    name: "Human Resource Management System",
    description: "Establishment, postings, leave and disciplinary case management.",
    group: "Corporate services",
    to: "/hr",
    status: "Operational",
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
    to: "/finance",
    status: "Operational",
  },
  {
    code: "DMS",
    name: "Document Management System",
    description: "Circulars, policies and official correspondence repository.",
    group: "Corporate services",
    to: "/documents",
    status: "Operational",
  },
  {
    code: "IQA",
    name: "Inspection & Quality Assurance",
    description: "School inspection scheduling, findings and improvement plans.",
    group: "Service delivery",
    to: "/inspections",
    status: "Operational",
  },
  {
    code: "CMS",
    name: "Curriculum Management System",
    description: "National curriculum framework, syllabi and textbook distribution.",
    group: "Service delivery",
    to: "/curriculum",
    status: "Operational",
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
    to: "/elearning",
    status: "Operational",
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
    to: "/analytics",
    status: "Operational",
  },
  {
    code: "MOB",
    name: "Mobile Applications",
    description: "Field data collection for county education officers on low bandwidth.",
    group: "Citizen services",
    to: "/field-reports",
    status: "Operational",
  },
  {
    code: "API",
    name: "Integration & API Gateway",
    description: "Interoperability with treasury, civil registry and development partners.",
    group: "Technical",
    to: "/integrations",
    status: "Operational",
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
    to: "/intelligence",
    status: "Operational",
  },
];

export function fullName(record: { first_name: string; last_name: string }) {
  return `${record.first_name} ${record.last_name}`.trim();
}
