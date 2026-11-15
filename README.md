# Ramblin’ Reach

A Georgia Tech-specific, independent student project: turn a goal into a source-backed next step and a focused connection with an opt-in member.

## What exists

- **JacketPath:** persisted goal/checklist routes using five curated official-resource records with reviewed dates and access caveats. No live equipment or opening-hours claims.
- **JacketMatch:** exact company/city/topic/skill filters, opt-in profiles and projects, Circles with replies, deterministic explained mentor/teach–learn matching, and alumni Learning Requests.
- **ReachCard:** editable QuickReach templates, review before send, atomic request caps, accept/decline/close, participant-only polling Inbox and recorded outcomes.
- Optional alumni Built at Tech history and server-owned Available now windows that expire after 60 minutes. People has a corresponding filter and expiring badge. Quick Question is an existing template.
- Explicitly shared Learning Log fields can appear on a profile/project. Raw requests and private notes remain private.
- Impact Cards and a Help Chain SVG on **your own profile only**, derived from your completed request/outcome records. Helper identities are not published to other members without consent.
- Persistent in-app notifications: request, acceptance, message, post reply and matched request; unread state, deep links and mark-read.

## Stack

Next.js 16 App Router, React 19, strict TypeScript, Supabase Auth/PostgreSQL/RLS, Zod, Tailwind, Radix Slot, Lucide, Vitest and Playwright/axe. No AI service is required; no Calendar, Maps, scraping, referrals or external messaging. Webpack is used for this Windows setup.

## Environment names

Runtime: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `APP_ENV`, `DEMO_MODE`, `MOCK_AI`, `NEXT_PUBLIC_APP_URL`. Optional legacy parser configuration: `OPENAI_API_KEY`, `OPENAI_MODEL`; neither is required for this demo.

CLI seed only: `APP_ENV`, `ALLOW_DEMO_SEED`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`. The service-role credential never belongs in application runtime or browser code.

## Local setup

Prerequisites: Node 24, npm, Docker Desktop and the local Supabase CLI/runtime.

```sh
npm ci
npx supabase start
npx supabase migration up --local
```

Copy `.env.example` to `.env.local`, and `.env.seed.example` to `.env.seed.local`. Configure the named variables from your isolated local Supabase instance. Enable local demo mode in `.env.local`; the demo flag accepts boolean-style strings as well as the existing numeric format. The app rejects demo mode in production. Seed/reset scripts require explicit seed consent and the allowlisted localhost database.

```sh
npm run demo:seed
npm run dev
```

Open [the local demo](http://127.0.0.1:3000/demo). Choose a persona; the server signs it in through real Supabase password authentication. Credentials are generated into ignored `.tmp/reach-demo-accounts.json` and are never returned to the browser. `/demo` and `/api/demo` return HTTP 404 when the flag is disabled; this implementation is local-only, including when a staging flag is configured.

## Seven demo personas

These are seeded sample data, not real members or verified real-world affiliations. Demo mode shows one **Demo environment** footer indicator. Account aliases remain stable, while persona buttons display natural names:

- Students: `student-robotics` (Mira Talven), `student-startup` (Evan Corren), `student-quant` (Noor Bellamy).
- Alumni: `alumni-robotics` (Arin Velden: ML/robotics), `alumni-startup` (Lena Quillan), `alumni-quant` (Owen Kestrel), `alumni-software` (Tessa Marlowe).

No shared password is published. The private credential file supports operator login if the switcher fails. Existing local accounts and regression fixtures are preserved; these seven personas form a separate reset namespace.

```sh
npm run demo:reset
```

The reset command preserves Auth identities and restores fixed scenario IDs/content: three projects, discussions across six Circles, a Learning Request, one accepted conversation, and one completed simulated outcome. That outcome generates a private Impact Card. Arin has Built at Tech history and a fresh availability window. `/demo` also has a reset button requiring a registered demo session. Reset refuses cross-namespace requests/comments/reports instead of deleting other users’ data. Relative server timestamps and the expiry window refresh on reset; persona identities and scenario content remain stable.

## Tests

Existing regression fixtures are separate from the seven-person rehearsal. On a fresh test database, prepare both:

```sh
npm run db:seed
npm run demo:seed
npx playwright install chromium
npm run check
npm run test:db
npm run test:e2e
```

`check` runs typecheck, zero-warning lint and unit tests. `test:db` runs transactional RLS and concurrent quota checks. `test:e2e` builds and starts a fresh production server, then runs desktop/mobile scenarios, including DM01’s real-auth demo loop. Port 3000 must be free. `npm run build` builds the app separately. Use only an isolated local database for these commands.

## Limitations

No hosted deployment is claimed. Apply all migrations before using the current build. Demo switching/reset is local-only and does not constitute institutional verification. Directory/matching and history selections are bounded; no infinite history browser. People filter results reflect query time; badges expire in an open page, with no presence tracking or websocket updates. Impact/Help Chain is private; public counterpart attribution is intentionally absent. Outcomes and employers are self-reported, never verified mentorship results, jobs, referrals or endorsements. No attachments, scheduling, email delivery, job ingestion, contact import or multi-university support.

Ramblin' Reach is an independent student project and is not affiliated with or endorsed by Georgia Tech.
