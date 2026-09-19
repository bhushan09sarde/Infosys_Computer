import Link from "next/link";
import { getEnrollments } from "@/lib/portal-data";
import { getPublishedMaterials } from "@/lib/study-materials";

export const dynamic = "force-dynamic";

export default async function StudentCoursesPage() {
  const [{ data: courses, error }, { materials }] = await Promise.all([getEnrollments(), getPublishedMaterials()]);
  return <div className="portal-list-page"><header className="portal-page-heading"><div><p className="eyebrow"><span /> Your learning</p><h1>My Courses</h1><p>Courses assigned to your student account.</p></div></header>{error ? <div className="materials-alert" role="alert"><strong>Courses are unavailable</strong><p>We could not load your assigned courses.</p></div> : courses.length ? <div className="course-card-list">{courses.map((course) => { const materialCount = materials.filter((item) => item.course.toLowerCase() === course.course_name.toLowerCase()).length; return <article key={course.id}><div><span>{course.course_category || "Course"}</span><span className={`course-status course-status-${course.status}`}>{course.status}</span></div><h2>{course.course_name}</h2><p>Course code: {course.course_code}</p><small>Enrolled {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(course.enrolled_at))} · {materialCount} published material{materialCount === 1 ? "" : "s"}</small>{materialCount > 0 && <Link href={`/student/materials`}>View course materials</Link>}</article>; })}</div> : <div className="portal-complete-empty"><strong>No courses have been assigned to your account yet.</strong><p>The institute team will assign courses after enrollment is confirmed.</p></div>}</div>;
}
