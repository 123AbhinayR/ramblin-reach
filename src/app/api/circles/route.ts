import {apiMember} from "@/lib/api-member";
import {failure,json,readInput,HttpError} from "@/lib/http";
import {postInputSchema,postSchema} from "@/lib/circles/schemas";
export async function POST(request:Request){try{
 const {client,profile}=await apiMember();const input=await readInput(request,postInputSchema);
 if(!profile.visible)throw new HttpError(403,"CONSENT","Make your profile visible to members before posting.");
 const {data,error}=await client.from("circle_posts").insert(input).select().single();
 if(error)throw new HttpError(error.message.includes("RATE_LIMIT")?429:409,"POST_FAILED","Could not post. Check your fields or try again in a minute.");
 return json({post:postSchema.parse(data)},201);
 }catch(error){return failure(error);}}
