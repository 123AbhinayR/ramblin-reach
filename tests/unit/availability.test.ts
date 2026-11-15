import {it,expect} from 'vitest';
import {availableNow} from '@/lib/matching/availability';
const now='2026-11-14T12:00:00Z';
it('AV01 sixty-minute window includes now and excludes exact expiry',()=>{expect(availableNow('2026-11-14T13:00:00Z',now)).toBe(true);expect(availableNow(now,now)).toBe(false);expect(availableNow('2026-11-14T13:00:01Z',now)).toBe(false);});
it('AV02 malformed, absent, expired or ineligible availability is false',()=>{for(const v of [null,'invalid','2026-11-14T11:59:59Z'])expect(availableNow(v,now)).toBe(false);expect(availableNow('2026-11-14T12:30:00Z',now,false)).toBe(false);});

import {candidateSchema,filtersSchema} from '@/lib/matching/schemas';
import {rankMatches} from '@/lib/matching/rank';
it('AV03 People filter requires an active alumni window and ordinary service eligibility',()=>{const p=candidateSchema.parse({id:'11111111-1111-4111-8111-111111111111',display_name:'Fictional helper',affiliation:'alumni',verification_state:'demo',is_demo:true,visible:true,paused:false,major:null,grad_year:null,company_name:null,metro:null,role_title:null,bio:null,skills:[],gt_topics:[],help_topics:['project_guidance'],monthly_cap:2,used:0,projects:[],available_until:'2026-11-14T13:00:00Z'});const f=filtersSchema.parse({nowOnly:'true'});expect(rankMatches([p],f,'viewer',now).map(m=>m.id)).toEqual([p.id]);for(const changed of [{paused:true},{used:2},{affiliation:'student' as const}])expect(rankMatches([{...p,...changed}],f,'viewer',now)).toEqual([]);expect(rankMatches([p],f,'viewer','2026-11-14T13:00:00Z')).toEqual([]);});
