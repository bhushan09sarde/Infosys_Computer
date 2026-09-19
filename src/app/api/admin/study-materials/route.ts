import { NextResponse, type NextRequest } from "next/server";
import { MAX_MATERIAL_SIZE, MATERIAL_MIME_TYPES, STUDY_MATERIALS_BUCKET, requireAdmin } from "@/lib/study-materials";

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

function textValue(value: FormDataEntryValue | null, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return jsonError("Administrator access is required.", 403);

  const form = await request.formData();
  const file = form.get("file");
  const title = textValue(form.get("title"), 180);
  const description = textValue(form.get("description"), 2000);
  const course = textValue(form.get("course"), 120);
  const category = textValue(form.get("category"), 120);
  const isPublished = form.get("isPublished") === "on";
  if (!title || !course || !(file instanceof File) || file.size === 0) return jsonError("Title, course, and a document are required.");
  if (file.size > MAX_MATERIAL_SIZE) return jsonError("The document must be 25 MB or smaller.");

  const extension = file.name.toLowerCase().endsWith(".pdf") ? "pdf" : file.name.toLowerCase().endsWith(".docx") ? "docx" : null;
  const expectedMime = extension === "pdf" ? "application/pdf" : extension === "docx" ? DOCX_MIME : null;
  if (!expectedMime || !MATERIAL_MIME_TYPES.includes(file.type as (typeof MATERIAL_MIME_TYPES)[number]) || file.type !== expectedMime) return jsonError("Only valid PDF and DOCX documents are accepted.");

  const path = `${admin.user.id}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await admin.supabase.storage.from(STUDY_MATERIALS_BUCKET).upload(path, file, { contentType: expectedMime, upsert: false });
  if (uploadError) return jsonError("The document could not be uploaded.", 500);

  const { error: insertError } = await admin.supabase.from("study_materials").insert({
    title,
    description: description || null,
    course,
    category: category || null,
    file_name: file.name.slice(0, 255),
    file_path: path,
    file_type: expectedMime,
    file_size: file.size,
    is_published: isPublished,
    uploaded_by: admin.user.id,
  });
  if (insertError) {
    if (process.env.NODE_ENV === "development") {
      console.error("[study-materials] database insert failed", {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
      });
    }
    const { error: cleanupError } = await admin.supabase.storage.from(STUDY_MATERIALS_BUCKET).remove([path]);
    if (cleanupError && process.env.NODE_ENV === "development") {
      console.error("[study-materials] failed-upload cleanup failed", {
        message: cleanupError.message,
      });
    }
    return jsonError("The upload succeeded but its material record could not be created.", 500);
  }
  return NextResponse.json({ ok: true, message: "Study material uploaded." });
}

export async function PATCH(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return jsonError("Administrator access is required.", 403);
  const body = await request.json() as Record<string, unknown>;
  const id = typeof body.id === "string" ? body.id : "";
  const title = typeof body.title === "string" ? body.title.trim().slice(0, 180) : "";
  const course = typeof body.course === "string" ? body.course.trim().slice(0, 120) : "";
  const description = typeof body.description === "string" ? body.description.trim().slice(0, 2000) : "";
  const category = typeof body.category === "string" ? body.category.trim().slice(0, 120) : "";
  if (!id || !title || !course || typeof body.isPublished !== "boolean") return jsonError("Valid material metadata is required.");
  const { error } = await admin.supabase.from("study_materials").update({ title, course, description: description || null, category: category || null, is_published: body.isPublished }).eq("id", id);
  if (error) return jsonError("The material could not be updated.", 500);
  return NextResponse.json({ ok: true, message: "Study material updated." });
}

export async function DELETE(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return jsonError("Administrator access is required.", 403);
  const body = await request.json() as Record<string, unknown>;
  const id = typeof body.id === "string" ? body.id : "";
  if (!id) return jsonError("A material is required.");
  const { data: material } = await admin.supabase.from("study_materials").select("file_path").eq("id", id).maybeSingle();
  if (!material) return jsonError("Material not found.", 404);
  const { error: deleteError } = await admin.supabase.from("study_materials").delete().eq("id", id);
  if (deleteError) return jsonError("The material record could not be deleted.", 500);
  const { error: storageError } = await admin.supabase.storage.from(STUDY_MATERIALS_BUCKET).remove([material.file_path]);
  return NextResponse.json({ ok: true, message: storageError ? "Material deleted. Its inaccessible storage object may require manual cleanup." : "Study material and file deleted." });
}
