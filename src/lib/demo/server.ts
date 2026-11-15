import 'server-only';
import {readFile} from 'node:fs/promises';
import {z} from 'zod';
import {getServerEnv} from '@/lib/env';
export const DEMO_ALIASES=['student-robotics','student-startup','student-quant','alumni-robotics','alumni-startup','alumni-quant','alumni-software'] as const;
export const demoAlias=z.enum(DEMO_ALIASES);
export function demoEnabled(){const env=getServerEnv();return env.DEMO_MODE==='1'&&env.APP_ENV==='local';}
export async function demoAccounts(){const raw=await readFile(`${process.cwd()}/.tmp/reach-demo-accounts.json`,'utf8');return z.array(z.object({alias:demoAlias,id:z.uuid(),email:z.email().refine(s=>s.endsWith('@reach-demo.example.test')),password:z.string().min(12)})).length(7).parse(JSON.parse(raw));}
