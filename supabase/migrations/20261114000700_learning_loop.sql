-- Phase 4: extend existing profiles, projects, Circle posts and ReachCard outcomes.
alter table public.profiles add column can_teach text[] not null default '{}', add column want_learn text[] not null default '{}', add column interests text[] not null default '{}', add column mentor_categories text[] not null default '{}';
create function private.valid_tags(v text[], max_count integer) returns boolean language sql immutable set search_path='' as $$
 select cardinality(v)<=max_count and not exists(select 1 from unnest(v) x where x is null or length(private.clean_text(x)) not between 1 and 40);
$$;
alter table public.profiles add check(private.valid_tags(can_teach,20) and private.valid_tags(want_learn,20) and private.valid_tags(interests,20) and mentor_categories <@ array['hackathons','startups','projects','research','clubs','careers']::text[]);
grant update(can_teach,want_learn,interests,mentor_categories) on public.profiles to authenticated;
alter table public.member_projects add column category text not null default 'projects' check(category in('hackathons','startups','projects','research','clubs','careers')), add column current_challenge varchar(400) not null default '', add column requested_help varchar(400) not null default '';
grant insert(category,current_challenge,requested_help),update(category,current_challenge,requested_help) on public.member_projects to authenticated;
alter table public.circle_posts add column project_id uuid references public.member_projects(id) on delete set null;
grant insert(project_id),update(project_id) on public.circle_posts to authenticated;
create function private.guard_project_link() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if new.project_id is not null and not exists(select 1 from public.member_projects p where p.id=new.project_id and p.owner_id=auth.uid() and p.visibility='members') then raise exception 'PROJECT_UNAVAILABLE'; end if;
 return new;
end;
$$;
create trigger circle_project_link before insert or update on public.circle_posts for each row execute function private.guard_project_link();
-- A project withdrawal also hides its linked discussion, even via direct API reads.
drop policy circle_posts_read on public.circle_posts;
create policy circle_posts_read on public.circle_posts for select to authenticated using (
 private.eligible(auth.uid()) and (owner_id=auth.uid() or (exists(select 1 from public.profiles p where p.id=owner_id and p.visible) and (project_id is null or exists(select 1 from public.member_projects p where p.id=project_id and p.visibility='members'))))
);
alter table public.connection_requests add column project_id uuid references public.member_projects(id) on delete set null;
create function public.create_project_reachcard(p_project_id uuid,p_input jsonb) returns public.connection_requests language plpgsql security definer set search_path='' as $$
declare r public.connection_requests;
begin
 if not private.eligible(auth.uid()) or not exists(select 1 from public.member_projects where id=p_project_id and owner_id=auth.uid()) then raise exception 'MEMBER_UNAVAILABLE'; end if;
 r:=public.create_connection_request((p_input->>'recipientId')::uuid,(p_input->>'goalId')::uuid,(p_input->>'helpTopic')::public.help_topic,(p_input->>'format')::public.request_format,p_input->>'goalContext',p_input->>'specificQuestion',p_input->>'priorEffort',p_input->>'safeProjectUrl',(p_input->>'idempotencyKey')::uuid);
 if r.project_id is not null and r.project_id<>p_project_id then raise exception 'IDEMPOTENCY_CONFLICT'; end if;
 update public.connection_requests set project_id=p_project_id where id=r.id returning * into r;
 return r;
end;
$$;
revoke all on function public.create_project_reachcard(uuid,jsonb) from public,anon;
grant execute on function public.create_project_reachcard(uuid,jsonb) to authenticated;
-- Separate, explicitly reviewed shareable fields. Private notes and requests never enter the public DTO.
alter table public.outcomes drop constraint outcomes_request_id_key;
alter table public.outcomes add unique(request_id,reported_by), add column learned varchar(240) not null default '', add column helped varchar(240) not null default '', add column next_step varchar(240) not null default '', add column log_shared boolean not null default false, add column project_id uuid references public.member_projects(id) on delete set null;
grant insert(learned,helped,next_step,log_shared,project_id),update(learned,helped,next_step,log_shared,project_id) on public.outcomes to authenticated;
create function private.guard_learning_log() returns trigger language plpgsql security definer set search_path='' as $$
begin
 new.learned:=private.clean_text(new.learned);new.helped:=private.clean_text(new.helped);new.next_step:=private.clean_text(new.next_step);
 if new.project_id is not null and not exists(select 1 from public.member_projects p join public.connection_requests r on r.project_id=p.id where p.id=new.project_id and p.owner_id=auth.uid() and r.id=new.request_id) then raise exception 'PROJECT_UNAVAILABLE'; end if;
 if new.log_shared and length(new.learned||new.helped||new.next_step)=0 then raise exception 'EMPTY_LOG'; end if;
 return new;
end;
$$;
create trigger learning_log_guard before insert or update on public.outcomes for each row execute function private.guard_learning_log();
create function public.shared_learning_log(p_member_id uuid,p_project_id uuid) returns table(id uuid,reported_by uuid,project_id uuid,learned text,helped text,next_step text,created_at timestamptz)
language sql stable security definer set search_path='' as $$
 select o.id,o.reported_by,o.project_id,o.learned::text,o.helped::text,o.next_step::text,o.created_at from public.outcomes o join public.profiles p on p.id=o.reported_by
 where private.eligible(auth.uid()) and o.log_shared and p.visible and private.eligible(p.id) and not private.blocked(auth.uid(),p.id)
 and (p_member_id is null or p.id=p_member_id) and (p_project_id is null or o.project_id=p_project_id)
 and (o.project_id is null or exists(select 1 from public.member_projects m where m.id=o.project_id and m.visibility='members' and m.owner_id=p.id))
 order by o.created_at desc,o.id limit 50;
