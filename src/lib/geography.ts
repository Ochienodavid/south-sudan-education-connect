export type SchoolGeoRow = {
  id: string;
  name: string;
  state: string;
  county: string | null;
  capacity: number;
  status: string;
  accredited: boolean;
};

export type StudentGeoRow = {
  id: string;
  school_id: string | null;
  status: string;
  gender: string;
};

export type TeacherGeoRow = {
  id: string;
  school_id: string | null;
  status: string;
  monthly_salary: number;
};

export type GeoCountySummary = {
  county: string;
  schools: number;
  learners: number;
  teachers: number;
  accreditedSchools: number;
};

export type GeoStateSummary = {
  state: string;
  schools: number;
  learners: number;
  teachers: number;
  accreditedSchools: number;
  counties: GeoCountySummary[];
};

export function buildGeoSummary({
  schools,
  students,
  teachers,
}: {
  schools: SchoolGeoRow[];
  students: StudentGeoRow[];
  teachers: TeacherGeoRow[];
}): GeoStateSummary[] {
  const stateBuckets = new Map<string, GeoStateSummary>();

  const getOrCreateState = (state: string): GeoStateSummary => {
    const existing = stateBuckets.get(state);
    if (existing) return existing;
    const created: GeoStateSummary = {
      state,
      schools: 0,
      learners: 0,
      teachers: 0,
      accreditedSchools: 0,
      counties: [],
    };
    stateBuckets.set(state, created);
    return created;
  };

  schools.forEach((school) => {
    const state = getOrCreateState(school.state || "Unassigned");
    state.schools += 1;
    if (school.accredited) state.accreditedSchools += 1;

    const county = (school.county || "Unassigned").trim() || "Unassigned";
    const countyRow = state.counties.find((entry) => entry.county === county);
    if (countyRow) {
      countyRow.schools += 1;
      if (school.accredited) countyRow.accreditedSchools += 1;
    } else {
      state.counties.push({ county, schools: 1, learners: 0, teachers: 0, accreditedSchools: school.accredited ? 1 : 0 });
    }
  });

  students.forEach((student) => {
    if (!student.school_id) return;
    const school = schools.find((entry) => entry.id === student.school_id);
    if (!school) return;
    const state = getOrCreateState(school.state || "Unassigned");
    if (student.status === "Enrolled") {
      state.learners += 1;
      const county = (school.county || "Unassigned").trim() || "Unassigned";
      const countyRow = state.counties.find((entry) => entry.county === county);
      if (countyRow) countyRow.learners += 1;
    }
  });

  teachers.forEach((teacher) => {
    if (!teacher.school_id) return;
    const school = schools.find((entry) => entry.id === teacher.school_id);
    if (!school) return;
    const state = getOrCreateState(school.state || "Unassigned");
    if (teacher.status === "Active") {
      state.teachers += 1;
      const county = (school.county || "Unassigned").trim() || "Unassigned";
      const countyRow = state.counties.find((entry) => entry.county === county);
      if (countyRow) countyRow.teachers += 1;
    }
  });

  return Array.from(stateBuckets.values()).sort((a, b) => a.state.localeCompare(b.state));
}
