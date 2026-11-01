<div align="center">

# S-Tech Solutions

**Marketing website and client portal for a business-services company specialising in lead generation, data research, CRM management and email marketing.**

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)

</div>

---

Marketing site and client portal for S-Tech Solutions, a Bahawalpur-based
business services company working in lead generation, data research and
verification, CRM management, and email marketing support.

Built with Next.js 16 (App Router), React 19, Tailwind CSS v4, Motion, and
Lenis for smooth scrolling.

## Running it

```bash
npm install
npm run dev
```

The site runs at http://localhost:3000, the portal at `/portal`.

No environment variables are needed. `.env.local.example` lists the Supabase
keys the portal will use once it is connected to the CRM; nothing reads them
today.

## Layout

```
src/app/page.tsx        the whole marketing page, section by section
src/app/start/          public project request form, where "Get in touch" goes
src/app/privacy/        privacy policy
src/app/terms/          terms and conditions
src/app/portal/         portal routes: sign-in, dashboard, projects, requests,
                        notifications
src/components/         marketing, portal, legal, motion, and sky/glass primitives
src/lib/portal/         portal data access
src/lib/site.ts         contact address and other facts more than one page states
```

## Getting in touch

Every "Get in touch" on the site opens the project request form
(`src/app/start/page.tsx`), not a blank mailto. It is the same
`ProjectRequestForm` the portal uses, with a "who is asking" block added,
since a visitor has no account to read that from. Company name is optional
everywhere it is asked for, in the form and on portal accounts alike.

Submitting sends the brief to the address in `src/lib/site.ts` by handing the
visitor's own mail client a fully written message
(`src/lib/portal/project-email.ts`). That is how a request reaches a human
with no server in front of it, and it leaves a copy in the sender's own sent
folder. When an API route exists, call it from the form's submit and reuse
`buildProjectRequestEmail()` for the body.

Inside the portal the same submit also files the project on the client's
dashboard, so the request is trackable as well as sent.

## Portal data

The portal has no backend yet. Accounts and projects are written to the
visitor's own `localStorage`, and the sign-in screen says so plainly. There is
no seeded sample data: a new account starts empty and fills up from its own
submitted requests.

Three modules are the seam where real queries land, and the pages reading them
should not need to change:

- `src/lib/portal/auth.tsx` swaps for Supabase auth
- `src/lib/portal/project-requests.ts` and `project-details.ts` swap for
  project queries
- `src/lib/portal/client-messages.ts` swaps for the messages table
- `src/lib/portal/notifications.ts` swaps for the notifications table plus
  real Web Push

`src/lib/supabase/client.ts` holds the browser client, unused so far. Every
table it will touch needs row-level security restricting each client to their
own rows before it goes near real data.

## Notifications

`/portal/notifications` is the notification centre: the feed, the unread badge
the sidebar reads, and the switches for what gets raised. Notifications are
recorded in `localStorage` and, when the visitor grants permission and leaves
push on, handed to the operating system as well.

Delivery is the part that is not finished. Real Web Push needs a push service
subscription and a server holding VAPID keys, so today a notification reaches
the device while the portal is open rather than while it is closed. Three
things raise one now: submitting a request, sending a message, and opening the
dashboard with a project due within three days. Once the backend exists,
`notify()` becomes an insert and delivery moves server-side; the reading side
of the module stays as it is.

## Legal pages

`/privacy` and `/terms` share one frame (`src/components/legal/LegalPage.tsx`)
and are linked from the footer, the sign-up form, and the project request
form. Both carry a "last updated" date read from `LEGAL_LAST_UPDATED` in
`src/lib/site.ts`: change the wording, change that date. They describe how the
site actually works today, including the browser-stored portal accounts, so
they need revisiting when the backend lands.

## Deploying

Pushing to `master` deploys to production on Vercel.

## Author

Built by **Ali Hassan** · [LinkedIn](https://www.linkedin.com/in/ali-hassan-70bb9323b) · [GitHub](https://github.com/alihassan-9)
