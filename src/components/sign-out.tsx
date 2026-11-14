"use client";
import { useState } from "react";
import { Button } from "./ui/button";
export function SignOut() {
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  return <div><Button variant="outline" disabled={busy} onClick={async () => {
    setBusy(true); setError(false);
    try { const result = await fetch("/api/auth/logout", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }); if (!result.ok) throw new Error(); window.location.replace(new URL("/login", window.location.origin).href); }
    catch { setError(true); setBusy(false); }
  }}>{busy ? "Signing out…" : "Sign out"}</Button>{error && <p role="alert">Couldn’t sign out. Try again.</p>}</div>;
}
