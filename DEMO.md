# Three-minute seeded-data walkthrough

All people, projects, conversations and outcomes in this walkthrough are **seeded sample data**, not real members or real mentorship results. Names are invented and employers are industry descriptors. In demo mode the UI shows one small **Demo environment** pill in the footer; there are no per-item fixture badges. Internal `is_demo` flags remain for filtering and reset. No referrals, endorsements, testimonials or measured impact are claimed.

## Start / reset

With local environment files configured and demo mode enabled:

```sh
npx supabase start
npx supabase migration up --local
npm run demo:seed
npm run dev
```

Open `/demo` and choose **Mira Talven**. To start over, return there and press **Reset workspace**, waiting for the completion message. CLI alternative: `npm run demo:reset`. Reset preserves Auth accounts and unrelated records, and refuses outside interactions. Names/content/IDs are stable; activity timestamps and Arin's availability refresh relative to reset time. Real Supabase sign-in and normal RLS apply.

Accounts: Mira Talven (robotics student), Evan Corren (design/startups student), Noor Bellamy (math/quant student), Arin Velden (robotics/perception alumnus), Lena Quillan (product design alumnus), Owen Kestrel (quant research alumnus), Tessa Marlowe (software engineering alumnus). Private login credentials remain in the ignored local account file, never in these docs or browser payloads.

## Click path

**0:00–0:35 -- Mira, mobile.** Open **Vision-guided robotics rover** from Profile, or `/projects/dddd0000-0000-4000-8000-000000000001`. Choose **Post a blocker or progress update**. Keep the linked project and Clubs. Describe the Pi/USB-camera lane detection flickering at the lab door, mention the lens cleaning/threshold attempt and ask what to hold fixed. Add `robotics, computer vision` tags. Publish.

**0:35–1:00 -- Arin.** Switch via `/demo`. Home shows **Students you can help**, a reason drawn from stored tags/Built at Tech, and the expiring Available now badge. Open the new blocker and offer to help compare controlled lighting tests. The other seeded discussions have varied replies, recent/older timestamps and a resolved packaging question; these are authored seed activity, not live-user statistics.

**1:00–1:30 -- Mira, then Arin.** Switch back to Mira. The project shows the reply. **Get Help** opens QuickReach with project context. Choose **Quick Question**, edit, review, explicitly send. Switch to Arin, open Inbox, locate the new question and Accept. A separate accepted lighting conversation is already seeded; choose the new request.

**1:30–2:00 -- Both.** Mira sends a follow-up in the newly accepted thread; Arin replies. Polling preserves the messages. The preloaded lighting and logging conversations each contain a short back-and-forth; unread markers come from saved read cursors and notifications, not fabricated online presence.

**2:00–2:40 -- Mira.** Close the new request. Record what changed and the next step in the existing outcome form, and explicitly share the reviewed Learning Log fields if desired. Show project progress, then Profile's Learning Log, private Impact Card and Help Chain. These derive only from the recorded request/outcome rows. The existing completed logging conversation has a modest outcome about saving camera settings beside clips and repeating the low-light run; no numbers or testimonials are generated.

**2:40–3:00 -- Reciprocal learning.** Mira's Home shows **Alumni want to learn this**: Arin's TypeScript narrowing request matches Mira's Can teach tag. End with the campus-resource / people / thoughtful-request workflow, without representing seeded interactions as real-world results.

## Fallback

- `/demo` is 404: check local environment/demo flag and restart. Disabled mode still returns actual HTTP 404 for the page and API.
- Switch fails: rerun `npm run demo:seed`; ordinary login can use the private ignored credential file.
- Availability expired: reset, or sign in as Arin and enable it for 60 minutes in Profile. It is willingness to accept a request, not guaranteed response time.
- Missing suggestion: keep exact tags, shared project/profile consent and available capacity; reload, or open the discussion directly from Circles.
- Missing messages: wait for polling or reload; acceptance unlocks the thread.
- Missing project update: complete the project-linked ReachCard, record nonempty log fields and explicitly choose sharing.
- Reset refuses: preserve the outside account's contribution. Rehearse existing records or use a fresh isolated local Supabase instance rather than deleting unrelated data.
