import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";
export function SetupState() {
  return <section className="container narrow page-space"><div className="empty-state"><span className="icon-tile"><ShieldCheck /></span><p className="eyebrow">A trusted community starts here</p><h1>We’re getting your workspace ready.</h1><p>Member sign-in will be available once the secure connection is configured. Your profile and requests will always require a real, verified account.</p><Button asChild><Link href="/">Back to Ramblin’ Reach</Link></Button></div></section>;
}
