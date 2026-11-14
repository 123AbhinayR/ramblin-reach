# Ramblin’ Reach — approved implementation record

The source specification kit was read and its 25 manifest payloads verified before implementation. The workspace initially contained only an empty Git repository. Original specification content is retained; approved changes are recorded here.

## User-approved delivery

- Next.js App Router, strict TypeScript, Supabase Auth/Postgres/RLS, Tailwind/shadcn, Vitest, Playwright and axe.
- Email/password with confirmation/recovery; manual membership approval, separate from email ownership.
- Local Docker/Supabase for real database tests; isolated hosted staging when configured.
- Updated budget: approximately 12 hours. Protect the functional, secure three-feature workflow, private outcome, and mobile accessibility. Public lesson editing and live AI are stretch work.
- Create private `123AbhinayR/ramblin-reach`; test before each small commit/push. User has authorized incremental progress through phases with reports, superseding the kit's per-phase approval prompts.

## Resolved specification differences

1. Private outcomes are core because the required demo/E09 needs them.
2. Default sensor route has four steps; explicit startup/funding intent permits a conditional fifth CREATE-X step.
3. Requested affiliation is private; authoritative affiliation and verification are operator-controlled.
4. Fixture verification booleans map to demo/pending states; usage is derived from persisted requests.
5. Persist immutable source snapshots; add safe request project URLs and retry idempotency.
6. Add explicit deployment environment and database demo permission; NODE_ENV alone does not distinguish staging from production.
7. Mobile navigation is Home, People, Requests, Profile. No fourth branded product.
8. All 136 test IDs remain traceable; optional unimplemented scenarios are deferred, never reported as passing.

## Build order and release gates

1. Scaffold/design: check, build, mobile landing/accessibility smoke; first tested commit.
2. Auth/database: real Auth identities, migrations/RLS/RPCs, protected fields, safe seed; real database and concurrency tests.
3. JacketPath: deterministic parser/router, reviewed sources, owner persistence; P01–P20, E02/E03.
4. JacketMatch: hard eligibility, exact company AND metro, factual reasons, project filters; M01–M23, E04/E10/E11/E19.
5. ReachCard: structured request, atomic quota, retry reconciliation, state machine, private outcomes; C/R/O/S cases and two-account E2E.
6. Polish/staging: errors/empty/loading states, focus, 375px–1440px, axe, environment/runbook.
7. Audit: no new features; exact test evidence, privacy review, source accuracy, three-minute rehearsal.

No service-role key in application runtime; no anonymous demo bypass; no fabricated sources/people/outcomes; no scraping/chat/maps/calendar/referrals. No release claim without executed tests.

## Current status

Milestone 01 complete. Milestone 02 is in progress: its first increment implements authenticated accounts and profile privacy. Request workflows and the end-to-end MVP are not complete. Browser-based repository creation could not proceed because Computer Use could not verify the current browser URL; the authorized command-line route succeeded.

Repository created privately at https://github.com/123AbhinayR/ramblin-reach using existing Git Credential Manager authentication; no token was written to files. Docker Desktop installed, but WSL was absent and is being installed without an automatic restart.

Tooling compatibility: ESLint 10 produced invalid peers with the pinned Next.js config's import/react/accessibility plugins. Pin ESLint 9.39.5, which satisfies their peer ranges, and track its upstream deprecation for a coordinated lint-tooling upgrade. Do not suppress lint failures or force incompatible peers.

Build adaptation: Next 16.4.6 Turbopack's PostCSS worker crashes before IPC connection on this Windows host both inside and outside the sandbox. Use Next's supported Webpack mode for dev and build; keep the requested Next/Tailwind architecture and test the actual compiled output.

### Milestone 01 evidence — November 14, 2026

- `npm run check`: strict typechecking and zero-warning lint passed; 5 unit tests passed.
- `npm run test:e2e`: 4 tests passed across desktop and 375px mobile. These verify landing navigation, overflow, and no serious/critical axe violations; they do not claim the complete E14/E16 product scenarios pass.
- `npm run build`: optimized Webpack production build passed.
- `npm ls --depth=0`: dependency tree resolved without invalid peers after the ESLint correction.
- Initial accessibility contrast failures were corrected and the browser suite rerun successfully.
- No database/RLS, authenticated journey, hosted deployment, or live AI verification has occurred.

