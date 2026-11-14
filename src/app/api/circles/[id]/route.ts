import {z} from "zod";
import {apiMember} from "@/lib/api-member";
import {failure,json,readInput,HttpError} from "@/lib/http";
import {postInputSchema,postSchema,commentInputSchema,commentSchema} from "@/lib/circles/schemas";
import {textField} from "@/lib/domain/schemas";
const actionSchema=z.discriminatedUnion("action",[
 z.strictObject({action:z.literal("edit"),post:postInputSchema}),
 z.strictObject({action:z.literal("resolve"),resolved:z.boolean()}),
 z.strictObject({action:z.literal("delete")}),
 z.strictObject({action:z.literal("comment"),...commentInputSchema.shape}),
 z.strictObject({action:z.literal("report"),reason:textField(10,500)}),
]);
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){try{
 const {client,profile}=await apiMember();const id=z.uuid().parse((await params).id);const input=await readInput(request,actionSchema);
 const {data:post,error:lookupError}=await client.from("circle_posts").select("owner_id").eq("id",id).maybeSingle();
 if(lookupError||!post)throw new HttpError(404,"NOT_FOUND","Discussion unavailable.");
 if(input.action==="comment"){
  const {data,error}=await client.from("circle_comments").insert({post_id:id,body:input.body,parent_id:input.parent_id}).select().single();
  if(error)throw new HttpError(error.message.includes("RATE_LIMIT")?429:409,"COMMENT_FAILED","Could not reply. Check profile visibility and whether the discussion is resolved, or try again in a minute.");
  return json({comment:commentSchema.parse(data)},201);
 }
 if(input.action==="report"){
  const {error}=await client.from("circle_reports").insert({post_id:id,reason:input.reason});
  if(error)throw new HttpError(error.code==="23505"?409:429,"REPORT_FAILED","Already reported, or too many reports. Try again later.");
  return json({reported:true});
 }
 if(post.owner_id!==profile.id)throw new HttpError(404,"NOT_FOUND","Discussion unavailable.");
 if(input.action==="delete"){
  const {error}=await client.from("circle_posts").delete().eq("id",id).eq("owner_id",profile.id);if(error)throw error;return json({deleted:true});
 }
 const {data,error}=await client.from("circle_posts").update(input.action==="edit"?input.post:{resolved:input.resolved}).eq("id",id).eq("owner_id",profile.id).select().single();
 if(error)throw new HttpError(error.message.includes("RATE_LIMIT")?429:409,"UPDATE_FAILED","Could not update. Try again in a minute.");
 return json({post:postSchema.parse(data)});
 }catch(error){return failure(error);}}
