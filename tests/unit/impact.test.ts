import {it,expect} from 'vitest';
import {impactCards} from '@/lib/learning/impact';
const r={id:'r',requester_id:'student',recipient_id:'helper',status:'completed',goal_context:'Recorded problem',project_id:'p'};
const o={id:'o',request_id:'r',reported_by:'student',learned:'Recorded lesson',helped:'',next_step:'Recorded next step'};
const people=[{id:'student',display_name:'Mira Talven',is_demo:true},{id:'helper',display_name:'Arin Velden',is_demo:true}];
it('IM01 derives exact problem, helper and outcome solely from linked records',()=>{const card=impactCards([r],[o],people,'student')[0];expect(card).toMatchObject({problem:'Recorded problem',helper:'Arin Velden',isDemo:true,projectId:'p',updates:['What I learned: Recorded lesson','Next step: Recorded next step']});});
it('IM02 missing, pending, unrelated or empty outcomes create no claim',()=>{expect(impactCards([], [o],people,'student')).toEqual([]);expect(impactCards([{...r,status:'accepted'}],[o],people,'student')).toEqual([]);expect(impactCards([r],[o],people,'outsider')).toEqual([]);expect(impactCards([r],[{...o,learned:'',next_step:''}],people,'student')).toEqual([]);});
it('IM03 absent identities stay unknown and private note is never copied',()=>{const privateOutcome={...o,private_note:'PRIVATE'};const card=impactCards([r],[privateOutcome],[],'student')[0];expect(card.helper).toBe('Member name not shared');expect(JSON.stringify(card)).not.toContain('PRIVATE');});

