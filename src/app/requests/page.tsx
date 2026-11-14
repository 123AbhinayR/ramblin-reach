import { requireMember } from "@/lib/auth/guard";
import { loadInbox } from "@/lib/requests/data";
import { WorkspaceNav } from "@/components/workspace-nav";
import { RequestCard } from "@/components/request-card";
import Link from "next/link";
export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const { client, profile } = await requireMember();
  const { rows, profiles, outcomes } = await loadInbox(client);

  const received = rows.filter(r => r.recipient_id === profile.id);
  const sent = rows.filter(r => r.requester_id === profile.id);

  function peer(r: typeof rows[number]) {
    const peerId = r.requester_id === profile.id ? r.recipient_id : r.requester_id;
    return profiles.find(p => p.id === peerId);
  }

  return (
    <section className="container workspace">
      <WorkspaceNav />
      <div className="workspace-heading">
        <div>
          <p className="eyebrow">ReachCard</p>
          <h1>Your requests.</h1>
          <p className="muted">Sent and received — only visible to you and your counterpart.</p>
        </div>
      </div>

      {profile.is_demo && (
        <p className="demo-strip">Demo account · requests shown are simulated demo data</p>
      )}

      {/* Received */}
      <section className="inbox-section">
        <div className="inbox-heading">
          <h2>Received</h2>
          {received.filter(r => r.status === "pending").length > 0 && (
            <span className="inbox-badge">{received.filter(r => r.status === "pending").length} pending</span>
          )}
        </div>
        {received.length ? (
          <div className="request-list">
            {received.map(r => (
              <RequestCard
                key={r.id}
                request={r}
                viewerId={profile.id}
                peer={peer(r)}
                outcome={outcomes.find(o => o.request_id === r.id && o.reported_by === profile.id)}
              />
            ))}
          </div>
        ) : (
          <div className="panel">
            <p className="eyebrow">Empty</p>
            <h2>No requests received yet.</h2>
            <p className="muted">When someone sends you a ReachCard, it&apos;ll appear here.</p>
            <Link className="text-link" href="/profile">Set your availability →</Link>
          </div>
        )}
      </section>

      {/* Sent */}
      <section className="inbox-section">
        <div className="inbox-heading">
          <h2>Sent</h2>
        </div>
        {sent.length ? (
          <div className="request-list">
            {sent.map(r => (
              <RequestCard
                key={r.id}
                request={r}
                viewerId={profile.id}
                peer={peer(r)}
                outcome={outcomes.find(o => o.request_id === r.id && o.reported_by === profile.id)}
              />
            ))}
          </div>
        ) : (
          <div className="panel">
            <p className="eyebrow">Empty</p>
            <h2>No requests sent yet.</h2>
            <p className="muted">Find a Jacket on the people page and send your first ReachCard.</p>
            <Link className="text-link" href="/people">Find someone who gets it →</Link>
          </div>
        )}
      </section>
    </section>
  );
}
