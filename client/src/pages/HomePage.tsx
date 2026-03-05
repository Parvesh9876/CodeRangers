import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchEvents } from "../api/client";
import type { EventItem } from "../types";

const features = [
  {
    title: "Role-based Authentication",
    text: "Secure JWT auth with user/admin access control."
  },
  {
    title: "Event Lifecycle Management",
    text: "Create, update, and publish events in one place."
  },
  {
    title: "Cloud Poster Hosting",
    text: "Image uploads powered by Multer + Cloudinary."
  },
  {
    title: "Type-safe Architecture",
    text: "Frontend and backend both in TypeScript."
  }
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export default function HomePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetchEvents();
        if (active) {
          setEvents(response);
        }
      } catch {
        if (active) {
          setEvents([]);
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

  const upcoming = useMemo(() => events.slice(0, 3), [events]);

  return (
    <div className="space-y-16">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="mb-3 inline-flex rounded-full border border-cyan/40 px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan">
            Be a Warrior, Not a Worrier
          </p>
          <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
            Code Rangers Club
            <span className="block text-gradient">Management System</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-300">
            Manage memberships, publish events, and run club operations from a single responsive platform.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link className="rounded-xl bg-gradient-to-r from-electric to-cyan px-6 py-3 font-bold text-slate-900 transition hover:shadow-glow" to="/events">
              Explore Events
            </Link>
            <Link className="rounded-xl border border-slate-400/30 px-6 py-3 font-semibold text-slate-100 transition hover:border-cyan/60 hover:text-cyan" to="/dashboard">
              Open Dashboard
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <img src="/logo-placeholder.svg" alt="Code Rangers emblem" className="mx-auto h-52 w-52 animate-float rounded-3xl object-cover ring-4 ring-electric/30" />
          <p className="mt-5 text-center text-sm text-slate-300">MERN + TypeScript + Tailwind + Cloudinary</p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-3xl text-white">Core Features</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-slate-700/50 bg-slate-950/50 p-6 transition hover:-translate-y-1 hover:border-cyan/50">
              <h3 className="font-display text-xl text-cyan">{feature.title}</h3>
              <p className="mt-3 text-slate-300">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl text-white">Upcoming Events</h2>
          <Link to="/events" className="text-sm font-semibold text-amber hover:text-yellow-300">
            View all
          </Link>
        </div>

        {loading ? <p className="mt-6 text-slate-300">Loading events...</p> : null}

        {!loading && upcoming.length === 0 ? (
          <p className="mt-6 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-300">No events found. Add the first event from admin dashboard.</p>
        ) : null}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {upcoming.map((event) => (
            <article key={event._id} className="rounded-2xl border border-slate-700/40 bg-slate-900/50 p-5">
              <p className="text-sm font-semibold text-amber">{formatDate(event.date)}</p>
              <h3 className="mt-2 font-display text-xl text-cyan">{event.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-slate-300">{event.description}</p>
              <p className="mt-3 text-sm text-slate-400">{event.location}</p>
              <Link to={`/events/${event._id}`} className="mt-4 inline-block text-sm font-semibold text-cyan hover:text-amber">
                View details
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}