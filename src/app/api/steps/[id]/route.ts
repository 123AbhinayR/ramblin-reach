import { z } from "zod";
import { apiMember } from "@/lib/api-member";
import { failure,HttpError,json,readInput } from "@/lib/http";
export async function PATCH(request:Request,context:{params:Promise<{id:string}>}) {
  try { const {client}=await apiMember(); const id=z.uuid().parse((await context.params).id); const input=await readInput(request,z.strictObject({status:z.enum(["done","not_started"])}));
    const {data,error}=await client.from("path_steps").update(input).eq("id",id).select("id,status,completed_at").maybeSingle();
    if(error) throw new Error("Step update failed"); if(!data) throw new HttpError(404,"NOT_FOUND","Step unavailable."); return json(z.object({id:z.uuid(),status:z.enum(["done","not_started"]),completed_at:z.string().nullable()}).parse(data));
  } catch(error){return failure(error);}
}
