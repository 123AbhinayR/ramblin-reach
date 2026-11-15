import type { z } from "zod";
import type { goalSchema } from "./schemas";
import { normalizeText } from "@/lib/domain/schemas";

type Goal = z.infer<typeof goalSchema>;
const canonical = (value: string | null) => normalizeText(value ?? "").replace(/\s+/g, " ").toLowerCase();

/** Group recent saves for display only. Every saved path remains in the database. */
export function recentGoalHistory(goals: Goal[], limit = 4) {
  const groups = new Map<string, { goal: Goal; saves: number }>();
  const sorted = [...goals].sort((a, b) => b.created_at.localeCompare(a.created_at) || a.id.localeCompare(b.id));
  for (const goal of sorted) {
    const key = JSON.stringify([canonical(goal.goal_text), goal.intent, canonical(goal.target_company), canonical(goal.target_metro)]);
    const group = groups.get(key);
    if (group) group.saves++;
    else groups.set(key, { goal, saves: 1 });
  }
  return [...groups.values()].slice(0, limit);
}
