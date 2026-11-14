# Ramblin' Reach test matrix and acceptance gate

**Implementation mandate:** Codex must create real executable Vitest, API integration, PostgreSQL/RLS, and Playwright tests from these cases. These are **specified tests, not already passing tests**. Preserve test IDs in test names and the milestone report. Use deterministic fixtures and injected time. There is no credit for a mock-only test that does not exercise its stated invariant.

## A. Test environments

- `npm run typecheck`; `npm run lint`; `npm run test` = Vitest unit + API tests; `npm run test:db` = isolated PostgreSQL/Supabase SQL security tests (document `supabase start` requirement); `npm run test:e2e` = Playwright; `npm run build`; `npm run check` chains typecheck, lint, unit tests.
- Run E2E with `DEMO_MODE=1`, `MOCK_AI=1` and **real staging/local Supabase Auth identities** (no frontend fake auth); resources and fictitious profiles are seeded. Never use a production database in automated tests.
- Create a fixed clock of `2026-11-14T12:00:00Z` for algorithm unit tests and `2026-11-01T00:00:00Z` for monthly-boundary tests. Stable ordering by IDs is required.

## B. Resource routing / catalog (tests/unit/routing.test.ts)

| ID | Input / scenario | Exact acceptance |
|---|---|---|
| P01 | `sensor project with electronic circuit` | `intent=project`, tags include `sensor`,`electronics` |
| P02 | `moving to Seattle` | `intent=relocation`, metro `Seattle, WA` |
| P03 | `network with engineers at Microsoft` | `intent=career`, targetCompany `microsoft` |
| P04 | Manual `intent=relocation` plus goal text mentioning code | Manual intent remains relocation |
| P05 | Empty text, no intent | validation error; no goal created |
| P06 | Unknown target company string | no hallucinated verified employer; user can edit free-text company chip |
| P07 | Project sensor, no business/funding keyword | 4 ordered steps: requirements, Hive, Invention Studio, helper |
| P08 | Sensor + explicit startup funding | 5th optional CREATE-X step with conditional application wording |
| P09 | Career intent | ≤5 steps and no irrelevant maker recommendations |
| P10 | Relocation intent | 3–5 steps, relevant city help and official Regional Networks fallback |
| P11 | Resource marked `needs_review` | cannot be presented as reviewed/current; exclude or clearly mark for confirmation |
| P12 | Source record missing official URL | reject from active catalog |
| P13 | Prerequisite cycle A→B→A | safe fallback route, admin-only diagnostic; no infinite loop |
| P14 | Missing prerequisite for recommended resource | conservative fallback, never silently skip mandatory prerequisite |
| P15 | Same parsed goal/catalog/time twice | deep equal ordered drafts and explanation reasons |
| P16 | Untrusted AI returns invented slug `secretLab` | rejected, only allowlisted catalog IDs used |
| P17 | Source has no current hours | UI says `Check official page`, not `Open now` |
| P18 | Mark checklist step done | changes this user's step only; no claim of externally verified resource visit |
| P19 | Goal text longer than configured maximum or zero-width only | normalized and rejected by server |
| P20 | Resource link is HTTP, javascript:, or private-IP URL | not published as active official link |

## C. JacketMatch eligibility and scoring (tests/unit/matching.test.ts)

Canonical fixtures:
- Student viewer `S1` in `Atlanta, GA`, goal `project:sensor`, interests `electronics,sensor`, has `RoboJackets` tag.
- `A1` verified, visible, active, alum, metro `Seattle, WA`, company `Microsoft`, tags `electronics,sensor`, help `project_guidance,company_insight,relocation_advice`, cap 3 used 1, project `Built temperature logger`.
- `A2` same company `Microsoft`, metro `Austin, TX`, help `company_insight`, cap 2 used 0.
- `A3` company `Delta`, metro `Seattle, WA`, help `relocation_advice`, cap 1 used 0.
- `A4` company `Microsoft`, metro `Seattle, WA`, verified but `visible=false`.
- `A5` company `Microsoft`, metro `Seattle, WA`, visible but `paused=true`.

| ID | Scenario | Acceptance |
|---|---|---|
| M01 | Company `Microsoft`, metro `Seattle, WA` exact | A1 only among available visible profiles; no A2/A3/A4/A5 |
| M02 | Company `Microsoft` alone | A1 and A2 if topics/availability allow |
| M03 | Metro `Seattle, WA` alone | A1 and A3 if topics/availability allow |
| M04 | Company+metro with no exact results | exact `[]`; alternatives under separate labeled section with stated relaxed constraint |
| M05 | `availableOnly=true`, paused member | hidden from eligible results |
| M06 | `availableOnly=true`, used==cap | hidden from eligible results |
| M07 | `availableOnly=false`, paused member | can be listed if visible; no `Ask` action |
| M08 | Invisible profile or unverified member | excluded regardless of score |
| M09 | Viewer searching themselves | excluded |
| M10 | Blocks in either direction | excluded and API gives same generic not-available result |
| M11 | Help topic `project_guidance` | only helpers with that offered topic get an enabled request CTA |
| M12 | Goal/project and A1 | reasons factual from tagged sensor experience/help; no unsupported employer inference |
| M13 | Career matching | experience/help fit dominates shared CS courses, per intent-specific weights |
| M14 | Relocation matching | a Seattle helper offering relocation can outrank out-of-city employer match |
| M15 | Two identical scores, different used/cap | lower load ranks first |
| M16 | Equal score and load | ID ascending tie-break |
| M17 | Max score | integer within [0,100] before UI label; never output as `93% probability` |
| M18 | Inject forbidden fields (gender, race, age) | adding them to an unrelated object does not change score or reasons; schemas strip/reject them |
| M19 | Self-reported Microsoft employment | label as self-reported when appropriate; no referral guarantee |
| M20 | Request quota displayed | cap-used based on committed current-month count; not `Online now` |
| M21 | Different input order | ranking consistent for same members |
| M22 | `metro=null` | no proximity evidence inferred |
| M23 | A member has private project | its private title/tags do not appear in public reasons |

