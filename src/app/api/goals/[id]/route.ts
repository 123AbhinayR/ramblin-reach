import { z } from "zod";
import { apiMember } from "@/lib/api-member";
import { loadPath } from "@/lib/path/data";
import { failure,HttpError,json } from "@/lib/http";
export async function GET(_request:Request,context:{params:Promise<{id:string}>}) {
  try { const {client}=await apiMember(); const id=z.uuid().parse((await context.params).id); const path=await loadPath(client,id); if(!path) throw new HttpError(404,"NOT_FOUND","Path unavailable."); return json(path); } catch(error){return failure(error);}
}
