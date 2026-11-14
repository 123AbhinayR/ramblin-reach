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
- [ ] 1: mobile bottom navigation, shared styles, role home; build + 390/1440 Home/People screenshots and visual fixes.
- [ ] 2: six Circles, post/edit/delete/resolve/report, comments, help action; unit + DB + two-account E2E.
- [ ] 3: QuickReach templates/review, accepted-request messages, polling/unread Inbox; security + persisted two-account E2E.
- [ ] 4: project-to-people loop, explainable teach/learn matching, outcomes and notifications; full-loop E2E.
- [ ] 4B: Built at Tech, expiring availability, recorded-data Impact Card/Help Chain only after P0 green.
- [ ] 5: deterministic isolated authenticated demo/reset, screenshots, full regression and release documentation.

Commit and push each verified gate; never merge main or force-push. First unfinished gate is 1. Cut Help Chain SVG, learning-log polish, notifications, extra circle styling first; preserve posting, requests, inbox, project links, seeded demo and mobile quality. No new auth/backend, email, calendar, scraping, attachments, embeddings, referrals, or websockets.
