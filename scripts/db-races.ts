import pg from "pg";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

export async function runDatabaseRaces(connectionString: string) {
  const admin = new pg.Client({ connectionString });
  await admin.connect();
  const members = Array.from({ length: 12 }, () => randomUUID());
  async function session(actor: string, sql: string, values: unknown[]) {
    const client = new pg.Client({ connectionString });
    await client.connect();
    try {
      await client.query("begin");
      await client.query("select set_config('request.jwt.claim.sub',$1,true)", [actor]);
      await client.query("set local role authenticated");
      const result = await client.query(sql, values);
      await client.query("commit");
      return result.rows;
    } catch (error) { await client.query("rollback"); throw error; }
    finally { await client.end(); }
  }
  const sql = "select * from public.create_connection_request($1,null,'project_guidance','written_advice','I am building a sensor prototype.','How did you test your first sensor prototype?',null,null,$2)";
  const create = (sender: string, recipient: string, key = randomUUID()) => session(sender,sql,[recipient,key]);
  let passed=0;
  function pass(name: string) { passed++; console.log(`PASS ${name}`); }
  try {
    for (const id of members) {
      await admin.query("insert into auth.users(id,email,email_confirmed_at) values($1,$2,now())",[id,`race.${id}@example.test`]);
      await admin.query("update public.profiles set verification_state='verified',verified_at=now(),visible=true,paused=false,help_topics='{project_guidance}',monthly_cap=10 where id=$1",[id]);
    }
    await admin.query("update public.profiles set monthly_cap=1 where id=$1",[members[2]]);
    const recipientRace=await Promise.allSettled([create(members[0],members[2]),create(members[1],members[2])]);
    assert.equal(recipientRace.filter(r=>r.status==='fulfilled').length,1);
    assert.equal((await admin.query("select count(*)::int as used from public.connection_requests where recipient_id=$1",[members[2]])).rows[0].used,1);
    pass("R08/R09/S21 concurrent incoming cap: exactly one committed request");

    const senderRace=await Promise.allSettled(members.slice(4,8).map(recipient=>create(members[3],recipient)));
    assert.equal(senderRace.filter(r=>r.status==='fulfilled').length,3);
    assert.equal((await admin.query("select count(*)::int as used from public.connection_requests where requester_id=$1 and status='pending'",[members[3]])).rows[0].used,3);
    pass("R07 concurrent outgoing cap: exactly three committed requests");

    const pending=(await admin.query("select id,recipient_id from public.connection_requests where requester_id=$1 limit 1",[members[3]])).rows[0];
    const transitionRace=await Promise.allSettled([
      session(pending.recipient_id,"select (public.transition_connection_request($1,'accept')).status",[pending.id]),
      session(pending.recipient_id,"select (public.transition_connection_request($1,'decline')).status",[pending.id]),
    ]);
    assert.equal(transitionRace.filter(r=>r.status==='fulfilled').length,1);
    assert.equal((await admin.query("select count(*)::int as n from private.request_audit where request_id=$1 and action in ('accept','decline')",[pending.id])).rows[0].n,1);
    pass("R20 competing transitions produce one state change and audit entry");

    const retryKey=randomUUID();
    const retryRace=await Promise.all([create(members[8],members[9],retryKey),create(members[8],members[9],retryKey)]);
    assert.equal(retryRace[0][0].id,retryRace[1][0].id);
    pass("R25 simultaneous retries reconcile to one request");

    await admin.query("update public.profiles set monthly_cap=1 where id=$1",[members[11]]);
    for (const status of ["completed","declined","cancelled"]) {
      await admin.query(`insert into public.connection_requests(requester_id,recipient_id,help_topic,format,goal_context,specific_question,idempotency_key,status,created_at)
        values($1,$2,'project_guidance','written_advice','A previous sensor project.','How do you calibrate a sensor?',gen_random_uuid(),$3::public.request_status,
        case when $3::public.request_status='completed' then (date_trunc('month',now() at time zone 'UTC') at time zone 'UTC')-interval '1 second' else now() end)`,[members[10],members[11],status]);
    }
    await create(members[10],members[11]);
    const count=await session(members[10],"select * from public.member_capacity($1)",[[members[11]]]);
    assert.equal(count[0].used,1);
    pass("R21/R22 UTC month boundary and declined/cancelled rows do not consume cap");

    const projectRace=await Promise.allSettled(Array.from({length:4},(_,i)=>session(members[0],"insert into public.member_projects(owner_id,title,summary,visibility) values($1,$2,'Test project','members') returning id",[members[0],`Project ${i}`])));
    assert.equal(projectRace.filter(r=>r.status==='fulfilled').length,3);
    pass("concurrent public project limit: exactly three published projects");
    console.log(`${passed} committed concurrency/month-boundary checks passed; test identities will be removed.`);
  } finally {
    await admin.query("delete from private.request_audit where actor_id=any($1::uuid[])",[members]);
    await admin.query("delete from public.connection_requests where requester_id=any($1::uuid[]) or recipient_id=any($1::uuid[])",[members]);
    await admin.query("delete from auth.users where id=any($1::uuid[])",[members]);
    await admin.end();
  }
}
