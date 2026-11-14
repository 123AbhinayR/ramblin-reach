import Link from "next/link";
import {notFound} from "next/navigation";
import {z} from "zod";
import {requireMember} from "@/lib/auth/guard";
import {WorkspaceNav} from "@/components/workspace-nav";
import {CircleActions} from "@/components/circle-actions";
import {CircleEditor} from "@/components/circle-editor";
import {circleDiscussion,circleAuthors} from "@/lib/circles/data";
import {CIRCLES,POST_TYPES} from "@/lib/circles/schemas";
export const dynamic="force-dynamic";
export default async function DiscussionPage({params}:{params:Promise<{id:string}>}){
 const {client,profile}=await requireMember();const id=z.uuid().safeParse((await params).id);if(!id.success)notFound();const discussion=await circleDiscussion(client,id.data);if(!discussion)notFound();const {post,comments}=discussion;
 const authors=await circleAuthors(client,[post.owner_id,...comments.map(c=>c.owner_id)]);const author=authors.find(a=>a.id===post.owner_id);const owner=post.owner_id===profile.id;
 const name=(ownerId:string)=>{const a=authors.find(p=>p.id===ownerId);return `${a?.display_name??"Member"} · ${a?.affiliation==="alumni"?"Alumni":"Student"}${a?.is_demo?" · DEMO DATA":""}`;};
 return <section className="container workspace"><WorkspaceNav/><Link className="text-link" href={`/circles?category=${post.category}`}>← {CIRCLES[post.category]}</Link><article className="panel circle-detail"><p className="eyebrow">{POST_TYPES[post.kind]} · {post.resolved?"Resolved":"Open"}</p><h1>{post.title}</h1><p className="field-hint">{name(post.owner_id)}</p><p className="preserve-lines">{post.description}</p><h2>What would help</h2><p className="preserve-lines">{post.specific_request}</p><div className="tag-list">{post.tags.map(tag=><span key={tag}>{tag}</span>)}</div>{post.team_size&&<p>Team size: {post.team_size}</p>}{post.project_url&&<a className="text-link" href={post.project_url} target="_blank" rel="noopener noreferrer">Public project ↗</a>}{post.github_url&&<a className="text-link" href={post.github_url} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}
 {!owner&&author&&<p><Link className="text-link" href={`/people/${author.id}`}>I can help · view member and connect →</Link></p>}
 {owner&&<details><summary className="text-link">Edit discussion</summary><CircleEditor post={post}/></details>}
 <CircleActions id={post.id} owner={owner} resolved={post.resolved}/></article>
 <section className="recent-paths"><h2>Replies</h2>{!comments.length&&<p className="muted">No replies yet. A specific question makes it easier for someone to help.</p>}{comments.filter(c=>!c.parent_id).map(comment=><article className="project-memory" key={comment.id}><p className="field-hint">{name(comment.owner_id)}</p><p className="preserve-lines">{comment.body}</p>{comments.filter(c=>c.parent_id===comment.id).map(reply=><blockquote key={reply.id}><span>{name(reply.owner_id)}</span><p className="preserve-lines">{reply.body}</p></blockquote>)}{!post.resolved&&<details><summary className="text-link">Reply to comment</summary><CircleActions id={post.id} parentId={comment.id}/></details>}</article>)}</section>
 </section>;
}
