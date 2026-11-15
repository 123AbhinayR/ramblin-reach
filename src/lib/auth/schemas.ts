import {builtAtTechSchema} from "@/lib/matching/built";
import { z } from "zod";
import { AFFILIATIONS, HELP_TOPICS, VERIFICATION_STATES, locationSchema, textField } from "@/lib/domain/schemas";

export const credentialsSchema = z.strictObject({ email: z.email().max(254), password: z.string().min(12).max(128) });
export const emailSchema = z.strictObject({ email: z.email().max(254) });
export const passwordSchema = z.strictObject({ password: z.string().min(12).max(128) });
const tags=z.array(textField(1,40)).max(20).default([]);
export const profileInputSchema = z.strictObject({
  built_at_tech:builtAtTechSchema.nullable().default(null),
  display_name: textField(1, 80), visible: z.boolean(), paused: z.boolean(),
  major: textField(0, 100).nullable(), grad_year: z.number().int().min(1900).max(2200).nullable(),
  company_name: textField(0, 100).nullable(), metro: locationSchema.nullable().transform(value => value || null),
  role_title: textField(0, 100).nullable(), bio: textField(0, 400).nullable(),
  skills: z.array(textField(1, 40)).max(20), gt_topics: z.array(textField(1, 40)).max(20),
  can_teach:tags, want_learn:tags, interests:tags, mentor_categories:z.array(z.enum(["hackathons","startups","projects","research","clubs","careers"])).max(6).default([]),
  help_topics: z.array(z.enum(HELP_TOPICS)).max(5), monthly_cap: z.number().int().min(1).max(10),
});
export const profileSchema = profileInputSchema.extend({
  id: z.uuid(), affiliation: z.enum(AFFILIATIONS), verification_state: z.enum(VERIFICATION_STATES),
  is_demo: z.boolean(), available_until:z.string().nullable().default(null),
});
export const PROFILE_COLUMNS = "id,display_name,affiliation,verification_state,is_demo,visible,paused,major,grad_year,company_name,metro,role_title,bio,skills,gt_topics,help_topics,monthly_cap,available_until,built_at_tech,can_teach,want_learn,interests,mentor_categories";
export type Profile = z.infer<typeof profileSchema>;
