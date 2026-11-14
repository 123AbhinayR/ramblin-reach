"use client";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";

const responseSchema = z.object({ message: z.string().optional(), redirect: z.string().nullable().optional(), error: z.object({ message: z.string() }).optional() });
export function AuthForm({ mode, confirmationError = false }: { mode: "login" | "signup" | "recover" | "reset"; confirmationError?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(confirmationError ? "That confirmation link could not be used. Try signing in or request a new recovery email." : "");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const form = new FormData(event.currentTarget);
    const input = { ...(mode !== "reset" && { email: form.get("email") }), ...(mode !== "recover" && { password: form.get("password") }) };
    try {
      const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
      const result = responseSchema.parse(await response.json());
      if (!response.ok) { setMessage(result.error?.message ?? "Check your details and try again."); return; }
      // Auth changes need a fresh document, clearing any prefetched session-bound routes.
      if (result.redirect && ["/dashboard", "/login"].includes(result.redirect)) window.location.replace(new URL(result.redirect, window.location.origin).href);
      else setMessage(result.message ?? "Saved.");
    } catch { setMessage("We couldn’t connect. Please try again."); } finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="form-stack">
    {mode !== "reset" && <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label>}
    {mode !== "recover" && <div><label>{mode === "reset" ? "New password" : "Password"}<input name="password" type="password" minLength={12} maxLength={128} required autoComplete={mode === "login" ? "current-password" : "new-password"} aria-describedby="password-hint" /></label><span id="password-hint" className="field-hint">Use at least 12 characters.</span></div>}
    <p role="status" aria-live="polite" className="form-message">{message}</p>
    <Button disabled={busy} type="submit">{busy ? "Please wait…" : ({ login: "Sign in", signup: "Create account", recover: "Send reset link", reset: "Save new password" }[mode])}</Button>
  </form>;
}
