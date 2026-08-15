import { CONTACT_EMAIL } from "@/lib/site";
import { SERVICE_COPY } from "@/lib/portal/service-copy";
import type { NewProjectRequestInput, ProjectRequestContact } from "@/lib/portal/types";

/**
 * Turns a submitted project request into an email addressed to S-Tech.
 *
 * The brief has to actually reach us, and the portal has no server to post it
 * to yet, so the form's submit hands the whole request to the visitor's own
 * mail client with everything already written out. That keeps the request in
 * their sent folder as well as our inbox, and it needs no API key, no
 * deliverability setup, and no third party holding the message.
 *
 * When the backend lands, swap the call site for a request to an API route
 * that sends the same body server-side. `buildProjectRequestEmail()` below is
 * deliberately the part that formats it, so the wording carries over.
 */

/** Mail clients start dropping the tail of very long mailto links. */
const MAX_BODY_LENGTH = 1800;

export interface ProjectRequestEmail {
  to: string;
  subject: string;
  body: string;
  /** Ready to use as an href. */
  mailtoUrl: string;
}

function line(label: string, value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? `${label}: ${trimmed}` : null;
}

export function buildProjectRequestEmail(
  contact: ProjectRequestContact,
  input: NewProjectRequestInput
): ProjectRequestEmail {
  const subject = `New project request: ${input.name.trim() || input.service}`;

  // The two questions the form rewords per service are labelled here the way
  // the sender saw them, so the brief we read back matches what was asked.
  const copy = SERVICE_COPY[input.service];

  const parts: (string | null)[] = [
    "New project request from the S-Tech website.",
    "",
    "CONTACT",
    line("Name", contact.contactName),
    line("Email", contact.email),
    line("Company", contact.companyName) ?? "Company: not given",
    "",
    "PROJECT",
    line("Project name", input.name),
    line("Service", input.service),
    line("Requested date", input.desiredDueDate) ?? "Requested date: flexible",
    "",
    "BRIEF",
    line(copy.scopeLabel, input.targetMarket),
    line(copy.detailLabel, input.requiredFields),
    line("Approximate volume", input.volume),
    line("Preferred format", input.format),
    line("Anything else", input.notes),
  ];

  const body = parts.filter((part) => part !== null).join("\n").slice(0, MAX_BODY_LENGTH);

  const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  return { to: CONTACT_EMAIL, subject, body, mailtoUrl };
}

/**
 * Hands a mailto link to the browser through a temporary anchor rather than
 * `window.location`. Assigning to location starts a navigation the mail
 * handoff has to race, and a client-side route change immediately after the
 * submit can cancel it; a click on a detached anchor leaves the current
 * document alone.
 */
export function openMailClient(mailtoUrl: string): void {
  const anchor = document.createElement("a");
  anchor.href = mailtoUrl;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
