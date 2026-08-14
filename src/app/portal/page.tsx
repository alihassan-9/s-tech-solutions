"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  User,
  Building2,
  ArrowRight,
  Info,
  ShieldCheck,
  FolderOpen,
  Activity,
  Sparkles,
  Clock,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";
import { Logo } from "@/components/layout/Logo";
import { Eyebrow } from "@/components/marketing/Eyebrow";
import { Cloud } from "@/components/sky/Cloud";
import { Reveal } from "@/components/motion/Reveal";
import { settleSignOut, usePortalAuth } from "@/lib/portal/auth";

const inputClasses =
  "w-full rounded-xl border border-ink/10 bg-white/70 py-3 pl-10 pr-4 text-sm text-ink placeholder:text-ink-soft focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

const iconClasses =
  "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft";

type Mode = "sign-in" | "sign-up";

/** One spring drives the panel slide, the toggle thumb, and the field collapse
 *  so the whole card reads as a single movement rather than three. */
const SLIDE: Transition = { type: "spring", stiffness: 260, damping: 32, mass: 0.9 };
const FADE: Transition = { duration: 0.22, ease: [0.16, 1, 0.3, 1] };

const PANEL_COPY: Record<
  Mode,
  { eyebrow: string; title: string; body: string; points: { icon: typeof Activity; label: string }[] }
> = {
  "sign-in": {
    eyebrow: "Client Portal",
    title: "Pick up where you left off.",
    body: "Every brief, deliverable, and status update for your projects, in one place.",
    points: [
      { icon: Activity, label: "Live status on each project" },
      { icon: FolderOpen, label: "Deliverables and files together" },
      { icon: Clock, label: "History you can look back through" },
    ],
  },
  "sign-up": {
    eyebrow: "New account",
    title: "Set up your workspace.",
    body: "Create an account to submit briefs and follow the work from kickoff to delivery.",
    points: [
      { icon: Sparkles, label: "Submit a brief in minutes" },
      { icon: ShieldCheck, label: "Your project data stays private" },
      { icon: Clock, label: "Track progress without chasing email" },
    ],
  },
};

