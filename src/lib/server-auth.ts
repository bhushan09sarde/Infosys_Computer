import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type ProfileRole = "admin" | "student";

type AuthIdentity =
  | { status: "unauthenticated" }
  | { status: "profile-error"; userId: string }
  | {
      status: "authenticated";
      userId: string;
      userEmail: string;
      metadata: Record<string, unknown>;
      role: ProfileRole;
      fullName: string;
      profileEmail: string;
    };

function diagnostic(value: unknown) {
  return typeof value === "string" ? value.replace(/[\r\n]+/g, " ").slice(0, 240) : "unknown";
}

export const getAuthenticatedIdentity = cache(async (): Promise<AuthIdentity> => {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    if (process.env.NODE_ENV === "development") {
      console.info("[role-resolution]", {
        authenticatedUserPresent: false,
        profileFound: false,
        resolvedRole: null,
        reason: userError ? "validated-user-failed" : "no-session",
      });
    }
    return { status: "unauthenticated" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name,email,role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile || (profile.role !== "admin" && profile.role !== "student")) {
    if (process.env.NODE_ENV === "development") {
      console.error("[role-resolution]", {
        authenticatedUserPresent: true,
        profileFound: Boolean(profile),
        resolvedRole: null,
        code: diagnostic(profileError?.code),
        message: diagnostic(profileError?.message),
        reason: profileError ? "profile-query-failed" : "profile-or-role-missing",
      });
    }
    return { status: "profile-error", userId: user.id };
  }

  return {
    status: "authenticated",
    userId: user.id,
    userEmail: user.email ?? "",
    metadata: user.user_metadata,
    role: profile.role,
    fullName: profile.full_name,
    profileEmail: profile.email,
  };
});
