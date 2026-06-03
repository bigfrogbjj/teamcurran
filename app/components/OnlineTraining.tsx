const platforms = [
  {
    name: "iPhone",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
  },
  {
    name: "Android",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.523 15.341a.75.75 0 01-.75.75H7.228a.75.75 0 01-.75-.75V9.818c0-.415.336-.75.75-.75h9.545c.414 0 .75.335.75.75v5.523zM7.977 6.977l-1.227-2.126a.25.25 0 01.091-.341.25.25 0 01.341.091l1.245 2.157a7.515 7.515 0 013.573-.876 7.515 7.515 0 013.574.876l1.244-2.157a.25.25 0 01.341-.091.25.25 0 01.091.341L15.024 6.977A7.478 7.478 0 0119 13H5a7.478 7.478 0 012.977-6.023zM10 11a1 1 0 110-2 1 1 0 010 2zm4 0a1 1 0 110-2 1 1 0 010 2z" />
      </svg>
    ),
  },
  {
    name: "Apple TV",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
    label: "Apple TV",
  },
  {
    name: "Roku",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21 6H3a1 1 0 00-1 1v10a1 1 0 001 1h18a1 1 0 001-1V7a1 1 0 00-1-1zm-1 10H4V8h16v8z" />
      </svg>
    ),
  },
  {
    name: "Fire TV",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13.5 2c0 0-7.5 4-7.5 10 0 3.31 2.69 6 6 6s6-2.69 6-6c0-2.5-1.5-4.5-1.5-4.5S15 9 12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3c0-.83-.34-1.58-.88-2.12" />
      </svg>
    ),
  },
];

const features = [
  { title: "Technique Library", desc: "Hundreds of instructional videos organized by position, submission, and level." },
  { title: "Professor Jeff's Curriculum", desc: "Direct access to the same system taught on the mats — structured for all belts." },
  { title: "Train Anywhere", desc: "Stream on your phone, tablet, smart TV, or any device. No mat required." },
  { title: "New Content Weekly", desc: "Fresh technique breakdowns and rounds added every week by Team Curran instructors." },
];

export default function OnlineTraining() {
  return (
    <section id="online" className="bg-black py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <p className="text-red-500 text-xs font-bold tracking-[0.3em] uppercase mb-4">
              Team Curran Online
            </p>
            <h2 className="text-4xl sm:text-6xl font-black text-white uppercase leading-none mb-6">
              Train With Us<br />
              <span className="text-red-600">Anywhere.</span><br />
              Anytime.
            </h2>
            <div className="w-16 h-1 bg-red-600 mb-8" />
            <p className="text-gray-300 text-lg leading-relaxed mb-10">
              Stream our ever-expanding library of techniques, instructionals, and live class recordings.
              Get the same curriculum taught by Professor Jeff Curran — directly to your screen.
            </p>

            {/* Feature list */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {features.map((f) => (
                <div key={f.title} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-white font-bold text-sm">{f.title}</p>
                    <p className="text-gray-400 text-xs leading-relaxed mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Platform icons */}
            <div className="mb-8">
              <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-4">Available On</p>
              <div className="flex flex-wrap gap-3">
                {platforms.map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center gap-2 bg-gray-900 border border-gray-700 text-gray-300 px-3 py-2 rounded text-xs font-semibold"
                  >
                    {p.icon}
                    {p.name}
                  </div>
                ))}
              </div>
            </div>

            <a
              href="#contact"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest px-8 py-4 rounded text-sm transition-colors shadow-lg shadow-red-900/40"
            >
              Get Access — Team Curran Online
            </a>
          </div>

          {/* Right: Phone mockup */}
          <div className="relative flex justify-center">
            {/* Glow */}
            <div className="absolute inset-0 bg-red-600/10 rounded-full blur-3xl scale-75" />

            {/* Phone frame */}
            <div className="relative w-64 sm:w-72">
              <div className="bg-gray-900 rounded-[2.5rem] border-4 border-gray-700 shadow-2xl overflow-hidden">
                {/* Notch */}
                <div className="bg-black h-8 flex items-center justify-center">
                  <div className="w-20 h-4 bg-gray-900 rounded-full" />
                </div>

                {/* Screen content */}
                <div className="bg-gray-950 px-3 pb-6 space-y-2.5">
                  {/* App header */}
                  <div className="bg-black px-3 py-3 flex items-center justify-between">
                    <span className="text-white font-black text-xs tracking-widest uppercase">Team<span className="text-red-600">Curran</span></span>
                    <span className="text-gray-500 text-xs">Online</span>
                  </div>

                  {/* Video cards */}
                  {[
                    { title: "Guard Passing", sub: "Fundamentals · 12 videos", color: "from-red-900 to-red-950" },
                    { title: "Back Takes", sub: "Mixed Level · 18 videos", color: "from-gray-800 to-gray-900" },
                    { title: "Leg Locks", sub: "Advanced · 24 videos", color: "from-blue-900 to-blue-950" },
                    { title: "Muay Thai", sub: "All Levels · 30 videos", color: "from-orange-900 to-orange-950" },
                  ].map((card) => (
                    <div key={card.title} className={`rounded-lg bg-gradient-to-r ${card.color} p-3 flex items-center justify-between`}>
                      <div>
                        <p className="text-white font-bold text-xs">{card.title}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{card.sub}</p>
                      </div>
                      <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Home bar */}
                <div className="bg-black h-6 flex items-center justify-center">
                  <div className="w-24 h-1 bg-gray-700 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
