import {z} from 'zod';
import {demoEnabled,demoAccounts,demoAlias} from '@/lib/demo/server';
import {authClient} from '@/lib/auth/server';
import {apiMember} from '@/lib/api-member';
import {failure,json,readInput,HttpError} from '@/lib/http';
export async function POST(request:Request){try{
 if(!demoEnabled())return json({error:{code:'NOT_FOUND',message:'Not found.'}},404);
 const input=await readInput(request,z.discriminatedUnion('action',[z.strictObject({action:z.literal('switch'),persona:demoAlias}),z.strictObject({action:z.literal('reset')})]));
 if(input.action==='switch'){const accounts=await demoAccounts();const account=accounts.find(a=>a.alias===input.persona);if(!account)throw new HttpError(404,'NOT_FOUND','Persona unavailable.');const client=await authClient(true);const {error}=await client.auth.signInWithPassword({email:account.email,password:account.password});if(error)throw new HttpError(409,'DEMO_AUTH','Run the local demo seed command first.');return json({ok:true});}
 const {client,profile}=await apiMember();if(!profile.is_demo)throw new HttpError(403,'FORBIDDEN','Use a registered demo persona.');const {error}=await client.rpc('reset_reach_demo');if(error)throw new HttpError(409,'RESET_REFUSED','Reset refused. Use a registered demo persona and an isolated scenario with no outside interactions.');return json({ok:true});
 }catch(error){return failure(error);}}
