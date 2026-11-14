import {loadEnvFile} from "node:process";
import {randomUUID} from "node:crypto";
import assert from "node:assert/strict";
import pg from "pg";
import {z} from "zod";
loadEnvFile(".env.seed.local");
const env=z.object({APP_ENV:z.literal("local"),DATABASE_URL:z.string()}).parse(process.env);
const target=new URL(env.DATABASE_URL);if(target.hostname!=="127.0.0.1"||target.port!=="54322")throw new Error("Isolated local DB required");
const db=new pg.Client({connectionString:env.DATABASE_URL});await db.connect();let count=0;
const owner=randomUUID(),helper=randomUUID(),stranger=randomUUID();
async function actor(id:string|null){await db.query("reset role");await db.query("select set_config('request.jwt.claim.sub',$1,true)",[id??""]);await db.query(id?"set local role authenticated":"set local role anon");}
async function rejects(sql:string,values:unknown[]=[]){await db.query("savepoint rejected_write");let failed=false;try{await db.query(sql,values);}catch{failed=true;}await db.query("rollback to savepoint rejected_write");assert.ok(failed,"Expected rejected write");}
function passed(name:string){count++;console.log(`PASS ${name}`);}
try{
 await db.query("begin");
 for(const id of [owner,helper,stranger]){await db.query("insert into auth.users(id,email,email_confirmed_at) values($1,$2,now())",[id,`${id}@example.test`]);await db.query("update public.profiles set verification_state='verified',verified_at=now(),visible=true,paused=false where id=$1",[id]);}
 await actor(owner);
 const post=z.object({id:z.uuid()}).parse((await db.query("insert into public.circle_posts(category,kind,title,description,specific_request) values('projects','help','Fictional sensor','A fictional sensor question.','How should calibration work?') returning id")).rows[0]);passed("CI05 authenticated post persists");
 await actor(null);await rejects("select * from public.circle_posts");passed("CI06 anonymous read denied");
 await actor(helper);assert.equal((await db.query("update public.circle_posts set resolved=true where id=$1",[post.id])).rowCount,0);assert.equal((await db.query("delete from public.circle_posts where id=$1",[post.id])).rowCount,0);passed("CI07 foreign edit/delete denied");
 await rejects("insert into public.circle_posts(owner_id,category,kind,title,description,specific_request) values($1,'projects','help','Forged','Forged discussion text','Forged question text')",[owner]);passed("CI08 sender spoof denied");
 const comment=z.object({id:z.uuid()}).parse((await db.query("insert into public.circle_comments(post_id,body) values($1,'Test against a known reference.') returning id",[post.id])).rows[0]);
 await actor(owner);const reply=z.object({id:z.uuid()}).parse((await db.query("insert into public.circle_comments(post_id,parent_id,body) values($1,$2,'Thanks, I will test that.') returning id",[post.id,comment.id])).rows[0]);
 await rejects("insert into public.circle_comments(post_id,parent_id,body) values($1,$2,'Third level forbidden')",[post.id,reply.id]);passed("CI09 one reply level enforced");
 await db.query("update public.circle_posts set resolved=true where id=$1",[post.id]);await actor(helper);await rejects("insert into public.circle_comments(post_id,body) values($1,'Late reply denied')",[post.id]);passed("CI10 resolved post rejects replies");
 await db.query("insert into public.circle_reports(post_id,reason) values($1,'Fictional moderation test reason')",[post.id]);await actor(stranger);assert.equal((await db.query("select * from public.circle_reports where post_id=$1",[post.id])).rowCount,0);passed("CI11 reports are private");
 await actor(owner);await db.query("insert into public.blocks(blocker_id,blocked_id) values($1,$2)",[owner,stranger]);await actor(stranger);assert.equal((await db.query("select * from public.circle_posts where id=$1",[post.id])).rowCount,0);passed("CI12 blocks hide discussions");
 await actor(owner);await db.query("update public.profiles set visible=false where id=$1",[owner]);await actor(helper);assert.equal((await db.query("select * from public.circle_posts where id=$1",[post.id])).rowCount,0);passed("CI13 withdrawn visibility hides posts");
 await actor(stranger);for(let i=0;i<5;i++)await db.query("insert into public.circle_posts(category,kind,title,description,specific_request) values('research','help','Rate test','Fictional rate test description','A specific rate test question')");await rejects("insert into public.circle_posts(category,kind,title,description,specific_request) values('research','help','Rate test','Fictional rate test description','A specific rate test question')");passed("CI14 direct SQL cannot bypass write limit");
 await actor(owner);await db.query("delete from public.circle_posts where id=$1",[post.id]);assert.equal((await db.query("select * from public.circle_comments where post_id=$1",[post.id])).rowCount,0);passed("CI15 owner delete removes discussion replies");
 console.log(`${count} Circles database checks passed (rolled back).`);
}finally{await db.query("rollback");await db.end();}

