# Domain & API contracts — canonical source of truth for enums and payloads

This file resolves naming ambiguity. Codex should implement Zod schemas in `src/lib/domain/schemas.ts`, infer TypeScript types, and share them between client/server. If installed libraries require variants, document the adapter; don't create a second divergent enum.

## Canonical enums

```ts
export const INTENTS = ['project','career','relocation'] as const;
export const AFFILIATIONS = ['student','alumni'] as const;
export const VERIFICATION_STATES = ['pending','verified','demo'] as const;
export const HELP_TOPICS = ['project_guidance','resource_navigation','career_advice','company_insight','relocation_advice'] as const;
export const FORMATS = ['chat_15min','written_advice','project_feedback'] as const;
export const REQUEST_STATUSES = ['pending','accepted','declined','cancelled','completed'] as const;
export const OUTCOME_TYPES = ['resource_accessed','technical_advice','company_insight','relocation_advice','next_step_planned','other'] as const;
export const STEP_STATUSES = ['not_started','done'] as const;
export const REVIEW_STATUSES = ['reviewed','needs_review'] as const;
```

Correspondence: `intent:'project'` shown as “Build a project”; `career` as “Career or company”; `relocation` as “Move to a city”. UI labels never flow back as SQL enum strings.

## Inputs and responses

Use `{error:{code,message,fields?}}` on all failures. HTTP 401 unauthenticated, 403 unverified/forbidden, 404 private/missing for guessed IDs, 409 conflict/cap/state, 422 validation, 429 rate limit. Do not leak hidden or blocked membership via distinguishable error messages. All typed responses use DTO allowlists.

### Goal create

`POST /api/goals`

```json
{"goalText":"I want to build a low-cost environmental sensor","intent":"project","targetCompany":null,"targetMetro":null}
```

- `goalText`: after normalization 10–500 chars.
- `intent`: allowed enum, optional in API if parser provides; explicit manual choice wins.
- `targetCompany`: optional 0–100 char normalized string; no implied verified employment.
- `targetMetro`: optional value from maintained city options; otherwise null or manual selection pending validation.
- Return 201 `{goal:{id,goalText,intent,...},pathSteps:[{id,ordinal,kind,title,description,reason,resource:{slug,title,officialUrl,eligibilityNote,reviewedOn,availabilityClaim}?}]}`.
- Owner ID from authenticated session; never trust `ownerId` field in request.

`PATCH /api/steps/:id` `{status:'done'}` requires ownership. Response minimal `{id,status,completedAt}`.

### People listing

`GET /api/people?company=Microsoft&metro=Seattle%2C%20WA&availableOnly=true&limit=15` returns:

```json
{
  "items":[{"id":"demo-uuid","displayName":"Jordan Mercer","affiliation":"alumni","isDemo":true,"company":"Microsoft","companyVerification":"self_reported","metro":"Seattle, WA","helpTopics":["company_insight"],"available":true,"remainingMonthlyRequests":2,"reasons":["Offers insight about Microsoft","Based in Seattle"]}],
  "alternatives":[],
  "nextCursor":null
}
```

The example `id` is descriptive, not an actual UUID. In app a valid UUID is required. `limit` defaults 15, maximum 30; cursor validated opaque or keyset cursor, not an unsanitized SQL expression. Filter values canonicalized. Query explicitly applies **AND** across given company+metro. `alternatives` are separately labeled, include `relaxedCriteria`, and never count as exact. `available` must be derived from DB cap/paused state, never hardcoded per fixture when results are live.

### ReachReady

`POST /api/reachready` `{recipientId,goalContext,specificQuestion,priorEffort?}` returns `{errors:[{code,field,message}],warnings:[...],questions:string[],source:'ai'|'heuristic'|'deterministic'}`. No model score or permission flag. Optional; server request creation always performs deterministic validation again.

### ReachCard create

`POST /api/requests`

```json
{
  "recipientId":"<uuid>",
  "goalId":"<owned-goal-uuid>",
  "helpTopic":"project_guidance",
  "format":"chat_15min",
  "goalContext":"I am prototyping a low-cost air quality sensor.",
  "specificQuestion":"Could you explain how you tested your circuit before mounting the enclosure?",
  "priorEffort":"I tested a breadboard circuit and gathered sensor samples."
}
```

