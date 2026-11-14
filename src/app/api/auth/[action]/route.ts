import { z } from "zod";
import { authClient } from "@/lib/auth/server";
import { credentialsSchema, emailSchema, passwordSchema } from "@/lib/auth/schemas";
import { getServerEnv } from "@/lib/env";
import { failure, HttpError, json, readInput } from "@/lib/http";

export async function POST(request: Request, context: { params: Promise<{ action: string }> }) {
  try {
    const { action } = await context.params;
    const client = await authClient(true);
    const base = getServerEnv().NEXT_PUBLIC_APP_URL;
    if (action === "login" || action === "signup") {
      const input = await readInput(request, credentialsSchema);
      const result = action === "login" ? await client.auth.signInWithPassword(input) : await client.auth.signUp({ ...input, options: { emailRedirectTo: `${base}/auth/callback` } });
      if (result.error) throw new HttpError(400, "AUTH_FAILED", action === "login" ? "Sign-in failed. Check your email, password, and email confirmation." : "We couldn’t create an account. Try again later or sign in.");
      return json({ message: action === "signup" ? "Check your email to confirm your account. Membership approval is a separate step." : "Signed in.", redirect: action === "login" ? "/dashboard" : null });
    }
    if (action === "recover") {
      const input = await readInput(request, emailSchema);
      await client.auth.resetPasswordForEmail(input.email, { redirectTo: `${base}/auth/callback?next=reset` });
      return json({ message: "If this email has an account, you’ll receive a password reset link." });
    }
    if (action === "reset") {
      const input = await readInput(request, passwordSchema);
      const { data } = await client.auth.getUser();
      if (!data.user) throw new HttpError(401, "UNAUTHENTICATED", "Open the password reset link in your email first.");
      const { error } = await client.auth.updateUser(input);
      if (error) throw new HttpError(400, "AUTH_FAILED", "Password update failed. Request a new reset link and try again.");
      await client.auth.signOut({ scope: "global" });
      return json({ message: "Password updated. Sign in with your new password.", redirect: "/login" });
    }
    if (action === "logout") {
      await readInput(request, z.strictObject({}));
      const { error } = await client.auth.signOut({ scope: "local" });
      if (error) throw new Error("Sign-out failed");
      return json({ redirect: "/login" });
    }
    throw new HttpError(404, "NOT_FOUND", "This action is unavailable.");
  } catch (error) { return failure(error); }
}
