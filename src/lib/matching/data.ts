import "server-only";
import {z} from "zod";
import type {authClient} from "@/lib/auth/server";
import {PROFILE_COLUMNS,profileSchema} from "@/lib/auth/schemas";
import {getServerEnv} from "@/lib/env";
import {candidateSchema,projectSchema} from "./schemas";
export async function candidatesFor(client:Awaited<ReturnType<typeof authClient>>){
 const {data,error}=await client.from("profiles").select(PROFILE_COLUMNS).eq("visible",true).order("id").limit(200);
 if(error)throw new Error("Members could not be loaded.");const env=getServerEnv();const profiles=z.array(profileSchema).parse(data).filter(p=>!p.is_demo||(env.DEMO_MODE==="1"&&env.APP_ENV!=="production"));
 if(!profiles.length)return [];
 const ids=profiles.map(p=>p.id);const {data:projects,error:projectError}=await client.from("member_projects").select("id,owner_id,title,summary,skills,resource_tags,one_lesson,visibility,is_demo").in("owner_id",ids).eq("visibility","members").limit(600);
 if(projectError)throw new Error("Projects could not be loaded.");const memories=z.array(projectSchema).parse(projects);
 const counts:{id:string;used:number}[]=[];
 for(let offset=0;offset<ids.length;offset+=30){const {data:capacity,error}=await client.rpc("member_capacity",{p_ids:ids.slice(offset,offset+30)});if(error)throw new Error("Availability could not be checked.");counts.push(...z.array(z.object({id:z.uuid(),used:z.number().int()})).parse(capacity));}
 return profiles.filter(p=>counts.some(c=>c.id===p.id)).map(p=>candidateSchema.parse({...p,used:counts.find(c=>c.id===p.id)?.used,projects:memories.filter(m=>m.owner_id===p.id)}));
}
