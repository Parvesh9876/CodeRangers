import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchEvents } from "../api/client";
import type { EventItem } from "../types";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetchEvents();
        if (active) {
          setEvents(response);
          setError("");
        }
      } catch (err) {
        if (active) {
          setError("Failed to load events.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return events;
    }

    return events.filter((event) => {
      return (
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
      );
    });
  }, [events, search]);

  return (
    <section>
      <h1 className="font-display text-4xl text-white">Club Events</h1>
      <p className="mt-2 text-slate-300">Browse all published events from Code Rangers.</p>

      <div className="mt-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, description, or location"
          className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-400"
        />
      </div>

      {loading ? <p className="mt-6 text-slate-300">Loading events...</p> : null}
      {error ? <p className="mt-6 rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-3 text-red-200">{error}</p> : null}

      {!loading && !error && filtered.length === 0 ? (
        <p className="mt-6 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-300">No events match your search.</p>
      ) : null}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((event) => (
          <article key={event._id} className="overflow-hidden rounded-2xl border border-cyan/20 bg-slate-950/65">
            <div className="aspect-[16/10] bg-slate-900">
              <img
                src={event.image || "/logo-placeholder.svg"}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber">{formatDate(event.date)}</p>
              <h2 className="mt-2 font-display text-2xl text-cyan">{event.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm text-slate-300">{event.description}</p>
              <p className="mt-2 text-sm text-slate-400">{event.location}</p>
              <Link to={`/events/${event._id}`} className="mt-4 inline-block rounded-lg border border-cyan/30 px-3 py-2 text-sm font-semibold text-cyan transition hover:border-cyan hover:text-white">
                View Details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}