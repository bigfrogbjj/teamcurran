"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "../../../lib/supabase";
import { formatDuration, type LibraryVideo, type Category, type VimeoShowcase } from "../../../lib/vimeo";
import Image from "next/image";

type Props = { videos: LibraryVideo[]; showcases: VimeoShowcase[] };

const TABS: { key: Category | "showcases"; label: string }[] = [
  { key: "fundamentals", label: "Fundamentals" },
  { key: "white-to-blue", label: "White → Blue" },
  { key: "blue-to-purple", label: "Blue → Purple" },
  { key: "advanced", label: "Advanced" },
  { key: "striking", label: "Striking Basics" },
  { key: "retreats", label: "Retreats" },
  { key: "extras", label: "Extras" },
  { key: "showcases", label: "Showcases" },
];

function formatDateLabel(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function LibraryClient({ videos, showcases }: Props) {
  const router = useRouter();
  const [memberName, setMemberName] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Category | "showcases">("fundamentals");
  const [activeShowcase, setActiveShowcase] = useState<VimeoShowcase | null>(null);
  const [activeVideo, setActiveVideo] = useState<LibraryVideo | null>(null);
  const [openYear, setOpenYear] = useState<string | null>(null);
  const [openDate, setOpenDate] = useState<string | null>(null);

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

  const fundamentals = (() => {
    const seen = new Set<number>();
    return videos
      .filter((v) => v.category === "fundamentals")
      .sort((a, b) => (a.classNumber ?? 99) - (b.classNumber ?? 99))
      .filter((v) => {
        if (v.classNumber === undefined || seen.has(v.classNumber)) return false;
        seen.add(v.classNumber);
        return true;
      });
  })();
  const whiteToBlue = videos.filter((v) => v.category === "white-to-blue");
  const blueToPurple = videos.filter((v) => v.category === "blue-to-purple");
  const advanced = videos.filter((v) => v.category === "advanced");
  const striking = videos.filter((v) => v.category === "striking");

  const retreatVideos = videos.filter((v) => v.category === "retreats");
  const retreatYears = Array.from(new Set(retreatVideos.map((v) => v.retreatYear ?? "Other"))).sort((a, b) => b.localeCompare(a));

  const extrasVideos = videos.filter((v) => v.category === "extras");
  const datedExtras = extrasVideos.filter((v) => v.extrasDate);
  const undatedExtras = extrasVideos.filter((v) => !v.extrasDate);
  const extrasDates = Array.from(new Set(datedExtras.map((v) => v.extrasDate!))).sort((a, b) => b.localeCompare(a));

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
        <div className="max-w-7xl mx-auto flex flex-wrap gap-1 mt-4">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${
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
        <div className="max-w-4xl mx-auto px-6 py-10">
          {/* Jeff bio header */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-10">
            <div className="flex flex-col sm:flex-row gap-0">
              <div className="sm:w-48 shrink-0">
                <img src="/DM1A9471-3.jpg" alt="Jeff Curran" className="w-full h-full object-cover object-top" style={{ maxHeight: "280px" }} />
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-center">
                <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-2">Fundamentals Curriculum</p>
                <h2 className="text-white font-black text-xl sm:text-2xl uppercase mb-3">
                  Created by Jeff "Big Frog" Curran
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  This 25-class fundamental curriculum was developed by 5th Degree Pedro Sauer Black Belt Professor Jeff "Big Frog" Curran.
                </p>
                <div className="bg-blue-900/30 border border-blue-800 rounded-lg px-4 py-3">
                  <p className="text-blue-300 text-sm font-semibold">
                    📋 All eligible white belt students will be tested on the curriculum below to receive their blue belt.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick jump menu */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Jump to Class</p>
            <div className="flex flex-wrap gap-2">
              {fundamentals.map((video) => (
                <a
                  key={video.id}
                  href={`#class-${video.classNumber}`}
                  className="bg-gray-800 hover:bg-brand text-gray-300 hover:text-white text-xs font-black px-3 py-1.5 rounded uppercase tracking-wider transition-colors"
                >
                  {String(video.classNumber).padStart(2, "0")}
                </a>
              ))}
            </div>
          </div>

          {/* Stacked videos */}
          <div className="space-y-6">
            {fundamentals.map((video) => (
              <div key={video.id} id={`class-${video.classNumber}`} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden scroll-mt-32">
                <div className="px-5 py-3 flex items-center gap-3 border-b border-gray-800">
                  <span className="bg-brand text-white text-xs font-black px-3 py-1 rounded uppercase tracking-wider shrink-0">
                    Class {String(video.classNumber).padStart(2, "0")}
                  </span>
                  <h3 className="text-white font-bold text-sm">{video.title}</h3>
                  <span className="ml-auto text-gray-500 text-xs font-mono shrink-0">{formatDuration(video.duration)}</span>
                </div>
                <div className="w-full bg-black" style={{ aspectRatio: "16/9" }}
                  dangerouslySetInnerHTML={{ __html: video.embedHtml.replace(/width="\d+"/, 'width="100%"').replace(/height="\d+"/, 'height="100%"') }}
                />
                {video.description && (
                  <div className="px-5 py-4 border-t border-gray-800">
                    <p className="text-gray-400 text-sm leading-relaxed">{video.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── WHITE TO BLUE ── */}
      {activeTab === "white-to-blue" && (
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-10">
            <div className="flex flex-col sm:flex-row gap-0">
              <div className="sm:w-48 shrink-0">
                <img src="/DM1A9471-3.jpg" alt="Jeff Curran" className="w-full h-full object-cover object-top" style={{ maxHeight: "280px" }} />
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-center">
                <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-2">Belt Promotion</p>
                <h2 className="text-white font-black text-xl sm:text-2xl uppercase mb-3">White Belt → Blue Belt</h2>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  This video outlines the full test material required for white belt students to earn their blue belt under Professor Jeff Curran and the Pedro Sauer Association.
                </p>
                <div className="bg-blue-900/30 border border-blue-800 rounded-lg px-4 py-3">
                  <p className="text-blue-300 text-sm font-semibold">
                    📋 Mastery of Classes 1–25 in the Fundamentals curriculum is required before testing.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {whiteToBlue.map((video) => (
              <div key={video.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-800">
                  <h3 className="text-white font-bold text-sm">{video.title}</h3>
                </div>
                <div className="w-full bg-black" style={{ aspectRatio: "16/9" }}
                  dangerouslySetInnerHTML={{ __html: video.embedHtml.replace(/width="\d+"/, 'width="100%"').replace(/height="\d+"/, 'height="100%"') }}
                />
                {video.description && (
                  <div className="px-5 py-4 border-t border-gray-800">
                    <p className="text-gray-400 text-sm leading-relaxed">{video.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── BLUE TO PURPLE ── */}
      {activeTab === "blue-to-purple" && (
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-10">
            <div className="flex flex-col sm:flex-row gap-0">
              <div className="sm:w-48 shrink-0">
                <img src="/DM1A9471-3.jpg" alt="Jeff Curran" className="w-full h-full object-cover object-top" style={{ maxHeight: "280px" }} />
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-center">
                <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-2">Belt Promotion</p>
                <h2 className="text-white font-black text-xl sm:text-2xl uppercase mb-3">Blue Belt → Purple Belt</h2>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  This video outlines the full test material required for blue belt students to earn their purple belt under Professor Jeff Curran and the Pedro Sauer Association.
                </p>
                <div className="bg-purple-900/30 border border-purple-800 rounded-lg px-4 py-3">
                  <p className="text-purple-300 text-sm font-semibold">
                    📋 Consistent mat time, technical proficiency, and instructor approval are required before testing.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {blueToPurple.map((video) => (
              <div key={video.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-800">
                  <h3 className="text-white font-bold text-sm">{video.title}</h3>
                </div>
                <div className="w-full bg-black" style={{ aspectRatio: "16/9" }}
                  dangerouslySetInnerHTML={{ __html: video.embedHtml.replace(/width="\d+"/, 'width="100%"').replace(/height="\d+"/, 'height="100%"') }}
                />
                {video.description && (
                  <div className="px-5 py-4 border-t border-gray-800">
                    <p className="text-gray-400 text-sm leading-relaxed">{video.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ADVANCED ── */}
      {activeTab === "advanced" && (
        <div className="max-w-4xl mx-auto px-6 py-10">
          {/* Dropdown jump menu */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Jump to Video</p>
            <select
              onChange={(e) => {
                const el = document.getElementById(e.target.value);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                e.target.value = "";
              }}
              defaultValue=""
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-brand cursor-pointer"
            >
              <option value="" disabled>Select a video...</option>
              {advanced.map((video) => (
                <option key={video.id} value={`advanced-${video.id}`}>{video.title}</option>
              ))}
            </select>
          </div>

          <p className="text-gray-500 text-xs uppercase tracking-widest mb-6">{advanced.length} videos</p>
          <div className="space-y-6">
            {advanced.map((video) => (
              <div key={video.id} id={`advanced-${video.id}`} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden scroll-mt-32">
                <div className="px-5 py-3 border-b border-gray-800">
                  <h3 className="text-white font-bold text-sm">{video.title}</h3>
                  <span className="text-gray-500 text-xs font-mono">{formatDuration(video.duration)}</span>
                </div>
                <div className="w-full bg-black" style={{ aspectRatio: "16/9" }}
                  dangerouslySetInnerHTML={{ __html: video.embedHtml.replace(/width="\d+"/, 'width="100%"').replace(/height="\d+"/, 'height="100%"') }}
                />
                {video.description && (
                  <div className="px-5 py-4 border-t border-gray-800">
                    <p className="text-gray-400 text-sm leading-relaxed">{video.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── STRIKING BASICS ── */}
      {activeTab === "striking" && (
        <div className="max-w-4xl mx-auto px-6 py-10">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-6">{striking.length} videos</p>
          <div className="space-y-6">
            {striking.map((video) => (
              <div key={video.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-800">
                  <h3 className="text-white font-bold text-sm">{video.title}</h3>
                  <span className="text-gray-500 text-xs font-mono">{formatDuration(video.duration)}</span>
                </div>
                <div className="w-full bg-black" style={{ aspectRatio: "16/9" }}
                  dangerouslySetInnerHTML={{ __html: video.embedHtml.replace(/width="\d+"/, 'width="100%"').replace(/height="\d+"/, 'height="100%"') }}
                />
                {video.description && (
                  <div className="px-5 py-4 border-t border-gray-800">
                    <p className="text-gray-400 text-sm leading-relaxed">{video.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── RETREATS ── */}
      {activeTab === "retreats" && (
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-4">
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
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-4">
          {/* Date-grouped extras */}
          {extrasDates.map((date) => {
            const dateVideos = datedExtras.filter((v) => v.extrasDate === date);
            const isOpen = openDate === date;
            return (
              <div key={date} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenDate(isOpen ? null : date)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-white font-black">{formatDateLabel(date)}</span>
                    <span className="text-gray-500 text-xs">{dateVideos.length} part{dateVideos.length !== 1 ? "s" : ""}</span>
                  </div>
                  <svg className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border-t border-gray-800">
                    {dateVideos.sort((a, b) => a.title.localeCompare(b.title)).map((video) => (
                      <VideoCard key={video.id} video={video} onClick={() => setActiveVideo(video)} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Undated extras */}
          {undatedExtras.length > 0 && (
            <div className="mt-8">
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">Other Videos</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {undatedExtras.map((video) => (
                  <VideoCard key={video.id} video={video} onClick={() => setActiveVideo(video)} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── SHOWCASES ── */}
      {activeTab === "showcases" && (
        <div className="max-w-4xl mx-auto px-6 py-10">
          {activeShowcase ? (
            <>
              <button onClick={() => setActiveShowcase(null)} className="flex items-center gap-2 text-brand text-sm font-bold uppercase tracking-wider mb-6 hover:underline">
                ← Back to Showcases
              </button>
              <h2 className="text-white font-black text-2xl uppercase mb-2">{activeShowcase.name}</h2>
              {activeShowcase.description && <p className="text-gray-400 text-sm mb-8">{activeShowcase.description}</p>}
              <div className="space-y-6">
                {activeShowcase.videos.map((video) => (
                  <div key={video.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
                      <h3 className="text-white font-bold text-sm">{video.title}</h3>
                      <span className="text-gray-500 text-xs font-mono shrink-0 ml-3">{formatDuration(video.duration)}</span>
                    </div>
                    <div className="w-full bg-black" style={{ aspectRatio: "16/9" }}
                      dangerouslySetInnerHTML={{ __html: video.embedHtml.replace(/width="\d+"/, 'width="100%"').replace(/height="\d+"/, 'height="100%"') }}
                    />
                    {video.description && (
                      <div className="px-5 py-4 border-t border-gray-800">
                        <p className="text-gray-400 text-sm leading-relaxed">{video.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-6">{showcases.length} showcases</p>
              <div className="grid sm:grid-cols-2 gap-5">
                {showcases.map((showcase) => (
                  <button
                    key={showcase.id}
                    onClick={() => setActiveShowcase(showcase)}
                    className="group bg-gray-900 border border-gray-800 hover:border-brand rounded-xl overflow-hidden text-left transition-all duration-200 hover:-translate-y-0.5"
                  >
                    {showcase.thumbnail && (
                      <div className="aspect-video overflow-hidden">
                        <img src={showcase.thumbnail} alt={showcase.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="text-white font-black text-base uppercase mb-1">{showcase.name}</h3>
                      {showcase.description && <p className="text-gray-400 text-sm line-clamp-2 mb-2">{showcase.description}</p>}
                      <p className="text-brand text-xs font-bold uppercase tracking-wider">{showcase.videoCount} videos →</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
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
              <h2 className="text-white font-black text-lg">{activeVideo.title}</h2>
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
