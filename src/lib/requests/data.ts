import "server-only";
import { z } from "zod";
import type { authClient } from "@/lib/auth/server";
import { requestRowSchema, outcomeRowSchema } from "./schemas";

type Client = Awaited<ReturnType<typeof authClient>>;

export async function loadInbox(client: Client) {
  const { data: sent, error: sentError } = await client
    .from("connection_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  if (sentError) throw new Error("Requests could not be loaded.");

  const rows = z.array(requestRowSchema).parse(sent);

  // load peer profiles for display names
  const peerIds = [...new Set(rows.map(r => [r.requester_id, r.recipient_id]).flat())];
  const profiles: Array<{ id: string; display_name: string; is_demo: boolean }> = [];
  for (let offset = 0; offset < peerIds.length; offset += 30) {
    const { data, error } = await client
      .from("profiles")
      .select("id,display_name,is_demo")
      .in("id", peerIds.slice(offset, offset + 30));
    if (error) throw new Error("Profiles could not be loaded.");
    profiles.push(...z.array(z.object({ id: z.uuid(), display_name: z.string(), is_demo: z.boolean() })).parse(data));
  }

  // load outcomes for completed requests
  const completedIds = rows.filter(r => r.status === "completed").map(r => r.id);
  const outcomes: Array<z.infer<typeof outcomeRowSchema>> = [];
  if (completedIds.length) {
    const { data: outcomeData, error: outcomeError } = await client
      .from("outcomes")
      .select("*")
      .in("request_id", completedIds);
    if (outcomeError) throw new Error("Outcomes could not be loaded.");
    outcomes.push(...z.array(outcomeRowSchema).parse(outcomeData));
  }

  return { rows, profiles, outcomes };
}

export async function loadRequest(client: Client, id: string) {
  const { data, error } = await client
    .from("connection_requests")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return requestRowSchema.parse(data);
}
