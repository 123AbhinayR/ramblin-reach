"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { reset: () => void }) { return <section className="container narrow page-space empty-state" role="alert"><h1>We hit a small detour.</h1><p>We couldn’t load this page. Please try again.</p><Button onClick={reset}>Try again</Button></section>; }
