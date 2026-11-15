import {LearningLog} from "@/components/learning-log";
import {sharedLog} from "@/lib/learning/data";
import Link from "next/link";
import {notFound} from "next/navigation";
import {z} from "zod";
import {requireMember} from "@/lib/auth/guard";
import {candidatesFor} from "@/lib/matching/data";
import {filtersSchema} from "@/lib/matching/schemas";
import {rankMatches} from "@/lib/matching/rank";
import {labels} from "@/lib/domain/schemas";
import {WorkspaceNav} from "@/components/workspace-nav";
import {Button} from "@/components/ui/button";
export const dynamic="force-dynamic";
export default async function PersonPage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const {client,profile}=await requireMember();const id=z.uuid().safeParse((await params).id);if(!id.success)notFound();
 const sp=await searchParams;const goalId=z.uuid().safeParse(sp.goalId).success?String(sp.goalId):undefined;
 const person=rankMatches(await candidatesFor(client),filtersSchema.parse({availableOnly:"false"}),profile.id).find(p=>p.id===id.data);if(!person)notFound();
 const isSelf=person.id===profile.id;
 const requestHref=`/people/${person.id}/request${goalId?`?goalId=${goalId}`:""}`;
 return <section className="container workspace"><WorkspaceNav/><Link className="text-link" href="/people">← Find Jackets</Link><div className="profile-layout" style={{marginTop:24}}><article className="panel"><p className="eyebrow">{person.affiliation==="alumni"?"Georgia Tech alum":"Georgia Tech student"}</p><h1>{person.display_name}</h1>{person.is_demo&&<p className="notice">Demo profile · fictional person and experience</p>}<p>{[person.role_title,person.company_name,person.metro].filter(Boolean).join(" · ")}</p>{person.company_name&&<p className="field-hint">Employer self-reported. Company experience does not imply a referral.</p>}{person.bio&&<p className="profile-bio">{person.bio}</p>}<div className="tag-list">{person.skills.map(skill=><span key={skill}>{skill}</span>)}</div><h2 className="subheading">Learning Exchange</h2>{person.built_at_tech&&<p>Built at Tech: {person.built_at_tech.title} ({person.built_at_tech.year}){person.built_at_tech.lab?` · ${person.built_at_tech.lab}`:""} · self-reported</p>}<p>Can teach: {person.can_teach.join(", ")||"No tags shared"}</p><p>Want to learn: {person.want_learn.join(", ")||"No tags shared"}</p><h2 className="subheading">What I can help with</h2><ul className="help-list">{person.help_topics.map(t=><li key={t}>{labels[t as keyof typeof labels]??t}</li>)}</ul><h2 className="subheading">What I&apos;ve learned by doing</h2>{person.projects.length?person.projects.map(project=><article className="project-memory" key={project.id}><p className="eyebrow">{project.is_demo?"Demo project":"Member project"}</p><h3><Link href={`/projects/${project.id}`}>{project.title}</Link></h3><p>{project.summary}</p>{project.one_lesson&&<blockquote><span>A lesson to pass on</span>{project.one_lesson}</blockquote>}<div className="tag-list">{project.skills.map(skill=><span key={skill}>{skill}</span>)}</div></article>):<p className="muted">No shared projects yet. Their offered help topics are listed above.</p>}<LearningLog entries={await sharedLog(client,person.id,null)}/></article><aside className="workspace-aside"><p className="eyebrow">A thoughtful first step</p><h2>{!person.paused&&person.used<person.monthly_cap?"Open to requests":"Taking a pause"}</h2><p className="profile-bio">{Math.max(0,person.monthly_cap-person.used)} of {person.monthly_cap} incoming requests left this month.</p><p className="field-hint">Read their project lessons and choose one question that fits the help they offer.</p>{!isSelf&&person.available&&<div style={{marginTop:24}}><Button asChild style={{width:"100%"}}><Link href={requestHref}>Connect</Link></Button></div>}{!isSelf&&person.paused&&<p className="field-hint" style={{marginTop:12}}>Not accepting new requests right now.</p>}</aside></div></section>;
}
