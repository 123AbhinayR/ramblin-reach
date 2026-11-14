import Link from "next/link";
import { requireMember } from "@/lib/auth/guard";
import { ProfileForm } from "@/components/profile-form";
import { SignOut } from "@/components/sign-out";
import {WorkspaceNav} from "@/components/workspace-nav";
import {ProjectEditor} from "@/components/project-editor";
import {ownedProjectSchema} from "@/lib/projects/schemas";
import {z} from "zod";
export const dynamic = "force-dynamic";
export default async function ProfilePage() {
  const { profile, eligible,client } = await requireMember(false);
  const {data,error}=eligible?await client.from("member_projects").select("id,title,summary,skills,one_lesson,visibility").eq("owner_id",profile.id).order("created_at").limit(12):{data:[],error:null};
  if(error)throw new Error("Projects could not be loaded.");const projects=z.array(ownedProjectSchema).parse(data);
  return <section className="container narrow page-space">{eligible&&<WorkspaceNav/>}<Link className="text-link" href={eligible ? "/dashboard" : "/onboarding"}>← Back to your workspace</Link><div className="panel"><p className="eyebrow">You choose what to share</p><h1>Your profile.</h1><p className="muted">{profile.affiliation==="alumni"?"Share the work you know and the guidance you’re willing to offer. You control your request limit.":"Add your interests, projects and campus experience. You can also offer help to other students."}</p><p className="notice">{profile.is_demo ? "Demo profile · fictional information" : eligible ? "Approved member · employer information is self-reported" : "Membership pending · your profile is private"}</p><ProfileForm profile={profile} />{eligible&&<section className="recent-paths"><h2>Projects and lessons</h2><p className="field-hint">Share up to three projects. Make a project private at any time to remove it from discovery.</p>{projects.map(project=><ProjectEditor key={project.id} project={project}/>)}<ProjectEditor key={projects.length}/></section>}<div className="section-divider"><SignOut /></div></div></section>;
}
