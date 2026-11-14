# Codex Milestone 03 — JacketPath goal-to-resource router

**Goal:** turn one student goal into an ordered, source-backed, accessible three-to-five-step pathway without invented campus claims.

**Context:** @MASTER_SPEC.md §3A, @ALGORITHMS_AND_DATA.md §1–2/6, @UX_DESIGN.md §3, @TEST_MATRIX.md P01–P20, @data/seed_sources.json.

**Current → expected:** persistent auth and schema → goal submission with Build / Career / City selectors, deterministic validated parsing and ordered path computation, official-reviewed resource catalog, owned goal/steps persistence and completion toggle. Primary sensor path demo works without AI.

**Tasks:** create pure `parseGoal`, `buildPath` and prerequisite sorter functions; validate resource IDs and source URLs; add catalog seed with last-reviewed dates and unknown availability; implement `POST /api/goals`, `GET /api/goals/[id]`, `PATCH /api/steps/[id]`; render responsive vertical checklist with official link, source date, eligibility note, reason, and persistent checkboxes. Add career/city fallback actions without creating a job aggregator.

**Constraints:** LLM cannot invent steps or resource names; do not fetch arbitrary user URLs or scrape resource pages; do not promise present opening hours, funding, eligibility or machine inventory. Keep current-owned goal progress private. Unknown company/city must remain editable, not hallucinated.

**Verification:** test P01–P20, test one real DB goal persisted across reload, RLS goal-owner tests S07/S08, and mobile E02/E03. `npm run check` and build. Demo case must produce 4 ordered sensor steps with correct official sources. Pause for review.
