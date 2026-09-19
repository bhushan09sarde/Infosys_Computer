"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ChangePasswordForm({ passwordEnabled }: { passwordEnabled: boolean }) {
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [busy, setBusy] = useState(false);
  if (!passwordEnabled) return <div className="portal-complete-empty"><strong>This account signs in with Google.</strong><p>Password changes are not available because no email/password identity is connected. Continue using Google to sign in.</p></div>;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); const password = String(data.get("password") ?? ""); const confirmation = String(data.get("confirmation") ?? ""); setNotice(null);
    if (password.length < 8) return setNotice({ type: "error", message: "Use at least 8 characters for the new password." });
    if (password !== confirmation) return setNotice({ type: "error", message: "The passwords do not match." });
    setBusy(true);
    try { const { error } = await createClient().auth.updateUser({ password }); if (error) setNotice({ type: "error", message: "The password could not be updated. Please try again." }); else { form.reset(); setNotice({ type: "success", message: "Your password has been updated." }); } } catch { setNotice({ type: "error", message: "The password request could not be completed. Please try again." }); } finally { setBusy(false); }
  }
  return <form className="account-form password-form" onSubmit={submit}><label><span>New password</span><input name="password" type="password" minLength={8} autoComplete="new-password" required /></label><label><span>Confirm password</span><input name="confirmation" type="password" minLength={8} autoComplete="new-password" required /></label>{notice && <p className={`account-form-notice account-form-${notice.type}`} role={notice.type === "error" ? "alert" : "status"}>{notice.message}</p>}<button className="button button-primary" disabled={busy}>{busy ? "Updating…" : "Update password"}</button></form>;
}
