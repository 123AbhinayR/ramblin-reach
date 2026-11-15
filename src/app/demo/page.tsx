import {notFound} from 'next/navigation';
import {personaNames} from "@/lib/demo/names";
import {demoEnabled,demoAccounts} from '@/lib/demo/server';
import {DemoControls} from '@/components/demo-controls';
export const dynamic='force-dynamic';
export default async function DemoPage(){if(!demoEnabled())notFound();let personas:{alias:string;id:string;name:string}[]=[];try{personas=(await demoAccounts()).map(a=>({alias:a.alias,id:a.id,name:personaNames[a.alias]}));}catch{/* Setup state never pretends live fixtures exist. */}return <section className="container narrow page-space"><h1>Choose your workspace</h1><p>Switch accounts to explore a different view of the workspace.</p>{personas.length?<DemoControls personas={personas}/>:<div className="panel"><h2>Set up the workspace first.</h2><p>Run the local seed command, then reload this page.</p></div>}<p>Reset affects only this isolated scenario. If an outside account has interacted with it, reset refuses rather than removing their data.</p></section>;}
