# Local setup, secrets and security operator checklist

This is a guide for Codex to implement/document, not a claim the app currently exists. Always re-check CLI/version-specific commands.

1. Use Node LTS that matches the installed stable Next.js version; pin lockfile, commit `package-lock.json`. Add a `README` quick start after scaffold.
2. Create one isolated Supabase local/staging project. Configure `.env.local` from `.env.example`. Only `NEXT_PUBLIC_` values may enter browser bundles, and public project URL/publishable key must still be protected by RLS. Keep service role key out of ordinary Next runtime; seed script only. Set `DEMO_MODE=0` by default.
3. Run Supabase local service (`supabase start`) if Docker is available; otherwise choose a dedicated hosted staging project. Never run destructive migrations or seed against a production URL.
4. Apply schema migrations and run SQL RLS tests with distinct auth users / JWT contexts, not a single privileged admin connection. Validate a real unprivileged session cannot insert requests or flip verification flags.
5. Seed `student.demo`, `alumni.demo`, `outsider.demo` via Supabase admin seed tool guarded by ALLOW_DEMO_SEED and `NODE_ENV !== 'production'`; output passwords locally or read staging-only env. Never commit passwords or public login bypasses.
6. Test build `npm run check`, `npm run test:db`, `npm run test:e2e`, `npm run build`; verify dynamic authenticated pages are no-store, and production session cookies secure and same-site as appropriate. Implement CSRF protections consistent with framework and auth strategy. Rate limit goal/AI/request APIs using DB or shared store.
7. Configure Vercel environment variables carefully. Do not expose service keys on Vercel for this app's ordinary routes. If admin provisioning is required, run it outside deployment with a guarded local process.
8. Review university wordmarks, sponsor rules, public source-usage policies, and intellectual property before public announcement. Text-only independent-project brand and disclaimer are acceptable working defaults pending institutional clearance.

## Common engineering mistakes to block

- `getSession().user` trusted for server authorization rather than verified claims/user lookup.
- `verified=true` or `affiliation=alumni` updated by owner through a broad RLS `UPDATE` policy.
- Direct `INSERT` into connection request table permitted, bypassing monthly cap or block list.
- API returning a profile with hidden email, exact address, private lessons, or third-party scheduling URL.
- `SUPABASE_SERVICE_ROLE_KEY` imported into client code or ordinary Next page/route helper.
- A single in-memory rate limiter on serverless Vercel instances.
- LLM plan fabricating machine hours or deciding eligibility to receive help.
- `company=Microsoft&metro=Seattle` returning anyone who matches only one filter as an exact result.
- Repeated clicks creating duplicate pending requests because of missing server idempotency/pair cap.
- `DEMO_MODE=1` enabled on a real public production domain.

## Demo data reset

Implement a seed-reset command operating only in a dedicated test namespace or staging project. Ensure it is idempotent and guarded by `ALLOW_DEMO_SEED=1`, `NODE_ENV !== 'production'`, and an allowlisted expected Supabase project reference. Do not drop or truncate arbitrary user data. Never log real request contents; use IDs and safe status/error codes.