### Latest user steering

Save the tested work to GitHub now. Pause new feature work while the Docker setup is clarified. Resume with the smallest real end-to-end MVP: authenticated learner -> persisted sourced path -> opt-in helper -> atomic request -> distinct helper acceptance -> private outcome. Keep small tested pushes. No further landing-page expansion, live AI, or public lesson authoring before this flow works. Docker Desktop and Microsoft WSL packages are installed; runtime readiness still needs verification, and no automatic reboot was performed.

The user subsequently instructed “continue building exactly the plan,” superseding the pause. Docker now runs successfully with WSL2. Local Supabase has been initialized, migrated, and seeded with 14 fictional Auth identities. No hosted database or deployment is claimed.

### Milestone 02A — accounts and membership foundation

- Added cookie-based Supabase SSR authentication, confirmation callback, password recovery, sign-out, onboarding, membership-review requests, and persisted profile editing. New accounts remain pending and private. Graduation year and requested affiliation cannot grant privileges.
- Added membership/profile/block RLS, column-level privilege protection, private deployment/demo gate, and shared database rate-limit storage. SQL test fixtures run inside a rolled-back transaction.
- Seed tooling only accepts the isolated local Supabase URL/database and explicit seed consent. Credentials are generated into ignored `.tmp/demo-accounts.json`; service-role keys are confined to `.env.seed.local`.
- `npm run check`: strict typecheck, zero-warning lint, 9 unit tests passed.
- `npm run test:db`: 15 real PostgreSQL checks passed (S01–S06, S09, S12 discovery portion, S16, S20 profile portion, membership and rate-limit assertions). These IDs are partial coverage where later request/project tables are still required.
- `npm run test:e2e`: production build succeeded and 12 tests passed across desktop and 375px mobile. Includes real sign-in/out, profile persistence, pending membership restrictions, rejected-origin/anonymous writes, signup email confirmation, recovery email/password change, landing/profile axe scans, and overflow checks.
- Browser failures exposed an ambiguous password label and development hot-reload interruptions. Corrected the label, use a fresh document on auth changes to clear prefetched session-bound routes, and run E2E against the actual production server.
- Runtime dependency audit: zero vulnerabilities. Full audit: seven moderate development-only findings in the TypeScript ESLint/minimatch chain. `npm audit fix` could not resolve them within compatible dependencies; retain visibility and revisit during the final tooling audit.
- Remaining in milestone 02: goals/resources/projects/request/outcome schemas, immutable source snapshots, atomic request RPCs, quota races, and full DB/RLS coverage. Then implement JacketPath, JacketMatch, and ReachCard UI/API in the agreed order.

### Milestone 02B — database workflow checkpoint

Implemented learning/project/resource tables, immutable evidence snapshots, atomic goal persistence, participant-only requests/outcomes, protected state transitions, retry idempotency, and monthly capacity counts. Generated database types from the migrated local schema. Seeded fictional project lessons and persisted simulated requests for fixture quota usage.

Verified: `npm run check` passed (9 unit tests, typecheck, lint); `npm run db:seed` passed with 14 real Auth demo accounts; `npm run test:db` passed 51 transactional checks and 6 committed concurrency/month-boundary checks. Corrected SQL parameter type inference in the project seed. No claim of a complete browser demo: core feature UI/API remains to be built.

User priority update: preserve and checkpoint all current work, keep a localhost preview, then focus on one reliable student-to-alumni journey. Estimated tested MVP completion is approximately 30%, weighted by usable functionality rather than code volume. Authentication/profile flows work; backend workflow invariants are tested; the goal/path, directory/matching, request inbox, and outcome screens are still missing.

### Milestone 03 — persisted JacketPath

Added the goal dashboard, deterministic prerequisite-aware routing, five official resource records, authenticated goal/read/progress APIs, and a saved source-backed checklist. The default sensor plan has four steps; explicit funding adds a conditional CREATE-X step. Invalid reviews, missing prerequisites, and cycles fall back to safe action steps. Software goals do not automatically recommend electronics spaces.

Verification: `npm run check` passed with 27 unit tests; production build and all 14 Playwright tests passed, including desktop/mobile goal creation, official evidence, persisted completion after reload, overflow, and axe checks. Existing authentication tests remained green after switching to mobile workspace navigation. Ordinary sign-out is now session-local; password resets still revoke all sessions.

