import {expect,it} from "vitest";
import {recentGoalHistory} from "@/lib/path/history";
const goal={id:"first",goal_text:"Build a sensor",intent:"project" as const,target_company:null,target_metro:null,extracted_tags:["sensor"],created_at:"2026-11-14T10:00:00Z"};
it("Home groups repeated goal saves and links the newest without mutating records",()=>{
 const input=[goal,{...goal,id:"newest",goal_text:"  Build   a SENSOR ",created_at:"2026-11-14T11:00:00Z"}];const snapshot=structuredClone(input);
 const result=recentGoalHistory(input);expect(result).toHaveLength(1);expect(result[0]).toMatchObject({goal:{id:"newest"},saves:2});expect(input).toEqual(snapshot);
});
it("Home keeps distinct companies, cities and intents separate",()=>{expect(recentGoalHistory([goal,{...goal,id:"company",target_company:"Microsoft"},{...goal,id:"city",target_metro:"Seattle, WA"},{...goal,id:"career",intent:"career"}])).toHaveLength(4);});
it("Home history is bounded, deterministic, and handles an empty account",()=>{expect(recentGoalHistory([])).toEqual([]);const input=Array.from({length:6},(_,i)=>({...goal,id:String(i),goal_text:`Goal ${i}`}));expect(recentGoalHistory(input)).toHaveLength(4);expect(recentGoalHistory(input)).toEqual(recentGoalHistory([...input].reverse()));});
