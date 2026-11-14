import Link from "next/link";
import {requireMember} from "@/lib/auth/guard";
import {WorkspaceNav} from "@/components/workspace-nav";
import {CircleEditor} from "@/components/circle-editor";
import {categorySchema} from "@/lib/circles/schemas";
export default async function NewDiscussion({searchParams}:{searchParams:Promise<{category?:string}>}){
 const {profile}=await requireMember();const category=categorySchema.safeParse((await searchParams).category);
 return <section className="container workspace"><WorkspaceNav/><Link className="text-link" href="/circles">← Circles</Link><h1>Start a discussion</h1>{profile.visible?<CircleEditor category={category.success?category.data:undefined}/>:<div className="panel"><h2>Choose to share your profile first.</h2><p>Discussions identify their authors to verified members.</p><Link className="text-link" href="/profile">Review profile visibility →</Link></div>}</section>;
}
