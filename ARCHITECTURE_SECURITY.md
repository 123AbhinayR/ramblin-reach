# Engineering, Data & Security Contract

## 1. Tech stack: deliberately boring foundations
- **Next.js App Router**, React, TypeScript `strict: true`, Tailwind CSS, shadcn/ui, lucide-react. Single responsive web application.
- **Supabase Postgres + Supabase Auth + Row-Level Security (RLS)**. Use `@supabase/ssr` with cookie-based server sessions, middleware/proxy appropriate to installed Next.js version. No separate Express service.
- **Zod** for all route inputs, DB boundaries, environment and LLM responses. **OpenAI SDK** is optional for intent parsing and ReachReady coaching, model from `OPENAI_MODEL`; `MOCK_AI=1` avoids network.
- **Vitest** for pure logic and route tests; **Playwright** for a small E2E workflow; **axe-core/playwright** for critical accessibility checks; SQL RLS integration checks using a disposable local Supabase instance.
- Deploy to **Vercel + Supabase**. No Google Cloud account or Antigravity dependencies. Do not integrate Google APIs unless later justified.

Required package scripts: `dev`, `build`, `start`, `typecheck`, `lint`, `test`, `test:db`, `test:e2e`, `db:seed`, `check` (`typecheck && lint && test`). Scripts must actually execute, not be stubs. Use ESLint CLI consistent with the installed Next.js version (not obsolete `next lint` if unsupported).

## 2. Environment
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=           # seed/admin scripts ONLY; NEVER browser
OPENAI_API_KEY=                      # optional when MOCK_AI=1
OPENAI_MODEL=                        # optional when MOCK_AI=1
MOCK_AI=1
DEMO_MODE=0                          # local/staging only when explicitly enabled; never auth bypass
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Validate environment per feature: app starts without an OpenAI key in mock/fallback mode, and fails with a helpful error when a configured required credential is missing. `DEMO_MODE=1` is explicitly disallowed in production builds unless there is an intentional non-public staging deployment and test users still authenticate. Never log any credentials.

## 3. Data model (minimum entities, explicit invariants)
Use `uuid` PKs, timestamps in UTC, generated IDs on server, indexes, FKs. Generate migration(s) in `supabase/migrations/` and type mappings used by the app. The fields below are the **contract**, not a demand for a specific ORM.

### `profiles`
`id uuid PK references auth.users(id)`, `display_name varchar(80)`, `affiliation enum(student,alumni)`, `verification_state enum(pending,verified,demo)`, `verification_method enum(email_control,manual,approved_integration,demo)`, `verified_at timestamptz nullable`, `is_demo bool`, `visible bool default false`, `major text nullable`, `grad_year int nullable`, `company_name text nullable`, `metro text nullable`, `role_title text nullable`, `skills text[] default '{}'`, `gt_topics text[] default '{}'`, `help_topics text[] default '{}'`, `monthly_cap int check 1..10 default 2`, `paused bool default true`, `bio varchar(400) nullable`, `created_at`, `updated_at`.

Never store email/phone/home address in profiles. Only Supabase Auth holds login email. `verification_state='verified'` must only be set by authorized admin flow; `verification_state='demo'` only by seed tooling. `@gatech.edu` email ownership verifies an address, not graduation. Employer information is self-reported; do not label it verified.

### `member_projects`
`id uuid`, `owner_id uuid FK profiles`, `title varchar(100)`, `summary varchar(350)`, `skills text[]`, `resource_tags text[]`, `one_lesson varchar(300) nullable`, `safe_project_url https URL nullable`, `visibility enum(private,members) default private`, `is_demo bool`, timestamps. Limit to 3 public projects per profile in UI. User can edit/delete; org-owned knowledge is out of scope.

### `resources` (admin-curated, never user-edited in MVP)
`id uuid`, `slug unique`, `title`, `kind enum(makerspace,program,funding,community,career,regional)`, `short_description`, `official_url https`, `official_domain`, `tags text[]`, `eligible_audience text`, `eligibility_caveat text`, `prerequisite_tags text[]`, `last_reviewed_at date`, `source_status enum(reviewed,needs_review)`, `claimed_live_availability bool default false` (always false in MVP), `active bool`, `display_priority int`. Only official domains from allowlist or reviewed institutional program domains. No operator-only emails scraped from pages.

