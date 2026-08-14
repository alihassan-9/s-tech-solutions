# S-Tech Solutions

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
src/app/portal/         portal routes: sign-in, dashboard, projects, requests
src/components/         marketing, portal, motion, and sky//glass primitives
src/lib/portal/         portal data access
```

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

`src/lib/supabase/client.ts` holds the browser client, unused so far. Every
table it will touch needs row-level security restricting each client to their
own rows before it goes near real data.

## Deploying

Pushing to `master` deploys to production on Vercel.
