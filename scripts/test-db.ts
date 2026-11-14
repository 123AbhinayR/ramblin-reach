import { loadEnvFile } from "node:process";
import { randomUUID } from "node:crypto";
import assert from "node:assert/strict";
import pg from "pg";
import { z } from "zod";
import { runDatabaseRaces } from "./db-races";

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
async function rejected(sql: string, values: unknown[], expected: string) {
  await db.query("savepoint rejection");
  let message = "";
  try { await db.query(sql, values); } catch (error) { message = z.object({ message: z.string() }).parse(error).message; }
  await db.query("rollback to savepoint rejection");
  assert.ok(message.includes(expected), `Expected ${expected}, received ${message}`);
}
const createSql = "select * from public.create_connection_request($1,$2,'project_guidance','written_advice',$3,$4,null,null,$5)";
const requestValues = (recipient: string, goal: string | null = null, key = randomUUID()) => [recipient, goal, "I am building a sensor prototype.", "How did you calibrate the sensor before testing?", key];
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
  await actor(ids.viewer);
  await db.query("delete from public.blocks where blocker_id=$1", [ids.viewer]);
  await db.query("reset role");
  await db.query("update public.profiles set help_topics='{project_guidance}',monthly_cap=10 where id=any($1::uuid[])", [[ids.viewer,ids.helper,ids.hidden]]);
  const resource = randomUUID();
  await db.query("insert into public.resources(id,slug,title,kind,short_description,student_action,official_url,official_domain,eligible_audience,eligibility_caveat,last_reviewed_at,source_status) values($1,$2,'Test source','makerspace','Test description','Check official guidance','https://hive.ece.gatech.edu/explore/','hive.ece.gatech.edu','Unknown','Verify current requirements','2026-11-14','reviewed')", [resource, `test-${resource}`]);
  await actor(ids.helper);
  const draft = [{kind:"action",title:"Define",description:"Define requirements",reason:"Start with a goal"},{kind:"resource",resourceId:resource,reason:"Relevant resource"},{kind:"find_person",title:"Find help",description:"Find a member",reason:"Ask a specific question"}];
  const goal = (await db.query("select public.create_goal_with_path('Build an environmental sensor','project',null,null,'{sensor}',$1) as id", [JSON.stringify(draft)])).rows[0].id as string;
  const step = (await db.query("select id from public.path_steps where goal_id=$1 order by ordinal", [goal])).rows[0].id as string;
  await test("immutable source snapshot cannot be replaced by owner", () => denied("update public.path_steps set source_snapshot='{}' where goal_id=$1", [goal]));
  await test("step progress timestamp persists", async () => {
    await db.query("update public.path_steps set status='done' where id=$1", [step]);
    assert.ok((await db.query("select completed_at from public.path_steps where id=$1", [step])).rows[0].completed_at);
  });
  await db.query("insert into public.member_projects(owner_id,title,summary,one_lesson) values($1,'Private title','Private project','Private lesson')", [ids.helper]);
  await actor(ids.viewer);
  await test("S07 foreign goals and steps remain private", async () => {
    assert.equal((await db.query("select id from public.goals where id=$1", [goal])).rowCount,0);
    assert.equal((await db.query("select id from public.path_steps where goal_id=$1", [goal])).rowCount,0);
    assert.equal((await db.query("update public.path_steps set status='done' where id=$1", [step])).rowCount,0);
  });
  await test("S08 direct step insertion cannot forge goal ownership", () => denied("insert into public.path_steps(goal_id,ordinal,kind,title,description,reason) values($1,5,'action','Forged','Forged','Forged')",[goal]));
  await test("S10 private project absent for other members", async () => assert.equal((await db.query("select id from public.member_projects where owner_id=$1",[ids.helper])).rowCount,0));
  await test("S11 curated resource changes denied", () => denied("update public.resources set official_url='https://example.com' where id=$1",[resource]));
  await test("R02 self-request rejected", () => rejected(createSql,requestValues(ids.viewer),"MEMBER_UNAVAILABLE"));
  await test("R04 hidden recipient rejected", () => rejected(createSql,requestValues(ids.hidden),"MEMBER_UNAVAILABLE"));
  await test("foreign goal attachment rejected", () => rejected(createSql,requestValues(ids.helper,goal),"GOAL_UNAVAILABLE"));
  await test("R05 unoffered topic rejected", () => rejected(createSql.replace("'project_guidance'","'company_insight'"),requestValues(ids.helper),"MEMBER_UNAVAILABLE"));
  await test("C04 invisible request text rejected by database", async () => {
    const values=requestValues(ids.helper); values[3]="\u200b".repeat(30);
    await rejected(createSql,values,"check constraint");
  });
  await test("R11/S14 direct request insertion denied", () => denied("insert into public.connection_requests(requester_id,recipient_id) values($1,$2)",[ids.viewer,ids.helper]));
  const retryValues=requestValues(ids.helper);
  let requestId="";
  await test("R01/R10 authenticated caller owns a pending request", async () => {
    const row=(await db.query(createSql,retryValues)).rows[0]; requestId=row.id;
    assert.equal(row.requester_id,ids.viewer); assert.equal(row.status,"pending");
  });
  await test("R25 same retry key returns same request", async () => assert.equal((await db.query(createSql,retryValues)).rows[0].id,requestId));
  await test("R25 changed payload with same key rejected", async () => {
    const values=[...retryValues]; values[3]="A different specific question about the prototype.";
    await rejected(createSql,values,"IDEMPOTENCY_CONFLICT");
  });
  await test("R06 duplicate pending pair rejected", () => rejected(createSql,requestValues(ids.helper),"DUPLICATE_PENDING"));
  await test("R12/S13 direct request status update denied", () => denied("update public.connection_requests set status='accepted' where id=$1",[requestId]));
  await test("R18 sender cannot accept own request", () => rejected("select public.transition_connection_request($1,'accept')",[requestId],"INVALID_TRANSITION"));
  await test("O01 outcome before completion denied", () => denied("insert into public.outcomes(request_id,reported_by,outcome_type) values($1,$2,'technical_advice')",[requestId,ids.viewer]));
  await actor(ids.hidden);
  await test("R24 nonparticipant cannot read or change request", async () => {
    assert.equal((await db.query("select * from public.connection_requests where id=$1",[requestId])).rowCount,0);
    await rejected("select public.transition_connection_request($1,'complete')",[requestId],"REQUEST_UNAVAILABLE");
  });
  await actor(ids.pending);
  await test("R03 pending actor cannot create requests", () => denied(createSql,requestValues(ids.helper)));
  await actor(ids.helper);
  await test("R13 recipient accepts pending request", async () => assert.equal((await db.query("select (public.transition_connection_request($1,'accept')).status as status",[requestId])).rows[0].status,"accepted"));
  await test("R17 participant completes accepted request", async () => assert.equal((await db.query("select (public.transition_connection_request($1,'complete')).status as status",[requestId])).rows[0].status,"completed"));
  await test("R19 completed request cannot be accepted again", () => rejected("select public.transition_connection_request($1,'accept')",[requestId],"INVALID_TRANSITION"));
  await actor(ids.viewer);
  await test("O02 completed participant records private outcome", async () => {
    await db.query("insert into public.outcomes(request_id,reported_by,outcome_type,private_note) values($1,$2,'technical_advice','Private test note')",[requestId,ids.viewer]);
    assert.equal((await db.query("select private_note from public.outcomes where request_id=$1",[requestId])).rows[0].private_note,"Private test note");
  });
  await db.query("insert into public.reports(reporter_id,target_id,request_id,reason) values($1,$2,$3,'A fictional test report reason')",[ids.viewer,ids.helper,requestId]);
  await actor(ids.hidden);
  await test("O03/O04 unrelated members cannot read outcome or note", async () => assert.equal((await db.query("select * from public.outcomes where request_id=$1",[requestId])).rowCount,0));
  await actor(ids.helper);
  await test("S17 reports remain private to reporter", async () => assert.equal((await db.query("select * from public.reports where target_id=$1",[ids.helper])).rowCount,0));
  await test("outcome recipient cannot overwrite reporter note", async () => assert.equal((await db.query("update public.outcomes set private_note='Tampered' where request_id=$1",[requestId])).rowCount,0));
  await actor(ids.viewer);
  await test("R14 recipient can decline, then R19 cannot accept declined", async () => {
    const id=(await db.query(createSql,requestValues(ids.helper))).rows[0].id;
    await actor(ids.helper);
    assert.equal((await db.query("select (public.transition_connection_request($1,'decline')).status as status",[id])).rows[0].status,"declined");
    await rejected("select public.transition_connection_request($1,'accept')",[id],"INVALID_TRANSITION");
    await actor(ids.viewer);
  });
  await test("R15 requester can cancel pending", async () => {
    const id=(await db.query(createSql,requestValues(ids.helper))).rows[0].id;
    assert.equal((await db.query("select (public.transition_connection_request($1,'cancel')).status as status",[id])).rows[0].status,"cancelled");
  });
  await test("R16 requester can cancel accepted", async () => {
    const id=(await db.query(createSql,requestValues(ids.helper))).rows[0].id;
    await actor(ids.helper);
    await db.query("select public.transition_connection_request($1,'accept')",[id]);
    await actor(ids.viewer);
    assert.equal((await db.query("select (public.transition_connection_request($1,'cancel')).status as status",[id])).rows[0].status,"cancelled");
  });
  await test("S12 blocked requests fail in both directions", async () => {
    await db.query("insert into public.blocks(blocker_id,blocked_id) values($1,$2)",[ids.viewer,ids.helper]);
    await rejected(createSql,requestValues(ids.helper),"MEMBER_UNAVAILABLE");
    await actor(ids.helper);
    await rejected(createSql,requestValues(ids.viewer),"MEMBER_UNAVAILABLE");
    await actor(ids.viewer);
    await db.query("delete from public.blocks where blocker_id=$1",[ids.viewer]);
  });
  await actor(ids.helper);
  await db.query("update public.profiles set paused=true where id=$1",[ids.helper]);
  await actor(ids.viewer);
  await test("R04 paused recipient cannot receive requests", () => rejected(createSql,requestValues(ids.helper),"MEMBER_UNAVAILABLE"));
  await test("capacity RPC does not reveal hidden member counts", async () => assert.equal((await db.query("select * from public.member_capacity($1)",[[ids.hidden]])).rowCount,0));
  await actor(null);
  await test("S16 anonymous request RPC execution denied", () => denied(createSql,requestValues(ids.helper)));
  await db.query("reset role");
  await test("all public user-content tables have RLS enabled", async () => {
    const result=await db.query("select tablename from pg_tables where schemaname='public' and not rowsecurity");
    assert.deepEqual(result.rows,[]);
  });
  console.log(`${passed} database checks passed. All fixture writes rolled back.`);
} finally { await db.query("rollback"); await db.end(); }
await runDatabaseRaces(env.DATABASE_URL);
