import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { useRoles } from "@/hooks/useSession";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/administration")({
  head: () => ({
    meta: [
      { title: "System Administration — MoGEI South Sudan" },
      {
        name: "description",
        content:
          "Manage ministry officers and their access rights across the Integrated Management System.",
      },
      { property: "og:title", content: "System Administration — MoGEI" },
      { property: "og:description", content: "Officer accounts and access rights." },
    ],
  }),
  component: AdministrationPage,
});

const ROLES = ["admin", "officer", "viewer"] as const;
type Role = (typeof ROLES)[number];

function AdministrationPage() {
  const { roles, isAdmin } = useRoles();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const [profiles, userRoles] = await Promise.all([
        supabase.from("profiles").select("id, full_name, email, created_at").order("created_at"),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      if (profiles.error) throw profiles.error;
      if (userRoles.error) throw userRoles.error;
      return { profiles: profiles.data ?? [], userRoles: userRoles.data ?? [] };
    },
  });

  const setRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: Role }) => {
      const { error: del } = await supabase.from("user_roles").delete().eq("user_id", userId);
      if (del) throw del;
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Access rights updated");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const profiles = data?.profiles ?? [];
  const roleOf = (id: string): Role =>
    ((data?.userRoles ?? []).find((r) => r.user_id === id)?.role as Role) ?? "viewer";

  return (
    <AppShell
      title="System Administration"
      subtitle="Officer accounts and access rights across the platform"
    >
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle className="font-display text-base">
            Ministry officers
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              your access: {roles.join(", ") || "viewer"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Officer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Access level</TableHead>
                {isAdmin && <TableHead className="text-right">Assign role</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                    No officer accounts found.
                  </TableCell>
                </TableRow>
              )}
              {profiles.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.full_name || "—"}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {roleOf(p.id)}
                    </Badge>
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="inline-flex gap-1">
                        {ROLES.map((r) => (
                          <Button
                            key={r}
                            size="sm"
                            variant={roleOf(p.id) === r ? "default" : "outline"}
                            disabled={setRole.isPending || roleOf(p.id) === r}
                            onClick={() => setRole.mutate({ userId: p.id, role: r })}
                            className="capitalize"
                          >
                            {r}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!isAdmin && (
            <p className="mt-4 text-sm text-muted-foreground">
              Only administrators may change access rights.
            </p>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
