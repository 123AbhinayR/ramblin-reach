import "server-only";
import {z} from "zod";
import type {authClient} from "@/lib/auth/server";
import {authorSchema,postSchema,commentSchema} from "./schemas";
type Client=Awaited<ReturnType<typeof authClient>>;
export async function circleAuthors(client:Client,ids:string[]){
 if(!ids.length)return [];
 const {data,error}=await client.from("profiles").select("id,display_name,affiliation,is_demo").in("id",[...new Set(ids)]);
 if(error)throw new Error("Members could not be loaded.");
 return z.array(authorSchema).parse(data);
}
export async function circlePosts(client:Client,category?:"hackathons"|"startups"|"projects"|"research"|"clubs"|"careers"){
 let query=client.from("circle_posts").select("*").order("created_at",{ascending:false}).limit(60);
 if(category)query=query.eq("category",category);
 const {data,error}=await query;if(error)throw new Error("Discussions could not be loaded.");
 return z.array(postSchema).parse(data);
}
export async function circleDiscussion(client:Client,id:string){
 const {data,error}=await client.from("circle_posts").select("*").eq("id",id).maybeSingle();
 if(error)throw new Error("Discussion could not be loaded.");if(!data)return null;
 const {data:comments,error:commentError}=await client.from("circle_comments").select("*").eq("post_id",id).order("created_at").limit(100);
 if(commentError)throw new Error("Replies could not be loaded.");
 return {post:postSchema.parse(data),comments:z.array(commentSchema).parse(comments)};
}

