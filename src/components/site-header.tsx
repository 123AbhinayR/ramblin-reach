"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import { Brand } from "./brand";
import { Button } from "./ui/button";

export function SiteHeader() {
  const path=usePathname();
  const isWelcome = path === "/";
  const workspace=["/dashboard","/people","/requests","/profile","/path","/circles","/projects","/notifications","/demo"].some(prefix=>path===prefix||path.startsWith(`${prefix}/`));

  if (isWelcome) {
    return (
      <header className="site-header">
        <div className="container header-inner">
          <Brand />
          <div className="header-actions">
            <Link className="text-link" href="/circles">Browse Circles</Link>
            <Button asChild variant="outline">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <nav aria-label="Main navigation" className="header-nav">
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/circles">Circles</Link>
        </nav>
        <Button asChild variant="outline">
          <Link href={workspace?"/dashboard":"/login"}>
            {workspace?"My workspace":"Sign in"}
          </Link>
        </Button>
      </div>
    </header>
  );
}
