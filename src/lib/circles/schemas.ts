import { z } from "zod";
import { textField } from "@/lib/domain/schemas";
import { isSafeProjectUrl } from "@/lib/requests/schemas";
const safeProjectUrlSchema=z.string().trim().max(500).refine(isSafeProjectUrl);

export const CIRCLES = { hackathons: "Hackathons", startups: "Startups", projects: "Personal Projects", research: "Research", clubs: "Clubs & Organizations", careers: "Careers" } as const;
export const POST_TYPES = { help: "Ask for Help", building: "Building Something", teammates: "Looking for Teammates", feedback: "Project Feedback", update: "Project Update", learning: "Learning Request" } as const;
export const categorySchema = z.enum(["hackathons", "startups", "projects", "research", "clubs", "careers"]);
export const postInputSchema = z.strictObject({
 category: categorySchema, kind: z.enum(["help", "building", "teammates", "feedback", "update", "learning"]),
 title: textField(3,100), description: textField(10,2000), specific_request: textField(10,400),
 tags: z.array(textField(1,40)).max(8), project_url: safeProjectUrlSchema.nullable(), github_url: safeProjectUrlSchema.nullable(),
 team_size: z.number().int().min(1).max(100).nullable(),
});
export const postSchema = postInputSchema.extend({ id:z.uuid(),owner_id:z.uuid(),resolved:z.boolean(),created_at:z.string(),updated_at:z.string() });
export const commentInputSchema = z.strictObject({body:textField(2,1000),parent_id:z.uuid().nullable()});
export const commentSchema = commentInputSchema.extend({id:z.uuid(),post_id:z.uuid(),owner_id:z.uuid(),created_at:z.string()});
export const authorSchema=z.object({id:z.uuid(),display_name:z.string(),affiliation:z.enum(["student","alumni"]),is_demo:z.boolean()});
export type CirclePost=z.infer<typeof postSchema>;
export type CircleComment=z.infer<typeof commentSchema>;
export type CircleAuthor=z.infer<typeof authorSchema>;
export function canManagePost(post:Pick<CirclePost,"owner_id">,viewerId:string|null|undefined){
 return Boolean(viewerId)&&post.owner_id===viewerId;
}
export function orderPosts(posts:CirclePost[],category:string,sort:"recent"|"relevant",skills:string[]) {
 const tags=new Set(skills.map(s=>s.toLowerCase()));
 const score=(post:CirclePost)=>post.tags.filter(t=>tags.has(t.toLowerCase())).length;
 return posts.filter(p=>!category||p.category===category).sort((a,b)=>(sort==="relevant"?score(b)-score(a):0)||b.created_at.localeCompare(a.created_at)||a.id.localeCompare(b.id));
}
