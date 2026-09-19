import { getEvents } from "@/lib/portal-data";

export const dynamic = "force-dynamic";

function EventCard({ event }: { event: Awaited<ReturnType<typeof getEvents>>["data"][number] }) {
  const date = new Date(`${event.event_date}T00:00:00`);
  return <article><time dateTime={event.event_date}><strong>{new Intl.DateTimeFormat("en-IN", { day: "2-digit" }).format(date)}</strong><span>{new Intl.DateTimeFormat("en-IN", { month: "short", year: "numeric" }).format(date)}</span></time><div><h2>{event.title}</h2>{event.description && <p>{event.description}</p>}<small>{event.start_time ? event.start_time.slice(0, 5) : "Time to be announced"}{event.location ? ` · ${event.location}` : ""}</small></div></article>;
}

export default async function StudentEventsPage() {
  const { data, error } = await getEvents();
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
  const upcoming = data.filter((item) => item.event_date >= today);
  const past = data.filter((item) => item.event_date < today).reverse();
  return <div className="portal-list-page"><header className="portal-page-heading"><div><p className="eyebrow"><span /> Student calendar</p><h1>Events</h1><p>Upcoming and previous institute events.</p></div></header>{error ? <div className="materials-alert" role="alert"><strong>Events are unavailable</strong><p>Please refresh or try again later.</p></div> : <><section className="event-section"><h2>Upcoming Events</h2>{upcoming.length ? <div className="event-list">{upcoming.map((event) => <EventCard event={event} key={event.id} />)}</div> : <div className="portal-complete-empty"><strong>No upcoming events.</strong><p>Future events will appear here after publication.</p></div>}</section><section className="event-section event-section-past"><h2>Past Events</h2>{past.length ? <div className="event-list">{past.map((event) => <EventCard event={event} key={event.id} />)}</div> : <div className="portal-complete-empty"><strong>No past events available.</strong></div>}</section></>}</div>;
}
