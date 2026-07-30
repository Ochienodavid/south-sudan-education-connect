// Lovable integration removed. Expose a lightweight adapter that uses the
// existing Supabase client so code that previously called `lovable.auth.*`
// continues to work without the @lovable.dev dependency.
import { supabase } from "../supabase/client";

export const lovable = {
  auth: {
    signInWithOAuth: async (provider: "google" | "apple" | "microsoft" | "lovable", opts?: { redirect_uri?: string }) => {
      return await supabase.auth.signInWithOAuth({ provider: provider as any, options: { redirectTo: opts?.redirect_uri } as any });
    },
  },
};
