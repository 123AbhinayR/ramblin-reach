import {requireMember} from "@/lib/auth/guard";
import {loadInbox} from "@/lib/requests/data";
import {WorkspaceNav} from "@/components/workspace-nav";
import {Inbox} from "@/components/request-inbox";
export const dynamic="force-dynamic";
export default async function RequestsPage(){const {client,profile}=await requireMember();return <section className="container workspace"><WorkspaceNav/><div className="workspace-heading"><div><p className="eyebrow">Georgia Tech student and alumni network</p><h1>Inbox</h1><p className="muted">Your conversations. Requests need to be accepted before a thread opens.</p></div></div><Inbox initial={await loadInbox(client)} viewerId={profile.id}/></section>;}
