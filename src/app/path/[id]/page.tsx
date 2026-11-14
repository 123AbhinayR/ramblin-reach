import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { requireMember } from "@/lib/auth/guard";
import { loadPath } from "@/lib/path/data";
import { PathChecklist } from "@/components/path-checklist";
import { WorkspaceNav } from "@/components/workspace-nav";
export const dynamic="force-dynamic";
export default async function PathPage({params}:{params:Promise<{id:string}>}){
  const {client}=await requireMember();const id=z.uuid().safeParse((await params).id);if(!id.success)notFound();const path=await loadPath(client,id.data);if(!path)notFound();
  const done=path.pathSteps.filter(s=>s.status==="done").length;
  return <section className="container workspace"><WorkspaceNav/><Link href="/dashboard" className="text-link">← All your paths</Link><div className="path-heading"><p className="eyebrow">JacketPath</p><h1>{path.goal.goal_text}</h1><p className="muted">{done} of {path.pathSteps.length} steps complete · Your progress is saved.</p><progress value={done} max={path.pathSteps.length} aria-label="Path progress"/></div><div className="path-layout"><PathChecklist steps={path.pathSteps}/></div></section>;
}
