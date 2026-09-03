import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import PostsAdmin from "./PostsAdmin";

export default async function AdminPostsPage() {
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

  const { data: posts } = await supabase
    .from("tc_posts")
    .select("id, title, excerpt, is_members_only, published_at, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-gray-500 hover:text-brand text-sm transition-colors">← Admin</Link>
            <h1 className="text-3xl font-black uppercase mt-2">Posts</h1>
          </div>
        </div>
        <PostsAdmin initialPosts={posts ?? []} />
      </div>
    </div>
  );
}
