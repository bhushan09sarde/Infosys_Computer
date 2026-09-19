import { getAnnouncements } from "@/lib/portal-data";

export const dynamic = "force-dynamic";

export default async function StudentAnnouncementsPage() {
  const { data, error } = await getAnnouncements();
  return <div className="portal-list-page"><header className="portal-page-heading"><div><p className="eyebrow"><span /> Institute updates</p><h1>Announcements</h1><p>Current notices published for students.</p></div></header>{error ? <div className="materials-alert" role="alert"><strong>Announcements are unavailable</strong><p>Please refresh or try again later.</p></div> : data.length ? <div className="announcement-list">{data.map((item) => <article key={item.id}><div><span>Published</span><time dateTime={item.published_at}>{new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(item.published_at))}</time></div><h2>{item.title}</h2><p>{item.content}</p>{item.expires_at && <small>Available until {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(item.expires_at))}</small>}</article>)}</div> : <div className="portal-complete-empty"><strong>No announcements available right now.</strong><p>New institute notices will appear here when published.</p></div>}</div>;
}
