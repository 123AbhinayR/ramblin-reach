import {z} from 'zod';
import {apiMember} from '@/lib/api-member';
import {readInput,json,failure,HttpError} from '@/lib/http';
export async function POST(request:Request){try{const {client}=await apiMember();const input=await readInput(request,z.strictObject({enabled:z.boolean()}));const {data,error}=await client.rpc('set_available_now',{p_enabled:input.enabled});if(error)throw new HttpError(409,'UNAVAILABLE','Check profile consent, capacity and alumni status.');return json({until:z.string().nullable().parse(data)});}catch(error){return failure(error);}}
