import { apiMember } from "@/lib/api-member";
import { transitionSchema, requestRowSchema } from "@/lib/requests/schemas";
import { failure, json, readInput } from "@/lib/http";
import { z } from "zod";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { client } = await apiMember();
    const id = z.uuid().parse((await context.params).id);
    const input = await readInput(request, transitionSchema);
    const { data, error } = await client.rpc("transition_connection_request", {
      p_request_id: id,
      p_action: input.action,
    });
    if (error) {
      const msg = error.message ?? "";
      if (msg.includes("REQUEST_UNAVAILABLE")) return json({ error: { code: "REQUEST_UNAVAILABLE", message: "This request could not be found." } }, 404);
      if (msg.includes("INVALID_TRANSITION")) return json({ error: { code: "INVALID_TRANSITION", message: "This action is not allowed in the current state." } }, 409);
      throw error;
    }
    return json({ request: requestRowSchema.parse(data) });
  } catch (error) {
    return failure(error);
  }
}
