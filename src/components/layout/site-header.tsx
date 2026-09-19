import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { LogoutButton } from "@/components/logout-button";
import { getAuthenticatedIdentity } from "@/lib/server-auth";

const links = [["Home", "/"], ["About", "/about"], ["Courses", "/courses"], ["Study Materials", "/study-materials"], ["Gallery", "/gallery"], ["Events", "/events"], ["Contact", "/contact"]];

export async function SiteHeader() {
  let dashboardPath: "/student/dashboard" | "/admin/dashboard" | null = null;
  if (isSupabaseConfigured()) {
    const identity = await getAuthenticatedIdentity();
    if (identity.status === "authenticated") dashboardPath = identity.role === "admin" ? "/admin/dashboard" : "/student/dashboard";
  }
  const loggedOutDashboard = "/login?next=/student/dashboard";
  return <header className="site-header"><div className="container nav-wrap"><Link className="brand" href="/" aria-label="Infosys Computer home"><span className="brand-mark" aria-hidden="true">IC</span><span><strong>Infosys Computer</strong><small>Learn • Practice • Progress</small></span></Link><nav className="desktop-nav" aria-label="Primary navigation">{links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav><div className="nav-actions">{dashboardPath ? <><Link className="login-link" href={dashboardPath}>My Dashboard</Link><LogoutButton /></> : <><Link className="login-link" href={loggedOutDashboard}>My Dashboard</Link><Link className="button button-small button-primary" href="/register">Register <span aria-hidden="true">→</span></Link></>}</div><details className="mobile-menu"><summary aria-label="Open navigation"><span /><span /><span /></summary><nav aria-label="Mobile navigation">{links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}{dashboardPath ? <><Link href={dashboardPath}>My Dashboard</Link><LogoutButton className="mobile-logout" /></> : <><Link href={loggedOutDashboard}>My Dashboard</Link><Link className="mobile-register" href="/register">Register</Link></>}</nav></details></div></header>;
}
