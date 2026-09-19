import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedIdentity } from "@/lib/server-auth";

export type StudentProfile = {
  fullName: string;
  email: string;
  avatarUrl: string | null;
  role: "student" | "admin";
  phone: string;
  courseInterest: string;
  hasCustomPhoto: boolean;
};

function safeGoogleAvatar(value: unknown) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "lh3.googleusercontent.com" ? url.toString() : null;
  } catch {
    return null;
  }
}

export const getStudentProfile = cache(async (): Promise<StudentProfile | null> => {
  const identity = await getAuthenticatedIdentity();
  if (identity.status !== "authenticated") return null;

  if (identity.role === "admin") {
    return {
      fullName: identity.fullName,
      email: identity.profileEmail || identity.userEmail,
      avatarUrl: safeGoogleAvatar(identity.metadata.avatar_url || identity.metadata.picture),
      role: "admin",
      phone: "",
      courseInterest: "",
      hasCustomPhoto: false,
    };
  }

  const supabase = await createClient();
  const profileSelect = "full_name,email,avatar_url,phone,course_interest";
  const { data: profile, error: profileError } = await supabase.from("profiles").select(profileSelect).eq("id", identity.userId).maybeSingle();

  if (profileError || !profile) {
    if (process.env.NODE_ENV === "development") {
      const { data: matchingProfile, error: existenceError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", identity.userId)
        .maybeSingle();

      console.error(`[student-auth] ${JSON.stringify({
        authenticatedUserPresent: true,
        authenticatedUserId: identity.userId,
        query: `profiles.select(${profileSelect}).eq(id, authenticatedUserId).maybeSingle()`,
        profileFound: Boolean(profile),
        matchingProfileRowExists: Boolean(matchingProfile),
        code: profileError?.code ?? null,
        message: profileError?.message ?? "Student profile details missing",
        details: profileError?.details ?? null,
        hint: profileError?.hint ?? null,
        existenceCheckError: existenceError ? {
          code: existenceError.code,
          message: existenceError.message,
          details: existenceError.details,
          hint: existenceError.hint,
        } : null,
        redirectReason: "profile-details-failed",
      })}`);
    }
    return null;
  }

  const customPhotoPath = typeof profile.avatar_url === "string" && profile.avatar_url.startsWith(`${identity.userId}/`) && !profile.avatar_url.includes("..") ? profile.avatar_url : null;
  let avatarUrl = safeGoogleAvatar(profile.avatar_url) || safeGoogleAvatar(identity.metadata.avatar_url || identity.metadata.picture);
  if (customPhotoPath) {
    const { data: signed, error: signedError } = await supabase.storage.from("profile-photos").createSignedUrl(customPhotoPath, 3600);
    if (signed?.signedUrl) avatarUrl = signed.signedUrl;
    else if (process.env.NODE_ENV === "development") console.error(`[profile-photo] ${JSON.stringify({ operation: "create-signed-url", code: signedError?.name ?? null, message: signedError?.message ?? "Signed URL missing" })}`);
  }

  return {
    fullName: profile.full_name,
    email: profile.email || identity.userEmail,
    avatarUrl,
    role: "student",
    phone: profile?.phone || "",
    courseInterest: profile?.course_interest || "",
    hasCustomPhoto: Boolean(customPhotoPath),
  };
});
