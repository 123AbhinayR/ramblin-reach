# Scope lock, implementation plan and release gates

## What “winning” means for this build

The judges see **one technically credible, polished workflow** whose value is obvious in 3 minutes. Not an AI chatbot, not a 200-screen portal. A demo can complete from a real login → goal → reviewed steps → opt-in person → persistent request → other user accepts. The user can navigate company and city filters on mobile; private data remains protected even through direct SQL attempts.

## Critical scope boundary

**Must implement (P0):** authentication and 2 legitimate demo users, opt-in/verification status, curated resources and deterministic goal routing, 3–5 JacketPath steps, city/company/help-type JacketMatch filters, truthful explanations/capacity, ReachCard creation, accept/decline and inbox, server-side RLS/RPC guards, accessible mobile-first UI, tests, deployment procedure.

**Polish after P0 (P1):** optional AI coaching, simple project mini portfolio, optional outcome and single opt-in public lesson, partial source-check verification utility, one more polished goal archetype.

**Not in scope:** live jobs/ATS feeds, PWA/native apps, maps, organization integration, live facility occupancy, real equipment reservations, generic document retrieval or crawling, funding applications, full chat/scheduling, referrals, automatic warm introductions, social graph, multi-university support, complex graduation verification, employer validation via third parties.

If timeline becomes constrained, cut the **P1 features** immediately. Do not drop RLS tests, genuine request persistence, clear source labels, or mobile usability. No feature should show an inactive button.

## Implementation dependencies

```
Read-only plan approval
  └─ scaffold + design system + tests
      └─ Supabase migration + RLS + demo Auth identities
          ├─ catalog + JacketPath pure routing → path API/UI
          ├─ JacketMatch filters/ranking → people API/UI
          └─ ReachCard RPC + inbox → request UI
              └─ end-to-end Playwright flow
                  └─ optional AI critique, lesson, extra states
                      └─ accessibility/security review, deploy
```

## Milestones and acceptance

| Stage | Work | Must prove before moving |
|---|---|---|
| 00 PLAN | Inspect repo, challenge conflicts, risk register, phase breakdown; **no edits** | User approves IMPLEMENTATION_PLAN |
| 01 SCAFFOLD | Next.js TypeScript, shadcn/ui, Tailwind, repo scripts, responsive shell | `npm run check` and build pass; no broken navigation |
| 02 AUTH/DB | Supabase SSR verified identity, migrations and RLS, fixtures, atomic request SQL | SQL S01–S22, seed reproduces, no direct-table write bypass |
| 03 PATH | reviewed catalog, deterministic classifier/router, path UI | P01–P18 and E02–E03 pass, no invented resources |
| 04 MATCH | search/filter/rank, opt-in profiles, mini-portfolio if time | M01–M23 and E04/E10/E11, truthful exact vs alternatives |
| 05 REACHCARD | validation, RPC, inbox, status, optional outcome | C01–C08 and R01–R20; E05–E09, auth switch persists |
| 06 POLISH | AI coaching optional, fallback, responsive/axe, deploy/runbook | E12–E20, build/check/db/e2e pass or failures reported |
| 07 AUDIT | independent final review including privacy, access, source accuracy and demo | release checklist, no claims of unrun checks |

Codex prompts have exactly corresponding filenames under `prompts/` and must be run **one at a time** after reviewing each milestone's report. The `AGENTS.md` rules persist across phases.

## Demo-failure plan

1. Seed a deterministic database, including a fictional sensor helper and a Microsoft-in-Seattle helper; verify both show Demo badges.
2. Warm the deployment once, using a real account. Test private browsing separately to ensure unauthenticated users cannot see members or requests.
3. Test mobile width 375px; check keyboard tab order.
4. Use `MOCK_AI=1` to eliminate reliance on model latency during the live pitch; explain AI is optional and show fallback implementation. If AI functioning stably, choose live critique.
5. If source URLs are outdated, say “last reviewed” and direct to official website; never claim current opening times.
6. Keep a recorded demo video as a fallback, explicitly labeled as such, if competition rules allow. Do not claim a fallback recording is live.
7. Rehearse three-minute flow, ensure `reset-demo` is idempotent and **cannot run in production**.

## Plan Mode / Codex operator instructions

1. Open Codex inside the repository and invoke its available **Plan Mode UI**; exact shortcut/command differs by app version, so use the UI control if `/plan` is unsupported.
2. Paste `prompts/00_PLAN_ONLY.md`, using `@MASTER_SPEC.md @ARCHITECTURE_SECURITY.md @TEST_MATRIX.md` references where supported. Set high reasoning effort if available. **No file edits in this stage.**
3. Review decisions about auth, RLS/RPC, path route rules, demo identities, design and dependencies. Explicitly approve implementation only when it matches the spec.
4. Run modular prompts `01`→`07` sequentially. At each stage ask for changed files, exact test output, risks, and runnable next step. If plan diverges due to repository reality, request a revised plan before edits.
5. Keep P0 tests and a working local preview as release criteria, not just a good-looking screenshot. If using Codex app preview/browser, verify real HTTP requests and persisted DB state.

## Roles for a team of 3 (optional)

- Person A: DB/auth/RLS/RPC and security tests.
- Person B: pure JacketPath/JacketMatch algorithms, curated sources and tests.
- Person C: UI/UX, ReachCard, E2E and pitch. Integrate early on shared JSON schemas; never independently invent conflicting domain names.

## Readiness levels

- **Design ready:** documented package complete; this is the status of the files provided here.
- **Dev ready:** project scaffolded and all local basic builds/tests pass.
- **Demo ready:** two-account path/request flow persists locally, browser/mobile checks pass, demo fixtures labeled.
- **Deployment ready:** build/check/db/e2e pass against isolated deploy configuration; security environment review; actual deployed URL works.
- **Pilot ready:** official resource data reviewed and consenting real accounts, privacy process and university branding reviewed; not achieved by a synthetic hackathon demo.
