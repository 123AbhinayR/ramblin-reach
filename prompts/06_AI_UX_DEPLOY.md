# Codex Milestone 06 — Optional AI, usability polish and reliable demo deployment

**Goal:** polish the three-part flow and add nonessential AI coaching only when all critical backend tests pass.

**Context:** @UX_DESIGN.md, @ALGORITHMS_AND_DATA.md §1/4, @TEST_MATRIX.md, @SCOPE_AND_DELIVERY.md, @LIFETIME_LEARNING_PITCH.md.

**Current → expected:** complete deterministic goal/request app → optional schema-constrained goal parsing and ReachReady coaching, graceful `MOCK_AI` fallback, polished loading/errors/empty states, 375px accessible screens, deploy docs and testable staging demo.

**Tasks:** use OpenAI SDK behind server route only, strict Zod response, configurable model name, 6-second timeout and deterministic fallback; return up to three coaching questions, never ghostwritten draft. Per-user rate limit stored in DB or suitable shared store, not process memory. Add mobile/desktop refinements, focus/keyboard/axe tests, deployment README, environment/docs, and reproducible demo seed/reset guarded against prod. Audit all API DTOs for private fields. Keep source data reviewed dates and warnings visible.

**Constraints:** No live hallucinated resource data, Google keys required, maps, AI-produced member facts, hidden demo bypass or full messaging. Do not broaden feature set. Never claim live availability or endorsement.

**Verification:** C08–C15, E12–E20, P16/P17, S18–S25. Run `npm run check`, `npm run test:db`, `npm run test:e2e`, `npm run build`; if deployment possible verify actual live route/auth and protected API behavior. Report actual pass/fail and URLs, not invented success.
