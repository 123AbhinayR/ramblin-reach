import {z} from "zod";
import {apiMember} from "@/lib/api-member";
import {candidatesFor} from "@/lib/matching/data";
import {filtersSchema} from "@/lib/matching/schemas";
import {rankMatches} from "@/lib/matching/rank";
import {personDto} from "@/lib/matching/dto";
import {failure,HttpError,json} from "@/lib/http";
export async function GET(_request:Request,context:{params:Promise<{id:string}>}){try{const {client,profile}=await apiMember();const id=z.uuid().parse((await context.params).id);const person=rankMatches(await candidatesFor(client),filtersSchema.parse({availableOnly:"false"}),profile.id).find(p=>p.id===id);if(!person)throw new HttpError(404,"MEMBER_UNAVAILABLE","This member is unavailable.");return json({person:personDto(person)});}catch(error){return failure(error);}}
