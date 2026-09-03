import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function EventsPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/members/login");

  const today = new Date().toISOString().split("T")[0];

  const [{ data: upcoming }, { data: past }] = await Promise.all([
    supabase
      .from("tc_events")
      .select("*")
      .gte("event_date", today)
      .order("event_date", { ascending: true }),
    supabase
      .from("tc_events")
      .select("*")
      .lt("event_date", today)
      .order("event_date", { ascending: false })
      .limit(10),
  ]);

  function formatDate(dateStr: string) {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link href="/members" className="text-gray-500 hover:text-brand text-sm transition-colors">← Dashboard</Link>

        <p className="text-brand text-xs font-bold uppercase tracking-widest mt-8 mb-2">Team Curran</p>
        <h1 className="text-3xl font-black uppercase mb-8">Events</h1>

        {/* BFN promo */}
        <div className="bg-blue-950 border border-blue-800 rounded-xl px-5 py-4 flex items-center justify-between gap-4 mb-8">
          <p className="text-blue-200 text-sm">
            <span className="font-bold text-white">Big Frog Nation</span> hosts additional seminars, camps, and member events.
          </p>
          <a
            href="https://bigfrogbjj.com/events"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wide px-4 py-2 rounded-lg transition-colors"
          >
            BFN Events →
          </a>
        </div>

        {/* Upcoming */}
        <h2 className="text-lg font-black uppercase text-gray-300 mb-4">Upcoming</h2>
        {upcoming && upcoming.length > 0 ? (
          <div className="space-y-3 mb-10">
            {upcoming.map((event) => (
              <div key={event.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-white font-bold text-base">{event.title}</h3>
                    <p className="text-brand text-xs font-bold mt-0.5">
                      {formatDate(event.event_date)}
                      {event.event_time && ` · ${event.event_time}`}
                    </p>
                    {event.location && <p className="text-gray-400 text-xs mt-0.5">{event.location}</p>}
                    {event.description && <p className="text-gray-300 text-sm mt-2">{event.description}</p>}
                  </div>
                  <span className={`shrink-0 text-xs font-bold uppercase px-2 py-1 rounded-full tracking-wide ${event.visibility === "public" ? "bg-green-900 text-green-300" : "bg-blue-900 text-blue-300"}`}>
                    {event.visibility === "public" ? "Open" : "Members"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-10">No upcoming events scheduled.</p>
        )}

        {/* Past */}
        {past && past.length > 0 && (
          <>
            <h2 className="text-lg font-black uppercase text-gray-600 mb-4">Past Events</h2>
            <div className="space-y-2">
              {past.map((event) => (
                <div key={event.id} className="border border-gray-800 rounded-lg px-4 py-3 opacity-60">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-gray-300 text-sm font-bold">{event.title}</p>
                    <p className="text-gray-500 text-xs shrink-0">{formatDate(event.event_date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
