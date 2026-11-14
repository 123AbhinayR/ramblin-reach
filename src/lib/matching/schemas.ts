import {z} from "zod";
import {profileSchema} from "@/lib/auth/schemas";
import {AFFILIATIONS,HELP_TOPICS,INTENTS,METROS,textField} from "@/lib/domain/schemas";
export const projectSchema=z.object({id:z.uuid(),owner_id:z.uuid(),title:z.string(),summary:z.string(),skills:z.array(z.string()),resource_tags:z.array(z.string()),one_lesson:z.string().nullable(),visibility:z.literal("members"),is_demo:z.boolean()});
export const candidateSchema=profileSchema.extend({used:z.number().int().nonnegative(),projects:z.array(projectSchema)});
export type Candidate=z.infer<typeof candidateSchema>;
export const filtersSchema=z.object({company:textField(0,100).default(""),metro:z.union([z.enum(METROS),z.literal("")]).default(""),topic:z.union([z.enum(HELP_TOPICS),z.literal("")]).default(""),skills:textField(0,200).default(""),context:textField(0,100).default(""),affiliation:z.union([z.enum(AFFILIATIONS),z.literal("")]).default(""),availableOnly:z.enum(["true","false"]).default("true"),intent:z.enum(INTENTS).default("project"),limit:z.coerce.number().int().min(1).max(30).default(15),cursor:z.uuid().optional(),goalId:z.uuid().optional()});
export type Filters=z.infer<typeof filtersSchema>;
