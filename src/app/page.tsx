import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Rocket,
  FolderGit2,
  FlaskConical,
  Users,
  Compass,
  GraduationCap,
  HandHeart,
  Clock,
  Sparkles,
  MessageSquare,
  BookOpen,
  Share2,
} from "lucide-react";
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
          Ramblin&apos; Reach connects Georgia Tech students and alumni through what we&apos;re actually building.
          Learn how to build, explore companies and startups where Jackets work, and connect across cities through
          project-grounded conversations.
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

      {/* Audience Cards */}
      <section className="container section-space-sm">
        <h2 className="welcome-section-title">Built for the Georgia Tech community</h2>
        <div className="welcome-audience-grid">
          <div className="welcome-audience-card">
            <span className="icon-tile"><GraduationCap size={24} /></span>
            <h3>Students: Build, explore companies &amp; get unstuck</h3>
            <p>
              Post your project blockers to get real-world guidance. Explore companies and startups where
              Georgia Tech alumni work, ask for career advice and resume reviews, and learn directly from experienced builders.
            </p>
          </div>
          <div className="welcome-audience-card">
            <span className="icon-tile"><HandHeart size={24} /></span>
            <h3>Alumni: Give back &amp; connect in new cities</h3>
            <p>
              Give back seamlessly on your schedule with 60-minute availability windows. Connect with fellow Yellow
              Jackets when relocating to a new city, and stay plugged into what students are inventing on campus.
            </p>
          </div>
        </div>
      </section>

      {/* How it works: Pipeline */}
      <section className="container section-space-sm" id="how-it-works">
        <span className="welcome-pipeline-tag">Problem → Community → Relevant Person → Conversation → Action → Outcome</span>
        <h2 className="welcome-section-title">How it works</h2>
        <div className="welcome-steps-grid">
          <div className="welcome-step-card">
            <div className="welcome-step-number">1</div>
            <h3>Post what you’re building</h3>
            <p>Share a project blocker, build, teammate search, or feedback request in under a minute in a focused Circle.</p>
          </div>
          <div className="welcome-step-card">
            <div className="welcome-step-number">2</div>
            <h3>See who can help and why</h3>
            <p>Explainable matching surfaces students and alumni with transparent reasons drawn from skills, projects, and companies.</p>
          </div>
          <div className="welcome-step-card">
            <div className="welcome-step-number">3</div>
            <h3>Connect and record what you learned</h3>
            <p>Send a reviewed QuickReach request, converse in a private thread, and document takeaways in your Learning Log.</p>
          </div>
        </div>
      </section>

      {/* Holistic Platform Capabilities */}
      <section className="container section-space-sm">
        <h2 className="welcome-section-title">Everything you need to learn and connect</h2>
        <div className="welcome-features-grid">
          <div className="welcome-feature-card">
            <div className="feature-icon-tile"><Users size={20} /></div>
            <h3>JacketCircles</h3>
            <p>
              Communities for Hackathons, Startups, Personal Projects, Research, Clubs, and Careers. Post a blocker,
              progress update, or teammate search in under a minute.
            </p>
          </div>

          <div className="welcome-feature-card">
            <div className="feature-icon-tile"><Sparkles size={20} /></div>
            <h3>Explainable Matching</h3>
            <p>
              Alumni see a &ldquo;Students you can help&rdquo; feed matched on skills, interests, and services—with plain reasons
              like &ldquo;Offers ML mentoring&rdquo; or &ldquo;Built a similar project at Tech in 2014.&rdquo;
            </p>
          </div>

          <div className="welcome-feature-card">
            <div className="feature-icon-tile"><Clock size={20} /></div>
            <h3>Available Now</h3>
            <p>
              Alumni can mark a 60-minute window when they are free to answer quick questions, so students who are
              stuck get help while the problem is still fresh.
            </p>
          </div>

          <div className="welcome-feature-card">
            <div className="feature-icon-tile"><MessageSquare size={20} /></div>
            <h3>QuickReach</h3>
            <p>
              Replaces cold outreach with focused templates for Technical Mentoring, Career Questions, and Project Feedback.
              Always reviewed before sending, and accepted requests open a private inbox.
            </p>
          </div>

          <div className="welcome-feature-card">
            <div className="feature-icon-tile"><BookOpen size={20} /></div>
            <h3>Two-Way Learning</h3>
            <p>
              Every profile lists what you can teach and want to learn. Alumni post Learning Requests on modern stacks,
              and students share what they are mastering in class.
            </p>
          </div>

          <div className="welcome-feature-card">
            <div className="feature-icon-tile"><Share2 size={20} /></div>
            <h3>Learning Log &amp; Impact Cards</h3>
            <p>
              After connecting, both sides record what was learned and next steps. Projects highlight outcomes,
              and a Help Chain visualizes how knowledge passed across graduation years.
            </p>
          </div>
        </div>
      </section>

      {/* Explore Circles */}
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
