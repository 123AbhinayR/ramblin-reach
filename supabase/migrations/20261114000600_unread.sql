-- Summarize unread state in SQL, without transferring or truncating message history.
create function public.unread_request_ids(p_ids uuid[]) returns table(request_id uuid)
language plpgsql stable security invoker set search_path='' as $$
begin
 if cardinality(p_ids)>50 then raise exception 'INVALID_INPUT'; end if;
 return query select distinct m.request_id from public.request_messages m
 left join public.request_reads c on c.request_id=m.request_id and c.member_id=auth.uid()
 where m.request_id=any(p_ids) and m.sender_id<>auth.uid() and m.id>coalesce(c.last_message_id,0);
end;
$$;
revoke all on function public.unread_request_ids(uuid[]) from public,anon;
grant execute on function public.unread_request_ids(uuid[]) to authenticated;
