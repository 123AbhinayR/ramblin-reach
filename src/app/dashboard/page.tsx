import { SetupState } from "@/components/setup-state";
import { isConfigured } from "@/lib/env";
import { requireMember } from "@/lib/auth/guard";
import { SignOut } from "@/components/sign-out";
import Link from "next/link";
import { GoalComposer } from "@/components/goal-composer";
import { WorkspaceNav } from "@/components/workspace-nav";
import { goalSchema } from "@/lib/path/schemas";
import { z } from "zod";
import {loadInbox} from "@/lib/requests/data";
import {loadPath} from "@/lib/path/data";
import {DashboardConnections} from "@/components/dashboard-connections";
import {labels} from "@/lib/domain/schemas";
import {candidatesFor} from "@/lib/matching/data";
import {circlePosts,circleAuthors} from "@/lib/circles/data";
import {orderPosts,CIRCLES} from "@/lib/circles/schemas";
import {recentGoalHistory} from "@/lib/path/history";
export const dynamic = "force-dynamic";
export default async function DashboardPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (!isConfigured()) return <SetupState />;
  const { profile, client } = await requireMember();
  const example = (await searchParams).example;
  const { data, error } = await client.from("goals").select("id,goal_text,intent,target_company,target_metro,extracted_tags,created_at").order("created_at", { ascending: false }).limit(30);
  if (error) throw new Error("Your paths could not be loaded.");
  const goals = z.array(goalSchema).parse(data);
  const history = recentGoalHistory(goals);
  const alumni=profile.affiliation==="alumni";
  const discussions=await circlePosts(client);
  const authors=await circleAuthors(client,discussions.map(post=>post.owner_id));
  const questions=orderPosts(discussions.filter(post=>!post.resolved&&post.owner_id!==profile.id&&(!alumni||authors.some(author=>author.id===post.owner_id&&author.affiliation==="student"))),"","relevant",profile.skills).slice(0,2);
  const inbox=await loadInbox(client);
  const currentPath=goals[0]?await loadPath(client,goals[0].id):null;
  const next=currentPath?.pathSteps.find(step=>step.status!=="done");
  const memories=(await candidatesFor(client)).filter(person=>person.id!==profile.id).flatMap(person=>person.projects.map(project=>({...project,memberId:person.id}))).filter(project=>project.one_lesson).slice(0,2);
  return (
    <section className="container workspace">
      <WorkspaceNav />
      <div className="workspace-heading">
        <div>
          <p className="eyebrow">Georgia Tech · shared roots, new possibilities</p>
          <h1>{alumni?"A little experience goes a long way.":"What’s your next step?"}</h1>
          <p className="muted">{alumni?"Review a question, share what you know, and keep your commitment manageable.":"Start with a goal. Find the resources and people who can help you move it forward."}</p>
        </div>
        <SignOut />
      </div>
      {profile.is_demo && <p className="demo-strip">Demo account · fictional profile, real authenticated session</p>}
      <section className="home-circles"><div className="results-heading"><h2>{alumni?"Students you can help":"Questions needing answers"}</h2><Link className="text-link" href="/circles">Explore Circles →</Link></div>{questions.length?<div className="circle-grid">{questions.map(post=>{const overlap=post.tags.filter(tag=>profile.skills.some(skill=>skill.toLowerCase()===tag.toLowerCase()));return <article className="project-memory" key={post.id}><p className="eyebrow">{CIRCLES[post.category]}{authors.find(a=>a.id===post.owner_id)?.is_demo?" · DEMO DATA":""}</p><h3><Link href={`/circles/${post.id}`}>{post.title}</Link></h3><p>{post.specific_request}</p><p className="field-hint">{overlap.length?`Shared skills: ${overlap.join(", ")}`:"Recent open question"}</p><Link className="text-link" href={`/circles/${post.id}`}>Read and offer help →</Link></article>;})}</div>:<p className="muted">No open questions yet. <Link className="text-link" href="/circles/new">Share what you are working on →</Link></p>}</section>
      <div className="dashboard-grid">
        <div>
          {alumni?<><DashboardConnections inbox={inbox} viewerId={profile.id} alumni/><section className="panel recent-paths"><h2>How I can help</h2><p className="muted">{profile.paused?"Requests paused":profile.visible?"Profile visible to members":"Profile hidden"} · Up to {profile.monthly_cap} incoming requests per month</p><div className="tag-list">{profile.help_topics.map(topic=><span key={topic}>{labels[topic]}</span>)}</div><Link className="text-link" href="/profile">Edit topics, availability and experience →</Link></section><details className="recent-paths"><summary className="text-link">Start a learning goal of your own</summary><GoalComposer initialExample={typeof example==="string"?example:undefined}/></details></>:<>{next&&<section className="next-action"><p className="eyebrow">My next step</p><h2>{next.title}</h2><p>{next.description}</p><Link className="text-link" href={`/path/${currentPath!.goal.id}`}>Continue your path →</Link></section>}<GoalComposer initialExample={typeof example === "string" ? example : undefined} /><DashboardConnections inbox={inbox} viewerId={profile.id} alumni={false}/></>}
          <section className="recent-paths">
            <h2>Pick up where you left off</h2>
            {history.length ? history.map(({goal,saves}) => (
              <Link className="recent-path saved-path" href={`/path/${goal.id}`} key={goal.id}>
                <span className="saved-path-copy"><span className="saved-path-title">{goal.goal_text}</span><span className="saved-path-meta">{goal.intent==="project"?"Project":goal.intent==="career"?"Career":"Relocation"} · Saved {new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",timeZone:"America/New_York"}).format(new Date(goal.created_at))}{saves>1?` · ${saves} recent saves · opens latest`:""}</span></span>
                <span aria-hidden="true">↗</span>
              </Link>
            )) : <p className="muted">Your saved paths will appear here. Start with a question you want to make progress on.</p>}
          </section>
          <section className="recent-paths"><h2>{alumni?"Experience worth passing on":"Learn from others"}</h2>{memories.map(project=><article className="project-memory" key={project.id}><p className="eyebrow">{project.is_demo?"Demo project lesson":"Shared project lesson"}</p><h3>{project.title}</h3><p>{project.one_lesson}</p><Link className="text-link" href={`/people/${project.memberId}`}>Read the project and offered help →</Link></article>)}{!memories.length&&<p className="muted">Opt-in project lessons will appear here as members share their experience.</p>}<Link className="text-link" href="/people">Explore people and project experience →</Link></section>
        </div>
        <aside className="workspace-aside">
          <p className="eyebrow">From an idea to a next step</p>
          <h2>You don’t have to figure it out alone.</h2>
          <ol>
            <li><strong>Find a starting point</strong><p>A short JacketPath with links to official campus resources.</p></li>
            <li><strong>Learn from experience</strong><p>JacketMatch shows students or alumni who offer the kind of help you need.</p></li>
            <li><strong>Ask with a ReachCard</strong><p>One focused question, then record what you learned.</p></li>
          </ol>
          <Link className="text-link" href="/profile">Set up your profile →</Link>
        </aside>
      </div>
    </section>
  );
}
