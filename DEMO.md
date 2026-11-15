# Three-minute local DEMO DATA rehearsal

## Prepare

Follow README local setup, apply migrations, enable local demo mode, then:

```sh
npm run demo:seed
npm run dev
```

Open `/demo` at 375px mobile width. The seven personas are fictional; every seeded project, discussion, message and outcome is simulated DEMO DATA. No real affiliation, referral or endorsement is asserted. Use the scenario below; do not present a recorded demo outcome as proof that an actual mentoring interaction occurred.

Before each rehearsal, sign in as `student-robotics`, return to `/demo`, and press **Reset isolated DEMO DATA**. Wait for the reset-complete message. The CLI alternative is `npm run demo:reset`. The reset preserves real Auth accounts and refreshes Rowan’s 60-minute availability. The pre-existing accepted/completed examples are deliberate simulated records.

## Click path

**0:00–0:35 — Casey, `student-robotics`.** Open your profile’s project list and **DEMO DATA: vision-guided robotics rover**, or go to `/projects/dddd0000-0000-4000-8000-000000000001`. Choose **Post a blocker or progress update**. Keep the linked project; use Clubs. Title: “DEMO DATA: vision lighting blocker.” Describe the simulated lighting flicker; ask how to compare lighting conditions. Expand optional fields; tags `robotics, computer vision`. Publish.

**0:35–1:00 — Rowan, `alumni-robotics`.** Return to `/demo` and choose Rowan. On Home, show **Students you can help**, the blocker’s stored-data reason and **Available now · self-reported**. Built at Tech is explicitly fictional/self-reported, not graduation evidence. Open the blocker and reply: “DEMO DATA: I can help compare controlled lighting tests.” No request is automatically sent.

**1:00–1:30 — Casey, then Rowan.** Switch to Casey using `/demo`. Open the rover project; show the reply and Relevant mentors. **Get Help** opens a ReachCard with the project context. Choose **Quick Question**, edit the question if needed, review, then explicitly send. Switch to Rowan, open Inbox, locate the new question (there is already a different accepted seeded conversation), and Accept.

**1:30–2:00 — Both personas.** Switch to Casey; open the newly accepted thread. Send a DEMO DATA follow-up. Switch to Rowan; reply in that same thread. Polling persists the exchange; there is no live presence or scheduling. If useful, show an in-app unread update and its deep link.

**2:00–2:40 — Casey.** Switch back, Close the new request, return to Inbox, and Record outcome. Fill “What I learned / helped with / next step” using explicitly simulated DEMO DATA text. Review the text and opt into sharing those log fields. Save. Show the rover’s Progress updates, then `/profile`: Learning Log, private Impact Card (problem/helper/recorded outcome), and private Help Chain SVG. The existing seeded completed outcome also has a card. Raw request notes and helper attribution are not made public.

**2:40–3:00 — Reciprocal learning.** Casey’s Home includes **Alumni want to learn this**: Rowan’s seeded TypeScript Learning Request matches Casey’s Can teach tag. Rowan can post another Learning Request through Circles. End with “learn from campus, learn from each other, pass it forward,” without claims about real employment or mentorship results.

## Fallbacks

- `/demo` is 404: check local app environment and the demo flag, then restart the app. Production demo mode is deliberately forbidden.
- Persona switch fails: rerun `npm run demo:seed`; use the private ignored account file for ordinary `/login` if needed. Do not publish its credentials.
- Available now expired: reset the scenario, or sign in as Rowan, open Profile and choose **Available for 60 minutes**. This does not promise a reply or a meeting.
- New blocker is not visible: check the linked project/profile are shared, keep exact `robotics, computer vision` tags, and reload Rowan’s Home. Use Circles directly if outside the bounded Home selection.
- Inbox appears unchanged: allow a polling cycle or reload. Choose the new question, not the seeded accepted request. Acceptance is required before messaging.
- Outcome is absent from project: complete the request, record nonempty log fields, explicitly share them, and ensure the ReachCard was created through that owned project’s Get Help action.
- Reset refuses: an outside account interacted with these personas. Do not delete their content to force a reset. Rehearse the existing records, or provision a fresh isolated local Supabase project and seed it.
