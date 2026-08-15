import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalPage,
  LegalText,
  LegalList,
  type LegalSection,
} from "@/components/legal/LegalPage";
import { CONTACT_EMAIL, COMPANY_NAME, COMPANY_LOCATION } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy | S-Tech Solutions",
  description:
    "How S-Tech Solutions collects, uses, stores, and protects personal information across our website, client portal, and the services we deliver.",
};

const MailLink = () => (
  <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-brand link-sweep">
    {CONTACT_EMAIL}
  </a>
);

const SECTIONS: LegalSection[] = [
  {
    heading: "1. Who we are",
    body: (
      <>
        <LegalText>
          {COMPANY_NAME} is a business services company based in {COMPANY_LOCATION},
          providing lead generation, data research and verification, CRM management, and
          email marketing support. In this policy, &quot;we&quot;, &quot;us&quot;, and
          &quot;our&quot; mean {COMPANY_NAME}. You can reach us at any time at{" "}
          <MailLink />.
        </LegalText>
        <LegalText>
          This policy covers two different roles we take with personal information. For
          our own website and client relationships we decide how information is used, so
          we are the controller. For records we research, clean, or manage inside a
          client&apos;s project, we act on that client&apos;s instructions, so they are
          the controller and we are the processor. Section 6 covers the second case.
        </LegalText>
      </>
    ),
  },
  {
    heading: "2. Information we collect",
    body: (
      <>
        <LegalText>We collect only what we need to reply to you and do the work:</LegalText>
        <LegalList
          items={[
            <>
              <strong className="font-semibold text-ink">Enquiry details.</strong> Your
              name, email address, and optionally your company name, plus whatever you
              describe in a project brief. Company name is optional everywhere on this
              site.
            </>,
            <>
              <strong className="font-semibold text-ink">Account details.</strong> If you
              use the client portal, the name, email address, and optional company name
              on your account, along with the projects and messages you submit through
              it.
            </>,
            <>
              <strong className="font-semibold text-ink">Project material.</strong> Files,
              lists, CRM exports, and instructions you send us so we can carry out an
              engagement.
            </>,
            <>
              <strong className="font-semibold text-ink">Notification settings.</strong>{" "}
              Whether you asked for notifications from the portal, and which kinds. These
              are stored in your own browser.
            </>,
            <>
              <strong className="font-semibold text-ink">Basic technical data.</strong>{" "}
              Standard information our hosting provider records when a page is served,
              such as an IP address, browser type, and the pages requested.
            </>,
          ]}
        />
        <LegalText>
          We do not run advertising trackers on this site, and we do not sell personal
          information to anyone, ever.
        </LegalText>
      </>
    ),
  },
  {
    heading: "3. How we use it",
    body: (
      <>
        <LegalList
          items={[
            "To answer your enquiry and prepare a proposal or scope for the work.",
            "To deliver, support, and invoice the services you engage us for.",
            "To operate the client portal, including your account and the notifications you asked for.",
            "To keep records we are required to keep, and to resolve any dispute.",
            "To improve how we scope and run projects, based on what clients ask for.",
          ]}
        />
        <LegalText>
          Where the law requires a legal basis, ours is the performance of a contract with
          you, our legitimate interest in running and improving the business, your consent
          where you gave it (notifications, for example), and compliance with legal
          obligations.
        </LegalText>
      </>
    ),
  },
  {
    heading: "4. Emails you send us",
    body: (
      <LegalText>
        When you submit a project request through this site, the brief is sent to us as an
        email from your own email account. That means a copy stays in your sent folder and
        a copy arrives in our inbox, handled by our email provider under their own terms.
        We keep enquiry emails while the enquiry is live and for a reasonable period
        afterwards in case you come back to us.
      </LegalText>
    ),
  },
  {
    heading: "5. Information stored in your browser",
    body: (
      <>
        <LegalText>
          The client portal is currently in preview. Your portal account, your projects,
          your messages, and your notification preferences are stored in your own
          browser&apos;s local storage on the device you use, not on our servers. Clearing
          your browser data removes them. We will say so plainly on the portal when this
          changes and accounts move to our systems.
        </LegalText>
        <LegalText>
          We do not use cookies for advertising or cross-site tracking. Any storage this
          site uses is functional: it exists to keep you signed in and to remember your
          settings.
        </LegalText>
      </>
    ),
  },
  {
    heading: "6. Data we process for clients",
    body: (
      <>
        <LegalText>
          Many of our engagements involve business contact records: names, job titles,
          company details, work email addresses, and similar. When we research, verify,
          clean, or load those records for a client, we act on that client&apos;s
          documented instructions.
        </LegalText>
        <LegalList
          items={[
            "We use project data only to carry out the engagement, never for our own marketing.",
            "We restrict access to the people working on that project.",
            "We return or delete project data on request at the end of an engagement, unless we are required to keep it.",
            "We expect the client to have a lawful basis for the processing they ask for, and for any outreach they run using the results.",
          ]}
        />
      </>
    ),
  },
  {
    heading: "7. Sharing",
    body: (
      <LegalText>
        We share personal information only where it is needed to run the business: with
        the service providers who host this site, deliver our email, and process payments;
        with professional advisers where necessary; and where the law requires it. Each
        provider is chosen for its own security and confidentiality commitments, and none
        of them receive project data for their own purposes.
      </LegalText>
    ),
  },
  {
    heading: "8. International transfers",
    body: (
      <LegalText>
        We operate from Pakistan and work with clients internationally, so information you
        send us may be accessed from, or stored in, countries other than your own. Where
        information originates in a region with transfer rules, such as the European
        Economic Area or the United Kingdom, we put appropriate safeguards in place with
        the client, typically through the contract that governs the engagement.
      </LegalText>
    ),
  },
  {
    heading: "9. Retention",
    body: (
      <LegalText>
        We keep enquiry and account information for as long as you are a client and for a
        reasonable period afterwards, project material for the duration of the engagement
        plus any agreed handover period, and financial records for as long as tax and
        accounting rules require. When information is no longer needed, we delete it or
        make it anonymous.
      </LegalText>
    ),
  },
  {
    heading: "10. Security",
    body: (
      <LegalText>
        We use access controls, reputable hosted services, and a need-to-know approach
        within our team to protect what you send us. No method of transmission or storage
        is completely secure, so we cannot promise absolute security, but we do commit to
        telling affected people and any relevant authority promptly if a breach occurs
        that puts personal information at risk.
      </LegalText>
    ),
  },
  {
    heading: "11. Your rights",
    body: (
      <LegalText>
        Depending on where you live, you may have the right to ask for a copy of the
        personal information we hold about you, to have it corrected or deleted, to object
        to or restrict how we use it, to withdraw consent you previously gave, and to
        receive it in a portable format. Write to <MailLink /> and we will respond within
        a reasonable period, and within any period the law sets. If we hold the
        information on behalf of a client, we will pass your request to that client and
        support them in answering it.
      </LegalText>
    ),
  },
  {
    heading: "12. Notifications",
    body: (
      <LegalText>
        The portal can show notifications about your projects. Browser notifications are
        off until you turn them on, your browser asks for permission separately, and you
        can switch them off at any time from the notifications page in the portal or in
        your browser settings. Turning them off never affects the service itself.
      </LegalText>
    ),
  },
  {
    heading: "13. Children",
    body: (
      <LegalText>
        Our services are for businesses. This site is not directed at children, and we do
        not knowingly collect information from anyone under 16. If you believe a child has
        sent us information, contact us and we will delete it.
      </LegalText>
    ),
  },
  {
    heading: "14. Changes to this policy",
    body: (
      <LegalText>
        We update this policy when our practices change. The date at the top always shows
        the current version, and material changes will be brought to the attention of
        active clients directly.
      </LegalText>
    ),
  },
  {
    heading: "15. Contact",
    body: (
      <LegalText>
        Questions about this policy, or about anything we hold, go to <MailLink />. Our
        terms of service are set out in our{" "}
        <Link href="/terms" className="font-medium text-brand link-sweep">
          Terms and Conditions
        </Link>
        .
      </LegalText>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy"
      intro={`How ${COMPANY_NAME} handles personal information across this website, the client portal, and the work we deliver.`}
      sections={SECTIONS}
      related={{ href: "/terms", label: "Read the Terms and Conditions" }}
    />
  );
}