$$;
revoke all on function public.shared_learning_log(uuid,uuid) from public,anon;
grant execute on function public.shared_learning_log(uuid,uuid) to authenticated;
-- Canonical exact-tag overlap used by deterministic UI matching and notification generation.
create function public.exchange_overlap(a text[],b text[]) returns text[] language sql immutable set search_path='' as $$
 select coalesce(array_agg(tag order by tag collate "C"),'{}') from (select distinct lower(private.clean_text(x)) tag from unnest(a) x intersect select lower(private.clean_text(x)) from unnest(b) x) t;
$$;
create table public.notifications(
 id uuid primary key default gen_random_uuid(), recipient_id uuid not null references public.profiles(id) on delete cascade, actor_id uuid not null references public.profiles(id) on delete cascade,
 kind text not null check(kind in('new_request','accepted','new_message','post_reply','matched_request')),
 request_id uuid references public.connection_requests(id) on delete cascade,post_id uuid references public.circle_posts(id) on delete cascade,
 reason text not null default '',dedupe_key text not null,read_at timestamptz,created_at timestamptz not null default now(),unique(recipient_id,dedupe_key)
);
create index notifications_inbox on public.notifications(recipient_id,created_at desc);
alter table public.notifications enable row level security;
revoke all on public.notifications from anon,authenticated;
grant select on public.notifications to authenticated;
grant update(read_at) on public.notifications to authenticated;
create policy notification_self on public.notifications for select to authenticated using(recipient_id=auth.uid() and private.eligible(auth.uid()) and not private.blocked(auth.uid(),actor_id) and (request_id is null or exists(select 1 from public.connection_requests r where r.id=request_id)) and (post_id is null or exists(select 1 from public.circle_posts p where p.id=post_id)));
create policy notification_read on public.notifications for update to authenticated using(recipient_id=auth.uid() and private.eligible(auth.uid())) with check(recipient_id=auth.uid());
create function private.notify_event() returns trigger language plpgsql security definer set search_path='' as $$
declare r public.connection_requests; p public.circle_posts; candidate public.profiles; overlap text[]; explanation text;
begin
 if tg_table_name='connection_requests' then
  if tg_op='INSERT' then
   insert into public.notifications(recipient_id,actor_id,kind,request_id,dedupe_key) values(new.recipient_id,new.requester_id,'new_request',new.id,'request:'||new.id) on conflict do nothing;
  elsif new.status='accepted' and old.status='pending' then
   insert into public.notifications(recipient_id,actor_id,kind,request_id,dedupe_key) values(new.requester_id,new.recipient_id,'accepted',new.id,'accepted:'||new.id) on conflict do nothing;
  end if;
 elsif tg_table_name='request_messages' then
  select * into r from public.connection_requests where id=new.request_id;
  insert into public.notifications(recipient_id,actor_id,kind,request_id,dedupe_key) values(case when new.sender_id=r.requester_id then r.recipient_id else r.requester_id end,new.sender_id,'new_message',r.id,'message:'||new.id) on conflict do nothing;
 elsif tg_table_name='circle_comments' then
  select * into p from public.circle_posts where id=new.post_id;
  if p.owner_id<>new.owner_id and not private.blocked(p.owner_id,new.owner_id) then
   insert into public.notifications(recipient_id,actor_id,kind,post_id,dedupe_key) values(p.owner_id,new.owner_id,'post_reply',p.id,'reply:'||new.id) on conflict do nothing;
  end if;
 elsif tg_table_name='circle_posts' and new.kind in('help','feedback','teammates','learning') then
  for candidate in select * from public.profiles where affiliation='alumni' and visible and not paused and cardinality(help_topics)>0 and id<>new.owner_id loop
   if not private.eligible(candidate.id) or private.blocked(candidate.id,new.owner_id) then continue; end if;
   if (select count(*) from public.connection_requests where recipient_id=candidate.id and created_at>=(date_trunc('month',now() at time zone 'UTC') at time zone 'UTC') and status in('pending','accepted','completed'))>=candidate.monthly_cap then continue; end if;
   overlap:=public.exchange_overlap(new.tags,candidate.skills||candidate.interests||candidate.can_teach);
   explanation:=case when cardinality(overlap)>0 then 'Shared skills or interests: '||array_to_string(overlap,', ') when new.category=any(candidate.mentor_categories) then 'Interested in '||new.category else null end;
   if explanation is not null then insert into public.notifications(recipient_id,actor_id,kind,post_id,reason,dedupe_key) values(candidate.id,new.owner_id,'matched_request',new.id,explanation,'match:'||new.id) on conflict do nothing;end if;
  end loop;
 end if;
 return new;
end;
$$;
revoke all on function private.notify_event(),private.guard_learning_log(),private.guard_project_link() from public,anon,authenticated;
create trigger request_notification after insert or update on public.connection_requests for each row execute function private.notify_event();
create trigger message_notification after insert on public.request_messages for each row execute function private.notify_event();
create trigger reply_notification after insert on public.circle_comments for each row execute function private.notify_event();
create trigger match_notification after insert on public.circle_posts for each row execute function private.notify_event();
