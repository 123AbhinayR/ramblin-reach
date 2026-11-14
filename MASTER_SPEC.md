# Ramblin' Reach — Final Product Specification

Version: 3.0, November 14, 2026. Product: Georgia Tech only. Build status: **specification, not implemented**.

## 0. The one-sentence promise
**Ramblin' Reach turns a student's goal into a source-backed next-step plan and a connection to a consenting Jacket who can help, so learning is passed forward long after graduation.**

**Sponsor-aligned tagline:** *Learn from the campus. Learn from each other. Pass it forward.*

**Pitch:** Georgia Tech already has makerspaces, entrepreneurship programs, student expertise, alumni networks, and professional connections. The hard part for a student is understanding how to navigate them *together* for one goal. Ramblin' Reach builds a short plan, surfaces suitable volunteer helpers, and lets students make focused requests. Small opt-in portfolios preserve what worked so the next student can learn from it. This complements, rather than replaces, GT Connect and existing campus resources.

## 1. Lifetime learning thesis
The College of Lifetime Learning's Strategy 2035 explicitly embraces learning across a lifespan, community networks, data-informed learner-first systems, and ongoing adaptation. Ramblin' Reach demonstrates that through **three phases of the same learning journey**:
1. **Learn by doing (JacketPath):** Understand the campus resources, prerequisites, and sensible next steps needed to execute a goal.
2. **Learn from others (JacketMatch):** Find opt-in peer/alumni experience relevant to the goal, or to an unfamiliar company or city.
3. **Learn and give back (ReachCard + small project lesson):** Ask a clear question, complete a conversation, record an optional next step and an opt-in lesson. That lesson may remain visible as the contributor transitions from student to alum.

Lifetime learning is *not* an extra dashboard. It is the story connecting these three interactions. Keep the main interface centered on **one goal**.

## 2. Users and core jobs-to-be-done
**Current student:** "I want to prototype an environmental sensor. What steps, tools, and people can help?" Also: "I'm moving to Seattle; who can share practical relocation advice?" "Who at Microsoft can tell me about their engineering experience?"
**Opt-in student helper:** "I built a similar project and can answer one question this month."
**Opt-in alumni helper:** "I can share company insights, help with relocation, or review a project without getting unlimited cold messages."
**Graduating student, future stage:** "Keep my project knowledge and connections, have my alumni status reviewed, and choose whether to give back."

## 3. Three features, one workflow
### 3A. JacketPath: goal-to-resource sequence
- Entry prompt with three selectable intents: **Build a project**, **Explore a career/company**, **Move to a city**. Provide sample text and manual selections; users are never required to use AI.
- Route contains **3–5 actionable steps**, chosen from a small official-resource catalog plus clear user action steps. For each: concise title, why this matters, official URL when resource-backed, eligibility or prerequisite caveats, last-reviewed date, action checklist, and state `not_started / done`.
- AI may classify the typed goal to `GoalIntent` but cannot invent resources or change evidence. Deterministic routing produces the same correct result with `MOCK_AI=1` or when AI is unavailable.
- For the primary hackathon goal (sensor build): (1) clarify sensor requirements; (2) use the Hive for circuit prototyping; (3) explore fabrication support at Invention Studio; (4) find a project-experienced volunteer; (5) optional CREATE-X I2P application path, explicitly **not guaranteed**.
- For career/company: identify target role and company, then browse JacketMatch; optional official GT Career Center networking resources, not a full job aggregator.
- For moving to city: select metro, browse JacketMatch, view official GT Alumni Regional Networks fallback, and request relocation advice. Never present city-level member counts beyond consented participant counts.
- No live machine reservations, working-hours predictions, geocoding, arbitrary URL crawling, or automated grants applications.

### 3B. JacketMatch: opt-in people matching with city and company filters
- Discover students and alumni. Filter by **city/metro, current company, skills, majors/GT experiences, help topic, affiliation**, and `Available to help` toggle. Filters are simple chips and reflected in shareable URL query parameters with no private data.
- Support a company search (e.g., Microsoft) and a city search (e.g., Seattle) independently **or together**. When both filters are selected, intersection is explicit and truthful. An alum at Microsoft in another city is NOT shown as though in Seattle.
- Every result shows display name, `Student` or `Alum` label, self-reported role/employer, city, topics offered, available request capacity, a demo badge as applicable, and **top two or three match reasons**. Do not show speculative "97.8% compatible" claims.
- A compact **Project Memory** mini-portfolio sits inside each opted-in profile: project name, skills, resources used, one practical lesson, optional safe link. This preserves experience beyond a one-off connection and allows students to evaluate whom to ask. It is **not** a campus-wide wiki or a separate product.
- When no exact company/city match is available, label a second section `Other Jackets who may help`: similar experience or same help category, *not* employees at the requested company. When city has a verified official alumni network URL, show it as an external resource without scraping named members.
- Alumni volunteer availability matters more than raw profile count. Users can opt in/out, select help topics, cap incoming requests per UTC calendar month (1–10), and pause requests. On-card "Available" depends on actual DB cap and state, not fabricated real-time presence.
- Never scrape LinkedIn, GT Connect, GT directory, or personal contact lists. No directory populated from unconsenting people. Membership verification and employment verification are separate; employer is self-reported unless explicitly validated.

