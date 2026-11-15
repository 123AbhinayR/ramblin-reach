-- Optional, explicitly self-reported alumni project history. Existing profile RLS applies.
alter table public.profiles add column built_at_tech jsonb;
alter table public.profiles add constraint built_at_tech_shape check (
 built_at_tech is null or (
  affiliation='alumni' and jsonb_typeof(built_at_tech)='object'
  and built_at_tech ?& array['title','year','lab']
  and built_at_tech-'title'-'year'-'lab'='{}'::jsonb
  and jsonb_typeof(built_at_tech->'title')='string'
  and length(btrim(built_at_tech->>'title')) between 1 and 100
  and jsonb_typeof(built_at_tech->'year')='number'
  and (built_at_tech->>'year')::numeric between 1900 and 2200
  and (built_at_tech->>'year')::numeric=trunc((built_at_tech->>'year')::numeric)
  and jsonb_typeof(built_at_tech->'lab')='string'
  and length(built_at_tech->>'lab')<=100
 )
);
grant update(built_at_tech) on public.profiles to authenticated;