- Server ignores any supplied `requesterId`, `status`, `capacity`, `verification`, or AI approval claim. Consider strict reject-unknown-key schema rather than silently ignoring malicious extras; either way, no privilege effect.
- Normalize fields before both UI/server validation and DB insert; `goalContext` 10–240, `specificQuestion` 20–400, `priorEffort` 0–300.
- Use `create_connection_request` transactional RPC with `auth.uid()`, sender/recipient locks and monthly cap. Return 201 `{request:{id,recipientId,goalId,status:'pending',createdAt}}`.
- `GET /api/requests?box=sent|received` yields participant-only summary. `PATCH /api/requests/:id` `{action:'accept'|'decline'|'cancel'|'complete'}` calls state-machine RPC.
- `requestId` must never be interpreted as authorization by itself.

### Outcome

`POST /api/outcomes` after completed request only; private default:

```json
{"requestId":"<uuid>","outcomeType":"technical_advice","privateNote":"I learned to calibrate with reference measurements.","shareLesson":false}
```

A future/polish `POST /api/projects/:id/publish-lesson` requires explicit owner confirmation and sanitized lesson text, separate from private outcome visibility. Do not expose private notes to directory users simply because a public lesson exists. `shareLesson=true` can trigger a pending confirmation UI, not automatic publication.

## Membership / authorization model

- `verification_state='pending'`: can view/update own account and onboarding only; cannot discover community or send requests.
- `verification_state='verified'`: admin-reviewed identity; can discover only opt-in verified/demo members allowed for that deployment.
- `verification_state='demo'`: fictional seeded account **only** in local/staging; never production. Allowed to exercise normal user flows via actual auth session in staging. Never a guest-auth bypass.
- `affiliation='student'` / `alumni` is descriptive membership label, not an authority to read someone else's private requests. Students who opt in may be helpers.
- Employer is always `self_reported` unless a later approved verification exists; do not implement verification pretenses.
- Graduation transition is future admin-approved update on the **same** auth/profile ID. No automatic conversion from gradYear.

## Status transitions (single source)

| From | Action | Actor | To |
|---|---|---|---|
| pending | accept | recipient | accepted |
| pending | decline | recipient | declined |
| pending | cancel | requester | cancelled |
| accepted | cancel | requester | cancelled |
| accepted | complete | requester **or** recipient | completed |

All other combinations forbidden in pure function AND SQL. Concurrency uses row locks. A `completed` status indicates user action, not independent confirmation of an offline meeting. Demo outcomes remain labeled simulated.

## Approved Circles extension
`POST /api/circles` accepts category (`hackathons/startups/projects/research/clubs/careers`), kind (`help/building/teammates/feedback/update/learning`), title (3–100), description (10–2000), specific_request (10–400), tags (up to 8 of 1–40), nullable public HTTPS project_url/github_url, nullable team_size (1–100). Identity comes from the session/database default; an opted-in visible profile is required.
`POST /api/circles/[id]` accepts exactly one action: edit with validated post, resolve with boolean, delete, comment with body (2–1000) and nullable parent_id, or report with reason (10–500). Edit/resolve/delete require ownership. Replies require an open visible discussion; parent replies cannot be nested again. All content is plain text. Reports are private moderation records. DB triggers enforce five writes/minute per table, including direct inserts. All tables have RLS; no anonymous browsing. Matching sorts at most 60 recent posts using exact shared profile tags and stable time/ID ties.

## Accepted-ReachCard threads (Phase 3)
No separate conversation entity: `connection_requests.id` is the thread ID. `request_messages` stores session-derived sender, plain text (1–2000 normalized characters), retry UUID, server timestamp and ordered identity. `request_reads` stores each participant's monotonic last-read message ID. Declined/pending requests never unlock messaging; existing `complete` closes an accepted request and leaves history read-only. Existing `cancel` also locks messaging. Recipient visibility withdrawal, ineligible membership and blocks revoke message access; pausing new requests does not revoke an already accepted conversation.
- `GET /api/requests` returns the latest 50 participant requests, safe peer names, private outcomes and unread request IDs. SQL computes unread IDs under message/read RLS without transferring message history.
- `GET /api/requests/[id]/messages?after=<nonnegative safe integer>` returns up to 100 messages in identity order and request status; the client catches up by polling every 3 seconds.
- `POST` on that route accepts exactly `{body,key}`. Sender is `auth.uid()` in the transactional RPC. The request row lock serializes send/close, retries return the same row, changed retry payloads fail, and a per-sender database counter permits ten new messages per minute.
- `PUT` accepts exactly `{lastId}`. The ID must belong to this thread; the cursor only advances and member ID comes from the session. Read updates occur only when the document is visible.
Inbox summaries poll every 5 seconds; no websockets or third-party actions. Static QuickReach templates are editable starting points with explicit review and send, never AI-generated biographies or auto-sends. All eight reasons use the existing offered help-topic enums; choosing a reason does not claim the recipient offers that service.
