"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Inbox, UserRound, Users, CircleHelp } from "lucide-react";

const destinations = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/circles", label: "Circles", icon: CircleHelp },
  { href: "/people", label: "People", icon: Users },
  { href: "/requests", label: "Inbox", icon: Inbox },
  { href: "/profile", label: "Profile", icon: UserRound },
];
export function WorkspaceNav() {
  const pathname = usePathname();
  return <nav className="workspace-nav" aria-label="Workspace">
    {destinations.map(({ href, label, icon: Icon }) => <Link key={href} href={href}
      aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined}>
      <Icon size={19} aria-hidden="true"/><span>{label}</span>
    </Link>)}
  </nav>;
}