## D. ReachReady and ReachCard field validation (tests/unit/reachcard.test.ts)

| ID | Scenario | Acceptance |
|---|---|---|
| C01 | Goal context 10 chars, question 20 chars | accepted if valid after normalization |
| C02 | Goal context 9 chars, question 19 chars | field errors, cannot send |
| C03 | Goal context 241 chars or question 401 chars | rejected, with field-specific error |
| C04 | Zero-width-only question | rejected as empty after cleanup |
| C05 | `pick your brain` in an otherwise valid message | advisory warning; can still send |
| C06 | `give me a referral` | advisory warning, no false promise |
| C07 | Missing required help topic/format | deterministic hard block |
| C08 | AI times out / key absent | falls back to deterministic coaching; valid request remains sendable |
| C09 | AI returns an entire ready-to-send draft | schema/output filter rejects; no auto-fill |
| C10 | AI attempts to add fake volunteer/company fact | reject unsupported claim from user-visible feedback |
| C11 | Untrusted input says `ignore previous instructions` | model cannot modify permission result or data records |
| C12 | Edited form after earlier feedback | latest deterministic validation on submit decides; stale UI state not trusted |
| C13 | Optional project link `javascript:` or `http://192.168.1.2` | rejected; never server fetched |
| C14 | AI response malformed JSON | strict schema rejects, optional retry, deterministic fallback |
| C15 | Request requires no artifact link | can send, unlike old mandatory-portfolio design |

## E. Requests, transitions and outcomes (tests/unit/requests.test.ts, tests/api/*.test.ts)

| ID | Scenario | Acceptance |
|---|---|---|
| R01 | Verified student requests available helper offering topic | persisted pending request via RPC |
| R02 | Student attempts request to self | rejected |
| R03 | Unverified actor or anon | rejected server-side |
| R04 | Helper paused/at-cap/hidden/blocked | no insertion; generic unavailable where needed |
| R05 | Wrong help topic for recipient | rejected |
| R06 | Duplicate pending pair | one request only; second rejected |
| R07 | Sender has 3 pending outgoing | fourth rejected, including concurrent attempts |
| R08 | Recipient cap 2 used 2 this UTC month | third rejected |
| R09 | Recipient used 1, cap 2, two concurrent inserts | exactly one succeeds |
| R10 | Client forges requester_id or status=accepted | ignored/rejected; `auth.uid()` and RPC choose requester and pending status |
| R11 | Direct table INSERT by authenticated client | denied, even with valid-looking fields |
| R12 | Direct UPDATE status to accepted | denied |
| R13 | Pending→accepted by recipient | allowed |
| R14 | Pending→declined by recipient | allowed |
| R15 | Pending→cancelled by requester | allowed |
| R16 | Accepted→cancelled by requester | allowed |
| R17 | Accepted→completed by participant | allowed |
| R18 | Student tries accept, unrelated member tries complete | rejected |
| R19 | Declined→accepted, Completed→pending | rejected |
| R20 | Two concurrent transitions on same request | one valid outcome only, no double transition |
| R21 | Old request before UTC month boundary | does not consume new month quota |
| R22 | Declined/cancelled requests this month | do not consume monthly cap under chosen semantics |
| R23 | Private request text through `/api/people` | absent |
| R24 | POST/GET/PATCH from third-party account | 403/404 without leaking content |
| R25 | Resubmit same request under client retry | no duplicate pending; UI reconciles existing status |
| O01 | Request pending, user tries outcome | rejected |
| O02 | Completed request, requester writes self-reported outcome | persisted privately |
| O03 | Unrelated user reads outcome | returns no rows / denied |
| O04 | `shareLesson=false` | public UI/API cannot expose note or lesson |
| O05 | User explicitly publishes sanitized lesson | eligible verified members can see only opted-in lesson text |
| O06 | User unpublishes/deletes lesson | removed from discovery immediately |
| O07 | Outcome exists | no claim `verified employment/referral/job` or recipient endorsement |
| O08 | Student→alumni transition (future approved admin operation) | existing request/goal/project IDs and owner access preserved |

## F. Security: SQL/RLS / privilege escalation (supabase/tests/security.sql)

