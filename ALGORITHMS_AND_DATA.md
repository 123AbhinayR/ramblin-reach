# Algorithms, source-backed data, and deterministic behavior

Applies to `MASTER_SPEC.md` and `ARCHITECTURE_SECURITY.md`. **The AI never invents a member, a campus resource, an access requirement, a source date, or a user's achievement.** This file defines the algorithmic differentiation: goal → audited resource path → opted-in human help → reusable lesson.

## 1. Canonical domain input

```ts
type GoalIntent = 'project' | 'career' | 'relocation';
type GoalTags = 'electronics'|'sensor'|'fabrication'|'entrepreneurship'|'software'|'research'|'career'|'networking'|'relocation';
type HelpTopic = 'project_guidance'|'resource_navigation'|'career_advice'|'company_insight'|'relocation_advice';
type MemberAffiliation = 'student'|'alumni';
type ParsedGoal = {
  intent: GoalIntent;
  tags: GoalTags[];
  targetCompany: string | null; // normalized plain text from approved form input, not identity evidence
  targetMetro: string | null; // canonical metro from maintained list
  confidence: 'manual' | 'deterministic' | 'ai';
};
```

User-selected intent and filters override inferred intent. Deterministic parser finds broad keywords, never infers a specific company/city that is absent from user input or selection. AI is optional for ambiguous intent, can return only an enum and allowlisted tags/targets, with Zod validation. If uncertain, set an intent conservatively and show editable chips; do not submit a fabricated fact.

## 2. JacketPath: routing rather than search results

`buildPath(goal: ParsedGoal, catalog: ReviewedResource[], opts: {asOf: string}): PathDraft` is **pure**; 3–5 steps; stable IDs derived from `intent:canonicalTag:stepKind` (DB generates UUID when saving). Every resource-backed step points to a catalog resource ID; no user or model supplied URLs.

Resource record required fields: `slug`, `title`, `official_url`, `source_domain`, `summary`, `tags`, `eligibility_note`, `prerequisites` (array of strings or resource/action IDs), `availability_claim: 'unknown'`, `reviewed_on`, `review_status: 'reviewed'|'needs_review'`, `student_action`. Do not seed opening-hours text as true current availability. Exclude `needs_review` resources from recommendations or display clearly as needing verification.

Sequence (project goal matching sensors/electronics):
1. `define-requirements` action: specify sensor type, budget, precision, test conditions.
2. `hive-electronics` resource: learn electronics tools and prototype circuit; state that on-site policies may vary and link official page.
3. `invention-studio` resource: explore enclosure/fabrication, verify current access and safety training from official page.
4. `find-project-helper` action: use JacketMatch to find a member who opted into project guidance.
5. `create-x-i2p` optional resource only when entrepreneurship/funding explicitly requested or as collapsed suggestion; not guaranteed funding.

For a goal without entrepreneurship, show exactly 4 default steps. For a software project, select non-hardware actions and curated appropriate resources; **never force every maker goal into the Hive**. For `career`: define target → review official Career Center networking guide → find available Jackets using company/role filters → prepare a ReachCard; for `relocation`: choose destination metro → consult optional official Regional Networks page → search opted-in Jackets in that metro → ask for relocation guidance. Keep 3–5 total.

**Prerequisite-aware routing algorithm:** (a) classify goal to approved tags, (b) take route templates by intent, (c) include resource nodes only if tag/intent relevant and review status appropriate, (d) topologically order selected steps using prerequisite edges, (e) if cycle or missing dependency log an admin error and show a conservative 3-step action-only fallback, (f) persist sequence with source snapshots (`title`, `url`, `reviewed_on`) to preserve accurate past recommendations. Do not use LLM to order arbitrarily.

Checklist completion belongs to the goal owner; clicking a resource link does not count as completed access. `done` is a self-reported action, not verification of using equipment or obtaining funds.

## 3. JacketMatch: eligibility before ranking

`filterCandidates(candidates, viewerId, filters, blockSet, usage, currentUtcMonth)` first **hard filters**: verified member, visibility opt-in, not self, no blocks in either direction, offered requested help topic if one is set, not paused, under monthly cap when `availableOnly=true`; if a company or metro is explicitly specified, exact canonical value must match both independently (`AND`). A verified user with `availableOnly=false` may see visible opted-in people who are not accepting requests, but never get a send button for them.

`scoreMatch(goal, viewer, helper, usage, asOfYear): MatchScore` is pure and returns integer score 0–100 and 2–3 truthful reasons. Use intent-specific maximum contributions (these are **heuristics**, not calibrated percentages):

| Signal | Project | Career | Relocation |
|---|---:|---:|---:|
| Help topic fit | 25 | 25 | 30 |
| Relevant skills / project experience | 40 | 15 | 10 |
| Target employer / role fit | 5 | 35 | 5 |
| Target metro and lived experience | 5 | 5 | 35 |
| Shared GT context (major/org/course) | 15 | 10 | 10 |
| Remaining capacity / lower load | 10 | 10 | 10 |
| **Total** | **100** | **100** | **100** |

