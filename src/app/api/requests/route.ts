import { loadInbox } from "@/lib/requests/data";
import { apiMember } from "@/lib/api-member";
import { createRequestSchema, requestRowSchema } from "@/lib/requests/schemas";
import { failure, json, readInput } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const { client } = await apiMember();
    const input = await readInput(request, createRequestSchema);
    const { data, error } = input.projectId?await client.rpc("create_project_reachcard",{p_project_id:input.projectId,p_input:input}):await client.rpc("create_connection_request", {
      p_recipient_id: input.recipientId,
      p_goal_id: input.goalId ?? null,
      p_help_topic: input.helpTopic,
      p_format: input.format,
      p_goal_context: input.goalContext,
      p_specific_question: input.specificQuestion,
      p_prior_effort: input.priorEffort ?? null,
      p_safe_project_url: input.safeProjectUrl ?? null,
      p_idempotency_key: input.idempotencyKey,
    });
    if (error) {
      const msg = error.message ?? "";
      if (msg.includes("MEMBER_UNAVAILABLE")) return json({ error: { code: "MEMBER_UNAVAILABLE", message: "This member is not accepting requests right now." } }, 409);
      if (msg.includes("DUPLICATE_PENDING")) return json({ error: { code: "DUPLICATE_PENDING", message: "You already have a pending request with this member." } }, 409);
      if (msg.includes("OUTGOING_LIMIT")) return json({ error: { code: "OUTGOING_LIMIT", message: "You have reached the limit of pending outgoing requests (3)." } }, 409);
      if (msg.includes("IDEMPOTENCY_CONFLICT")) return json({ error: { code: "IDEMPOTENCY_CONFLICT", message: "A different request was already sent with this key." } }, 409);
      if (msg.includes("RATE_LIMIT")) return json({ error: { code: "RATE_LIMIT", message: "Please wait a moment before sending another request." } }, 429);
      throw error;
    }
    return json({ request: requestRowSchema.parse(data) }, 201);
  } catch (error) {
    return failure(error);
  }
}

export async function GET(){try{const {client}=await apiMember();return json(await loadInbox(client));}catch(error){return failure(error);}}
