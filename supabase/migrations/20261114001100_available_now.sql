alter table public.profiles add column available_until timestamptz;
-- Clients cannot assign their own expiry or extend it beyond the server's 60-minute window.
create function public.set_available_now(p_enabled boolean) returns timestamptz language plpgsql security definer set search_path='' as $$
declare until_at timestamptz;
begin
 if not private.eligible(auth.uid()) or not exists(select 1 from public.profiles where id=auth.uid() and affiliation='alumni') then raise exception 'FORBIDDEN' using errcode='42501';end if;
 if p_enabled and not exists(select 1 from public.profiles p where p.id=auth.uid() and p.visible and not p.paused and cardinality(p.help_topics)>0 and (select count(*) from public.connection_requests r where r.recipient_id=p.id and r.created_at>=(date_trunc('month',now() at time zone 'UTC') at time zone 'UTC') and r.status in('pending','accepted','completed'))<p.monthly_cap) then raise exception 'MEMBER_UNAVAILABLE';end if;
 until_at:=case when p_enabled then now()+interval '60 minutes' else null end;
 update public.profiles set available_until=until_at where id=auth.uid();return until_at;
end;
$$;
revoke all on function public.set_available_now(boolean) from public,anon;
grant execute on function public.set_available_now(boolean) to authenticated;