### `goals`
`id uuid`, `owner_id uuid FK profiles`, `intent enum(project,career,relocation)`, `goal_text varchar(500)`, `target_company text nullable`, `target_metro text nullable`, `extracted_tags text[]`, `created_at`. No private credentials or sensitive personal data in goal text; include short notice to users not to paste confidential information.

### `path_steps`
`id uuid`, `goal_id uuid FK goals`, `ordinal int 1..5`, `kind enum(action,resource,find_person)`, `resource_id uuid FK resources nullable`, `title`, `description`, `reason`, `status enum(not_started,done)`, `completed_at`, `created_at`. Unique `(goal_id, ordinal)` and resource steps must have resource_id. Step ordering is computed by deterministic code and persisted once. No live hours claim.

### `connection_requests`
`id uuid`, `requester_id uuid FK profiles`, `recipient_id uuid FK profiles`, `goal_id uuid nullable FK goals`, `help_topic enum(project_guidance,resource_navigation,career_advice,company_insight,relocation_advice)`, `format enum(chat_15min,written_advice,project_feedback)`, `goal_context varchar(240)`, `specific_question varchar(400)`, `prior_effort varchar(300) nullable`, `status enum(pending,accepted,declined,cancelled,completed)`, `created_at`, `responded_at`, `completed_at`. No public contact data. A sender must be a verified student or eligible alumni learner; a recipient must have opted in and offered the selected topic.

### `outcomes`
`id uuid`, `request_id uuid UNIQUE FK connection_requests`, `reported_by uuid FK profiles`, `outcome_type enum(resource_accessed,technical_advice,company_insight,relocation_advice,next_step_planned,other)`, `private_note varchar(300) nullable`, `share_lesson bool default false`, `public_lesson varchar(240) nullable`, `created_at`. Only request participants can read underlying report. Public lesson is either attached to the reporter's opted-in member project or independently displayed without naming the recipient unless separately consented. Opt-in sharing must be revocable.

### `blocks` and `reports`
`blocks(blocker_id, blocked_id, created_at)` composite PK, `reports(id, reporter_id, target_id, request_id nullable, reason, created_at)`. Reports private to reporter and authorized admins; no public read policy for all members. Blocked relationships may not be used for discovery or sending requests in either direction.

**Graduation continuity:** Never delete/recreate user ID. Preserve goals, projects, and requests under same profile ID. Future manual alumni approval flips `affiliation`/verification method after authorized review. Date alone cannot trigger it. If status pending, retain private data and restrict alumni-visible privileges.

## 4. RLS and grants: MUST be tested at SQL level
- Enable RLS on **all** above tables, with explicit policies and `FORCE ROW LEVEL SECURITY` where warranted for relevant app roles. User sessions are always authenticated; unverified users get only self-profile/onboarding access.
- `profiles SELECT`: self or verified+visible+not-blocked profiles to authenticated verified users. `is_demo` may appear only on staging/demo deployments. Blocked counterpart must be hidden in search and details (avoid leaking block state; return generic `MEMBER_UNAVAILABLE`).
- `profiles UPDATE`: own allowed fields only; **column-level grants or a trigger prevent self-changing** `verification_state`, `verification_method`, `verified_at`, and `is_demo`. RLS `WITH CHECK id = auth.uid()` alone is NOT enough to prevent role escalation. Reject direct updates to `affiliation` without admin review.
- `resources SELECT`: authenticated verified users plus optionally public landing page read. `INSERT/UPDATE/DELETE` admin scripts only, no user write grants.
- `goals` / `path_steps`: owner-only select/insert/update/delete. Verify the referenced goal is owned by the caller for step write; no ability to forge another user's `owner_id` or `goal_id`.
- `member_projects`: self read/edit; authenticated verified community members read opted-in `visibility='members'` projects of visible, verified, unblocked owners. Private projects never leak through ranked results or API.
- `connection_requests`: requester/recipient read only. **REVOKE direct INSERT and UPDATE from authenticated**; force all creation and state transition through vetted RPCs or trusted server with equivalent transactional DB safeguards. Never trust client-provided status, capacity, helper membership, or advice score.
- `outcomes`: participants read; only a party with a completed request may insert; writes constrained by participant identity. Public `share_lesson` never grants raw request access.
- `blocks`: own records, prevent self-block; both directions respected in query/RPC. `reports`: reporter insert/read own only, admin moderation access through separate secure workflow.
- All `SECURITY DEFINER` functions have restricted `search_path`, qualified table references, no dynamic SQL, execute grants only to authenticated, and explicit `auth.uid()` checks. Verify they are not callable with unexpected arguments to bypass controls.
- **Privacy firewall:** public DTOs omit `email`, `phone`, raw request notes, private project URLs, private notes, current coordinates and unapproved lessons. RLS is defense-in-depth, DTO allowlists are also required.

