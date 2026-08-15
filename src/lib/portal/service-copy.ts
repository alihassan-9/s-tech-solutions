import { SERVICE_OPTIONS, type ServiceType } from "@/lib/portal/types";

/**
 * The request form asks the same six questions for every service, but the
 * useful answer to each one is completely different depending on which of the
 * three is picked. "Fields you need in each record" means something for a
 * prospect list and nothing at all for a CRM cleanup, and a placeholder that
 * does not fit the work is worse than none: it teaches people to describe the
 * wrong thing.
 *
 * So the two questions that genuinely change carry a label as well as a
 * placeholder here, and the rest carry an example that matches the work.
 *
 * The email builder reads the same labels (see project-email.ts), so what
 * lands in our inbox is worded the way the person filling the form saw it.
 */
export interface ServiceFieldCopy {
  namePlaceholder: string;
  /** "What should this cover", in the terms of this service. */
  scopeLabel: string;
  scopePlaceholder: string;
  /** "What exactly do you need", in the terms of this service. */
  detailLabel: string;
  detailPlaceholder: string;
  volumePlaceholder: string;
  formatPlaceholder: string;
  notesPlaceholder: string;
}

export const SERVICE_COPY: Record<ServiceType, ServiceFieldCopy> = {
  "Lead Generation": {
    namePlaceholder: "e.g. Q4 SaaS Vertical Prospecting",
    scopeLabel: "Target market or industry",
    scopePlaceholder: "Who should this cover? Industry, company size, region, role.",
    detailLabel: "Fields you need",
    detailPlaceholder: "e.g. company, contact name, title, work email, LinkedIn URL",
    volumePlaceholder: "e.g. 500 records",
    formatPlaceholder: "e.g. XLSX, CSV, CRM import",
    notesPlaceholder: "Context, exclusions, priorities, anything that helps scope it right.",
  },
  "CRM Management": {
    namePlaceholder: "e.g. HubSpot cleanup before Q4",
    scopeLabel: "Which CRM and which records",
    scopePlaceholder: "Which system, which objects, and the segment to work through.",
    detailLabel: "What needs doing",
    detailPlaceholder:
      "e.g. deduplicate, standardise job titles, fill missing industry, reassign owners",
    volumePlaceholder: "e.g. 12,000 contacts",
    formatPlaceholder: "e.g. updated in HubSpot, plus a CSV of every change",
    notesPlaceholder: "Field rules, merge preferences, and anything we should not touch.",
  },
  "Email Marketing": {
    namePlaceholder: "e.g. Onboarding sequence for new signups",
    scopeLabel: "Who receives it",
    scopePlaceholder: "Segment, region, and where the list came from.",
    detailLabel: "What you need from us",
    detailPlaceholder:
      "e.g. list cleaning, sequence copy, sending setup, tracking and reporting",
    volumePlaceholder: "e.g. 3 emails to 4,000 contacts",
    formatPlaceholder: "e.g. built and scheduled in Mailchimp",
    notesPlaceholder: "Offer, tone, sending window, and any compliance notes.",
  },
};

/**
 * Same lookup for callers holding a plain string rather than a ServiceType,
 * such as a stored project whose service came back from the data layer. An
 * unrecognised service falls back to the lead generation wording, which is
 * the one that reads sensibly for a generic brief.
 */
export function serviceCopyFor(service: string): ServiceFieldCopy {
  const match = SERVICE_OPTIONS.find((option) => option === service);
  return SERVICE_COPY[(match ?? SERVICE_OPTIONS[0]) as ServiceType];
}
