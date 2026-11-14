# Codex Milestone 04 — JacketMatch people search, mini profiles and city/company filters

**Goal:** help students find only consenting, relevant, available members with truthful explanations and exact city + employer filtering.

**Context:** @MASTER_SPEC.md §3B, @ALGORITHMS_AND_DATA.md §3/5/7, @UX_DESIGN.md §4, @ARCHITECTURE_SECURITY.md, @TEST_MATRIX.md M01–M23.

**Current → expected:** path exists but no people discovery → protected people index, filtered results, result cards, member details, available help topics, cap/pause, and compact opted-in project lesson. Company and metro filters work both alone and as `AND`; filters encoded in safe shareable URL (no private names or content).

**Tasks:** write pure `filterCandidates`, `scoreMatch`, `rankMatches`, `buildReasons`, `findAlternatives` with injected clock/currentMonth. Query only visible verified nonblocked members and authorized project fields. Implement `/people`, `/people/[id]`, `GET /api/people`, `GET /api/people/[id]`, profile settings. Use sample fictional members including Microsoft/Seattle direct, Microsoft/elsewhere, Seattle/elsewhere company, sensor experience, paused and hidden. Show truthful availability. Add helpful empty/alternative results without mislabeled direct matches.

**Constraints:** Do not scrape LinkedIn/GT Connect or infer protected attributes. Never output contact information, precise location, secret projects, exact employer verification, referral authority or floating compatibility probability. Availability = monthly request cap, not live calendar time.

**Verification:** M01–M23, S02–S12, E04/E10/E11/E19. Test exact Microsoft AND Seattle intersection and alternative labeling at 375px. `npm run check` and build; report tests. Pause for review.
