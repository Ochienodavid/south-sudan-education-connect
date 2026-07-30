import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { RecordManager, type Column, type Field } from "@/components/RecordManager";
import { Badge } from "@/components/ui/badge";
import { CLASS_LEVELS, DISABILITIES, GENDERS, STATES, STUDENT_STATUS } from "@/lib/moges";

export const Route = createFileRoute("/_authenticated/students")({
  head: () => ({
    meta: [
      { title: "Student Information System — MoGEI South Sudan" },
      {
        name: "description",
        content:
          "Learner registration, enrolment, transfers, promotion and graduation records for schools across South Sudan.",
      },
      { property: "og:title", content: "Student Information System — MoGEI" },
      { property: "og:description", content: "National learner register and enrolment records." },
    ],
  }),
  component: StudentsPage,
});

type StudentRow = {
  id: string;
  code: string;
  first_name: string;
  last_name: string;
  gender: string;
  class_level: string;
  school_id: string | null;
  guardian_name: string | null;
  guardian_phone: string | null;
  disability: string;
  status: string;
};

const opts = (list: string[]) => list.map((v) => ({ value: v, label: v }));

function StudentsPage() {
  const { data: schools = [] } = useQuery({
    queryKey: ["schools"],
    queryFn: async () => {
      const { data, error } = await supabase.from("schools").select("id, name, code").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const schoolOptions = schools.map((s) => ({ value: s.id, label: `${s.name} (${s.code})` }));
  const schoolName = (id: string | null) => schools.find((s) => s.id === id)?.name ?? "Unassigned";

  const fields: Field[] = [
    { name: "code", label: "Learner code", required: true, placeholder: "e.g. SSD-2026-000145" },
    { name: "class_level", label: "Class level", type: "select", options: opts(CLASS_LEVELS), defaultValue: "P1", required: true },
    { name: "first_name", label: "First name", required: true },
    { name: "last_name", label: "Last name", required: true },
    { name: "gender", label: "Gender", type: "select", options: opts(GENDERS), defaultValue: "Male", required: true },
    { name: "date_of_birth", label: "Date of birth", type: "date" },
    { name: "school_id", label: "School", type: "select", options: schoolOptions, span: 2 },
    { name: "guardian_name", label: "Parent / guardian" },
    { name: "guardian_phone", label: "Guardian phone" },
    { name: "county_of_origin", label: "State of origin", type: "select", options: opts(STATES) },
    { name: "disability", label: "Special needs", type: "select", options: opts(DISABILITIES), defaultValue: "None" },
    { name: "enrollment_date", label: "Enrolment date", type: "date" },
    { name: "status", label: "Enrolment status", type: "select", options: opts(STUDENT_STATUS), defaultValue: "Enrolled", required: true },
    { name: "notes", label: "Remarks (discipline, health, transfers)", type: "textarea", span: 2 },
  ];

  const columns: Column<StudentRow>[] = [
    { key: "code", header: "Learner code" },
    { key: "name", header: "Name", render: (r) => `${r.first_name} ${r.last_name}` },
    { key: "gender", header: "Gender" },
    { key: "class_level", header: "Class" },
    { key: "school_id", header: "School", render: (r) => schoolName(r.school_id) },
    { key: "guardian_name", header: "Guardian" },
    { key: "guardian_phone", header: "Guardian phone" },
    { key: "disability", header: "Special needs" },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <Badge variant={r.status === "Enrolled" ? "secondary" : "outline"}>{r.status}</Badge>
      ),
    },
  ];

  return (
    <AppShell
      title="Student Information System (SIS)"
      subtitle="Learner registration, enrolment, transfers and promotion"
    >
      <RecordManager<StudentRow>
        table="students"
        singular="Student"
        fields={fields}
        columns={columns}
        searchKeys={["code", "first_name", "last_name", "guardian_name", "class_level"]}
        emptyHint="No learners registered yet."
      />
    </AppShell>
  );
}
