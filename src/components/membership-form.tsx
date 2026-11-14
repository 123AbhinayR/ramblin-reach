"use client";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Button } from "./ui/button";
export function MembershipForm() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const requested_affiliation = new FormData(event.currentTarget).get("affiliation");
    try {
      const response = await fetch("/api/membership", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ requested_affiliation }) });
      const result = z.object({ message: z.string().optional(), error: z.object({ message: z.string() }).optional() }).parse(await response.json());
      setMessage(response.ok ? result.message ?? "Saved." : result.error?.message ?? "Please try again.");
    } catch { setMessage("Couldn’t save your request. Please try again."); } finally { setBusy(false); }
  }
  return <form className="form-stack" onSubmit={submit}><label>Your connection to Georgia Tech<select name="affiliation"><option value="student">Student</option><option value="alumni">Alum</option></select></label><Button type="submit" disabled={busy}>{busy ? "Saving…" : "Request membership review"}</Button><p role="status">{message}</p></form>;
}
