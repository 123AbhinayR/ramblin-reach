# Source ledger, novelty boundaries and ethical data acquisition

Reviewed November 14, 2026. These are public official pages and standards, **not permission to republish private people records**. Re-verify specific operational details at implementation time. Latest URLs/hours/terms can change.

## Lifetime learning and campus resources
- Georgia Tech College of Lifetime Learning Strategy 2035: https://lifetimelearning.gatech.edu/strategy-2035. Directly supports lifelong access, learner-first systems and communities connecting people/industry/research. Use for sponsor alignment, not institutional endorsement.
- The Hive: https://hive.ece.gatech.edu/explore/. Describes electronics benches, PCB fabrication and makerspace resources. Operational hours may change; don't claim live occupancy/access.
- Invention Studio: https://inventionstudio.gatech.edu/. Describes a student-run makerspace for GT community. The visible site has summer-specific hours: never label those as current in fall.
- Yang Aero Maker Space: https://ams.gatech.edu/. Describes prototyping tools and student help; verify access by equipment.
- CREATE-X I2P: https://create-x.gatech.edu/make/idea-to-prototype. Application and conditional support, not guaranteed funding or acceptance.
- GTSF: https://www.gtalumni.org/student-programs/georgia-tech-student-foundation/apply-for-funding-from-the-georgia-tech-student-foundation.html. Primarily reimbursement/allocations under eligibility; Fall 2026 application is closed on the current page. Do not promise funds for an individual project.
- GT Career Center networking: https://career.gatech.edu/networking/. Official networking advice and alumni discovery recommendations.
- Alumni Regional Networks: https://www.gtalumni.org/regional-networks/default.html. Official city communities and events; do not copy contact names/emails from page.

## Competitive context
- Georgia Tech Connect/Mentor Jackets (see GT Alumni and Career Center pages): existing opt-in alumni networking and mentoring. Do not claim we invented company/city alumni discovery.
- Harvard Business School Opportunities & Connections Platform: https://www.alumni.hbs.edu/career-resources/tools-resources/ocp. Existing intelligent alumni/job discovery.
- Stanford Alumni Directory and mentorship: https://alumni.stanford.edu/help/directory/ . Existing verified networking and mentor discovery.
- PeopleGrove Engagement Hub: https://www.peoplegrove.com/products/engagement-hub/. Vendor advertises advanced engagement, routing and mentoring; not proof which options are enabled at Georgia Tech.

**Legitimate novelty statement:** a focused campus-goal pathway linking **official-source, prerequisite-aware actions** to **opt-in students/alumni**, followed by **bounded connection requests** and **voluntary project lessons**. This is a product integration/differentiated UX, not a claim no other service can do any part of it.

## Secure engineering references
- Supabase SSR: https://supabase.com/docs/guides/auth/server-side/creating-a-client . Verify JWT with `getClaims()` or current `getUser()` as appropriate; do not authorize with unvalidated `getSession().user` object. Avoid cross-user SSR caches.
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security . RLS and grants both matter; service keys bypass policies.
- OWASP API1 broken object-level authorization: https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/ . Test guessed foreign UUIDs in every API/RPC path.
- WCAG 2.2: https://www.w3.org/TR/WCAG22/ . Aim for keyboard/labels/focus/contrast and run axe smoke tests.

## Ethical data approach
- Demo uses fictional names and constructed profiles; a label remains on every card and outcome.
- Real pilot uses volunteered data from consenting members, permission to publish project summaries, and verified membership review. Self-reported employer never treated as independently verified.
- No scraping LinkedIn, GT Connect, personal websites, club private folders, emails, admissions or registrar data. No secret GT APIs.
- Privacy and security are prerequisites for credibility: no email/phone on the directory; no exact location; opt-out at any time, block/report, cap and pause; private request/outcome default.
