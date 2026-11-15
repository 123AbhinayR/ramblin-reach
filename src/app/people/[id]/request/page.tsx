import {projectDetail} from "@/lib/learning/data";
import {loadPath} from "@/lib/path/data";
import { notFound } from "next/navigation";
import { z } from "zod";
import { requireMember } from "@/lib/auth/guard";
import { candidatesFor } from "@/lib/matching/data";
import { ReachCardForm } from "@/components/reach-card-form";
import { WorkspaceNav } from "@/components/workspace-nav";
import Link from "next/link";
export const dynamic = "force-dynamic";

export default async function SendRequestPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { client, profile } = await requireMember();
  const idParsed = z.uuid().safeParse((await params).id);
  if (!idParsed.success) notFound();

  const sp = await searchParams;
  const goalId = z.uuid().safeParse(sp.goalId).success ? String(sp.goalId) : undefined;
  const ownedPath=goalId?await loadPath(client,goalId):null;
  const projectId=z.uuid().safeParse(sp.projectId);
  const project=projectId.success?await projectDetail(client,projectId.data):null;
  const ownedProject=project?.owner_id===profile.id?project:null;
  const preselectedTopic = typeof sp.topic === "string" ? sp.topic : undefined;

  const rawPerson = (await candidatesFor(client)).find(p => p.id === idParsed.data);
  if (!rawPerson) notFound();
  const available = !rawPerson.paused && rawPerson.used < rawPerson.monthly_cap && rawPerson.help_topics.length > 0;
  const remaining = Math.max(0, rawPerson.monthly_cap - rawPerson.used);
  const person = { ...rawPerson, available, remaining };

  if (person.id === profile.id) {
    return (
      <section className="container workspace">
        <WorkspaceNav />
        <div className="panel">
          <h1>That&rsquo;s you.</h1>
          <p className="muted">You can&rsquo;t send a request to yourself.</p>
          <Link className="text-link" href="/people">← Find someone else</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container workspace">
      <WorkspaceNav />
      <Link className="text-link" href={`/people/${person.id}${goalId ? `?goalId=${goalId}` : ""}`}>
        ← Back to {person.display_name}&rsquo;s profile
      </Link>
      <div className="reach-layout" style={{ marginTop: 24 }}>
        <div>
          <div style={{ marginBottom: 24 }}>
            <p className="eyebrow">QuickReach</p>
            <h1>Reach out to {person.display_name}.</h1>
            <p className="muted">Pick a reason, edit your message, and review before sending.</p>

            {!person.available && (
              <p className="notice">This member is not accepting new requests. Explore another helper or check back later.</p>
            )}
          </div>
          {person.available && <ReachCardForm
            recipientId={person.id}
            recipientName={person.display_name}
            recipientHelpTopics={person.help_topics}
            goalId={ownedPath?goalId:undefined}
            projectId={ownedProject?.id}
            initialQuestion={ownedProject?.requested_help||undefined}
            initialGoal={ownedProject?`${ownedProject.title}: ${ownedProject.current_challenge||ownedProject.summary}`:ownedPath?.goal.goal_text}
            preselectedTopic={preselectedTopic}
          />}
        </div>
        <aside className="workspace-aside">
          <p className="eyebrow">Make it count</p>
          <h2>One focused question gets the best answer.</h2>
          <ol>
            <li>
              <strong>Give context</strong>
              <p>Share your goal so they understand your situation.</p>
            </li>
            <li>
              <strong>Ask one specific thing</strong>
              <p>Not &ldquo;can you help me?&rdquo; — but the actual question you need answered.</p>
            </li>
            <li>
              <strong>Show you&rsquo;ve tried</strong>
              <p>Mention what you&rsquo;ve already attempted. It saves their time and yours.</p>
            </li>
          </ol>
          <p className="field-hint">{person.remaining} of {person.monthly_cap} request{person.monthly_cap === 1 ? "" : "s"} left this month.</p>
        </aside>
      </div>
    </section>
  );
}
