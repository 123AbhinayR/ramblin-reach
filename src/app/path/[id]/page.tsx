import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { requireMember } from "@/lib/auth/guard";
import { loadPath } from "@/lib/path/data";
import { PathChecklist } from "@/components/path-checklist";
import { WorkspaceNav } from "@/components/workspace-nav";
import {candidatesFor} from "@/lib/matching/data";
import {filtersSchema} from "@/lib/matching/schemas";
import {rankMatches} from "@/lib/matching/rank";
import {PersonCard} from "@/components/person-card";
export const dynamic="force-dynamic";
export default async function PathPage({params}:{params:Promise<{id:string}>}){
  const {client,profile}=await requireMember();const id=z.uuid().safeParse((await params).id);if(!id.success)notFound();const path=await loadPath(client,id.data);if(!path)notFound();
  const filters=filtersSchema.parse({intent:path.goal.intent,skills:path.goal.intent==="project"?path.goal.extracted_tags.join(","):"",company:path.goal.target_company??"",metro:path.goal.target_metro??"",topic:path.goal.intent==="project"?"project_guidance":path.goal.intent==="relocation"?"relocation_advice":"company_insight"});
  const people=rankMatches(await candidatesFor(client),filters,profile.id).slice(0,2);
  const done=path.pathSteps.filter(s=>s.status==="done").length;
  return <section className="container workspace"><WorkspaceNav/><Link href="/dashboard" className="text-link">← All your paths</Link><div className="path-heading"><p className="eyebrow">JacketPath</p><h1>{path.goal.goal_text}</h1><p className="muted">{done} of {path.pathSteps.length} steps complete · Your progress is saved.</p><progress value={done} max={path.pathSteps.length} aria-label="Path progress"/></div><div className="path-layout"><PathChecklist steps={path.pathSteps}/></div><section className="recent-paths"><p className="eyebrow">JacketMatch · the next conversation</p><h2>People who can help</h2>{people.length?<div className="people-grid">{people.map(person=><PersonCard key={person.id} person={person} goalId={path.goal.id}/>)}</div>:<p className="muted">No available volunteers match this goal right now. Try broader filters.</p>}<Link className="text-link" href={`/people?goalId=${path.goal.id}&skills=${encodeURIComponent(filters.skills)}&topic=${filters.topic}`}>Explore more Jackets →</Link></section></section>;
}
