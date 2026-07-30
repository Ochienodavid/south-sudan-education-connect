import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  GraduationCap,
  Users,
  School,
  LayoutDashboard,
  BarChart3,
  Map,
  Banknote,
  ShieldCheck,
  BookOpen,
  LogOut,
  Menu,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRoles, useSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "National Dashboard", icon: LayoutDashboard },
  { to: "/students", label: "Students (SIS)", icon: GraduationCap },
  { to: "/teachers", label: "Teachers (TMS)", icon: Users },
  { to: "/schools", label: "Schools (SMS)", icon: School },
  { to: "/emis", label: "EMIS Statistics", icon: BarChart3 },
  { to: "/gis", label: "GIS & Mapping", icon: Map },
  { to: "/payroll", label: "Payroll", icon: Banknote },
  { to: "/exams", label: "Examinations (EMS)", icon: BookOpen },
  { to: "/hr", label: "Human Resources (HRMS)", icon: Users },
  { to: "/finance", label: "Finance (FMS)", icon: Banknote },
  { to: "/inspections", label: "Quality Assurance (IQA)", icon: ShieldCheck },
  { to: "/curriculum", label: "Curriculum (CMS)", icon: BookOpen },
  { to: "/elearning", label: "E-Learning (ELP)", icon: BookOpen },
  { to: "/documents", label: "Documents (DMS)", icon: BookOpen },
  { to: "/field-reports", label: "Field Reports (MOB)", icon: Map },
  { to: "/directory", label: "Citizen Directory (CIT)", icon: School },
  { to: "/analytics", label: "Early Warning (AI)", icon: BarChart3 },
  { to: "/intelligence", label: "Reporting (BI)", icon: BarChart3 },
  { to: "/integrations", label: "API Gateway", icon: ShieldCheck },
  { to: "/modules", label: "Platform Modules", icon: BookOpen },
  { to: "/administration", label: "Administration", icon: ShieldCheck },
] as const;

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useSession();
  const { roles } = useRoles();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:static lg:flex",
          open ? "flex" : "hidden",
        )}
      >
        <div className="border-b border-sidebar-border px-5 py-5">
          <p className="font-display text-sm leading-tight text-sidebar-primary">
            Republic of South Sudan
          </p>
          <p className="mt-1 font-display text-base leading-snug">
            Ministry of General Education &amp; Instruction
          </p>
          <p className="mt-2 text-xs uppercase tracking-widest text-sidebar-foreground/60">
            Integrated Management System
          </p>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-4 text-xs">
          <p className="truncate">{user?.email}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {roles.map((r) => (
              <Badge key={r} variant="secondary" className="capitalize">
                {r}
              </Badge>
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={signOut} className="mt-3 w-full justify-start">
            <LogOut className="size-4" /> Sign out
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b bg-card">
          <div className="flex items-center gap-4 px-5 py-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              <Menu className="size-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-display text-xl">{title}</h1>
              {subtitle && <p className="truncate text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {actions}
          </div>
          <div className="flag-rule" />
        </header>
        <main className="flex-1 p-5">{children}</main>
        <footer className="border-t px-5 py-4 text-xs text-muted-foreground">
          Official system of the Ministry of General Education and Instruction, Juba. Access is
          logged and restricted to authorised officers.
        </footer>
      </div>
    </div>
  );
}
