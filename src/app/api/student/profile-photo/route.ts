import { NextResponse } from "next/server";
import { getAuthenticatedIdentity } from "@/lib/server-auth";
import { createClient } from "@/lib/supabase/server";

const bucket = "profile-photos";
const maxBytes = 5 * 1024 * 1024;
const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const reply = (error: string, status = 400) => NextResponse.json({ error }, { status });

function hasValidSignature(bytes: Uint8Array, mime: string) {
  if (mime === "image/jpeg") return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (mime === "image/png") return bytes.length >= 8 && bytes.slice(0, 8).every((value, index) => value === [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a][index]);
  if (mime === "image/webp") return bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  return false;
}

function ownCustomPath(value: unknown, userId: string) {
  return typeof value === "string" && value.startsWith(`${userId}/`) && !value.includes("..") ? value : null;
}

export async function POST(request: Request) {
  const identity = await getAuthenticatedIdentity();
  if (identity.status !== "authenticated" || identity.role !== "student") return reply("Student access is required.", 403);

  const form = await request.formData().catch(() => null);
  const file = form?.get("photo");
  if (!(file instanceof File) || !file.size) return reply("Choose an image to upload.");
  if (!extensions[file.type]) return reply("Use a JPEG, PNG, or WebP image.");
  if (file.size > maxBytes) return reply("The profile photo must be 5 MB or smaller.");

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!hasValidSignature(bytes, file.type)) return reply("The selected file does not appear to be a valid image.");

  const supabase = await createClient();
  const { data: current, error: profileReadError } = await supabase.from("profiles").select("avatar_url").eq("id", identity.userId).maybeSingle();
  if (profileReadError || !current) return reply("Your profile could not be loaded.", 500);

  const path = `${identity.userId}/${crypto.randomUUID()}.${extensions[file.type]}`;
  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, bytes, { contentType: file.type, upsert: false });
  if (uploadError) return reply("The profile photo could not be uploaded. Confirm the private profile-photos bucket migration is applied.", 500);

  const { error: updateError } = await supabase.from("profiles").update({ avatar_url: path }).eq("id", identity.userId);
  if (updateError) {
    await supabase.storage.from(bucket).remove([path]);
    return reply("The photo uploaded, but your profile could not be updated.", 500);
  }

  const previous = ownCustomPath(current.avatar_url, identity.userId);
  if (previous && previous !== path) await supabase.storage.from(bucket).remove([previous]);
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const identity = await getAuthenticatedIdentity();
  if (identity.status !== "authenticated" || identity.role !== "student") return reply("Student access is required.", 403);
  const supabase = await createClient();
  const { data: current, error: readError } = await supabase.from("profiles").select("avatar_url").eq("id", identity.userId).maybeSingle();
  if (readError || !current) return reply("Your profile could not be loaded.", 500);
  const path = ownCustomPath(current.avatar_url, identity.userId);
  if (!path) return reply("There is no custom profile photo to remove.");
  const { error: updateError } = await supabase.from("profiles").update({ avatar_url: null }).eq("id", identity.userId);
  if (updateError) return reply("Your profile photo could not be removed.", 500);
  const { error: removeError } = await supabase.storage.from(bucket).remove([path]);
  if (removeError && process.env.NODE_ENV === "development") console.error(`[profile-photo] ${JSON.stringify({ operation: "remove-after-profile-update", code: removeError.name, message: removeError.message })}`);
  return NextResponse.json({ ok: true });
}