## 5. Atomic request RPCs
Create `create_connection_request(p_recipient_id, p_goal_id, p_help_topic, p_format, p_goal_context, p_specific_question, p_prior_effort)`:
1. `uid = auth.uid()`, verified member requirement, validate lengths and enums on server and DB, `requester != recipient`.
2. Acquire transaction-scoped advisory lock keyed by `recipient_id` **and** a lock keyed by `requester_id` to make per-person caps concurrency safe. Use consistent lock order to avoid deadlocks.
3. Recipient must be verified+visible+not paused+offer the topic+under cap; check no block in either direction.
4. No duplicate pending pair. Requester may have at most **3** pending outgoing requests. Recipient's cap counts requests created in the current **UTC month** in states `pending`, `accepted`, or `completed` (do not count declined or cancelled). This cap is specifically an *incoming request volume* cap, not calendar availability.
5. Insert `pending`, derive fields from authenticated caller; do NOT accept caller-supplied sender_id/status. Return minimal allowed fields.
6. Return generic not-available error for blocked/paused/hidden or unknown recipient where possible, avoiding block-status inference.
7. Insert audit metadata server side; avoid logging request text.

Create `transition_connection_request(p_request_id,p_action)`:
- `pending + accept/decline` only recipient; `pending + cancel` only requester; `accepted + cancel` requester; `accepted + complete` either participant; all other transitions invalid.
- Row lock `FOR UPDATE` prevents race-based double acceptance. Return status and timestamps. No client direct status edits.

**Important:** If Codex changes RPC implementation, it must show race test and direct-SQL bypass test before shipping.

## 6. API contracts (versioned only by routes; Zod schemas)
Error shape: `{error:{code:string,message:string}}` with stable user-friendly codes; avoid leaking whether blocked.

| Method and route | Query / body | Response | Authorization |
|---|---|---|---|
| `POST /api/goals` | `{goalText,intent?,targetCompany?,targetMetro?}` | `{goal,pathSteps}` | verified member; goal owner |
| `GET /api/goals/[id]` | none | path with reviewed resource evidence | goal owner |
| `PATCH /api/steps/[id]` | `{status:'not_started'|'done'}` | updated step | goal owner |
| `GET /api/resources` | optional `tag` | reviewed catalog, official links only | verified member |
| `GET /api/people` | `company,metro,topic,skills,affiliation,availableOnly,cursor,limit<=30` | `{items,nextCursor,alternatives?}` | verified member |
| `GET /api/people/[id]` | none | safe member profile + public projects | verified member, visible + unblocked |
| `POST /api/reachready` | `{recipientId,goalContext,specificQuestion,priorEffort}` | `{errors,warnings,questions,source}` | verified member, rate limit |
| `POST /api/requests` | controlled ReachCard fields | `{request}` | verified, atomic RPC |
| `GET /api/requests` | `box=sent|received` | participant-only items | verified member |
| `PATCH /api/requests/[id]` | `{action}` | updated status | participant via RPC |
| `POST /api/outcomes` | `{requestId,outcomeType,privateNote?,shareLesson?,publicLesson?}` | `{outcome}` | completed request participant |
| `PUT /api/profile` | allowed profile fields only | `{profile}` | self only |
| `POST /api/blocks` | `{targetId}` | minimal success | verified member |
| `POST /api/reports` | `{targetId,reason,requestId?}` | minimal success | verified member |

