import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { MemberProfile } from "../../lib/supabase";

const BELT_COLORS: Record<string, string> = {
  white: "bg-white text-black",
  blue: "bg-blue-600 text-white",
  purple: "bg-purple-600 text-white",
  brown: "bg-amber-800 text-white",
  black: "bg-gray-900 text-white border border-gray-600",
};

export default async function MembersDashboard() {
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

  const [{ data: member }, { data: upcomingEvents }, { data: latestPosts }] = await Promise.all([
    supabase.from("members").select("*").eq("id", user.id).eq("is_tc_member", true).single(),
    supabase
      .from("tc_events")
      .select("*")
      .gte("event_date", new Date().toISOString().split("T")[0])
      .order("event_date", { ascending: true })
      .limit(3),
    supabase
      .from("tc_posts")
      .select("id, title, excerpt, published_at, is_members_only")
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .limit(3),
  ]);

  if (!member) redirect("/members/login");

  const profile = member as MemberProfile & { is_admin?: boolean; is_tc_member?: boolean };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-950 border-b border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/Team Curran C .png" alt="Team Curran" width={44} height={44} className="h-9 w-auto" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Members Portal</p>
              <p className="text-sm font-bold text-white leading-none">Team Curran</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {profile?.is_admin && (
              <Link href="/admin" className="text-xs text-gray-400 hover:text-brand transition-colors uppercase tracking-wide">
                Admin
              </Link>
            )}
            <form action="/api/auth/logout" method="POST">
              <button type="submit" className="text-xs text-gray-400 hover:text-brand transition-colors uppercase tracking-wide">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <p className="text-gray-400 text-sm uppercase tracking-widest mb-1">Welcome back</p>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black uppercase">{profile?.full_name || user.email}</h1>
            {profile?.belt && (
              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${BELT_COLORS[profile.belt]}`}>
                {profile.belt} Belt
              </span>
            )}
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Watch Library */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-brand text-xs font-bold uppercase tracking-widest">Video Library</span>
            </div>
            <h2 className="text-xl font-black uppercase mb-2">Watch Library</h2>
            <p className="text-gray-400 text-sm mb-6 flex-1">
              Access the full Team Curran technique library — hundreds of BJJ and Muay Thai videos, organized by instructor and category.
            </p>
            <a
              href="/api/bfn-sso"
              className="bg-brand hover:bg-blue-800 text-white text-sm font-black uppercase tracking-widest px-6 py-3 rounded-lg transition-colors text-center"
            >
              Open Watch Library
            </a>
          </div>

          {/* Upcoming Events */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <span className="text-brand text-xs font-bold uppercase tracking-widest">Events</span>
              <Link href="/members/events" className="text-xs text-gray-500 hover:text-brand transition-colors">
                View all →
              </Link>
            </div>
            <h2 className="text-xl font-black uppercase mb-4">Upcoming Events</h2>
            {upcomingEvents && upcomingEvents.length > 0 ? (
              <ul className="space-y-3 flex-1">
                {upcomingEvents.map((event) => (
                  <li key={event.id} className="border-l-2 border-brand pl-3">
                    <p className="text-white text-sm font-bold">{event.title}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(event.event_date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      {event.event_time && ` · ${event.event_time}`}
                    </p>
                    {event.location && <p className="text-gray-500 text-xs">{event.location}</p>}
                    {event.link_url && (
                      <a href={event.link_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-1 text-brand text-xs font-bold hover:underline">
                        {event.link_label || "Get Tickets"} →
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm flex-1">No upcoming events scheduled.</p>
            )}
            <Link
              href="/members/events"
              className="mt-4 border border-gray-700 hover:border-brand text-gray-300 hover:text-brand text-sm font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-colors text-center"
            >
              All Events
            </Link>
          </div>

          {/* Latest News */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <span className="text-brand text-xs font-bold uppercase tracking-widest">Announcements</span>
              <Link href="/members/news" className="text-xs text-gray-500 hover:text-brand transition-colors">
                View all →
              </Link>
            </div>
            <h2 className="text-xl font-black uppercase mb-4">Latest News</h2>
            {latestPosts && latestPosts.length > 0 ? (
              <ul className="space-y-3 flex-1">
                {latestPosts.map((post) => (
                  <li key={post.id}>
                    <Link href={`/members/news/${post.id}`} className="group">
                      <p className="text-white text-sm font-bold group-hover:text-brand transition-colors">{post.title}</p>
                      {post.excerpt && <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{post.excerpt}</p>}
                      <p className="text-gray-600 text-xs mt-0.5">
                        {new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        {post.is_members_only && <span className="ml-2 text-brand">Members Only</span>}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm flex-1">No posts yet.</p>
            )}
            <Link
              href="/members/news"
              className="mt-4 border border-gray-700 hover:border-brand text-gray-300 hover:text-brand text-sm font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-colors text-center"
            >
              All Posts
            </Link>
          </div>

          {/* Big Frog Nation upsell — styled to match bigfrogbjj.com */}
          <div className="rounded-2xl p-6 flex flex-col" style={{ background: '#1a3a2a', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.5)' }}>Big Frog Nation</span>
              <span className="text-xs font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-full" style={{ background: 'rgba(224,121,48,0.15)', color: '#e07930' }}>All Access</span>
            </div>
            <h2 className="text-xl font-black uppercase tracking-wide mb-3 text-white">Unlock All Access</h2>
            <ul className="space-y-2 mb-4 flex-1">
              {[
                'Expanded technique curriculum',
                'Exclusive seminars & instructor content',
                'Partner gym access nationwide',
                'BFN member events & retreats',
              ].map((b) => (
                <li key={b} className="flex gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  <svg className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#e07930' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
            <div className="space-y-2">
              <a
                href="https://bigfrogbjj.com/join"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-white text-sm font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-colors text-center"
                style={{ background: '#e07930' }}
              >
                Upgrade to All Access
              </a>
              <a
                href="https://bigfrogbjj.com/events"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-colors text-center"
                style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}
              >
                View BFN Events
              </a>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
