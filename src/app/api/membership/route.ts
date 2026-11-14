import { z } from "zod";
import { currentMember } from "@/lib/auth/guard";
import { AFFILIATIONS } from "@/lib/domain/schemas";
import { failure, HttpError, json, readInput } from "@/lib/http";
export async function POST(request: Request) {
  try {
    const member = await currentMember();
    if (!member) throw new HttpError(401, "UNAUTHENTICATED", "Sign in to request membership.");
    const input = await readInput(request, z.strictObject({ requested_affiliation: z.enum(AFFILIATIONS) }));
    const { error } = await member.client.from("membership_requests").upsert({ owner_id: member.profile.id, ...input });
    if (error) throw new Error("Membership request failed");
    return json({ message: "Your membership review request has been saved. Approval requires a manual review; your graduation year does not verify alumni status." });
  } catch (error) { return failure(error); }
}
