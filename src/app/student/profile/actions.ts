"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProfileFormState = { type: "idle" | "success" | "error"; message: string };

export async function updateStudentProfile(_state: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const courseInterest = String(formData.get("courseInterest") ?? "").trim();
  if (fullName.length < 1 || fullName.length > 120) return { type: "error", message: "Enter a valid full name." };
  if (phone.length > 30 || courseInterest.length > 160) return { type: "error", message: "One or more fields are too long." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { type: "error", message: "Your session has expired. Please sign in again." };
  const { error } = await supabase.from("profiles").update({ full_name: fullName, phone: phone || null, course_interest: courseInterest || null }).eq("id", user.id);
  if (error) {
    if (process.env.NODE_ENV === "development") console.error("[student-profile]", { operation: "update-own-profile", code: error.code, message: error.message, authenticated: true });
    return { type: "error", message: "Your profile could not be saved. Please try again." };
  }
  revalidatePath("/student", "layout");
  return { type: "success", message: "Profile saved successfully." };
}
