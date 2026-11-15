"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "./brand";
import { Button } from "./ui/button";
export function SiteHeader() {
  const path=usePathname();
  const workspace=["/dashboard","/people","/requests","/profile","/path","/circles","/projects","/notifications","/demo"].some(prefix=>path===prefix||path.startsWith(`${prefix}/`));
  return <header className="site-header"><div className="container header-inner">
    <Brand /><nav aria-label="Main navigation" className="header-nav"><Link href="/#how-it-works">How it works</Link><Link href="/#our-approach">Our approach</Link></nav>
    <Button asChild variant="outline"><Link href={workspace?"/dashboard":"/login"}>{workspace?"My workspace":"Sign in"} <ArrowUpRight size={16} /></Link></Button>
  </div></header>;
}
