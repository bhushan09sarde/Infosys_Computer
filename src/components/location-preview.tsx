import Link from "next/link";

export const instituteAddress = "Infosys Computer, Navneet Nagar, Amravati Road, Defence Gate No. 2, 8th Mile, Nagpur 440023, Maharashtra, India";
export const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(instituteAddress)}`;

export function LocationPreview({ compact = false }: { compact?: boolean }) {
  return <div className={`location-preview${compact ? " location-preview-compact" : ""}`}><div className="location-visual" aria-hidden="true"><div className="map-lines" /><span className="map-pin">IC</span><small>Navneet Nagar · Nagpur</small></div><div className="location-copy"><p className="eyebrow"><span /> Find us</p><h2>Visit Infosys Computer</h2><address><strong>Infosys Computer</strong><br />Navneet Nagar<br />Amravati Road<br />Defence Gate No. 2, 8th Mile<br />Nagpur – 440023<br />Maharashtra, India</address><div className="location-actions"><a className="button button-primary" href={directionsUrl} target="_blank" rel="noreferrer">Get Directions <span aria-hidden="true">↗</span></a>{!compact && <Link className="button button-secondary" href="/contact">Contact Us</Link>}</div></div></div>;
}
