import { readFile, writeFile, mkdir } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import pg from "pg";
import { z } from "zod";

const env = z.object({ APP_ENV: z.literal("local"), ALLOW_DEMO_SEED: z.literal("1"), SUPABASE_URL: z.literal("http://127.0.0.1:54321"), SUPABASE_SERVICE_ROLE_KEY: z.string().min(20), DATABASE_URL: z.string() }).parse(process.env);
const database = new URL(env.DATABASE_URL);
if (database.hostname !== "127.0.0.1" || database.port !== "54322" || database.pathname !== "/postgres") throw new Error("Seed only supports the isolated local database.");
const fixtureSchema = z.object({ fixture_id: z.string(), display_name: z.string(), affiliation: z.enum(["student", "alumni"]), verified: z.boolean(), visible: z.boolean(), paused: z.boolean(), metro: z.string().nullable(), company: z.string().nullable(), role: z.string().nullable(), help_topics: z.array(z.string()), skills: z.array(z.string()), gt_context: z.array(z.string()), cap: z.number() });
const fixtures = z.object({ people: z.array(fixtureSchema) }).parse(JSON.parse(await readFile("fixtures/demo_people.json", "utf8")));
const admin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const db = new pg.Client({ connectionString: env.DATABASE_URL });
await db.connect();
const accounts: { name: string; id: string; email: string; password: string }[] = [];
try {
  const { data: existing, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (error) throw new Error("Could not read local auth identities.");
  const people = [
    { fixture_id: "student", display_name: "Demo Learner", affiliation: "student" as const, verified: true, visible: false, paused: true, metro: null, company: null, role: null, help_topics: [], skills: [], gt_context: [], cap: 2 },
    { fixture_id: "outsider", display_name: "Demo Observer", affiliation: "student" as const, verified: true, visible: false, paused: true, metro: null, company: null, role: null, help_topics: [], skills: [], gt_context: [], cap: 2 },
    ...fixtures.people,
  ];
  await db.query("update private.deployment set allow_demo = true where singleton");
  for (const person of people) {
    const email = `${person.fixture_id.toLowerCase()}.demo@example.test`;
    const password = randomBytes(24).toString("base64url");
    const old = existing.users.find(u => u.email === email);
    const result = old ? await admin.auth.admin.updateUserById(old.id, { password, email_confirm: true }) : await admin.auth.admin.createUser({ email, password, email_confirm: true });
    if (result.error || !result.data.user) throw new Error(`Could not seed fixture ${person.fixture_id}.`);
    const id = z.uuid().parse(result.data.user.id);
    await db.query(`update public.profiles set display_name=$2, affiliation=$3, verification_state=$4,
      verification_method='demo', verified_at=now(), is_demo=true, visible=$5, paused=$6,
      metro=$7,company_name=$8,role_title=$9,help_topics=$10,skills=$11,gt_topics=$12,monthly_cap=$13 where id=$1`,
    [id, person.display_name, person.affiliation, person.verified ? "demo" : "pending", person.visible, person.paused, person.metro, person.company, person.role, person.help_topics, person.skills, person.gt_context, person.cap]);
    accounts.push({ name: person.fixture_id, id, email, password });
  }
  await mkdir(".tmp", { recursive: true });
  await writeFile(".tmp/demo-accounts.json", JSON.stringify(accounts, null, 2));
  console.log(`Seeded ${accounts.length} fictional accounts using real Auth. Local credentials are in ignored .tmp/demo-accounts.json; never publish that file.`);
} finally { await db.end(); }
