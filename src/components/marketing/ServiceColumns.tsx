import { Mail, Target, Users, CheckCircle2, type LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

type Pillar = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  items: string[];
  deliverables: string;
};

const PILLARS: Pillar[] = [
  {
    id: "lead-generation",
    icon: Target,
    title: "Lead Generation & Prospect Research",
    description:
      "Target the right businesses and decision-makers with research built around your market and campaign goals.",
    items: [
      "B2B Lead Generation",
      "Prospect List Building",
      "Decision-Maker Research",
      "LinkedIn & Web Research",
      "Recruitment Research Support",
      "Market & Competitor Research",
    ],
    deliverables: "Company, contact, title, and email, plus any custom fields your project needs.",
  },
  {
    id: "crm-management",
    icon: Users,
    title: "CRM Management & Data Operations",
    description:
      "Keep customer and prospect records clean, current, and useful, from first data entry through ongoing verification and cleanup.",
    items: [
      "CRM Data Entry",
      "CRM & Database Cleanup",
      "Contact & Data Enrichment",
      "Data Verification",
      "Web & Source Research",
      "Pipeline Support",
      "Import Preparation",
      "Ongoing CRM Assistance",
    ],
    deliverables: "Adapted to whatever CRM you already use, with access limited to what's needed.",
  },
  {
    id: "email-marketing",
    icon: Mail,
    title: "Email Marketing Support",
    description: "Support the data and operational side of outbound and lifecycle email campaigns.",
    items: [
      "Email List Building",
      "Email Research",
      "Email Verification Support",
      "Campaign Data Preparation",
      "Campaign Operations Support",
      "Performance Data Organization",
    ],
    deliverables: "We support legitimate outreach, and clients own messaging, consent, and platform policy.",
  },
];

/**
 * Three services, three columns, all visible at once — no tabs, no click
 * needed to see the other two. Each column is a self-contained anchor
 * target (id={pillar.id}) for the footer's service links, so jumping to one
 * is a plain scroll, no JS state to sync.
 */
export function ServiceColumns() {
  return (
    // No items-start here — CRM Management has more items than the other
    // two, so without letting the grid's default stretch apply, its card
    // was taller while the shorter cards' bullet lists and bottom notes
    // sat higher, making the row look uneven instead of aligned.
    <Stagger className="grid gap-5 lg:grid-cols-3" step={0.1}>
      {PILLARS.map((pillar) => (
        <StaggerItem key={pillar.id} className="h-full">
          <GlassCard id={pillar.id} className="flex h-full scroll-mt-28 flex-col rounded-3xl p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-brand-soft-2 shadow-[0_10px_24px_-14px_rgba(31,98,240,0.8)]">
              <pillar.icon className="h-5 w-5 text-brand" strokeWidth={1.75} />
            </div>

            <h3 className="mt-4 text-balance text-lg font-semibold tracking-tight text-ink">
              {pillar.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-ink-muted">{pillar.description}</p>

            {/* flex-1 absorbs the height difference between a 6-item and an
                8-item list, so the deliverables note below lands at the
                same bottom position in every card regardless of count. */}
            <ul className="mt-5 flex-1 space-y-2.5 border-t border-ink/[0.07] pt-5">
              {pillar.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={1.75} />
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-5 border-t border-ink/[0.07] pt-4 text-xs leading-5 text-ink-muted">
              {pillar.deliverables}
            </p>
          </GlassCard>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
