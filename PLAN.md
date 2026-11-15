# Ramblin’ Reach — current delivery plan

Single Georgia Tech-specific app; core capability names remain JacketPath, JacketMatch and ReachCard. Product/security authorities remain MASTER_SPEC.md and ARCHITECTURE_SECURITY.md. No parallel agents. Historical implementation evidence is retained in IMPLEMENTATION_PLAN.md and Git history; this checklist replaces stale gate statements.

## Complete

- [x] Core 1–5: project detail/contextual QuickReach, deterministic explained matching, outcomes/Learning Log/project progress, teach/learn and alumni Learning Requests, persistent in-app notifications.
- [x] Built at Tech: optional alumni title/year/lab or club, self-reported title-tag matching bonus/reason; year never influences rank.
- [x] Available now: server-owned 60-minute alumni expiry, opt-in capacity checks, expiring People badge, People filter; existing Quick Question template retained.
- [x] Impact Card / Help Chain: private profile-owner views derived only from completed request/outcome records. No invented outcomes, public helper attribution or endorsements.
- [x] Deterministic local scene: three students, four alumni, three projects, discussions across six circles, reciprocal Learning Request, accepted conversation and completed simulated outcome. All scene content marked DEMO DATA. Existing local accounts/data preserved.
- [x] `/demo`: real Supabase persona sign-in, isolated reset, explicit local/demo guards; page and API return actual HTTP 404 when disabled.
- [x] Targeted logic: 10 passing expiry/filter, matching and Impact cases. New DM01 real-auth full-loop Playwright test passed on desktop/mobile.
- [x] Final regression: typecheck, corrected zero-warning lint, 81 unit tests and 103 DB/RLS/concurrency checks passed. One full browser run had 30 passed and 2 new duplicate-locator failures; region-scoped corrections reran both successfully. All 32 distinct browser cases now pass; no tests skipped or assertions removed, and no second full browser run.
- [x] README.md, DEMO.md and DEVPOST_FACTS.md describe implemented behavior, exact checks, setup and limits.

## Release / cleanup (authorized by latest user instruction)

- [x] Confirm clean task work and no tracked/staged secrets; preserve unrelated generated next-env.d.ts.
- [x] Tag current main as pre-merge-backup and push the tag.
- [x] Normal merge into main; stop on conflicts. Build main once and push only if it passes.
- [x] Record every other local/remote branch and tip in DELETED_BRANCHES.md before normal deletion; retain main.

## Boundaries

Apply migrations through 013 before this build. Seed/reset commands require isolated local Supabase and explicit seed consent. Demo passwords remain in ignored `.tmp/reach-demo-accounts.json`; the application has no service-role client. Reset refuses cross-namespace interactions. Private notes never become public log text automatically. No hosted deployment, institutional verification, live presence, guaranteed mentoring, job/referral outcome, external messaging or calendar is claimed. Rehearsal and recovery commands are in README.md and DEMO.md.

Release result: normal merge `9698901` completed without conflicts; the build on main passed and main was pushed. `pre-merge-backup` preserves `77e759522980316d361e74bed4c4496462eacb3b`. All three other branches were recorded in DELETED_BRANCHES.md before normal deletion locally and on origin. Only main remains. The final recovery-record commit changes documentation only; no second main build was run.
