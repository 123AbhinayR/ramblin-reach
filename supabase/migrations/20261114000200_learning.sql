create type public.goal_intent as enum ('project','career','relocation');
create type public.step_kind as enum ('action','resource','find_person');
create type public.step_status as enum ('not_started','done');
create type public.resource_kind as enum ('makerspace','program','funding','community','career','regional');
create type public.source_status as enum ('reviewed','needs_review');
create type public.project_visibility as enum ('private','members');

create table public.resources (
  id uuid primary key default gen_random_uuid(), slug text not null unique,
  title varchar(150) not null, kind public.resource_kind not null,
  short_description varchar(600) not null, student_action varchar(400) not null,
  official_url text not null, official_domain text not null,
  tags text[] not null default '{}', eligible_audience text not null,
  eligibility_caveat text not null, prerequisite_tags text[] not null default '{}',
  last_reviewed_at date not null, source_status public.source_status not null default 'needs_review',
  claimed_live_availability boolean not null default false check (not claimed_live_availability),
  active boolean not null default true, display_priority integer not null default 0,
  check (official_domain in ('hive.ece.gatech.edu','inventionstudio.gatech.edu','create-x.gatech.edu','career.gatech.edu','www.gtalumni.org','robojackets.org','studentcenter.gatech.edu')),
  check (official_url like 'https://%' and split_part(split_part(official_url,'://',2),'/',1) = official_domain)
);
create table public.goals (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles(id) on delete cascade,
  intent public.goal_intent not null, goal_text varchar(500) not null check (length(btrim(goal_text)) between 10 and 500),
  target_company varchar(100), target_metro varchar(100), extracted_tags text[] not null default '{}',
  created_at timestamptz not null default now()
);
create index goals_owner_created on public.goals(owner_id,created_at desc);
create table public.path_steps (
  id uuid primary key default gen_random_uuid(), goal_id uuid not null references public.goals(id) on delete cascade,
  ordinal integer not null check (ordinal between 1 and 5), kind public.step_kind not null,
  resource_id uuid references public.resources(id), title varchar(150) not null, description varchar(600) not null,
  reason varchar(400) not null, status public.step_status not null default 'not_started',
  source_snapshot jsonb, completed_at timestamptz, created_at timestamptz not null default now(),
  unique(goal_id,ordinal), check ((kind = 'resource') = (resource_id is not null)),
  check ((kind = 'resource') = (source_snapshot is not null)),
  check ((status = 'done') = (completed_at is not null))
);
create function private.step_progress() returns trigger language plpgsql set search_path = '' as $$
begin
  new.completed_at := case when new.status = 'done' then coalesce(old.completed_at, now()) else null end;
  return new;
end;
$$;
create trigger step_progress before update on public.path_steps for each row execute function private.step_progress();

create function private.safe_project_url(value text) returns boolean language sql immutable set search_path = '' as $$
  select value is null or (length(value) <= 2000 and value ~ '^https://[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}(/[^[:space:]]*)?$'
    and value !~* '^https://([^/]+\.)?(localhost|local|internal|test|invalid)(/|$)');
$$;
create table public.member_projects (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles(id) on delete cascade,
  title varchar(100) not null check (length(btrim(title)) > 0), summary varchar(350) not null,
  skills text[] not null default '{}', resource_tags text[] not null default '{}',
  one_lesson varchar(300), safe_project_url text check (private.safe_project_url(safe_project_url)),
  visibility public.project_visibility not null default 'private', is_demo boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (cardinality(skills) <= 20 and cardinality(resource_tags) <= 10)
);
create index member_projects_owner on public.member_projects(owner_id);
create function private.project_invariants() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  perform pg_advisory_xact_lock(hashtextextended(new.owner_id::text,0));
  new.is_demo := (select is_demo from public.profiles where id = new.owner_id);
  if new.visibility = 'members' and (select count(*) from public.member_projects where owner_id=new.owner_id and visibility='members' and id<>new.id) >= 3 then
    raise exception 'PUBLIC_PROJECT_LIMIT';
  end if;
  new.updated_at := now();
  return new;
end;
$$;
revoke all on function private.project_invariants() from public, anon, authenticated;
create trigger project_invariants before insert or update on public.member_projects for each row execute function private.project_invariants();

