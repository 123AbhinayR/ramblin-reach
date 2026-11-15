# Devpost facts — verified local build

## Product and exact stack

Ramblin’ Reach is one Georgia Tech-specific independent student app with three core capability names: JacketPath, JacketMatch, ReachCard. It is not affiliated with or endorsed by Georgia Tech.

Runtime dependencies from package.json:
- Next.js 16.4.6; React / react-dom 19.3.1; strict TypeScript 5.9.3.
- Supabase SSR 0.12.7 and Supabase JS 2.119.0; Supabase Auth + PostgreSQL with RLS and restricted transactional RPCs.
- Zod ^4.3.6; Tailwind / @tailwindcss/postcss 4.3.5.
- Radix Slot ^1.2.3, Lucide React ^0.577.0, class-variance-authority ^0.7.1, clsx ^2.1.1, tailwind-merge ^3.5.0, server-only ^0.0.1.
- Tests/tools: Vitest 5.1.0, Vite ^8.3.8, Playwright 1.65.1, axe-core Playwright ^4.11.1, ESLint 9.39.5 / eslint-config-next 16.4.6, pg ^8.16.3, tsx ^4.21.0, Supabase CLI 3.1.0. Node 24. Type packages are in package.json/package-lock.json.
- Webpack production/dev commands. No active AI infrastructure, embeddings, maps/calendar integrations, external messaging or scraped datasets.

## Executed checks (November 14, 2026)

- `npm run typecheck`: passed. Production builds also compiled the corrected demo guard.
- `npm run lint`: initial new-navigation warning fixed; targeted lint rerun passed with zero warnings.
- `npm test`: **81 passed**, 15 suites.
- `npm run test:db`: **103 passed** = 51 transactional + 6 concurrent/month-boundary + 11 Circles + 16 Inbox + 19 learning-loop checks.
- New targeted suites: AV01–AV03 expiry/filter, BT01–BT04 factual matching and IM01–IM03 recorded Impact data: **10 passed**.
- New real-auth `demo-loop.spec.ts` DM01: **2 passed**, desktop and mobile. It uses actual `/demo` sign-in/reset and persists the completed loop through profile Impact/Help Chain.
- One full `npm run test:e2e`: **30 passed, 2 failed** because the new Impact Card repeated lesson text targeted by the existing Learning Log test. No assertions were removed. The Learning Log received an accessible region name and the existing lesson assertion was scoped to it. Only the two failures were rerun: **2 passed**. Thus **all 32 distinct browser cases passed across that full run and targeted corrections**; no second full browser regression was run.
- Corrected production build with demo mode disabled: `/demo` **404**, `/api/demo` **404**, verified by HTTP requests. The separate guard-check server was stopped afterward.
- Seed and reset commands both executed successfully against isolated local Supabase, with the same scenario identities and IDs. The final seed command also installed five curated official resources.

No claim that every original specification-matrix scenario is independently implemented, no hosted deployment claim, and no claim that simulated outcomes reflect real-world mentoring results.

## Actually verified widths

The existing D2 layout test checks Dashboard, People, Inbox and Profile at **375, 390, 428, 768, 1024 and 1440 px**, with overflow assertions and axe scans. The DM01 demo journey runs at **375 px mobile** and the Desktop Chrome project's **1280 px** viewport. These do not certify every route at every width.

## Routes

Pages: `/`, `/login`, `/onboarding`, `/dashboard`, `/path/[id]`, `/people`, `/people/[id]`, `/people/[id]/request`, `/requests`, `/requests/[id]`, `/profile`, `/projects/[id]`, `/circles`, `/circles/new`, `/circles/[id]`, `/notifications`, `/demo`.

Auth callback: `/auth/callback`.

API routes: `/api/auth/[action]`, `/api/membership`, `/api/profile`, `/api/profile/availability`, `/api/goals`, `/api/goals/[id]`, `/api/steps/[id]`, `/api/people`, `/api/people/[id]`, `/api/projects`, `/api/projects/[id]`, `/api/circles`, `/api/circles/[id]`, `/api/requests`, `/api/requests/[id]`, `/api/requests/[id]/messages`, `/api/requests/[id]/outcomes`, `/api/notifications`, `/api/demo`.

## Fully built

Persisted source-backed paths; opt-in directory and project detail; Circle posts/replies and learning requests; deterministic reasoned matching and teach/learn fields; alumni Built at Tech; server-expiring alumni availability and People filter; reviewed QuickReach; atomic requests and accepted-request polling threads; per-participant outcomes; explicitly shared Learning Logs/project progress; private Impact Cards/Help Chain; persistent private in-app notifications; seven-person real-auth local demo and isolated reset.

## Deliberate limits / partial / skipped

- Impact and Help Chain are private to the profile owner. Public counterpart attribution and an open social graph are not built.
- Available now is a self-reported 60-minute signal, not live presence or guaranteed service. People results are snapshots, not a live subscription.
- `/demo` is local-only; hosted/staging persona provisioning is not built. Existing regression fixture accounts are separate from the seven-person scene.
- Read selections are bounded; no full history pagination for every surface. Reset refuses outside interactions.
- Institutional affiliation/employer verification, real mentorship results, referrals, calendar, attachments, job ingestion, contact importing, production certification and hosted deployment are not claimed.

## Three real challenges / decisions

1. **A not-found screen was not an HTTP 404.** With Next's loading/streaming behavior, disabled `/demo` initially displayed not-found content with status 200. Moving the flag gate into Proxy before rendering produced actual 404s for both the page and API.
2. **Recorded outcomes repeat legitimately across views.** Adding the Impact Card made an old global lesson-text locator ambiguous. Giving Learning Log an accessible region and scoping its existing assertion fixed the test without deleting or weakening the persistence check.
3. **A demo reset must not erase another user's contribution.** The reset uses a private seven-member manifest, stable scenario IDs, a real registered demo session, serialization and cross-namespace interaction checks. It refuses outside requests/comments/reports, preserves Auth identities and unrelated records, and never uses an application-runtime service-role client. Impact identity attribution likewise stays private rather than fabricating consent.
