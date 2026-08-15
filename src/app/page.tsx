import {
  ShieldCheck,
  UserCheck,
  Eye,
  Telescope,
  Megaphone,
  Rocket,
  Cpu,
  Briefcase,
  ShoppingBag,
  Building2,
  HeartPulse,
  Factory,
  FileSearch,
  Handshake,
  MessageSquare,
  CheckCircle2,
  ArrowUpRight,
  Mail,
  Quote,
  Compass,
  Gauge,
  Layers,
  ClipboardCheck,
  RefreshCw,
  Target,
  Users,
  Database,
  Sparkles,
  MapPin,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Eyebrow } from "@/components/marketing/Eyebrow";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { MiniCard } from "@/components/marketing/MiniCard";
import { FactGrid } from "@/components/marketing/FactGrid";
import { ServiceColumns } from "@/components/marketing/ServiceColumns";
import { ProcessTimeline } from "@/components/marketing/ProcessTimeline";
import { Faq } from "@/components/marketing/Faq";
import { BrowserMockup } from "@/components/marketing/BrowserMockup";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { AnimatedHeading } from "@/components/motion/AnimatedHeading";
import { Marquee } from "@/components/motion/Marquee";
import { Cloud } from "@/components/sky/Cloud";
import { CONTACT_EMAIL, COMPANY_LOCATION, START_PROJECT_PATH } from "@/lib/site";

const CAPABILITIES = [
  "B2B Lead Generation",
  "Prospect List Building",
  "Decision-Maker Research",
  "Data Verification",
  "Database Cleanup",
  "CRM Data Entry",
  "Contact Enrichment",
  "Email List Building",
  "Campaign Data Prep",
  "Market Research",
];

const APPROACH = [
  "Accuracy first: clean, structured information before volume.",
  "Process driven: consistent workflows, organized delivery.",
  "Flexible execution: one-time projects or ongoing operations.",
  "Confidentiality minded: respectful handling of your data.",
];

/** Gives the "one-time projects or ongoing operations" line in APPROACH visual form. */
const ENGAGEMENT_MODES = [
  {
    icon: Sparkles,
    title: "One-time project",
    description: "A single scoped batch, delivered once and closed out.",
  },
  {
    icon: RefreshCw,
    title: "Ongoing operations",
    description: "Recurring support that scales as your pipeline grows.",
  },
];

const OVERVIEW_FACTS = [
  { label: "Head Office", value: COMPANY_LOCATION },
  { label: "Founder & CEO", value: "Muhammad Shahabaz" },
  { label: "Primary Contact", value: CONTACT_EMAIL },
  { label: "Client Focus", value: "Startups, agencies & international teams" },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Quality",
    description: "Relevance, verification, and usable delivery formats.",
  },
  {
    icon: UserCheck,
    title: "Ownership",
    description: "Accountable for requirements and the quality of every deliverable.",
  },
  {
    icon: Eye,
    title: "Clarity",
    description: "Scopes, workflows, and deliverables kept understandable.",
  },
  {
    icon: RefreshCw,
    title: "Improvement",
    description: "Processes refined as tools and expectations evolve.",
  },
];

const MARKETS = [
  { icon: Megaphone, title: "Marketing & Recruitment", description: "Prospecting & candidate research" },
  { icon: Rocket, title: "Startups & SMBs", description: "Foundational lead databases" },
  { icon: Cpu, title: "Technology & SaaS", description: "Account & role-based research" },
  { icon: Briefcase, title: "Professional Services", description: "Research for consultancies" },
  { icon: ShoppingBag, title: "E-commerce", description: "Partner & supplier databases" },
  { icon: Building2, title: "Real Estate", description: "Contact & market research" },
  { icon: HeartPulse, title: "Healthcare", description: "Careful, public-source research" },
  { icon: Factory, title: "Manufacturing & Logistics", description: "Custom industry research" },
];

