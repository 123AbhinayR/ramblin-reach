import {describe,it,expect} from "vitest";
import {postInputSchema,commentInputSchema,orderPosts,type CirclePost} from "../../src/lib/circles/schemas";
const input={category:"projects",kind:"help",title:"Sensor calibration",description:"Building a fictional sensor project.",specific_request:"How should I test calibration?",tags:["sensor"],project_url:null,github_url:null,team_size:null};
describe("Circles",()=>{
 it("CI01 validates required content and rejects forged ownership",()=>{expect(postInputSchema.safeParse(input).success).toBe(true);for(const patch of [{title:""},{specific_request:"short"},{category:"unknown"},{owner_id:"forged"},{tags:Array(9).fill("sensor")}])expect(postInputSchema.safeParse({...input,...patch}).success).toBe(false);});
 it("CI02 rejects unsafe project URLs",()=>{for(const project_url of ["javascript:alert(1)","http://example.com","https://127.0.0.1/a"])expect(postInputSchema.safeParse({...input,project_url}).success).toBe(false);});
 it("CI03 filters categories and ranks shared skills deterministically",()=>{
  const base={...postInputSchema.parse(input),id:"a",owner_id:"owner",created_at:"2026-11-14T10:00:00Z",updated_at:"2026-11-14T10:00:00Z",resolved:false};
  const posts:CirclePost[]=[{...base,id:"b",tags:[],created_at:"2026-11-14T11:00:00Z"},base,{...base,id:"c",category:"research"}];
  expect(orderPosts(posts,"projects","relevant",["SENSOR"]).map(p=>p.id)).toEqual(["a","b"]);
  expect(orderPosts(posts,"projects","recent",[]).map(p=>p.id)).toEqual(["b","a"]);expect(posts[0].id).toBe("b");
 });
 it("CI04 rejects empty/overlong comments and forged reply fields",()=>{for(const body of [" ","x".repeat(1001)])expect(commentInputSchema.safeParse({body,parent_id:null}).success).toBe(false);expect(commentInputSchema.safeParse({body:"Useful reply",parent_id:null,owner_id:"forged"}).success).toBe(false);});
});
