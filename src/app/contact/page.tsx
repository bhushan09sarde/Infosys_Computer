import type { Metadata } from "next";
import { EnquiryForm } from "@/components/enquiry-form";
import { LocationPreview, directionsUrl } from "@/components/location-preview";
import { courses, klicCategories } from "@/data/courses";

export const metadata: Metadata = { title: "Contact", description: "Contact or visit Infosys Computer in Navneet Nagar, Nagpur for course-related information." };

const courseOptions = [
  ...courses.filter((course) => course.programType !== "klic").map((course) => ({ value: course.slug, label: course.name })),
  ...klicCategories.map((category) => ({ value: `klic-${category.id}`, label: `KLiC — ${category.name}` })),
];

export default function ContactPage() {
  return <>
    <section className="inner-hero contact-hero section"><div className="container inner-hero-grid"><div className="reveal"><p className="eyebrow eyebrow-light"><span /> Visit or enquire</p><h1>Contact<br /><em>Infosys Computer</em></h1><p>Contact or visit the institute for course-related information and guidance on available learning pathways.</p></div><div className="hero-credential"><span>Location</span><strong>Navneet Nagar<br />Nagpur</strong><p>Maharashtra, India</p></div></div></section>

    <section className="section contact-overview"><div className="container contact-overview-grid"><div><p className="eyebrow"><span /> Contact information</p><h2>Connect with the institute.</h2><address><strong>Infosys Computer</strong><br />Navneet Nagar<br />Amravati Road<br />Defence Gate No. 2<br />8th Mile<br />Nagpur – 440023<br />Maharashtra, India</address><a className="button button-primary" href={directionsUrl} target="_blank" rel="noreferrer">Get Directions <span aria-hidden="true">↗</span></a></div><div className="contact-placeholders"><div><span>Phone</span><strong>Phone number will be updated.</strong></div><div><span>Email</span><strong>Email address will be updated.</strong></div><div><span>Institute timings</span><strong>Institute timings will be updated.</strong></div></div></div></section>

    <section className="section location-section" id="visit"><div className="container"><LocationPreview compact /></div></section>

    <section className="section enquiry-section"><div className="container enquiry-layout"><div className="enquiry-heading"><p className="eyebrow"><span /> Course enquiry</p><h2>Tell us what you would<br />like to learn.</h2><p>This form is prepared for a future enquiry system. It does not currently store or send information.</p></div><EnquiryForm courseOptions={courseOptions} /></div></section>

    <section className="section visitor-note-section"><div className="container visitor-note"><span aria-hidden="true">IC</span><div><h2>Students and parents are welcome to visit.</h2><p>Visit the institute for course enquiries and information about available learning pathways. Institute timings will be updated.</p></div></div></section>
  </>;
}
