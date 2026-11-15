import {describe,it,expect} from 'vitest';
import {QUICK_REASONS,quickTemplate} from '@/lib/requests/templates';
import {messageInput} from '@/lib/requests/messages';
import {createRequestSchema} from '@/lib/requests/schemas';
const key='11111111-1111-4111-8111-111111111111';
describe('QuickReach',()=>{
 it('QR16 all eight static templates fit existing ReachCard boundaries',()=>{expect(QUICK_REASONS).toHaveLength(8);for(const reason of QUICK_REASONS){const draft=quickTemplate(reason);expect(createRequestSchema.safeParse({recipientId:key,helpTopic:'project_guidance',format:'written_advice',goalContext:draft.goal,specificQuestion:draft.question,idempotencyKey:key}).success).toBe(true);expect(quickTemplate(reason)).toEqual(draft);}});
 it('QR17 messages reject spoofed sender, empty, overlong and invisible body',()=>{for(const body of ['', '\u200b', 'x'.repeat(2001)])expect(messageInput.safeParse({body,key}).success).toBe(false);expect(messageInput.safeParse({body:'Hello',key,senderId:key}).success).toBe(false);expect(messageInput.parse({body:' Hello ',key}).body).toBe('Hello');});
});
