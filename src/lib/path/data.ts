import "server-only";
import { z } from "zod";
import type { authClient } from "@/lib/auth/server";
import { goalSchema, resourceSchema, stepSchema } from "./schemas";
export async function catalogFor(client: Awaited<ReturnType<typeof authClient>>) {
  const { data, error } = await client.from("resources").select("id,slug,title,student_action,short_description,official_url,eligibility_caveat,last_reviewed_at,source_status,prerequisite_tags,tags,active").order("display_priority").limit(30);
  if (error) throw new Error("Resources could not be loaded.");
  return z.array(resourceSchema).parse(data);
}
export async function loadPath(client: Awaited<ReturnType<typeof authClient>>, id: string) {
  const [goal, steps] = await Promise.all([client.from("goals").select("id,goal_text,intent,target_company,target_metro,extracted_tags,created_at").eq("id",id).maybeSingle(), client.from("path_steps").select("id,goal_id,ordinal,kind,title,description,reason,status,completed_at,source_snapshot").eq("goal_id",id).order("ordinal")]);
  if (goal.error || steps.error) throw new Error("Path could not be loaded.");
  if (!goal.data) return null;
  return { goal: goalSchema.parse(goal.data), pathSteps: z.array(stepSchema).parse(steps.data) };
}
