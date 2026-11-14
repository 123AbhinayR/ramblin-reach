import {expect,it} from "vitest";
import {projectInputSchema} from "@/lib/projects/schemas";
const value={title:"Sensor prototype",summary:"I built and calibrated a sensor.",skills:["sensor"],one_lesson:"Test calibration early.",visibility:"members",publishConsent:true};
it("C4 explicit consent required for project publication",()=>{expect(projectInputSchema.safeParse(value).success).toBe(true);expect(projectInputSchema.safeParse({...value,publishConsent:false}).success).toBe(false);expect(projectInputSchema.safeParse({...value,visibility:"private",publishConsent:false}).success).toBe(true);});
it("C4/S18 project edit refuses owner and private-outcome injection",()=>{expect(projectInputSchema.safeParse({...value,owner_id:"other"}).success).toBe(false);expect(projectInputSchema.safeParse({...value,private_note:"confidential"}).success).toBe(false);});
