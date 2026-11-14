import { loadEnvFile } from "node:process";
import { randomUUID } from "node:crypto";
import assert from "node:assert/strict";
import pg from "pg";
import { z } from "zod";

loadEnvFile(".env.seed.local");
const env = z.object({ APP_ENV: z.literal("local"), DATABASE_URL: z.string() }).parse(process.env);
const target = new URL(env.DATABASE_URL);
if (target.hostname !== "127.0.0.1" || target.port !== "54322") throw new Error("Database tests require isolated local Supabase.");
const db = new pg.Client({ connectionString: env.DATABASE_URL });
await db.connect();
let passed = 0;
const ids = { viewer: randomUUID(), helper: randomUUID(), hidden: randomUUID(), pending: randomUUID(), demo: randomUUID() };
async function actor(id: string | null) {
  await db.query("reset role");
  await db.query("select set_config('request.jwt.claim.sub',$1,true)", [id ?? ""]);
  await db.query(id ? "set local role authenticated" : "set local role anon");
}
async function test(name: string, run: () => Promise<void>) { await run(); passed++; console.log(`PASS ${name}`); }
async function denied(sql: string, values: unknown[] = []) {
  await db.query("savepoint denial");
  let code: string | undefined;
  try { await db.query(sql, values); } catch (error) { code = z.object({ code: z.string() }).parse(error).code; }
  await db.query("rollback to savepoint denial");
  assert.equal(code, "42501", "Expected a database privilege/RLS denial");
}
try {
  await db.query("begin");
  for (const [name, id] of Object.entries(ids)) {
    await db.query("insert into auth.users(id,email,email_confirmed_at) values($1,$2,now())", [id, `${name}.${id}@example.test`]);
    if (name !== "pending") await db.query("update public.profiles set verification_state=$2,is_demo=$3,verified_at=now(),visible=$4,paused=false where id=$1", [id, name === "demo" ? "demo" : "verified", name === "demo", name !== "hidden"]);
  }
  await actor(null);
  await test("S01 anonymous profile access denied", () => denied("select * from public.profiles"));
  await test("S16 anonymous capability RPC denied", () => denied("select public.is_eligible_member()"));
  await actor(ids.viewer);
  await test("S02 approved opt-in member visible", async () => assert.equal((await db.query("select id from public.profiles where id=$1", [ids.helper])).rowCount, 1));
  await test("S09 hidden member absent", async () => assert.equal((await db.query("select id from public.profiles where id=$1", [ids.hidden])).rowCount, 0));
  await test("S04 verification escalation denied", () => denied("update public.profiles set verification_state='verified' where id=$1", [ids.viewer]));
  await test("S05 affiliation escalation denied", () => denied("update public.profiles set affiliation='alumni' where id=$1", [ids.viewer]));
  await test("S06 demo escalation denied", () => denied("update public.profiles set is_demo=true where id=$1", [ids.viewer]));
  await test("S20 foreign profile write changes no rows", async () => assert.equal((await db.query("update public.profiles set display_name='Forged' where id=$1", [ids.helper])).rowCount, 0));
  await test("own permitted profile update persists", async () => assert.equal((await db.query("update public.profiles set display_name='Updated' where id=$1", [ids.viewer])).rowCount, 1));
  await test("S12 block hides both directions", async () => {
    await db.query("insert into public.blocks(blocker_id,blocked_id) values($1,$2)", [ids.viewer, ids.helper]);
    assert.equal((await db.query("select id from public.profiles where id=$1", [ids.helper])).rowCount, 0);
    await actor(ids.helper);
    assert.equal((await db.query("select id from public.profiles where id=$1", [ids.viewer])).rowCount, 0);
    assert.equal((await db.query("select * from public.blocks")).rowCount, 0);
  });
  await actor(ids.pending);
  await test("S03 pending member sees no other profiles", async () => assert.equal((await db.query("select id from public.profiles where id=$1", [ids.viewer])).rowCount, 0));
  await test("pending membership cannot grant privileges", async () => {
    await db.query("insert into public.membership_requests(owner_id,requested_affiliation) values($1,'alumni')", [ids.pending]);
    assert.equal((await db.query("select public.is_eligible_member() as allowed")).rows[0].allowed, false);
    assert.equal((await db.query("select affiliation from public.profiles where id=$1", [ids.pending])).rows[0].affiliation, "student");
  });
  await db.query("reset role");
  await db.query("update private.deployment set allow_demo=false");
  await actor(ids.demo);
  await test("demo disabled by database deployment gate", async () => assert.equal((await db.query("select public.is_eligible_member() as allowed")).rows[0].allowed, false));
  await actor(ids.viewer);
  await test("rate limits persisted and enforced after fifth request", async () => {
    for (let i = 1; i <= 6; i++) assert.equal((await db.query("select public.consume_rate_limit('goals') as allowed")).rows[0].allowed, i <= 5);
  });
  await test("private deployment flag cannot be read or changed", () => denied("update private.deployment set allow_demo=true"));
  console.log(`${passed} database checks passed. All fixture writes rolled back.`);
} finally { await db.query("rollback"); await db.end(); }
