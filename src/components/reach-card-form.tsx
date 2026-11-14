"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FORMATS, HELP_TOPICS, labels } from "@/lib/domain/schemas";
import { evaluateReachReady } from "@/lib/requests/coaching";
import { Button } from "@/components/ui/button";

interface Props {
  recipientId: string;
  recipientName: string;
  recipientHelpTopics: string[];
  goalId?: string;
  preselectedTopic?: string;
}

function randomUUID() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (Number(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))).toString(16)
  );
}

const CHAR_LIMITS = { goalContext: 240, specificQuestion: 400, priorEffort: 300 };

export function ReachCardForm({ recipientId, recipientName, recipientHelpTopics, goalId, preselectedTopic }: Props) {
  const router = useRouter();
  const idempotencyKey = useRef(randomUUID());

  const availableTopics = HELP_TOPICS.filter(t => recipientHelpTopics.includes(t));
  const defaultTopic = preselectedTopic && availableTopics.includes(preselectedTopic as typeof HELP_TOPICS[number])
    ? preselectedTopic
    : availableTopics[0] ?? HELP_TOPICS[0];

  const [helpTopic, setHelpTopic] = useState(defaultTopic);
  const [format, setFormat] = useState<string>("written_advice");
  const [goalContext, setGoalContext] = useState("");
  const [specificQuestion, setSpecificQuestion] = useState("");
  const [priorEffort, setPriorEffort] = useState("");
  const [safeProjectUrl, setSafeProjectUrl] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const { hints, warnings, isReady } = evaluateReachReady({
    goalContext,
    specificQuestion,
    priorEffort,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Origin": window.location.origin },
        body: JSON.stringify({
          recipientId,
          goalId,
          helpTopic,
          format,
          goalContext: goalContext.trim(),
          specificQuestion: specificQuestion.trim(),
          priorEffort: priorEffort.trim() || undefined,
          safeProjectUrl: safeProjectUrl.trim() || undefined,
          idempotencyKey: idempotencyKey.current,
        }),
      });
      const json = await res.json() as { error?: { code: string; message: string } };
      if (!res.ok) {
        setError(json.error?.message ?? "Something went wrong. Please try again.");
        setSending(false);
        return;
      }
      setSent(true);
      setTimeout(() => router.push("/requests"), 1800);
    } catch {
      setError("Could not connect to the server. Please check your connection.");
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="panel reach-sent" role="status">
        <p className="eyebrow">ReachCard sent</p>
        <h2>Your request is on its way to {recipientName}.</h2>
        <p className="muted">You&apos;ll see it in your inbox. They&apos;ll be notified and can accept or decline.</p>
        <p className="field-hint">Redirecting to your requests…</p>
      </div>
    );
  }

  return (
    <form className="reach-card-form form-stack" onSubmit={handleSubmit} aria-label="Send a ReachCard">
      <div className="reach-recipient">
        <p className="eyebrow">ReachCard for</p>
        <p className="reach-name">{recipientName}</p>
        <p className="field-hint">They&apos;ll see your question, topic, and format preference. Private request text is only visible to both of you.</p>
      </div>

      <label htmlFor="helpTopic">
        Help topic
        <select id="helpTopic" value={helpTopic} onChange={e => setHelpTopic(e.target.value)} required>
          {availableTopics.map(t => (
            <option key={t} value={t}>{labels[t as keyof typeof labels] ?? t}</option>
          ))}
        </select>
        <span className="field-hint">Choose the topic that best matches what you need.</span>
      </label>

      <label htmlFor="goalContext">
        What I&rsquo;m trying to achieve
        <textarea
          id="goalContext"
          value={goalContext}
          onChange={e => setGoalContext(e.target.value)}
          maxLength={CHAR_LIMITS.goalContext}
          minLength={10}
          rows={3}
          required
          placeholder="e.g. I'm building an environmental sensor for a class project and want to understand sensor calibration."
          aria-describedby="goal-hint goal-count"
        />
        <span id="goal-hint" className="field-hint">10–240 characters.</span>
        <span id="goal-count" className="field-hint" aria-live="polite">{goalContext.length}/{CHAR_LIMITS.goalContext}</span>
      </label>

      <label htmlFor="specificQuestion">
        My specific question
        <textarea
          id="specificQuestion"
          value={specificQuestion}
          onChange={e => setSpecificQuestion(e.target.value)}
          maxLength={CHAR_LIMITS.specificQuestion}
          minLength={20}
          rows={4}
          required
          placeholder="e.g. How do you test sensor calibration accuracy before designing the enclosure?"
          aria-describedby="question-hint question-count"
        />
        <span id="question-hint" className="field-hint">20–400 characters. One clear, specific question works best.</span>
        <span id="question-count" className="field-hint" aria-live="polite">{specificQuestion.length}/{CHAR_LIMITS.specificQuestion}</span>
      </label>

      <label htmlFor="priorEffort">
        What I&rsquo;ve already tried <span className="field-hint" style={{ display: "inline" }}>(optional)</span>
        <textarea
          id="priorEffort"
          value={priorEffort}
          onChange={e => setPriorEffort(e.target.value)}
          maxLength={CHAR_LIMITS.priorEffort}
          rows={2}
          placeholder="e.g. I read the datasheet and ran basic analog reads, but the values drift significantly."
          aria-describedby="effort-hint"
        />
        <span id="effort-hint" className="field-hint">Sharing this helps the helper give more relevant advice.</span>
      </label>

      <label htmlFor="safeProjectUrl">
        Relevant project link <span className="field-hint" style={{ display: "inline" }}>(optional)</span>
        <input
          id="safeProjectUrl"
          type="url"
          value={safeProjectUrl}
          onChange={e => setSafeProjectUrl(e.target.value)}
          maxLength={500}
          placeholder="https://github.com/..."
          aria-describedby="url-hint"
        />
        <span id="url-hint" className="field-hint">Public HTTPS URL to relevant code or docs. Never private credentials.</span>
      </label>

      <fieldset>
        <legend>Preferred format</legend>
        {FORMATS.map(f => (
          <label key={f} className="check-label">
            <input
              type="radio"
              name="format"
              value={f}
              checked={format === f}
              onChange={() => setFormat(f)}
            />
            {labels[f as keyof typeof labels] ?? f}
          </label>
        ))}
      </fieldset>

      {(hints.length > 0 || warnings.length > 0) && (
        <div className="reach-coaching" role="note" aria-label="ReachReady suggestions">
          <p className="eyebrow">ReachReady · a clearer question gets better answers</p>
          {warnings.length > 0 && (
            <ul className="reach-warnings" style={{ color: "#8a5814", marginBottom: hints.length ? 8 : 0 }}>
              {warnings.map(w => <li key={w}><strong>Heads up:</strong> {w}</li>)}
            </ul>
          )}
          {hints.length > 0 && (
            <ul>
              {hints.map(h => <li key={h}>{h}</li>)}
            </ul>
          )}
          <p className="field-hint">These are suggestions, not blockers. You can send when you&apos;re ready.</p>
        </div>
      )}

      {error && <p className="form-message" role="alert">{error}</p>}

      <div className="reach-actions">
        <Button type="submit" disabled={sending} aria-busy={sending}>
          {sending ? "Sending…" : "Send ReachCard"}
        </Button>
        {isReady && <span className="reach-ready-badge">✓ ReachReady</span>}
      </div>
    </form>
  );
}