### 3C. ReachCard: high-quality, low-friction human help
- Student selects an available member and help topic, then creates one structured request with: `What I'm trying to achieve`, `My specific question`, optional `What I've already tried / safe project link`, and estimated format (`15-minute chat`, `written response`, `project feedback`).
- ReachReady is **optional coaching inside the same card**, not a fourth product: deterministic rules flag missing questions, vague requests, overly long messages; optional AI gives two or three questions/pointers to improve clarity. AI **never writes a ready-to-send message** or fabricates a biography, experience, or proof.
- Hard blocks only for invalid/missing essential fields, direct spam/rate limits, restricted content, block status, authentication, and recipient capacity. A model-based subjective rating never decides whether the member can send an otherwise valid request.
- Sending triggers a **server-side** atomic capacity check. Recipient sees concise goal, ask, help topic and what to expect; may **Accept** or **Decline**. Requester can **Cancel**. Either participant may mark an accepted request **Completed**. No free-form private chat or scheduling integration needed.
- After completion, student can record a private outcome such as `Learned how to use a resource`, `Received technical advice`, `Understood a role/company`, `Received relocation advice`, `Next step planned`; freeform notes (private only) and opt-in one-sentence lesson. No automatic claims of jobs, referrals, meetings or outcomes.
- Private request text and outcome visible only to participants. Public lesson needs explicit opt-in and must be editable/deletable. Do not publicly attach the recipient's identity or say they endorse the lesson without consent.

## 4. What to ship for the hackathon
**Non-negotiable P0**: sign-in (including genuine separate student and helper demo accounts); small verified resource catalog; goal classifier + deterministic 3–5-step path; people search with company/city filters; explainable match; volunteer help settings; ReachCard request create + accept/decline; security (RLS, rate/cap, private outcomes); mobile-first UI; tests; deployed demo or explicit deployment instructions.

**P1 only after P0 passes**: AI critique or AI natural language parsing (can be disabled without breaking core), portfolio lesson entry, optional completed-outcome entry, official regional networks fallback, one additional goal archetype polished.

**Do not implement**: real-time maker hours/equipment inventory, live job feeds, employer careers scraping, Google Maps, third-party OAuth for calendar, private messaging, global social graph, warm introductions/referrals, grant applications, study abroad planning, automated admin verification, organization document ingestion, image-based organizational memory, multi-university support, native iOS/Android.

## 5. Exact required screens
1. `/` **Landing**: one headline, brief three-step explanation, two sample goals, sign-in, optional `Try demo` in staging. Avoid generic admin dashboard aesthetics.
2. `/onboarding` **Identity and consent**: student/alumni selection, current metro, optional employer/skills, available help topics, project mini-portfolio optional, explicit visibility consent. Students can also opt in as helpers.
3. `/dashboard` **Goal home**: prominent goal entry, choose Build / Career / City, recent paths and incoming/outgoing request summary. Single clear CTA `Build my path`.
4. `/path/[id]` **JacketPath**: goal header, ordered 3–5 checklist steps, sources and requirements, one `People who can help` panel showing top matching volunteers; request CTA.
5. `/people` **JacketMatch**: company / city / help-topic search, toggles for student/alumni, results cards, why explanations, clearly labeled alternatives; profiles link to `/people/[id]`.
6. `/people/[id]` **Helper profile**: relevant skills/projects/lessons, help availability; action opens ReachCard panel.
7. `/requests` **Inbox**: Sent/Received, statuses; Accept/Decline/Cancel/Complete; private outcome entry when completed.
8. `/profile` **Your profile**: edit self-reported details, company/city, help topics, cap/pause, portfolio and lesson visibility, optional `Request alumni verification` for future stage.

No dashboard more than one navigation depth away from the request flow. On mobile use bottom nav with `Home`, `People`, `Requests`, `Profile`; `Path` is reached from home. Desktop uses horizontal nav or minimal sidebar.

