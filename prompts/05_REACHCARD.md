# Codex Milestone 05 — ReachCard secure requests, inbox and optional learning outcome

**Goal:** make the key human interaction functional: specific private request, verified available recipient, atomic send, recipient accept/decline, sender status tracking.

**Context:** @MASTER_SPEC.md §3C, @ARCHITECTURE_SECURITY.md §4–6, @ALGORITHMS_AND_DATA.md §4–5, @UX_DESIGN.md §5, @TEST_MATRIX.md C/R/O/S/E cases.

**Current → expected:** people discovery → working two-account request flow with persisted states, 15-minute/written/project guidance formats, deterministic request validation, safe count limits, inbox roles and optional private outcome. Small lesson publishing only if P0 and tests are green.

**Tasks:** implement server Zod validation and atomic RPC (server and DB enforce sender, topic, cap, visibility, blocks, pending limit, duplicate, and status transition). Implement request create/GET/PATCH, `Sent` and `Received` inbox, concise ReachCard UI. Include recipient accept/decline and requester cancel; completed only from accepted. Add optional `outcome` and explicit lesson publish/unpublish if time permits. Ensure auth switch proves real persistence.

**Constraints:** No generic private chat or calendar integration. No mandatory resume/GitHub artifact. No AI gate deciding authorization. No direct user-table inserts that bypass caps. Never expose contact details or notes publicly. Recheck exact sender/recipient based on authenticated principal, not JSON.

**Verification:** C01–C08 and R01–R25; O01–O07 if implemented; S13–S25; E05–E09/E17/E18. Specifically demonstrate concurrent requests when one cap slot remains and a direct SQL INSERT denial. Run check, DB tests, E2E, build. Pause for approval.
