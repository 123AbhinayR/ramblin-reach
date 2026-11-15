# Circles and QuickReach delivery plan

Branch: `feat/circles-quickreach`. Baseline: `0417631`. No parallel agents.

## Existing / reuse
Next.js 16, strict TypeScript, Tailwind, Lucide, Radix button, Zod, cookie-session Supabase and PostgreSQL RLS. Persisted JacketPath, deterministic JacketMatch, atomic ReachCard creation/transitions, participant-only outcomes, opted-in projects, role dashboards, real demo authentication, Vitest/Playwright/DB tests already exist. Preserve these systems and all tests. Existing local `next-env.d.ts` edit remains untouched.

## Scope decision
User explicitly approved on November 14: this brief supersedes the old prohibition on Circles and accepted-request private messaging. Keep three core capability names: JacketPath, JacketMatch (including Circles), ReachCard (including QuickReach and Inbox). Security authority remains ARCHITECTURE_SECURITY.md. Circles are verified-member-only. Demo persona switching must authenticate; reset must affect only isolated demo data.

## Data changes planned
Member-only circle posts/comments/reports with atomic write limits and ownership checks; messages and per-participant read cursors attached to existing connection_requests; optional teach/learn and Built at Tech profile fields; persistent participant notifications. Reuse member_projects and outcomes for learning records. Every new table needs RLS, DTO validation and DB access tests.

## Gates / critical path
- [x] 0: inspect stack, establish branch, record scope. Baseline check: 54 tests passed, typecheck/lint passed.
- [x] 1: mobile bottom navigation, shared styles, role home; build, full browser regression, responsive Home/People checks and screenshots verified.
- [x] 2: six Circles, post/edit/delete/resolve/report, comments, help action; validation/category/ownership unit tests, DB controls, and two-account E2E verified.
- [ ] 3: QuickReach templates/review, accepted-request messages, polling/unread Inbox; security + persisted two-account E2E.
- [ ] 4: project-to-people loop, explainable teach/learn matching, outcomes and notifications; full-loop E2E.
- [ ] 4B: Built at Tech, expiring availability, recorded-data Impact Card/Help Chain only after P0 green.
- [ ] 5: deterministic isolated authenticated demo/reset, screenshots, full regression and release documentation.

Commit and push each verified gate; never merge main or force-push. First unfinished gate is 3. Cut Help Chain SVG, learning-log polish, notifications, extra circle styling first; preserve posting, requests, inbox, project links, seeded demo and mobile quality. No new auth/backend, email, calendar, scraping, attachments, embeddings, referrals, or websockets.

## Phase 2 checkpoint — November 14, 2026

- [x] Confirmed branch `feat/circles-quickreach`. The reported 23-file handoff was already committed as `935201c`; the starting working tree and staging area were clean. No existing work was discarded.
- [x] Ran the existing regression once: typecheck, lint, 58 unit tests, production build, 68 database checks all passed. The database total is 51 transactional + 6 concurrency + 11 Circles checks.
- [x] Retained post validation and category-filter tests CI01–CI04; added owner/foreign/anonymous management-permission coverage CI18. The same ownership guard is used by the page and mutation handler; database RLS remains authoritative defense in depth.
- [x] Extended CI16/CI17 browser coverage: student posts, correct category includes it, wrong category excludes it, owner edits, alumnus replies, foreign edit/resolve rejected, student resolves, resolution survives reload, resolved discussions stop accepting replies.
- [x] Fixed repeated saved goals from the supplied image: group the latest 30 saves by normalized goal/intent/company/city; show at most four distinct goals, with save date and repeated-save count. Each entry opens its newest path. All database records remain intact.
- [x] Three visual fixes reviewed: compact distinct saved-goal entries; separated Circle owner actions from reply composition; reply submit control sized to its label, with replies aligned to the discussion width. Form controls have scroll clearance for the mobile dock.
- [x] Captured loaded Home and Circle screenshots at 390px and 1440px; added horizontal-overflow and Circle axe assertions. Screenshots are local review artifacts under `.tmp/phase2-review/`.
- [x] Final expanded check: typecheck, zero-warning lint, 62 unit tests passed. Full production browser regression: 28 passed. Updated the old request-test locator to the intended `Inbox` navigation label; all assertions retained, no tests skipped or weakened.
- [ ] Phase 3 implementation: QuickReach templates/review and accepted-request messaging with participant/read-cursor security. Not implemented or claimed by this checkpoint.

Phases 4, 4B and 5 remain open. Earlier saved data and unrelated files are preserved. Final changes are committed/pushed only on this feature branch; no merge to main.