Authentication session check on **every** protected route, including loaders and server actions. Test 401 for unauthenticated and 403 for unverified accounts. Input pagination is bounded. No GET route performs data mutation.

## 7. AI architecture
`src/lib/intent/parse.ts`: deterministic keyword parser first. Optionally call LLM for ambiguous natural-language goals. The LLM returns **only** Zod-validated `{intent, tags[], targetCompany?, targetMetro?}`. Use enums/allowlists and reject unknown data rather than writing it into resources. The server builds path from curated data; never send arbitrary user secrets to LLM.

`src/lib/coaching/reachready.ts`: deterministic validation for minimum specific question (20..400 characters), goal context (10..240), allowed topic and no excessive repetition. If `MOCK_AI=0`, an optional short AI critique returns up to 3 coaching questions. Critique may never rewrite the message, create facts, or decide user access. Explicit prompt-injection-resistant instruction boundary, strict Zod result, 6s timeout and one retry max, fallback to deterministic feedback. API per-user rate limit (5/minute) with store appropriate to deployment (DB, not per-instance in-memory).

No embeddings, vector DB, direct external web crawls, or model-based ranking in hackathon MVP. No photo upload needed.

## 8. Structure to implement
```
app/
  page.tsx  onboarding/page.tsx  dashboard/page.tsx
  path/[id]/page.tsx  people/page.tsx  people/[id]/page.tsx
  requests/page.tsx  profile/page.tsx
  api/goals/... api/people/... api/requests/... api/reachready/...
components/
  ui/ GoalComposer PathChecklist ResourceEvidenceCard PersonCard
  MemberFilters ReachCardComposer RequestInbox ProjectMemoryCard
lib/
  domain/schemas.ts env.ts auth/guards.ts
  resources/catalog.ts intent/parse.ts routing/build-path.ts
  matching/score.ts matching/filter.ts matching/reasons.ts
  coaching/validate.ts coaching/critique.ts
  requests/transitions.ts supabase/server.ts supabase/browser.ts
supabase/migrations/0001_base.sql
supabase/tests/security.sql
scripts/seed.ts
scripts/sources-check.ts
data/seed_sources.json
fixtures/demo_people.json
fixtures/demo_goals.json
tests/unit/ tests/api/ tests/e2e/
```
Where exact Next.js paths differ by version, preserve behavior and explain changes.

## 9. Operational security and demo guarantees
- Seed synthetic users using Supabase Auth admin API in a script. No fake local login state. Seed a *student*, an *alumni helper*, an *unavailable helper*, an *unverified user* and an *unrelated third party*.
- Demo credentials must be stored in local/staging-only environment or setup output; do not commit passwords. `Try demo` available only in an isolated staging domain, with clear label and rate limits; production users need normal sign-in.
- Do not scrape existing alumni. Never imply official access to Tech data. University-specific entity text is nominative use only.
- Cap AI spend with request rate limits; everything works with `MOCK_AI=1`.
- Screen and logs must avoid leaking private request notes. Error logs use only sanitized request IDs and codes.
- A source URL must be `https:` and approved domain or explicitly admin reviewed; no arbitrary URL fetches (SSRF). User-provided project URLs are stored but not fetched or auto-previewed; validate scheme, hostname and dangerous encodings.
- Apply input validation, output escaping, CSRF protections appropriate to cookie-authenticated writes, anti-spam caps and same-origin policy. Rely on server-side authentication rather than user-supplied ID headers.


## 10. Canonical application contracts

Read `docs/DOMAIN_API_CONTRACTS.md` for exact enum names and wire payloads. Use `project/career/relocation` for goal intents everywhere; the human labels “Build a project”, “Career or company”, and “Move to a city” are UI only. Use Supabase’s current publishable key naming from `.env.example` rather than mixing it with a legacy anon-key variable. Demo membership state is allowed only on isolated staging with authenticated demo users.
