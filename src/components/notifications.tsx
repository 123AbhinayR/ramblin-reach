"use client";
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {z} from 'zod';
import {notificationRow,notificationLabels,notificationHref} from '@/lib/learning/schemas';
import {Button} from './ui/button';
const result=z.object({notifications:z.array(notificationRow)});
export function Notifications({compact=false}:{compact?:boolean}){
 const [items,setItems]=useState<z.infer<typeof notificationRow>[]>([]),[error,setError]=useState(''),[loading,setLoading]=useState(true);
 useEffect(()=>{let active=true;async function poll(){try{const r=await fetch('/api/notifications',{cache:'no-store'});if(!r.ok)throw new Error();const body=result.parse(await r.json());if(active){setItems(body.notifications);setError('');}}catch{if(active)setError('Updates could not refresh. Retrying shortly.');}finally{if(active)setLoading(false);}}void poll();const timer=setInterval(()=>void poll(),10000);return()=>{active=false;clearInterval(timer);};},[]);
 async function mark(id:string){try{const r=await fetch('/api/notifications',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});if(!r.ok)throw new Error();setItems(old=>old.map(n=>n.id===id?{...n,read_at:new Date().toISOString()}:n));}catch{setError('Could not mark this update read. Try again.');}}
 if(compact)return <div className="notification-launch"><Link className="text-link" href="/notifications">Updates{items.some(n=>!n.read_at)?` (${items.filter(n=>!n.read_at).length} unread)`:''}</Link>{error&&<span role="status">Updates unavailable</span>}</div>;
 return <section>{loading&&<p role="status">Loading updates…</p>}{error&&<p role="alert">{error}</p>}{!loading&&!items.length&&<p>No updates yet. New requests, messages and matching discussions appear here.</p>}{items.map(n=><article className="project-memory" key={n.id}><h2><Link href={notificationHref(n)}>{notificationLabels[n.kind]}</Link></h2>{n.reason&&<p>{n.reason}</p>}<p>{n.read_at?'Read':'Unread'} · {new Date(n.created_at).toLocaleDateString()}</p>{!n.read_at&&<Button variant="outline" onClick={()=>void mark(n.id)}>Mark read</Button>}</article>)}</section>;
}
