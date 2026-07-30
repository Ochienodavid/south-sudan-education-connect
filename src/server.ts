import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);

      // Server-side admin endpoint for role management.
      if (url.pathname === "/api/admin/set-role" && request.method === "POST") {
        try {
          const body = await request.json().catch(() => null);
          const { userId, role } = body ?? {};
          if (!userId || !role) {
            return new Response(JSON.stringify({ error: 'Missing userId or role' }), { status: 400, headers: { 'content-type': 'application/json' } });
          }

          const { supabaseAdmin } = await import("./integrations/supabase/client.server");

          // Try to identify actor from Authorization Bearer token if provided
          let actorId: string | null = null;
          const authHeader = request.headers.get('authorization') || '';
          const tokenMatch = authHeader.match(/^Bearer\s+(.*)$/i);
          if (tokenMatch) {
            const token = tokenMatch[1];
            try {
              // supabaseAdmin.auth.getUser may or may not exist depending on client version
              // Try common method names
              if ((supabaseAdmin as any).auth?.getUser) {
                const res = await (supabaseAdmin as any).auth.getUser(token);
                actorId = res?.data?.user?.id ?? null;
              } else if ((supabaseAdmin as any).auth?.getUserByCookie) {
                const res = await (supabaseAdmin as any).auth.getUserByCookie({ cookie: token } as any);
                actorId = res?.data?.user?.id ?? null;
              }
            } catch (e) {
              // ignore — actorId remains null
            }
          }

          // Upsert role with service role key (supabaseAdmin bypasses RLS)
          const upsertRes = await (supabaseAdmin as any).from('user_roles').upsert(
            { user_id: userId, role },
            { onConflict: 'user_id', returning: 'minimal' },
          );
          if (upsertRes.error) throw upsertRes.error;

          // Insert structured audit log via RPC (uses service role key)
          try {
            const actorEmail = null; // could attempt to resolve from token if needed
            const rpcRes = await (supabaseAdmin as any).rpc('log_audit', {
              actor_id: actorId,
              actor_email: actorEmail,
              action: 'role_change',
              entity: 'user_roles',
              entity_id: userId,
              details: { role },
            });
            if ((rpcRes as any)?.error) console.error('log_audit rpc error', (rpcRes as any).error);
          } catch (e) {
            console.error('log_audit call failed', e);
          }

          return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } });
        } catch (err: any) {
          console.error('set-role handler error', err);
          return new Response(JSON.stringify({ error: String(err?.message ?? err) }), { status: 500, headers: { 'content-type': 'application/json' } });
        }
      }

      // Server-side admin endpoint: list users + roles for admin UI
      if (url.pathname === "/api/admin/users" && request.method === "GET") {
        try {
          const { supabaseAdmin } = await import("./integrations/supabase/client.server");
          const profilesRes = await (supabaseAdmin as any).from('profiles').select('id, full_name, email, created_at');
          if (profilesRes.error) throw profilesRes.error;
          const rolesRes = await (supabaseAdmin as any).from('user_roles').select('user_id, role');
          if (rolesRes.error) throw rolesRes.error;
          return new Response(JSON.stringify({ profiles: profilesRes.data ?? [], userRoles: rolesRes.data ?? [] }), { status: 200, headers: { 'content-type': 'application/json' } });
        } catch (e: any) {
          console.error('admin/users handler error', e);
          return new Response(JSON.stringify({ error: String(e?.message ?? e) }), { status: 500, headers: { 'content-type': 'application/json' } });
        }
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
