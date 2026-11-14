import { z } from "zod";
import { apiMember } from "@/lib/api-member";
import { failure, HttpError, json, readInput } from "@/lib/http";
import { goalInputSchema } from "@/lib/domain/schemas";
import { parseGoal } from "@/lib/intent/parse";
import { buildPath } from "@/lib/path/build";
import { catalogFor, loadPath } from "@/lib/path/data";
export async function POST(request: Request) {
  try {
    const { client } = await apiMember(); const input = await readInput(request,goalInputSchema);
    const parsed = parseGoal(input); const steps = buildPath(parsed,await catalogFor(client),{asOf:new Date().toISOString().slice(0,10)});
    const { data,error } = await client.rpc("create_goal_with_path",{ p_goal_text: input.goalText,p_intent:parsed.intent,p_tags:parsed.tags,p_target_company:parsed.targetCompany,p_target_metro:parsed.targetMetro,p_steps:steps });
    if (error) { if (error.message.includes("RATE_LIMIT")) throw new HttpError(429,"RATE_LIMIT","You’ve made several paths. Try again in a minute."); throw new Error("Path save failed"); }
    return json(await loadPath(client,z.uuid().parse(data)),201);
  } catch(error) { return failure(error); }
}
