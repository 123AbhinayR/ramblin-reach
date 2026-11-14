import { loadEnvFile } from "node:process";
import { readFile } from "node:fs/promises";
import pg from "pg";
import { z } from "zod";
loadEnvFile(".env.seed.local");
const env=z.object({APP_ENV:z.literal("local"),ALLOW_DEMO_SEED:z.literal("1"),DATABASE_URL:z.string()}).parse(process.env);
const url=new URL(env.DATABASE_URL);if(url.hostname!=="127.0.0.1"||url.port!=="54322")throw new Error("Local database required");
const sources=z.object({resources:z.array(z.object({slug:z.string(),title:z.string(),official_url:z.url(),summary:z.string(),student_action:z.string(),tags:z.array(z.string()),eligibility_note:z.string(),prerequisites:z.array(z.string())}))}).parse(JSON.parse(await readFile("data/seed_sources.json","utf8")));
const reviewed=["hive-electronics","invention-studio","create-x-i2p","career-center-networking","alumni-regional-networks"];
const db=new pg.Client({connectionString:env.DATABASE_URL});await db.connect();
try{await db.query("begin");for(const [index,slug] of reviewed.entries()){
 const source=sources.resources.find(r=>r.slug===slug);if(!source)throw new Error("Source missing");
 const official=new URL(source.official_url);if(official.protocol!=="https:")throw new Error("HTTPS required");
 const kind=slug.includes("career")?"career":slug.includes("regional")?"regional":slug.includes("create-x")?"program":"makerspace";
 await db.query(`insert into public.resources(slug,title,kind,short_description,student_action,official_url,official_domain,tags,eligible_audience,eligibility_caveat,prerequisite_tags,last_reviewed_at,source_status,display_priority)
 values($1,$2,$3,$4,$5,$6,$7,$8,'Check official eligibility guidance',$9,$10,'2026-11-14','reviewed',$11)
 on conflict(slug) do update set title=excluded.title,short_description=excluded.short_description,student_action=excluded.student_action,official_url=excluded.official_url,official_domain=excluded.official_domain,tags=excluded.tags,eligibility_caveat=excluded.eligibility_caveat,prerequisite_tags=excluded.prerequisite_tags,last_reviewed_at=excluded.last_reviewed_at,source_status=excluded.source_status`,[source.slug,source.title,kind,source.summary,source.student_action,source.official_url,official.hostname,source.tags,source.eligibility_note,source.prerequisites,index]);
}await db.query("commit");console.log("Seeded 5 reviewed official resource records; availability remains unknown.");}catch(error){await db.query("rollback");throw error;}finally{await db.end();}
