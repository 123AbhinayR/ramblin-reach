import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() { return <section className="container narrow page-space empty-state"><p className="eyebrow">LET’S FIND YOUR WAY BACK</p><h1>This page isn’t available.</h1><p>The link may have changed, or the page may not be shared with you.</p><Button asChild><Link href="/dashboard">Go to home</Link></Button></section>; }
