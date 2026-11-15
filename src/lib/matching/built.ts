import {z} from 'zod';
import {textField,normalizeText} from '@/lib/domain/schemas';
export const builtAtTechSchema=z.strictObject({title:textField(1,100),year:z.number().int().min(1900).max(2200),lab:textField(0,100)});
export type BuiltAtTech=z.infer<typeof builtAtTechSchema>;
/** Match only exact words in the member's project title; year never affects rank. */
export function builtAtTechSignal(tags:string[],project:BuiltAtTech|null){
 const words=new Set(normalizeText(project?.title??'').toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean));
 const matches=tags.some(t=>words.has(normalizeText(t).toLowerCase()));
 return project&&matches?{score:3,reason:`Built at Tech: ${project.title} (${project.year})${project.lab?` · ${project.lab}`:''} · self-reported`}:{score:0,reason:null};
}
