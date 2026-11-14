import { describe, expect, it } from "vitest";
import { createRequestSchema, isSafeProjectUrl } from "@/lib/requests/schemas";
import { evaluateReachReady } from "@/lib/requests/coaching";

const validBase = {
  recipientId: "00000000-0000-4000-8000-000000000001",
  helpTopic: "project_guidance" as const,
  format: "written_advice" as const,
  goalContext: "Building an environmental sensor prototype",
  specificQuestion: "How do you test sensor calibration before enclosure design?",
  idempotencyKey: "00000000-0000-4000-8000-000000000002",
};

describe("ReachReady and ReachCard field validation (C01–C15)", () => {
  it("C01 accepts goal context >= 10 chars and question >= 20 chars", () => {
    const input = {
      ...validBase,
      goalContext: "1234567890", // exactly 10 chars
      specificQuestion: "12345678901234567890", // exactly 20 chars
    };
    const parsed = createRequestSchema.safeParse(input);
    expect(parsed.success).toBe(true);
  });

  it("C02 rejects goal context < 10 chars or question < 20 chars", () => {
    const shortGoal = createRequestSchema.safeParse({
      ...validBase,
      goalContext: "123456789", // 9 chars
    });
    expect(shortGoal.success).toBe(false);

    const shortQuestion = createRequestSchema.safeParse({
      ...validBase,
      specificQuestion: "1234567890123456789", // 19 chars
    });
    expect(shortQuestion.success).toBe(false);
  });

  it("C03 rejects goal context > 240 chars or question > 400 chars", () => {
    const longGoal = createRequestSchema.safeParse({
      ...validBase,
      goalContext: "a".repeat(241),
    });
    expect(longGoal.success).toBe(false);

    const longQuestion = createRequestSchema.safeParse({
      ...validBase,
      specificQuestion: "q".repeat(401),
    });
    expect(longQuestion.success).toBe(false);
  });

  it("C04 rejects zero-width-only or whitespace-only question as empty after cleanup", () => {
    const zeroWidth = "\u200B\u200C\u200D\uFEFF".repeat(10);
    const result = createRequestSchema.safeParse({
      ...validBase,
      specificQuestion: zeroWidth,
    });
    expect(result.success).toBe(false);
  });

  it("C05 produces advisory warning for 'pick your brain' but remains sendable", () => {
    const input = {
      ...validBase,
      specificQuestion: "I want to pick your brain about sensors: which board did you use?",
    };
    const parsed = createRequestSchema.safeParse(input);
    expect(parsed.success).toBe(true);

    const feedback = evaluateReachReady(input);
    expect(feedback.warnings.some(w => w.includes("pick your brain"))).toBe(true);
  });

  it("C06 produces advisory warning for 'referral' without blocking send", () => {
    const input = {
      ...validBase,
      specificQuestion: "Could you give me a referral or share what the interview was like?",
    };
    const parsed = createRequestSchema.safeParse(input);
    expect(parsed.success).toBe(true);

    const feedback = evaluateReachReady(input);
    expect(feedback.warnings.some(w => w.includes("referral"))).toBe(true);
  });

  it("C07 hard blocks missing required help topic or format", () => {
    const missingTopic = createRequestSchema.safeParse({
      ...validBase,
      helpTopic: undefined,
    });
    expect(missingTopic.success).toBe(false);

    const missingFormat = createRequestSchema.safeParse({
      ...validBase,
      format: undefined,
    });
    expect(missingFormat.success).toBe(false);
  });

  it("C08 falls back cleanly to deterministic coaching without AI", () => {
    const feedback = evaluateReachReady({
      goalContext: "Building a sensor",
      specificQuestion: "How does it work",
    });
    expect(feedback.hints.length).toBeGreaterThan(0);
    expect(feedback.isReady).toBe(false);
  });

  it("C13 rejects dangerous project links (javascript, http, private IP, localhost)", () => {
    expect(isSafeProjectUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeProjectUrl("http://192.168.1.2/project")).toBe(false);
    expect(isSafeProjectUrl("https://localhost:3000/repo")).toBe(false);
    expect(isSafeProjectUrl("https://10.0.0.1/code")).toBe(false);
    expect(isSafeProjectUrl("https://test.internal/repo")).toBe(false);

    // Valid public https link
    expect(isSafeProjectUrl("https://github.com/gatech/sensor-project")).toBe(true);

    const rejected = createRequestSchema.safeParse({
      ...validBase,
      safeProjectUrl: "javascript:alert(1)",
    });
    expect(rejected.success).toBe(false);
  });

  it("C15 request requires no artifact link and sends safely when omitted", () => {
    const withoutUrl = createRequestSchema.safeParse({
      ...validBase,
      safeProjectUrl: undefined,
    });
    expect(withoutUrl.success).toBe(true);
    expect(withoutUrl.data?.safeProjectUrl).toBeUndefined();

    const emptyStringUrl = createRequestSchema.safeParse({
      ...validBase,
      safeProjectUrl: "",
    });
    expect(emptyStringUrl.success).toBe(true);
    expect(emptyStringUrl.data?.safeProjectUrl).toBeUndefined();
  });
});
