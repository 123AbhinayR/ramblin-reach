import { describe, expect, it } from "vitest";
import { goalInputSchema, INTENTS, normalizeText } from "@/lib/domain/schemas";
import { serverEnvSchema } from "@/lib/env-schema";
describe("canonical boundaries", () => {
  it("P05 rejects empty goals", () => { expect(goalInputSchema.safeParse({ goalText: "" }).success).toBe(false); });
  it("P19 rejects oversized and invisible goals", () => {
    for (const goalText of ["x".repeat(501), "\u200b".repeat(100)]) expect(goalInputSchema.safeParse({ goalText }).success).toBe(false);
  });
  it("preserves canonical intents and refuses owner injection", () => {
    expect(INTENTS).toEqual(["project", "career", "relocation"]);
    expect(goalInputSchema.safeParse({ goalText: "Build a small sensor", ownerId: "somebody-else" }).success).toBe(false);
  });
  it("normalizes Unicode without turning whitespace into content", () => { expect(normalizeText("  Ａ\u200b  ")).toBe("A"); });
  it("forbids production demo mode without requiring AI keys", () => {
    expect(serverEnvSchema.safeParse({ APP_ENV: "production", DEMO_MODE: "1" }).success).toBe(false);
    expect(serverEnvSchema.safeParse({ APP_ENV: "staging", DEMO_MODE: "1" }).success).toBe(true);
    expect(serverEnvSchema.parse({}).MOCK_AI).toBe("1");
  });
});
