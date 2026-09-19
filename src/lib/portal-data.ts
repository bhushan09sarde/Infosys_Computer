import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type Enrollment = { id: string; course_code: string; course_name: string; course_category: string | null; status: string; enrolled_at: string };
export type Announcement = { id: string; title: string; content: string; published_at: string; expires_at: string | null };
export type PortalEvent = { id: string; title: string; description: string | null; event_date: string; start_time: string | null; end_time: string | null; location: string | null };

export const getEnrollments = cache(async (limit?: number) => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [] as Enrollment[], error: null };
  let query = supabase.from("student_enrollments").select("id,course_code,course_name,course_category,status,enrolled_at").eq("student_id", user.id).order("enrolled_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  return { data: (data ?? []) as Enrollment[], error };
});

export const getAnnouncements = cache(async (limit?: number) => {
  const supabase = await createClient();
  let query = supabase.from("announcements").select("id,title,content,published_at,expires_at").eq("is_published", true).lte("published_at", new Date().toISOString()).or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`).order("published_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  return { data: (data ?? []) as Announcement[], error };
});

export const getEvents = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("events").select("id,title,description,event_date,start_time,end_time,location").eq("is_published", true).order("event_date", { ascending: true });
  return { data: (data ?? []) as PortalEvent[], error };
});

export const getUpcomingEvents = cache(async (limit?: number) => {
  const supabase = await createClient();
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
  let query = supabase.from("events").select("id,title,description,event_date,start_time,end_time,location").eq("is_published", true).gte("event_date", today).order("event_date", { ascending: true });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  return { data: (data ?? []) as PortalEvent[], error };
});
