"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { ArrowRight, Hammer, BriefcaseBusiness, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { CityCombobox } from "./city-combobox";
import { goalInputSchema, type GoalIntent } from "@/lib/domain/schemas";
import { GOAL_EXAMPLES, exampleById, type GoalExample } from "@/lib/path/examples";

export function GoalComposer({ initialExample }: { initialExample?: string }) {
  const router = useRouter();
  const preset = exampleById(initialExample);
  const [intent, setIntent] = useState<GoalIntent>(preset?.intent ?? "project");
  const [goal, setGoal] = useState(preset?.goalText ?? "");
  const [company, setCompany] = useState(preset?.targetCompany ?? "");
  const [metro, setMetro] = useState(preset?.targetMetro ?? "");
  const [selectedExample, setSelectedExample] = useState(preset?.id ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function applyExample(example: GoalExample) {
    setSelectedExample(example.id);
    setIntent(example.intent);
    setGoal(example.goalText);
    setCompany(example.targetCompany ?? "");
    setMetro(example.targetMetro ?? "");
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const parsed = goalInputSchema.safeParse({
      goalText: goal,
      intent,
      targetCompany: company || null,
      targetMetro: metro || null,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/goals", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
      const body: unknown = await response.json();
      if (!response.ok) {
        setError(z.object({ error: z.object({ message: z.string() }) }).parse(body).error.message);
        return;
      }
      const saved = z.object({ goal: z.object({ id: z.uuid() }) }).parse(body);
      router.push(`/path/${saved.goal.id}`);
    } catch {
      setError("Your path couldn’t be saved. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="goal-composer">
      <section className="goal-examples-panel" aria-label="Example goals">
        <h2>Try an example</h2>
        <p className="field-hint">These fill the form. They do not create a path until you choose Build my path.</p>
        <div className="example-chips">
          {GOAL_EXAMPLES.map(example => (
            <button
              type="button"
              key={example.id}
              className="example-chip"
              aria-pressed={selectedExample === example.id}
              onClick={() => applyExample(example)}
            >
              <strong>{example.title}</strong>
              <span>{example.summary}</span>
            </button>
          ))}
        </div>
      </section>
      <div className="intent-options" role="group" aria-label="Goal type">
        {([
          { id: "project", label: "Build a project", icon: Hammer },
          { id: "career", label: "Explore a career", icon: BriefcaseBusiness },
          { id: "relocation", label: "Move to a city", icon: MapPin },
        ] as const).map(item => (
          <button type="button" key={item.id} aria-pressed={intent === item.id} onClick={() => setIntent(item.id)}>
            <item.icon size={18} />{item.label}
          </button>
        ))}
      </div>
      <label className="composer-label" htmlFor="goal">What would you like to work on?</label>
      <textarea
        id="goal"
        value={goal}
        onChange={event => setGoal(event.target.value)}
        required
        minLength={10}
        maxLength={500}
        rows={4}
        placeholder="I want to build a low-cost environmental sensor, but I need electronics tools and project advice."
      />
      <p className="field-hint">Keep private or confidential details out of your goal.</p>
      <div className="form-grid form-stack">
        <label>Company (optional)
          <input name="company" maxLength={100} placeholder="e.g. Microsoft" value={company} onChange={event => setCompany(event.target.value)} />
        </label>
        <label htmlFor="goal-metro">City (optional)
          <CityCombobox id="goal-metro" name="metro" value={metro} onChange={setMetro} emptyLabel="Any city" />
        </label>
      </div>
      <div className="composer-bottom">
        <p className="field-hint">Official resources are linked with review dates. Access and hours are never assumed.</p>
        <Button disabled={busy} type="submit">{busy ? "Building your path…" : "Build my path"}<ArrowRight size={18} /></Button>
      </div>
      <p role="status" className="form-message">{error}</p>
    </form>
  );
}
