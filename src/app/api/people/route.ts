import {apiMember} from "@/lib/api-member";
import {candidatesFor} from "@/lib/matching/data";
import {filtersSchema} from "@/lib/matching/schemas";
import {matchResults} from "@/lib/matching/rank";
import {failure,json} from "@/lib/http";
import {personDto} from "@/lib/matching/dto";
export async function GET(request:Request){try{const {client,profile}=await apiMember();const filters=filtersSchema.parse(Object.fromEntries(new URL(request.url).searchParams));const results=matchResults(await candidatesFor(client),filters,profile.id,new Date().toISOString());return json({items:results.items.map(personDto),alternatives:results.alternatives.map(p=>({...personDto(p),relaxedCriteria:p.relaxedCriteria})),nextCursor:results.nextCursor});}catch(error){return failure(error);}}
