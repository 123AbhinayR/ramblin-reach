# Ramblin' Reach

Ramblin' Reach turns a Georgia Tech student's goal into a source-backed next-step plan and a connection to a consenting Jacket who can help, passing practical know-how forward long after graduation.

**Sponsor-aligned tagline:** *Learn from the campus. Learn from each other. Pass it forward.*

## Core capabilities shipped

1. **JacketPath**: Deterministic goal classification into structured, reviewed 3–5 step paths grounded in official Georgia Tech facilities (Hive, Invention Studio, CREATE-X, Regional Networks, Career Center) with review timestamps and eligibility constraints.
2. **JacketMatch**: Searchable directory with company, city/metro, help topic, affiliation, and availability filters. Exact company AND city intersection with honest, clearly labeled alternative suggestions when exact matches are empty. Factual, non-speculative match explanations and project mini-portfolios.
3. **ReachCard & Inbox**: Structured 1-to-1 requests with deterministic ReachReady coaching (C01–C15), character constraints, format choices, server-side atomic capacity checks, and full inbox workflow (Sent/Received, Accept/Decline, Cancel, Complete).
Private outcomes stay within completed ReachCards. Members may separately publish or withdraw their own project lessons through Profile.

**Security & Privacy**: Strict TypeScript, Zod boundary validation, Supabase Auth SSR, PostgreSQL Row Level Security (RLS) on all user tables, atomic database RPCs with concurrency locks and monthly caps, private demo account isolation, and zero external tracking.

## Run the application

Use Node 24 and npm. Run `npm ci`, then `npm run dev`, and open http://127.0.0.1:3000.
The public landing page requires no credentials. Sign-in truthfully displays a setup state until Supabase is configured.

Run `npm run check` for strict typechecking, zero-warning linting, and unit tests; `npm run build` for the production build; and `npm run test:e2e` for Playwright browser checks.

For local member workflows, start Docker and run `npx supabase start`. Copy public API settings into `.env.local` using `.env.example`, and admin/database settings into `.env.seed.local` using `.env.seed.example`. Set `APP_ENV=local`, `DEMO_MODE=1` for the app and `ALLOW_DEMO_SEED=1` for the isolated seed. Run `npm run db:seed`. The seed creates 14 fictional real Auth identities and writes their local passwords to ignored `.tmp/demo-accounts.json`. Local confirmation/recovery emails stay in Mailpit at http://127.0.0.1:54324. Never reuse this local test configuration for production.

Do not put service-role credentials into the Next application environment. Operator secrets belong only to ignored seed/admin environment files.

## Original build-kit documentation

The following is the supplied specification documentation. See `IMPLEMENTATION_PLAN.md` for approved decisions and actual milestone status. `MANIFEST.md` records the original kit, not hashes of subsequently edited implementation files.

## Lifetime Learning Hackathon Build Kit

**Tagline:** Learn from the campus. Learn from each other. Pass it forward.

**Goal:** Build one elegant, secure, full-stack Georgia Tech-only experience with **JacketPath → JacketMatch → ReachCard**. Do not implement three independent apps.

## Quick start in Codex
1. Extract this ZIP into a new repository, or copy its files into the root of the existing repository. `AGENTS.md` must be at the root.
2. Open Codex and use Plan Mode with `prompts/00_PLAN_ONLY.md`. Codex should inspect the current code before making changes.
3. Review its plan, then execute `prompts/01` through `prompts/07` one at a time. Require evidence of tests before moving to the next phase.
4. Use `MASTER_SPEC.md` as the product authority, `ARCHITECTURE_SECURITY.md` and `docs/DOMAIN_API_CONTRACTS.md` for implementation invariants, `UX_DESIGN.md` for page behavior, and `TEST_MATRIX.md` for acceptance.
5. Provide environment values in `.env.local` yourself; do not paste credentials into AI prompts or commit them. Use `DEMO_MODE=1` only in local/staging environments and explicit seeded demo accounts.
6. When finished: `npm run check`, database RLS tests, `npm run test:e2e`, and `npm run build`. Run the full E2E demo with two separate signed-in accounts.

## Documents
| File | Contents |
|---|---|
| `MASTER_SPEC.md` | Purpose, user journeys, scoped features, requirements, acceptance, demo scenario |
| `ARCHITECTURE_SECURITY.md` | Stack, data entities, RLS and RPC rules, API contracts, identity, AI safeguards |
| `ALGORITHMS_AND_DATA.md` | Goal classification, resource sequencing, member matching, graceful fallbacks, official source seed candidates |
| `UX_DESIGN.md` | Mobile-first screens, visual system, accessibility, microcopy, interactive states |
| `TEST_MATRIX.md` | Deterministic unit, database/RLS, API, E2E and accessibility test cases |
| `LIFETIME_LEARNING_PITCH.md` | Sponsor-aligned pitch, differentiators, competitor honesty, 3-minute script, judge objections |
| `SCOPE_AND_DELIVERY.md` | Cut line, phases, ownership, demo checks, rollout, impact measurement |
| `AGENTS.md` | Persistent coding rules for Codex |
| `START_IN_CODEX.md` | Read-only Plan Mode copy/paste and sequential workflow |
| `docs/DOMAIN_API_CONTRACTS.md` | Canonical enums, request/response contracts and status machine |
| `docs/RESEARCH_SOURCES.md` | Official reference URLs and novelty boundaries |
| `docs/LOCAL_SETUP_AND_SECURITY.md` | Local setup, environment and security operator checklist |
| `.env.example` | Environment names without secrets |
| `prompts/` | Plan-only and six bounded implementation prompts |
| `data/seed_sources.json` | Official Georgia Tech resource references, not real-time availability |

## Key scope decisions
- **Build**: student goal entry, 3–5 step source-backed JacketPath, city/company/skills JacketMatch, tiny opt-in project portfolio/lesson, ReachCard request plus accept/decline, one meaningful-outcome field.
- **Not build**: live job feed, university directory scraping, private messaging, warm introduction chains, maps, event scheduling, generic chatbot, social feed, equipment inventory, automated referral, campus-wide integration, multi-university support.
- **Future**: same-account student-to-alumni verification and knowledge continuity, with safe data ownership. Schema must permit transition; production-grade registrar integration is not a hackathon dependency.

## Definition of done
- A seeded student submits a goal about an environmental sensor, sees accurate campus resources with official links, finds an opt-in demo helper, sends a request, a separate demo alumni account accepts it, and the student can record a next step.
- A student filters JacketMatch by **Seattle** and **Microsoft** (or another seeded employer), with no fabricated results and a useful alternative state if the intersection is empty.
- All synthetic people and outcomes are marked **Demo**. No private contact data leaks. All server and RLS checks pass.
- The app works on a 375 px phone viewport and a desktop, is keyboard accessible, and remains usable when the AI call fails.

**Status:** This kit is a build specification, not a completed or tested running application.
