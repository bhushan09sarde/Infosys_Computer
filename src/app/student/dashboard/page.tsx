import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getStudentProfile } from "@/lib/student";
import { StudentIcon } from "@/components/student/student-icon";
import { getPublishedMaterials } from "@/lib/study-materials";
import { materialKind } from "@/lib/study-materials-shared";
import { getAnnouncements, getEnrollments, getUpcomingEvents } from "@/lib/portal-data";

const quickActions = [
  ["My Courses", "/student/courses", "courses"],
  ["Study Materials", "/student/materials", "materials"],
  ["Events", "/student/events", "events"],
  ["Announcements", "/student/announcements", "announcements"],
  ["Downloads", "/student/downloads", "downloads"],
  ["Support", "/student/support", "support"],
] as const;

export const dynamic = "force-dynamic";

function EmptyState({ text, href, action }: { text: string; href?: string; action?: string }) {
  return <div className="portal-empty"><span aria-hidden="true">—</span><p>{text}</p>{href && action && <Link href={href}>{action}<StudentIcon name="arrow" size={16} /></Link>}</div>;
}

export default async function StudentDashboard() {
  const profile = await getStudentProfile();
  if (!profile) redirect("/login?next=/student/dashboard");
  const [{ materials: recentMaterials }, { data: courses }, { data: announcements }, { data: upcomingEvents }] = await Promise.all([getPublishedMaterials(3), getEnrollments(3), getAnnouncements(3), getUpcomingEvents(3)]);
  const currentDate = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date());
  const hour = Number(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date()));
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return <div className="dashboard-page">
    <section className="dashboard-welcome">
      <div><span>{currentDate}</span><p>{greeting},</p><h1>{profile.fullName}</h1><small>Keep learning, keep growing.</small></div>
      <div className="welcome-profile" aria-label="Authenticated student profile">{profile.avatarUrl ? <Image src={profile.avatarUrl} alt="" width={72} height={72} referrerPolicy="no-referrer" /> : <strong aria-hidden="true">{profile.fullName.charAt(0).toUpperCase()}</strong>}<div><span>Student</span><small>{profile.email}</small></div></div>
    </section>

    <section className="dashboard-quick" aria-labelledby="quick-actions-title"><div className="portal-section-heading"><h2 id="quick-actions-title">Quick actions</h2></div><div>{quickActions.map(([label, href, icon]) => <Link href={href} key={href}><span><StudentIcon name={icon} /></span><strong>{label}</strong><StudentIcon name="arrow" size={16} /></Link>)}</div></section>

    <div className="dashboard-columns">
      <div className="dashboard-primary">
        <section className="portal-section"><div className="portal-section-heading"><div><span>Learning</span><h2>My Courses</h2></div><StudentIcon name="courses" /></div>{courses.length ? <div className="dashboard-preview-list">{courses.map((course) => <Link href="/student/courses" key={course.id}><div><strong>{course.course_name}</strong><small>{course.course_category || course.course_code} · {course.status}</small></div><StudentIcon name="arrow" size={16} /></Link>)}</div> : <EmptyState text="No courses have been assigned to your account yet." href="/student/courses" action="View My Courses" />}</section>
        <section className="portal-section"><div className="portal-section-heading"><div><span>Resources</span><h2>Study Materials</h2></div><StudentIcon name="materials" /></div>{recentMaterials.length ? <div className="dashboard-materials">{recentMaterials.map((material) => <Link href="/student/materials" key={material.id}><span>{materialKind(material.file_type)}</span><div><strong>{material.title}</strong><small>{material.course}{material.category ? ` · ${material.category}` : ""}</small></div><StudentIcon name="arrow" size={16} /></Link>)}<Link className="dashboard-materials-all" href="/student/materials">View all study materials<StudentIcon name="arrow" size={16} /></Link></div> : <EmptyState text="Study materials will appear here when they are published." href="/student/materials" action="Go to Study Materials" />}</section>
      </div>
      <aside className="dashboard-secondary" aria-label="Student updates and support">
        <section className="portal-section portal-section-compact"><div className="portal-section-heading"><div><span>Updates</span><h2>Announcements</h2></div><StudentIcon name="announcements" /></div>{announcements.length ? <div className="dashboard-preview-list compact">{announcements.map((item) => <Link href="/student/announcements" key={item.id}><div><strong>{item.title}</strong><small>{new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(item.published_at))}</small></div><StudentIcon name="arrow" size={14} /></Link>)}</div> : <EmptyState text="No announcements available right now." />}</section>
        <section className="portal-section portal-section-compact"><div className="portal-section-heading"><div><span>Calendar</span><h2>Upcoming Events</h2></div><StudentIcon name="events" /></div>{upcomingEvents.length ? <div className="dashboard-preview-list compact">{upcomingEvents.map((event) => <Link href="/student/events" key={event.id}><div><strong>{event.title}</strong><small>{new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(`${event.event_date}T00:00:00`))}{event.location ? ` · ${event.location}` : ""}</small></div><StudentIcon name="arrow" size={14} /></Link>)}</div> : <EmptyState text="No upcoming events." href="/student/events" action="View Events" />}</section>
        <section className="portal-support"><span><StudentIcon name="support" /></span><div><h2>Need help?</h2><p>Visit Student Support or speak with the institute team.</p><Link href="/student/support">Open Student Support<StudentIcon name="arrow" size={16} /></Link></div></section>
      </aside>
    </div>
  </div>;
}
