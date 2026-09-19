"use server";

import { friendlyAuthError, safeStudentPath } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type LoginResult =
  | { authenticated: true; destination: "/admin/dashboard" | string }
  | { authenticated: false; message: string };

function safeDiagnosticText(value: unknown) {
  return typeof value === "string"
    ? value.replace(/[\r\n]+/g, " ").slice(0, 240)
    : "unknown";
}

export async function loginWithPassword(email: string, password: string, requestedPath?: string | null): Promise<LoginResult> {
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
    return { authenticated: false, message: "Enter a valid email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const code = safeDiagnosticText(error.code);
    const detail = safeDiagnosticText(error.message);

    if (process.env.NODE_ENV === "development") {
      console.error("[student-auth]", {
        stage: "AUTH FAILURE",
        code,
        status: error.status ?? null,
        message: detail,
      });
    }

    return {
      authenticated: false,
      message: process.env.NODE_ENV === "development"
        ? `Supabase authentication failed (${code}): ${detail}`
        : friendlyAuthError(error.message),
    };
  }

  // Validate the newly cookie-backed session on the server. Protected routes
  // use the same server client and therefore read the same Supabase cookies.
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { authenticated: false, message: "Login completed without an active session. Please try again." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile || (profile.role !== "admin" && profile.role !== "student")) {
    if (process.env.NODE_ENV === "development") {
      console.error("[student-auth]", {
        stage: "AUTH SUCCESS / PROFILE LOOKUP FAILURE",
        authenticatedUserPresent: true,
        profileFound: Boolean(profile),
        code: safeDiagnosticText(profileError?.code),
        message: safeDiagnosticText(profileError?.message),
      });
    }
    return { authenticated: false, message: process.env.NODE_ENV === "development" ? `Authentication succeeded, but profile role resolution failed (${safeDiagnosticText(profileError?.code)}): ${safeDiagnosticText(profileError?.message)}` : "Your account profile could not be loaded. Please contact the institute." };
  }

  const destination = profile.role === "admin" ? "/admin/dashboard" : safeStudentPath(requestedPath);
  if (process.env.NODE_ENV === "development") {
    console.info("[student-auth]", { stage: "AUTH SUCCESS", authenticatedUserPresent: true, profileFound: true, resolvedRole: profile.role, redirectReason: destination });
  }
  return { authenticated: true, destination };
}
