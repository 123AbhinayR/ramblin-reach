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

Milestone 01 complete: the public application scaffold is verified. Authentication, database workflows, and the end-to-end MVP are not implemented yet. Browser-based repository creation could not proceed because Computer Use could not verify the current browser URL; the authorized command-line route succeeded.

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

Latest runtime check: `wsl --status` outside the sandbox still reports WSL2 unable to start because the virtualization platform is unavailable. Firmware virtualization was reported enabled by Windows; the host component/restart state needs resolution before claiming local Supabase readiness. No database has been created or seeded.
