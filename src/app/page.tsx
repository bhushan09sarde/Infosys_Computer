import Link from "next/link";
import Image from "next/image";
import { klicCategories } from "@/data/courses";
import { heroMedia } from "@/data/hero-media";
import { InstituteMedia } from "@/components/institute-media";
import { LocationPreview } from "@/components/location-preview";

const coursePreview = [
  { name: "MS-CIT", label: "Main program", href: "/courses/ms-cit" },
  ...klicCategories.filter(({ id }) => id !== "management").map(({ id, shortLabel }) => ({ name: shortLabel, label: "KLiC category", href: `/courses#${id}` })),
];

const highlights = [
  ["MS-CIT", "Established digital learning program"],
  ["MKCL KLiC Courses", "Career-focused learning pathways"],
  ["Practical Learning", "Skills developed through practice"],
];

export default function Home() {
  return <>
    <section className="hero institute-hero">
      <div className="container institute-hero-shell reveal">
        <div className="institute-hero-stage">
          <div className="institute-hero-authorization">
            <p><span>MKCL Authorized</span><strong>Learning Center</strong></p>
            <p><span>ALC Code</span><strong>14210309</strong></p>
          </div>
          <figure className="hero-photo hero-photo-main"><Image src={heroMedia.training.src} alt={heroMedia.training.alt} fill priority sizes="(max-width: 900px) 100vw, 58vw" /></figure>
          <div className="institute-hero-panel">
            <p className="institute-kicker">Computer education · Nagpur</p>
            <h1>Infosys<br />Computer</h1>
            <p>Practical computer education and MKCL learning pathways for students building digital skills.</p>
            <div className="institute-hero-actions"><Link className="hero-action-primary" href="/courses"><span>Explore Courses</span><i aria-hidden="true">→</i></Link><Link className="hero-action-secondary" href="/contact"><span>Visit Institute</span><i aria-hidden="true">→</i></Link></div>
            <p className="location-line">Navneet Nagar, Amravati Road, Nagpur</p>
          </div>
          <figure className="hero-photo hero-photo-secondary"><Image src={heroMedia.classroom.src} alt={heroMedia.classroom.alt} fill sizes="(max-width: 600px) 100vw, 22vw" /></figure>
        </div>
        <div className="institute-hero-highlights" aria-label="Learning highlights">{highlights.map(([title,text], index) => <div key={title}><span>0{index + 1}</span><p><strong>{title}</strong><small>{text}</small></p></div>)}</div>
      </div>
    </section>

    <section className="section focus-section"><div className="container">
      <div className="section-heading"><div><p className="eyebrow"><span /> Courses at Infosys Computer</p><h2>MKCL-oriented learning,<br />organized with purpose.</h2></div><p>Explore MS-CIT, MKCL KLiC Courses, KLiC Diploma and dedicated Financial Accounting / Tally learning.</p></div>
      <div className="home-course-layout"><Link className="home-course-feature" href="/courses/ms-cit"><span>Featured main program</span><strong>MS-CIT</strong><p>Explore verified program information from an MKCL Authorized Learning Center.</p><i aria-hidden="true">View course →</i></Link><div className="home-course-list">{coursePreview.slice(1).map((item, index) => <Link href={item.href} key={item.name}><span>0{index + 2}</span><div><small>{item.label}</small><strong>{item.name}</strong></div><i aria-hidden="true">↗</i></Link>)}</div></div>
      <div className="home-program-strip"><div><span>KLiC Diploma</span><strong>360 Hours · 6 months</strong></div><div><span>Financial Accounting / Tally</span><strong>Dedicated learning area</strong></div><Link className="button button-primary" href="/courses">View All Courses <span aria-hidden="true">→</span></Link></div>
    </div></section>

    <section className="section resources-section"><div className="container resources-row"><div><p className="eyebrow"><span /> Student resources</p><h2>Learning support,<br />planned for students.</h2></div><div><p>Study Materials remains part of the website plan, with an organized space for notes, assignments and practice material as verified resources become available.</p><Link className="text-link" href="/study-materials">Explore Study Materials <span aria-hidden="true">→</span></Link></div></div></section>

    <section className="section intro-section"><div className="container intro-grid">
      <InstituteMedia mode="photo" label="Institute environment" />
      <div className="about-copy"><p className="eyebrow"><span /> About Infosys Computer</p><h2>Computer education with a practical, student-first approach.</h2><p>Infosys Computer is a computer training institute and an MKCL Authorized Learning Center in Nagpur. The website will introduce verified programs, learning resources and the institute environment with clear, useful information.</p><div className="about-points"><span>Professional learning environment</span><span>Structured digital resources</span></div><Link className="text-link" href="/about">Discover our approach <span aria-hidden="true">→</span></Link></div>
    </div></section>

    <section className="section inside-section"><div className="container"><div className="inside-heading"><div><p className="eyebrow"><span /> Inside Infosys Computer</p><h2>A closer look at the<br />institute environment.</h2></div><p>Real institute media will offer visitors a clearer view of the learning environment. The video area is ready for the verified institute tour.</p></div><InstituteMedia mode="player" label="Institute tour" /></div></section>

    <section className="section find-us-section"><div className="container"><LocationPreview /></div></section>
  </>;
}