const EXAMPLES = [
  {
    icon: Target,
    tag: "Lead Generation",
    title: "Growth Agency: Prospecting",
    description: "Segmented company and decision-maker lists built for a specific campaign.",
    delivered: "Company, contact, title, email, segment",
  },
  {
    icon: Users,
    tag: "Research",
    title: "Recruitment Agency: Research",
    description: "Hiring contacts and candidate research, organised by role and region.",
    delivered: "Role, company, region, public profile",
  },
  {
    icon: Database,
    tag: "CRM Management",
    title: "Small Business: CRM Cleanup",
    description: "An ageing contact database deduplicated and standardised for re-import.",
    delivered: "Deduped, normalised, import-ready file",
  },
  {
    icon: Mail,
    tag: "Email Marketing",
    title: "International Team: Email Prep",
    description: "Campaign lists segmented and verified before anything gets sent.",
    delivered: "Verified, segmented sending lists",
  },
  {
    icon: Building2,
    tag: "Account Research",
    title: "SaaS Company: Account Research",
    description: "Target accounts and the roles worth reaching inside each one.",
    delivered: "Account list, roles, contact details",
  },
  {
    icon: Sparkles,
    tag: "Custom",
    title: "Custom Research Project",
    description: "A dataset that doesn't fit a standard shape, collected to your spec.",
    delivered: "Whatever fields the brief defines",
  },
];

const WHY_US = [
  { icon: ClipboardCheck, title: "Defined Quality Standards", description: "Requirements agreed before execution starts." },
  { icon: Layers, title: "Structured Delivery", description: "Consistent columns, labels & formatting." },
  { icon: FileSearch, title: "Research Discipline", description: "Relevance and traceability over guesswork." },
  { icon: Gauge, title: "Scalable Support", description: "From small tests to recurring operations." },
  { icon: Handshake, title: "Flexible Collaboration", description: "Adapted to your tools & process." },
  { icon: MessageSquare, title: "Professional Communication", description: "Clear updates, transparent handling." },
];

const TEAM_FUNCTIONS = [
  "Lead Generation & Research",
  "Data Entry & Data Quality",
  "CRM Operations",
  "Email Marketing Support",
  "Project Coordination & QA",
];

/** Mirrors the "How do we get started?" answer in the FAQ list. */
const ENQUIRY_CHECKLIST = [
  "Your target market or industry",
  "The fields you need in each record",
  "Rough volume and preferred format",
];

const CONTACT_FACTS = [
  { label: "Email", value: CONTACT_EMAIL },
  { label: "Location", value: COMPANY_LOCATION },
  { label: "Founder & CEO", value: "Muhammad Shahabaz" },
];

/** Reusable section heading styles, kept in one place so scale stays consistent. */
const H2 = "text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]";
const LEAD = "mt-5 text-base leading-7 text-ink-muted sm:text-lg";

