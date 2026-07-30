import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "officer" | "viewer";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, loading, user: session?.user ?? null };
}

export function useRoles() {
  const { user } = useSession();
  const [roles, setRoles] = useState<AppRole[]>([]);

  useEffect(() => {
    let active = true;
    if (!user) {
      setRoles([]);
      return;
    }
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (active) setRoles((data ?? []).map((r) => r.role as AppRole));
      });
    return () => {
      active = false;
    };
  }, [user]);

  return {
    roles,
    isAdmin: roles.includes("admin"),
    canWrite: roles.includes("admin") || roles.includes("officer"),
  };
}
