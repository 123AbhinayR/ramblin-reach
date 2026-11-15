import 'server-only';
import {z} from 'zod';
import type {authClient} from '@/lib/auth/server';
import {learningRow} from './schemas';
import {detailProjectSchema,PROJECT_COLUMNS} from '@/lib/projects/schemas';
type Client=Awaited<ReturnType<typeof authClient>>;
export async function projectDetail(client:Client,id:string){const {data,error}=await client.from('member_projects').select(PROJECT_COLUMNS).eq('id',id).maybeSingle();if(error)throw new Error('Project could not be loaded.');return data?detailProjectSchema.parse(data):null;}
export async function sharedLog(client:Client,memberId:string|null,projectId:string|null){const {data,error}=await client.rpc('shared_learning_log',{p_member_id:memberId,p_project_id:projectId});if(error)throw new Error('Learning Log could not be loaded.');return z.array(learningRow).parse(data);}
