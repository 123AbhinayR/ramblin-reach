import {z} from 'zod';
import {apiMember} from '@/lib/api-member';
import {failure,json,readInput} from '@/lib/http';
import {notificationRow} from '@/lib/learning/schemas';
export async function GET(){try{const {client}=await apiMember();const {data,error}=await client.from('notifications').select('*').order('created_at',{ascending:false}).limit(50);if(error)throw error;return json({notifications:z.array(notificationRow).parse(data)});}catch(error){return failure(error);}}
export async function PUT(request:Request){try{const {client,profile}=await apiMember();const input=await readInput(request,z.strictObject({id:z.uuid()}));const {error}=await client.from('notifications').update({read_at:new Date().toISOString()}).eq('id',input.id).eq('recipient_id',profile.id);if(error)throw error;return json({ok:true});}catch(error){return failure(error);}}
