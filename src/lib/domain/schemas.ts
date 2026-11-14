import { z } from "zod";

export const INTENTS = ["project", "career", "relocation"] as const;
export const AFFILIATIONS = ["student", "alumni"] as const;
export const VERIFICATION_STATES = ["pending", "verified", "demo"] as const;
export const HELP_TOPICS = ["project_guidance", "resource_navigation", "career_advice", "company_insight", "relocation_advice"] as const;
export const FORMATS = ["chat_15min", "written_advice", "project_feedback"] as const;
export const REQUEST_STATUSES = ["pending", "accepted", "declined", "cancelled", "completed"] as const;
export const OUTCOME_TYPES = ["resource_accessed", "technical_advice", "company_insight", "relocation_advice", "next_step_planned", "other"] as const;
export const STEP_STATUSES = ["not_started", "done"] as const;
export const REVIEW_STATUSES = ["reviewed", "needs_review"] as const;
export const GOAL_TAGS = ["electronics", "sensor", "fabrication", "entrepreneurship", "software", "research", "career", "networking", "relocation"] as const;
export const METROS = ["Atlanta, GA", "Seattle, WA", "Austin, TX", "New York, NY", "San Francisco Bay Area, CA", "Boston, MA"] as const;
export const intentSchema = z.enum(INTENTS);
export type GoalIntent = z.infer<typeof intentSchema>;
export type HelpTopic = typeof HELP_TOPICS[number];
export type RequestStatus = typeof REQUEST_STATUSES[number];
export type GoalTag = typeof GOAL_TAGS[number];

export function normalizeText(value: string): string {
  return value.normalize("NFKC").replace(/[\u0000-\u0008\u000b-\u001f\u007f\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g, "").trim();
}
export function textField(min: number, max: number) {
  return z.string().transform(normalizeText).pipe(z.string().refine(v => [...v].length >= min && [...v].length <= max, `Use ${min}–${max} characters.`));
}
export const goalInputSchema = z.strictObject({
  goalText: textField(10, 500), intent: intentSchema.optional(),
  targetCompany: textField(0, 100).nullable().optional(),
  targetMetro: z.enum(METROS).nullable().optional(),
});
export const labels = {
  project_guidance: "Project guidance", resource_navigation: "Campus resources", career_advice: "Career advice",
  company_insight: "Company insight", relocation_advice: "Relocation advice",
  chat_15min: "15-minute chat", written_advice: "Written response", project_feedback: "Project feedback",
  resource_accessed: "Learned how to use a resource", technical_advice: "Received technical advice",
  next_step_planned: "Next step planned", other: "Something else",
} as const;
