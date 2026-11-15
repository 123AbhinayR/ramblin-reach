import {z} from "zod";
import {apiMember} from "@/lib/api-member";
import {failure,json,readInput,HttpError} from "@/lib/http";
import {messageInput,messageRow} from "@/lib/requests/messages";
type Context={params:Promise<{id:string}>};
export async function GET(request:Request,context:Context){
 try{
  const {client}=await apiMember();const id=z.uuid().parse((await context.params).id);
  const after=z.coerce.number().int().nonnegative().safe().parse(new URL(request.url).searchParams.get('after')??0);
  const {data:row,error:rowError}=await client.from('connection_requests').select('id,status').eq('id',id).single();
  if(rowError||!row||!['accepted','completed'].includes(row.status))throw new HttpError(404,'THREAD_UNAVAILABLE','Thread unavailable.');
  const {data,error}=await client.from('request_messages').select('*').eq('request_id',id).gt('id',after).order('id').limit(100);
  if(error)throw error;return json({messages:z.array(messageRow).parse(data),status:row.status});
 }catch(error){return failure(error);}
}
export async function POST(request:Request,context:Context){
 try{
  const {client}=await apiMember();const id=z.uuid().parse((await context.params).id);const input=await readInput(request,messageInput);
  const {data,error}=await client.rpc('send_request_message',{p_request_id:id,p_body:input.body,p_key:input.key});
  if(error){if(error.message.includes('RATE_LIMIT'))throw new HttpError(429,'RATE_LIMIT','Please wait before replying again.');throw new HttpError(409,'THREAD_UNAVAILABLE','This thread is unavailable or closed.');}
  return json({message:messageRow.parse(data)},201);
 }catch(error){return failure(error);}
}
export async function PUT(request:Request,context:Context){
 try{
  const {client}=await apiMember();const id=z.uuid().parse((await context.params).id);
  const input=await readInput(request,z.strictObject({lastId:z.number().int().positive().safe()}));
  const {error}=await client.rpc('mark_request_read',{p_request_id:id,p_last_id:input.lastId});
  if(error)throw new HttpError(404,'THREAD_UNAVAILABLE','Thread unavailable.');return json({ok:true});
 }catch(error){return failure(error);}
}
