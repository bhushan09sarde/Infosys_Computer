import type { Metadata } from "next";
import Link from "next/link";
import { CourseCategoryIcon } from "@/components/course-category-icon";
import { getCoursesByCategory, klicCategories } from "@/data/courses";

export const metadata: Metadata = {
  title: "Courses",
  description: "Explore MS-CIT, MKCL KLiC courses, KLiC Diploma and financial accounting learning at Infosys Computer.",
};

export default function CoursesPage() {
  return <>
    <section className="course-hero section"><div className="container course-hero-grid">
      <div className="reveal"><p className="eyebrow eyebrow-light"><span /> Course catalogue</p><h1>Courses at<br /><em>Infosys Computer</em></h1><p>Explore MKCL-oriented digital skill and career-focused learning programs in a clear, structured catalogue.</p></div>
      <div className="hero-credential"><span>Learning center</span><strong>MKCL Authorized<br />Learning Center</strong><p>ALC Code: 14210309</p></div>
    </div></section>

    <section className="section mscit-section"><div className="container mscit-feature">
      <div className="mscit-mark" aria-hidden="true"><span>Featured program</span><strong>MS<span>-</span>CIT</strong><i>01</i></div>
      <div className="mscit-copy"><p className="eyebrow"><span /> Main program</p><h2>MS-CIT</h2><p>MS-CIT is a main learning program offered through Infosys Computer as an MKCL Authorized Learning Center.</p><p className="detail-note">Detailed course information will be updated.</p><Link className="button button-primary" href="/courses/ms-cit">View Course <span aria-hidden="true">→</span></Link></div>
    </div></section>

    <section className="section catalogue-section" id="klic-courses"><div className="container">
      <div className="catalogue-heading"><div><p className="eyebrow"><span /> MKCL KLiC Courses</p><h2>Choose a learning category.</h2></div><p>Browse the seven course categories verified from the institute course information.</p></div>
      <nav className="category-nav" aria-label="KLiC course categories">{klicCategories.map((category) => <a href={`#${category.id}`} key={category.id}><CourseCategoryIcon category={category.id} />{category.shortLabel}</a>)}</nav>
      <div className="category-list">{klicCategories.map((category, index) => {
        const categoryCourses = getCoursesByCategory(category.id);
        return <section className="category-row" id={category.id} key={category.id}><div className="category-intro"><div className="category-identity"><span className="category-icon-wrap"><CourseCategoryIcon category={category.id} /></span><span className="category-number">0{index + 1}</span></div><h3>{category.name}</h3><p>{category.description}</p></div><div className="category-courses"><span className="course-count">{categoryCourses.length} {categoryCourses.length === 1 ? "course" : "courses"}</span><ul className="course-list">{categoryCourses.map((course) => <li key={course.id}><Link href={`/courses/${course.slug}`}><span>{course.name}</span><i aria-hidden="true">→</i></Link></li>)}</ul></div></section>;
      })}</div>
    </div></section>

    <section className="section diploma-section"><div className="container diploma-panel"><div><p className="eyebrow eyebrow-light"><span /> Structured program</p><h2>KLiC Diploma</h2><p>A verified course structure built from three KLiC courses.</p><Link className="button button-light" href="/courses/klic-diploma">View Course <span aria-hidden="true">→</span></Link></div><div className="diploma-facts"><div><strong>360</strong><span>Hours</span></div><div><strong>6</strong><span>Months</span></div><div><strong>3 × 120</strong><span>Hour KLiC courses</span></div></div></div></section>

    <section className="section tally-section"><div className="container tally-panel"><div className="tally-heading"><span className="tally-monogram" aria-hidden="true">FA</span><div><p className="eyebrow"><span /> Dedicated institute offering</p><h2>Financial Accounting<br /><em>/ Tally</em></h2><p>High-level training focused on accounting concepts and commonly used accounting tools.</p><Link className="text-link" href="/courses/financial-accounting-tally">View course overview <span aria-hidden="true">→</span></Link></div></div><div className="tally-topics"><span>Learning topics</span><ul className="topic-list"><li>Basic Accounting</li><li>Inventory</li><li>Manual Accounting</li><li>Tally / TallyPrime</li><li>GST-oriented accounting</li></ul></div></div></section>

    <section className="section course-cta"><div className="container cta-panel"><div><p className="eyebrow eyebrow-light"><span /> Course guidance</p><h2>Not sure which course<br />is right for you?</h2></div><div><p>Connect with Infosys Computer or visit the institute to discuss the available learning pathways.</p><div className="cta-actions"><Link className="button button-light" href="/contact">Contact Us <span aria-hidden="true">→</span></Link><Link className="button button-outline-light" href="/contact#visit">Visit the Institute</Link></div></div></div></section>
  </>;
}
