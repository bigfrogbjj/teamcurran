import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

  const { data: post } = await supabase
    .from("tc_posts")
    .select("*")
    .eq("id", id)
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString())
    .single();

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link href="/members/news" className="text-gray-500 hover:text-brand text-sm transition-colors">← News</Link>

        <article className="mt-8">
          {post.is_members_only && (
            <span className="text-brand text-xs font-bold uppercase tracking-widest">Members Only</span>
          )}
          <h1 className="text-3xl font-black uppercase mt-2 mb-2">{post.title}</h1>
          <p className="text-gray-500 text-sm mb-8">
            {new Date(post.published_at).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
          {post.excerpt && (
            <p className="text-gray-300 text-lg mb-6 border-l-4 border-brand pl-4">{post.excerpt}</p>
          )}
          <div className="text-gray-200 leading-relaxed whitespace-pre-wrap">{post.body}</div>
        </article>
      </div>
    </div>
  );
}
