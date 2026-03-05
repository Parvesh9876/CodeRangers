import { type FormEvent, useState } from "react";
import type { EventItem, EventPayload } from "../types";

interface EventFormProps {
  mode: "create" | "edit";
  initialData?: EventItem;
  isSubmitting: boolean;
  onSubmit: (payload: EventPayload) => Promise<void>;
  onCancel?: () => void;
}

export default function EventForm({ mode, initialData, isSubmitting, onSubmit, onCancel }: EventFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [date, setDate] = useState(initialData?.date ? initialData.date.slice(0, 10) : "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [image, setImage] = useState<File | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit({ title, description, date, location, image });

    if (mode === "create") {
      setTitle("");
      setDescription("");
      setDate("");
      setLocation("");
      setImage(null);
      const input = document.getElementById("event-image") as HTMLInputElement | null;
      if (input) {
        input.value = "";
      }
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-cyan/20 bg-slate-950/60 p-5">
      <h3 className="font-display text-xl text-cyan">{mode === "create" ? "Create Event" : "Edit Event"}</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-slate-200">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-600 bg-slate-900/70 px-3 py-2"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-slate-200">Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-600 bg-slate-900/70 px-3 py-2"
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm text-slate-200">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full rounded-lg border border-slate-600 bg-slate-900/70 px-3 py-2"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-slate-200">Location</span>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-600 bg-slate-900/70 px-3 py-2"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-slate-200">Image</span>
          <input
            id="event-image"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full rounded-lg border border-slate-600 bg-slate-900/70 px-3 py-2 file:mr-3 file:rounded-md file:border-0 file:bg-electric/20 file:px-3 file:py-1 file:text-cyan"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-gradient-to-r from-electric to-cyan px-5 py-2 font-bold text-slate-900 disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : mode === "create" ? "Create" : "Update"}
        </button>

        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-500 px-5 py-2 font-semibold text-slate-200"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
