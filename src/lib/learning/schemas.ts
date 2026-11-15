import {z} from 'zod';
export const learningRow=z.object({id:z.uuid(),reported_by:z.uuid(),project_id:z.uuid().nullable(),learned:z.string(),helped:z.string(),next_step:z.string(),created_at:z.string()});
export const notificationRow=z.object({id:z.uuid(),recipient_id:z.uuid(),actor_id:z.uuid(),kind:z.enum(['new_request','accepted','new_message','post_reply','matched_request']),request_id:z.uuid().nullable(),post_id:z.uuid().nullable(),reason:z.string(),read_at:z.string().nullable(),created_at:z.string()});
export const notificationLabels={new_request:'New ReachCard',accepted:'ReachCard accepted',new_message:'New message',post_reply:'Reply to your post',matched_request:'A request matches your interests'} as const;
export function notificationHref(n:Pick<z.infer<typeof notificationRow>,'kind'|'request_id'|'post_id'>){return n.post_id?`/circles/${n.post_id}`:n.kind==='new_request'?`/requests#request-${n.request_id}`:n.request_id?`/requests/${n.request_id}`:'/requests';}
