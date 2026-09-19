type CategoryIconProps = {
  category: string;
};

const paths: Record<string, React.ReactNode> = {
  accounting: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h2m4 0h2M8 15h2m4 0h2M8 19h2m4 0h2"/></>,
  programming: <><path d="m8 9-4 3 4 3m8-6 4 3-4 3M14 5l-4 14"/></>,
  designing: <><path d="M12 3a9 9 0 1 0 0 18h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h3a6 6 0 0 0 0-12Z"/><path d="M7.5 9h.01M10 6h.01M15 6.5h.01M17 10h.01"/></>,
  "job-readiness": <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/></>,
  management: <><path d="M4 21V7l8-4 8 4v14M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M9 21v-3h6v3"/></>,
  "hardware-networking": <><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 21h8M12 16v5M7 10h.01M11 10h6"/></>,
  ir4: <><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 1v5m6-5v5M9 18v5m6-5v5M1 9h5m12 0h5M1 15h5m12 0h5M10 10h4v4h-4z"/></>,
};

export function CourseCategoryIcon({ category }: CategoryIconProps) {
  return <svg className="category-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[category]}</svg>;
}
