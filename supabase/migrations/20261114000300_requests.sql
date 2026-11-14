create type public.request_format as enum ('chat_15min','written_advice','project_feedback');
create type public.request_status as enum ('pending','accepted','declined','cancelled','completed');
create type public.outcome_type as enum ('resource_accessed','technical_advice','company_insight','relocation_advice','next_step_planned','other');
create table public.connection_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id), recipient_id uuid not null references public.profiles(id),
  goal_id uuid references public.goals(id) on delete set null,
  help_topic public.help_topic not null, format public.request_format not null,
  goal_context varchar(240) not null check(length(btrim(goal_context)) between 10 and 240),
  specific_question varchar(400) not null check(length(btrim(specific_question)) between 20 and 400),
  prior_effort varchar(300), safe_project_url text check(private.safe_project_url(safe_project_url)),
  idempotency_key uuid not null, status public.request_status not null default 'pending',
  created_at timestamptz not null default now(), responded_at timestamptz, completed_at timestamptz,
  check(requester_id <> recipient_id), unique(requester_id,idempotency_key)
);
create unique index requests_pending_pair on public.connection_requests(requester_id,recipient_id) where status='pending';
create index requests_recipient_month on public.connection_requests(recipient_id,created_at,status);
create index requests_sender_status on public.connection_requests(requester_id,status);
create table public.outcomes (
  id uuid primary key default gen_random_uuid(), request_id uuid not null unique references public.connection_requests(id),
  reported_by uuid not null references public.profiles(id), outcome_type public.outcome_type not null,
  private_note varchar(300), share_lesson boolean not null default false check(not share_lesson),
  public_lesson varchar(240) check(public_lesson is null), created_at timestamptz not null default now()
);
-- Public lesson authoring is deliberately deferred. It must never expose the private report.
create table public.reports (
  id uuid primary key default gen_random_uuid(), reporter_id uuid not null references public.profiles(id),
  target_id uuid not null references public.profiles(id), request_id uuid references public.connection_requests(id),
  reason varchar(500) not null check(length(btrim(reason)) between 10 and 500), created_at timestamptz not null default now(),
  check(reporter_id <> target_id)
);
create index reports_reporter on public.reports(reporter_id);
create table private.request_audit (
  id bigint generated always as identity primary key, actor_id uuid not null,
  request_id uuid not null references public.connection_requests(id), action text not null,
  created_at timestamptz not null default now()
);
alter table public.connection_requests enable row level security;
alter table public.outcomes enable row level security;
alter table public.reports enable row level security;
revoke all on public.connection_requests, public.outcomes, public.reports from anon, authenticated;
grant select on public.connection_requests, public.outcomes, public.reports to authenticated;
grant insert(request_id,reported_by,outcome_type,private_note) on public.outcomes to authenticated;
grant update(outcome_type,private_note) on public.outcomes to authenticated;
grant delete on public.outcomes to authenticated;
grant insert(reporter_id,target_id,request_id,reason) on public.reports to authenticated;
create policy requests_participants on public.connection_requests for select to authenticated using (
  private.eligible((select auth.uid())) and (requester_id=(select auth.uid()) or recipient_id=(select auth.uid()))
);
create policy outcomes_read on public.outcomes for select to authenticated using (
  exists(select 1 from public.connection_requests r where r.id=request_id and (r.requester_id=(select auth.uid()) or r.recipient_id=(select auth.uid())))
);
create policy outcomes_insert on public.outcomes for insert to authenticated with check (
  reported_by=(select auth.uid()) and exists(select 1 from public.connection_requests r where r.id=request_id and r.status='completed' and (r.requester_id=(select auth.uid()) or r.recipient_id=(select auth.uid())))
);
create policy outcomes_update on public.outcomes for update to authenticated using (reported_by=(select auth.uid()) and private.eligible((select auth.uid()))) with check(reported_by=(select auth.uid()));
create policy outcomes_delete on public.outcomes for delete to authenticated using (reported_by=(select auth.uid()) and private.eligible((select auth.uid())));
create policy reports_read on public.reports for select to authenticated using (reporter_id=(select auth.uid()));
create policy reports_insert on public.reports for insert to authenticated with check (
  reporter_id=(select auth.uid()) and private.eligible((select auth.uid())) and
  (request_id is null or exists(select 1 from public.connection_requests r where r.id=request_id and target_id in (r.requester_id,r.recipient_id)))
);

create function private.clean_text(value text) returns text language sql immutable set search_path = '' as $$
  select btrim(regexp_replace(normalize(value,NFKC), U&'[\0001-\0008\000B-\001F\007F\200B-\200F\202A-\202E\2060-\206F\FEFF]', '', 'g'));
$$;
create function public.create_connection_request(
  p_recipient_id uuid, p_goal_id uuid, p_help_topic public.help_topic, p_format public.request_format,
  p_goal_context text,p_specific_question text,p_prior_effort text,p_safe_project_url text,p_idempotency_key uuid
) returns public.connection_requests language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := auth.uid(); v_recipient public.profiles; v_request public.connection_requests;
  v_month timestamptz := date_trunc('month',now() at time zone 'UTC') at time zone 'UTC';
