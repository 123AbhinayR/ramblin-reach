# Agent rules — Ramblin' Reach

Read `MASTER_SPEC.md`, `ARCHITECTURE_SECURITY.md`, `docs/DOMAIN_API_CONTRACTS.md`, `ALGORITHMS_AND_DATA.md`, `UX_DESIGN.md`, and `TEST_MATRIX.md` before touching implementation code. Inspect repository scripts and code first. If conflict exists, report it in the plan and use `MASTER_SPEC.md` as product authority, `ARCHITECTURE_SECURITY.md` as security authority.

1. Build **one** Georgia Tech-specific app. Keep exactly three labeled core capabilities: **JacketPath, JacketMatch, ReachCard**. Knowledge carry-forward is a small part of profiles and outcomes, not a fourth product.
2. Scope explicitly excludes scraping, multi-university support, job ingestion, full messaging, global map, social feed, in-app calendar, referrals, contact importing, and autonomous third-party actions.
3. Use TypeScript strict, Zod on every untrusted boundary, server-owned Supabase client for sensitive operations, no `any`, no `@ts-ignore` without justification.
4. Pure matching/routing functions must take time/config as parameters. No `Date.now()`, random calls, network, or DB I/O in pure functions. Stable deterministic results for tests.
5. No AI-created resource names, eligibility claims, working hours, available equipment, profile facts, employers, or outcomes. AI may normalize a goal to a validated intent, never manufacture people or claim someone accepted a request.
6. Public resource results must be grounded in curated records containing official source URLs and last-reviewed dates. If unknown, say unknown; never infer open-now or live availability.
7. All profiles are opt-in and accessible only to authorized verified members. Never expose email, phone, home address, precise coordinates, scheduling links, or private project artifacts through public APIs or logs.
8. No unauthenticated demo bypass in production. Seeded demo accounts must use real authentication and have visibly fictional data, even when `DEMO_MODE=1`.
9. No automatic alumni verification from self-reported grad year. Domain control is not graduation proof. Account transitions require manual approval or authorized institutional integration in future.
10. Require Row-Level Security on every user-content table. Do not assume RLS solves authorization if using a service-role key. Direct DB insert must not bypass request caps. Implement atomic RPC/DB checks for request creation.
11. Matching must not read protected personal attributes, and must not imply that working at a company guarantees a referral. Do not display pseudo-precise AI compatibility percentages.
12. Use neutral, accessible brand visuals; avoid GT official logos, seals, mascots, and implied endorsement. Footer: `Ramblin' Reach is an independent student project and is not affiliated with or endorsed by Georgia Tech.`
13. Every page needs sensible loading, error, empty, and success states. Every interactive control must work or be removed. Responsive minimum: 375 px, WCAG 2.2 AA aspiration, keyboard and screen-reader support.
14. Tests from `TEST_MATRIX.md` must be implemented with visible IDs. Make `npm run check` (typecheck, lint, unit tests) green before milestone completion. Run E2E and DB/RLS tests for their respective milestones.
15. Report exactly which tests ran and passed; never claim deployment or verified integration you did not actually perform. No placeholders, fake functional buttons, or hidden mock responses presented as live.
16. Use domain-verified Google integrations only if explicitly authorized and necessary. Antigravity is not required. No Google Calendar or Maps API in this MVP.
17. Do not change unrelated files. Keep dependencies minimal. Log major decisions and deviations in `IMPLEMENTATION_PLAN.md`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
