"use client";
import {useState,type FormEvent} from "react";
import {useRouter} from "next/navigation";
import {z} from "zod";
import {Button} from "./ui/button";
export function CircleActions({id,owner,resolved,parentId=null}:{id:string;owner?:boolean;resolved?:boolean;parentId?:string|null}){
 const router=useRouter();const [busy,setBusy]=useState(false);const [message,setMessage]=useState("");const [confirmDelete,setConfirmDelete]=useState(false);
 async function send(payload:Record<string,unknown>,form?:HTMLFormElement){setBusy(true);setMessage("");try{
  const response=await fetch(`/api/circles/${id}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});const body:unknown=await response.json();
  if(!response.ok){setMessage(z.object({error:z.object({message:z.string()})}).parse(body).error.message);return;}
  form?.reset();setMessage(payload.action==="report"?"Report recorded for moderation.":payload.action==="comment"?"Reply posted.":"Discussion updated.");
  if(payload.action==="delete")router.push("/circles");router.refresh();
 }catch{setMessage("Could not save. Try again.");}finally{setBusy(false);}}
 function reply(event:FormEvent<HTMLFormElement>){event.preventDefault();const form=event.currentTarget;void send({action:"comment",body:new FormData(form).get("body"),parent_id:parentId},form);}
 return <div className="circle-actions">
  {owner&&<div className="reach-actions"><Button variant="outline" disabled={busy} onClick={()=>void send({action:"resolve",resolved:!resolved})}>{resolved?"Reopen discussion":"Mark resolved"}</Button><Button variant="ghost" disabled={busy} onClick={()=>setConfirmDelete(!confirmDelete)}>Delete discussion</Button>{confirmDelete&&<div role="group" aria-label="Confirm deletion"><p>Delete this discussion and its replies?</p><Button disabled={busy} onClick={()=>void send({action:"delete"})}>Confirm delete</Button><Button variant="ghost" onClick={()=>setConfirmDelete(false)}>Keep discussion</Button></div>}</div>}
  {!resolved&&<form className="form-stack" onSubmit={reply}><label>{parentId?"Reply to comment":"Add a reply"}<textarea name="body" required minLength={2} maxLength={1000} rows={2}/></label><Button disabled={busy}>{busy?"Saving…":"Post reply"}</Button></form>}
  {!parentId&&!owner&&<details><summary className="text-link">Report discussion</summary><form className="form-stack" onSubmit={event=>{event.preventDefault();const form=event.currentTarget;void send({action:"report",reason:new FormData(form).get("reason")},form);}}><label>Reason<textarea name="reason" required minLength={10} maxLength={500}/></label><Button variant="outline" disabled={busy}>Submit report</Button></form></details>}
  <p role="status">{message}</p>
 </div>;
}
