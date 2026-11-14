import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "./brand";
import { Button } from "./ui/button";
export function SiteHeader() {
  return <header className="site-header"><div className="container header-inner">
    <Brand /><nav aria-label="Main navigation" className="header-nav"><Link href="/#how-it-works">How it works</Link><Link href="/#our-approach">Our approach</Link></nav>
    <Button asChild variant="outline"><Link href="/login">Sign in <ArrowUpRight size={16} /></Link></Button>
  </div></header>;
}
