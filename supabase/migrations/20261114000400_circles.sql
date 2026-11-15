-- Member-only learning discussions. No anonymous directory or auth bypass.
create table public.circle_posts (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references public.profiles(id),
 category text not null check(category in ('hackathons','startups','projects','research','clubs','careers')),
 kind text not null check(kind in ('help','building','teammates','feedback','update','learning')),
 title text not null check(length(btrim(title)) between 3 and 100),
 description text not null check(length(btrim(description)) between 10 and 2000),
 specific_request text not null check(length(btrim(specific_request)) between 10 and 400),
 tags text[] not null default '{}' check(cardinality(tags)<=8),
 project_url text check(private.safe_project_url(project_url)),
 github_url text check(private.safe_project_url(github_url)),
 team_size integer check(team_size between 1 and 100),
 resolved boolean not null default false,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index circle_posts_recent on public.circle_posts(category,created_at desc);
create table public.circle_comments (
 id uuid primary key default gen_random_uuid(),
 post_id uuid not null references public.circle_posts(id) on delete cascade,
 owner_id uuid not null default auth.uid() references public.profiles(id),
 parent_id uuid references public.circle_comments(id) on delete cascade,
 body text not null check(length(btrim(body)) between 2 and 1000),
 created_at timestamptz not null default now()
);
create index circle_comments_post on public.circle_comments(post_id,created_at);
create table public.circle_reports (
 id uuid primary key default gen_random_uuid(),
 post_id uuid not null references public.circle_posts(id) on delete cascade,
 reporter_id uuid not null default auth.uid() references public.profiles(id),
 reason text not null check(length(btrim(reason)) between 10 and 500),
 created_at timestamptz not null default now(),
 unique(post_id,reporter_id)
);
alter table public.circle_posts enable row level security;
alter table public.circle_comments enable row level security;
alter table public.circle_reports enable row level security;
revoke all on public.circle_posts,public.circle_comments,public.circle_reports from anon,authenticated;
grant select,delete on public.circle_posts to authenticated;
grant insert(category,kind,title,description,specific_request,tags,project_url,github_url,team_size) on public.circle_posts to authenticated;
grant update(category,kind,title,description,specific_request,tags,project_url,github_url,team_size,resolved) on public.circle_posts to authenticated;
grant select on public.circle_comments,public.circle_reports to authenticated;
grant insert(post_id,parent_id,body) on public.circle_comments to authenticated;
grant insert(post_id,reason) on public.circle_reports to authenticated;

create policy circle_posts_read on public.circle_posts for select to authenticated using (
 private.eligible((select auth.uid())) and (owner_id=(select auth.uid()) or exists(select 1 from public.profiles p where p.id=owner_id and p.visible))
);
create policy circle_posts_create on public.circle_posts for insert to authenticated with check (
 owner_id=(select auth.uid()) and private.eligible((select auth.uid())) and exists(select 1 from public.profiles p where p.id=owner_id and p.visible)
);
create policy circle_posts_edit on public.circle_posts for update to authenticated using(owner_id=(select auth.uid()) and private.eligible((select auth.uid()))) with check(owner_id=(select auth.uid()));
create policy circle_posts_delete on public.circle_posts for delete to authenticated using(owner_id=(select auth.uid()) and private.eligible((select auth.uid())));
create policy circle_comments_read on public.circle_comments for select to authenticated using (
 exists(select 1 from public.circle_posts p where p.id=post_id) and exists(select 1 from public.profiles p where p.id=owner_id and (p.visible or p.id=(select auth.uid())))
);
create policy circle_comments_create on public.circle_comments for insert to authenticated with check (
 owner_id=(select auth.uid()) and private.eligible((select auth.uid())) and exists(select 1 from public.circle_posts p where p.id=post_id and not p.resolved)
 and exists(select 1 from public.profiles p where p.id=owner_id and p.visible)
);
create policy circle_reports_read on public.circle_reports for select to authenticated using(reporter_id=(select auth.uid()) and private.eligible((select auth.uid())));
create policy circle_reports_create on public.circle_reports for insert to authenticated with check(reporter_id=(select auth.uid()) and private.eligible((select auth.uid())) and exists(select 1 from public.circle_posts p where p.id=post_id));

-- Row-level upsert serializes limits, including direct REST/SQL inserts.
create function private.guard_circle_write() returns trigger language plpgsql security definer set search_path='' as $$
declare v_used integer; v_parent public.circle_comments; v_tag text;
begin
 if not private.eligible(auth.uid()) then raise exception 'FORBIDDEN' using errcode='42501'; end if;
 insert into private.rate_limits(actor,operation,bucket,used) values(auth.uid(),tg_table_name,date_trunc('minute',now()),1)
 on conflict(actor,operation) do update set used=case when rate_limits.bucket=excluded.bucket then rate_limits.used+1 else 1 end,bucket=excluded.bucket returning used into v_used;
 if v_used>5 then raise exception 'RATE_LIMIT'; end if;
 if tg_table_name='circle_posts' then
   new.title:=private.clean_text(new.title); new.description:=private.clean_text(new.description); new.specific_request:=private.clean_text(new.specific_request); new.updated_at:=now();
   foreach v_tag in array new.tags loop if length(private.clean_text(v_tag)) not between 1 and 40 then raise exception 'INVALID_TAG'; end if; end loop;
 elsif tg_table_name='circle_comments' then
   new.body:=private.clean_text(new.body);
   -- Serialize comments against resolving/deleting the parent post.
   perform 1 from public.circle_posts where id=new.post_id and not resolved for update;
   if not found then raise exception 'POST_UNAVAILABLE'; end if;
   if new.parent_id is not null then
     select * into v_parent from public.circle_comments where id=new.parent_id;
     if not found or v_parent.post_id<>new.post_id or v_parent.parent_id is not null or private.blocked(auth.uid(),v_parent.owner_id) then raise exception 'INVALID_REPLY'; end if;
   end if;
 else new.reason:=private.clean_text(new.reason);
 end if;
 return new;
end;
$$;
revoke all on function private.guard_circle_write() from public,anon,authenticated;
create trigger circle_post_guard before insert or update on public.circle_posts for each row execute function private.guard_circle_write();
create trigger circle_comment_guard before insert on public.circle_comments for each row execute function private.guard_circle_write();
create trigger circle_report_guard before insert on public.circle_reports for each row execute function private.guard_circle_write();
