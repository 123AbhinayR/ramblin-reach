import {notFound} from "next/navigation";
import {z} from "zod";
import {requireMember} from "@/lib/auth/guard";
import {loadInbox,loadRequest} from "@/lib/requests/data";
import {WorkspaceNav} from "@/components/workspace-nav";
import {Inbox} from "@/components/request-inbox";
export const dynamic="force-dynamic";
export default async function RequestPage({params}:{params:Promise<{id:string}>}){const {client,profile}=await requireMember();const parsed=z.uuid().safeParse((await params).id);if(!parsed.success)notFound();const row=await loadRequest(client,parsed.data);if(!row||!['accepted','completed'].includes(row.status))notFound();const data=await loadInbox(client);if(!data.rows.some(r=>r.id===row.id))data.rows.unshift(row);return <section className="container workspace"><WorkspaceNav/><h1>Inbox</h1>{profile.is_demo&&<p className="demo-strip">Demo account · simulated demo data</p>}<Inbox initial={data} viewerId={profile.id} selectedId={row.id}/></section>;}
