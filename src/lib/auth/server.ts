import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getServerEnv } from "@/lib/env";
import { publicEnvSchema } from "@/lib/env-schema";
import type { Database } from "@/lib/supabase/database.types";

export async function authClient(writable = false) {
  getServerEnv();
  const env = publicEnvSchema.parse(process.env);
  const jar = await cookies();
  return createServerClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (values) => {
        // Server component refresh is handled by Proxy before rendering.
        if (writable) values.forEach(({ name, value, options }) => jar.set(name, value, options));
      },
    },
  });
}
