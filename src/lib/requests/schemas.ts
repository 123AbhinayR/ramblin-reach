import { z } from "zod";
import { FORMATS, HELP_TOPICS, OUTCOME_TYPES, REQUEST_STATUSES, textField } from "@/lib/domain/schemas";

export function isSafeProjectUrl(val: string): boolean {
  try {
    const u = new URL(val);
    if (u.protocol !== "https:") return false;
    const hostname = u.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal") ||
      hostname.endsWith(".test") ||
      hostname.endsWith(".invalid") ||
      /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) ||
      hostname.includes(":") ||
      !hostname.includes(".")
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export const safeProjectUrlSchema = z.string().transform(v => v.trim()).pipe(
  z.union([
    z.literal("").transform(() => undefined),
    z.string().max(500).refine(isSafeProjectUrl, {
      message: "Project link must be a valid public HTTPS URL (e.g. https://github.com/...).",
    }),
  ])
).optional();

export const createRequestSchema = z.strictObject({
  recipientId: z.uuid(),
  goalId: z.uuid().optional(),
  helpTopic: z.enum(HELP_TOPICS),
  format: z.enum(FORMATS),
  goalContext: textField(10, 240),
  specificQuestion: textField(20, 400),
  priorEffort: textField(0, 300).optional(),
  safeProjectUrl: safeProjectUrlSchema,
  idempotencyKey: z.uuid(),
});

export const transitionSchema = z.strictObject({
  action: z.enum(["accept", "decline", "cancel", "complete"]),
});

export const outcomeSchema = z.strictObject({
  outcomeType: z.enum(OUTCOME_TYPES),
  privateNote: textField(0, 300).optional(),
});

export const requestRowSchema = z.object({
  id: z.uuid(),
  requester_id: z.uuid(),
  recipient_id: z.uuid(),
  goal_id: z.uuid().nullable(),
  help_topic: z.enum(HELP_TOPICS),
  format: z.enum(FORMATS),
  goal_context: z.string(),
  specific_question: z.string(),
  prior_effort: z.string().nullable(),
  safe_project_url: z.string().nullable(),
  status: z.enum(REQUEST_STATUSES),
  created_at: z.string(),
  responded_at: z.string().nullable(),
  completed_at: z.string().nullable(),
  idempotency_key: z.guid(),
});

export const outcomeRowSchema = z.object({
  id: z.uuid(),
  request_id: z.uuid(),
  reported_by: z.uuid(),
  outcome_type: z.enum(OUTCOME_TYPES),
  private_note: z.string().nullable(),
  created_at: z.string(),
});

export type RequestRow = z.infer<typeof requestRowSchema>;
export type OutcomeRow = z.infer<typeof outcomeRowSchema>;
