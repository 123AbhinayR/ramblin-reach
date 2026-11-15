import {availableNow} from "./availability";
import {builtAtTechSignal} from "./built";
import {labels,canonicalLocation,normalizeLocation} from "@/lib/domain/schemas";
import type {Candidate,Filters} from "./schemas";
const canonical=(value:string)=>value.normalize("NFKC").trim().toLowerCase();
export function rankMatches(candidates:Candidate[],filters:Filters,viewerId:string,asOf="1970-01-01T00:00:00Z"){
 const tags=filters.skills.split(",").map(canonical).filter(Boolean);
 const weights=filters.intent==="career"?[25,15,35,5,10,10]:filters.intent==="relocation"?[30,10,5,35,10,10]:[25,40,5,5,15,10];
 return candidates.filter(person=>person.id!==viewerId&&person.visible&&person.verification_state!=="pending")
 .map(person=>{
  const available=!person.paused&&person.used<person.monthly_cap&&person.help_topics.length>0;
  const skills=new Set([...person.skills,...person.projects.flatMap(p=>p.skills)].map(canonical));
  const overlap=tags.filter(tag=>skills.has(tag));const company=!!filters.company&&canonical(person.company_name??"")===canonical(filters.company);const metro=!!filters.metro&&canonicalLocation(normalizeLocation(person.metro??""))===canonicalLocation(normalizeLocation(filters.metro));
  const context=!!filters.context&&[person.major??"",...person.gt_topics].some(t=>canonical(t)===canonical(filters.context));
  const topic=filters.topic?person.help_topics.includes(filters.topic):person.help_topics.length>0;
  const baseScore=Math.round((topic?weights[0]*(filters.topic?1:0.5):0)+weights[1]*Math.min(overlap.length/Math.min(Math.max(tags.length,1),2),1)+(company?weights[2]:0)+(metro?weights[3]:0)+(context?weights[4]:0)+weights[5]*Math.max(0,1-person.used/person.monthly_cap));
  const built=builtAtTechSignal(tags,person.built_at_tech);const score=Math.min(100,baseScore+built.score);
  const reasons:string[]=built.reason?[built.reason]:[];if(topic&&filters.topic)reasons.push(`Offers ${labels[filters.topic].toLowerCase()}`);if(overlap.length)reasons.push(`Shared project skills: ${overlap.slice(0,3).join(", ")}`);if(company)reasons.push(`Self-reported experience at ${person.company_name}`);if(metro)reasons.push(`Based in ${person.metro}`);if(context)reasons.push(`Shared Georgia Tech context: ${filters.context}`);if(!reasons.length&&person.help_topics[0])reasons.push(`Offers ${labels[person.help_topics[0]].toLowerCase()}`);
  return {...person,available,availableNow:person.affiliation==="alumni"&&availableNow(person.available_until,asOf,available),availabilityAsOf:asOf,remaining:Math.max(0,person.monthly_cap-person.used),score,reasons:reasons.slice(0,3),matches:(!filters.company||company)&&(!filters.metro||metro)&&(!filters.topic||topic)&&(!tags.length||overlap.length>0)&&(!filters.context||context)&&(!filters.affiliation||person.affiliation===filters.affiliation)};
 }).filter(p=>p.matches&&(filters.availableOnly!=="true"||p.available)&&(filters.nowOnly!=="true"||p.availableNow)).sort((a,b)=>b.score-a.score||(a.used/a.monthly_cap-b.used/b.monthly_cap)||a.id.localeCompare(b.id));
}
export function matchResults(candidates:Candidate[],filters:Filters,viewerId:string,asOf="1970-01-01T00:00:00Z"){
 const exact=rankMatches(candidates,filters,viewerId,asOf);
 const alternatives=exact.length||!filters.company||!filters.metro?[]:rankMatches(candidates,{...filters,company:""},viewerId,asOf).slice(0,3).map(p=>({...p,relaxedCriteria:"Same city; company filter removed"}));
 const start=filters.cursor?exact.findIndex(p=>p.id===filters.cursor)+1:0;const items=exact.slice(start,start+filters.limit);
 return {items,alternatives,nextCursor:start+items.length<exact.length?items.at(-1)?.id??null:null};
}
