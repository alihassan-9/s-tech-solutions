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
  title: "Terms and Conditions | S-Tech Solutions",
  description:
    "The terms that govern use of the S-Tech Solutions website and client portal, and the engagements we carry out for clients.",
};

const MailLink = () => (
  <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-brand link-sweep">
    {CONTACT_EMAIL}
  </a>
);

const SECTIONS: LegalSection[] = [
  {
    heading: "1. These terms",
    body: (
      <>
        <LegalText>
          These terms apply when you use this website or the client portal, and when you
          engage {COMPANY_NAME}, a business services company based in {COMPANY_LOCATION},
          to carry out work. By submitting a request or creating a portal account you
          accept them. If you do not accept them, please do not use the site.
        </LegalText>
        <LegalText>
          Where we sign a separate proposal, statement of work, or contract with you, that
          document governs the engagement, and these terms fill in anything it does not
          cover.
        </LegalText>
      </>
    ),
  },
  {
    heading: "2. Our services",
    body: (
      <LegalText>
        We provide lead generation and prospect research, data entry, data research and
        verification, CRM management and data operations, and email marketing support.
        What we will deliver for you, on what timeline, and at what price is set out in
        the scope we agree before work starts.
      </LegalText>
    ),
  },
  {
    heading: "3. Requests and acceptance",
    body: (
      <LegalText>
        A brief submitted through this site or the portal is a request, not a binding
        order. It reaches us by email and we reply to confirm scope, price, and timeline.
        An engagement begins only when we have both confirmed those in writing. A project
        shown in the portal before that confirmation reflects what you asked for, not work
        we have committed to.
      </LegalText>
    ),
  },
  {
    heading: "4. What we need from you",
    body: (
      <LegalList
        items={[
          "Accurate, complete instructions: target market, required fields, volume, format, and anything that changes the scope.",
          "Timely access to any systems, accounts, or source files the work depends on.",
          "Timely responses to questions that block delivery. Timelines move when they do not arrive.",
          "The right to give us any data you send us, and a lawful basis for what you ask us to do with it.",
        ]}
      />
    ),
  },
  {
    heading: "5. Fees and payment",
    body: (
      <LegalText>
        Fees, currency, and payment schedule are those set out in the agreed scope. Unless
        we agree otherwise in writing, invoices are payable within the period stated on
        the invoice, and we may pause work on an overdue account after telling you. Bank
        charges and payment processing fees are yours. Taxes are added where they apply.
      </LegalText>
    ),
  },
  {
    heading: "6. Delivery, review, and revisions",
    body: (
      <LegalText>
        We deliver in the format agreed for the project. Please review each delivery
        promptly and tell us about anything that does not match the brief. We correct work
        that falls short of the agreed scope at no cost. Changes that go beyond the agreed
        scope are quoted as additional work before we start them.
      </LegalText>
    ),
  },
  {
    heading: "7. Data quality",
    body: (
      <LegalText>
        Business contact data changes constantly, and public sources are not perfect. We
        apply careful research and verification to every record and we correct genuine
        errors, but we cannot warrant that every record is accurate at every future
        moment. Any accuracy target for a project is the one written into its agreed
        scope.
      </LegalText>
    ),
  },
  {
    heading: "8. Ownership",
    body: (
      <LegalText>
        You keep ownership of everything you provide to us. On full payment, the
        deliverables prepared specifically for you become yours. We keep ownership of our
        own methods, templates, internal tooling, and general know-how, including anything
        we develop before or outside your project, and we may keep using them for other
        clients.
      </LegalText>
    ),
  },
  {
    heading: "9. Confidentiality",
    body: (
      <LegalText>
        Each of us will keep the other&apos;s non-public information confidential, use it
        only for the engagement, and protect it with reasonable care. This does not cover
        information that is already public, that was already known without obligation, or
        that must be disclosed by law. These obligations continue after the engagement
        ends.
      </LegalText>
    ),
  },
  {
    heading: "10. Data protection and lawful use",
    body: (
      <>
        <LegalText>
          Where we process personal data for you, we do so on your documented instructions
          as described in our{" "}
          <Link href="/privacy" className="font-medium text-brand link-sweep">
            Privacy Policy
          </Link>
          . You confirm that you have the right to instruct that processing, and that any
          outreach you run using our deliverables will comply with the marketing and data
          protection laws that apply to you and to the people you contact, including rules
          on consent, unsubscribe handling, and sender identification.
        </LegalText>
        <LegalText>
          We will not knowingly carry out work that breaches those laws, and we may
          decline or stop a project that asks us to.
        </LegalText>
      </>
    ),
  },
  {
    heading: "11. Acceptable use",
    body: (
      <LegalText>
        Do not use this site or the portal to send unlawful, misleading, or infringing
        material, to attempt unauthorised access, to disrupt the service, or to scrape it
        at scale. Keep your portal credentials to yourself and tell us if you think
        someone else has them.
      </LegalText>
    ),
  },
  {
    heading: "12. The client portal",
    body: (
      <LegalText>
        The portal is provided as it stands and is currently in preview: accounts and
        projects are stored in your own browser rather than on our servers, so clearing
        your browser data removes them, and features may change. We do not guarantee
        uninterrupted availability. Nothing in the portal replaces the scope document for
        an engagement.
      </LegalText>
    ),
  },
  {
    heading: "13. No guarantee of results",
    body: (
      <LegalText>
        We deliver research, data, and operational work to the agreed scope. Commercial
        outcomes such as replies, meetings, pipeline, or revenue depend on your offer,
        your messaging, your market, and your follow-up, so we do not guarantee them and
        nothing on this site should be read as guaranteeing them.
      </LegalText>
    ),
  },
  {
    heading: "14. Liability",
    body: (
      <LegalText>
        Nothing in these terms limits liability for fraud, for death or personal injury
        caused by negligence, or for anything else that cannot lawfully be limited.
        Subject to that, neither of us is liable for indirect or consequential loss, or
        for loss of profit, revenue, goodwill, or data, and our total liability for any
        engagement is limited to the fees you paid us for that engagement in the three
        months before the claim arose.
      </LegalText>
    ),
  },
  {
    heading: "15. Suspension and termination",
    body: (
      <LegalText>
        Either of us may end an engagement with reasonable written notice. You pay for
        work carried out up to the end date, and we hand over what has been completed and
        paid for. We may suspend or close a portal account that is being used in breach of
        these terms.
      </LegalText>
    ),
  },
  {
    heading: "16. Changes to these terms",
    body: (
      <LegalText>
        We may update these terms as our services change. The date at the top shows the
        current version, and the terms in force when your engagement was agreed continue
        to apply to that engagement.
      </LegalText>
    ),
  },
  {
    heading: "17. Governing law",
    body: (
      <LegalText>
        These terms are governed by the laws of the Islamic Republic of Pakistan, and the
        courts of Bahawalpur have exclusive jurisdiction, unless a signed agreement
        between us says otherwise. We will always try to resolve a disagreement by talking
        first.
      </LegalText>
    ),
  },
  {
    heading: "18. Contact",
    body: (
      <LegalText>
        Questions about these terms go to <MailLink />.
      </LegalText>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms and Conditions"
      intro={`The terms on which ${COMPANY_NAME} provides this website, the client portal, and the services we deliver.`}
      sections={SECTIONS}
      related={{ href: "/privacy", label: "Read the Privacy Policy" }}
    />
  );
}
