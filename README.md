# Ramblin’ Reach

### Turn a shared Georgia Tech connection into a useful next step.

Find the right campus resources, learn from students and alumni who have been there, and put their advice to work.

**Learn from the campus. Learn from each other. Pass it forward.**

[The three-minute demo](DEMO_RUNBOOK.md) · [Run it locally](#run-it-locally) · [Test results](RELEASE_REPORT.md)

## Why we built it

Being a Yellow Jacket should make it easier to find someone who can help you take your next step. In practice, that connection can be hard to make.

You might have an idea for a project but no idea which makerspace to visit. You might be preparing for an internship and want to speak with someone doing that work. Or you might be moving to a new city where you know nobody, even though other Tech alumni already live there.

As members of the Student Alumni Association, we’ve seen this gap firsthand. In our own conversations, students often aren’t using programs such as Mentor Jackets or Georgia Tech Connect, or don’t know where those programs fit into what they need. That experience shaped this project. It is a team observation, not a campus-wide usage study.

Georgia Tech already has alumni networks, mentoring programs, and campus resources worth using. We want that support to be easier to find and act on in everyday student life. A directory can tell you who someone is. A student still needs to understand why that person is relevant, what they are willing to help with, and how to start the conversation.

**Ramblin’ Reach starts with what the student wants to do, then connects the resources, people, and next steps around that goal.**

Chris Klaus captured the importance of early support in his [2025 Georgia Tech commencement announcement](https://news.gatech.edu/news/2025/05/02/tech-visionary-chris-klaus-empowers-georgia-tech-grads-launch-startups): “Every founder needs someone to believe in them early.” We want more students to find someone who can offer that first piece of practical guidance, whether they are starting a company, building a project, or figuring out a career.

## One goal, three connected steps

### 1. JacketPath — figure out where to start

Describe your goal or choose one of six examples: an electronics prototype, a software or AI project, internship preparation, research mentorship, a startup, or a move to a new city.

JacketPath builds a short plan of three to five actions. When a step points to a campus resource, it includes an official link, a review date, and guidance on what to check before using it. Progress is saved, so you can return to the next unfinished step.

For an environmental sensor, that means defining what you want to measure, checking electronics resources at the Hive, exploring fabrication guidance at Invention Studio, and finding someone with relevant project experience. CREATE-X appears when the goal calls for startup or funding guidance, with its application conditions made clear.

### 2. JacketMatch — find someone worth asking

Look for students and alumni by skills, project experience, help topic, company, or city. Each result explains its relevance using information the member chose to share.

Searching for Microsoft **and** Seattle means both must match. If nobody fits, other suggestions appear separately with an explanation of which filter was relaxed.

A helper’s profile shows what they offer, whether they are accepting requests, and any projects or lessons they have shared. Alumni can choose topics, limit incoming requests, pause participation, or hide their profile. Students can offer help too.

### 3. ReachCard — make the conversation specific

Send a short request with your goal, one question, what you have already tried, and a preferred format: written advice, project feedback, or a 15-minute chat.

Optional ReachReady feedback helps make the question clearer while keeping it in your own words. The recipient can accept or decline from their inbox. Both people can track the connection, and an accepted request can be marked complete.

Afterward, record what you learned and what comes next. Outcome notes stay private to the participants. A member can separately write a project lesson for others, review it before sharing, and withdraw it later.

## What this looks like for a student

> “I want to build a low-cost environmental sensor, but I need electronics tools and project advice.”

1. The student gets a saved path with official campus resource links.
2. They find a helper whose shared project involves a temperature logger and sensor calibration.
3. They read that person’s lesson and ask a focused question about testing the sensor before building its enclosure.
4. The helper signs into a separate account and accepts the request.
5. The student sees the response, later records an outcome, and can share a lesson from their own project.

That is the difference we want to make: a student leaves with a next action, an alum has a manageable way to help, and another student can learn from the experience later.

The working demo uses clearly labeled fictional people and projects. Requests and responses use real authentication and database records. A demo completion does not mean an offline conversation took place.

## Why this belongs in lifetime learning

Learning at Tech continues through first jobs, new cities, career changes, and the experience people bring back to the community.

The College of Lifetime Learning’s [Strategy 2035](https://lifetimelearning.gatech.edu/strategy-2035) emphasizes learning throughout life, wider access, and connections among people, industry, and research. Ramblin’ Reach puts that idea into a small, practical loop:

- **As a student,** use campus resources and learn from someone with experience.
- **As an alum,** return with new knowledge and choose how you want to help.
- **Across generations,** keep useful project lessons available so each student does not have to start from scratch.

The current app supports student and alumni accounts, shared project lessons, and private connection outcomes. Keeping the same account through graduation is part of the design; alumni verification still requires review. A graduation year alone never changes someone’s verified status.

## The impact we want to see

A helpful connection might lead to a tested prototype, a clearer research question, better preparation for an interview, or an easier move to a new city. Those are the kinds of outcomes this project is meant to support.

For students, the aim is less time wondering where to begin. For alumni, it is a clear question and a reasonable commitment. For the Tech community, it is practical knowledge that remains useful after its original owner graduates.

We have verified the application workflow, not measured campus-wide impact. A small pilot should ask whether students found relevant help, what action they took afterward, whether the advice was useful, and whether helpers felt their time was respected. Requests sent are a starting point; what happens after the connection matters more.

## Built for trust

- Members sign in through Supabase Auth. New accounts need membership approval before accessing the community.
- Profiles are opt-in. Employer information is self-reported, and working at a company does not promise a referral.
- Request and outcome access is restricted to the people involved. Contact details and private notes do not appear in discovery results.
- Database rules enforce request limits, ownership, and allowed status changes, including simultaneous submissions.
- Resource recommendations come from reviewed records. The app does not invent facilities or claim equipment, funding, or opening hours are currently available.
- The core journey works without an AI service. Routing and matching follow testable rules with visible reasons.

## Under the hood

The app uses **Next.js and TypeScript** for the website, **Tailwind CSS** for styling, and **Supabase Auth and PostgreSQL** for accounts and saved data. Zod validates inputs. Database row-level security and transactional functions protect private records and request quotas.

Vitest covers application rules. Playwright tests actual browser journeys, including separate student and alumni sessions. Accessibility checks use axe. See the [release report](RELEASE_REPORT.md) for the checks that ran and their limits.

## Run it locally

You need Node.js 24, npm, and Docker Desktop for local Supabase.

```bash
npm ci
npx supabase start
```

Copy `.env.example` to `.env.local` and `.env.seed.example` to `.env.seed.local`. Fill in the local Supabase values returned by the CLI.

For the fictional demo, set `APP_ENV=local` and `DEMO_MODE=1` in `.env.local`. Keep seed/admin credentials in `.env.seed.local`, with `ALLOW_DEMO_SEED=1`. Never commit either file or add the service-role key to the application runtime.

```bash
npm run db:seed
npm run dev
```

Open **http://127.0.0.1:3000**. The seed creates 14 fictional accounts with real authentication. Local login details are written to the ignored `.tmp/demo-accounts.json` file. Use `student` for the learner and `A1` for the alumni helper. Confirmation and recovery emails go to local Mailpit at http://127.0.0.1:54324.

The public landing page can run without Supabase credentials. Member features require the configured backend. Local seed tooling refuses production databases.

### Check the app

```bash
npm run check                 # TypeScript, lint, unit tests
npm run test:db               # Local database permissions and concurrency tests
npx playwright install chromium
npm run test:e2e              # Production build and browser journeys
npm run build
```

Stop a running preview before the browser suite so it can start its own production server. Automated request tests use isolated local accounts and hide their profiles afterward, preserving the manual demo accounts’ quotas.

## Current status and next steps

The local application has a working goal-to-outcome journey, student and alumni dashboards, city/company search, request tracking, private outcomes, and editable opt-in project lessons. It has been tested on mobile and desktop. Hosted deployment has not yet been verified.

The next step is a small pilot with consenting students and helpers, feedback on recommendation quality, and broader review of campus resources. Institutional verification and approved university integrations would need separate work.

For setup and demonstration details, see the [demo runbook](DEMO_RUNBOOK.md). For architecture and product decisions, see [ARCHITECTURE_SECURITY.md](ARCHITECTURE_SECURITY.md) and [MASTER_SPEC.md](MASTER_SPEC.md).

---

Ramblin’ Reach is an independent student project and is not affiliated with or endorsed by Georgia Tech. Team members’ participation in the Student Alumni Association does not imply endorsement by the association.
