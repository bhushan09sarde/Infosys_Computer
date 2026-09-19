import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return <section className="auth-page"><div className="container auth-layout"><div className="auth-intro"><p className="eyebrow"><span /> Student registration</p><h1>Start your student account.</h1><p>Create an account for access to the student dashboard. Study Materials and downloads will be introduced in a later phase.</p><div className="auth-trust"><strong>Secure student registration</strong><span>Every public account begins with the student role.</span></div></div><div className="auth-card"><div className="auth-card-heading"><span>New account</span><h2>Register</h2><p>Enter your details below. No enrollment or payment is collected here.</p></div><Suspense fallback={<p className="auth-loading">Loading secure registration…</p>}><AuthForm mode="register" /></Suspense></div></div></section>;
}
