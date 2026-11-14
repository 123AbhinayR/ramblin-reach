# Start here — copy/paste into Codex

## Setup

1. Extract ZIP inside a *new project folder*. Ensure `AGENTS.md` is at repository root, adjacent to `MASTER_SPEC.md`.
2. Open that folder in Codex. Use its supported **Plan Mode** (may be UI toggle; `/plan` and keyboard shortcuts are version dependent). Select High/Extra High reasoning if your app/account supports it; do not assume it's available.
3. Run the following **read-only** planning prompt. Check the output and explicitly approve the blueprint. Do not ask Codex to build in Plan Mode.
4. Run `prompts/01_SCAFFOLD.md` through `prompts/07_SECURITY_RELEASE_AUDIT.md` **one per turn**. Require exact test evidence after every stage.
5. Provide your own Supabase/OpenAI credentials in `.env.local`; never paste passwords, service-role keys or tokens into the chat, and never commit them.

## Plan Mode prompt — paste this first

```text
You are the lead engineer and product reviewer for Ramblin' Reach, a Georgia Tech-only lifetime-learning hackathon app.

PLAN ONLY. Do not create or modify files, install dependencies, run migrations or access external credentials during this step.

Inspect the entire current repository before proposing edits. Read these exact files:
@AGENTS.md
@MASTER_SPEC.md
@ARCHITECTURE_SECURITY.md
@docs/DOMAIN_API_CONTRACTS.md
@ALGORITHMS_AND_DATA.md
@UX_DESIGN.md
@TEST_MATRIX.md
@SCOPE_AND_DELIVERY.md
@data/seed_sources.json

Product promise: one goal -> 3–5 source-backed JacketPath steps -> truthful opt-in JacketMatch results with company/city filters -> a secure ReachCard request -> distinct recipient accepts -> optional lesson passed forward. Learn from campus, learn from others, pass it forward.

Produce a reviewable blueprint with:
1. Current repository inventory, existing conflicts and missing prerequisites.
2. Proposed stack with versions checked against installed packages; Next.js/TypeScript/Supabase SSR, Tailwind, shadcn/ui, Vitest, Playwright.
3. Files/folders to add or change, SQL/RLS/RPC trust boundaries, request race protections, demo Auth setup, API route contracts.
4. Exact P0 features, out-of-scope features, optional P1 features and hard cut line.
5. Named test IDs from TEST_MATRIX.md mapped to milestones.
6. UX flow and how a 3-minute demo completes with two authenticated accounts at 375px and desktop.
7. Top 8 technical/security/data risks and mitigations; resource freshness, source truth, verification, consent, privilege escalation, monthly caps.
8. An incremental staged plan with completion checks and commands.
9. Only genuinely unresolved blocking questions, if any; make reasonable defaults for non-blocking details.

Do not modify the repo yet. Wait for explicit approval before implementing milestone 01.
```

## After approving the blueprint

```text
The blueprint is approved. Implement only the next stage in @prompts/01_SCAFFOLD.md. Follow @AGENTS.md and all referenced specs. After implementing, report changed files, commands/tests actually run and their outcomes, open issues, and exact next step. Do not start stage 02 until I approve.
```

For each subsequent milestone, replace `01_SCAFFOLD.md` with the next file. Keep stages bounded. If Codex cannot access a `@` reference, paste the relative path and ask it to open and read that file from the repository; never accept a guessed directory layout.

## Expected outcome

A secure, demoable implementation, not just screenshots. The ZIP contains implementation specifications and fixtures, **not completed application code**. Running tests and checking deployed functionality are Codex tasks after implementation.
