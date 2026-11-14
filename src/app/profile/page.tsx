import Link from "next/link";
import { requireMember } from "@/lib/auth/guard";
import { ProfileForm } from "@/components/profile-form";
import { SignOut } from "@/components/sign-out";
export const dynamic = "force-dynamic";
export default async function ProfilePage() {
  const { profile, eligible } = await requireMember(false);
  return <section className="container narrow page-space"><Link className="text-link" href={eligible ? "/dashboard" : "/onboarding"}>← Back to your workspace</Link><div className="panel"><p className="eyebrow">You choose what to share</p><h1>Your profile.</h1><p className="notice">{profile.is_demo ? "Demo profile · fictional information" : eligible ? "Approved member · employer information is self-reported" : "Membership pending · your profile is private"}</p><ProfileForm profile={profile} /><div className="section-divider"><SignOut /></div></div></section>;
}
