import {notFound} from 'next/navigation';
import {demoEnabled,demoAccounts} from '@/lib/demo/server';
import {DemoControls} from '@/components/demo-controls';
export const dynamic='force-dynamic';
export default async function DemoPage(){if(!demoEnabled())notFound();let personas:{alias:string;id:string}[]=[];try{personas=(await demoAccounts()).map(a=>({alias:a.alias,id:a.id}));}catch{/* Setup state never pretends live fixtures exist. */}return <section className="container narrow page-space"><h1>DEMO DATA · Ramblin’ Reach</h1><p>Seven fictional personas with real Supabase authentication. All projects, conversations and outcomes in this scenario are simulated.</p>{personas.length?<DemoControls personas={personas}/>:<div className="panel"><h2>Seed the local demo first.</h2><p>Run npm run demo:seed, then reload this page.</p></div>}<p>Reset affects only this isolated scenario. If an outside account has interacted with it, reset refuses rather than removing their data.</p></section>;}
