import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession, useRoles } from "@/hooks/useSession";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UserProfile() {
  const navigate = useNavigate();
  const { user } = useSession();
  const { roles, isAdmin } = useRoles();
  const [open, setOpen] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pending, setPending] = useState(false);

  if (!user) {
    return (
      <div className="ml-2">
        <Button variant="outline" size="sm" onClick={() => navigate({ to: "/auth" })}>
          Sign in
        </Button>
      </div>
    );
  }

  const initials = (user?.email || "?")
    .split("@")[0]
    .split(/[._-]/)
    .map((s) => s[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  }

  async function changePassword() {
    if (!pwd || pwd.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setPending(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pwd });
      if (error) throw error;
      toast.success("Password changed");
      setOpen(false);
      setPwd("");
    } catch (e: any) {
      toast.error(e.message || String(e));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="ml-4 flex items-center gap-3">
      <div className="hidden md:flex flex-col text-right mr-2">
        <span className="text-xs">{user.email}</span>
        <span className="text-[11px] text-muted-foreground">{roles.join(", ") || "viewer"}</span>
      </div>
      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary-foreground font-medium"
          aria-label="User menu"
        >
          {initials || "U"}
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-44 rounded-md border bg-card p-2 shadow-lg z-50">
            <div className="py-1">
              <button
                className="w-full text-left px-2 py-2 text-sm hover:bg-muted/50 rounded"
                onClick={() => {
                  setOpen(false);
                  navigate({ to: "/profile" });
                }}
              >
                Profile
              </button>
              <button
                className="w-full text-left px-2 py-2 text-sm hover:bg-muted/50 rounded"
                onClick={() => {
                  setOpen(false);
                  setTimeout(() => setOpen(true), 0);
                }}
              >
                Change password
              </button>
              {isAdmin && (
                <button
                  className="w-full text-left px-2 py-2 text-sm hover:bg-muted/50 rounded"
                  onClick={() => {
                    setOpen(false);
                    navigate({ to: "/administration" });
                  }}
                >
                  Administration
                </button>
              )}
              <div className="border-t my-2" />
              <button
                className="w-full text-left px-2 py-2 text-sm text-destructive hover:bg-muted/50 rounded"
                onClick={() => signOut()}
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            <Label htmlFor="new-pw">New password</Label>
            <Input
              id="new-pw"
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="At least 6 characters"
            />
          </div>
          <DialogFooter>
            <div className="flex w-full justify-between">
              <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
                Cancel
              </Button>
              <Button onClick={changePassword} disabled={pending}>
                {pending ? "Saving…" : "Change password"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
