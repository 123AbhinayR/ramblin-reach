import {expect,it} from "vitest";
import {locationSchema,normalizeLocation} from "@/lib/domain/schemas";
import {GOAL_EXAMPLES} from "@/lib/path/examples";
import {parseGoal} from "@/lib/intent/parse";
it("A1 six distinct goal examples remain valid",()=>{expect(GOAL_EXAMPLES).toHaveLength(6);for(const example of GOAL_EXAMPLES)expect(parseGoal({goalText:example.goalText,intent:example.intent}).intent).toBe(example.intent);});
it("A2 existing city aliases remain canonical",()=>expect(normalizeLocation("  seattle  ")).toBe("Seattle, WA"));
it("A2 international and custom cities are allowed without merging distinct cities",()=>{expect(locationSchema.parse("London, UK")).toBe("London, UK");expect(locationSchema.parse("Seattle, Australia")).toBe("Seattle, Australia");expect(locationSchema.parse("Lagos, Nigeria")).toBe("Lagos, Nigeria");});
it("A2 rejects street addresses, links and contact details",()=>{for(const location of ["https://example.com","123 Main Street","a@example.com","x".repeat(81)])expect(locationSchema.safeParse(location).success).toBe(false);});
