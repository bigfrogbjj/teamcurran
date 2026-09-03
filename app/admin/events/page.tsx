import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import EventsAdmin from "./EventsAdmin";

export default async function AdminEventsPage() {
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

  const { data: events } = await supabase
    .from("tc_events")
    .select("*")
    .order("event_date", { ascending: false });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-gray-500 hover:text-brand text-sm transition-colors">← Admin</Link>
            <h1 className="text-3xl font-black uppercase mt-2">Events</h1>
          </div>
        </div>
        <EventsAdmin initialEvents={events ?? []} />
      </div>
    </div>
  );
}
