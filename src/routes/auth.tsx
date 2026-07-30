import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Officer Sign In — MoGEI Integrated Management System" },
      {
        name: "description",
        content:
          "Secure sign in for Ministry of General Education and Instruction officers to the national education management system.",
      },
      { property: "og:title", content: "Officer Sign In — MoGEI South Sudan" },
      {
        property: "og:description",
        content: "Restricted access for authorised ministry, state and county education officers.",
      },
    ],
  }),
  component: AuthPage,
});

const credentials = z.object({
  email: z.string().trim().email("Enter a valid official email address").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    const parsed = credentials.safeParse({ email, password });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setBusy(false);
    if (error) return toast.error(error.message);
    navigate({ to: "/dashboard", replace: true });
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    const parsed = credentials.safeParse({ email, password });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    if (fullName.trim().length < 2) return toast.error("Enter your full official name");
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      ...parsed.data,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName.trim() },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account requested. Check your inbox to confirm, then sign in.");
  }

  async function google() {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
    if (error) return toast.error('Google sign-in failed. Try again.');
    // If PostgREST returns a redirect url, navigate there; otherwise check session
    if ((data as any)?.url) {
      window.location.href = (data as any).url;
      return;
    }
    const session = await supabase.auth.getSession();
    if (session.data.session) navigate({ to: '/dashboard', replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="bg-sidebar px-6 py-6 text-sidebar-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <Link to="/" className="font-display text-sm text-sidebar-primary">
              Republic of South Sudan
            </Link>
            <p className="font-display text-lg">Ministry of General Education &amp; Instruction</p>
          </div>
          <div className="rounded-full border border-sidebar-border/60 bg-sidebar-accent/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-sidebar-foreground/80">
            Secure access portal
          </div>
        </div>
      </header>
      <div className="flag-rule" />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="gov-panel w-full max-w-md rounded-sm p-6">
          <h1 className="font-display text-xl">Integrated Management System</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Restricted to authorised education officers.
          </p>

          <Tabs defaultValue="signin" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Request access</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={signIn} className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="email">Official email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Verifying…" : "Sign in"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={signUp} className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="name">Full official name</Label>
                  <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={120} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="email2">Official email</Label>
                  <Input id="email2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="password2">Password</Label>
                  <Input id="password2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Submitting…" : "Request access"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>
          <Button variant="outline" className="w-full" onClick={google}>
            Continue with Google
          </Button>
        </div>
      </main>
    </div>
  );
}
