import Link from "next/link";
import { ArrowRight, Code2, Rocket, FolderGit2, FlaskConical, Users, Compass, GraduationCap, HandHeart } from "lucide-react";
import { Button } from "@/components/ui/button";

const CIRCLES_ROW = [
  { key: "hackathons", label: "Hackathons", icon: Code2 },
  { key: "startups", label: "Startups", icon: Rocket },
  { key: "projects", label: "Personal Projects", icon: FolderGit2 },
  { key: "research", label: "Research", icon: FlaskConical },
  { key: "clubs", label: "Clubs & Organizations", icon: Users },
  { key: "careers", label: "Careers", icon: Compass },
] as const;

export default function WelcomePage() {
  return (
    <>
      <section className="welcome-hero container">
        <h1 className="welcome-headline">
          Get unstuck on your project with help from Georgia Tech alumni and students
        </h1>
        <p className="welcome-support">
          Connect with fellow Jackets who have built similar projects to get specific guidance, feedback, and next steps.
        </p>
        <div className="welcome-actions">
          <Button asChild>
            <Link href="/login">
              Sign in <ArrowRight size={18} />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/circles">Browse Circles</Link>
          </Button>
        </div>
      </section>

      <section className="container section-space-sm" id="how-it-works">
        <h2 className="welcome-section-title">How it works</h2>
        <div className="welcome-steps-grid">
          <div className="welcome-step-card">
            <div className="welcome-step-number">1</div>
            <h3>Post what you’re building</h3>
            <p>Share your project and current blocker in a student circle.</p>
          </div>
          <div className="welcome-step-card">
            <div className="welcome-step-number">2</div>
            <h3>See who can help and why</h3>
            <p>Find students and alumni with relevant project experience.</p>
          </div>
          <div className="welcome-step-card">
            <div className="welcome-step-number">3</div>
            <h3>Connect and record what you learned</h3>
            <p>Send a focused request, get unstuck, and log your takeaway.</p>
          </div>
        </div>
      </section>

      <section className="container section-space-sm">
        <h2 className="welcome-section-title">Who it’s for</h2>
        <div className="welcome-audience-grid">
          <div className="welcome-audience-card">
            <span className="icon-tile"><GraduationCap size={24} /></span>
            <h3>Students: ask for feedback on your project</h3>
            <p>Get practical guidance from Jackets who have solved similar challenges.</p>
          </div>
          <div className="welcome-audience-card">
            <span className="icon-tile"><HandHeart size={24} /></span>
            <h3>Alumni: help students, and learn from what they are building</h3>
            <p>Offer focused guidance at your own pace and see student innovation.</p>
          </div>
        </div>
      </section>

      <section className="container section-space-sm">
        <div className="welcome-circles-header">
          <h2 className="welcome-section-title">Explore Circles</h2>
          <Link href="/circles" className="text-link">View all discussions →</Link>
        </div>
        <div className="welcome-circles-row">
          {CIRCLES_ROW.map(({ key, label, icon: Icon }) => (
            <Link key={key} href={`/circles?category=${key}`} className="welcome-circle-chip">
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
