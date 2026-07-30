import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/directory")({
  head: () => ({
    meta: [
      { title: "School Directory — MoGEI South Sudan" },
      {
        name: "description",
        content:
          "Searchable directory of registered schools with head teacher and contact details for citizens and partners.",
      },
      { property: "og:title", content: "School Directory — MoGEI" },
      { property: "og:description", content: "Find a registered school in South Sudan." },
    ],
  }),
  component: DirectoryPage,
});

function DirectoryPage() {
  const [q, setQ] = useState("");
  const { data: schools = [], isLoading } = useQuery({
    queryKey: ["schools"],
    queryFn: async () => {
      const { data, error } = await supabase.from("schools").select("*").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return schools;
    return schools.filter((s) =>
      [s.name, s.code, s.state, s.county, s.payam, s.head_teacher]
        .some((v) => String(v ?? "").toLowerCase().includes(t)),
    );
  }, [schools, q]);

  return (
    <AppShell
      title="Citizen & Parent Portal (CIT)"
      subtitle="Searchable directory of registered schools and contact points"
    >
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by school, code, state, county or head teacher…"
        className="mb-5 max-w-xl rounded-sm"
      />
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading directory…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No schools match this search.{" "}
          <Link to="/schools" className="text-primary underline">
            Register a school
          </Link>
          .
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((s) => (
            <Card key={s.id} className="rounded-sm">
              <CardContent className="space-y-1 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-display text-base leading-tight">{s.name}</h2>
                  <Badge variant={s.accredited ? "default" : "secondary"}>
                    {s.accredited ? "Accredited" : "Provisional"}
                  </Badge>
                </div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.code}</p>
                <p className="text-sm">
                  {s.level} · {s.ownership}
                </p>
                <p className="text-sm text-muted-foreground">
                  {[s.payam, s.county, s.state].filter(Boolean).join(", ") || "Location not recorded"}
                </p>
                <p className="text-sm">Head teacher: {s.head_teacher || "—"}</p>
                <p className="text-sm">Contact: {s.phone || s.email || "—"}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
