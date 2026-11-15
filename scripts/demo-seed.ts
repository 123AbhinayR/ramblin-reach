import {loadEnvFile} from 'node:process';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {randomBytes} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';
import pg from 'pg';
import {z} from 'zod';
loadEnvFile('.env.seed.local');
const env=z.object({APP_ENV:z.literal('local'),ALLOW_DEMO_SEED:z.literal('1'),SUPABASE_URL:z.literal('http://127.0.0.1:54321'),SUPABASE_SERVICE_ROLE_KEY:z.string().min(20),DATABASE_URL:z.string()}).parse(process.env);
const target=new URL(env.DATABASE_URL);if(target.hostname!=='127.0.0.1'||target.port!=='54322'||target.pathname!=='/postgres')throw new Error('Isolated local database required');
const accountSchema=z.object({alias:z.string(),id:z.uuid(),email:z.email(),password:z.string().min(12)});const file='.tmp/reach-demo-accounts.json';
let saved:z.infer<typeof accountSchema>[]=[];try{saved=z.array(accountSchema).parse(JSON.parse(await readFile(file,'utf8')));}catch{/* First setup generates private credentials. */}
const aliases=['student-robotics','student-startup','student-quant','alumni-robotics','alumni-startup','alumni-quant','alumni-software'];
const admin=createClient(env.SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});const db=new pg.Client({connectionString:env.DATABASE_URL});await db.connect();
try{
 const {data,error}=await admin.auth.admin.listUsers({perPage:1000});if(error)throw new Error('Could not provision demo Auth accounts');const accounts=[];
 for(const alias of aliases){const email=`${alias}@reach-demo.example.test`;const previous=saved.find(a=>a.alias===alias);const password=previous?.password??randomBytes(24).toString('base64url');const old=data.users.find(u=>u.email===email);
 const result=old?await admin.auth.admin.updateUserById(old.id,{password,email_confirm:true}):await admin.auth.admin.createUser({email,password,email_confirm:true});if(result.error||!result.data.user)throw new Error('Demo account provisioning failed');const id=result.data.user.id;
 await db.query("update public.profiles set affiliation=$2,verification_state='demo',verification_method='demo',verified_at=now(),is_demo=true where id=$1",[id,alias.startsWith('alumni')?'alumni':'student']);await db.query('insert into private.demo_members(alias,id) values($1,$2) on conflict(alias) do update set id=excluded.id',[alias,id]);accounts.push({alias,id,email,password});
 }
 await db.query('update private.deployment set allow_demo=true where singleton');
 await db.query('begin');await db.query("select set_config('request.jwt.claim.sub',$1,true)",[accounts[0].id]);await db.query('select public.reset_reach_demo()');await db.query('commit');
 await mkdir('.tmp',{recursive:true});await writeFile(file,JSON.stringify(accounts,null,2));console.log('DEMO DATA: seeded/reset 3 students, 4 alumni and isolated scenario. Private credentials remain in ignored .tmp/reach-demo-accounts.json.');
}catch(error){await db.query('rollback');throw error;}finally{await db.end();}
