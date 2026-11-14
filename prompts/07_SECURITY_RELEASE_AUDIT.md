# Codex Milestone 07 — Independent final security and demo audit

**Goal:** challenge the completed implementation, find privacy/auth/accuracy issues, and produce honest release evidence. Do not add features.

**Context:** @MASTER_SPEC.md @ARCHITECTURE_SECURITY.md @TEST_MATRIX.md @UX_DESIGN.md @SCOPE_AND_DELIVERY.md and the complete implementation.

**Current → expected:** apparently working hackathon app → audited implementation with changed-file/fix report, traceable test coverage, reviewed deploy config, and a 3-minute demo runbook.

**Tasks:**
1. Check config/secret hygiene and production vs staging flags, code scanning for leaked credentials, demo bypasses, `getSession` authorization, raw user IDs, service key and cross-user caches.
2. Inspect every RLS policy, privilege/grant, RPC search path and concurrent cap. Try direct table insert/status edits and guessed foreign UUIDs.
3. Inspect exposed DTOs, indexed/public profile pages, private lessons, blocked member states, unknown resource statuses, self-reported employer labels, fake job/referral claims.
4. Verify exact company AND metro logic and alternative-section labels; verify reproducible routing and match reasons.
5. Run real test commands and full browser flow, 375px and keyboard/axe checks; report observed failures and fix only necessary issues.
6. Check official source URLs and review dates; remove stale claims, do not invent replacements.
7. Produce `RELEASE_REPORT.md` with exact commands, outcomes, limitations and a sponsor-aligned three-minute demo checklist.

**Constraints:** No additional features, no unapproved branding, no external scraping, no false success claims. A missing real Supabase test or absent deployed endpoint is a documented blocker, not a pass.

**Acceptance:** Critical P0 tests green, no high/critical vulnerability, no private member leak, two-authenticated-account demo persists, intro + sensor route + jacket + ReachCard + acceptance + optional lesson fits 3 minutes. Any exception must be named and justified in release report.
