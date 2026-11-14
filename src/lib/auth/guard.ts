import "server-only";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authClient } from "./server";
import { PROFILE_COLUMNS, profileSchema } from "./schemas";
import { getServerEnv } from "@/lib/env";

export async function currentMember() {
  const client = await authClient();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return null;
  const id = z.uuid().parse(data.user.id);
  const { data: row, error: profileError } = await client.from("profiles").select(PROFILE_COLUMNS).eq("id", id).single();
  if (profileError) throw new Error("Your profile could not be loaded. Please try again.");
  const profile = profileSchema.parse(row);
  const env = getServerEnv();
  const { data: allowed, error: membershipError } = await client.rpc("is_eligible_member");
  if (membershipError) throw new Error("Membership could not be checked. Please try again.");
  const eligible = z.boolean().parse(allowed) && (!profile.is_demo || (env.APP_ENV !== "production" && env.DEMO_MODE === "1"));
  return { client, profile, eligible };
}
export async function requireMember(eligible = true) {
  const member = await currentMember();
  if (!member) redirect("/login");
  if (eligible && !member.eligible) redirect("/onboarding");
  return member;
}
