import {z} from "zod";
import {textField} from "@/lib/domain/schemas";
export const projectInputSchema=z.strictObject({title:textField(1,100),summary:textField(10,350),skills:z.array(textField(1,40)).max(4),one_lesson:textField(0,240).nullable(),visibility:z.enum(["private","members"]),publishConsent:z.boolean()}).superRefine((value,context)=>{if(value.visibility==="members"&&!value.publishConsent)context.addIssue({code:"custom",message:"Confirm that this is your own experience and contains no private information.",path:["publishConsent"]});});
export const ownedProjectSchema=z.object({id:z.uuid(),title:z.string(),summary:z.string(),skills:z.array(z.string()),one_lesson:z.string().nullable(),visibility:z.enum(["private","members"])});
export type OwnedProject=z.infer<typeof ownedProjectSchema>;
