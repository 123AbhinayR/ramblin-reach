import { z } from "zod";
import { AFFILIATIONS, HELP_TOPICS, METROS, VERIFICATION_STATES, textField } from "@/lib/domain/schemas";

export const credentialsSchema = z.strictObject({ email: z.email().max(254), password: z.string().min(12).max(128) });
export const emailSchema = z.strictObject({ email: z.email().max(254) });
export const passwordSchema = z.strictObject({ password: z.string().min(12).max(128) });
export const profileInputSchema = z.strictObject({
  display_name: textField(1, 80), visible: z.boolean(), paused: z.boolean(),
  major: textField(0, 100).nullable(), grad_year: z.number().int().min(1900).max(2200).nullable(),
  company_name: textField(0, 100).nullable(), metro: z.enum(METROS).nullable(),
  role_title: textField(0, 100).nullable(), bio: textField(0, 400).nullable(),
  skills: z.array(textField(1, 40)).max(20), gt_topics: z.array(textField(1, 40)).max(20),
  help_topics: z.array(z.enum(HELP_TOPICS)).max(5), monthly_cap: z.number().int().min(1).max(10),
});
export const profileSchema = profileInputSchema.extend({
  id: z.uuid(), affiliation: z.enum(AFFILIATIONS), verification_state: z.enum(VERIFICATION_STATES),
  is_demo: z.boolean(),
});
export const PROFILE_COLUMNS = "id,display_name,affiliation,verification_state,is_demo,visible,paused,major,grad_year,company_name,metro,role_title,bio,skills,gt_topics,help_topics,monthly_cap";
export type Profile = z.infer<typeof profileSchema>;
