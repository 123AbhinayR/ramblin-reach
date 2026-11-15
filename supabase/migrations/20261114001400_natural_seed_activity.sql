-- Seed provenance remains server-owned metadata, never a per-item UI label.
alter table public.circle_posts add column is_demo boolean not null default false;
alter table public.circle_comments add column is_demo boolean not null default false;
alter table public.connection_requests add column is_demo boolean not null default false;
alter table public.request_messages add column is_demo boolean not null default false;
alter table public.outcomes add column is_demo boolean not null default false;
alter table public.notifications add column is_demo boolean not null default false;
create function private.stamp_demo_provenance() returns trigger language plpgsql security definer set search_path='' as $$
begin new.is_demo:=coalesce((select p.is_demo from public.profiles p where p.id=(to_jsonb(new)->>tg_argv[0])::uuid),false);return new;end;
$$;
revoke all on function private.stamp_demo_provenance() from public,anon,authenticated;
alter table public.circle_posts disable trigger circle_post_guard;
update public.circle_posts r set is_demo=p.is_demo from public.profiles p where p.id=r.owner_id;
alter table public.circle_posts enable trigger circle_post_guard;
create trigger stamp_demo_provenance before insert on public.circle_posts for each row execute function private.stamp_demo_provenance('owner_id');
update public.circle_comments r set is_demo=p.is_demo from public.profiles p where p.id=r.owner_id;
create trigger stamp_demo_provenance before insert on public.circle_comments for each row execute function private.stamp_demo_provenance('owner_id');
update public.connection_requests r set is_demo=p.is_demo from public.profiles p where p.id=r.requester_id;
create trigger stamp_demo_provenance before insert on public.connection_requests for each row execute function private.stamp_demo_provenance('requester_id');
update public.request_messages r set is_demo=p.is_demo from public.profiles p where p.id=r.sender_id;
create trigger stamp_demo_provenance before insert on public.request_messages for each row execute function private.stamp_demo_provenance('sender_id');
alter table public.outcomes disable trigger learning_log_guard;
update public.outcomes r set is_demo=p.is_demo from public.profiles p where p.id=r.reported_by;
alter table public.outcomes enable trigger learning_log_guard;
create trigger stamp_demo_provenance before insert on public.outcomes for each row execute function private.stamp_demo_provenance('reported_by');
update public.notifications r set is_demo=p.is_demo from public.profiles p where p.id=r.actor_id;
create trigger stamp_demo_provenance before insert on public.notifications for each row execute function private.stamp_demo_provenance('actor_id');
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

 update public.profiles set display_name='Mira Talven',major='Computer Engineering',grad_year=2027,skills='{robotics,computer vision,python}',can_teach='{typescript}',want_learn='{robotics,computer vision}',bio='I work on a small vision rover between classes. Happy to trade TypeScript help for camera debugging advice.' where id=s1;
 update public.profiles set display_name='Evan Corren',major='Industrial Design',grad_year=2028,skills='{startups,prototyping}',can_teach='{design}',want_learn='{startups}',bio='Working on reusable packaging with a friend. I like quick cardboard tests more than polishing slides.' where id=s2;
 update public.profiles set display_name='Noor Bellamy',major='Mathematics',grad_year=2027,skills='{finance,python}',can_teach='{python}',want_learn='{quant}',bio='Learning how to validate models without fooling myself. Usually working in Python notebooks.' where id=s3;
 update public.profiles set display_name='Arin Velden',role_title='Perception engineer',company_name='a robotics startup',grad_year=2014,skills='{robotics,computer vision,python,ml}',interests='{robotics,computer vision}',can_teach='{robotics,computer vision,python}',want_learn='{typescript}',mentor_categories='{clubs,projects,research,hackathons}',bio='I work on camera-based perception. Happy to look at a small reproducible example or help narrow down a test plan.',built_at_tech='{"title":"Computer vision robotics rover","year":2014,"lab":"Robotics club"}',available_until=now()+interval '60 minutes' where id=a1;
 update public.profiles set display_name='Lena Quillan',role_title='Product designer',company_name='an early-stage product studio',grad_year=2018,help_topics='{project_guidance,career_advice}',skills='{startups,prototyping}',interests='{startups}',can_teach='{prototyping}',want_learn='{design systems}',mentor_categories='{startups}',bio='I help small teams decide what to test before they build. Can give feedback on a prototype or a focused research question.' where id=a2;
 update public.profiles set display_name='Owen Kestrel',role_title='Quant research engineer',company_name='a quant research firm',grad_year=2016,help_topics='{project_guidance,career_advice}',skills='{finance,quant,python}',interests='{finance,quant}',can_teach='{quant,python}',want_learn='{data visualization}',mentor_categories='{careers,research}',bio='Most of my work is data checks and research tooling. Happy to discuss leakage, validation and the day-to-day work, not investment advice.' where id=a3;
 update public.profiles set display_name='Tessa Marlowe',role_title='Software engineer',company_name='a developer tools company',grad_year=2020,help_topics='{project_guidance,career_advice}',skills='{software,typescript,python}',interests='{software}',can_teach='{software,typescript}',want_learn='{robotics}',mentor_categories='{projects,hackathons}',bio='I build developer tools and enjoy making debugging less painful. Bring a small example and tell me what you have already tried.' where id=a4;
 perform set_config('request.jwt.claim.sub',s1::text,true);
 insert into public.member_projects(id,owner_id,title,summary,skills,visibility,category,current_challenge,requested_help) values(p1,s1,'Vision-guided robotics rover','A Raspberry Pi rover that follows a marked path using a USB camera.','{robotics,computer vision,python}','members','clubs','Lane detections flicker when we move from the hallway into the lab.','How can I test a vision detector under changing lighting?');
 perform set_config('request.jwt.claim.sub',s2::text,true);
 insert into public.member_projects(id,owner_id,title,summary,skills,visibility,category,current_challenge,requested_help) values(p2,s2,'Returnable lunch packaging','Testing a cardboard sleeve and return instructions before making a reusable container.','{startups,prototyping}','members','startups','We keep changing the shape without deciding what we need to learn.','How can I scope a small prototype test?');
 perform set_config('request.jwt.claim.sub',s3::text,true);
 insert into public.member_projects(id,owner_id,title,summary,skills,visibility,category,current_challenge,requested_help) values(p3,s3,'Research validation notebook','A Python notebook for checking model splits and leakage on generated financial data.','{finance,python}','members','careers','Rows from the same source may be ending up in both data splits.','How should I check a model for leakage?');
 perform set_config('request.jwt.claim.sub',s1::text,true);
 insert into public.circle_posts(id,owner_id,project_id,category,kind,title,description,specific_request,tags,created_at) values
 ('dddd0000-0000-4000-8000-000000000201',s1,p1,'clubs','help','Rover lane edges disappear near the lab door','Our Pi rover follows tape in the hallway, but the mask flickers when we turn into the lab. Cleaned the lens and tried a different threshold. Club review is coming up and I am not sure what to isolate next.','What should I hold fixed before changing the detector?','{robotics,computer vision}',now()-interval '18 minutes'),
 ('dddd0000-0000-4000-8000-000000000202',s1,p1,'research','feedback','Does this camera test plan leave anything obvious out?','I have clips from the hallway and lab, but the camera exposure is automatic. Planning to keep the route fixed and label the lighting conditions before the next review.','Would someone sanity-check the test conditions?','{computer vision,python}',now()-interval '3 hours');
 perform set_config('request.jwt.claim.sub',s2::text,true);
 insert into public.circle_posts(id,owner_id,project_id,category,kind,title,description,specific_request,tags,created_at) values
 ('dddd0000-0000-4000-8000-000000000203',s2,p2,'startups','help','What should we test before cutting another packaging sleeve?','We have a cardboard mockup and keep debating the fold. We tried handing it to a friend, but explained the return instructions while they held it. That probably hid the confusing part.','How would you test the instructions without coaching the person?','{startups,prototyping}',now()-interval '2 days'),
 ('dddd0000-0000-4000-8000-000000000204',s2,p2,'hackathons','teammates','Anyone want to swap prototype feedback before the weekend?','Bringing the cardboard packaging mockup to the next work session. The sleeve tears at the fold and the return instructions are still awkward. Can trade design feedback or help with a quick sketch.','Looking for someone to try the instructions cold.','{prototyping}',now()-interval '5 hours');
 perform set_config('request.jwt.claim.sub',s3::text,true);
 insert into public.circle_posts(id,owner_id,project_id,category,kind,title,description,specific_request,tags,created_at) values
 ('dddd0000-0000-4000-8000-000000000205',s3,p3,'careers','help','How do research engineers check a split for leakage?','My pandas notebook splits generated market rows at random. Grouping by source changes the validation result, so I do not trust the original setup. Read the sklearn splitting docs but still unsure what to group.','How would you inspect the split before trying another model?','{quant,finance,python}',now()-interval '7 hours'),
 ('dddd0000-0000-4000-8000-000000000207',s3,p3,'projects','update','Added split checks to the notebook, cleaning up the plots next','The notebook now keeps source identifiers with each split so I can inspect them. Still using generated data. Next I want a plot that makes overlap visible instead of another printout.','Any readable examples of split diagnostics?','{python,finance}',now()-interval '45 minutes');
 perform set_config('request.jwt.claim.sub',a1::text,true);
 insert into public.circle_posts(id,owner_id,category,kind,title,description,specific_request,tags,created_at) values('dddd0000-0000-4000-8000-000000000206',a1,'projects','learning','Could someone walk me through TypeScript narrowing?','I am putting together a small internal UI and keep reaching for casts when the API response is a union. Would rather understand the pattern than copy it.','Can someone explain a discriminated union with a short example?','{typescript}',now()-interval '65 minutes');

 perform set_config('request.jwt.claim.sub',a1::text,true);
 insert into public.circle_comments(id,post_id,owner_id,body,created_at) values('dddd0000-0000-4000-8000-000000000600','dddd0000-0000-4000-8000-000000000201',a1,'I can help. Can you lock exposure first? Automatic exposure can make this look like a detector bug.',now()-interval '15 minutes');
 perform set_config('request.jwt.claim.sub',s2::text,true);
 insert into public.circle_comments(id,post_id,owner_id,body,created_at) values('dddd0000-0000-4000-8000-000000000601','dddd0000-0000-4000-8000-000000000201',s2,'We had something similar with shiny tape. Is the floor finish different by the door?',now()-interval '12 minutes');
 perform set_config('request.jwt.claim.sub',s1::text,true);
 insert into public.circle_comments(id,post_id,owner_id,body,created_at) values('dddd0000-0000-4000-8000-000000000602','dddd0000-0000-4000-8000-000000000201',s1,'Good point. The floor changes there too. I will keep the background fixed for the next clip.',now()-interval '9 minutes');
 perform set_config('request.jwt.claim.sub',a4::text,true);
 insert into public.circle_comments(id,post_id,owner_id,body,created_at) values('dddd0000-0000-4000-8000-000000000603','dddd0000-0000-4000-8000-000000000202',a4,'Keep the camera settings next to each clip. Otherwise it is hard to tell what actually changed.',now()-interval '160 minutes');
 perform set_config('request.jwt.claim.sub',a1::text,true);
 insert into public.circle_comments(id,post_id,owner_id,body,created_at) values('dddd0000-0000-4000-8000-000000000604','dddd0000-0000-4000-8000-000000000202',a1,'Also note whether the exposure is locked. Happy to look at the outline.',now()-interval '145 minutes');
 perform set_config('request.jwt.claim.sub',s1::text,true);
 insert into public.circle_comments(id,post_id,owner_id,body,created_at) values('dddd0000-0000-4000-8000-000000000605','dddd0000-0000-4000-8000-000000000202',s1,'Added that to the outline. Thanks, this is much more concrete than just trying thresholds.',now()-interval '130 minutes');
 perform set_config('request.jwt.claim.sub',a2::text,true);
 insert into public.circle_comments(id,post_id,owner_id,body,created_at) values('dddd0000-0000-4000-8000-000000000606','dddd0000-0000-4000-8000-000000000203',a2,'Hand over the package and stay quiet. Ask them to talk through what they would do next.',now()-interval '46 hours');
 perform set_config('request.jwt.claim.sub',s2::text,true);
 insert into public.circle_comments(id,post_id,owner_id,body,created_at) values('dddd0000-0000-4000-8000-000000000607','dddd0000-0000-4000-8000-000000000203',s2,'That was the bit we missed. We will test the card separately before changing the sleeve again.',now()-interval '44 hours');
 perform set_config('request.jwt.claim.sub',s3::text,true);
 insert into public.circle_comments(id,post_id,owner_id,body,created_at) values('dddd0000-0000-4000-8000-000000000608','dddd0000-0000-4000-8000-000000000203',s3,'Could you keep a copy of the old card next to the new one? Easier to discuss what changed.',now()-interval '43 hours');
 perform set_config('request.jwt.claim.sub',a4::text,true);
 insert into public.circle_comments(id,post_id,owner_id,body,created_at) values('dddd0000-0000-4000-8000-000000000609','dddd0000-0000-4000-8000-000000000204',a4,'I can help with the instructions. Send me the wording here and I can give it a cold read.',now()-interval '4 hours');
 perform set_config('request.jwt.claim.sub',s2::text,true);
 insert into public.circle_comments(id,post_id,owner_id,body,created_at) values('dddd0000-0000-4000-8000-000000000610','dddd0000-0000-4000-8000-000000000204',s2,'Thanks! Putting the current wording in the project notes before the work session.',now()-interval '210 minutes');
 perform set_config('request.jwt.claim.sub',a3::text,true);
 insert into public.circle_comments(id,post_id,owner_id,body,created_at) values('dddd0000-0000-4000-8000-000000000611','dddd0000-0000-4000-8000-000000000205',a3,'Start with the source identifiers and time order. Can a related row appear on both sides of the split?',now()-interval '6 hours');
 perform set_config('request.jwt.claim.sub',s3::text,true);
 insert into public.circle_comments(id,post_id,owner_id,body,created_at) values('dddd0000-0000-4000-8000-000000000612','dddd0000-0000-4000-8000-000000000205',s3,'I found repeated source ids across the split. Going to inspect those before touching the model again.',now()-interval '5 hours');

 perform set_config('request.jwt.claim.sub',s2::text,true);
 update public.circle_posts set resolved=true where id='dddd0000-0000-4000-8000-000000000203';
 perform set_config('request.jwt.claim.sub',s1::text,true);
 insert into public.connection_requests(id,requester_id,recipient_id,project_id,help_topic,format,goal_context,specific_question,idempotency_key,status,created_at,responded_at) values
 (r1,s1,a1,p1,'project_guidance','written_advice','Vision rover loses lane edges when the lighting changes.','What should I hold fixed before comparing lighting conditions?','dddd0000-0000-4000-8000-000000000301','accepted',now()-interval '2 hours',now()-interval '75 minutes'),
 (r2,s1,a4,p1,'project_guidance','written_advice','Rover test clips are hard to compare because the camera settings were not saved.','What belongs in a useful run log?','dddd0000-0000-4000-8000-000000000302','accepted',now()-interval '3 days',now()-interval '2 days');
 perform set_config('request.jwt.claim.sub',s1::text,true);
 perform public.send_request_message(r1,'I cleaned the lens, but the mask still changes when we turn into the lab.','dddd0000-0000-4000-8000-000000000400');
 update public.request_messages set created_at=now()-interval '70 minutes' where idempotency_key='dddd0000-0000-4000-8000-000000000400';
 perform set_config('request.jwt.claim.sub',a1::text,true);
 perform public.send_request_message(r1,'Can you lock exposure and keep the background fixed before changing the threshold?','dddd0000-0000-4000-8000-000000000401');
 update public.request_messages set created_at=now()-interval '66 minutes' where idempotency_key='dddd0000-0000-4000-8000-000000000401';
 perform set_config('request.jwt.claim.sub',s1::text,true);
 perform public.send_request_message(r1,'Exposure is still automatic. I was comparing clips without noting that.','dddd0000-0000-4000-8000-000000000402');
 update public.request_messages set created_at=now()-interval '62 minutes' where idempotency_key='dddd0000-0000-4000-8000-000000000402';
 perform set_config('request.jwt.claim.sub',a1::text,true);
 perform public.send_request_message(r1,'Start there. Keep the same route and write down the lighting condition with the clip.','dddd0000-0000-4000-8000-000000000403');
 update public.request_messages set created_at=now()-interval '58 minutes' where idempotency_key='dddd0000-0000-4000-8000-000000000403';
 perform set_config('request.jwt.claim.sub',s1::text,true);
 perform public.send_request_message(r1,'I will put those settings in the run notes before the next club review.','dddd0000-0000-4000-8000-000000000404');
 update public.request_messages set created_at=now()-interval '52 minutes' where idempotency_key='dddd0000-0000-4000-8000-000000000404';
 perform set_config('request.jwt.claim.sub',a1::text,true);
 perform public.send_request_message(r1,'Sounds good. Bring the notes back if the flicker remains and we can narrow the next test.','dddd0000-0000-4000-8000-000000000405');
 update public.request_messages set created_at=now()-interval '48 minutes' where idempotency_key='dddd0000-0000-4000-8000-000000000405';
 perform set_config('request.jwt.claim.sub',s1::text,true);
 perform public.send_request_message(r2,'My clip folders are a mess. I cannot tell which settings I used.','dddd0000-0000-4000-8000-000000000406');
 update public.request_messages set created_at=now()-interval '47 hours' where idempotency_key='dddd0000-0000-4000-8000-000000000406';
 perform set_config('request.jwt.claim.sub',a4::text,true);
 perform public.send_request_message(r2,'Could the recorder write the camera settings and a short lighting note beside each clip?','dddd0000-0000-4000-8000-000000000407');
 update public.request_messages set created_at=now()-interval '46 hours' where idempotency_key='dddd0000-0000-4000-8000-000000000407';
 perform set_config('request.jwt.claim.sub',s1::text,true);
 perform public.send_request_message(r2,'Yes. I already have the settings in the capture script, just not in the saved file.','dddd0000-0000-4000-8000-000000000408');
 update public.request_messages set created_at=now()-interval '45 hours' where idempotency_key='dddd0000-0000-4000-8000-000000000408';
 perform set_config('request.jwt.claim.sub',a4::text,true);
 perform public.send_request_message(r2,'Save them with the run, then compare clips where the route and settings match.','dddd0000-0000-4000-8000-000000000409');
 update public.request_messages set created_at=now()-interval '44 hours' where idempotency_key='dddd0000-0000-4000-8000-000000000409';
 perform set_config('request.jwt.claim.sub',s1::text,true);
 perform public.send_request_message(r2,'I added the settings to the log. It is easier to tell which clips belong to the same test now.','dddd0000-0000-4000-8000-000000000410');
 update public.request_messages set created_at=now()-interval '43 hours' where idempotency_key='dddd0000-0000-4000-8000-000000000410';
 perform set_config('request.jwt.claim.sub',a4::text,true);
 perform public.send_request_message(r2,'Good next step. Repeat the low-light run before deciding whether the detector needs changing.','dddd0000-0000-4000-8000-000000000411');
 update public.request_messages set created_at=now()-interval '42 hours' where idempotency_key='dddd0000-0000-4000-8000-000000000411';

 perform set_config('request.jwt.claim.sub',s1::text,true);
 perform public.transition_connection_request(r2,'complete');
 update public.connection_requests set completed_at=now()-interval '1 day' where id=r2;
 insert into public.outcomes(id,request_id,reported_by,outcome_type,learned,helped,next_step,log_shared,project_id,created_at) values('dddd0000-0000-4000-8000-000000000501',r2,s1,'technical_advice','Keeping camera settings beside each clip made the runs easier to compare.','','Repeat the low-light run with the same route before changing the detector.',true,p1,now()-interval '1 day');
 insert into public.request_reads(request_id,member_id,last_message_id) select r1,s1,id from public.request_messages where idempotency_key='dddd0000-0000-4000-8000-000000000403';
 insert into public.request_reads(request_id,member_id,last_message_id) select r1,a1,id from public.request_messages where idempotency_key='dddd0000-0000-4000-8000-000000000401';
 update public.notifications n set created_at=m.created_at from public.request_messages m where n.dedupe_key='message:'||m.id and m.request_id in(r1,r2);
 update public.notifications set created_at=now()-interval '1 day',read_at=now()-interval '20 hours' where request_id=r2;
 update public.notifications set created_at=now()-interval '70 minutes' where request_id=r1 and kind='new_request';
 delete from private.rate_limits where actor=any(ids);
 perform set_config('request.jwt.claim.sub',original_actor::text,true);
end;
$$;
revoke all on function public.reset_reach_demo() from public,anon;
grant execute on function public.reset_reach_demo() to authenticated;
