import {ActivityTime} from "@/components/activity-time";
import {avatarColor} from "@/lib/matching/avatar";
import Link from "next/link";
import {Code,FlaskConical,Lightbulb,Rocket,Users,BriefcaseBusiness} from "lucide-react";
import {z} from "zod";
import {requireMember} from "@/lib/auth/guard";
import {WorkspaceNav} from "@/components/workspace-nav";
import {Button} from "@/components/ui/button";
import {CIRCLES,POST_TYPES,categorySchema,orderPosts} from "@/lib/circles/schemas";
import {circlePosts,circleAuthors} from "@/lib/circles/data";
export const dynamic="force-dynamic";
const icons={hackathons:Code,startups:Rocket,projects:Lightbulb,research:FlaskConical,clubs:Users,careers:BriefcaseBusiness};
export default async function CirclesPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const {client,profile}=await requireMember();const query=z.object({category:categorySchema.optional(),sort:z.enum(["recent","relevant"]).default("recent")}).safeParse(await searchParams);
 const filters=query.success?query.data:{category:undefined,sort:"recent" as const};const posts=orderPosts(await circlePosts(client,filters.category),filters.category??"",filters.sort,profile.skills);const authors=await circleAuthors(client,posts.map(p=>p.owner_id));
 return <section className="container workspace"><WorkspaceNav/><div className="workspace-heading"><div><p className="eyebrow">Georgia Tech student and alumni network</p><h1>Circles</h1><p className="muted">Ask for help, offer help, and share what you’re building. Students and alumni answer here.</p></div><Button asChild><Link href={`/circles/new${filters.category?`?category=${filters.category}`:""}`}>Start a discussion</Link></Button></div>
 {!query.success&&<p role="alert">Choose a valid circle or sort option.</p>}
 <nav className="circle-tabs" aria-label="Circles"><Link href="/circles" aria-current={!filters.category?"page":undefined}>All circles</Link>{Object.entries(CIRCLES).map(([id,label])=>{const Icon=icons[id as keyof typeof icons];return <Link key={id} href={`/circles?category=${id}`} aria-current={filters.category===id?"page":undefined}><Icon size={17} aria-hidden="true"/>{label}</Link>;})}</nav>
 <form className="circle-sort">{filters.category&&<input type="hidden" name="category" value={filters.category}/>}<label>Sort <select name="sort" defaultValue={filters.sort}><option value="recent">Recent</option><option value="relevant">Shared skills</option></select></label><Button variant="outline">Apply</Button></form>
 <p className="field-hint">Showing up to 60 recent discussions. Shared skills sorts this selection using your profile tags.</p>
 <div className="circle-grid">{posts.map(post=>{const author=authors.find(a=>a.id===post.owner_id);return <article className="panel circle-card" key={post.id}><p className="eyebrow">{CIRCLES[post.category]} · {POST_TYPES[post.kind]}</p><h2><Link href={`/circles/${post.id}`}>{post.title}</Link></h2><p>{post.specific_request}</p><div className="tag-list">{post.tags.map(tag=><span key={tag}>{tag}</span>)}</div><p className="field-hint"><span className="activity-avatar" aria-hidden="true" style={avatarColor(author?.display_name??"Member")}>{(author?.display_name??"Member").split(" ").map(n=>n[0]).slice(0,2).join("")}</span>{author?.display_name??"Member"} · {author?.affiliation==="alumni"?"Alumni":"Student"} · {post.resolved?"Resolved":"Open question"} · <ActivityTime at={post.created_at} asOf={new Date().toISOString()}/></p><Link className="text-link" href={`/circles/${post.id}`}>Read and offer help →</Link>{author&&post.owner_id!==profile.id&&<p><Link className="text-link" href={`/people/${author.id}/request`}>Reach out</Link></p>}</article>;})}</div>
 {!posts.length&&<div className="panel"><h2>No posts here yet.</h2><p>Start with what you’re working on.</p><Link className="text-link" href="/circles/new">Start a discussion →</Link></div>}
 </section>;
}
