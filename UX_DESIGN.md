# UX and visual system — elegant, trustworthy, and usable

Product quality target: as intuitive as excellent modern mentoring/career platforms, but with fewer screens. Build **one goal-centric workflow**. Treat the main task as `Write goal → See path → Find helper → Send request`, not an admin dashboard. Avoid Georgia Tech logos/mascot/seal and false institutional endorsement; text-only name `Ramblin' Reach`.

## 1. Information architecture

Primary nav (desktop): `Home`, `My Paths`, `Find Jackets`, `Requests`, avatar. Mobile: compact bottom tabs or accessible drawer with same navigation, no hidden primary CTA. Only three branded features in marketing: JacketPath, JacketMatch, ReachCard. No separate feature tab for knowledge, AI, portfolio, connections analytics, etc.

### Screens
| Route | Core content and action | Exit |
|---|---|---|
| `/` | Hero, plain-language purpose, three-step illustration, sign in | Dashboard |
| `/onboarding` | Affiliation and consent, optional member skills/company/metro/help topics, verify state | Dashboard |
| `/dashboard` | One large goal field, 3 preset intents (Build project / Career or company / Move city), 2 quick examples and recent goals | `Build my path` |
| `/path/[id]` | 3–5 step vertical checklist with official resource evidence and a sidebar/mobile section `People who can help` | Profile/ReachCard |
| `/people` | Search and filters: city, company, help topic, project skills, student/alumni, available only; result cards + alternatives | Profile |
| `/people/[id]` | Member intro, tags, opt-in project lesson, availability and types of help, factual match reasons; `Ask for help` opens ReachCard | Request |
| `/requests` | `Sent`/`Received`, status, role-appropriate accept/decline/cancel/complete actions, outcome capture | Back to path |
| `/profile` | Own consent, profile, member project mini-portfolio, helper cap/pause, hide profile; verification state clearly described | Dashboard |

Do not implement an additional chat, complex scheduling, interactive map or marketplace. Each screen must have at least one genuinely functional primary action and loading/empty/error/success states.

## 2. Design system

Tokens (proposed independent student design, not official branding): navy `#0D2746`, muted gold `#B69D57`, ink `#182235`, light `#F7F8FA`, white `#FFFFFF`, success `#177D5D`, error `#B42318`, neutral border `#DCE2E8`. Gold used as accent only, not as small low-contrast body text on white. Use CSS custom properties and shadcn/ui tokens; design should work in light mode first, dark mode optional after core.

Typography: Inter or a broadly available system sans, bold hero 36–44px desktop / 30px mobile, section 24, body 15–16, legible line height 1.45+. Spacious max-width 1160px. Avoid giant sidebar, tiny dashboard widgets, seven-card carousels, irrelevant graphs and visual-only affordances. Card radii 14–18px, 1px subdued borders, subtle hover. Keep interactive targets ≥44px touch size and 8px spacing rhythm.

Important states: `Verified member` is **not the same as employment verified**. `Demo profile` always visible. `Open to requests` means cap available and not paused, not currently online. `Source reviewed Nov 14, 2026` isn't proof of live opening hours. For unknown access say `Check official page before visiting`.

## 3. Path page example

Header: `Your plan: Build an environmental sensor` with `Goal details` chips `Electronics`, `Prototype` and `Edit goal`.

Vertical steps with simple numbered circles, connectors and completion checkboxes:
1. `Define what you'll measure` · write sensor type/budget, no external link.
2. `Prototype your circuit at the Hive` · why relevant, `Official resource`, `Eligibility: check space guidance`, `Reviewed: 14 Nov 2026`.
3. `Explore an enclosure at Invention Studio` · why relevant, verified link, no live hours claim.
4. `Ask a Jacket who has built a sensor` · matched opt-in helper cards, CTA `Ask for project guidance`.

The 3–5 steps are the central visual. Optional `View relationships` may draw simple lines between steps and people, but **do not implement a draggable network graph** for MVP. The vertical path is faster and more accessible for mobile and demo.

## 4. JacketMatch person card

Display fictional demo member name; clear `Student / Alum` and `Demo` chip; self-reported employer `Microsoft` and metro `Seattle, WA` only if stored; up to three tags; `Offers project guidance`, `2 of 3 requests left this month` (derived from DB); two reasons `Built a sensor prototype` / `Has worked with the Hive` / `Offers 15-minute project help` if true. No ranking percent, contact email, LinkedIn scraper claims or unsupported internship guarantees. CTA `View profile`. For blocked/full/paused helper show no request CTA.

Filters: exact company AND exact metro, each independently clearable. If empty, show `No Jackets currently available at Microsoft in Seattle` followed by a clearly labeled `Other Jackets who may help` panel that explains the relaxed filters; never place wrong-company members in exact-results list.

## 5. ReachCard modal or dedicated responsive panel

Fields in order: topic, format, `What I'm trying to achieve` (max 240 chars), `My specific question` (max 400 chars), optional `What I've tried / safe project link`. Small deterministic inline feedback as user types, `Improve this request` optional AI feedback button, `Send request` enabled only if deterministic checks pass. On mobile use full-height sheet or route with correct focus management. Never auto-replace student's words. Alumni inbox shows the ask concisely without requiring any messaging.

Optional consent checkbox for lesson publication shown only after **completed** request; off by default. The default outcome and note remain private. Never claim a conversation happened when a demo operator clicks `complete`; label demo action `Simulate outcome` in staging.

## 6. Accessibility / quality bar

- Responsive 375, 768, 1024, 1440 px; no horizontal scrolling; readable filters become horizontal scroll or stacked select with keyboard access.
- WCAG 2.2 AA intent. Keyboard-only complete journey; visible focus outline; skip-to-content link; semantic headings; labels; status not color alone; `aria-live` for errors, loading updates and submission state; focus to first invalid field after rejected form.
- Empty states always offer a recovery action; error states have retry and nontechnical description. Skeletons preserve layout height. Test slow network and rejected writes.
- Never show fake buttons or mock-only actions as actual functionalities. `Try demo` can exist only in staging, not as a production guest login bypass.
- No required image generation, company logos, stolen avatars, or private photos. Use initials-based avatars and vector icons. Prefer practical visual clarity to decorative graphics.

## 7. Copy principles

- Use short CTAs `Build my path`, `Find a Jacket`, `Ask for help`, `Accept`, `Decline`, `Complete`.
- Explicit uncertainty: `Information last reviewed...`, `Employer self-reported`, `Availability means accepting requests, not online now`.
- Sponsor story subtly present in header/about: `Learn from the campus. Learn from each other. Pass it forward.` Do not imply sponsorship means product endorsement by Georgia Tech itself.
- Public footer: `Ramblin' Reach is an independent student project and is not affiliated with or endorsed by Georgia Tech.`
