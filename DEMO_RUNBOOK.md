# Three-minute Ramblin’ Reach demo

Use the local app at http://127.0.0.1:3000 with Docker/Supabase running. Local passwords are in ignored `.tmp/demo-accounts.json`. Never put that file in a presentation or repository.

1. **0:00–0:25 — Student goal.** Sign in as `student`. Select the environmental sensor example and choose **Build my path**. Explain: a shared university connection is useful when it helps someone make a concrete next step.
2. **0:25–0:55 — JacketPath.** Show the four steps, official Hive/Invention Studio sources, review dates, and unknown availability. Complete a checklist step and reload to show persistence.
3. **0:55–1:25 — JacketMatch.** Open Jordan Mercer’s demo profile. Point to stored sensor experience, offered project mentorship, and the temperature-logger lesson. Employer is self-reported. A company connection is a starting point for advice.
4. **1:25–1:55 — ReachCard.** Open the request form. The owned goal is carried forward. Ask one specific question, for example how to calibrate a sensor before designing its enclosure. Choose written advice and send. The inbox is the response mechanism; no email notification or meeting is promised.
5. **1:55–2:25 — Alumni response.** In another browser profile sign in as `A1`. Show the alumni dashboard, accept the request, then return to the student and reload Requests. Both accounts show the accepted state.
6. **2:25–3:00 — Progress that carries forward.** Simulate completion and record a private technical-advice outcome. Open Profile → Projects and lessons to show how a member can separately share a reviewed lesson or withdraw it. Close: the product connects campus resources, relevant experience, a focused ask, and the learner’s next action.

All seeded people, projects and outcomes are fictional demo data. Completion is self-reported, not proof that an offline conversation occurred. Manual demo accounts retain real quotas: if A1 is full after rehearsals, use another opted-in helper offering project guidance. Do not bypass quotas or reset unrelated data. Automated journey tests provision isolated local demo accounts to avoid consuming manual demo capacity.

# Deployment handoff

No hosted deployment has been verified. The intended stack remains Vercel and Supabase.

- Create a dedicated Supabase staging project, apply the checked-in migrations, and manually approve consenting test members. The bundled seed deliberately accepts only the local instance.
- Set the public Supabase URL/publishable key, `APP_ENV=staging`, `DEMO_MODE=0` for real users, `MOCK_AI=1`, and the exact `NEXT_PUBLIC_APP_URL` origin in the app environment. Never add service-role credentials to Vercel runtime.
- Configure Supabase site URL and exact `/auth/callback` and recovery redirect URLs. Configure production email delivery before real signup/recovery testing.
- Before a public production release, set `APP_ENV=production`, `DEMO_MODE=0`, and keep the database `private.deployment.allow_demo=false`. Demo accounts must never be visible in production.
- Run `npm ci`, `npm run check`, `npm run build`, `npm run test:db` against isolated local Supabase, and the browser suite before release. Verify hosted sign-in, confirmation, recovery, protected APIs and the two-account journey on the actual deployed origin.
