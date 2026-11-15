import {z} from 'zod';
import {requestRowSchema,outcomeRowSchema} from './schemas';

export const inboxSchema=z.object({rows:z.array(requestRowSchema),profiles:z.array(z.object({id:z.uuid(),display_name:z.string(),is_demo:z.boolean()})),outcomes:z.array(outcomeRowSchema),unreadIds:z.array(z.uuid())});

