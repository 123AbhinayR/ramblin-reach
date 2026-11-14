import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
export const metadata: Metadata = { title: { default: "Ramblin’ Reach — Your next step, together.", template: "%s · Ramblin’ Reach" }, description: "Turn a goal into a source-backed campus pathway and a thoughtful connection with an opt-in Georgia Tech peer or alum." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body><a className="skip-link" href="#main">Skip to content</a><SiteHeader /><main id="main">{children}</main><SiteFooter /></body></html>;
}
