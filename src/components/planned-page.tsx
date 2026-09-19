import Link from "next/link";

export function PlannedPage({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <section className="section planned-page"><div className="container planned-shell"><p className="eyebrow"><span /> {eyebrow}</p><h1>{title}</h1><p>{description}</p><div className="planned-note"><span aria-hidden="true">i</span><div><strong>This area is planned for a future phase.</strong><p>No live functionality or information has been added yet.</p></div></div><div className="detail-actions"><Link className="button button-primary" href="/">Return Home</Link><Link className="button button-secondary" href="/contact">Contact the Institute</Link></div></div></section>;
}
