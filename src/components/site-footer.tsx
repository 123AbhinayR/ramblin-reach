import Link from "next/link";
import {getServerEnv} from "@/lib/env";
import { Brand } from "./brand";

export function SiteFooter() {
  const isDemo = getServerEnv().DEMO_MODE === "1";
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Brand />
        <div className="footer-links">
          <a href="https://github.com/123AbhinayR/ramblin-reach" target="_blank" rel="noreferrer" className="text-link">GitHub</a>
          <a href="https://github.com/123AbhinayR/ramblin-reach#readme" target="_blank" rel="noreferrer" className="text-link">README</a>
          {isDemo && (
            <Link href="/demo" className="environment-pill">
              Demo environment
            </Link>
          )}
        </div>
      </div>
      <div className="container disclaimer">
        An independent student project for the Georgia Tech Campus Solutions Hackathon 2026. Ramblin&apos; Reach is not affiliated with or endorsed by Georgia Tech.
      </div>
    </footer>
  );
}
