import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { RecordManager, type Column, type Field } from "@/components/RecordManager";
import { Badge } from "@/components/ui/badge";
import { HR_ACTION_TYPES, HR_STATUS } from "@/lib/moges";

export const Route = createFileRoute("/_authenticated/hr")({
  head: () => ({
    meta: [
      { title: "Human Resource Management — MoGEI South Sudan" },
      {
        name: "description",
        content:
          "Postings, transfers, promotions, leave and disciplinary cases for the teaching service establishment.",
      },
      { property: "og:title", content: "Human Resource Management — MoGEI" },
      { property: "og:description", content: "Establishment, postings, leave and case management." },
    ],
  }),
  component: HrPage,
});

type HrRow = {
  id: string;
  reference: string;
  teacher_id: string | null;
  action_type: string;
  from_school_id: string | null;
  to_school_id: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
};

const opts = (l: string[]) => l.map((v) => ({ value: v, label: v }));

function HrPage() {
  const { data: schools = [] } = useQuery({
    queryKey: ["schools"],
    queryFn: async () => {
      const { data, error } = await supabase.from("schools").select("id, name, code").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });
  const { data: teachers = [] } = useQuery({
    queryKey: ["teachers-lookup"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teachers")
        .select("id, first_name, last_name, code")
        .order("last_name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const schoolOpts = schools.map((s) => ({ value: s.id, label: `${s.name} (${s.code})` }));
  const schoolName = (id: string | null) => schools.find((s) => s.id === id)?.name ?? "—";
  const teacherName = (id: string | null) => {
    const t = teachers.find((x) => x.id === id);
    return t ? `${t.first_name} ${t.last_name}` : "—";
  };

  const fields: Field[] = [
    { name: "reference", label: "Action reference", required: true, placeholder: "e.g. HR/2026/0431" },
    { name: "action_type", label: "Action type", type: "select", options: opts(HR_ACTION_TYPES), defaultValue: "Posting", required: true },
    {
      name: "teacher_id",
      label: "Officer / teacher",
      type: "select",
      options: teachers.map((t) => ({ value: t.id, label: `${t.first_name} ${t.last_name} (${t.code})` })),
      span: 2,
    },
    { name: "from_school_id", label: "From school", type: "select", options: schoolOpts },
    { name: "to_school_id", label: "To school", type: "select", options: schoolOpts },
    { name: "start_date", label: "Effective from", type: "date" },
    { name: "end_date", label: "Effective to", type: "date" },
    { name: "status", label: "Status", type: "select", options: opts(HR_STATUS), defaultValue: "Pending", required: true },
    { name: "details", label: "Details / justification", type: "textarea", span: 2 },
  ];

  const columns: Column<HrRow>[] = [
    { key: "reference", header: "Reference" },
    { key: "action_type", header: "Action" },
    { key: "teacher_id", header: "Officer", render: (r) => teacherName(r.teacher_id) },
    { key: "from_school_id", header: "From", render: (r) => schoolName(r.from_school_id) },
    { key: "to_school_id", header: "To", render: (r) => schoolName(r.to_school_id) },
    { key: "start_date", header: "Effective from" },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <Badge variant={r.status === "Approved" || r.status === "Completed" ? "default" : "secondary"}>
          {r.status}
        </Badge>
      ),
    },
  ];

  return (
    <AppShell
      title="Human Resource Management System (HRMS)"
      subtitle="Establishment, postings, leave and disciplinary case management"
    >
      <RecordManager<HrRow>
        table="staff_actions"
        singular="Personnel action"
        fields={fields}
        columns={columns}
        searchKeys={["reference", "action_type", "status", "details"]}
        emptyHint="No personnel actions recorded yet."
      />
    </AppShell>
  );
}
