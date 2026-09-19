import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeStudentPath } from "@/lib/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeStudentPath(url.searchParams.get("next"));
  if (url.searchParams.get("error")) return NextResponse.redirect(new URL("/login?authError=oauth", url.origin));
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error: profileError } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
        if (!profileError && (profile?.role === "admin" || profile?.role === "student")) {
          return NextResponse.redirect(new URL(profile.role === "admin" ? "/admin/dashboard" : next, url.origin));
        }
        if (process.env.NODE_ENV === "development") {
          console.error("[oauth-role-resolution]", { authenticatedUserPresent: true, profileFound: Boolean(profile), code: profileError?.code ?? null, message: profileError?.message ?? "Profile or role missing" });
        }
        return NextResponse.redirect(new URL("/login?authError=profile", url.origin));
      }
    }
  }
  return NextResponse.redirect(new URL("/login?authError=oauth", url.origin));
}
