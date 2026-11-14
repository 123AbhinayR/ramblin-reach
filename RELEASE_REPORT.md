# Hackathon release evidence — November 14, 2026

Ramblin’ Reach now connects an authenticated student's goal to a sourced path, an opted-in helper, a structured ReachCard, a separate alumni response, a self-reported outcome, and voluntarily shared project knowledge. This is a verified local hackathon application, not a claim of campus adoption or a verified hosted deployment.

## Completed

- A: six selectable examples; searchable US/international/custom metros; consistent normalization; exact company AND city search; balanced format controls; unavailable-helper protection; mobile header/navigation fixes; outcome edit defaults; truthful inbox-success copy.
- B: server-authoritative student/alumni dashboards, next incomplete action, role-appropriate request controls, availability/topics, shared navigation, contextual profile guidance, and project-lesson discovery.
- C: owned-goal request prefilling; deterministic optional ReachReady feedback; private outcomes; owner-scoped project editing with explicit publication consent and withdrawal. Existing RLS, quotas and verification rules remain enforced.
- D: fresh production browser tests, four-width/axe sweep, real database authorization and races, runtime dependency audit, client-secret scan, source caveats, and demo/deployment runbook.

## Executed checks

- `npm run check`: typecheck, zero-warning lint, 54 unit tests passed.
- `npm run build`: passed separately and in production-browser setup.
- `npm run test:db`: 51 transactional security/workflow checks and 6 committed concurrency/month-boundary checks passed. Disposable race identities are removed; ordinary/demo user data is preserved.
- `npm run test:e2e`: 24 tests passed across desktop and mobile, including a full owned-goal → helper → request → separate alumni acceptance → completion → private outcome journey. Request contexts use actual viewport/touch settings. Outcome edit prepopulation is asserted.
- `npm run test:e2e -- tests/e2e/release-layout.spec.ts`: 2 additional tests passed. Dashboard, People, Requests and Profile were checked at 375, 390, 768 and 1440px and scanned for serious/critical axe issues. Path and ReachCard axe/overflow checks also run in the core suite.
- `npm audit --omit=dev --audit-level=moderate`: zero runtime vulnerabilities reported. Previously recorded moderate development-tool dependency findings are not represented as resolved.
- Client-secret scan: the local service-role credential was absent from all 50 compiled client JavaScript files. Credential files remain ignored. Application source does not import the service-role key.
- Screenshots captured at 375/1440px; desktop dashboard inspected. The test-data discovery clutter found during review was hidden without deleting records, and test-account cleanup now hides future fixtures.

## Honest limits

Not every one of the original kit's 136 named scenarios has a separate executable test. These results establish the implemented hackathon journey and the listed security checks, not a full WCAG certification or production security certification. Live AI, ongoing mentorship administration, notifications, scheduling, referral workflows, and institutional verification integration are deferred. Membership approval remains manual. Employer data is self-reported.

Only five reviewed official resource records are enabled; other source candidates are not silently recommended. Sources carry review dates and access caveats; no live opening, equipment, funding or eligibility promise is made. Project contributors must review publication text; the app does not provide automated moderation or infer third-party consent.

No hosted Vercel/Supabase deployment has been executed or verified. Use `DEMO_RUNBOOK.md` for the three-minute local demonstration and deployment handoff. The shipped seed only accepts the isolated local database.

## Git checkpoints

- A: `e4a1311` — preserved handoff work plus UX/location fixes.
- B: `b89f5f4` — student/alumni dashboards.
- C: `fa103b9` — opt-in project lessons and contextual outreach.
- Final D checkpoint and merge are recorded in Git history after the final regression. Development occurs on `dev`; `main` receives only the verified merge. No force push or history rewrite.
