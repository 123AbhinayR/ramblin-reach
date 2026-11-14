import { apiMember } from "@/lib/api-member";
import { outcomeSchema } from "@/lib/requests/schemas";
import { failure, json, readInput, HttpError } from "@/lib/http";
import { z } from "zod";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { client, profile } = await apiMember();
    const id = z.uuid().parse((await context.params).id);
    const input = await readInput(request, outcomeSchema);
    const { data, error } = await client
      .from("outcomes")
      .insert({
        request_id: id,
        reported_by: profile.id,
        outcome_type: input.outcomeType,
        private_note: input.privateNote ?? null,
      })
      .select()
      .single();
    if (error) {
      if (error.code === "23505") return json({ error: { code: "OUTCOME_EXISTS", message: "You have already recorded an outcome for this request." } }, 409);
      if (error.code === "42501") throw new HttpError(403, "FORBIDDEN", "Only participants in a completed request can record an outcome.");
      throw error;
    }
    return json({ outcome: data }, 201);
  } catch (error) {
    return failure(error);
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { client, profile } = await apiMember();
    const id = z.uuid().parse((await context.params).id);
    const input = await readInput(request, outcomeSchema);
    const { data, error } = await client
      .from("outcomes")
      .update({ outcome_type: input.outcomeType, private_note: input.privateNote ?? null })
      .eq("request_id", id)
      .eq("reported_by", profile.id)
      .select()
      .single();
    if (error) throw error;
    if (!data) throw new HttpError(404, "OUTCOME_NOT_FOUND", "No outcome found to update.");
    return json({ outcome: data });
  } catch (error) {
    return failure(error);
  }
}
