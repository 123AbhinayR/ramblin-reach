"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RequestRow, OutcomeRow } from "@/lib/requests/schemas";
import { labels, OUTCOME_TYPES } from "@/lib/domain/schemas";
import { Button } from "@/components/ui/button";

interface RequestCardProps {
  request: RequestRow;
  viewerId: string;
  peer: { id: string; display_name: string; is_demo: boolean } | undefined;
  outcome?: OutcomeRow;
}

const statusLabel: Record<string, string> = {
  pending: "Waiting for response",
  accepted: "Accepted",
  declined: "Declined",
  cancelled: "Cancelled",
  completed: "Completed",
};

const statusColor: Record<string, string> = {
  pending: "#665322",
  accepted: "#165b40",
  declined: "#b42318",
  cancelled: "#5c6879",
  completed: "#0d2746",
};

export function RequestCard({ request, viewerId, peer, outcome }: RequestCardProps) {
  const router = useRouter();
  const isSender = request.requester_id === viewerId;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOutcomeForm, setShowOutcomeForm] = useState(false);
  const [outcomeType, setOutcomeType] = useState<string>(outcome?.outcome_type ?? OUTCOME_TYPES[0]);
  const [privateNote, setPrivateNote] = useState(outcome?.private_note ?? "");
  const [learned,setLearned]=useState(outcome?.learned??""),[helped,setHelped]=useState(outcome?.helped??""),[nextStep,setNextStep]=useState(outcome?.next_step??""),[shared,setShared]=useState(outcome?.log_shared??false);
  const [savingOutcome, setSavingOutcome] = useState(false);
  const [localOutcome, setLocalOutcome] = useState<OutcomeRow | undefined>(outcome);

  async function transition(action: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/requests/${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Origin": window.location.origin },
        body: JSON.stringify({ action }),
      });
      const json = await res.json() as { error?: { message: string } };
      if (!res.ok) { setError(json.error?.message ?? "Action failed."); setLoading(false); return; }
      router.refresh();
    } catch {
      setError("Could not connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function saveOutcome(e: React.FormEvent) {
    e.preventDefault();
    setSavingOutcome(true);
    setError("");
    try {
      const method = localOutcome ? "PUT" : "POST";
      const res = await fetch(`/api/requests/${request.id}/outcomes`, {
        method,
        headers: { "Content-Type": "application/json", "Origin": window.location.origin },
        body: JSON.stringify({ outcomeType, privateNote: privateNote.trim() || undefined,learned,helped,next_step:nextStep,log_shared:shared,project_id:request.requester_id===viewerId?request.project_id:null }),
      });
      const json = await res.json() as { error?: { message: string }; outcome?: OutcomeRow };
      if (!res.ok) { setError(json.error?.message ?? "Could not save outcome."); setSavingOutcome(false); return; }
      setLocalOutcome(json.outcome);
      setShowOutcomeForm(false);
    } catch {
      setError("Could not connect.");
    } finally {
      setSavingOutcome(false);
    }
  }

  const peerName = peer?.display_name ?? "Unknown member";

  return (
    <article className="request-card">
      <div className="request-header">
        <div>
          <span className="request-direction">{isSender ? "Sent to" : "Received from"}</span>
          <strong className="request-peer"> {peerName}</strong>

        </div>
        <span className="request-status" style={{ color: statusColor[request.status] }}>
          {statusLabel[request.status] ?? request.status}
        </span>
      </div>

      <div className="request-meta">
        <span>{labels[request.help_topic as keyof typeof labels] ?? request.help_topic}</span>
        <span>·</span>
        <span>{labels[request.format as keyof typeof labels] ?? request.format}</span>
        <span>·</span>
        <span>{new Date(request.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
      </div>

      <div className="request-body">
        <p className="field-hint">Goal</p>
        <p>{request.goal_context}</p>
        <p className="field-hint" style={{ marginTop: 14 }}>Question</p>
        <p>{request.specific_question}</p>
        {request.prior_effort && (
          <>
            <p className="field-hint" style={{ marginTop: 14 }}>What they tried</p>
            <p>{request.prior_effort}</p>
          </>
        )}
      </div>

      {/* Action buttons based on role + status */}
      <div className="request-actions">
        {!isSender && request.status === "pending" && (
          <>
            <Button onClick={() => transition("accept")} disabled={loading}>Accept</Button>
            <Button onClick={() => transition("decline")} disabled={loading} style={{ background: "none", color: "var(--destructive)", border: "1px solid var(--destructive)" }}>Decline</Button>
          </>
        )}
        {isSender && request.status === "pending" && (
          <Button onClick={() => transition("cancel")} disabled={loading} style={{ background: "none", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}>Cancel</Button>
        )}
        {request.status === "accepted" && (
          <Button onClick={() => transition("complete")} disabled={loading}>Mark as Complete</Button>
        )}
        {request.status === "completed" && !localOutcome && (
          <button className="text-link" onClick={() => setShowOutcomeForm(!showOutcomeForm)}>
            {showOutcomeForm ? "Hide" : "Record outcome"}
          </button>
        )}
        {request.status === "completed" && localOutcome && (
          <button className="text-link" onClick={() => setShowOutcomeForm(!showOutcomeForm)}>
            {showOutcomeForm ? "Hide" : "Edit outcome"}
          </button>
        )}
      </div>

      {error && <p className="form-message" role="alert" style={{ marginTop: 10 }}>{error}</p>}

      {request.status === "completed" && localOutcome && !showOutcomeForm && (
        <div className="outcome-display">
          <p className="eyebrow">Outcome recorded · private</p>
          <p>{labels[localOutcome.outcome_type as keyof typeof labels] ?? localOutcome.outcome_type}</p>
          {localOutcome.private_note && <p className="muted">{localOutcome.private_note}</p>}
        </div>
      )}

      {showOutcomeForm && request.status === "completed" && (
        <form className="outcome-form form-stack" onSubmit={saveOutcome}>
          <p className="eyebrow">Record your outcome · private</p>
          <label>
            What happened?
            <select value={outcomeType} onChange={e => setOutcomeType(e.target.value)} required>
              {OUTCOME_TYPES.map(t => (
                <option key={t} value={t}>{labels[t as keyof typeof labels] ?? t}</option>
              ))}
            </select>
            <span className="field-hint">This is only visible to you and your counterpart.</span>
          </label>
          <label>
            Private note <span className="field-hint" style={{ display: "inline" }}>(optional)</span>
            <textarea
              value={privateNote}
              onChange={e => setPrivateNote(e.target.value)}
              maxLength={300}
              rows={3}
              placeholder="Notes for yourself — not shared publicly."
              aria-describedby="note-hint"
            />
            <span id="note-hint" className="field-hint">Max 300 characters. Never shown publicly.</span>
          </label>
          <h3>Learning Log</h3><p className="field-hint">Record your own experience. Keep names, contact details and private request notes out of shared text.</p>
          <label>What I learned<textarea maxLength={240} value={learned} onChange={e=>setLearned(e.target.value)}/></label>
          <label>What I helped with<textarea maxLength={240} value={helped} onChange={e=>setHelped(e.target.value)}/></label>
          <label>Next step<textarea maxLength={240} value={nextStep} onChange={e=>setNextStep(e.target.value)}/></label>
          <label className="check-label"><input type="checkbox" checked={shared} onChange={e=>setShared(e.target.checked)}/>I reviewed this text and choose to share these Learning Log fields on my visible profile{request.project_id&&request.requester_id===viewerId?' and project progress':''}.</label>
          {error && <p className="form-message" role="alert">{error}</p>}
          <Button type="submit" disabled={savingOutcome}>{savingOutcome ? "Saving…" : localOutcome ? "Update outcome" : "Save outcome"}</Button>
        </form>
      )}
    </article>
  );
}
