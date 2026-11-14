import { expect, it } from "vitest";
import { parseGoal } from "@/lib/intent/parse";
it("P01 sensor circuit goals classify without AI", () => {
  const result = parseGoal({ goalText: "sensor project with electronic circuit" });
  expect(result.intent).toBe("project"); expect(result.tags).toEqual(expect.arrayContaining(["sensor", "electronics"]));
});
it("P02 relocation identifies only an explicitly mentioned metro", () => {
  expect(parseGoal({ goalText: "I am moving to Seattle" })).toMatchObject({ intent: "relocation", targetMetro: "Seattle, WA" });
  expect(parseGoal({ goalText: "I am moving somewhere new" }).targetMetro).toBeNull();
});
it("P03 company inference requires explicit text", () => expect(parseGoal({ goalText: "network with engineers at Microsoft" })).toMatchObject({ intent: "career", targetCompany: "microsoft" }));
it("P04 manual intent overrides keyword inference", () => expect(parseGoal({ goalText: "I want to write code", intent: "relocation" }).intent).toBe("relocation"));
it("P06 user company is preserved without claiming verification", () => expect(parseGoal({ goalText: "Learn about an unfamiliar company", targetCompany: "Example organization" }).targetCompany).toBe("Example organization"));
it("P15 repeated parsing is deterministic", () => {
  const input = { goalText: "Build a sensor and seek startup funding" };
  expect(parseGoal(input)).toEqual(parseGoal(input));
});
