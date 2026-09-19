import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { StudyMaterial } from "@/lib/study-materials-shared";
export type { StudyMaterial } from "@/lib/study-materials-shared";

export const STUDY_MATERIALS_BUCKET = "study-materials";
export const MAX_MATERIAL_SIZE = 25 * 1024 * 1024;
export const MATERIAL_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

const MATERIAL_COLUMNS = "id,title,description,course,category,file_name,file_path,file_type,file_size,is_published,created_at,updated_at,uploaded_by";

export async function getPublishedMaterials(limit?: number) {
  const supabase = await createClient();
  let query = supabase
    .from("study_materials")
    .select(MATERIAL_COLUMNS)
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  return { materials: (data ?? []) as StudyMaterial[], error };
}

export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  return profile?.role === "admin" ? { supabase, user } : null;
}
