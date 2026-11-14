-- Private operational data is never exposed through PostgREST.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table private.deployment (singleton boolean primary key default true check (singleton), allow_demo boolean not null default false);
insert into private.deployment values (true, false);

create type public.affiliation as enum ('student', 'alumni');
create type public.verification_state as enum ('pending', 'verified', 'demo');
create type public.verification_method as enum ('email_control', 'manual', 'approved_integration', 'demo');
create type public.help_topic as enum ('project_guidance', 'resource_navigation', 'career_advice', 'company_insight', 'relocation_advice');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name varchar(80) not null default 'New member' check (length(btrim(display_name)) between 1 and 80),
  affiliation public.affiliation not null default 'student',
  verification_state public.verification_state not null default 'pending',
  verification_method public.verification_method not null default 'email_control',
  verified_at timestamptz,
  is_demo boolean not null default false,
  visible boolean not null default false,
  major varchar(100), grad_year integer check (grad_year between 1900 and 2200),
  company_name varchar(100), metro varchar(100), role_title varchar(100),
  skills text[] not null default '{}', gt_topics text[] not null default '{}',
  help_topics public.help_topic[] not null default '{}',
  monthly_cap integer not null default 2 check (monthly_cap between 1 and 10),
  paused boolean not null default true, bio varchar(400),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (cardinality(skills) <= 20 and cardinality(gt_topics) <= 20),
  check (verification_state <> 'demo' or is_demo),
  check (verification_state <> 'verified' or not is_demo),
  check (verification_state = 'pending' or verified_at is not null)
);
create table public.membership_requests (
  owner_id uuid primary key references public.profiles(id) on delete cascade,
  requested_affiliation public.affiliation not null,
  created_at timestamptz not null default now()
);
create table public.blocks (
  blocker_id uuid references public.profiles(id) on delete cascade,
  blocked_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id), check (blocker_id <> blocked_id)
);
create index blocks_reverse on public.blocks(blocked_id, blocker_id);

create function private.new_member() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  -- Never copy privilege-bearing user_metadata into a profile.
  insert into public.profiles(id) values (new.id);
  return new;
end;
$$;
revoke all on function private.new_member() from public, anon, authenticated;
create trigger on_auth_user_created after insert on auth.users for each row execute function private.new_member();

create function private.touch_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end;
$$;
create trigger profiles_updated before update on public.profiles for each row execute function private.touch_updated_at();

create function private.eligible(p_id uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles p join auth.users u on u.id = p.id
    where p.id = p_id and u.email_confirmed_at is not null and
    (p.verification_state = 'verified' or (p.verification_state = 'demo' and
      (select allow_demo from private.deployment where singleton))));
$$;
create function private.blocked(a uuid, b uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.blocks where (blocker_id = a and blocked_id = b) or (blocker_id = b and blocked_id = a));
$$;
-- These helpers are not API RPCs. Policy evaluation requires EXECUTE, not schema USAGE.
revoke all on function private.eligible(uuid), private.blocked(uuid,uuid) from public, anon;
grant execute on function private.eligible(uuid), private.blocked(uuid,uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.membership_requests enable row level security;
alter table public.blocks enable row level security;
revoke all on public.profiles, public.membership_requests, public.blocks from anon, authenticated;
grant select on public.profiles to authenticated;
grant update(display_name, visible, major, grad_year, company_name, metro, role_title, skills, gt_topics, help_topics, monthly_cap, paused, bio) on public.profiles to authenticated;
grant select, insert, update on public.membership_requests to authenticated;
grant select, insert, delete on public.blocks to authenticated;
create policy profiles_read on public.profiles for select to authenticated using (
  id = (select auth.uid()) or (visible and private.eligible(id) and private.eligible((select auth.uid())) and not private.blocked((select auth.uid()), id))
);
create policy profiles_edit on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy membership_own on public.membership_requests for all to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy blocks_own on public.blocks for all to authenticated using (blocker_id = (select auth.uid())) with check (blocker_id = (select auth.uid()) and private.eligible((select auth.uid())));

-- Explicit capability check for application guards; never accepts a caller-supplied identity.
create function public.is_eligible_member() returns boolean language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and private.eligible(auth.uid());
$$;
revoke all on function public.is_eligible_member() from public, anon;
grant execute on function public.is_eligible_member() to authenticated;

-- Shared fixed-window rate limits, serialized per member and operation.
create table private.rate_limits (actor uuid references public.profiles(id) on delete cascade, operation text, bucket timestamptz, used integer not null, primary key(actor,operation));
create function public.consume_rate_limit(p_operation text) returns boolean language plpgsql security definer set search_path = '' as $$
declare v_used integer;
begin
  if not private.eligible(auth.uid()) then raise exception 'FORBIDDEN' using errcode = '42501'; end if;
  if p_operation not in ('goals','reachready','requests','reports') then raise exception 'INVALID_OPERATION'; end if;
  insert into private.rate_limits(actor,operation,bucket,used) values(auth.uid(),p_operation,date_trunc('minute',now()),1)
  on conflict (actor,operation) do update set
    used = case when rate_limits.bucket = excluded.bucket then rate_limits.used + 1 else 1 end,
    bucket = excluded.bucket returning used into v_used;
  return v_used <= 5;
end;
$$;
revoke all on function public.consume_rate_limit(text) from public, anon;
grant execute on function public.consume_rate_limit(text) to authenticated;
