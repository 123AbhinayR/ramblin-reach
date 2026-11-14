import {z} from "zod";
import {apiMember} from "@/lib/api-member";
import {failure,json,readInput,HttpError} from "@/lib/http";
import {ownedProjectSchema,projectInputSchema} from "@/lib/projects/schemas";
export async function PUT(request:Request,context:{params:Promise<{id:string}>}){try{const {client,profile}=await apiMember();const id=z.uuid().parse((await context.params).id);const {publishConsent,...input}=await readInput(request,projectInputSchema);void publishConsent;const {data,error}=await client.from("member_projects").update(input).eq("id",id).eq("owner_id",profile.id).select("id,title,summary,skills,one_lesson,visibility").maybeSingle();if(error){if(error.message.includes("PUBLIC_PROJECT_LIMIT"))throw new HttpError(409,"PROJECT_LIMIT","You can share up to three projects.");throw error;}if(!data)throw new HttpError(404,"NOT_FOUND","Project unavailable.");return json({project:ownedProjectSchema.parse(data)});}catch(error){return failure(error);}}
