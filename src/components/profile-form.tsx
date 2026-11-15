"use client";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { profileInputSchema, type Profile } from "@/lib/auth/schemas";
import { HELP_TOPICS, labels } from "@/lib/domain/schemas";
import { CityCombobox } from "./city-combobox";
import { Button } from "./ui/button";
export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage("");
    const element = event.currentTarget;
    const form = new FormData(element);
    const optional = (key: string) => String(form.get(key) ?? "").trim() || null;
    const tags = (key: string) => String(form.get(key) ?? "").split(",").map(v => v.trim()).filter(Boolean);
    const builtTitle=String(form.get("built_title")??"").trim();
    const input = profileInputSchema.safeParse({ built_at_tech:profile.affiliation==="alumni"&&builtTitle?{title:builtTitle,year:Number(form.get("built_year")),lab:String(form.get("built_lab")??"")}:null, display_name: form.get("display_name"), visible: form.has("visible"), paused: form.has("paused"), major: optional("major"), grad_year: optional("grad_year") ? Number(form.get("grad_year")) : null, company_name: optional("company_name"), metro: optional("metro"), role_title: optional("role_title"), bio: optional("bio"), skills: tags("skills"), gt_topics: tags("gt_topics"), can_teach:tags("can_teach"),want_learn:tags("want_learn"),interests:tags("interests"),mentor_categories:form.getAll("mentor_categories"), help_topics: form.getAll("help_topics"), monthly_cap: Number(form.get("monthly_cap")) });
    if (!input.success) {
      setMessage(input.error.issues[0].message);
      const name = String(input.error.issues[0].path[0]);
      const field = element.elements.namedItem(name);
      if (field instanceof HTMLElement) field.focus();
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input.data) });
      if (!response.ok) {
        const result = z.object({ error: z.object({ message: z.string() }) }).parse(await response.json());
        setMessage(result.error.message); return;
      }
      setMessage("Profile saved. Your visibility preferences are now in effect."); router.refresh();
    } catch { setMessage("Couldn’t save your profile. Please try again."); } finally { setBusy(false); }
  }
  return <form className="form-stack" onSubmit={submit}>
    <label>Display name<input name="display_name" defaultValue={profile.display_name} maxLength={80} required /></label>
    <div className="form-grid"><label>Major<input name="major" defaultValue={profile.major ?? ""} maxLength={100} /></label><label>Graduation year (optional)<input name="grad_year" type="number" min={1900} max={2200} defaultValue={profile.grad_year ?? ""} /></label></div>
    <div className="form-grid"><label>Company (self-reported)<input name="company_name" defaultValue={profile.company_name ?? ""} maxLength={100} /></label><label>Role<input name="role_title" defaultValue={profile.role_title ?? ""} maxLength={100} /></label></div>
    <label htmlFor="profile-metro">Metro area<CityCombobox id="profile-metro" name="metro" defaultValue={profile.metro ?? ""} emptyLabel="Prefer not to share" /></label>
    <label>A little about you<textarea name="bio" defaultValue={profile.bio ?? ""} maxLength={400} rows={3} /><span className="field-hint">Keep contact details and confidential information out of your profile.</span></label>
    <label>Skills<input name="skills" defaultValue={profile.skills.join(", ")} /><span className="field-hint">Comma-separated; up to 20 skills, 40 characters each.</span></label>
    <label>Georgia Tech topics and communities<input name="gt_topics" defaultValue={profile.gt_topics.join(", ")} /></label>
    {profile.affiliation==="alumni"&&<fieldset><legend>Built at Tech (optional)</legend><p className="field-hint">Your own project history, self-reported. Clear the title to remove it. Shared only with your visible profile.</p><label>Project built at Tech<input name="built_title" maxLength={100} defaultValue={profile.built_at_tech?.title??""}/></label><label>Project year<input name="built_year" type="number" min={1900} max={2200} defaultValue={profile.built_at_tech?.year??""}/></label><label>Lab or club<input name="built_lab" maxLength={100} defaultValue={profile.built_at_tech?.lab??""}/></label></fieldset>}
    <h2>Learning Exchange</h2>
    <label>What I can teach<input name="can_teach" defaultValue={profile.can_teach.join(", ")}/></label>
    <label>What I want to learn<input name="want_learn" defaultValue={profile.want_learn.join(", ")}/></label>
    <label>Interests<input name="interests" defaultValue={profile.interests.join(", ")}/><span className="field-hint">Comma-separated tags, up to 20 per field. Shared only when your profile is visible.</span></label>
    <fieldset><legend>Categories I can help with</legend>{["hackathons","startups","projects","research","clubs","careers"].map(c=><label className="check-label" key={c}><input type="checkbox" name="mentor_categories" value={c} defaultChecked={profile.mentor_categories.includes(c as typeof profile.mentor_categories[number])}/>{c}</label>)}</fieldset>
    <fieldset><legend>How you’d like to help</legend>{HELP_TOPICS.map(topic => <label className="check-label" key={topic}><input type="checkbox" name="help_topics" value={topic} defaultChecked={profile.help_topics.includes(topic)} />{labels[topic]}</label>)}</fieldset>
    <label>Incoming requests per month<input name="monthly_cap" type="number" min={1} max={10} defaultValue={profile.monthly_cap} required /><span className="field-hint">A request limit, not your calendar availability.</span></label>
    <label className="check-label"><input name="paused" type="checkbox" defaultChecked={profile.paused} />Pause new requests</label>
    <label className="check-label"><input name="visible" type="checkbox" defaultChecked={profile.visible} />Share my profile with approved community members</label>
    <p className="field-hint">You can hide your profile at any time. Pending accounts remain hidden until approved.</p>
    <p role="status" className="form-message">{message}</p><Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save profile"}</Button>
  </form>;
}
