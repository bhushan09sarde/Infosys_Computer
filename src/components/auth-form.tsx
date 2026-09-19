"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { loginWithPassword } from "@/app/login/actions";
import { friendlyAuthError, safeStudentPath } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ProfilePhotoPicker } from "@/components/student/profile-photo-picker";

type AuthFormProps = { mode: "login" | "register" };

export function AuthForm({ mode }: AuthFormProps) {
  const searchParams = useSearchParams();
  const callbackFailed = ["oauth", "profile"].includes(searchParams.get("authError") ?? "") || searchParams.get("confirmation") === "failed";
  const [status, setStatus] = useState<{ type: "error" | "success"; message: string } | null>(callbackFailed ? { type: "error", message: "Google authentication could not be completed. Please try again or use email and password." } : null);
  const [submitting, setSubmitting] = useState(false);
  const [registrationPhoto, setRegistrationPhoto] = useState<File | null>(null);
  const [registrationReady, setRegistrationReady] = useState(false);
  const isRegister = mode === "register";

  async function handleGoogleSignIn() {
    setStatus(null);
    if (!isSupabaseConfigured()) {
      setStatus({ type: "error", message: "Student access is not configured yet. Please contact the institute." });
      return;
    }

    setSubmitting(true);
    const next = safeStudentPath(searchParams.get("next"));
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(next)}` },
    });
    if (error) {
      setStatus({ type: "error", message: friendlyAuthError(error.message) });
      setSubmitting(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (!isSupabaseConfigured()) {
      setStatus({ type: "error", message: "Student access is not configured yet. Please contact the institute." });
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus({ type: "error", message: "Enter a valid email address." });
      return;
    }
    if (password.length < 8) {
      setStatus({ type: "error", message: "Password must be at least 8 characters." });
      return;
    }

    setSubmitting(true);
    const supabase = createClient();

    if (isRegister) {
      const fullName = String(form.get("fullName") ?? "").trim();
      const confirmPassword = String(form.get("confirmPassword") ?? "");
      const phone = String(form.get("phone") ?? "").trim();
      if (!fullName) {
        setStatus({ type: "error", message: "Enter your full name." });
        setSubmitting(false);
        return;
      }
      if (password !== confirmPassword) {
        setStatus({ type: "error", message: "Passwords do not match." });
        setSubmitting(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm?next=/student/dashboard`,
          data: { full_name: fullName, phone: phone || null },
        },
      });
      if (error) setStatus({ type: "error", message: friendlyAuthError(error.message) });
      else if (data.session) {
        if (!data.user) {
          setStatus({ type: "error", message: "Your account was created without an active user session. Please sign in." });
          setSubmitting(false);
          return;
        }
        const { data: profile, error: profileError } = await supabase.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
        if (profileError || profile?.role !== "student") {
          if (process.env.NODE_ENV === "development") console.error("[registration-profile]", { profileFound: Boolean(profile), resolvedRole: profile?.role ?? null, code: profileError?.code ?? null, message: profileError?.message ?? "Student role missing" });
          setStatus({ type: "error", message: "Your account was created, but its student profile could not be loaded. Please contact the institute." });
          setSubmitting(false);
          return;
        }
        if (registrationPhoto) {
          const photoForm = new FormData(); photoForm.set("photo", registrationPhoto);
          const photoResponse = await fetch("/api/student/profile-photo", { method: "POST", body: photoForm });
          if (!photoResponse.ok) {
            const photoResult = await photoResponse.json().catch(() => null);
            setStatus({ type: "error", message: `Your student account was created, but the optional photo was not saved. ${photoResult?.error || "You can add it from Profile."}` });
            setRegistrationReady(true);
            setSubmitting(false);
            return;
          }
        }
        window.location.replace("/student/dashboard");
        return;
      } else setStatus({ type: "success", message: registrationPhoto ? "Check your email to confirm your account. For security, add the selected photo from Profile after your first sign-in." : "Check your email to confirm your account before signing in." });
    } else {
      const result = await loginWithPassword(email, password, searchParams.get("next"));
      if (result.authenticated) {
        // The Server Action response has written and validated the auth cookies.
        window.location.replace(result.destination);
        return;
      } else {
        setStatus({ type: "error", message: result.message });
      }
    }
    setSubmitting(false);
  }

  return <form className="auth-form" onSubmit={handleSubmit} noValidate>
    <button className="google-auth-button" type="button" onClick={handleGoogleSignIn} disabled={submitting}><span aria-hidden="true">G</span>Continue with Google</button>
    <div className="auth-separator"><span>OR</span></div>
    {isRegister && <ProfilePhotoPicker onSelected={setRegistrationPhoto} />}
    {isRegister && <div className="form-field"><label htmlFor="fullName">Full Name</label><input id="fullName" name="fullName" autoComplete="name" required /></div>}
    <div className="form-field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" inputMode="email" autoComplete="email" required /></div>
    {isRegister && <div className="form-field"><label htmlFor="phone">Mobile Number <span>(optional)</span></label><input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" /></div>}
    <div className="form-field"><label htmlFor="password">Password</label><input id="password" name="password" type="password" minLength={8} autoComplete={isRegister ? "new-password" : "current-password"} required /></div>
    {isRegister && <div className="form-field"><label htmlFor="confirmPassword">Confirm Password</label><input id="confirmPassword" name="confirmPassword" type="password" minLength={8} autoComplete="new-password" required /></div>}
    {status && <p className={`auth-status auth-status-${status.type}`} role={status.type === "error" ? "alert" : "status"}>{status.message}</p>}
    {registrationReady ? <button className="button button-primary auth-submit" type="button" onClick={() => window.location.replace("/student/dashboard")}>Continue to Dashboard<span aria-hidden="true">→</span></button> : <button className="button button-primary auth-submit" type="submit" disabled={submitting}>{submitting ? "Please wait…" : isRegister ? "Create Student Account" : "Login"}<span aria-hidden="true">→</span></button>}
    <p className="auth-switch">{isRegister ? "Already have an account?" : "Don’t have an account?"} <Link href={isRegister ? "/login" : "/register"}>{isRegister ? "Login" : "Register"}</Link></p>
  </form>;
}
