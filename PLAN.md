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
- [x] 3: QuickReach templates/review, accepted-request messages, polling/unread Inbox; security + persisted two-account E2E.
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

## Phase 3 checkpoint — November 14, 2026

| Checkpoint | Result | Evidence |
|---|---|---|
| QuickReach | Passed | Connect on People cards, helper profiles and Circle posts; eight static editable reason templates, offered topics, review then explicit send. Existing ReachCard creation/caps retained. |
| Lifecycle / Inbox | Passed | Existing request is thread identity; recipient accepts/declines, both reply only after acceptance, Close uses Completed and preserves outcomes. Desktop split view, mobile list/detail/back, 3s thread and 5s Inbox polling, unread read cursors. |
| Typecheck / lint / units | Passed | `npm run check`: typecheck, zero-warning lint, 64 tests in 11 suites. QR16–QR17 cover template and message boundaries. |
| Database / RLS | Passed | `npm run test:db`: 84 total = 51 transactional + 6 concurrent/month-boundary + 11 Circles + 16 Inbox (QR01–QR15, QR19). Tests include participant/anonymous denial, direct-write denial, retries, length, rate, consent/block, decline and close. |
| Production build / browser | Passed | `npm run test:e2e` builds the production app, then all 28 tests passed on desktop/375px mobile. QR18 extends E05–E09/E16: two real authenticated parties reply, unread indicator, reload persistence, unrelated HTTP and page denial, close and private outcome. No skipped tests. |
| Visual review | Passed | Loaded desktop split view and mobile Inbox/thread screenshots copied to `.tmp/phase3-review/`; thread axe scans have no serious/critical violations and overflow assertions pass. |
| Delivery scope | Local verified | Migrations 005/006 applied to isolated local Supabase. Commit/push remains on `feat/circles-quickreach`; no main merge, hosted migration or deployment. |

Changed areas: ReachCard templates/review and Connect links; request list/detail, polling and message APIs; Inbox/Thread components; message/read schemas and database types; two additive migrations; database/unit/browser tests and API/test/implementation records. No dependency additions or replacement backend.

Initial browser runs exposed a Reply accessible-label ambiguity, a hidden-profile name assumption and two test navigation races. Corrected them; the final full run above passed all 28. Prior assertions were retained, with Close exercising the existing Complete transition. Local screenshot files remain ignored review artifacts. Existing generated `next-env.d.ts` changes are excluded from the commit.

Operational limits: deploy both additive migrations before using this build against another database. The Inbox lists the latest 50 requests; thread history catches up in ordered batches of 100. No email delivery, realtime sockets, attachments or hosted integration is claimed. Phases 4, 4B and 5 remain open; next bounded work is Phase 4 per this plan.
