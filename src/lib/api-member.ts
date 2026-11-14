import "server-only";
import { currentMember } from "@/lib/auth/guard";
import { HttpError } from "@/lib/http";
export async function apiMember() {
  const member = await currentMember();
  if (!member) throw new HttpError(401,"UNAUTHENTICATED","Sign in to continue.");
  if (!member.eligible) throw new HttpError(403,"FORBIDDEN","Membership approval is required.");
  return member;
}
