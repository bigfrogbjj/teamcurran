"use client";

import { useState } from "react";
import { createSupabaseClient } from "../../../lib/supabase";

type Post = {
  id: string;
  title: string;
  excerpt: string | null;
  is_members_only: boolean;
  published_at: string | null;
  created_at: string;
};

type PostForm = {
  title: string;
  excerpt: string;
  body: string;
  is_members_only: boolean;
  published: boolean;
};

const empty: PostForm = { title: "", excerpt: "", body: "", is_members_only: true, published: false };

export default function PostsAdmin({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [editing, setEditing] = useState<string | null>(null); // post id or "new"
  const [form, setForm] = useState<PostForm>(empty);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const supabase = createSupabaseClient();

  async function loadFull(id: string) {
    const { data } = await supabase.from("tc_posts").select("*").eq("id", id).single();
    if (!data) return;
    setForm({
      title: data.title,
      excerpt: data.excerpt ?? "",
      body: data.body,
      is_members_only: data.is_members_only,
      published: !!data.published_at,
    });
    setEditing(id);
  }

  async function save() {
    setSaving(true);
    const payload = {
      title: form.title,
      excerpt: form.excerpt || null,
      body: form.body,
      is_members_only: form.is_members_only,
      published_at: form.published ? new Date().toISOString() : null,
    };

    if (editing === "new") {
      const { data, error } = await supabase.from("tc_posts").insert(payload).select().single();
      if (!error && data) setPosts([data, ...posts]);
    } else {
      const { data, error } = await supabase.from("tc_posts").update(payload).eq("id", editing!).select("id,title,excerpt,is_members_only,published_at,created_at").single();
      if (!error && data) setPosts(posts.map((p) => (p.id === editing ? data : p)));
    }

    setSaving(false);
    setEditing(null);
    setForm(empty);
  }

  async function deletePost(id: string) {
    if (!confirm("Delete this post?")) return;
    setDeleting(id);
    await supabase.from("tc_posts").delete().eq("id", id);
    setPosts(posts.filter((p) => p.id !== id));
    setDeleting(null);
  }

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black uppercase">{editing === "new" ? "New Post" : "Edit Post"}</h2>
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
              placeholder="Post title"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Excerpt (optional)</label>
            <input
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand"
              placeholder="Short summary shown in the news list"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Body</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={12}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand resize-y"
              placeholder="Full post content…"
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_members_only}
                onChange={(e) => setForm({ ...form, is_members_only: e.target.checked })}
                className="accent-brand"
              />
              <span className="text-sm text-gray-300">Members only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="accent-brand"
              />
              <span className="text-sm text-gray-300">Published</span>
            </label>
          </div>

          <button
            onClick={save}
            disabled={saving || !form.title || !form.body}
            className="bg-brand hover:bg-blue-800 disabled:opacity-40 text-white font-black uppercase tracking-widest px-8 py-3 rounded-lg transition-colors"
          >
            {saving ? "Saving…" : "Save Post"}
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
          + New Post
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center text-gray-500">
          No posts yet. Create your first one.
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold truncate">{post.title}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className={`text-xs font-bold ${post.published_at ? "text-green-400" : "text-gray-500"}`}>
                    {post.published_at ? "Published" : "Draft"}
                  </span>
                  {post.is_members_only && <span className="text-brand text-xs font-bold">Members Only</span>}
                  {post.published_at && (
                    <span className="text-gray-600 text-xs">
                      {new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => loadFull(post.id)}
                  className="text-gray-400 hover:text-brand text-sm transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePost(post.id)}
                  disabled={deleting === post.id}
                  className="text-gray-600 hover:text-red-400 text-sm transition-colors"
                >
                  {deleting === post.id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
