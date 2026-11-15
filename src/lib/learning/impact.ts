export type ImpactRequest={id:string;requester_id:string;recipient_id:string;status:string;goal_context:string;project_id?:string|null};
export type ImpactOutcome={id:string;request_id:string;reported_by:string;learned:string;helped:string;next_step:string};
export type ImpactMember={id:string;display_name:string;is_demo:boolean};
/** Private participant view. Never infer a result, endorsement or identity from missing records. */
export function impactCards(requests:ImpactRequest[],outcomes:ImpactOutcome[],members:ImpactMember[],viewerId:string){
 return outcomes.filter(o=>o.reported_by===viewerId).flatMap(o=>{const r=requests.find(r=>r.id===o.request_id&&r.status==='completed'&&(r.requester_id===viewerId||r.recipient_id===viewerId));if(!r)return [];
 const updates=[o.learned&&`What I learned: ${o.learned}`,o.helped&&`What I helped with: ${o.helped}`,o.next_step&&`Next step: ${o.next_step}`].filter((s):s is string=>Boolean(s.trim()));if(!updates.length)return [];
 const helper=members.find(p=>p.id===r.recipient_id),learner=members.find(p=>p.id===r.requester_id);
 return [{id:o.id,problem:r.goal_context,helper:helper?.display_name??'Member name not shared',learner:learner?.display_name??'Member name not shared',updates,projectId:r.project_id??null,isDemo:!!helper?.is_demo||!!learner?.is_demo}];
 }).sort((a,b)=>a.id.localeCompare(b.id)).slice(0,12);
}
