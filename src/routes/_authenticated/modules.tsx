import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MODULES } from "@/lib/moges";

export const Route = createFileRoute("/_authenticated/modules")({
  head: () => ({
    meta: [
      { title: "Platform Subsystems — MoGEI South Sudan" },
      {
        name: "description",
        content:
          "The twenty subsystems of the MoGEI Integrated Management System and their current operational state.",
      },
      { property: "og:title", content: "Platform Subsystems — MoGEI" },
      { property: "og:description", content: "All twenty ministry subsystems in one register." },
    ],
  }),
  component: ModulesPage,
});

function ModulesPage() {
  return (
    <AppShell
      title="Platform subsystems"
      subtitle="Twenty subsystems of the Integrated Management System"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MODULES.map((m) => {
          const body = (
            <Card className="h-full rounded-sm transition-colors hover:border-primary">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="font-display text-base leading-tight">
                    {m.name}
                    <span className="ml-2 text-xs text-muted-foreground">{m.code}</span>
                  </CardTitle>
                  <Badge variant={m.status === "Planned" ? "outline" : "secondary"}>
                    {m.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{m.description}</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                  {m.group}
                </p>
              </CardContent>
            </Card>
          );
          return m.to ? (
            <Link key={m.code} to={m.to as "/dashboard"}>
              {body}
            </Link>
          ) : (
            <div key={m.code}>{body}</div>
          );
        })}
      </div>

    </AppShell>
  );
}
