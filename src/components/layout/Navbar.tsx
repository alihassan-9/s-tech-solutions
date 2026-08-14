"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { useLenis } from "lenis/react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

const NAV_LINKS = [
  { href: "#services", label: "Services", id: "services" },
  { href: "#markets", label: "Markets", id: "markets" },
  { href: "#process", label: "Process", id: "process" },
  { href: "#why-us", label: "Why Us", id: "why-us" },
  { href: "#faq", label: "FAQ", id: "faq" },
];

export function Navbar() {
  const [condensed, setCondensed] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const lenis = useLenis();

  useMotionValueEvent(scrollY, "change", (v) => setCondensed(v > 24));

  // Highlight whichever section currently owns the upper-middle of the screen.
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Freeze the smooth-scroll engine while the mobile sheet is open, otherwise
  // the page keeps gliding underneath it.
  useEffect(() => {
    if (!lenis) return;
    if (menuOpen) lenis.stop();
    else lenis.start();
    return () => lenis.start();
  }, [menuOpen, lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className={`mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-full transition-all duration-500 ${
            condensed
              ? "border border-white/70 bg-white/75 px-4 py-2.5 shadow-float backdrop-blur-xl sm:px-5"
              : "border border-transparent px-2 py-3 sm:px-3"
          }`}
        >
          {/* grid-cols-[1fr_auto_1fr]: the two flanking columns share the
              remaining space equally regardless of how wide their content
              is, so the nav in the middle column sits at the bar's true
              geometric center — justify-between previously just spaced
              three unequal-width groups, pulling the nav toward whichever
              side had less content. */}
          {/* flex, not the default inline anchor: an inline <a> wrapping the
              inline-flex Logo builds a line box around it, and because the
              logo tile carries no text baseline of its own the strut leaves
              roughly 6px of empty descender space *below* the mark. The
              anchor ended up taller than the logo, so centering that taller
              box parked the visible logo above the bar's true center. */}
          <Link
            href="#top"
            aria-label="S-Tech Solutions, back to top"
            data-cursor="link"
            className="flex items-center justify-self-start"
          >
            <Logo />
          </Link>

          <nav className="col-start-2 hidden items-center justify-self-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.id;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-cursor="link"
                  className={`group relative rounded-full px-3.5 py-1.5 text-sm transition-colors duration-200 ${
                    isActive ? "text-brand" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {isActive ? (
                    // Same reasoning as the hover pill below: bg-brand-soft
                    // (#eaf2ff) vanished once the bar condensed to white, so
                    // the active section read as unmarked. A low-opacity wash
                    // of the saturated brand blue (one step stronger than the
                    // hover pill) plus brand-blue text stays visible on both
                    // the white bar and the pale sky behind it.
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-brand/15"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : (
                    // A pill fill that pops in on hover, not shared via
                    // layoutId since several links can be hovered across a
                    // session — this one just fades/scales in per item.
                    // bg-brand-soft (#eaf2ff) was nearly the same pale tone
                    // as the navbar's own background, so the pill was
                    // barely visible on hover — bg-brand/12 uses the
                    // saturated brand blue at low opacity instead, which
                    // reads as a real, visible tint against both the
                    // transparent and condensed (white) navbar states.
                    <span className="absolute inset-0 -z-10 scale-90 rounded-full bg-brand/12 opacity-0 transition-all duration-200 ease-out group-hover:scale-100 group-hover:opacity-100" />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="col-start-3 flex items-center justify-self-end gap-3">
            <Link
              href="/portal"
              data-cursor="link"
              className="group relative hidden rounded-full px-3.5 py-1.5 text-sm text-ink-muted transition-colors duration-200 hover:text-ink sm:inline-block"
            >
              <span className="absolute inset-0 -z-10 scale-90 rounded-full bg-brand/12 opacity-0 transition-all duration-200 ease-out group-hover:scale-100 group-hover:opacity-100" />
              Client Portal
            </Link>
            {/* Straight to email, not the #contact section: the bar's primary
                action should start the conversation, and the section it used
                to scroll to only holds the same mailto behind another click. */}
            <Button
              href="mailto:stechsolutionsofficial@gmail.com"
              variant="primary"
              className="hidden sm:inline-flex"
            >
              Get in touch
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              data-cursor="link"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/70 text-ink backdrop-blur-md lg:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
        </motion.div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[70] lg:hidden"
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, var(--color-sky-2) 0%, var(--color-sky-3) 55%, var(--color-sky-5) 100%)",
              }}
            />

            <div className="relative flex h-full flex-col px-6 pt-6">
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  data-cursor="link"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/70 text-ink"
                >
                  <X className="h-5 w-5" strokeWidth={1.75} />
                </button>
              </div>

              <nav className="mt-14 flex flex-col gap-1">
                {[
                  ...NAV_LINKS,
                  { href: "#contact", label: "Contact", id: "contact" },
                  { href: "/portal", label: "Client Portal", id: "portal" },
                ].map(
                  (link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="block border-b border-ink/10 py-4 text-3xl font-semibold tracking-tight text-ink"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  )
                )}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-auto pb-10"
              >
                <p className="text-xs uppercase tracking-[0.14em] text-ink-muted">
                  Bahawalpur, Pakistan
                </p>
                <a
                  href="mailto:stechsolutionsofficial@gmail.com"
                  className="mt-2 block text-base font-medium text-brand"
                >
                  stechsolutionsofficial@gmail.com
                </a>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
