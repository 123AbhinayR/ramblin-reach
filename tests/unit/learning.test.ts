import {describe,it,expect} from 'vitest';
import {explainExchange,exchangeMatches,overlap} from '@/lib/learning/match';
import {candidateSchema} from '@/lib/matching/schemas';
import {notificationHref} from '@/lib/learning/schemas';
const id='11111111-1111-4111-8111-111111111111';
const person=candidateSchema.parse({id,display_name:'Fictional helper',affiliation:'alumni',verification_state:'demo',is_demo:true,visible:true,paused:false,major:null,grad_year:null,company_name:null,metro:null,role_title:null,bio:null,skills:['sensor'],gt_topics:[],help_topics:['project_guidance'],monthly_cap:2,used:0,projects:[],can_teach:['calibration'],want_learn:['typescript'],interests:['electronics'],mentor_categories:['projects']});
const context={tags:['sensor','electronics'],category:'projects',learn:['calibration'],teach:['typescript']};
describe('Phase 4 deterministic matching and notification routing',()=>{
 it('LX01 exact normalized deduplicated tags, no inferred similarities',()=>expect(overlap([' SENSOR ','sensor','\u200bcalibration'],['sensor','calibration','sensors'])).toEqual(['calibration','sensor']));
 it('LX02 reasons reference each stored signal',()=>{const m=explainExchange(context,person);expect(m.reasons).toEqual(['Shared skills: sensor','Shared interests: electronics','Can teach what you want to learn: calibration','Wants to learn what you can teach: typescript','Interested in projects']);});
 it('LX03 paused, capped, hidden, pending and self are ineligible',()=>{for(const changed of [{paused:true},{used:2},{visible:false},{verification_state:'pending' as const},{help_topics:[]}])expect(exchangeMatches(context,[{...person,...changed}],'viewer')).toEqual([]);expect(exchangeMatches(context,[person],person.id)).toEqual([]);});
 it('LX04 stable order independent of inputs; unrelated personal attributes ignored',()=>{const second={...person,id:'22222222-2222-4222-8222-222222222222',gender:'unread'};expect(exchangeMatches(context,[second,person],'viewer').map(p=>p.id)).toEqual([person.id,second.id]);expect(explainExchange(context,second)).toEqual(explainExchange(context,person));});
 it('LX05 no match has no invented explanation',()=>expect(exchangeMatches({tags:['unrelated'],learn:[],teach:[]},[person],'viewer')).toEqual([]));
 it('LX06 topic overlap dominates category-only suggestions',()=>{const categoryOnly={...person,id:'22222222-2222-4222-8222-222222222222',skills:[],interests:[],can_teach:[],want_learn:[]};expect(exchangeMatches(context,[categoryOnly,person],'viewer')[0].id).toBe(id);});
 it('LX07 notification routes never contain contact or request text',()=>{expect(notificationHref({kind:'new_request',request_id:id,post_id:null})).toBe(`/requests#request-${id}`);expect(notificationHref({kind:'new_message',request_id:id,post_id:null})).toBe(`/requests/${id}`);expect(notificationHref({kind:'matched_request',request_id:null,post_id:id})).toBe(`/circles/${id}`);});
});
