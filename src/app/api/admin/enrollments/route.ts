import { NextResponse } from "next/server";
import { courses } from "@/data/courses";
import { getAdmin } from "@/lib/admin";

const statuses=["active","completed","paused","cancelled"] as const;
const bad=(message:string,status=400)=>NextResponse.json({error:message},{status});

export async function POST(request:Request){
  const admin=await getAdmin(); if(!admin)return bad("Administrator access is required.",403);
  const body=await request.json().catch(()=>null) as {studentId?:string;courseId?:string;status?:string}|null;
  const course=courses.find(item=>item.id===body?.courseId); const status=statuses.find(item=>item===body?.status)??"active";
  if(!body?.studentId||!course)return bad("Select a student and a valid course.");
  const {data:student,error:studentError}=await admin.supabase.from("profiles").select("id").eq("id",body.studentId).eq("role","student").maybeSingle();
  if(studentError)return bad("The selected student could not be verified.",500);
  if(!student)return bad("Select a valid student profile.");
  const {error}=await admin.supabase.from("student_enrollments").insert({student_id:body.studentId,course_code:course.id,course_name:course.name,course_category:course.category,status});
  if(error)return bad(error.code==="23505"?"This student is already registered for this course.":error.message,error.code==="23505"?409:500);
  return NextResponse.json({ok:true});
}

export async function PATCH(request:Request){
  const admin=await getAdmin(); if(!admin)return bad("Administrator access is required.",403);
  const body=await request.json().catch(()=>null) as {id?:string;status?:string}|null; const status=statuses.find(item=>item===body?.status);
  if(!body?.id||!status)return bad("A valid assignment and status are required.");
  const {error}=await admin.supabase.from("student_enrollments").update({status}).eq("id",body.id); if(error)return bad(error.message,500);
  return NextResponse.json({ok:true});
}

export async function DELETE(request:Request){
  const admin=await getAdmin(); if(!admin)return bad("Administrator access is required.",403);
  const id=new URL(request.url).searchParams.get("id"); if(!id)return bad("Assignment id is required.");
  const {error}=await admin.supabase.from("student_enrollments").delete().eq("id",id); if(error)return bad(error.message,500);
  return NextResponse.json({ok:true});
}
