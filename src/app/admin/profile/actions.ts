"use server";
import { revalidatePath } from "next/cache";
import { getAdmin } from "@/lib/admin";
export type AdminProfileState={type:"idle"|"success"|"error";message:string};
export async function updateAdminProfile(_:AdminProfileState,formData:FormData):Promise<AdminProfileState>{const admin=await getAdmin();if(!admin)return{type:"error",message:"Your administrator session is no longer available."};const fullName=String(formData.get("fullName")??"").trim();const phone=String(formData.get("phone")??"").trim();if(!fullName||fullName.length>120||phone.length>30)return{type:"error",message:"Enter a valid name and mobile number."};const{error}=await admin.supabase.from("profiles").update({full_name:fullName,phone:phone||null}).eq("id",admin.user.id);if(error)return{type:"error",message:error.message};revalidatePath("/admin","layout");return{type:"success",message:"Profile updated successfully."};}
