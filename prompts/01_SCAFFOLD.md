# Codex Milestone 01 — Scaffold and visual foundation

**Goal:** create the smallest production-quality Next.js application shell with elegant, accessible, mobile-first UI and reliable test scripts.

**Context:** @MASTER_SPEC.md sections 4–5, @UX_DESIGN.md, @ARCHITECTURE_SECURITY.md sections 1/8, @AGENTS.md, approved `IMPLEMENTATION_PLAN`.

**Current → expected:** empty or partially scaffolded repo → Next.js App Router + React + TypeScript strict, Tailwind, shadcn/ui, Lucide, Zod, Supabase SSR client helpers (without auth UI shortcuts), Vitest, Playwright, correct `.gitignore` and `.env.example`, typed placeholders for real screens and routes. A polished landing/dashboard shell loads at 375px and desktop.

**Constraints:** Do not implement fake auth or fake working data flows. No Tailwind color-only status, GT trademark logos, Google auth, maps, chat, complex animation or static buttons presented as functional. Do not overwrite unrelated repo code; adapt exact Next.js/ESLint version conventions based on installed version. The footer disclaimer is mandatory.

**Tasks:**
1. Inspect and preserve existing source and package versions; scaffold only missing pieces.
2. Implement CSS tokens from UX design, layout/nav, skeleton/empty/error components and semantic accessible input/button primitives.
3. Add strict TypeScript and Zod env parsing for applicable variables with a clearly documented local mock mode; do not require actual external secrets to render public landing.
4. Add package scripts: `dev`, `build`, `typecheck`, `lint`, `test`, `test:db`, `test:e2e`, `check`.
5. Add `src/lib/domain` enums/schemas and dependency-free unit smoke tests; no behavior placeholders on pages that claim to work.
6. Record deviations from the approved plan.

**Verification / acceptance:** run `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`; report exact outputs. Check responsive at 375px and desktop; all nav routes open to truthful empty/coming-next states, not fake completed functions. Do not advance without approval.
