import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-brand text-xs font-bold uppercase tracking-widest mb-1">Team Curran</p>
            <h1 className="text-3xl font-black uppercase">Admin</h1>
          </div>
          <Link href="/members" className="text-gray-500 hover:text-brand text-sm transition-colors">← Members Portal</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/admin/posts"
            className="bg-gray-900 border border-gray-800 hover:border-brand rounded-xl p-6 transition-colors group"
          >
            <p className="text-brand text-xs font-bold uppercase tracking-widest mb-2">Content</p>
            <h2 className="text-xl font-black uppercase group-hover:text-brand transition-colors">Posts & News</h2>
            <p className="text-gray-400 text-sm mt-2">Manage member announcements and newsletters.</p>
          </Link>

          <Link
            href="/admin/events"
            className="bg-gray-900 border border-gray-800 hover:border-brand rounded-xl p-6 transition-colors group"
          >
            <p className="text-brand text-xs font-bold uppercase tracking-widest mb-2">Schedule</p>
            <h2 className="text-xl font-black uppercase group-hover:text-brand transition-colors">Events</h2>
            <p className="text-gray-400 text-sm mt-2">Manage team events — members-only or public.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
