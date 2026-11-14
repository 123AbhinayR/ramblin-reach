import { SetupState } from "@/components/setup-state";
import { AuthForm } from "@/components/auth-form";
import { isConfigured } from "@/lib/env";
import Link from "next/link";
export const dynamic = "force-dynamic";
export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (!isConfigured()) return <SetupState />;
  const params = await searchParams;
  const mode = params.mode === "signup" || params.mode === "recover" || params.mode === "reset" ? params.mode : "login";
  return <section className="container narrow page-space"><div className="panel auth-panel"><p className="eyebrow">Your next step starts here</p><h1>{({ login: "Welcome back.", signup: "Join the community.", recover: "Let’s get you back in.", reset: "A fresh start." }[mode])}</h1><p className="muted">{mode === "signup" ? "Confirm your email, then request membership review. Your profile stays private until you choose to share it." : "Learn from the campus. Learn from each other."}</p><AuthForm mode={mode} confirmationError={params.error === "confirmation"} /><div className="auth-links"><Link href={mode === "login" ? "/login?mode=signup" : "/login"}>{mode === "login" ? "Create an account" : "Back to sign in"}</Link>{mode === "login" && <Link href="/login?mode=recover">Forgot password?</Link>}</div></div></section>;
}
