"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { ArrowRight, Hammer, BriefcaseBusiness, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { goalInputSchema, METROS, type GoalIntent } from "@/lib/domain/schemas";
export function GoalComposer() {
  const router=useRouter(); const [intent,setIntent]=useState<GoalIntent>("project"); const [goal,setGoal]=useState(""); const [busy,setBusy]=useState(false); const [error,setError]=useState("");
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form=new FormData(event.currentTarget); setError("");
    const parsed=goalInputSchema.safeParse({goalText:goal,intent,targetCompany:String(form.get("company")??"")||null,targetMetro:String(form.get("metro")??"")||null});
    if(!parsed.success){setError(parsed.error.issues[0].message);return;} setBusy(true);
    try { const response=await fetch("/api/goals",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(parsed.data)}); const body:unknown=await response.json();
      if(!response.ok){setError(z.object({error:z.object({message:z.string()})}).parse(body).error.message);return;}
      const saved=z.object({goal:z.object({id:z.uuid()})}).parse(body); router.push(`/path/${saved.goal.id}`);
    } catch {setError("Your path couldn’t be saved. Please try again.");} finally{setBusy(false);}
  }
  return <form onSubmit={submit} className="goal-composer"><div className="intent-options" role="group" aria-label="Goal type">{([{id:"project",label:"Build a project",icon:Hammer},{id:"career",label:"Explore a career",icon:BriefcaseBusiness},{id:"relocation",label:"Move to a city",icon:MapPin}] as const).map(item=><button type="button" key={item.id} aria-pressed={intent===item.id} onClick={()=>setIntent(item.id)}><item.icon size={18}/>{item.label}</button>)}</div><label className="composer-label" htmlFor="goal">What would you like to work on?</label><textarea id="goal" value={goal} onChange={event=>setGoal(event.target.value)} required minLength={10} maxLength={500} rows={4} placeholder="I want to build a low-cost environmental sensor, but I need electronics tools and project advice."/><p className="field-hint">Keep private or confidential details out of your goal.</p><div className="form-grid form-stack"><label>Company (optional)<input name="company" maxLength={100} placeholder="e.g. Microsoft"/></label><label>City (optional)<select name="metro"><option value="">Any city</option>{METROS.map(m=><option key={m}>{m}</option>)}</select></label></div><div className="composer-bottom"><button type="button" className="text-link" onClick={()=>{setGoal("I want to build a low-cost environmental sensor, but I need electronics tools and project advice.");setIntent("project");}}>Use the sensor example</button><Button disabled={busy} type="submit">{busy?"Building your path…":"Build my path"}<ArrowRight size={18}/></Button></div><p role="status" className="form-message">{error}</p></form>;
}