Source review on November 14: Hive, CREATE-X, and Regional Networks retrieved directly. Invention Studio and Career Center direct fetches returned gateway errors; official indexed pages corroborated their limited descriptions. No hours or live-access claims were added. Source records preserve eligibility caveats and unknown availability. Additional source candidates are not enabled. SQL RPC argument types were adapted to represent nullable arguments accepted by the actual database; generated CLI types incorrectly omitted nullability.

### Milestone 04 — JacketMatch directory and people matching

Delivered searchable people directory (`/people`), individual profile view (`/people/[id]`), factual match reasons, project memories with practical lessons, and truthful empty and alternative sections when exact company and metro combinations yield no volunteers.

Verification:
- Tested exact company AND metro filtering with honest alternatives.
- Tested profile memory lessons, demo profiles, and privacy guards.
- All 11 unit tests in `matching.test.ts` passed (M01–M12, M17, M19, M21, S18, R23).

### Milestone 05 — ReachCard end-to-end request workflow, inbox and private outcomes

Built the complete structured help request lifecycle:
- ReachCard request form (`/people/[id]/request`) with deterministic ReachReady coaching (C01–C15), character boundaries, format selection, and optional safe public project link validation.
- Connection requests API (`/api/requests`, `/api/requests/[id]`) backed by atomic database RPCs enforcing monthly quota, idempotency, duplicate pending check, and rate limiting.
- Full participant-only inbox (`/requests`) with Received and Sent sections, dynamic status badges, and transition actions: helper Accept/Decline, student Cancel, participant Mark as Complete.
- Private outcome recording (`/api/requests/[id]/outcomes`) after completion, storing self-reported outcomes and private notes accessible only to participants.
- Workspace navigation updated with accessible Requests link (`/requests`).

Verification:
- `npm run check`: 48 unit tests passed across 6 test suites (domain, auth, intent, routing, matching, reachcard). Zero type errors, zero lint warnings.
- Playwright E2E (`tests/e2e/requests.spec.ts`): E05–E09 passed on both desktop and 375px mobile viewports, including live authentication, ReachCard submission, helper acceptance, student completion, private outcome persistence, and axe-core accessibility checks.

### Refinement handoff — November 14

The user supplied an updated A–D release brief. Inspected local and remote branches before editing; created `dev` from `backup/codex-handoff-2026-11-14` (967478f) with all eight modified files and both untracked refinement files preserved. No history was rewritten. Latest steering authorizes continuing B–D after A passes, superseding the brief's original stop after A.

Milestone A changes: six distinct selectable goal examples; shared searchable city input across profiles, goals and discovery; international/custom city validation with canonical aliases; case-insensitive exact company AND city matching; radio sizing, session action loading reset, existing-outcome defaults, unavailable recipient form/CTA protection, truthful inbox-success copy, mobile profile CTA visibility, four-column narrow navigation, and narrow header wrapping. A database-returned idempotency key now accepts PostgreSQL GUID syntax: seeded quota requests contained valid database UUIDs without RFC version bits and previously crashed the inbox. New request input validation remains strict.

Test infrastructure uses a fresh production server instead of reusing a stale preview. Request journey tests create isolated fictional authenticated accounts in the allowlisted local database, preserving existing accounts and request history rather than exhausting the manual demo quota. No destructive reset or deletion was performed.

Milestone A verified: typecheck/lint and 52 unit tests green; production build green; 51 transactional plus 6 concurrency/database checks green. Final fresh-production browser regression: all 20 tests passed, including keyboard city search at 375/390/768/1440 and separate authenticated request/accept/complete/private-outcome journeys. Prior failures exposed and prompted the fixes above. No hosted deployment is claimed.

Milestone B: server-authoritative affiliation now selects the student or alumni workspace. Students see their next incomplete saved action, active connections, new-goal examples and opt-in project lessons. Alumni see pending requests with direct response controls, accepted connections, help settings and optional new goals. Profile guidance reflects affiliation; shared navigation remains available. No schema/auth replacement or privilege changes. Verified `npm run check` (52 tests), production build, and 4 targeted desktop/mobile role-dashboard and refinement browser tests. Project editing and contextual request refinements continue in C.
