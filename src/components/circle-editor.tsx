"use client";
import {useState,type FormEvent} from "react";
import {useRouter} from "next/navigation";
import {z} from "zod";
import {Button} from "./ui/button";
import {CIRCLES,POST_TYPES,postInputSchema,type CirclePost} from "@/lib/circles/schemas";
export function CircleEditor({post,category="projects",projects=[],initialProjectId}:{post?:CirclePost;category?:string;projects?:{id:string;title:string}[];initialProjectId?:string}){
 const router=useRouter();const [busy,setBusy]=useState(false);const [message,setMessage]=useState("");
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();const form=new FormData(event.currentTarget);const parsed=postInputSchema.safeParse({
   project_id:form.has("project_id")?(form.get("project_id")||null):(post?.project_id??null),title:form.get("title"),category:form.get("category"),kind:form.get("kind"),description:form.get("description"),specific_request:form.get("specific_request"),
   tags:String(form.get("tags")??"").split(",").map(t=>t.trim()).filter(Boolean),project_url:form.get("project_url")||null,github_url:form.get("github_url")||null,team_size:form.get("team_size")?Number(form.get("team_size")):null,
  });
  if(!parsed.success){setMessage(parsed.error.issues[0].message);return;}setBusy(true);setMessage("");
  try{const response=await fetch(post?`/api/circles/${post.id}`:"/api/circles",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(post?{action:"edit",post:parsed.data}:parsed.data)});const body:unknown=await response.json();
   if(!response.ok){setMessage(z.object({error:z.object({message:z.string()})}).parse(body).error.message);return;}
   const saved=z.object({post:z.object({id:z.uuid()})}).parse(body);router.push(`/circles/${saved.post.id}`);router.refresh();setMessage("Discussion saved.");
  }catch{setMessage("Could not save. Try again.");}finally{setBusy(false);}
 }
 return <form className="form-stack panel" onSubmit={submit}>
  <p className="field-hint">Shared with verified members. Include only information you have permission to share; no private contact details.</p>
  {projects.length>0&&<label>Linked project<select name="project_id" defaultValue={post?.project_id??initialProjectId??""}><option value="">No linked project</option>{projects.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}</select></label>}
  <label>Title<input name="title" required minLength={3} maxLength={100} defaultValue={post?.title} placeholder="What are you working on?"/></label>
  <div className="form-grid"><label>Circle<select name="category" defaultValue={post?.category??category}>{Object.entries(CIRCLES).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label><label>Post type<select name="kind" defaultValue={post?.kind??"help"}>{Object.entries(POST_TYPES).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label></div>
  <label>Description<textarea name="description" required minLength={10} maxLength={2000} rows={4} defaultValue={post?.description}/></label>
  <label>Specific request<textarea name="specific_request" required minLength={10} maxLength={400} rows={2} defaultValue={post?.specific_request} placeholder="What would help you take the next step?"/></label>
  <details><summary className="text-link">Add tags, links or team size (optional)</summary><div className="form-stack">
   <label>Skills / tags<input name="tags" maxLength={327} defaultValue={post?.tags.join(", ")} placeholder="sensor, electronics (up to 8)"/></label>
   <label>Public project URL<input name="project_url" type="url" maxLength={500} defaultValue={post?.project_url??""}/></label>
   <label>GitHub URL<input name="github_url" type="url" maxLength={500} defaultValue={post?.github_url??""}/></label>
   <label>Team size<input name="team_size" type="number" min={1} max={100} defaultValue={post?.team_size??""}/></label>
  </div></details>
  <p role="status">{message}</p><Button disabled={busy}>{busy?"Saving…":post?"Save changes":"Publish discussion"}</Button>
 </form>;
}
