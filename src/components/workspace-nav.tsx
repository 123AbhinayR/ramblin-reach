import Link from "next/link";
import { Home, Inbox, UserRound, Users } from "lucide-react";
export function WorkspaceNav(){return <nav className="workspace-nav" aria-label="Workspace"><Link href="/dashboard"><Home size={17}/>Home</Link><Link href="/people"><Users size={17}/>People</Link><Link href="/requests"><Inbox size={17}/>Requests</Link><Link href="/profile"><UserRound size={17}/>Profile</Link></nav>;}
