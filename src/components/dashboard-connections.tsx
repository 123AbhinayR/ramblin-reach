import Link from "next/link";
import {RequestCard} from "./request-card";
import type {loadInbox} from "@/lib/requests/data";
export function DashboardConnections({inbox,viewerId,alumni}:{inbox:Awaited<ReturnType<typeof loadInbox>>;viewerId:string;alumni:boolean}){
 const pending=inbox.rows.filter(r=>r.recipient_id===viewerId&&r.status==="pending");const active=inbox.rows.filter(r=>r.status==="accepted");
 const selected=alumni?pending:inbox.rows.filter(r=>r.requester_id===viewerId&&["pending","accepted"].includes(r.status));
 const cards=(rows:typeof selected)=>rows.slice(0,3).map(request=><RequestCard key={request.id} request={request} viewerId={viewerId} peer={inbox.profiles.find(p=>p.id===(request.requester_id===viewerId?request.recipient_id:request.requester_id))} outcome={inbox.outcomes.find(o=>o.request_id===request.id&&o.reported_by===viewerId)}/>);
 return <section className="recent-paths"><h2>{alumni?"Your conversations":"My connections"}</h2>{selected.length?<div className="request-list">{cards(selected)}</div>:<p className="muted">{alumni?"No requests need a response. Choose the topics you offer and make your profile visible when you’re ready.":"Your sent requests will appear here. Start with someone whose experience fits your goal."}</p>}{alumni&&<><h2 className="subheading">Connections in progress</h2>{active.length?<div className="request-list">{cards(active)}</div>:<p className="muted">Accepted requests will appear here with the question and preferred format.</p>}</>}<Link className="text-link" href="/requests">All requests and private outcomes →</Link></section>;
}
