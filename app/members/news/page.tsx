import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function NewsPage() {
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

  const { data: posts } = await supabase
    .from("tc_posts")
    .select("id, title, excerpt, published_at, is_members_only")
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/members" className="text-gray-500 hover:text-brand text-sm transition-colors">← Dashboard</Link>
        </div>

        <p className="text-brand text-xs font-bold uppercase tracking-widest mb-2">Announcements</p>
        <h1 className="text-3xl font-black uppercase mb-8">News & Updates</h1>

        {posts && posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/members/news/${post.id}`}
                className="block bg-gray-900 border border-gray-800 hover:border-brand rounded-xl p-5 transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-white font-bold group-hover:text-brand transition-colors mb-1 truncate">{post.title}</h2>
                    {post.excerpt && <p className="text-gray-400 text-sm line-clamp-2">{post.excerpt}</p>}
                  </div>
                  {post.is_members_only && (
                    <span className="text-brand text-xs font-bold uppercase tracking-wide shrink-0 mt-0.5">Members</span>
                  )}
                </div>
                <p className="text-gray-600 text-xs mt-3">
                  {new Date(post.published_at).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center">
            <p className="text-gray-500">No posts yet. Check back soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
