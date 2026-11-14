import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { publicEnvSchema } from "@/lib/env-schema";

export async function proxy(request: NextRequest) {
  const env = publicEnvSchema.safeParse(process.env);
  let response = NextResponse.next({ request });
  response.headers.set("Cache-Control", "private, no-store");
  if (!env.success) return response;
  const client = createServerClient(env.data.NEXT_PUBLIC_SUPABASE_URL, env.data.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values, headers) {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
        response.headers.set("Cache-Control", "private, no-store");
      },
    },
  });
  await client.auth.getClaims();
  return response;
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|$).*)"] };
