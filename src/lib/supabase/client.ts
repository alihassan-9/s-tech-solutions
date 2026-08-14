import { createClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client for the S-Tech CRM project.
 *
 * Not wired into the portal yet — src/lib/portal/mock-data.ts and
 * src/lib/portal/auth.tsx currently serve demo data instead. Once the CRM
 * project is reachable and its schema is known, the portal's data-fetching
 * functions (getProjectsForClient, etc.) and PortalAuthProvider's
 * login/logout should be rewritten to call this client — the rest of the UI
 * shouldn't need to change, since it consumes the same PortalProject /
 * PortalTask / PortalDeliverable / PortalUpdate shapes either way.
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in
 * .env.local — the anon key is the legacy JWT-format key (matches what the
 * CRM's own codebase uses), not the newer sb_publishable_... format. Both
 * are safe to expose client-side by design, but every table this client
 * touches needs row-level security policies restricting each client to
 * their own rows before this goes anywhere near real data.
 */
function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. Set them in .env.local.");
  }

  return createClient(url, key);
}

export { getSupabaseBrowserClient };
