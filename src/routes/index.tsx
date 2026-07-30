import { createFileRoute, Link } from "@tanstack/react-router";
import { School, GraduationCap, Users, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MODULES } from "@/lib/moges";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MoGEI Integrated Management System — South Sudan" },
      {
        name: "description",
        content:
          "Official national education platform of the Ministry of General Education and Instruction, Republic of South Sudan: school, teacher and learner registries.",
      },
      { property: "og:title", content: "MoGEI Integrated Management System — South Sudan" },
      {
        property: "og:description",
        content:
          "National registries for schools, teachers and learners across the Republic of South Sudan.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-sidebar text-sidebar-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="font-display text-sm text-sidebar-primary">Republic of South Sudan</p>
            <p className="font-display text-lg">Ministry of General Education &amp; Instruction</p>
          </div>
          <Button asChild variant="secondary">
            <Link to="/auth">Officer sign in</Link>
          </Button>
        </div>
        <div className="flag-rule" />
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          National Education Digital Transformation Platform
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight sm:text-5xl">
          One integrated record of every school, teacher and learner in South Sudan.
        </h1>
        <p className="mt-5 max-w-2xl text-muted-foreground">
          The Integrated Management System consolidates the Ministry&apos;s registries, statistics
          and service delivery modules into a single authoritative platform for national, state and
          county education officers.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/auth">
              Access the system <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/directory">Public school directory</Link>
          </Button>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: GraduationCap, title: "Student Information", body: "Registration, enrolment, transfers, promotion and graduation." },
            { icon: Users, title: "Teacher Management", body: "Deployment, licensing, qualification and payroll linkage." },
            { icon: School, title: "School Management", body: "Registration, accreditation, capacity and geo-location." },
            { icon: ShieldCheck, title: "Identity & Access", body: "Role-based control for ministry, state and county officers." },
          ].map((c) => (
            <div key={c.title} className="gov-panel rounded-sm p-5">
              <c.icon className="size-5 text-accent" />
              <h2 className="mt-3 font-display text-base">{c.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t bg-card">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="font-display text-2xl">Platform subsystems</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {MODULES.length} modules covering strategic, operational, technical and citizen-facing
            services.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((m) => (
              <li key={m.code} className="flex gap-3 rounded-sm border p-3">
                <span className="font-display text-xs text-accent">{m.code}</span>
                <span className="text-sm">{m.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="border-t px-6 py-6 text-center text-xs text-muted-foreground">
        Ministry of General Education and Instruction · Juba, Republic of South Sudan
      </footer>
    </div>
  );
}
