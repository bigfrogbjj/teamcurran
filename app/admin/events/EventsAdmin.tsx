"use client";

import { useState } from "react";
import { createSupabaseClient } from "../../../lib/supabase";

type TCEvent = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  location: string | null;
  visibility: "team_curran" | "public";
};

type EventForm = {
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  visibility: "team_curran" | "public";
};

const empty: EventForm = {
  title: "",
  description: "",
  event_date: "",
  event_time: "",
  location: "",
  visibility: "team_curran",
};

export default function EventsAdmin({ initialEvents }: { initialEvents: TCEvent[] }) {
  const [events, setEvents] = useState<TCEvent[]>(initialEvents);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<EventForm>(empty);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const supabase = createSupabaseClient();

  function startEdit(event: TCEvent) {
    setForm({
      title: event.title,
      description: event.description ?? "",
      event_date: event.event_date,
      event_time: event.event_time ?? "",
      location: event.location ?? "",
      visibility: event.visibility,
    });
    setEditing(event.id);
  }

  async function save() {
    setSaving(true);
    const payload = {
      title: form.title,
      description: form.description || null,
      event_date: form.event_date,
      event_time: form.event_time || null,
      location: form.location || null,
      visibility: form.visibility,
    };

    if (editing === "new") {
      const { data, error } = await supabase.from("tc_events").insert(payload).select().single();
      if (!error && data) setEvents([data, ...events]);
    } else {
      const { data, error } = await supabase.from("tc_events").update(payload).eq("id", editing!).select().single();
      if (!error && data) setEvents(events.map((e) => (e.id === editing ? data : e)));
    }

    setSaving(false);
    setEditing(null);
    setForm(empty);
  }

  async function deleteEvent(id: string) {
    if (!confirm("Delete this event?")) return;
    setDeleting(id);
    await supabase.from("tc_events").delete().eq("id", id);
    setEvents(events.filter((e) => e.id !== id));
    setDeleting(null);
  }

  function formatDate(d: string) {
    return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black uppercase">{editing === "new" ? "New Event" : "Edit Event"}</h2>
          <button onClick={() => { setEditing(null); setForm(empty); }} className="text-gray-500 hover:text-brand text-sm transition-colors">
            Cancel
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand"
              placeholder="Event name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Date</label>
              <input
                type="date"
                value={form.event_date}
                onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Time (optional)</label>
              <input
                value={form.event_time}
                onChange={(e) => setForm({ ...form, event_time: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand"
                placeholder="e.g. 6:00 PM"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Location (optional)</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand"
              placeholder="Address or venue name"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Description (optional)</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand resize-y"
              placeholder="Event details…"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Visibility</label>
            <div className="flex gap-4">
              {(["team_curran", "public"] as const).map((v) => (
                <label key={v} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value={v}
                    checked={form.visibility === v}
                    onChange={() => setForm({ ...form, visibility: v })}
                    className="accent-brand"
                  />
                  <span className="text-sm text-gray-300">
                    {v === "team_curran" ? "Members only" : "Public (shows on main site)"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={save}
            disabled={saving || !form.title || !form.event_date}
            className="bg-brand hover:bg-blue-800 disabled:opacity-40 text-white font-black uppercase tracking-widest px-8 py-3 rounded-lg transition-colors"
          >
            {saving ? "Saving…" : "Save Event"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => { setForm(empty); setEditing("new"); }}
          className="bg-brand hover:bg-blue-800 text-white text-sm font-black uppercase tracking-widest px-5 py-2.5 rounded-lg transition-colors"
        >
          + New Event
        </button>
      </div>

      {events.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center text-gray-500">
          No events yet. Create your first one.
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold truncate">{event.title}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-brand text-xs font-bold">{formatDate(event.event_date)}</span>
                  {event.event_time && <span className="text-gray-500 text-xs">{event.event_time}</span>}
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${event.visibility === "public" ? "bg-green-900/50 text-green-400" : "bg-blue-900/50 text-blue-300"}`}>
                    {event.visibility === "public" ? "Public" : "Members"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => startEdit(event)} className="text-gray-400 hover:text-brand text-sm transition-colors">Edit</button>
                <button
                  onClick={() => deleteEvent(event.id)}
                  disabled={deleting === event.id}
                  className="text-gray-600 hover:text-red-400 text-sm transition-colors"
                >
                  {deleting === event.id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
