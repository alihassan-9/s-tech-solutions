"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "@/components/layout/Logo";
import { Sidebar } from "@/components/portal/Sidebar";
import type { ReactNode } from "react";

const SIDEBAR_WIDTH = "w-[280px]";

/**
 * Sidebar-based app shell for the portal — replaces the old top navbar.
 * Persistent on desktop, a slide-in drawer on smaller screens. The sky
 * background, cursor, and scroll progress bar are already global from the
 * root layout, so this only adds the sidebar + main content frame.
 */
export function PortalShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside
        className={`${SIDEBAR_WIDTH} hidden shrink-0 border-r border-white/60 bg-white/50 backdrop-blur-xl lg:block`}
      >
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-white/60 bg-white/70 px-5 py-3.5 backdrop-blur-xl lg:hidden">
        <Logo />
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          data-cursor="link"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/70 text-ink"
        >
          <Menu className="h-4.5 w-4.5" strokeWidth={1.75} />
        </button>
      </div>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-ink/20 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`relative h-full ${SIDEBAR_WIDTH} bg-white shadow-lift`}
            >
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                data-cursor="link"
                className="absolute right-4 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 text-ink"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <main className="min-w-0 flex-1 pt-16 lg:pt-0">{children}</main>
    </div>
  );
}
