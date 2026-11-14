import "server-only";
import { publicEnvSchema, serverEnvSchema } from "./env-schema";
export function isConfigured() {
  return publicEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  }).success;
}
export function getServerEnv() { return serverEnvSchema.parse(process.env); }
