import { z } from "zod";
import { INTENTS, STEP_STATUSES } from "@/lib/domain/schemas";
export const officialUrlSchema = z.url().refine(value => {
  const url = new URL(value);
  return url.protocol === "https:" && !url.username && !url.password && !url.port && ["hive.ece.gatech.edu", "inventionstudio.gatech.edu", "create-x.gatech.edu", "career.gatech.edu", "www.gtalumni.org"].includes(url.hostname);
}, "An approved official HTTPS source is required.");
export const resourceSchema = z.object({ id: z.uuid(), slug: z.string(), title: z.string(), student_action: z.string(), short_description: z.string(), official_url: officialUrlSchema, eligibility_caveat: z.string(), last_reviewed_at: z.iso.date(), source_status: z.enum(["reviewed", "needs_review"]), prerequisite_tags: z.array(z.string()), tags: z.array(z.string()), active: z.boolean() });
export type Resource = z.infer<typeof resourceSchema>;
export const evidenceSchema = z.object({ slug: z.string(), title: z.string(), officialUrl: officialUrlSchema, eligibilityNote: z.string(), reviewedOn: z.iso.date(), availabilityClaim: z.literal("unknown") });
export const goalSchema = z.object({ id: z.uuid(), goal_text: z.string(), intent: z.enum(INTENTS), target_company: z.string().nullable(), target_metro: z.string().nullable(), extracted_tags: z.array(z.string()), created_at: z.string() });
export const stepSchema = z.object({ id: z.uuid(), goal_id: z.uuid(), ordinal: z.number().int(), kind: z.enum(["action", "resource", "find_person"]), title: z.string(), description: z.string(), reason: z.string(), status: z.enum(STEP_STATUSES), completed_at: z.string().nullable(), source_snapshot: evidenceSchema.nullable() });
export type PathStep = z.infer<typeof stepSchema>;
