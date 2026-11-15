import { z } from "zod";
export const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
});
export const serverEnvSchema = z.object({
  APP_ENV: z.enum(["local", "test", "staging", "production"]).default("local"),
  DEMO_MODE: z.enum(["0", "1", "true", "false"]).default("0").transform(v=>v==="true"?"1":v==="false"?"0":v),
  MOCK_AI: z.enum(["0", "1"]).default("1"),
  NEXT_PUBLIC_APP_URL: z.url().default("http://127.0.0.1:3000"),
}).superRefine((value, context) => {
  if (value.APP_ENV === "production" && value.DEMO_MODE === "1") {
    context.addIssue({ code: "custom", message: "Demo accounts are forbidden in production.", path: ["DEMO_MODE"] });
  }
});
