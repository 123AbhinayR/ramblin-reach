import {loadEnvFile} from 'node:process';
import {randomUUID} from 'node:crypto';
import assert from 'node:assert/strict';
import pg from 'pg';
import {z} from 'zod';
loadEnvFile('.env.seed.local');
const env=z.object({APP_ENV:z.literal('local'),DATABASE_URL:z.string()}).parse(process.env);
const target=new URL(env.DATABASE_URL);if(target.hostname!=='127.0.0.1'||target.port!=='54322')throw new Error('Local DB required');
const db=new pg.Client({connectionString:env.DATABASE_URL});await db.connect();let count=0;
const student=randomUUID(),alum=randomUUID(),other=randomUUID();
async function actor(id:string|null){await db.query('reset role');await db.query("select set_config('request.jwt.claim.sub',$1,true)",[id??'']);await db.query(id?'set local role authenticated':'set local role anon');}
async function rejects(sql:string,args:unknown[]=[]){await db.query('savepoint rejection');let failed=false;try{await db.query(sql,args);}catch{failed=true;}await db.query('rollback to savepoint rejection');assert.ok(failed);}
function pass(name:string){console.log('PASS '+name);count++;}
async function send(id:string,body='A fictional private message',key=randomUUID()){return (await db.query('select (public.send_request_message($1,$2,$3)).*',[id,body,key])).rows[0] as {id:number;sender_id:string};}
try{
 await db.query('begin');for(const id of [student,alum,other]){await db.query('insert into auth.users(id,email,email_confirmed_at) values($1,$2,now())',[id,`${id}@example.test`]);await db.query("update public.profiles set verification_state='verified',verified_at=now(),visible=true,paused=false,help_topics='{project_guidance}',monthly_cap=10 where id=$1",[id]);}
 await actor(student);const create=()=>db.query("select (public.create_connection_request($1,null,'project_guidance','written_advice','Fictional goal context','A specific fictional question?',null,null,$2)).*",[alum,randomUUID()]);
 const req=(await create()).rows[0] as {id:string};
 await rejects("select public.send_request_message($1,'Cannot send pending',$2)",[req.id,randomUUID()]);pass('QR01 pending has no thread');
 await rejects("select public.create_connection_request($1,null,'project_guidance','written_advice','Fictional goal context','A specific fictional question?',null,null,$2)",[alum,randomUUID()]);pass('QR02 duplicate request denied');
 await rejects("select public.transition_connection_request($1,'accept')",[req.id]);await actor(alum);await db.query("select public.transition_connection_request($1,'accept')",[req.id]);pass('QR03 recipient-only accept');
 const key=randomUUID();const first=await send(req.id,'First private message',key);assert.equal(first.sender_id,alum);assert.equal((await send(req.id,'First private message',key)).id,first.id);await rejects("select public.send_request_message($1,'Different retry',$2)",[req.id,key]);pass('QR04 retry idempotency and conflict');
 await actor(student);await send(req.id);assert.equal((await db.query('select * from public.request_messages where request_id=$1',[req.id])).rowCount,2);pass('QR05 both participants reply');
 await rejects("insert into public.request_messages(request_id,sender_id,body,idempotency_key) values($1,$2,'Forged',$3)",[req.id,alum,randomUUID()]);await rejects('update public.request_messages set body=\'Changed\' where request_id=$1',[req.id]);pass('QR06 direct SQL and sender spoof denied');
 await actor(other);assert.equal((await db.query('select * from public.request_messages where request_id=$1',[req.id])).rowCount,0);await rejects('select public.send_request_message($1,\'Foreign\',$2)',[req.id,randomUUID()]);await rejects('select public.mark_request_read($1,$2)',[req.id,first.id]);pass('QR07 unrelated account denied');
 await actor(null);await rejects('select * from public.request_messages');await rejects('select public.send_request_message($1,\'Anonymous\',$2)',[req.id,randomUUID()]);pass('QR08 anonymous denied');
 await actor(student);await rejects('select public.send_request_message($1,$2,$3)',[req.id,'x'.repeat(2001),randomUUID()]);await rejects('select public.send_request_message($1,$2,$3)',[req.id,'\u200b',randomUUID()]);pass('QR09 DB length and normalization');
 await db.query('select public.mark_request_read($1,$2)',[req.id,first.id]);assert.equal((await db.query('select * from public.request_reads')).rowCount,1);pass('QR10 read cursor participant-owned');
 assert.equal((await db.query('select * from public.unread_request_ids($1)',[[req.id]])).rowCount,0);
 await actor(alum);assert.equal((await db.query('select * from public.unread_request_ids($1)',[[req.id]])).rowCount,1);
 await actor(other);assert.equal((await db.query('select * from public.unread_request_ids($1)',[[req.id]])).rowCount,0);
 await actor(student);pass('QR19 unread summary respects cursor and participants');
 for(let i=0;i<9;i++)await send(req.id,`Rate message ${i}`);await rejects('select public.send_request_message($1,\'Rate excess\',$2)',[req.id,randomUUID()]);pass('QR11 atomic rate limit');
 await db.query('insert into public.blocks(blocker_id,blocked_id) values($1,$2)',[student,alum]);assert.equal((await db.query('select * from public.request_messages')).rowCount,0);await rejects('select public.send_request_message($1,\'Blocked\',$2)',[req.id,randomUUID()]);await db.query('delete from public.blocks where blocker_id=$1',[student]);pass('QR12 block revokes thread');
 await actor(alum);await db.query('update public.profiles set visible=false where id=$1',[alum]);assert.equal((await db.query('select * from public.request_messages')).rowCount,0);await rejects('select public.send_request_message($1,\'Withdrawn\',$2)',[req.id,randomUUID()]);await db.query('update public.profiles set visible=true where id=$1',[alum]);pass('QR13 recipient consent withdrawal');
 await db.query("select public.transition_connection_request($1,'complete')",[req.id]);await rejects('select public.send_request_message($1,\'Closed\',$2)',[req.id,randomUUID()]);assert.ok((await db.query('select * from public.request_messages')).rowCount);pass('QR14 closed thread read-only');
 await actor(student);const declined=(await create()).rows[0] as {id:string};await actor(alum);await db.query("select public.transition_connection_request($1,'decline')",[declined.id]);await rejects('select public.send_request_message($1,\'Declined\',$2)',[declined.id,randomUUID()]);pass('QR15 decline never unlocks thread');
 console.log(`${count} Inbox database checks passed (rolled back).`);
}finally{await db.query('rollback');await db.end();}


