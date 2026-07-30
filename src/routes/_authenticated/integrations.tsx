import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { RecordManager, type Column, type Field } from "@/components/RecordManager";
import { Badge } from "@/components/ui/badge";
import { INTEGRATION_DIRECTIONS, INTEGRATION_STATUS } from "@/lib/moges";

export const Route = createFileRoute("/_authenticated/integrations")({
  head: () => ({
    meta: [
      { title: "Integration & API Gateway — MoGEI South Sudan" },
      {
        name: "description",
        content:
          "Registry of data-exchange partners, endpoints and interoperability agreements with the ministry.",
      },
      { property: "og:title", content: "Integration & API Gateway — MoGEI" },
      { property: "og:description", content: "Partner data exchange and interoperability registry." },
    ],
  }),
  component: IntegrationsPage,
});

type IntRow = {
  id: string;
  name: string;
  partner: string | null;
  direction: string;
  endpoint: string | null;
  last_sync: string | null;
  status: string;
};

const opts = (l: string[]) => l.map((v) => ({ value: v, label: v }));

const fields: Field[] = [
  { name: "name", label: "Integration name", required: true },
  { name: "partner", label: "Partner institution" },
  { name: "direction", label: "Direction", type: "select", options: opts(INTEGRATION_DIRECTIONS), defaultValue: "Outbound", required: true },
  { name: "status", label: "Status", type: "select", options: opts(INTEGRATION_STATUS), defaultValue: "Active", required: true },
  { name: "endpoint", label: "Endpoint", span: 2, placeholder: "https://…" },
  { name: "last_sync", label: "Last synchronisation", type: "date" },
  { name: "notes", label: "Scope of data shared", type: "textarea", span: 2 },
];

const columns: Column<IntRow>[] = [
  { key: "name", header: "Integration" },
  { key: "partner", header: "Partner" },
  { key: "direction", header: "Direction" },
  { key: "endpoint", header: "Endpoint" },
  { key: "last_sync", header: "Last sync" },
  {
    key: "status",
    header: "Status",
    render: (r) => <Badge variant={r.status === "Active" ? "default" : "secondary"}>{r.status}</Badge>,
  },
];

function IntegrationsPage() {
  return (
    <AppShell
      title="Integration & API Gateway (API)"
      subtitle="Interoperability with partner institutions and national systems"
    >
      <RecordManager<IntRow>
        table="integrations"
        singular="Integration"
        fields={fields}
        columns={columns}
        searchKeys={["name", "partner", "direction", "status"]}
        emptyHint="No integrations registered yet."
      />
    </AppShell>
  );
}
