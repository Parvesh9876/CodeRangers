import { useEffect, useState } from "react";
import { ApiError, createEvent, deleteEvent, fetchEvents, updateEvent } from "../api/client";
import EventForm from "../components/EventForm";
import { useAuth } from "../context/AuthContext";
import type { EventItem, EventPayload } from "../types";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export default function DashboardPage() {
  const { user, token, isAdmin } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  const loadEvents = async () => {
    try {
      const response = await fetchEvents();
      setEvents(response);
    } catch {
      setError("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleCreate = async (payload: EventPayload) => {
    if (!token) {
      setError("Missing auth token.");
      return;
    }

    setError("");
    setSuccess("");
    setIsSubmitting(true);
    try {
      await createEvent(token, payload);
      setSuccess("Event created successfully.");
      await loadEvents();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to create event.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (payload: EventPayload) => {
    if (!token || !editingEvent) {
      return;
    }

    setError("");
    setSuccess("");
    setIsSubmitting(true);
    try {
      await updateEvent(token, editingEvent._id, payload);
      setSuccess("Event updated successfully.");
      setEditingEvent(null);
      await loadEvents();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to update event.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) {
      setError("Missing auth token.");
      return;
    }

    const confirmed = window.confirm("Delete this event permanently?");
    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");
    try {
      await deleteEvent(token, id);
      setSuccess("Event deleted successfully.");
      await loadEvents();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to delete event.");
      }
    }
  };

  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-cyan/25 bg-slate-950/65 p-6">
        <h1 className="font-display text-3xl text-cyan">Welcome, {user?.name}</h1>
        <p className="mt-3 text-slate-300">Email: {user?.email}</p>
        <p className="mt-1 text-slate-300">Role: {user?.role}</p>
      </div>

      {error ? <p className="rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-3 text-red-200">{error}</p> : null}
      {success ? <p className="rounded-xl border border-green-500/40 bg-green-950/30 px-4 py-3 text-green-200">{success}</p> : null}

      {isAdmin ? (
        <div className="space-y-4">
          {!editingEvent ? (
            <EventForm mode="create" isSubmitting={isSubmitting} onSubmit={handleCreate} />
          ) : (
            <EventForm
              mode="edit"
              initialData={editingEvent}
              isSubmitting={isSubmitting}
              onSubmit={handleUpdate}
              onCancel={() => setEditingEvent(null)}
            />
          )}
        </div>
      ) : (
        <p className="rounded-xl border border-amber/30 bg-amber-950/20 px-4 py-3 text-amber-200">
          You are a user. Admin event controls are hidden.
        </p>
      )}

      <div>
        <h2 className="font-display text-2xl text-white">All Events</h2>
        {loading ? <p className="mt-3 text-slate-300">Loading events...</p> : null}

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <article key={event._id} className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber">{formatDate(event.date)}</p>
              <h3 className="mt-2 font-display text-2xl text-cyan">{event.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-slate-300">{event.description}</p>
              <p className="mt-2 text-sm text-slate-400">{event.location}</p>
              {isAdmin ? (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setEditingEvent(event)}
                    className="rounded-lg border border-cyan/40 px-3 py-2 text-sm font-semibold text-cyan"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="rounded-lg border border-red-400/50 px-3 py-2 text-sm font-semibold text-red-200"
                  >
                    Delete
                  </button>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}