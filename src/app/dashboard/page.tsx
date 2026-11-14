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
export const dynamic = "force-dynamic";
export default async function DashboardPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (!isConfigured()) return <SetupState />;
  const { profile, client } = await requireMember();
  const example = (await searchParams).example;
  const { data, error } = await client.from("goals").select("id,goal_text,intent,target_company,target_metro,extracted_tags,created_at").order("created_at", { ascending: false }).limit(6);
  if (error) throw new Error("Your paths could not be loaded.");
  const goals = z.array(goalSchema).parse(data);
  const alumni=profile.affiliation==="alumni";
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
      <div className="dashboard-grid">
        <div>
          {alumni?<><DashboardConnections inbox={inbox} viewerId={profile.id} alumni/><section className="panel recent-paths"><h2>How I can help</h2><p className="muted">{profile.paused?"Requests paused":profile.visible?"Profile visible to members":"Profile hidden"} · Up to {profile.monthly_cap} incoming requests per month</p><div className="tag-list">{profile.help_topics.map(topic=><span key={topic}>{labels[topic]}</span>)}</div><Link className="text-link" href="/profile">Edit topics, availability and experience →</Link></section><details className="recent-paths"><summary className="text-link">Start a learning goal of your own</summary><GoalComposer initialExample={typeof example==="string"?example:undefined}/></details></>:<>{next&&<section className="next-action"><p className="eyebrow">My next step</p><h2>{next.title}</h2><p>{next.description}</p><Link className="text-link" href={`/path/${currentPath!.goal.id}`}>Continue your path →</Link></section>}<GoalComposer initialExample={typeof example === "string" ? example : undefined} /><DashboardConnections inbox={inbox} viewerId={profile.id} alumni={false}/></>}
          <section className="recent-paths">
            <h2>Pick up where you left off</h2>
            {goals.length ? goals.map(goal => (
              <Link className="recent-path" href={`/path/${goal.id}`} key={goal.id}>
                <span>{goal.goal_text}</span>
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
