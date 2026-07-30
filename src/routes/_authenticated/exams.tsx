import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { RecordManager, type Column, type Field } from "@/components/RecordManager";
import { Badge } from "@/components/ui/badge";
import { EXAM_SERIES, EXAM_STATUS, GRADES, SUBJECTS } from "@/lib/moges";

export const Route = createFileRoute("/_authenticated/exams")({
  head: () => ({
    meta: [
      { title: "Examination Management — MoGEI South Sudan" },
      {
        name: "description",
        content:
          "Candidate registration, examination centres, marking and national certification records.",
      },
      { property: "og:title", content: "Examination Management — MoGEI" },
      { property: "og:description", content: "National examinations candidate register." },
    ],
  }),
  component: ExamsPage,
});

type ExamRow = {
  id: string;
  candidate_number: string;
  exam_series: string;
  exam_year: number;
  centre: string | null;
  subject: string | null;
  score: number;
  grade: string | null;
  status: string;
  school_id: string | null;
  student_id: string | null;
};

const opts = (list: string[]) => list.map((v) => ({ value: v, label: v }));

function ExamsPage() {
  const { data: schools = [] } = useQuery({
    queryKey: ["schools"],
    queryFn: async () => {
      const { data, error } = await supabase.from("schools").select("id, name, code").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });
  const { data: students = [] } = useQuery({
    queryKey: ["students-lookup"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("students")
        .select("id, first_name, last_name, code")
        .order("last_name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const fields: Field[] = [
    { name: "candidate_number", label: "Candidate number", required: true },
    {
      name: "exam_series",
      label: "Examination series",
      type: "select",
      options: opts(EXAM_SERIES),
      defaultValue: EXAM_SERIES[0],
      required: true,
    },
    { name: "exam_year", label: "Examination year", type: "number", defaultValue: new Date().getFullYear(), required: true },
    {
      name: "student_id",
      label: "Learner",
      type: "select",
      options: students.map((s) => ({ value: s.id, label: `${s.first_name} ${s.last_name} (${s.code})` })),
      span: 2,
    },
    {
      name: "school_id",
      label: "School",
      type: "select",
      options: schools.map((s) => ({ value: s.id, label: `${s.name} (${s.code})` })),
      span: 2,
    },
    { name: "centre", label: "Examination centre" },
    { name: "subject", label: "Subject", type: "select", options: opts(SUBJECTS) },
    { name: "score", label: "Mark (%)", type: "number", defaultValue: 0 },
    { name: "grade", label: "Grade", type: "select", options: opts(GRADES), defaultValue: "Pending" },
    { name: "status", label: "Status", type: "select", options: opts(EXAM_STATUS), defaultValue: "Registered", required: true },
    { name: "notes", label: "Remarks", type: "textarea", span: 2 },
  ];

  const schoolName = (id: string | null) => schools.find((s) => s.id === id)?.name ?? "—";

  const columns: Column<ExamRow>[] = [
    { key: "candidate_number", header: "Candidate no." },
    { key: "exam_series", header: "Series" },
    { key: "exam_year", header: "Year" },
    { key: "centre", header: "Centre" },
    { key: "school_id", header: "School", render: (r) => schoolName(r.school_id) },
    { key: "subject", header: "Subject" },
    { key: "score", header: "Mark" },
    { key: "grade", header: "Grade" },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <Badge variant={r.status === "Certified" ? "default" : "secondary"}>{r.status}</Badge>
      ),
    },
  ];

  return (
    <AppShell
      title="Examination Management System (EMS)"
      subtitle="Candidate registration, centres, marking and certification"
    >
      <RecordManager<ExamRow>
        table="exam_registrations"
        singular="Candidate entry"
        fields={fields}
        columns={columns}
        searchKeys={["candidate_number", "centre", "subject", "exam_series"]}
        emptyHint="No candidates registered for examinations yet."
      />
    </AppShell>
  );
}
