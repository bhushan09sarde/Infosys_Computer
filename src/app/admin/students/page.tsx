import { StudentsBrowser, type AdminStudent } from "@/components/admin/students-browser";
import { getAdmin } from "@/lib/admin";
import { courses } from "@/data/courses";

export const dynamic="force-dynamic";

export default async function AdminStudentsPage(){
  const admin=await getAdmin(); if(!admin)return null;
  const [{data:profiles,error},{data:enrollments}]=await Promise.all([admin.supabase.from("profiles").select("id,full_name,email,phone,created_at").eq("role","student").order("created_at",{ascending:false}),admin.supabase.from("student_enrollments").select("student_id")]);
  const counts=new Map<string,number>(); for(const row of enrollments??[]) counts.set(row.student_id,(counts.get(row.student_id)??0)+1);
  const students=(profiles??[]).map(row=>({...row,enrollment_count:counts.get(row.id)??0})) as AdminStudent[];
  return <div><header className="admin-page-heading"><div><p className="eyebrow"><span/> Student records</p><h1>Students</h1><p>Search authenticated student profiles, review assignments, and register students in verified courses.</p></div></header>{error?<div className="admin-notice admin-notice-error" role="alert">Students could not be loaded: {error.message}</div>:<StudentsBrowser students={students} courses={courses.map(({id,name})=>({id,name}))}/>}</div>;
}
