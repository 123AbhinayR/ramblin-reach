import {loadEnvFile} from "node:process";
import {randomUUID} from "node:crypto";
import {createClient} from "@supabase/supabase-js";
import pg from "pg";
import {z} from "zod";
import {test} from "@playwright/test";
const createdIds:string[]=[];
test.afterEach(async()=>{
 if(!createdIds.length)return;
 const ids=createdIds.splice(0);
 loadEnvFile(".env.seed.local");
 const admin=createClient(process.env.SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{persistSession:false,autoRefreshToken:false}});
 const db=new pg.Client({connectionString:process.env.DATABASE_URL});await db.connect();
 try{
  await db.query("delete from public.circle_comments where owner_id=any($1::uuid[]) or post_id in (select id from public.circle_posts where owner_id=any($1::uuid[]))",[ids]);
  await db.query("delete from public.circle_posts where owner_id=any($1::uuid[])",[ids]);
  await db.query("delete from public.request_messages where sender_id=any($1::uuid[]) or request_id in (select id from public.connection_requests where requester_id=any($1::uuid[]) or recipient_id=any($1::uuid[]))",[ids]);
  await db.query("delete from public.request_reads where member_id=any($1::uuid[]) or request_id in (select id from public.connection_requests where requester_id=any($1::uuid[]) or recipient_id=any($1::uuid[]))",[ids]);
  await db.query("delete from public.outcomes where reported_by=any($1::uuid[]) or request_id in (select id from public.connection_requests where requester_id=any($1::uuid[]) or recipient_id=any($1::uuid[]))",[ids]);
  await db.query("delete from private.request_audit where request_id in (select id from public.connection_requests where requester_id=any($1::uuid[]) or recipient_id=any($1::uuid[]))",[ids]);
  await db.query("delete from public.reports where reporter_id=any($1::uuid[]) or request_id in (select id from public.connection_requests where requester_id=any($1::uuid[]) or recipient_id=any($1::uuid[]))",[ids]);
  await db.query("delete from public.connection_requests where requester_id=any($1::uuid[]) or recipient_id=any($1::uuid[])",[ids]);
  await db.query("delete from public.member_projects where owner_id=any($1::uuid[])",[ids]);
  await db.query("delete from public.goals where owner_id=any($1::uuid[])",[ids]);
  await db.query("delete from public.notifications where recipient_id=any($1::uuid[]) or actor_id=any($1::uuid[])",[ids]);
  await db.query("delete from public.blocks where blocker_id=any($1::uuid[]) or blocked_id=any($1::uuid[])",[ids]);
  await db.query("delete from private.rate_limits where actor=any($1::uuid[])",[ids]);
  await db.query("delete from public.profiles where id=any($1::uuid[])",[ids]);
  for(const id of ids){
   await admin.auth.admin.deleteUser(id).catch(()=>{});
  }
 }finally{await db.end();}
});
export async function isolatedAccounts(){
 loadEnvFile(".env.seed.local");
 const env=z.object({APP_ENV:z.literal("local"),SUPABASE_URL:z.literal("http://127.0.0.1:54321"),SUPABASE_SERVICE_ROLE_KEY:z.string(),DATABASE_URL:z.string()}).parse(process.env);
 const target=new URL(env.DATABASE_URL);if(target.hostname!=="127.0.0.1"||target.port!=="54322")throw new Error("Local test database required");
 const admin=createClient(env.SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});const db=new pg.Client({connectionString:env.DATABASE_URL});await db.connect();
 try{const accounts=[];for(const role of ["student","alumni"]){const email=`e2e.${randomUUID()}@example.test`;const password=randomUUID()+randomUUID();const {data,error}=await admin.auth.admin.createUser({email,password,email_confirm:true});if(error||!data.user)throw new Error("Test account provisioning failed");const id=data.user.id;
 createdIds.push(id);
 await db.query("update public.profiles set display_name=$2,affiliation=$3,verification_state='demo',verification_method='demo',verified_at=now(),is_demo=true,visible=$4,paused=false,help_topics='{project_guidance}',skills='{sensor,electronics}',monthly_cap=2,company_name=$5 where id=$1",[id,role==="alumni"?"Jordan Mercer":"Demo Learner",role,role==="alumni",role==="alumni"?`E2E ${id}`:null]);
 if(role==="alumni")await db.query("insert into public.member_projects(owner_id,title,summary,one_lesson,visibility) values($1,'DIY temperature logger','Fictional test project','Test calibration against a known reference.','members')",[id]);accounts.push({id,email,password});}
 return {studentAccount:accounts[0],helperAccount:accounts[1]};
 }finally{await db.end();}
}
