import { describe, expect, it } from "vitest";
import { credentialsSchema, profileInputSchema } from "@/lib/auth/schemas";
const profile = { display_name: "Learner", visible: false, paused: true, major: null, grad_year: null, company_name: null, metro: null, role_title: null, bio: null, skills: [], gt_topics: [], help_topics: [], monthly_cap: 2 };
describe("account input boundaries", () => {
  it("S04/S05/S06 rejects privilege fields on profile writes", () => {
    for (const field of ["verification_state", "affiliation", "is_demo", "verified_at", "id"]) expect(profileInputSchema.safeParse({ ...profile, [field]: "forged" }).success).toBe(false);
  });
  it("rejects unsupported metros, oversized tags and invalid caps", () => {
    expect(profileInputSchema.safeParse({ ...profile, metro: "Precise home address" }).success).toBe(false);
    expect(profileInputSchema.safeParse({ ...profile, skills: ["x".repeat(41)] }).success).toBe(false);
    expect(profileInputSchema.safeParse({ ...profile, monthly_cap: 11 }).success).toBe(false);
  });
  it("normalizes display names and accepts default private profile", () => expect(profileInputSchema.parse({ ...profile, display_name: "  Learner\u200b " }).display_name).toBe("Learner"));
  it("requires valid email and a 12-character password", () => {
    expect(credentialsSchema.safeParse({ email: "a@example.test", password: "short" }).success).toBe(false);
    expect(credentialsSchema.safeParse({ email: "a@example.test", password: "long-test-password" }).success).toBe(true);
  });
});