export default function PortalLoginPage() {
  const { client, loading, login, signup } = usePortalAuth();
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [mode, setMode] = useState<Mode>("sign-in");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // The two halves only trade places once there are two columns to trade;
  // below lg the card is stacked, so the slide is switched off entirely
  // rather than translating a panel off the side of a single column.
  const [twoUp, setTwoUp] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setTwoUp(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!loading && client) router.replace("/portal/dashboard");
  }, [loading, client, router]);

  // Reaching this page ends a sign-out: from here, any portal page the
  // visitor lands on came from browser history, so the guard should hand
  // them back to the public site rather than bounce them here again.
  useEffect(() => {
    settleSignOut();
  }, []);

  const isSignUp = mode === "sign-up";
  const slide = twoUp && isSignUp;
  const copy = PANEL_COPY[mode];

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } =
      mode === "sign-in"
        ? await login(email, password)
        : await signup({ companyName, contactName, email, password });
    setSubmitting(false);
    if (error) {
      setError(error);
      return;
    }
    router.push("/portal/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-24 sm:px-6">
      <Reveal className="w-full max-w-5xl">
        <div className="relative isolate grid overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-float backdrop-blur-xl lg:min-h-[36rem] lg:grid-cols-2">
          {/* Both halves live in the same grid cell row and simply translate
              past each other, so the swap is a pure transform: no reflow, no
              re-mounting the inputs (which would drop whatever was typed).
              The brand panel carries the higher z-index so it reads as one
              solid block gliding across the card. */}
          <motion.aside
            animate={{ x: slide ? "100%" : "0%" }}
            transition={reduceMotion ? { duration: 0 } : SLIDE}
            className="relative z-10 overflow-hidden bg-gradient-to-br from-brand via-brand to-brand-deep p-8 text-white sm:p-10 lg:col-start-1 lg:row-start-1"
          >
            <Cloud className="-left-12 -top-10 h-32 w-[22rem]" opacity={0.16} blur={14} />
            <Cloud className="-right-16 bottom-2 h-36 w-[24rem]" opacity={0.12} blur={16} />
            <div
              aria-hidden
              className="bg-dot-grid pointer-events-none absolute inset-0 text-white/[0.09] [mask-image:linear-gradient(to_bottom_left,black,transparent_70%)]"
            />

            <div className="relative flex h-full flex-col gap-10">
              <Link href="/" data-cursor="link" className="flex w-fit items-center">
                <Logo invert />
              </Link>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={reduceMotion ? { duration: 0 } : FADE}
                >
                  <Eyebrow invert>{copy.eyebrow}</Eyebrow>
                  <h2 className="mt-5 text-balance text-3xl font-semibold leading-[1.15] tracking-tight text-white lg:text-[2.1rem]">
                    {copy.title}
                  </h2>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-invert-muted">{copy.body}</p>

                  {/* Stacked on phones the panel sits above the form, so every
                      row here is a row the user scrolls past before reaching
                      the fields. The pitch keeps the title and copy; the proof
                      points wait for the two-column layout. */}
                  <ul className="mt-8 hidden space-y-3.5 lg:block">
                    {copy.points.map((point) => (
                      <li key={point.label} className="flex items-center gap-3 text-sm text-white/90">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10">
                          <point.icon className="h-4 w-4" strokeWidth={1.75} />
                        </span>
                        {point.label}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>

              <div className="mt-auto flex items-start gap-2.5 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs leading-5 text-white/85">
                <Info className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
                <span>
                  Preview: accounts are saved on this device only, so your projects stay
                  in this browser until the portal is connected to our systems.
                </span>
              </div>
            </div>
          </motion.aside>

          <motion.div
            animate={{ x: slide ? "-100%" : "0%" }}
            transition={reduceMotion ? { duration: 0 } : SLIDE}
            className="flex flex-col justify-center bg-white/60 p-8 sm:p-10 lg:col-start-2 lg:row-start-1 lg:p-12"
          >
            <div className="relative flex w-fit rounded-full bg-ink/[0.06] p-1">
              {(["sign-in", "sign-up"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => switchMode(option)}
                  data-cursor="link"
                  aria-pressed={mode === option}
                  className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
                    mode === option ? "text-ink" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {mode === option ? (
                    <motion.span
                      layoutId="portal-auth-thumb"
                      transition={reduceMotion ? { duration: 0 } : SLIDE}
                      className="absolute inset-0 rounded-full bg-white shadow-float"
                    />
                  ) : null}
                  <span className="relative">
                    {option === "sign-in" ? "Sign in" : "Sign up"}
                  </span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={reduceMotion ? { duration: 0 } : FADE}
              >
                <h1 className="mt-7 text-2xl font-semibold tracking-tight text-ink">
                  {isSignUp ? "Create your account" : "Welcome back"}
                </h1>
                <p className="mt-2 text-sm leading-6 text-ink-muted">
                  {isSignUp
                    ? "A few details and your workspace is ready."
                    : "Sign in to track project progress and deliverables."}
                </p>
              </motion.div>
            </AnimatePresence>

            <form onSubmit={onSubmit} className="mt-7 space-y-4">
              {/* height:auto rather than a mounted/unmounted block, so the card
                  grows and shrinks with the extra fields instead of snapping. */}
              <AnimatePresence initial={false}>
                {isSignUp ? (
                  <motion.div
                    key="account-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={reduceMotion ? { duration: 0 } : SLIDE}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 pb-4">
                      <div className="relative">
                        <Building2 className={iconClasses} strokeWidth={1.75} />
                        <input
                          required
                          placeholder="Company name"
                          autoComplete="organization"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className={inputClasses}
                        />
                      </div>
                      <div className="relative">
                        <User className={iconClasses} strokeWidth={1.75} />
                        <input
                          required
                          placeholder="Your name"
                          autoComplete="name"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className={inputClasses}
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className="relative">
                <Mail className={iconClasses} strokeWidth={1.75} />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClasses}
                />
              </div>

              <div className="relative">
                <Lock className={iconClasses} strokeWidth={1.75} />
                <input
                  type="password"
                  required
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClasses}
                />
              </div>

              {error ? (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-brand/15 bg-brand-soft px-4 py-2.5 text-sm text-brand-deep"
                >
                  {error}
                </motion.p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                data-cursor="link"
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-medium text-white shadow-brand transition-colors hover:bg-brand-hover disabled:opacity-60"
              >
                {submitting
                  ? isSignUp
                    ? "Creating account…"
                    : "Signing in…"
                  : isSignUp
                    ? "Create account"
                    : "Sign in"}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  strokeWidth={1.75}
                />
              </button>
            </form>

            <p className="mt-6 text-xs text-ink-soft">
              {isSignUp ? "Already have an account? " : "No account yet? "}
              <button
                type="button"
                onClick={() => switchMode(isSignUp ? "sign-in" : "sign-up")}
                data-cursor="link"
                className="font-medium text-brand link-sweep"
              >
                {isSignUp ? "Sign in" : "Create one"}
              </button>
            </p>
            <p className="mt-1.5 text-xs text-ink-soft">
              Prefer to talk first?{" "}
              <Link href="/#contact" className="font-medium text-brand link-sweep">
                Get in touch
              </Link>
            </p>
          </motion.div>
        </div>
      </Reveal>
    </div>
  );
}
