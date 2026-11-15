import {normalizeText} from '@/lib/domain/schemas';
import {builtAtTechSignal} from '@/lib/matching/built';
import type {Candidate} from '@/lib/matching/schemas';
export const overlap=(a:string[],b:string[])=>[...new Set(a.map(s=>normalizeText(s).toLowerCase()).filter(Boolean))].filter(s=>b.some(t=>normalizeText(t).toLowerCase()===s)).sort();
export type ExchangeContext={tags:string[];category?:string;learn:string[];teach:string[]};
export function explainExchange(context:ExchangeContext,person:Pick<Candidate,'skills'|'interests'|'mentor_categories'|'can_teach'|'want_learn'|'built_at_tech'>){
 const built=builtAtTechSignal(context.tags,person.built_at_tech);
 const signals=[
  {tags:overlap(context.tags,person.skills),label:'Shared skills',weight:3},
  {tags:overlap(context.tags,person.interests),label:'Shared interests',weight:2},
  {tags:overlap(context.learn,person.can_teach),label:'Can teach what you want to learn',weight:4},
  {tags:overlap(context.teach,person.want_learn),label:'Wants to learn what you can teach',weight:4},
 ];
 const reasons=signals.filter(s=>s.tags.length).map(s=>`${s.label}: ${s.tags.slice(0,3).join(', ')}`);
 const category=!!context.category&&person.mentor_categories.includes(context.category as Candidate['mentor_categories'][number]);
 if(category)reasons.push(`Interested in ${context.category}`);
 if(built.reason)reasons.unshift(built.reason);
 return {score:built.score+signals.reduce((sum,s)=>sum+s.weight*s.tags.length,category?1:0),reasons};
}
export function exchangeMatches(context:ExchangeContext,people:Candidate[],viewerId:string){
 return people.filter(p=>p.id!==viewerId&&p.visible&&p.verification_state!=='pending'&&!p.paused&&p.used<p.monthly_cap&&p.help_topics.length>0).map(p=>({...p,...explainExchange(context,p)})).filter(p=>p.score>0).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
}
