import Link from "next/link";
import { Home, UserRound } from "lucide-react";
export function WorkspaceNav(){return <nav className="workspace-nav" aria-label="Workspace"><Link href="/dashboard"><Home size={17}/>Home</Link><Link href="/profile"><UserRound size={17}/>Profile</Link></nav>;}
