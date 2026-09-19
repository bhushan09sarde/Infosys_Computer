import type { Metadata } from "next";
import Link from "next/link";
import { InstituteMedia } from "@/components/institute-media";
import { directionsUrl } from "@/components/location-preview";

export const metadata: Metadata = { title: "About", description: "Learn about Infosys Computer, a computer training institute and MKCL Authorized Learning Center in Nagpur." };

const environment = [
  ["01", "Computer learning environment", "A focused setting for learning computer and digital skills."],
  ["02", "Practical lab-based learning", "Learning that places practical use and guided practice at the center."],
  ["03", "Guided training", "A supportive approach to helping learners build confidence with technology."],
  ["04", "Digital skill development", "Learning pathways spanning established computer skills and emerging technology areas."],
];

export default function AboutPage() {
  return <>
    <section className="inner-hero section"><div className="container inner-hero-grid"><div className="reveal"><p className="eyebrow eyebrow-light"><span /> Institute profile</p><h1>About<br /><em>Infosys Computer</em></h1><p>Computer education and MKCL-oriented skill learning in a practical, student-focused environment.</p></div><div className="hero-credential"><span>Learning center</span><strong>MKCL Authorized<br />Learning Center</strong><p>Infosys Computer · Nagpur</p></div></div></section>

    <section className="section about-introduction"><div className="container about-introduction-grid"><div><p className="eyebrow"><span /> Our institute</p><h2>Building confidence<br />through practical learning.</h2><p>Infosys Computer is a computer training institute in Nagpur and an MKCL Authorized Learning Center. The institute provides a setting for learners to develop practical computer knowledge, useful digital skills and greater confidence with technology.</p><p>Learning is approached with a student-focused outlook, connecting structured guidance with opportunities to understand and practise digital skills.</p><div className="intro-signals"><span>Computer education</span><span>Practical digital skills</span><span>Student-focused learning</span></div></div><InstituteMedia mode="photo" label="Institute environment" /></div></section>

    <section className="section purpose-section"><div className="container purpose-layout"><div className="purpose-heading"><p className="eyebrow"><span /> Purpose</p><h2>A clear direction for learning.</h2><p>The following statements describe the institute&apos;s learning direction in neutral terms and are not presented as official historical statements.</p></div><div className="purpose-items"><article><span>Mission</span><h3>Make computer education approachable and practical.</h3><p>To support learners as they build useful digital skills, confidence with technology and a practical foundation for career-oriented learning.</p></article><article><span>Vision</span><h3>A supportive path toward digital confidence.</h3><p>To foster a learning environment where students can engage with technology clearly, practise purposefully and continue developing relevant skills.</p></article></div></div></section>

    <section className="section environment-section"><div className="container"><div className="section-heading"><div><p className="eyebrow"><span /> Learning environment</p><h2>Designed around<br />learning by doing.</h2></div><p>A broad view of the learning experience, without making unverified claims about facilities or capacity.</p></div><div className="environment-list">{environment.map(([number, title, text]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div></section>

    <section className="section mkcl-context"><div className="container mkcl-panel"><div><p className="eyebrow eyebrow-light"><span /> MKCL context</p><h2>MKCL-oriented learning<br />at Infosys Computer.</h2><p className="mkcl-alc-code">ALC Code: 14210309</p></div><div><p>As an MKCL Authorized Learning Center, Infosys Computer presents verified learning pathways including MS-CIT, MKCL KLiC Courses and KLiC Diploma, alongside dedicated Financial Accounting / Tally learning.</p><Link className="button button-light" href="/courses">Explore Courses <span aria-hidden="true">→</span></Link></div></div></section>

    <section className="section visit-cta-section"><div className="container visit-cta"><div><p className="eyebrow"><span /> Visit the institute</p><h2>See the learning environment<br />for yourself.</h2></div><div><p>Visit Infosys Computer in Navneet Nagar, Nagpur for course-related information.</p><div className="cta-actions"><a className="button button-primary" href={directionsUrl} target="_blank" rel="noreferrer">Get Directions <span aria-hidden="true">↗</span></a><Link className="button button-secondary" href="/contact">Contact Us</Link></div></div></div></section>
  </>;
}
