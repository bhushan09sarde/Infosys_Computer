"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { StudentIcon } from "@/components/student/student-icon";
import type { StudentProfile } from "@/lib/student";

const navigation = [
  ["Dashboard", "/student/dashboard", "dashboard"],
  ["My Courses", "/student/courses", "courses"],
  ["Study Materials", "/student/materials", "materials"],
  ["Announcements", "/student/announcements", "announcements"],
  ["Events", "/student/events", "events"],
  ["Downloads", "/student/downloads", "downloads"],
  ["Profile", "/student/profile", "profile"],
  ["Change Password", "/student/change-password", "password"],
  ["Support", "/student/support", "support"],
] as const;

const mobileNavigation = navigation.slice(0, 3).concat([navigation[6]]);

function StudentAvatar({ profile }: { profile: StudentProfile }) {
  if (profile.avatarUrl) return <Image className="portal-avatar" src={profile.avatarUrl} alt="" width={42} height={42} referrerPolicy="no-referrer" />;
  return <span className="portal-avatar portal-avatar-fallback" aria-hidden="true">{profile.fullName.charAt(0).toUpperCase()}</span>;
}

const routeTitles: Record<string, string> = { "/student/dashboard": "Student Dashboard", "/student/courses": "My Courses", "/student/materials": "Study Materials", "/student/announcements": "Announcements", "/student/events": "Events", "/student/downloads": "Downloads", "/student/profile": "Profile", "/student/change-password": "Change Password", "/student/support": "Support" };

export function StudentPortalShell({ profile, notificationCount, children }: { profile: StudentProfile; notificationCount: number; children: React.ReactNode }) {
  const pathname = usePathname();
  return <section className="student-portal">
    <div className="student-portal-frame">
      <aside className="portal-sidebar">
        <Link className="portal-brand" href="/student/dashboard"><span>IC</span><div><strong>Infosys Computer</strong><small>Student Learning Portal</small></div></Link>
        <div className="portal-alc"><span>MKCL Authorized Learning Center</span><strong>ALC Code: 14210309</strong></div>
        <nav aria-label="Student portal">{navigation.map(([label, href, icon]) => <Link className={pathname === href ? "active" : ""} aria-current={pathname === href ? "page" : undefined} href={href} key={href}><StudentIcon name={icon} /><span>{label}</span></Link>)}</nav>
        <LogoutButton className="portal-logout" />
      </aside>
      <div className="portal-workspace">
        <header className="portal-topbar">
          <details className="portal-mobile-menu"><summary aria-label="Open student navigation"><StudentIcon name="menu" /></summary><nav aria-label="More student links">{navigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}<LogoutButton className="portal-mobile-logout" /></nav></details>
          <div className="portal-topbar-label"><strong>{routeTitles[pathname] || "Student Portal"}</strong><span>Learn · Practice · Progress</span></div>
          <Link className="portal-notification" href="/student/announcements" aria-label={notificationCount ? `${notificationCount} current student updates` : "No current student updates"}><StudentIcon name="bell" />{notificationCount > 0 && <span>{notificationCount > 9 ? "9+" : notificationCount}</span>}</Link>
          <div className="portal-account"><StudentAvatar profile={profile} /><div><strong>{profile.fullName}</strong><span>Student</span></div></div>
        </header>
        <main className="portal-main">{children}</main>
      </div>
    </div>
    <nav className="portal-bottom-nav" aria-label="Student mobile navigation">{mobileNavigation.map(([label, href, icon]) => <Link className={pathname === href ? "active" : ""} aria-current={pathname === href ? "page" : undefined} href={href} key={href}><StudentIcon name={icon} /><span>{label === "Study Materials" ? "Materials" : label.replace("My ", "")}</span></Link>)}</nav>
  </section>;
}