begin
  if v_actor is null or not private.eligible(v_actor) then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  if p_recipient_id is null or p_recipient_id=v_actor then raise exception 'MEMBER_UNAVAILABLE'; end if;
  if p_idempotency_key is null then raise exception 'INVALID_INPUT'; end if;
  perform pg_advisory_xact_lock(hashtextextended(least(v_actor,p_recipient_id)::text,0));
  perform pg_advisory_xact_lock(hashtextextended(greatest(v_actor,p_recipient_id)::text,0));
  select * into v_request from public.connection_requests where requester_id=v_actor and idempotency_key=p_idempotency_key;
  if found then
    if v_request.recipient_id<>p_recipient_id or v_request.goal_id is distinct from p_goal_id or v_request.help_topic<>p_help_topic or v_request.format<>p_format
      or v_request.goal_context is distinct from private.clean_text(p_goal_context) or v_request.specific_question is distinct from private.clean_text(p_specific_question)
      or v_request.prior_effort is distinct from private.clean_text(p_prior_effort) or v_request.safe_project_url is distinct from p_safe_project_url then
      raise exception 'IDEMPOTENCY_CONFLICT';
    end if;
    return v_request;
  end if;
  select * into v_recipient from public.profiles where id=p_recipient_id;
  if not found or not private.eligible(p_recipient_id) or not v_recipient.visible or v_recipient.paused
    or private.blocked(v_actor,p_recipient_id) or not (p_help_topic=any(v_recipient.help_topics)) then raise exception 'MEMBER_UNAVAILABLE'; end if;
  if p_goal_id is not null and not exists(select 1 from public.goals where id=p_goal_id and owner_id=v_actor) then raise exception 'GOAL_UNAVAILABLE'; end if;
  if exists(select 1 from public.connection_requests where requester_id=v_actor and recipient_id=p_recipient_id and status='pending') then raise exception 'DUPLICATE_PENDING'; end if;
  if (select count(*) from public.connection_requests where requester_id=v_actor and status='pending')>=3 then raise exception 'OUTGOING_LIMIT'; end if;
  if (select count(*) from public.connection_requests where recipient_id=p_recipient_id and created_at>=v_month and status in ('pending','accepted','completed'))>=v_recipient.monthly_cap then raise exception 'MEMBER_UNAVAILABLE'; end if;
  if not public.consume_rate_limit('requests') then raise exception 'RATE_LIMIT'; end if;
  insert into public.connection_requests(requester_id,recipient_id,goal_id,help_topic,format,goal_context,specific_question,prior_effort,safe_project_url,idempotency_key)
  values(v_actor,p_recipient_id,p_goal_id,p_help_topic,p_format,private.clean_text(p_goal_context),private.clean_text(p_specific_question),private.clean_text(p_prior_effort),p_safe_project_url,p_idempotency_key)
  returning * into v_request;
  insert into private.request_audit(actor_id,request_id,action) values(v_actor,v_request.id,'create');
  return v_request;
end;
$$;
create function public.transition_connection_request(p_request_id uuid,p_action text) returns public.connection_requests
language plpgsql security definer set search_path = '' as $$
declare v_actor uuid:=auth.uid(); v_request public.connection_requests; v_next public.request_status;
begin
  if v_actor is null or not private.eligible(v_actor) then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  select * into v_request from public.connection_requests where id=p_request_id and v_actor in (requester_id,recipient_id) for update;
  if not found then raise exception 'REQUEST_UNAVAILABLE'; end if;
  if v_request.status='pending' and v_actor=v_request.recipient_id and p_action in ('accept','decline') then
    v_next:=case when p_action='accept' then 'accepted'::public.request_status else 'declined'::public.request_status end;
  elsif v_request.status in ('pending','accepted') and v_actor=v_request.requester_id and p_action='cancel' then v_next:='cancelled';
  elsif v_request.status='accepted' and p_action='complete' then v_next:='completed';
  else raise exception 'INVALID_TRANSITION'; end if;
  update public.connection_requests set status=v_next,
    responded_at=case when v_next in ('accepted','declined') then now() else responded_at end,
    completed_at=case when v_next='completed' then now() else completed_at end
  where id=p_request_id returning * into v_request;
  insert into private.request_audit(actor_id,request_id,action) values(v_actor,p_request_id,p_action);
  return v_request;
end;
$$;
create function public.member_capacity(p_ids uuid[]) returns table(id uuid,used integer)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not private.eligible(auth.uid()) then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  if cardinality(p_ids)>30 then raise exception 'INVALID_INPUT'; end if;
  return query select p.id,(select count(*)::integer from public.connection_requests r where r.recipient_id=p.id
    and r.created_at >= (date_trunc('month',now() at time zone 'UTC') at time zone 'UTC') and r.status in ('pending','accepted','completed'))
  from public.profiles p where p.id=any(p_ids) and private.eligible(p.id) and (p.id=auth.uid() or (p.visible and not private.blocked(auth.uid(),p.id)));
end;
$$;
revoke all on function public.create_connection_request(uuid,uuid,public.help_topic,public.request_format,text,text,text,text,uuid), public.transition_connection_request(uuid,text), public.member_capacity(uuid[]) from public, anon;
grant execute on function public.create_connection_request(uuid,uuid,public.help_topic,public.request_format,text,text,text,text,uuid), public.transition_connection_request(uuid,text), public.member_capacity(uuid[]) to authenticated;