## 6. Primary working demo (the only required 3-minute journey)
**Persona:** Fictional Georgia Tech student Taylor (clearly labeled Demo), building an environmental sensor.
1. Type goal. JacketPath returns source-backed Hive and Invention Studio steps, with CREATE-X I2P as a clearly optional application path.
2. Click a recommended opt-in demo member Jordan, whose opt-in mini portfolio says `Built a temperature logger; learned to test sensor calibration early`. Show reason `Has embedded-systems project experience; offers 15-minute project advice`.
3. Open ReachCard. Show the request brief, optional ReachReady feedback for a vague first draft, improve and send.
4. Switch to separate demo helper login and accept; return to student and record `Received technical advice` as a **simulated demo outcome**.
5. Quickly demonstrate JacketMatch company=`Microsoft`, metro=`Seattle` and the honest no-result alternative state if exact intersection is empty, then close with student-to-alumni knowledge continuity as future architecture.

Do not fake live availability, real completed chats, or real alumni verification. No requirement to showcase every page in the 3-minute demo.

## 7. Secondary use cases covered without adding extra systems
**Relocation:** User picks `Move to a city`, enters `Seattle, WA`; path links official Regional Networks page and suggests opt-in city-based helpers. Filters still work if there are zero results.
**Company:** User searches `Microsoft`; results identify consenting members who self-report that employer. If target company and target city are set, both filters are exact. It is acceptable to show `No exact volunteers yet` and relevant alternatives.
**Lifelong knowledge:** Student keeps the same user ID, goal history, lesson and requests upon verified conversion to alumni. Alumni status stays `pending` until verified through admin review or an authorized integration. No automated conversion solely from graduation date.

## 8. Acceptance criteria and red lines
- Primary end-to-end demo persists in DB across browser sessions and uses two real authenticated seeded accounts, not static screenshot transitions.
- Company and city both filter correctly and show truthful empty/alternative states.
- All recommendations show an explanation sourced from stored tags/roles/skills, never invented assertions.
- Every resource-backed step has official source URL, label for eligibility/unknown constraints, `last_reviewed_at`. Never claim current opening hours or live equipment availability.
- Authenticated members can only see verified and opted-in profiles. Unverified accounts cannot browse contact data; contact data never appears in public APIs, profiles or logs.
- Service role keys never go to client. RLS on all user-content tables. DB RPC enforces cap, blocks, repeat requests and role permissions under concurrency.
- `is_demo` profiles and demo outcomes are conspicuously labeled. No demo mode bypass in production.
- No horizontally scrolling screen at 375 px; semantic labels, focus states, keyboard operability, WCAG axe smoke checks; loading, empty, and error states.
- `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`, DB security tests and core Playwright E2E all pass or failures accurately reported.
- Public footer accurately states independent-student-project status. No GT marks beyond ordinary nominative text.

## 9. Metrics for a pilot (no invented results)
Track opt-in counts, relevant-match feedback, path-step completion (self reported), request acceptance rate, accepted-to-completed rate (self reported), time to first response, helper request burden, opt-in knowledge lesson reuse. Explain denominator and data provenance. Start with 3–5 opt-in helpers and 5–10 students, not a claim to serve the full alumni network on day one.

## 10. Why this is different, but not unprecedented
- Existing GT Connect already supports opt-in alumni networking including location and mentor matching. Harvard HBS OCP and Stanford directory/mentoring already support modern alumni discovery and career paths.
- PeopleGrove, the GT platform vendor, advertises AI question routing and goal tracking as product capabilities. Do **not** say nobody has ever connected students to people via AI.
- The credible novelty here is **source-backed, prerequisite-aware campus steps in the same flow as opt-in expertise, request readiness, and reusable micro-lessons**, intentionally designed for a particular Georgia Tech goal. This is a differentiated product integration, not a patented first-ever algorithm.

## 11. Official references to inform curated catalog and pitch
- College of Lifetime Learning 2035: https://lifetimelearning.gatech.edu/strategy-2035
- GT commitment to a lifetime education: https://provost.gatech.edu/cne/commitment
- GT Career Center networking / GT Connect: https://career.gatech.edu/networking/
- GT Regional Networks: https://www.gtalumni.org/regional-networks/default.html
- The Hive official: https://hive.ece.gatech.edu/explore/
- Invention Studio official: https://inventionstudio.gatech.edu/
- Yang Aero Maker Space: https://ams.gatech.edu/
- CREATE-X I2P: https://create-x.gatech.edu/make/idea-to-prototype
- GTSF funding guidelines: https://www.gtalumni.org/student-programs/georgia-tech-student-foundation/apply-for-funding-from-the-georgia-tech-student-foundation.html
- Stanford Alumni Directory: https://alumni.stanford.edu/help/directory/
- Harvard Business School OCP: https://www.alumni.hbs.edu/career-resources/tools-resources/ocp
- PeopleGrove Engagement Hub: https://www.peoplegrove.com/products/engagement-hub/

All public facts must be checked against their source at seed preparation. If content is no longer current, retain link and mark `Needs review`, not current. No source grants license to scrape or republish private contact information.
