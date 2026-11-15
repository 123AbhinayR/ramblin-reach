import {it,expect} from 'vitest';
import {builtAtTechSchema,builtAtTechSignal} from '@/lib/matching/built';
import {explainExchange} from '@/lib/learning/match';
const project={title:'Sensor logger',year:2014,lab:'Robotics club'};
it('BT01 exact title-tag match yields only recorded project facts',()=>{expect(builtAtTechSignal(['SENSOR'],project)).toEqual({score:3,reason:'Built at Tech: Sensor logger (2014) · Robotics club · self-reported'});expect(builtAtTechSignal(['sensors'],project)).toEqual({score:0,reason:null});expect(builtAtTechSignal(['sensor'],null)).toEqual({score:0,reason:null});});
it('BT02 year is displayed but never used to rank',()=>expect(builtAtTechSignal(['sensor'],project).score).toBe(builtAtTechSignal(['sensor'],{...project,year:2025}).score));
it('BT03 untrusted project history rejects unknown fields, invalid year and empty title',()=>{for(const bad of [{...project,employer:'Invented'},{...project,year:2014.5},{...project,title:'\u200b'}])expect(builtAtTechSchema.safeParse(bad).success).toBe(false);});
it('BT04 exchange score and first reason reuse the factual title match',()=>{const person={skills:[],interests:[],mentor_categories:[],can_teach:[],want_learn:[],built_at_tech:project};expect(explainExchange({tags:['sensor'],learn:[],teach:[]},person)).toEqual({score:3,reasons:[builtAtTechSignal(['sensor'],project).reason]});});
