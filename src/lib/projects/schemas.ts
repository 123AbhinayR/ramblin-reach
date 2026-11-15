import {z} from "zod";
import {textField} from "@/lib/domain/schemas";
export const projectFields={category:z.enum(["hackathons","startups","projects","research","clubs","careers"]).default("projects"),current_challenge:textField(0,400).default(""),requested_help:textField(0,400).default("")};
export const projectInputSchema=z.strictObject({...projectFields,title:textField(1,100),summary:textField(10,350),skills:z.array(textField(1,40)).max(4),one_lesson:textField(0,240).nullable(),visibility:z.enum(["private","members"]),publishConsent:z.boolean()}).superRefine((value,context)=>{if(value.visibility==="members"&&!value.publishConsent)context.addIssue({code:"custom",message:"Confirm that this is your own experience and contains no private information.",path:["publishConsent"]});});
export const ownedProjectSchema=z.object({...projectFields,id:z.uuid(),title:z.string(),summary:z.string(),skills:z.array(z.string()),one_lesson:z.string().nullable(),visibility:z.enum(["private","members"])});
export type OwnedProject=z.infer<typeof ownedProjectSchema>;

export const detailProjectSchema=ownedProjectSchema.extend({owner_id:z.uuid(),is_demo:z.boolean()});
export const PROJECT_COLUMNS="id,owner_id,title,summary,skills,one_lesson,visibility,is_demo,category,current_challenge,requested_help";
