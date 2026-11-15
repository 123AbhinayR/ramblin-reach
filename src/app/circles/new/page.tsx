import Link from "next/link";
import {z} from "zod";
import {requireMember} from "@/lib/auth/guard";
import {WorkspaceNav} from "@/components/workspace-nav";
import {CircleEditor} from "@/components/circle-editor";
import {categorySchema} from "@/lib/circles/schemas";
export default async function NewDiscussion({searchParams}:{searchParams:Promise<{category?:string;projectId?:string}>}){
 const {profile,client}=await requireMember();const sp=await searchParams;const category=categorySchema.safeParse(sp.category);const {data,error}=await client.from("member_projects").select("id,title").eq("owner_id",profile.id).eq("visibility","members").limit(12);if(error)throw new Error("Projects unavailable.");const projects=z.array(z.object({id:z.uuid(),title:z.string()})).parse(data);
 return <section className="container workspace"><WorkspaceNav/><Link className="text-link" href="/circles">← Circles</Link><h1>Start a discussion</h1>{profile.visible?<CircleEditor projects={projects} initialProjectId={sp.projectId} category={category.success?category.data:undefined}/>:<div className="panel"><h2>Choose to share your profile first.</h2><p>Discussions identify their authors to verified members.</p><Link className="text-link" href="/profile">Review profile visibility →</Link></div>}</section>;
}
