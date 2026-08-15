"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { PortalClient } from "@/lib/portal/types";

// Renamed from the old stech-portal-demo-* keys so any account left over
// from the seeded demo build is dropped rather than resurrected.
const CLIENTS_KEY = "stech-portal-clients";
const SESSION_KEY = "stech-portal-session";

/**
 * Where this tab is in a sign-out, which is what tells a protected page
 * whether to send someone to the login form or all the way out to the public
 * site. Two stages, because those are two different moments:
 *
 * - "leaving": sign out was just clicked and its redirect hasn't landed yet.
 *   That redirect should go to the login form, as it always has.
 * - "settled": the visitor is out and looking at the login form. Any portal
 *   page reached from here came from browser history, so it should hand them
 *   back to the public site instead of the login form.
 *
 * sessionStorage rather than localStorage: this is about one tab's history,
 * and it should not follow the visitor into a new tab. Plain storage rather
 * than React state on purpose: writing it must not re-render anything, or
 * flipping to "settled" as the login page mounts could re-fire the guard on
 * the page being left and bounce the visitor somewhere else mid-transition.
 */
const SIGNED_OUT_KEY = "stech-portal-signed-out";

function readSignOutStage(): "leaving" | "settled" | null {
  const raw = window.sessionStorage.getItem(SIGNED_OUT_KEY);
  return raw === "leaving" || raw === "settled" ? raw : null;
}

/**
 * Called by the login page once the post-sign-out redirect has landed. From
 * that point on, a protected page means the visitor pressed Back.
 */
export function settleSignOut(): void {
  if (readSignOutStage() !== "leaving") return;
  window.sessionStorage.setItem(SIGNED_OUT_KEY, "settled");
}

/** Where someone without a session belongs: see useRequireClient() below. */
function exitTarget(): string {
  return readSignOutStage() === "settled" ? "/" : "/portal";
}

export type SignupInput = {
  /** Optional: see PortalClient.companyName. */
  companyName?: string;
  contactName: string;
  email: string;
  password: string;
};

/**
 * Placeholder auth for the portal. There's no backend behind this yet, so
 * "signing up" writes a client record to localStorage instead of a real
 * users table, and "signing in" looks one up by email on that same device.
 * No password is verified, which is why the sign-in screen says plainly
 * that accounts live on this device only.
 *
 * This entire file is what gets replaced by real Supabase auth
 * (supabase.auth.signUp / signInWithPassword, a session from
 * supabase.auth.getSession, and so on). The usePortalAuth() contract
 * (client / login / signup / updateProfile / logout / loading) is written to
 * match that shape so the pages using it won't need to change much when
 * it's real.
 */
type PortalAuthContextValue = {
  client: PortalClient | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (input: SignupInput) => Promise<{ error: string | null }>;
  updateProfile: (updates: Partial<Pick<PortalClient, "companyName" | "contactName" | "email">>) => void;
  logout: () => void;
};

const PortalAuthContext = createContext<PortalAuthContextValue | null>(null);

function readClients(): PortalClient[] {
  try {
    const raw = window.localStorage.getItem(CLIENTS_KEY);
    return raw ? (JSON.parse(raw) as PortalClient[]) : [];
  } catch {
    return [];
  }
}

