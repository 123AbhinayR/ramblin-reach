# Codex Milestone 00 — Plan only, no writes

**Goal:** inspect repository, challenge assumptions, and propose a safe, minimal blueprint before any code changes.

**Context:** @AGENTS.md @MASTER_SPEC.md @ARCHITECTURE_SECURITY.md @ALGORITHMS_AND_DATA.md @UX_DESIGN.md @TEST_MATRIX.md @SCOPE_AND_DELIVERY.md @data/seed_sources.json. Inspect existing package.json and source tree first, if present.

**Current:** repository may be empty or contain partial attempts; no verified implementation status can be presumed.

**Expected:** a reviewable `IMPLEMENTATION_PLAN` presented in chat with architecture diagram, changed-file plan, data schema/RLS trust boundaries, resource catalog, matching and routing algorithms, CI/test mapping, risk register, milestones, and P0/P1 cut line. No files modified during planning.

**Constraints / anti-goals:** **no write commands, installs, migrations, generated files, builds, or credential access**. Single GT product; only JacketPath/JacketMatch/ReachCard; no live job API, map, scraping, chat, referrals, organization integrations or multi-university architecture. Plan the lifetime-learning sponsor story, not a fourth feature.

**Verification:** show inventory and explicit read confirmation for every cited spec; call out conflicts and choices. Map test IDs to stages. List tests that would require real Supabase/PostgreSQL rather than implying mocks prove security. Pause for explicit user approval.
