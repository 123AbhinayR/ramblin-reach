import { SetupState } from "@/components/setup-state";
import { isConfigured } from "@/lib/env";
import { requireMember } from "@/lib/auth/guard";
import { SignOut } from "@/components/sign-out";
import Link from "next/link";
import { GoalComposer } from "@/components/goal-composer";
import { WorkspaceNav } from "@/components/workspace-nav";
import { goalSchema } from "@/lib/path/schemas";
import { z } from "zod";
export const dynamic = "force-dynamic";
export default async function DashboardPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (!isConfigured()) return <SetupState />;
  const { profile, client } = await requireMember();
  const example = (await searchParams).example;
  const { data, error } = await client.from("goals").select("id,goal_text,intent,target_company,target_metro,extracted_tags,created_at").order("created_at", { ascending: false }).limit(6);
  if (error) throw new Error("Your paths could not be loaded.");
  const goals = z.array(goalSchema).parse(data);
  return (
    <section className="container workspace">
      <WorkspaceNav />
      <div className="workspace-heading">
        <div>
          <p className="eyebrow">Georgia Tech · shared roots, new possibilities</p>
          <h1>What’s your next step?</h1>
          <p className="muted">Start with a goal. Find the resources and people who can help you move it forward.</p>
        </div>
        <SignOut />
      </div>
      {profile.is_demo && <p className="demo-strip">Demo account · fictional profile, real authenticated session</p>}
      <div className="dashboard-grid">
        <div>
          <GoalComposer initialExample={typeof example === "string" ? example : undefined} />
          <section className="recent-paths">
            <h2>Pick up where you left off</h2>
            {goals.length ? goals.map(goal => (
              <Link className="recent-path" href={`/path/${goal.id}`} key={goal.id}>
                <span>{goal.goal_text}</span>
                <span aria-hidden="true">↗</span>
              </Link>
            )) : <p className="muted">Your saved paths will appear here. Start with a question you want to make progress on.</p>}
          </section>
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