function writeClients(clients: PortalClient[]): void {
  window.localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

export function PortalAuthProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<PortalClient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sync = () => {
      const sessionClientId = window.localStorage.getItem(SESSION_KEY);
      if (!sessionClientId) {
        setClient(null);
        setLoading(false);
        return;
      }
      const found = readClients().find((c) => c.id === sessionClientId) ?? null;
      setClient(found);
      setLoading(false);
    };
    sync();

    // Pressing Back can restore a whole portal page from the back/forward
    // cache, JavaScript state and all, which means a page rendered while
    // signed in comes back looking signed in: the provider is never
    // remounted, so nothing notices the session is gone. `pageshow` with
    // persisted set is the one signal for that restore, and re-reading
    // storage there drops the stale client so the page's guard can act.
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) sync();
    };
    // Same staleness through a different door: signing out in one tab should
    // not leave another tab holding a live-looking session.
    const onStorage = (event: StorageEvent) => {
      if (event.key === SESSION_KEY || event.key === CLIENTS_KEY) sync();
    };

    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const login: PortalAuthContextValue["login"] = async (email, password) => {
    if (!email.trim() || !password.trim()) {
      return { error: "Enter an email and password." };
    }
    // The password isn't checked (there's nothing to check it against yet),
    // but an unknown email is a real miss: with no seeded account to fall
    // back on, signing in only works for someone who signed up on this
    // device.
    const existing = readClients().find(
      (c) => c.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!existing) {
      return { error: "No account found for that email on this device. Create one to get started." };
    }
    window.localStorage.setItem(SESSION_KEY, existing.id);
    window.sessionStorage.removeItem(SIGNED_OUT_KEY);
    setClient(existing);
    return { error: null };
  };

  const signup: PortalAuthContextValue["signup"] = async (input) => {
    // Company name is the one field that can be left blank: a solo founder or
    // a freelancer has no company to type, and turning them away over it
    // would be absurd.
    const companyName = input.companyName?.trim() ?? "";
    const contactName = input.contactName.trim();
    const email = input.email.trim();

    if (!contactName || !email || !input.password.trim()) {
      return { error: "Enter your name, email, and a password." };
    }

    const clients = readClients();
    if (clients.some((c) => c.email.toLowerCase() === email.toLowerCase())) {
      return { error: "An account with that email already exists. Try signing in instead." };
    }

    const newClient: PortalClient = {
      id: `client-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      // undefined rather than "", so "has no company" is one state in
      // storage instead of two that read differently.
      companyName: companyName || undefined,
      contactName,
      email,
    };
    writeClients([...clients, newClient]);
    window.localStorage.setItem(SESSION_KEY, newClient.id);
    window.sessionStorage.removeItem(SIGNED_OUT_KEY);
    setClient(newClient);
    return { error: null };
  };

  const updateProfile: PortalAuthContextValue["updateProfile"] = (updates) => {
    if (!client) return;
    const updated: PortalClient = { ...client, ...updates };
    writeClients(readClients().map((c) => (c.id === client.id ? updated : c)));
    setClient(updated);
  };

  const logout = () => {
    window.localStorage.removeItem(SESSION_KEY);
    window.sessionStorage.setItem(SIGNED_OUT_KEY, "leaving");
    setClient(null);
  };

  return (
    <PortalAuthContext.Provider
      value={{ client, loading, login, signup, updateProfile, logout }}
    >
      {children}
    </PortalAuthContext.Provider>
  );
}

export function usePortalAuth() {
  const ctx = useContext(PortalAuthContext);
  if (!ctx) throw new Error("usePortalAuth must be used within PortalAuthProvider");
  return ctx;
}

/**
 * Guard for every page behind the portal. Call it at the top of the page;
 * it returns the same client/loading pair usePortalAuth() would.
 *
 * Where it sends someone without a session is the whole point:
 *
 * - Never signed out here (a cold link straight to /portal/dashboard, say):
 *   the login form, which is what they need.
 * - Signed out in this tab: the public site, not the login form. Browser
 *   history still holds every portal page visited before signing out, and
 *   JavaScript cannot delete those entries. Sending each one to the login
 *   form meant Back walked the visitor through the whole stack, bouncing off
 *   a login screen at each step and never reaching the site. Landing them on
 *   "/" instead means one Back press leaves the portal, and any further
 *   presses keep them on the public site rather than crawling backwards.
 */
export function useRequireClient() {
  const { client, loading } = usePortalAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || client) return;
    router.replace(exitTarget());
  }, [client, loading, router]);

  // The back/forward cache needs its own exit, and a different kind of one.
  // A restored page brings back a router instance whose history state no
  // longer matches the tab: its replace() tears the page down to nothing but
  // never changes the URL, which is exactly the "blank portal page you can
  // keep pressing Back through" this guard exists to prevent. A real
  // navigation is the only reliable way out of a restored document.
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      if (window.localStorage.getItem(SESSION_KEY)) return;
      window.location.replace(exitTarget());
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return { client, loading };
}
