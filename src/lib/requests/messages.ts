import {z} from "zod";
import {textField} from "@/lib/domain/schemas";
export const messageInput=z.strictObject({body:textField(1,2000),key:z.uuid()});
export const messageRow=z.object({id:z.number().int().positive(),request_id:z.uuid(),sender_id:z.uuid(),body:z.string().min(1).max(2000),created_at:z.string(),idempotency_key:z.uuid()});
export const readRow=z.object({request_id:z.uuid(),member_id:z.uuid(),last_message_id:z.number().int().nonnegative()});
export type Message=z.infer<typeof messageRow>;
type Table<Row>={Row:Row;Insert:never;Update:never;Relationships:[];ComputedFields:never};
export type InboxTables={request_messages:Table<Message>;request_reads:Table<z.infer<typeof readRow>>};
export type InboxFunctions={
 unread_request_ids:{Args:{p_ids:string[]};Returns:{request_id:string}[]};
 send_request_message:{Args:{p_request_id:string;p_body:string;p_key:string};Returns:Message};
 mark_request_read:{Args:{p_request_id:string;p_last_id:number};Returns:undefined};
};

