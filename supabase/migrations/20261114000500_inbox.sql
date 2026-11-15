-- Accepted ReachCards are the conversation; no parallel request/conversation entity.
create table public.request_messages (
 id bigint generated always as identity primary key,
 request_id uuid not null references public.connection_requests(id),
 sender_id uuid not null references public.profiles(id),
 body text not null check(length(private.clean_text(body)) between 1 and 2000),
 idempotency_key uuid not null,
 created_at timestamptz not null default now(), unique(sender_id,idempotency_key)
);
create index messages_thread on public.request_messages(request_id,id);
create table public.request_reads (
 request_id uuid not null references public.connection_requests(id),
 member_id uuid not null references public.profiles(id),
 last_message_id bigint not null default 0, primary key(request_id,member_id)
);
create function private.thread_allowed(p_id uuid) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.connection_requests r join public.profiles a on a.id=r.requester_id join public.profiles b on b.id=r.recipient_id
 where r.id=p_id and auth.uid() in(r.requester_id,r.recipient_id) and r.status in('accepted','completed')
 and private.eligible(auth.uid()) and private.eligible(a.id) and private.eligible(b.id)
 and b.visible and not private.blocked(a.id,b.id));
$$;
alter table public.request_messages enable row level security;
alter table public.request_reads enable row level security;
revoke all on public.request_messages,public.request_reads from anon,authenticated;
grant select on public.request_messages,public.request_reads to authenticated;
create policy messages_participants on public.request_messages for select to authenticated using(private.thread_allowed(request_id));
create policy reads_self on public.request_reads for select to authenticated using(member_id=auth.uid() and private.thread_allowed(request_id));
create function public.send_request_message(p_request_id uuid,p_body text,p_key uuid) returns public.request_messages
language plpgsql security definer set search_path='' as $$
declare v_row public.request_messages; v_status public.request_status; v_used integer;
begin
 select status into v_status from public.connection_requests where id=p_request_id for update;
 if not private.thread_allowed(p_request_id) then raise exception 'THREAD_UNAVAILABLE'; end if;
 select * into v_row from public.request_messages where sender_id=auth.uid() and idempotency_key=p_key;
 if found then
  if v_row.request_id<>p_request_id or v_row.body is distinct from private.clean_text(p_body) then raise exception 'IDEMPOTENCY_CONFLICT'; end if;
  return v_row;
 end if;
 if v_status<>'accepted' then raise exception 'THREAD_CLOSED'; end if;
 if p_key is null or p_body is null or length(private.clean_text(p_body)) not between 1 and 2000 then raise exception 'INVALID_INPUT'; end if;
 insert into private.rate_limits(actor,operation,bucket,used) values(auth.uid(),'messages',date_trunc('minute',now()),1)
 on conflict(actor,operation) do update set used=case when rate_limits.bucket=excluded.bucket then rate_limits.used+1 else 1 end,bucket=excluded.bucket returning used into v_used;
 if v_used>10 then raise exception 'RATE_LIMIT'; end if;
 insert into public.request_messages(request_id,sender_id,body,idempotency_key) values(p_request_id,auth.uid(),private.clean_text(p_body),p_key) returning * into v_row;
 return v_row;
end;
$$;
create function public.mark_request_read(p_request_id uuid,p_last_id bigint) returns void language plpgsql security definer set search_path='' as $$
begin
 if not private.thread_allowed(p_request_id) then raise exception 'THREAD_UNAVAILABLE'; end if;
 if p_last_id is null or not exists(select 1 from public.request_messages where request_id=p_request_id and id=p_last_id) then raise exception 'INVALID_INPUT'; end if;
 insert into public.request_reads(request_id,member_id,last_message_id) values(p_request_id,auth.uid(),p_last_id)
 on conflict(request_id,member_id) do update set last_message_id=greatest(request_reads.last_message_id,excluded.last_message_id);
end;
$$;
revoke all on function public.send_request_message(uuid,text,uuid),public.mark_request_read(uuid,bigint) from public,anon;
grant execute on function public.send_request_message(uuid,text,uuid),public.mark_request_read(uuid,bigint) to authenticated;
