import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, CircuitBoard, Compass, HeartHandshake, MapPin, MessageSquareText, ShieldCheck, Sparkles, Sprout, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return <>
    <section className="hero container">
      <div className="hero-copy"><p className="eyebrow"><span className="gold-dot" /> BUILT FOR GEORGIA TECH. MADE FOR WHAT’S NEXT.</p>
        <h1>A little direction.<br />A real connection.<br /><span>A world of possibility.</span></h1>
        <p className="hero-description">You have a goal. Somewhere on campus—or a few chapters ahead—there’s a resource, an idea, or a Jacket who can help you take the next step.</p>
        <div className="hero-actions"><Button asChild><Link href="/dashboard">Find your next step <ArrowRight size={18} /></Link></Button><a className="text-link" href="#how-it-works">See how it works <ArrowUpRight size={16} /></a></div>
        <div className="hero-note"><ShieldCheck size={16} /><span>Thoughtful connections. Shared experience. Your pace.</span></div>
      </div>
      <div className="journey-preview" aria-label="Illustrative sensor project pathway">
        <div className="preview-top"><span className="tiny-caps">A GOAL CAN GO A LONG WAY</span><span className="example-badge">Example pathway</span></div>
        <div className="preview-goal"><span className="icon-tile gold"><Sprout size={24} /></span><div><span className="muted-label">It starts with a question</span><h2>“How do I build an<br />environmental sensor?”</h2></div></div>
        <ol className="preview-steps">
          <li><span className="step-symbol"><Compass size={18} /></span><div><span className="tiny-caps">01 · JACKETPATH</span><h3>Find a way forward.</h3><p>Clear steps. Campus resources. Official sources.</p><div className="preview-chips"><span><CircuitBoard size={13} /> The Hive</span><span>Invention Studio <ArrowUpRight size={12} /></span></div></div></li>
          <li><span className="step-symbol"><Users size={18} /></span><div><span className="tiny-caps">02 · JACKETMATCH</span><h3>Learn from someone who’s been there.</h3><p>Discover opt-in peers and alumni with relevant experience.</p><div className="expertise-note"><span className="mini-avatar"><CircuitBoard size={16} /></span><span>Sensor experience <span className="dot-divider">·</span> Project guidance</span></div></div></li>
          <li><span className="step-symbol"><MessageSquareText size={18} /></span><div><span className="tiny-caps">03 · REACHCARD</span><h3>Make the ask meaningful.</h3><p>One specific question. A thoughtful next step.</p></div></li>
        </ol>
        <div className="preview-footer"><span className="small-check"><Check size={12} /></span> A pathway to explore—not a claim of live availability.</div>
      </div>
    </section>
    <section className="values-strip"><div className="container values-inner"><p>GO FURTHER, TOGETHER.</p><span><Compass size={17} /> Source-backed guidance</span><span><HeartHandshake size={17} /> People who choose to help</span><span><Sprout size={17} /> Learning that lasts</span></div></section>
    <section className="container section-space" id="how-it-works"><div className="section-heading"><div><p className="eyebrow">ONE GOAL. THREE SIMPLE STEPS.</p><h2>Less searching.<br />More getting somewhere.</h2></div><p>From your first prototype to your next chapter, bring the resources and people around you into one clear path.</p></div>
      <div className="feature-grid">{[
        { number: "01", label: "JacketPath", icon: Compass, title: "Turn ‘what if’ into ‘what’s next.’", body: "Break your goal into practical steps, backed by official campus resources and clear guidance on what to check before you go.", detail: "A path, not another list of links." },
        { number: "02", label: "JacketMatch", icon: Users, title: "Experience worth reaching for.", body: "Find students and alumni by skills, projects, company, or city. See why they’re relevant and whether they’re accepting requests.", detail: "Shared experience. No guesswork." },
        { number: "03", label: "ReachCard", icon: MessageSquareText, title: "Good connections start small.", body: "Share your goal and ask one focused question. Helpers set their own pace, and you decide what learning to carry forward.", detail: "A thoughtful ask goes a long way." },
      ].map(f => <article className="feature-card" key={f.label}><div className="feature-top"><span className="icon-tile"><f.icon size={23} /></span><span className="feature-number">{f.number}</span></div><p className="feature-name">{f.label}</p><h3>{f.title}</h3><p>{f.body}</p><div className="feature-detail">{f.detail}</div></article>)}</div>
    </section>
    <section className="container explore-section"><div><p className="eyebrow">YOUR NEXT CHAPTER LOOKS LIKE YOU</p><h2>What’s on your mind?</h2></div><div className="goal-examples"><Link href="/dashboard?example=sensor"><CircuitBoard size={22} /><span><strong>Build something that matters.</strong><small>Find the tools and experience for a project.</small></span><ArrowUpRight size={20} /></Link><Link href="/dashboard?example=city"><MapPin size={22} /><span><strong>Find your footing somewhere new.</strong><small>Explore a company, a career, or a new city.</small></span><ArrowUpRight size={20} /></Link></div></section>
    <section className="container section-space" id="our-approach"><div className="trust-panel"><div><p className="eyebrow">BUILT ON TRUST, NOT HYPE</p><h2>Real sources.<br />Willing people.<br /><span>Your own next step.</span></h2></div><div className="trust-copy"><p>Georgia Tech already has remarkable resources and people. Ramblin’ Reach helps you connect the dots without inventing opportunities or promising outcomes.</p><ul><li><Check size={17} /> Official links with review dates and clear caveats.</li><li><Check size={17} /> Opt-in profiles and helper-controlled request limits.</li><li><Check size={17} /> Private requests. No scraped alumni directory.</li></ul></div></div></section>
    <section className="closing-section"><div className="container"><Sparkles size={25} /><h2>What you learn today<br />can help someone tomorrow.</h2><p>Learn from the campus. Learn from each other. Pass it forward.</p><Button asChild variant="gold"><Link href="/dashboard">Start with a goal <ArrowRight size={18} /></Link></Button></div></section>
  </>;
}
