"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { StudentIcon } from "@/components/student/student-icon";
import type { AdminProfile } from "@/lib/admin";

const nav = [["Dashboard","/admin/dashboard","dashboard"],["Students","/admin/students","profile"],["Course Assignments","/admin/enrollments","courses"],["Study Materials","/admin/study-materials","materials"],["Announcements","/admin/announcements","announcements"],["Events","/admin/events","events"],["Profile","/admin/profile","password"],["Public Contact","/contact","support"]] as const;
const titles: Record<string,string> = Object.fromEntries(nav.map(([label,href]) => [href,label]));

export function AdminShell({ profile, children }: { profile: AdminProfile; children: React.ReactNode }) {
  const pathname = usePathname();
  return <section className="admin-portal"><div className="admin-portal-frame"><aside className="admin-sidebar"><Link className="portal-brand" href="/admin/dashboard"><span>IC</span><div><strong>Infosys Computer</strong><small>Administration Portal</small></div></Link><div className="admin-role"><span>Verified access</span><strong>Administrator</strong></div><nav aria-label="Admin portal">{nav.map(([label,href,icon]) => <Link className={pathname === href ? "active" : ""} aria-current={pathname === href ? "page" : undefined} href={href} key={href}><StudentIcon name={icon}/><span>{label}</span></Link>)}</nav><LogoutButton className="portal-logout" /></aside><div className="admin-workspace"><header className="admin-topbar"><details><summary aria-label="Open admin navigation"><StudentIcon name="menu"/></summary><nav>{nav.map(([label,href]) => <Link href={href} key={href}>{label}</Link>)}<LogoutButton className="portal-mobile-logout"/></nav></details><div><strong>{titles[pathname] || "Admin Portal"}</strong><span>Secure institute administration</span></div><div className="admin-account">{profile.avatarUrl ? <Image src={profile.avatarUrl} alt="" width={42} height={42} referrerPolicy="no-referrer"/> : <b>{profile.fullName.charAt(0).toUpperCase()}</b>}<span><strong>{profile.fullName}</strong><small>Admin</small></span></div></header><main className="admin-main">{children}</main></div></div></section>;
}
