import { SetupState } from "@/components/setup-state";
import { isConfigured } from "@/lib/env";
import { requireMember } from "@/lib/auth/guard";
import { SignOut } from "@/components/sign-out";
import Link from "next/link";
export const dynamic = "force-dynamic";
export default async function DashboardPage() {
  if (!isConfigured()) return <SetupState />;
  const { profile } = await requireMember();
  return <section className="container narrow page-space"><div className="panel"><p className="eyebrow">Your Ramblin’ Reach workspace</p><h1>Welcome, {profile.display_name}.</h1>{profile.is_demo && <p className="notice">Demo account · fictional profile, real authenticated session</p>}<p className="muted">Your account is ready. Start by choosing what you’d like to share with the community.</p><Link className="text-link" href="/profile">Set up your profile →</Link><SignOut /></div></section>;
}
