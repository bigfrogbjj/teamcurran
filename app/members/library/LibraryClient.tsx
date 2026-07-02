"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "../../../lib/supabase";
import { PROGRAMS, BELTS, formatDuration, type LibraryVideo, type Belt, type Program } from "../../../lib/vimeo";
import Image from "next/image";

type Props = {
  videos: LibraryVideo[];
  belt: Belt;
  memberName: string;
  allowedPrograms: Program[];
};

export default function LibraryClient({ videos, belt, memberName, allowedPrograms }: Props) {
  const router = useRouter();
  const [activeProgram, setActiveProgram] = useState<Program | "all">("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeVideo, setActiveVideo] = useState<LibraryVideo | null>(null);

  const beltInfo = BELTS.find((b) => b.key === belt)!;

  // Collect all unique tags from visible videos
  const allTags = Array.from(new Set(videos.flatMap((v) => v.tags))).sort();

  const filtered = videos.filter((v) => {
    if (activeProgram !== "all" && v.program !== activeProgram) return false;
    if (activeTag && !v.tags.includes(activeTag)) return false;
    if (search && !v.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  async function handleSignOut() {
    const supabase = createSupabaseClient();
    await supabase.auth.signOut();
    router.push("/members");
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Top bar */}
      <header className="bg-black border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/Team Curran C .png" alt="Team Curran" width={40} height={40} className="h-10 w-auto" />
            <div>
              <p className="text-white font-black uppercase text-sm tracking-wide">Team Curran Library</p>
              <p className="text-gray-400 text-xs">Welcome, {memberName}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded ${beltInfo.color} text-white`}>
              {beltInfo.label}
            </span>
            <button
              onClick={handleSignOut}
              className="text-gray-400 hover:text-white text-xs uppercase tracking-wider transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Program tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => { setActiveProgram("all"); setActiveTag(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${activeProgram === "all" ? "bg-brand text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
          >
            All Programs
          </button>
          {PROGRAMS.filter((p) => allowedPrograms.includes(p.key)).map((p) => (
            <button
              key={p.key}
              onClick={() => { setActiveProgram(p.key); setActiveTag(null); }}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${activeProgram === p.key ? "bg-brand text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Search + tag filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Search videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand w-full sm:max-w-xs"
          />
          <div className="flex flex-wrap gap-2">
            {allTags.slice(0, 20).map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide transition-colors ${activeTag === tag ? "bg-brand text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-6">
          {filtered.length} video{filtered.length !== 1 ? "s" : ""}
          {activeProgram !== "all" && ` · ${PROGRAMS.find((p) => p.key === activeProgram)?.label}`}
          {activeTag && ` · ${activeTag}`}
        </p>

        {/* Video grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <p className="text-lg font-bold">No videos found</p>
            <p className="text-sm mt-2">Try a different filter or search term</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((video) => {
              const prog = PROGRAMS.find((p) => p.key === video.program);
              return (
                <button
                  key={video.id}
                  onClick={() => setActiveVideo(video)}
                  className="group bg-gray-900 border border-gray-800 hover:border-brand rounded-xl overflow-hidden text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-900/20"
                >
                  <div className="aspect-video overflow-hidden relative bg-gray-800">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    )}
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <div className="bg-brand rounded-full p-3">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    {/* Duration */}
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded font-mono">
                      {formatDuration(video.duration)}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded text-white ${prog?.color ?? "bg-gray-600"}`}>
                        {prog?.label}
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-sm leading-snug line-clamp-2">{video.title}</h3>
                    {video.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {video.tags.slice(0, 3).map((t) => (
                          <span key={t} className="text-gray-500 text-xs">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Video modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="bg-gray-900 rounded-2xl overflow-hidden w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="aspect-video w-full"
              dangerouslySetInnerHTML={{ __html: activeVideo.embedHtml }}
            />
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-white font-black text-xl mb-1">{activeVideo.title}</h2>
                  {activeVideo.description && (
                    <p className="text-gray-400 text-sm leading-relaxed">{activeVideo.description}</p>
                  )}
                  {activeVideo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {activeVideo.tags.map((t) => (
                        <span key={t} className="text-xs text-gray-300 bg-gray-800 px-2.5 py-1 rounded uppercase tracking-wide">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="text-gray-400 hover:text-white transition-colors shrink-0"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
