import type { parseGoal } from "@/lib/intent/parse";
import type { Resource } from "./schemas";
export type DraftStep = { key: string; kind: "action" | "resource" | "find_person"; title: string; description: string; reason: string; resourceId?: string };
export function buildPath(goal: ReturnType<typeof parseGoal>, catalog: Resource[], options: { asOf: string }) {
  const steps: DraftStep[] = [{ key: "define-requirements", kind: "action", title: goal.intent === "project" ? "Define what you’ll build" : goal.intent === "career" ? "Choose what you want to learn about the role" : "Write down your questions about the move", description: goal.intent === "project" ? "Write down what you want to measure, your budget, and how you’ll test a first version." : "Pick one decision you need to make and the information that would help.", reason: "A clear starting point makes the next conversation more useful." }];
  const selected = goal.intent === "career" ? ["career-center-networking"] : goal.intent === "relocation" ? ["alumni-regional-networks"] : goal.tags.some(t => t === "sensor" || t === "electronics") ? ["hive-electronics", "invention-studio"] : goal.tags.includes("fabrication") ? ["invention-studio"] : [];
  if (goal.intent === "project" && goal.tags.includes("entrepreneurship")) selected.push("create-x-i2p");
  const ordered: Resource[] = []; const visiting = new Set<string>(); const visited = new Set<string>();
  function visit(slug: string): boolean {
    if (slug === "define-requirements" || visited.has(slug)) return true;
    if (visiting.has(slug)) return false;
    const row = catalog.find(r => r.slug === slug && r.active && r.source_status === "reviewed" && r.last_reviewed_at <= options.asOf);
    if (!row) return false;
    visiting.add(slug);
    if (!row.prerequisite_tags.every(visit)) return false;
    visiting.delete(slug); visited.add(slug); ordered.push(row); return true;
  }
  const valid = selected.every(visit);
  if (valid && ordered.length <= 3) for (const row of ordered) steps.push({ key: row.slug, kind: "resource", resourceId: row.id, title: row.title, description: row.student_action, reason: row.slug === "create-x-i2p" ? "You mentioned funding or a startup. Review application conditions; support is not guaranteed." : row.short_description });
  if (steps.length === 1) steps.push({ key: "small-test", kind: "action", title: "Prepare one small next step", description: goal.intent === "project" ? "Sketch a first version and identify one part you can test. Bring that question to a helper." : "List what you already know, then choose one question for someone with relevant experience.", reason: selected.length ? "Resource guidance could not be confirmed. Check official information before making plans." : "Keep the first step small enough to act on." });
  steps.push({ key: "find-helper", kind: "find_person", title: "Ask a Jacket who has been there", description: "Find someone who offers the help you need, read their experience, and send a focused question.", reason: "Shared Georgia Tech experience gives you a starting point for learning from each other." });
  const optionalIndex=steps.findIndex(step=>step.key==="create-x-i2p");
  if(optionalIndex>=0)steps.push(...steps.splice(optionalIndex,1));
  return steps;
}
