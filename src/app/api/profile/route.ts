import { currentMember } from "@/lib/auth/guard";
import { PROFILE_COLUMNS, profileInputSchema, profileSchema } from "@/lib/auth/schemas";
import { failure, HttpError, json, readInput } from "@/lib/http";
export async function PUT(request: Request) {
  try {
    const member = await currentMember();
    if (!member) throw new HttpError(401, "UNAUTHENTICATED", "Sign in to edit your profile.");
    const input = await readInput(request, profileInputSchema);
    const { data, error } = await member.client.from("profiles").update(input).eq("id", member.profile.id).select(PROFILE_COLUMNS).single();
    if (error) throw new Error("Profile update failed");
    return json({ profile: profileSchema.parse(data) });
  } catch (error) { return failure(error); }
}
