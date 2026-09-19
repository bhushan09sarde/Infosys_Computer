import { redirect } from "next/navigation";
import { ChangePasswordForm } from "@/components/student/change-password-form";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ChangePasswordPage() {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect("/login?next=/student/change-password");
  const providers = Array.isArray(user.app_metadata.providers) ? user.app_metadata.providers : [user.app_metadata.provider];
  return <div className="portal-list-page"><header className="portal-page-heading"><div><p className="eyebrow"><span /> Account security</p><h1>Change Password</h1><p>Choose a new password for your email/password student account.</p></div></header><div className="account-panel"><ChangePasswordForm passwordEnabled={providers.includes("email")} /></div></div>;
}
