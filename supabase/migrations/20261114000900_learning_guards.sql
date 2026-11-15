-- Limit pure helper execution as well; authenticated constraints can still call the tag validator.
revoke all on function public.exchange_overlap(text[],text[]),private.valid_tags(text[],integer) from public,anon;
grant execute on function public.exchange_overlap(text[],text[]),private.valid_tags(text[],integer) to authenticated;
alter table public.profiles add check(cardinality(mentor_categories)<=6);
-- Owners retain editing access after withdrawing a linked project; a new link must still be shared and owned.
create or replace function private.guard_project_link() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if new.project_id is not null then
  if tg_op='UPDATE' and new.project_id is not distinct from old.project_id then return new;end if;
  if not exists(select 1 from public.member_projects p where p.id=new.project_id and p.owner_id=auth.uid() and p.visibility='members') then raise exception 'PROJECT_UNAVAILABLE';end if;
 end if;
 return new;
end;
$$;
