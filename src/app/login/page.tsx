import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return <section className="auth-page"><div className="container auth-layout"><div className="auth-intro"><p className="eyebrow"><span /> Student area</p><h1>Welcome back.</h1><p>Sign in to access your student dashboard and future learning resources from Infosys Computer.</p><div className="auth-trust"><strong>MKCL Authorized Learning Center</strong><span>ALC Code: 14210309</span></div></div><div className="auth-card"><div className="auth-card-heading"><span>Student access</span><h2>Login</h2><p>Use the email and password connected to your student account.</p></div><Suspense fallback={<p className="auth-loading">Loading secure login…</p>}><AuthForm mode="login" /></Suspense></div></div></section>;
}