export default function Home() {
  return (
    <div id="top" className="flex flex-1 flex-col">
      <Navbar />

      <main>
        {/* ============================ HERO ============================ */}
        <section className="relative px-6 pb-16 pt-32 sm:pt-40">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <Reveal direction="none" duration={0.7}>
                <Eyebrow className="mx-auto">
                  Lead Gen · Data Ops · CRM · Email Marketing
                </Eyebrow>
              </Reveal>

              <AnimatedHeading
                as="h1"
                delay={0.15}
                className="mt-7 text-balance text-[3.25rem] font-semibold leading-[0.98] tracking-[-0.03em] text-ink sm:text-7xl lg:text-[5.5rem]"
                segments={[
                  { text: "Research." },
                  { text: "Data.", accent: true },
                  { text: "Growth." },
                ]}
              />

              <Reveal delay={0.5} duration={0.9}>
                <p className="mx-auto mt-7 max-w-xl text-base leading-7 text-ink-muted sm:text-lg">
                  Lead generation, data operations, CRM management, and email
                  marketing support, built for teams that need growth systems
                  they can trust.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  {/* Opens the project request form. It asks the questions we
                      would have had to ask anyway, and it emails us the
                      answers. */}
                  <Button href={START_PROJECT_PATH} variant="primary" size="lg">
                    Get in touch
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Button>
                  <Button href="/#services" variant="secondary" size="lg">
                    See our services
                  </Button>
                </div>

                <p className="mt-8 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
                  Bahawalpur, Pakistan · Founder-led · Startups to enterprise
                </p>
              </Reveal>
            </div>

            {/* Abstract product view. No floating stat chips here — nothing
                on this page is a real, verifiable performance number, so
                nothing gets presented as one. */}
            <div className="relative mx-auto mt-20 max-w-4xl">
              <BrowserMockup title="workspace.s-tech.dev · prospect research">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {["Workspace", "Research", "CRM", "Campaigns"].map((tab, i) => (
                      <span
                        key={tab}
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          i === 0 ? "bg-brand text-white shadow-brand" : "text-ink-muted"
                        }`}
                      >
                        {tab}
                      </span>
                    ))}
                  </div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-light to-brand text-[10px] font-semibold text-white">
                    MS
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-ink-soft">Prospect research</p>
                    <p className="text-sm font-medium text-ink">
                      Q3 outreach · healthcare vertical
                    </p>
                  </div>
                  <span className="rounded-full border border-white/80 bg-white px-3 py-1.5 text-xs font-medium text-brand shadow-float">
                    + New list
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Prospect lists", value: 6 },
                    { label: "Records", value: 1842 },
                    { label: "CRM synced", value: 1206 },
                    { label: "Flagged", value: 38 },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-white/80 bg-white p-3 shadow-[0_8px_20px_-16px_rgba(23,68,150,0.6)]"
                    >
                      <p className="text-[11px] text-ink-soft">{stat.label}</p>
                      <p className="mt-1 text-sm font-semibold text-ink">
                        {stat.value.toLocaleString("en-US")}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-[1.3fr_1fr]">
                  <div className="rounded-xl border border-white/80 bg-white p-4 shadow-[0_8px_20px_-16px_rgba(23,68,150,0.6)]">
                    <p className="text-xs text-ink-soft">Data quality</p>
                    <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-sky-3">
                      <div className="h-full w-[68%] bg-brand" />
                      <div className="h-full w-[22%] bg-brand-light" />
                      <div className="h-full w-[10%] bg-sky-2" />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-ink-muted">
                      <span>Verified 68%</span>
                      <span>In review 22%</span>
                      <span>Flagged 10%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-xl bg-gradient-to-br from-brand to-brand-deep p-4">
                    <div
                      className="relative h-14 w-14 shrink-0 rounded-full"
                      style={{
                        background: "conic-gradient(#fff 92%, rgba(255,255,255,0.25) 0)",
                      }}
                    >
                      <div className="absolute inset-[3px] flex items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
                        92%
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-white/90">Email verification</p>
                      <p className="mt-1 text-sm font-medium text-white">
                        Ready for campaign
                      </p>
                    </div>
                  </div>
                </div>
              </BrowserMockup>

              <p className="mt-5 text-center text-[11px] uppercase tracking-[0.16em] text-ink-soft">
                Illustrative view of a working project, not a product screenshot
              </p>
            </div>
          </div>
        </section>

        {/* ======================= CAPABILITY TICKER ======================= */}
        {/* Capability ticker. Bare words on the open sky — no band, no rules. */}
        <section className="relative py-12 sm:py-16">
          <Reveal direction="none">
            <Marquee duration={45}>
              {CAPABILITIES.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-8 whitespace-nowrap px-8 text-lg font-bold tracking-tight text-ink sm:text-xl"
                >
                  {item}
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                </span>
              ))}
            </Marquee>
          </Reveal>
        </section>

        {/* ========================= WHAT YOU GET ========================= */}
        <section className="relative px-6 py-24 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="mx-auto">What you get</Eyebrow>
            </Reveal>

            <AnimatedHeading
              className={`mx-auto mt-6 max-w-2xl text-center ${H2}`}
              segments={[{ text: "A clear view into" }, { text: "every project", accent: true }]}
            />

            <Reveal delay={0.15} className="mx-auto max-w-xl text-center">
              <p className={LEAD}>
                However you prefer to work, projects stay organized, trackable,
                and easy to review.
              </p>
            </Reveal>

            <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" step={0.09}>
              <StaggerItem className="lg:col-span-2">
                <GlassCard className="h-full rounded-3xl p-7" tilt>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
                    01 · Data compliance
                  </p>
                  <div className="mt-6 flex h-2.5 w-full overflow-hidden rounded-full bg-ink/[0.06]">
                    <div className="h-full w-[62%] bg-brand" />
                    <div className="h-full w-[24%] bg-brand-light" />
                    <div className="h-full w-[14%] bg-ink/10" />
                  </div>
                  <div className="mt-3 flex gap-5 text-xs text-ink-muted">
                    <span>182 verified</span>
                    <span>24 pending</span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight text-ink">
                    See the state of every list
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    What&apos;s verified, pending, or flagged, at a glance, before
                    anything reaches your campaign.
                  </p>
                </GlassCard>
              </StaggerItem>

              <StaggerItem>
                <div
                  data-cursor-theme="invert"
                  data-cursor="card"
                  className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-brand-deep p-7 shadow-brand"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/20 blur-2xl"
                  />
                  <div
                    className="relative h-16 w-16 rounded-full"
                    style={{
                      background: "conic-gradient(#fff 78%, rgba(255,255,255,0.25) 0)",
                    }}
                  >
                    <div className="absolute inset-[3px] flex items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                      78%
                    </div>
                  </div>
                  <h3 className="relative mt-6 text-lg font-semibold tracking-tight text-white">
                    Verification rate
                  </h3>
                  <p className="relative mt-2 text-sm leading-6 text-white/90">
                    Track how much of a list is confirmed before it ships.
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <GlassCard className="h-full rounded-3xl p-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
                    03
                  </p>
                  <p className="mt-6 font-accent text-4xl italic leading-none text-ink">
                    Always
                  </p>
                  <p className="text-4xl font-semibold tracking-tight text-ink">
                    in progress
                  </p>
                  <h3 className="mt-6 text-base font-semibold text-ink">Active projects</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    Scoped, staged, and moving, one-off or ongoing.
                  </p>
                </GlassCard>
              </StaggerItem>

              <StaggerItem className="sm:col-span-2 lg:col-span-4">
                <GlassCard className="flex h-full flex-col items-start justify-between gap-6 rounded-3xl p-7 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-light to-brand text-base font-semibold text-white shadow-brand">
                      MS
                    </div>
                    <div>
                      <p className="text-base font-semibold tracking-tight text-ink">
                        Muhammad Shahabaz
                      </p>
                      <p className="text-sm text-ink-muted">Founder &amp; CEO</p>
                    </div>
                  </div>
                  <div className="sm:max-w-md sm:text-right">
                    <h3 className="text-base font-semibold text-ink">Team response</h3>
                    <p className="mt-1.5 text-sm leading-6 text-ink-muted">
                      A direct line to the person doing the work, not a ticket queue.
                    </p>
                  </div>
                </GlassCard>
              </StaggerItem>
            </Stagger>
          </div>
        </section>

        {/* =========================== ABOUT =========================== */}
        <section id="about" className="relative scroll-mt-28 px-6 py-24 sm:py-28">
          <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <Reveal>
                <Eyebrow>Who we are</Eyebrow>
              </Reveal>

              <AnimatedHeading
                className={`mt-6 ${H2}`}
                segments={[
                  { text: "Precise, dependable" },
                  { text: "business execution.", accent: true },
                ]}
              />

              <Reveal delay={0.15}>
                <p className={LEAD}>
                  A Bahawalpur, Pakistan-based business services company focused on
                  lead generation, email marketing support, CRM management, and data
                  operations for startups, agencies, and international teams.
                </p>
              </Reveal>

              <Stagger className="mt-10 space-y-3.5" as="ul" step={0.09}>
                {APPROACH.map((item) => (
                  <StaggerItem key={item} as="li">
                    <span className="flex items-start gap-3">
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0 text-brand"
                        strokeWidth={1.75}
                      />
                      <span className="text-sm leading-6 text-ink-muted">{item}</span>
                    </span>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>

            {/* lg:pt-14 lines this column's top edge up with the heading
                beside it — flush with the row start instead put it level
                with the small eyebrow badge above the heading, which read
                as "too high." The engagement-mode cards below the fact grid
                give the left column's "one-time or ongoing" line actual
                visual weight, so the two columns end near the same height. */}
            <div className="flex flex-col gap-5 lg:pt-14">
              <Reveal direction="left" delay={0.1}>
                <FactGrid items={OVERVIEW_FACTS} />
              </Reveal>

              <Reveal direction="left" delay={0.2}>
                <GlassCard className="rounded-3xl p-6" lift={false}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                    Two ways to work with us
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {ENGAGEMENT_MODES.map((mode) => (
                      <div
                        key={mode.title}
                        className="rounded-2xl border border-white/70 bg-white/70 p-4 transition-colors duration-300 hover:bg-white"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft">
                          <mode.icon className="h-4 w-4 text-brand" strokeWidth={1.75} />
                        </div>
                        <p className="mt-3 text-sm font-semibold text-ink">{mode.title}</p>
                        <p className="mt-1 text-xs leading-5 text-ink-muted">
                          {mode.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ===================== MISSION & VALUES ====================== */}
        <section className="relative px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/60 px-6 py-20 backdrop-blur-xl shadow-float sm:px-12 sm:py-24">
            <Reveal>
              <Eyebrow>Mission &amp; values</Eyebrow>
            </Reveal>

            <AnimatedHeading
              className={`mt-6 max-w-xl ${H2}`}
              segments={[
                { text: "Complex work, made" },
                { text: "easy to trust and scale.", accent: true },
              ]}
            />

            <div className="mt-14 grid gap-4 sm:grid-cols-2">
              <Reveal>
                <GlassCard tone="solid" className="h-full rounded-3xl p-8" tilt>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-brand-soft-2 shadow-[0_10px_24px_-14px_rgba(31,98,240,0.8)]">
                    <Compass className="h-5 w-5 text-brand" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight text-ink">
                    Our Mission
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    Help businesses make better decisions and execute growth with
                    reliable research and disciplined operational support.
                  </p>
                </GlassCard>
              </Reveal>

              <Reveal delay={0.1}>
                <GlassCard tone="solid" className="h-full rounded-3xl p-8" tilt>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-brand-soft-2 shadow-[0_10px_24px_-14px_rgba(31,98,240,0.8)]">
                    <Telescope className="h-5 w-5 text-brand" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight text-ink">
                    Our Vision
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    A trusted remote operations partner known for precision and
                    long-term value across international markets.
                  </p>
                </GlassCard>
              </Reveal>
            </div>

            <Stagger className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" step={0.08}>
              {VALUES.map((value) => (
                <StaggerItem key={value.title}>
                  <FeatureCard {...value} className="h-full" />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ========================== SERVICES ========================== */}
        <section id="services" className="relative scroll-mt-28 px-6 py-24 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <Reveal>
                <Eyebrow>What we do</Eyebrow>
              </Reveal>

              <AnimatedHeading
                className={`mt-6 ${H2}`}
                segments={[{ text: "Three pillars, one" }, { text: "organized workflow", accent: true }]}
              />

              <Reveal delay={0.15}>
                <p className={LEAD}>
                  Process-based support that adapts to your market and tools.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.1} className="mt-14">
              <ServiceColumns />
            </Reveal>
          </div>
        </section>

        {/* ========================== MARKETS ========================== */}
        <section id="markets" className="relative scroll-mt-28 px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/60 px-6 py-20 backdrop-blur-xl shadow-float sm:px-12 sm:py-24">
            <div className="max-w-2xl">
              <Reveal>
                <Eyebrow>Markets</Eyebrow>
              </Reveal>

              <AnimatedHeading
                className={`mt-6 ${H2}`}
                segments={[{ text: "Flexible across" }, { text: "industries", accent: true }]}
              />

              <Reveal delay={0.15}>
                <p className={LEAD}>
                  Process-based workflows that adapt to many business categories.
                </p>
              </Reveal>
            </div>

            <Stagger className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" step={0.06}>
              {MARKETS.map((market) => (
                <StaggerItem key={market.title}>
                  <GlassCard tone="solid" className="group h-full rounded-2xl p-5">
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-white to-brand-soft-2 shadow-[0_8px_18px_-12px_rgba(31,98,240,0.8)] transition-transform duration-500 group-hover:scale-110">
                        <market.icon className="h-4.5 w-4.5 text-brand" strokeWidth={1.75} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold leading-5 text-ink">
                          {market.title}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-ink-muted">
                          {market.description}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ========================== PROCESS ========================== */}
        <section id="process" className="relative scroll-mt-28 px-4 py-12 sm:px-6">
          <div
            data-cursor-theme="invert"
            className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand via-deep to-brand-deep px-6 py-20 shadow-brand sm:px-12 sm:py-24"
          >
            {/* Cirrus at altitude — the sky, seen from above the weather. */}
            <Cloud className="-left-24 top-6 h-40 w-[30rem]" opacity={0.16} blur={16} />
            <Cloud className="-right-20 bottom-10 h-36 w-[26rem]" opacity={0.13} blur={18} />
            <div
              aria-hidden
              className="pointer-events-none absolute -top-32 left-1/3 h-72 w-[40rem] rounded-full bg-white/20 blur-[110px]"
            />

            <div className="relative mx-auto max-w-2xl text-center">
              <Reveal>
                <Eyebrow invert className="mx-auto">
                  How it works
                </Eyebrow>
              </Reveal>

              <AnimatedHeading
                className="mt-6 text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-invert sm:text-4xl lg:text-[2.75rem]"
                accentClassName="font-accent italic text-brand-light"
                segments={[{ text: "One brief," }, { text: "an entire workflow", accent: true }]}
              />

              <Reveal delay={0.15}>
                <p className="mt-5 text-base leading-7 text-invert-muted">
                  Every project runs through the same six steps, from a target
                  market to an organized dataset you can actually review. You
                  approve the spec at step one and see the output at step five.
                </p>
              </Reveal>
            </div>

            <div className="relative">
              <ProcessTimeline />
            </div>
          </div>
        </section>

        {/* ==================== ENGAGEMENT EXAMPLES ==================== */}
        <section id="work" className="relative scroll-mt-28 px-6 py-24 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <Reveal>
                <Eyebrow>Engagement examples</Eyebrow>
              </Reveal>

              <AnimatedHeading
                className={`mt-6 ${H2}`}
                segments={[{ text: "Illustrative," }, { text: "not a client roster", accent: true }]}
              />

              <Reveal delay={0.15}>
                <p className={LEAD}>
                  Example engagement models, not claims about named clients.
                </p>
              </Reveal>
            </div>

            <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" step={0.07}>
              {EXAMPLES.map((example) => (
                <StaggerItem key={example.title} className="h-full">
                  <MiniCard {...example} className="h-full" />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ========================== WHY US ========================== */}
        <section id="why-us" className="relative scroll-mt-28 px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/60 px-6 py-20 backdrop-blur-xl shadow-float sm:px-12 sm:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <Reveal>
                <Eyebrow className="mx-auto">Why S-Tech</Eyebrow>
              </Reveal>

              <AnimatedHeading
                className={`mt-6 ${H2}`}
                segments={[{ text: "Built for" }, { text: "detail-heavy work", accent: true }]}
              />
            </div>

            <Stagger className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" step={0.07}>
              {WHY_US.map((item) => (
                <StaggerItem key={item.title}>
                  <FeatureCard {...item} className="h-full" />
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.2}>
              <figure className="mx-auto mt-16 max-w-2xl text-center">
                <Quote
                  className="mx-auto h-8 w-8 text-brand/30"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <blockquote className="mt-5 text-balance text-2xl font-medium leading-[1.5] tracking-tight text-ink sm:text-[1.75rem]">
                  &ldquo;Accurate enough to act on,{" "}
                  <span className="font-accent italic text-brand">
                    organized enough to review.
                  </span>
                  &rdquo;
                </blockquote>
                <figcaption className="mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
                  Our standard
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* =========================== TEAM =========================== */}
        <section id="team" className="relative scroll-mt-28 px-6 py-24 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <Reveal>
                <Eyebrow>People</Eyebrow>
              </Reveal>

              <AnimatedHeading
                className={`mt-6 ${H2}`}
                segments={[{ text: "Founder-led," }, { text: "team-supported", accent: true }]}
              />
            </div>

            <div className="mt-14 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
              <Reveal>
                <GlassCard className="relative h-full overflow-hidden rounded-3xl p-8" tilt>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand/10 blur-3xl"
                  />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-light to-brand-deep text-xl font-semibold text-white shadow-brand">
                    MS
                  </div>
                  <h3 className="relative mt-7 text-xl font-semibold tracking-tight text-ink">
                    Muhammad Shahabaz
                  </h3>
                  <p className="relative mt-1 text-sm font-medium text-brand">
                    Founder &amp; CEO
                  </p>
                  <p className="relative mt-4 text-sm leading-6 text-ink-muted">
                    Company direction, service quality, client relationships, and
                    team coordination.
                  </p>
                </GlassCard>
              </Reveal>

              <Reveal delay={0.1}>
                <GlassCard className="h-full rounded-3xl p-8" lift={false}>
                  <h3 className="text-base font-semibold tracking-tight text-ink">
                    Our Team
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    Five functions, coordinated under one point of contact.
                  </p>

                  <ul className="mt-6 space-y-2.5">
                    {TEAM_FUNCTIONS.map((fn, i) => (
                      <li
                        key={fn}
                        className="group flex items-center gap-3.5 rounded-2xl border border-white/70 bg-white/70 px-5 py-3.5 text-sm font-medium text-ink transition-all duration-300 hover:translate-x-1 hover:bg-white"
                      >
                        <span className="font-mono text-[11px] text-brand/60">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand transition-transform duration-300 group-hover:scale-150" />
                        {fn}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ============================ FAQ ============================ */}
        <section id="faq" className="relative scroll-mt-28 px-6 py-24 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <Reveal>
                <Eyebrow className="mx-auto">FAQ</Eyebrow>
              </Reveal>

              <AnimatedHeading
                className={`mt-6 ${H2}`}
                segments={[{ text: "Your questions," }, { text: "answered", accent: true }]}
              />
            </div>

            <div className="mt-14 grid gap-4 lg:grid-cols-[300px_1fr] lg:gap-6">
              <Reveal>
                <div
                  data-cursor-theme="invert"
                  className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-brand-deep p-7 shadow-brand"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full bg-white/20 blur-3xl"
                  />
                  <div className="relative">
                    <p className="text-lg font-semibold tracking-tight text-white">
                      Still have questions?
                    </p>
                    <p className="mt-2.5 text-sm leading-6 text-white/90">
                      Send us the brief and we&apos;ll help you scope the right
                      workflow.
                    </p>

                    {/* Tells people what to actually write, so the first reply
                        can be useful instead of a request for more detail. */}
                    <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/85">
                      Helpful to include
                    </p>
                    <ul className="mt-3 space-y-2.5 border-t border-white/20 pt-4">
                      {ENQUIRY_CHECKLIST.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-white"
                            strokeWidth={1.75}
                          />
                          <span className="text-sm leading-5 text-invert-muted">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="relative mt-8">
                    <Button href={START_PROJECT_PATH} variant="invert" className="w-full">
                      <Mail className="h-4 w-4" strokeWidth={1.75} />
                      Send us your brief
                    </Button>

                    <div className="mt-5 space-y-2 border-t border-white/20 pt-5">
                      <p className="flex items-center gap-2.5 text-xs text-invert-muted">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-white" strokeWidth={2} />
                        {COMPANY_LOCATION}
                      </p>
                      <p className="flex items-center gap-2.5 text-xs text-invert-muted">
                        <Clock className="h-3.5 w-3.5 shrink-0 text-white" strokeWidth={2} />
                        Founder-led replies
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <Faq />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ========================== CONTACT ========================== */}
        <section className="relative px-4 pb-16 pt-12 sm:px-6">
          <Reveal className="mx-auto max-w-6xl">
            <div
              id="contact"
              data-cursor-theme="invert"
              className="relative scroll-mt-28 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand via-brand to-brand-deep px-6 py-20 text-center shadow-brand sm:px-16 sm:py-24"
            >
              <Cloud className="-left-16 -top-4 h-36 w-[26rem]" opacity={0.14} blur={12} />
              <Cloud className="-right-20 bottom-0 h-40 w-[28rem]" opacity={0.12} blur={14} />
              <div
                aria-hidden
                className="bg-dot-grid pointer-events-none absolute right-0 top-0 h-64 w-64 text-white/[0.09] [mask-image:linear-gradient(to_bottom_left,black,transparent_70%)]"
              />

              <div className="relative">
                <Eyebrow invert className="mx-auto">
                  Get in touch
                </Eyebrow>

                <AnimatedHeading
                  className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
                  accentClassName="font-accent italic text-white/90"
                  segments={[
                    { text: "Let's build a" },
                    { text: "cleaner growth workflow", accent: true },
                  ]}
                />

                <p className="mx-auto mt-6 max-w-lg text-base leading-7 text-white/90">
                  Share your target market, required fields, and preferred format,
                  and we&apos;ll shape a practical workflow around it.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button href={START_PROJECT_PATH} variant="invert" size="lg">
                    <Mail className="h-4 w-4" strokeWidth={1.75} />
                    Start a project
                  </Button>
                  <Button href="/#services" variant="outline-invert" size="lg">
                    Review our services
                  </Button>
                </div>

                <FactGrid
                  items={CONTACT_FACTS}
                  columns={3}
                  invert
                  className="mt-16 text-left"
                />
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}
