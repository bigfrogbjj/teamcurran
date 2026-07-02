"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "../../../lib/supabase";
import { formatDuration, type LibraryVideo, type Category } from "../../../lib/vimeo";
import Image from "next/image";

type Props = { videos: LibraryVideo[] };

const TABS: { key: Category; label: string }[] = [
  { key: "fundamentals", label: "Fundamentals" },
  { key: "advanced", label: "Advanced" },
  { key: "retreats", label: "Retreats" },
  { key: "extras", label: "Extras" },
];

export default function LibraryClient({ videos }: Props) {
  const router = useRouter();
  const [memberName, setMemberName] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Category>("fundamentals");
  const [activeVideo, setActiveVideo] = useState<LibraryVideo | null>(null);
  const [openYear, setOpenYear] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createSupabaseClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) { router.push("/members"); return; }

      const res = await fetch("/api/member-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      if (!res.ok) { router.push("/members"); return; }

      const profile = await res.json();
      if (!profile.active) { router.push("/members"); return; }

      setMemberName(profile.full_name);
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  async function handleSignOut() {
    const supabase = createSupabaseClient();
    await supabase.auth.signOut();
    router.push("/members");
  }

  // --- Fundamentals: Class 1-25 sorted ---
  const fundamentals = videos
    .filter((v) => v.category === "fundamentals")
    .sort((a, b) => (a.classNumber ?? 99) - (b.classNumber ?? 99));

  // --- Advanced ---
  const advanced = videos.filter((v) => v.category === "advanced");

  // --- Retreats: grouped by year, sorted desc ---
  const retreatVideos = videos.filter((v) => v.category === "retreats");
  const retreatYears = Array.from(new Set(retreatVideos.map((v) => v.retreatYear ?? "Other"))).sort((a, b) => b.localeCompare(a));

  // --- Extras ---
  const extras = videos.filter((v) => v.category === "extras");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-white text-sm uppercase tracking-widest animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/Team Curran C .png" alt="Team Curran" width={40} height={40} className="h-10 w-auto" />
            <div>
              <p className="text-white font-black uppercase text-sm tracking-wide">Team Curran Library</p>
              <p className="text-gray-400 text-xs">Welcome, {memberName}</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="text-gray-400 hover:text-white text-xs uppercase tracking-wider transition-colors">
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto flex gap-1 mt-4">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${
                activeTab === tab.key ? "bg-brand text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* ── FUNDAMENTALS ── */}
      {activeTab === "fundamentals" && (
        <div className="w-full">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-6">{fundamentals.length} classes</p>
          </div>
          <div className="space-y-0">
            {fundamentals.map((video) => (
              <div key={video.id} className="border-b border-gray-800">
                <div className="bg-gray-900 px-6 py-3 flex items-center gap-4">
                  <span className="bg-brand text-white text-xs font-black px-3 py-1 rounded uppercase tracking-wider shrink-0">
                    Class {String(video.classNumber).padStart(2, "0")}
                  </span>
                  <h3 className="text-white font-bold text-sm">{video.title}</h3>
                  <span className="ml-auto text-gray-500 text-xs font-mono shrink-0">{formatDuration(video.duration)}</span>
                </div>
                <div
                  className="w-full bg-black"
                  style={{ aspectRatio: "16/9" }}
                  dangerouslySetInnerHTML={{ __html: video.embedHtml.replace(/width="\d+"/, 'width="100%"').replace(/height="\d+"/, 'height="100%"') }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ADVANCED ── */}
      {activeTab === "advanced" && (
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-6">{advanced.length} videos</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {advanced.map((video) => (
              <VideoCard key={video.id} video={video} onClick={() => setActiveVideo(video)} />
            ))}
          </div>
        </div>
      )}

      {/* ── RETREATS ── */}
      {activeTab === "retreats" && (
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
          {retreatYears.map((year) => {
            const yearVideos = retreatVideos.filter((v) => (v.retreatYear ?? "Other") === year);
            const isOpen = openYear === year;
            return (
              <div key={year} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenYear(isOpen ? null : year)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-brand text-white text-xs font-black px-3 py-1 rounded uppercase tracking-wider">{year}</span>
                    <span className="text-white font-black uppercase tracking-wide">{year} Retreat</span>
                    <span className="text-gray-500 text-xs">{yearVideos.length} videos</span>
                  </div>
                  <svg className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border-t border-gray-800">
                    {yearVideos.map((video) => (
                      <VideoCard key={video.id} video={video} onClick={() => setActiveVideo(video)} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── EXTRAS ── */}
      {activeTab === "extras" && (
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-6">{extras.length} videos</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {extras.map((video) => (
              <VideoCard key={video.id} video={video} onClick={() => setActiveVideo(video)} />
            ))}
          </div>
        </div>
      )}

      {/* Video modal */}
      {activeVideo && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setActiveVideo(null)}>
          <div className="bg-gray-900 rounded-2xl overflow-hidden w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="w-full" style={{ aspectRatio: "16/9" }}
              dangerouslySetInnerHTML={{ __html: activeVideo.embedHtml.replace(/width="\d+"/, 'width="100%"').replace(/height="\d+"/, 'height="100%"') }}
            />
            <div className="p-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-white font-black text-lg">{activeVideo.title}</h2>
                {activeVideo.description && <p className="text-gray-400 text-sm mt-1">{activeVideo.description}</p>}
              </div>
              <button onClick={() => setActiveVideo(null)} className="text-gray-400 hover:text-white shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function VideoCard({ video, onClick }: { video: LibraryVideo; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group bg-gray-800 border border-gray-700 hover:border-brand rounded-xl overflow-hidden text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-900/20 w-full"
    >
      <div className="aspect-video overflow-hidden relative bg-gray-900">
        {video.thumbnail ? (
          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
          <div className="bg-brand rounded-full p-3">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </div>
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded font-mono">{formatDuration(video.duration)}</span>
      </div>
      <div className="p-3">
        <h3 className="text-white font-bold text-sm leading-snug line-clamp-2">{video.title}</h3>
      </div>
    </button>
  );
}
