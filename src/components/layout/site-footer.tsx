import Link from "next/link";

export function SiteFooter() {
  return <footer className="site-footer"><div className="container footer-grid"><div><Link className="brand brand-light" href="/"><span className="brand-mark">IC</span><span><strong>Infosys Computer</strong><small>Learn • Practice • Progress</small></span></Link><p>Professional computer education in Nagpur, Maharashtra.</p></div><div><h2>Explore</h2><Link href="/about">About</Link><Link href="/courses">Courses</Link><Link href="/study-materials">Study Materials</Link></div><div><h2>Visit us</h2><address>Navneet Nagar, Amravati Road,<br />Defence Gate No. 2, 8th Mile,<br />Nagpur – 440023, Maharashtra, India.</address></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Infosys Computer.</span><span>MKCL ALC Code: 14210309</span></div></footer>;
}