| ID | Scenario | Acceptance |
|---|---|---|
| S01 | anon read member profiles | denied / zero rows |
| S02 | verified member reads visible opted-in profile | allowed; minimal fields only |
| S03 | unverified member reads another profile | denied |
| S04 | student UPDATE own `verification_state` to approved | permission denied |
| S05 | student UPDATE own `affiliation` to alumni | permission denied |
| S06 | student UPDATE own demo/admin flag | permission denied |
| S07 | member reads another member's goals/steps | denied |
| S08 | forged `goal_id` step write | denied |
| S09 | profile with `visible=false` | absent from search/detail read for others |
| S10 | a member reads private portfolio lesson of another | denied |
| S11 | verified member changes reviewed resource URL | permission denied |
| S12 | block in both directions | no request creation or discovery results |
| S13 | request direct SQL status UPDATE | denied |
| S14 | request direct SQL INSERT | denied |
| S15 | RPC called with fake authenticated actor ID in body | ignores body, uses JWT |
| S16 | `SECURITY DEFINER` functions callable by anon? | no (explicit REVOKE/GRANT) |
| S17 | reports table read by another member | denied |
| S18 | public DTO deep key scan | no email, phone, personal address, auth metadata, scheduling links, private notes |
| S19 | service role credential compiled into client bundle | absent |
| S20 | RLS policies bypassed by client path to table with foreign UUID | denied |
| S21 | per-recipient concurrent cap | atomic transaction result, exactly one success when one slot remains |
| S22 | admin approval endpoint called by standard user | denied; no demo blanket-admin bypass |
| S23 | public lessons stored with recipient identity unapproved | reject publication / remove attribution |
| S24 | cross-account HTTP cache reuse | protected response `no-store`, no user data from prior session |
| S25 | mutation without valid session / rejected origin | 401/403, no write |

## G. Full Playwright demo and UI (tests/e2e/*.spec.ts)

| ID | Flow | Acceptance |
|---|---|---|
| E01 | Log in as seeded `student.demo` through Supabase | real authenticated session, not local UI toggle |
| E02 | Type sensor goal and submit | persisted JacketPath with source-backed 4 steps |
| E03 | Complete one step, reload | progress persists for student only |
| E04 | Choose suggested sensor helper | visible `Demo profile`, factual reasons and available help topic |
| E05 | ReachCard vague but valid request | optional ReachReady warnings, still sendable if deterministic fields valid |
| E06 | Submit valid ReachCard | request appears `Pending` in Sent |
| E07 | Switch to distinct seeded helper account, check Received | same request, recipient accepts |
| E08 | Return to student | request marked `Accepted`; user can mark completed |
| E09 | Mark completed and record `Received technical advice` | private self-reported outcome saved; demo label visible |
| E10 | Filter `Microsoft` AND `Seattle` | exact results only, no out-of-city Microsoft alumni shown as exact |
| E11 | Filter no-exact company+city | labeled alternatives, explicit relaxed criteria; no fake match |
| E12 | Simulate AI API unavailable | paths/matching/requests still usable |
| E13 | Simulate unavailable resource review status | noncurrent/unknown label, no `Open now` |
| E14 | Use 375px viewport on main 5 screens | no horizontal overflow and all CTAs usable |
| E15 | Keyboard-only core journey | possible, focus visible, escape/focus restored from modal |
| E16 | axe scan `/dashboard`, `/path`, `/people`, `/requests` | zero serious or critical accessibility violations; document moderate issues |
| E17 | API error on request submission | in-context error + retry, no fake success |
| E18 | Log in as unrelated third account; open request URL | no request content |
| E19 | Hide member profile and refresh people search | member disappears for others |
| E20 | Demo labels everywhere | simulated people/outcomes never appear as live verified real-world data |

## H. Release gates

**P0 hackathon cutline:** P01–P18 (relevant path), M01–M12, C01–C08, R01–R20, S01–S22, E01–E12, E14–E15; build and typechecks. If any of these critical tests fail, do not claim feature complete. Other named tests are production-hardening and should be finished as capacity permits; clearly report omissions.

**Full production-readiness gate:** all tests (including concurrency and RLS), `npm run check`, `npm run test:db`, `npm run test:e2e`, `npm run build`, review of accessibility and manual privacy audit. A spec and a set of green mocks are not a substitute for an isolated real Postgres RLS test.

**Report template:** for each milestone: changed files; tests run with commands; exact passed/failed counts; outstanding risks; manual browser screenshots/notes; next bounded step. Never state tests passed unless executed in that environment.

## Circles extension tests (approved November 14)
CI01–CI04: required fields, forged ownership inputs, safe URLs, deterministic category/shared-skill ordering, comment limits (`tests/unit/circles.test.ts`).
CI05–CI15: authenticated persistence, anonymous denial, owner-only edits/deletes, spoof prevention, one reply level, resolved-write denial, report privacy, blocks, withdrawn visibility, direct-SQL rate limits, cascading deletion (`scripts/test-circles-db.ts`; part of `npm run test:db`).
CI16–CI17: two real authenticated accounts post/reply/resolve with category isolation, reload persistence and foreign HTTP mutation denial (`tests/e2e/circles.spec.ts`).
