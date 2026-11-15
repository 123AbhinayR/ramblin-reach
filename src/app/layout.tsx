import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
export const metadata: Metadata = { title: { default: "Ramblin' Reach — Georgia Tech student and alumni network.", template: "%s · Ramblin' Reach" }, description: "One network for Georgia Tech students and alumni to build, help, and learn together." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body><a className="skip-link" href="#main">Skip to content</a><SiteHeader /><main id="main">{children}</main><SiteFooter /></body></html>;
}
