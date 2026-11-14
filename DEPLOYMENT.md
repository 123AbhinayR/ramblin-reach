# Deployment handoff

No hosted deployment has been verified. The intended stack remains Vercel and Supabase.

- Create a dedicated Supabase staging project, apply the checked-in migrations, and manually approve consenting test members. The bundled seed deliberately accepts only the local instance.
- Set the public Supabase URL/publishable key, `APP_ENV=staging`, `DEMO_MODE=0` for real users, `MOCK_AI=1`, and the exact `NEXT_PUBLIC_APP_URL` origin in the app environment. Never add service-role credentials to Vercel runtime.
- Configure Supabase site URL and exact `/auth/callback` and recovery redirect URLs. Configure production email delivery before real signup/recovery testing.
- Before a public production release, set `APP_ENV=production`, `DEMO_MODE=0`, and keep the database `private.deployment.allow_demo=false`. Demo accounts must never be visible in production.
- Run `npm ci`, `npm run check`, `npm run build`, `npm run test:db` against isolated local Supabase, and the browser suite before release. Verify hosted sign-in, confirmation, recovery, protected APIs and the two-account journey on the actual deployed origin.
