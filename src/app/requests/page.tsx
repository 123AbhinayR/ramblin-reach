import {requireMember} from "@/lib/auth/guard";
import {loadInbox} from "@/lib/requests/data";
import {WorkspaceNav} from "@/components/workspace-nav";
import {Inbox} from "@/components/request-inbox";
export const dynamic="force-dynamic";
export default async function RequestsPage(){const {client,profile}=await requireMember();return <section className="container workspace"><WorkspaceNav/><div className="workspace-heading"><div><p className="eyebrow">ReachCard</p><h1>Your Inbox.</h1><p className="muted">Requests and accepted conversations · private to participants.</p></div></div>{profile.is_demo&&<p className="demo-strip">Demo account · simulated demo data</p>}<Inbox initial={await loadInbox(client)} viewerId={profile.id}/></section>;}
