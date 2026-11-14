import Link from "next/link";
import { MoveUpRight } from "lucide-react";
export function Brand({ light = false }: { light?: boolean }) {
  return <Link href="/" className={`brand ${light ? "brand-light" : ""}`} aria-label="Ramblin’ Reach home">
    <span className="brand-mark" aria-hidden="true"><MoveUpRight size={23} strokeWidth={2.5} /></span>
    <span>Ramblin’<strong>Reach</strong></span>
  </Link>;
}
