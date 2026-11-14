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
            <p className="eyebrow">ReachCard</p>
            <h1>Ask {person.display_name}.</h1>
            {person.is_demo && <p className="notice">Demo profile · fictional person. This request is for demonstration purposes.</p>}
            {!person.available && (
              <p className="notice">This person is at capacity this month ({person.remaining} of {person.monthly_cap} remaining). They may still respond.</p>
            )}
          </div>
          <ReachCardForm
            recipientId={person.id}
            recipientName={person.display_name}
            recipientHelpTopics={person.help_topics}
            goalId={goalId}
            preselectedTopic={preselectedTopic}
          />
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
