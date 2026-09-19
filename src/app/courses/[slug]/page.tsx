import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { courses, getCourseBySlug, klicCategories } from "@/data/courses";

export function generateStaticParams() {
  return courses.map(({ slug }) => ({ slug }));
}

type CoursePageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const course = getCourseBySlug((await params).slug);
  return course ? { title: course.name, description: course.shortDescription ?? `Verified course information for ${course.name} at Infosys Computer.` } : {};
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const course = getCourseBySlug((await params).slug);
  if (!course) notFound();
  const category = klicCategories.find((item) => item.id === course.category);

  return <section className="section detail-page"><div className="container detail-shell">
    <Link className="back-link" href="/courses">← All courses</Link>
    <div className="detail-heading"><div><p className="eyebrow"><span /> {category?.name ?? "Infosys Computer program"}</p><h1>{course.name}</h1></div><span className="detail-type">{course.programType === "klic" ? "MKCL KLiC Course" : course.programType === "mscit" ? "Main Program" : "Learning Program"}</span></div>
    {course.shortDescription && <p className="detail-summary">{course.shortDescription}</p>}
    <div className="verified-panel"><div><span>Information status</span><strong>Verified information only</strong></div>{course.duration && <div><span>Duration</span><strong>{course.duration}</strong></div>}{course.programType === "klic-diploma" && <div><span>Structure</span><strong>3 KLiC courses of 120 hours each</strong></div>}</div>
    <div className="pending-note"><span aria-hidden="true">i</span><div><h2>More details coming soon</h2><p>Detailed course information will be updated.</p></div></div>
    <div className="detail-actions"><Link className="button button-primary" href="/contact">Enquire about this course <span aria-hidden="true">→</span></Link><Link className="button button-secondary" href="/courses">Explore other courses</Link></div>
  </div></section>;
}
