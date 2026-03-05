import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchEventById } from "../api/client";
import type { EventItem } from "../types";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!id) {
        setError("Event ID missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetchEventById(id);
        if (active) {
          setEvent(response);
          setError("");
        }
      } catch {
        if (active) {
          setError("Event not found or request failed.");
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
  }, [id]);

  if (loading) {
    return <p className="text-slate-300">Loading event details...</p>;
  }

  if (error || !event) {
    return (
      <div className="rounded-2xl border border-red-500/40 bg-red-950/30 p-6">
        <p className="text-red-200">{error || "Event not found"}</p>
        <Link to="/events" className="mt-4 inline-block text-cyan hover:text-amber">
          Back to events
        </Link>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-cyan/20 bg-slate-950/70">
      <div className="aspect-[16/7] bg-slate-900">
        <img src={event.image || "/logo-placeholder.svg"} alt={event.title} className="h-full w-full object-cover" />
      </div>
      <div className="p-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber">{formatDate(event.date)}</p>
        <h1 className="mt-2 font-display text-4xl text-cyan">{event.title}</h1>
        <p className="mt-4 text-lg text-slate-200">{event.description}</p>
        <p className="mt-6 text-slate-300">
          <span className="font-semibold text-white">Location:</span> {event.location}
        </p>
        <Link to="/events" className="mt-8 inline-block rounded-lg border border-cyan/30 px-4 py-2 font-semibold text-cyan transition hover:border-cyan hover:text-white">
          Back to all events
        </Link>
      </div>
    </section>
  );
}