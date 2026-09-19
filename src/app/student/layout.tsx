import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getStudentProfile } from "@/lib/student";
import { StudentPortalShell } from "@/components/student/student-portal-shell";
import { getAnnouncements, getUpcomingEvents } from "@/lib/portal-data";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) redirect("/login");
  const profile = await getStudentProfile();
  if (!profile) redirect("/login?next=/student/dashboard");
  if (profile.role === "admin") redirect("/admin/dashboard");
  const [{ data: announcements }, { data: events }] = await Promise.all([getAnnouncements(3), getUpcomingEvents(3)]);

  return <StudentPortalShell profile={profile} notificationCount={announcements.length + events.length}>{children}</StudentPortalShell>;
}