Implementation details:
- Help fit is full points when topic is explicitly offered; if topic not specified, award half when helper has ≥1 help topic. Requested topic mismatches are ineligible, not merely low-score, for help requests.
- Skills/project fit: exact intersection of canonical tags, cap at max; max if at least two matching tags or one explicitly matching project type; partial if one of multiple relevant tags. Resource experience matches a resource cited in the pathway, not an unverifiable claim.
- Employer fit: full points only if normalized employer is exactly the target; role experience can receive partial points only if goal explicitly includes that role. Never present same employer as evidence of referral authority.
- Metro: full when helper's opted-in `metro` equals target metro; partial for `currentMetro` only when target metro is not set; never fake physical proximity and never use precise coordinates.
- GT context: overlap major/student org/course tags supplied by members; each truthful source contributes; a profile with no shared background may still rank highly for expertise.
- Capacity: `Math.round(max * (cap-used)/cap)` for valid cap≥1, 0 for capped member; unused slots are monthly incoming request quota, **not confirmed calendar openings**.
- Use stable canonical strings and a fixed order for reasons: help topic, project tags, employer, metro, shared GT context, capacity. Never mention a source that wasn't in stored public/opted-in attributes. No protected attributes, graduation-year age proxy, gender, race, religion, disability, immigration or socioeconomic indicators.
- Rank by score descending; tie by lower `used/cap`; tie by helper ID ascending. Never show the raw score as a calibrated probability. Display `Strong fit`, `Good fit`, or `Relevant experience` with factual why explanations.

**Alternatives / no dead ends:** For an exact company+metro query with zero or unavailable exact results, return `{exact:[],alternatives:[]}` with `explanation`. Relax one constraint per alternative panel, never in the exact panel. Examples: `Similar project experience outside Seattle` or `Seattle Jackets in adjacent roles`. UI explicitly shows which constraint was relaxed. If nothing relevant, show the official GT Regional Networks URL or actionable re-filter options. Never use unconsenting people in alternatives.

## 4. ReachCard deterministic rules

Required: `helpTopic` enum offered by the recipient, `format` enum, `goalContext` trimmed 10–240 characters, `specificQuestion` trimmed 20–400 characters. `priorEffort` optional 0–300 chars. Reject blank disguised with zero-width / control characters, overlong, self-send, duplicate pending, disallowed sender state, and illegal transition. `https://` project link (optional) must be separately validated without fetching it. Generic phrases such as `pick your brain`, `any advice`, or `give me a referral` produce an advisory warning; they do **not** prohibit a valid request. The user can dismiss coaching and send once deterministic requirements pass. Captures original user words, not AI-written replacements.

AI coaching request includes only the applicant's opted-in request fields and helper's public summary (never email, ID, blocked status, raw private projects). Zod shape `{questions: string[] /*max 3, max 180 each*/, issues: string[] /*max 3*/, source:'ai'|'heuristic'}`; reject generated drafts that start with `Hi`, `Dear`, `Hello`, `I'm`, `I am`, or impersonate the student. Fallback deterministic reminders after timeout/error. No model score can change send permission.

## 5. Knowledge carry-forward: the smallest useful memory

An opt-in `member_project` includes: title, 1–4 tags, 1–3 used resources by catalog ID, a 30–240 character `lesson`, and optional vetted HTTPS link. Member can edit, unpublish, or delete. It remains attached to account ID, not a graduation year. Public lessons do not imply endorsement by a resource, org, or helper. A private request outcome can generate a user-owned suggested lesson **only after explicit review and publish action**, never automatically. Prevent storing a third party's name/contact details in a public lesson through instruction, moderation/report affordance, and conservative visibility; regex alone is insufficient.

## 6. Official source seed strategy

The `data/seed_sources.json` is **source candidates**, not live records. For every resource the seed script must validate official URL and `reviewed_on` before enabling its recommendation; allow `needs_review` gracefully. Suggested official resources:
- The Hive electronics and PCB: https://hive.ece.gatech.edu/explore/
- Invention Studio: https://inventionstudio.gatech.edu/
- CREATE-X Idea to Prototype: https://create-x.gatech.edu/make/idea-to-prototype
- Career Center networking: https://career.gatech.edu/networking/
- Alumni Regional Networks: https://www.gtalumni.org/regional-networks/default.html
- Georgia Tech Student Foundation funding rules: https://www.gtalumni.org/student-programs/georgia-tech-student-foundation/apply-for-funding-from-the-georgia-tech-student-foundation.html

Show official links with `last reviewed` and uncertainty label. Never embed names, phone numbers, or email addresses scraped from these pages. Do not assert live opening hours, current funding cycle, machine availability, or any affiliation approval.

## 7. Demo fixture requirements

- Seed ≥12 visually distinct fictional GT members: student helpers and alumni in Atlanta, Seattle, New York, San Francisco Bay Area; company mix includes Microsoft, Stripe, Delta, and a fictitious startup. Every one visibly carries **Demo profile** badge. Include one Microsoft alumnus in Seattle, one Microsoft alum outside Seattle, one Seattle alum not at Microsoft, one expert in sensor prototyping, one paused/capped member, and one profile hidden by owner choice.
- Seed ≥2 distinct demo auth identities plus an unrelated third user. Put credentials only in local/staging env and print instructions to the operator, never embed real passwords in the repository.
- Demo goal `Build a low-cost environmental sensor`, second goal `Find engineering advice at Microsoft in Seattle` and third `Moving to Seattle`. Show true intersection and alternative panel.
- Seed fake outcome content only with `Simulated demo outcome` banner; no fake completed connections represented as real-life interactions.
