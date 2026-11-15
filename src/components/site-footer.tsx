import {getServerEnv} from "@/lib/env";
import { Brand } from "./brand";
export function SiteFooter() {
  return <footer className="site-footer"><div className="container footer-inner"><Brand />{getServerEnv().DEMO_MODE==="1"&&<span className="environment-pill">Demo environment</span>}<p>Learn from the campus. Learn from each other. Pass it forward.</p></div><div className="container disclaimer">Ramblin&apos; Reach is an independent student project and is not affiliated with or endorsed by Georgia Tech.</div></footer>;
}
