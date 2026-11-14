import Link from "next/link";
import { requireMember } from "@/lib/auth/guard";
import { MembershipForm } from "@/components/membership-form";
import { SignOut } from "@/components/sign-out";
export const dynamic = "force-dynamic";
export default async function OnboardingPage() {
  const { profile, eligible } = await requireMember(false);
  return <section className="container narrow page-space"><div className="panel"><p className="eyebrow">A community built on trust</p><h1>{eligible ? "You’re ready to begin." : "One more step."}</h1><p className="muted">{eligible ? "Your account can access the community. You choose whether other members can find you." : "Your email account is confirmed. Membership needs a separate manual review before you can discover members or send requests."}</p>{profile.is_demo && <p className="notice">Demo account · fictional identity for testing</p>}{eligible ? <Link className="text-link" href="/dashboard">Go to your workspace →</Link> : <MembershipForm />}<Link className="text-link" href="/profile">Set up your private profile →</Link><SignOut /></div></section>;
}
