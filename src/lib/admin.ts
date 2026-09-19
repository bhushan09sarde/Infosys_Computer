import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedIdentity } from "@/lib/server-auth";

export type AdminProfile = { fullName: string; email: string; phone: string; avatarUrl: string | null; role: "admin" };

function safeAvatar(value: unknown) {
  if (typeof value !== "string") return null;
  try { const url = new URL(value); return url.protocol === "https:" && url.hostname === "lh3.googleusercontent.com" ? url.toString() : null; } catch { return null; }
}

export const getAdmin = cache(async () => {
  const identity = await getAuthenticatedIdentity();
  if (identity.status !== "authenticated" || identity.role !== "admin") return null;
  const supabase = await createClient();
  const { data: profile, error } = await supabase.from("profiles").select("phone,avatar_url").eq("id", identity.userId).maybeSingle();
  if (error && process.env.NODE_ENV === "development") console.error("[admin-auth]", { stage: "PROFILE DETAILS FAILURE", code: error.code, message: error.message });
  return { supabase, user: { id: identity.userId }, profile: { fullName: identity.fullName, email: identity.profileEmail || identity.userEmail, phone: profile?.phone || "", avatarUrl: safeAvatar(profile?.avatar_url || identity.metadata.avatar_url || identity.metadata.picture), role: "admin" as const } };
});
