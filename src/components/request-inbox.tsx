"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {useRouter} from "next/navigation";
import {RequestCard} from "./request-card";
import type {loadInbox} from "@/lib/requests/data";
import {inboxSchema} from "@/lib/requests/inbox-schema";
import {Thread} from "./request-thread";
type InboxData=Awaited<ReturnType<typeof loadInbox>>;
export function Inbox({initial,viewerId,selectedId}:{initial:InboxData;viewerId:string;selectedId?:string}){
 const [polled,setData]=useState<InboxData|null>(null);const data=polled??initial;const [error,setError]=useState('');const router=useRouter();

 useEffect(()=>{let active=true;async function poll(){try{const r=await fetch('/api/requests',{cache:'no-store'});if(!r.ok)throw new Error();const value=inboxSchema.parse(await r.json());if(active){setData(value);setError('');}}catch{if(active)setError('Inbox could not refresh. Retrying shortly.');}}const timer=setInterval(()=>void poll(),5000);return()=>{active=false;clearInterval(timer);};},[]);
 const selected=data.rows.find(r=>r.id===selectedId);
 const peer=(r:InboxData['rows'][number])=>data.profiles.find(p=>p.id===(r.requester_id===viewerId?r.recipient_id:r.requester_id));
 return <>{error&&<p role="alert">{error}</p>}<div className={`inbox-layout ${selected?'has-thread':''}`}><div className="inbox-list">{(['Received','Sent'] as const).map(box=><section className="inbox-section" key={box}><h2>{box}</h2>{data.rows.filter(r=>box==='Received'?r.recipient_id===viewerId:r.requester_id===viewerId).map(r=>{const unread=data.unreadIds.includes(r.id);return <div key={r.id} id={`request-${r.id}`}><RequestCard request={r} viewerId={viewerId} peer={peer(r)} outcome={data.outcomes.find(o=>o.request_id===r.id&&o.reported_by===viewerId)}/>{['accepted','completed'].includes(r.status)&&<Link className="thread-link" href={`/requests/${r.id}`} aria-current={r.id===selectedId?'page':undefined}>Open thread with {peer(r)?.display_name??'member'} {unread&&<strong>· Unread</strong>}</Link>}</div>;})}{!data.rows.some(r=>box==='Received'?r.recipient_id===viewerId:r.requester_id===viewerId)&&<p className="panel">No {box.toLowerCase()} requests yet. <Link href={box==='Sent'?'/people':'/profile'}>{box==='Sent'?'Find a Jacket':'Set your availability'}</Link></p>}</section>)}</div><section className="inbox-thread" aria-label="Conversation">{selected?<><Link href="/requests" className="text-link thread-back">← Back to Inbox</Link><h2>Thread with {peer(selected)?.display_name??'member'}</h2><p className="field-hint">Private to participants · {selected.status==='completed'?'Closed':'Accepted ReachCard'}</p><Thread key={selected.id} requestId={selected.id} viewerId={viewerId} onClosed={()=>router.refresh()}/></>:<div className="panel"><h2>Your conversations</h2><p>Requests need to be accepted before a thread opens.</p></div>}</section></div></>;
}



