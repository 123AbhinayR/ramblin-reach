import { NextResponse } from "next/server";
import { z } from "zod";
import { authClient } from "@/lib/auth/server";
import { getServerEnv } from "@/lib/env";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const code = z.string().min(1).max(2048).safeParse(params.get("code"));
  const client = await authClient(true);
  const result = code.success ? await client.auth.exchangeCodeForSession(code.data) : { error: true };
  const path = result.error ? "/login?error=confirmation" : params.get("next") === "reset" ? "/login?mode=reset" : "/onboarding";
  const response = NextResponse.redirect(new URL(path, getServerEnv().NEXT_PUBLIC_APP_URL));
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
