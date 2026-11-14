# Codex Milestone 02 — Supabase Auth, schema, RLS and safe demo seed

**Goal:** establish durable, secure identity/data foundations that cannot be bypassed by client calls.

**Context:** @ARCHITECTURE_SECURITY.md (authoritative) @MASTER_SPEC.md @TEST_MATRIX.md sections E/F @AGENTS.md approved plan and existing scaffold.

**Current → expected:** app shell without trusted persistent user state → real Supabase Auth login, explicit verification/visibility state, user-owned goals, reviewed resources, opted-in projects, private requests/outcomes, help controls, blocks/reports, migrations, and seed script with **fictional** accounts.

**Tasks:**
1. Create migrations with tables, foreign keys, constraints, indexes, timestamps, updated_at behavior and per-table RLS (including least-privilege grants).
2. Use version-correct `@supabase/ssr` and verified JWT claims/user checks; do not authorize via raw `getSession().user` or client-supplied user IDs. Disable private route caching.
3. Lock verification, affiliation and demo/admin flags from user updates using grants/triggers; test direct SQL denial.
4. Implement transactional RPC for connection request creation and transitions or add stubs only if their authorization logic is fully tested. Revoke direct inserts/status updates and implement caps with concurrency-safe locks.
5. Seed synthetic users through Supabase Auth admin API in isolated local/staging only; make script idempotent and guarded against production execution. No demo password in git.
6. Add docs for auth redirects, cookies, local `supabase start` or hosted isolated project, and schema application.

**Constraints:** No service-role key in browser, Next app route, or ordinary user APIs. Avoid SECURITY DEFINER privilege escalation (`search_path`, explicit auth, narrow EXECUTE). Never expose emails, phones, personal contact or request notes on public APIs. No automatic alumni verification from grad year.

**Verification:** run migration against clean isolated DB; `npm run test:db` with S01–S22 plus R09 and R11 race/direct-write controls; test one authenticated student, one helper and unrelated user. `npm run check`, `npm run build`. Report untested concurrency honestly. Do not advance without approval.
