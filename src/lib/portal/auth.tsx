"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { PortalClient } from "@/lib/portal/types";

// Renamed from the old stech-portal-demo-* keys so any account left over
// from the seeded demo build is dropped rather than resurrected.
const CLIENTS_KEY = "stech-portal-clients";
const SESSION_KEY = "stech-portal-session";

export type SignupInput = {
  companyName: string;
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
    setClient(existing);
    return { error: null };
  };

  const signup: PortalAuthContextValue["signup"] = async (input) => {
    const companyName = input.companyName.trim();
    const contactName = input.contactName.trim();
    const email = input.email.trim();

    if (!companyName || !contactName || !email || !input.password.trim()) {
      return { error: "Fill in every field." };
    }

    const clients = readClients();
    if (clients.some((c) => c.email.toLowerCase() === email.toLowerCase())) {
      return { error: "An account with that email already exists. Try signing in instead." };
    }

    const newClient: PortalClient = {
      id: `client-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      companyName,
      contactName,
      email,
    };
    writeClients([...clients, newClient]);
    window.localStorage.setItem(SESSION_KEY, newClient.id);
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
    setClient(null);
  };

  return (
    <PortalAuthContext.Provider value={{ client, loading, login, signup, updateProfile, logout }}>
      {children}
    </PortalAuthContext.Provider>
  );
}

export function usePortalAuth() {
  const ctx = useContext(PortalAuthContext);
  if (!ctx) throw new Error("usePortalAuth must be used within PortalAuthProvider");
  return ctx;
}
