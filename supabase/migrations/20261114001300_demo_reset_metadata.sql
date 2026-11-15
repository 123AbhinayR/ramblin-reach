-- Also restore optional profile metadata when resetting the isolated scenario.
create or replace function public.reset_reach_demo() returns void language plpgsql security definer set search_path='' as $$
declare original_actor uuid:=auth.uid(); ids uuid[]; s1 uuid;s2 uuid;s3 uuid;a1 uuid;a2 uuid;a3 uuid;a4 uuid;
 p1 uuid:='dddd0000-0000-4000-8000-000000000001';p2 uuid:='dddd0000-0000-4000-8000-000000000002';p3 uuid:='dddd0000-0000-4000-8000-000000000003';
 r1 uuid:='dddd0000-0000-4000-8000-000000000101';r2 uuid:='dddd0000-0000-4000-8000-000000000102';
begin
 if not private.eligible(original_actor) or not exists(select 1 from private.demo_members m join public.profiles p on p.id=m.id where m.id=original_actor and p.is_demo) or not (select allow_demo from private.deployment where singleton) then raise exception 'FORBIDDEN' using errcode='42501';end if;
 perform pg_advisory_xact_lock(hashtextextended('ramblin-reach-isolated-demo',0));
 select array_agg(m.id) into ids from private.demo_members m join public.profiles p on p.id=m.id where p.is_demo;
 if cardinality(ids)<>7 then raise exception 'DEMO_NOT_CONFIGURED';end if;
 lock table public.connection_requests,public.circle_posts,public.circle_comments,public.circle_reports in share row exclusive mode;
 if exists(select 1 from public.connection_requests where (requester_id=any(ids))<>(recipient_id=any(ids)))
 or exists(select 1 from public.circle_comments c join public.circle_posts p on p.id=c.post_id where (p.owner_id=any(ids))<>(c.owner_id=any(ids)))
 or exists(select 1 from public.circle_reports c join public.circle_posts p on p.id=c.post_id where p.owner_id=any(ids) and not c.reporter_id=any(ids)) then raise exception 'DEMO_NOT_ISOLATED';end if;
 select id into strict s1 from private.demo_members where alias='student-robotics';select id into strict s2 from private.demo_members where alias='student-startup';select id into strict s3 from private.demo_members where alias='student-quant';
 select id into strict a1 from private.demo_members where alias='alumni-robotics';select id into strict a2 from private.demo_members where alias='alumni-startup';select id into strict a3 from private.demo_members where alias='alumni-quant';select id into strict a4 from private.demo_members where alias='alumni-software';
 delete from public.outcomes where request_id in(select id from public.connection_requests where requester_id=any(ids) and recipient_id=any(ids));
 delete from public.request_messages where request_id in(select id from public.connection_requests where requester_id=any(ids) and recipient_id=any(ids));
 delete from public.request_reads where request_id in(select id from public.connection_requests where requester_id=any(ids) and recipient_id=any(ids));
 delete from private.request_audit where request_id in(select id from public.connection_requests where requester_id=any(ids) and recipient_id=any(ids));
 delete from public.reports where request_id in(select id from public.connection_requests where requester_id=any(ids) and recipient_id=any(ids));
 delete from public.connection_requests where requester_id=any(ids) and recipient_id=any(ids);
 delete from public.circle_posts where owner_id=any(ids);
 delete from public.member_projects where owner_id=any(ids);
 delete from public.goals where owner_id=any(ids);
 delete from public.blocks where blocker_id=any(ids) and blocked_id=any(ids);
 delete from public.notifications where recipient_id=any(ids) and actor_id=any(ids);
 delete from private.rate_limits where actor=any(ids);
 update public.profiles set visible=true,paused=false,monthly_cap=10,company_name=null,role_title=null,major=null,grad_year=null,gt_topics='{}',metro='Atlanta, GA',help_topics='{project_guidance}',built_at_tech=null,available_until=null,skills='{}',interests='{}',can_teach='{}',want_learn='{}',mentor_categories='{projects}' where id=any(ids);
 update public.profiles set display_name='DEMO DATA: Casey Rivera',skills='{robotics,computer vision,python}',can_teach='{typescript}',want_learn='{robotics,computer vision}',bio='DEMO DATA: fictional student building a computer vision rover.' where id=s1;
 update public.profiles set display_name='DEMO DATA: Alex Morgan',skills='{startups,prototyping}',can_teach='{design}',want_learn='{startups}',bio='DEMO DATA: fictional student exploring a prototype.' where id=s2;
 update public.profiles set display_name='DEMO DATA: Sam Patel',skills='{finance,python}',can_teach='{python}',want_learn='{quant}',bio='DEMO DATA: fictional student studying a simulated financial model.' where id=s3;
 update public.profiles set display_name='DEMO DATA: Rowan Chen',skills='{robotics,computer vision,python,ml}',interests='{robotics,computer vision}',can_teach='{robotics,computer vision,python}',want_learn='{typescript}',mentor_categories='{clubs,projects,research,hackathons}',bio='DEMO DATA: fictional ML/robotics alumnus; no real affiliation or employment asserted.',built_at_tech='{"title":"DEMO DATA: computer vision robotics rover","year":2014,"lab":"DEMO DATA: fictional robotics club project"}',available_until=now()+interval '60 minutes' where id=a1;
 update public.profiles set display_name='DEMO DATA: Jamie Brooks',skills='{startups,prototyping}',interests='{startups}',can_teach='{prototyping}',mentor_categories='{startups}',bio='DEMO DATA: fictional startup experience, not investment or funding advice.' where id=a2;
 update public.profiles set display_name='DEMO DATA: Quinn Lee',skills='{finance,quant,python}',interests='{finance,quant}',can_teach='{quant,python}',mentor_categories='{careers,research}',bio='DEMO DATA: fictional finance/quant experience, no investment results claimed.' where id=a3;
 update public.profiles set display_name='DEMO DATA: Avery Jones',skills='{software,typescript}',interests='{software}',can_teach='{software,typescript}',mentor_categories='{projects,hackathons}',bio='DEMO DATA: fictional software engineering experience.' where id=a4;
 perform set_config('request.jwt.claim.sub',s1::text,true);
 insert into public.member_projects(id,owner_id,title,summary,skills,visibility,category,current_challenge,requested_help) values(p1,s1,'DEMO DATA: vision-guided robotics rover','DEMO DATA: a fictional rover that detects a marked path.','{robotics,computer vision,python}','members','clubs','DEMO DATA: detections flicker when the lighting changes.','How can I test a vision detector under changing lighting?');
 perform set_config('request.jwt.claim.sub',s2::text,true);
 insert into public.member_projects(id,owner_id,title,summary,skills,visibility,category,current_challenge,requested_help) values(p2,s2,'DEMO DATA: reusable packaging prototype','DEMO DATA: a fictional prototype study.','{startups,prototyping}','members','startups','DEMO DATA: deciding what to test first.','How can I scope a small prototype test?');
 perform set_config('request.jwt.claim.sub',s3::text,true);
 insert into public.member_projects(id,owner_id,title,summary,skills,visibility,category,current_challenge,requested_help) values(p3,s3,'DEMO DATA: simulated quant notebook','DEMO DATA: a fictional financial-data exercise with no real investment results.','{finance,python}','members','careers','DEMO DATA: validating a model on held-out synthetic data.','How should I check a simulated model for leakage?');
 perform set_config('request.jwt.claim.sub',s1::text,true);
 insert into public.circle_posts(id,owner_id,project_id,category,kind,title,description,specific_request,tags) values
 ('dddd0000-0000-4000-8000-000000000201',s1,p1,'clubs','help','DEMO DATA: robotics lighting blocker','DEMO DATA: detections flicker in a fictional rover test.','How should I test a detector under lighting changes?','{robotics,computer vision}'),
 ('dddd0000-0000-4000-8000-000000000202',s1,p1,'research','feedback','DEMO DATA: vision test plan','DEMO DATA: a fictional test plan needs feedback.','What should I vary in a small vision test?','{computer vision,python}');
 perform set_config('request.jwt.claim.sub',s2::text,true);
 insert into public.circle_posts(id,owner_id,project_id,category,kind,title,description,specific_request,tags) values
 ('dddd0000-0000-4000-8000-000000000203',s2,p2,'startups','help','DEMO DATA: prototype scope','DEMO DATA: a fictional packaging prototype needs a first test.','How can I define a useful first test?','{startups,prototyping}'),
 ('dddd0000-0000-4000-8000-000000000204',s2,p2,'hackathons','teammates','DEMO DATA: prototype feedback group','DEMO DATA: a fictional team wants feedback on test design.','Would someone review the test outline?','{prototyping}');
 perform set_config('request.jwt.claim.sub',s3::text,true);
 insert into public.circle_posts(id,owner_id,project_id,category,kind,title,description,specific_request,tags) values('dddd0000-0000-4000-8000-000000000205',s3,p3,'careers','help','DEMO DATA: quant validation question','DEMO DATA: checking a model on synthetic data only.','How should I check for leakage?','{quant,finance,python}');
 perform set_config('request.jwt.claim.sub',a1::text,true);
 insert into public.circle_posts(id,owner_id,category,kind,title,description,specific_request,tags) values('dddd0000-0000-4000-8000-000000000206',a1,'projects','learning','DEMO DATA: alumnus wants to learn TypeScript','DEMO DATA: a fictional alumnus wants a TypeScript explanation.','Could a student explain TypeScript narrowing?','{typescript}');
 insert into public.connection_requests(id,requester_id,recipient_id,project_id,help_topic,format,goal_context,specific_question,idempotency_key,status,responded_at,completed_at) values
 (r1,s1,a1,p1,'project_guidance','written_advice','DEMO DATA: fictional vision rover test plan.','DEMO DATA: how should I compare lighting conditions?','dddd0000-0000-4000-8000-000000000301','accepted',now(),null),
 (r2,s1,a4,p1,'project_guidance','written_advice','DEMO DATA: fictional robotics logging blocker.','DEMO DATA: how should I record and compare test logs?','dddd0000-0000-4000-8000-000000000302','completed',now(),now());
 perform public.send_request_message(r1,'DEMO DATA: try a controlled set of lighting conditions.','dddd0000-0000-4000-8000-000000000401');
 perform set_config('request.jwt.claim.sub',s1::text,true);
 insert into public.outcomes(id,request_id,reported_by,outcome_type,learned,helped,next_step,log_shared,project_id) values('dddd0000-0000-4000-8000-000000000501',r2,s1,'technical_advice','DEMO DATA: simulated lesson about structured test logs.','','DEMO DATA: next, compare logs from the same test conditions.',true,p1);
 delete from private.rate_limits where actor=any(ids);
 perform set_config('request.jwt.claim.sub',original_actor::text,true);
end;
$$;
revoke all on function public.reset_reach_demo() from public,anon;
grant execute on function public.reset_reach_demo() to authenticated;