alter table public.resources enable row level security;
alter table public.goals enable row level security;
alter table public.path_steps enable row level security;
alter table public.member_projects enable row level security;
revoke all on public.resources, public.goals, public.path_steps, public.member_projects from anon, authenticated;
grant select on public.resources, public.goals, public.path_steps, public.member_projects to authenticated;
grant delete on public.goals, public.member_projects to authenticated;
grant update(status) on public.path_steps to authenticated;
grant insert(owner_id,title,summary,skills,resource_tags,one_lesson,safe_project_url,visibility) on public.member_projects to authenticated;
grant update(title,summary,skills,resource_tags,one_lesson,safe_project_url,visibility) on public.member_projects to authenticated;
create policy resources_read on public.resources for select to authenticated using (active and private.eligible((select auth.uid())));
create policy goals_own on public.goals for all to authenticated using (owner_id=(select auth.uid()) and private.eligible((select auth.uid()))) with check (owner_id=(select auth.uid()) and private.eligible((select auth.uid())));
create policy steps_own on public.path_steps for all to authenticated using (exists(select 1 from public.goals where id=goal_id and owner_id=(select auth.uid()))) with check (exists(select 1 from public.goals where id=goal_id and owner_id=(select auth.uid())));
create policy projects_read on public.member_projects for select to authenticated using (
  private.eligible((select auth.uid())) and (owner_id=(select auth.uid()) or (visibility='members' and exists(select 1 from public.profiles where id=owner_id and visible)))
);
create policy projects_insert on public.member_projects for insert to authenticated with check (owner_id=(select auth.uid()) and private.eligible((select auth.uid())));
create policy projects_update on public.member_projects for update to authenticated using (owner_id=(select auth.uid()) and private.eligible((select auth.uid()))) with check (owner_id=(select auth.uid()) and private.eligible((select auth.uid())));
create policy projects_delete on public.member_projects for delete to authenticated using (owner_id=(select auth.uid()) and private.eligible((select auth.uid())));

-- One transaction saves a goal and its complete path. Evidence is copied from the curated catalog,
-- never accepted from a user or model. Direct table insertion is deliberately not granted.
create function public.create_goal_with_path(p_goal_text text,p_intent public.goal_intent,p_target_company text,p_target_metro text,p_tags text[],p_steps jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
declare v_id uuid; v_step jsonb; v_resource public.resources; v_ordinal integer := 0; v_kind public.step_kind;
begin
  if not private.eligible(auth.uid()) then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  if p_steps is null or jsonb_typeof(p_steps) <> 'array' or jsonb_array_length(p_steps) not between 3 and 5 then raise exception 'INVALID_PATH'; end if;
  if not public.consume_rate_limit('goals') then raise exception 'RATE_LIMIT'; end if;
  insert into public.goals(owner_id,intent,goal_text,target_company,target_metro,extracted_tags)
  values(auth.uid(),p_intent,p_goal_text,p_target_company,p_target_metro,p_tags) returning id into v_id;
  for v_step in select value from jsonb_array_elements(p_steps) loop
    v_ordinal := v_ordinal + 1;
    v_kind := (v_step->>'kind')::public.step_kind;
    if v_kind='resource' then
      select * into v_resource from public.resources where id=(v_step->>'resourceId')::uuid and active and source_status='reviewed';
      if not found then raise exception 'RESOURCE_UNAVAILABLE'; end if;
      insert into public.path_steps(goal_id,ordinal,kind,resource_id,title,description,reason,source_snapshot)
      values(v_id,v_ordinal,v_kind,v_resource.id,v_resource.title,v_resource.student_action,v_step->>'reason',jsonb_build_object(
        'slug',v_resource.slug,'title',v_resource.title,'officialUrl',v_resource.official_url,
        'eligibilityNote',v_resource.eligibility_caveat,'reviewedOn',v_resource.last_reviewed_at,'availabilityClaim','unknown'));
    else
      insert into public.path_steps(goal_id,ordinal,kind,title,description,reason)
      values(v_id,v_ordinal,v_kind,v_step->>'title',v_step->>'description',v_step->>'reason');
    end if;
  end loop;
  return v_id;
end;
$$;
revoke all on function public.create_goal_with_path(text,public.goal_intent,text,text,text[],jsonb) from public, anon;
grant execute on function public.create_goal_with_path(text,public.goal_intent,text,text,text[],jsonb) to authenticated;
