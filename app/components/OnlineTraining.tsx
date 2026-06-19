const features = [
  { title: "Jeff Curran's Full Curriculum", desc: "Learn the same system taught on the mats — structured for white belt through advanced." },
  { title: "Technique Library", desc: "Individual techniques, position series, and full program lessons organized by level." },
  { title: "Train Anywhere, Any Device", desc: "Stream on your phone, tablet, laptop, or smart TV. No mat required." },
  { title: "Jeff Curran & Adam Miller", desc: "Content from multiple high-level instructors covering Jiu-Jitsu and more." },
];

export default function OnlineTraining() {
  return (
    <section id="online" className="bg-gray-950 py-24 px-6 sm:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Section label */}
        <div className="text-center mb-14">
          <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-3">Stream On Demand</p>
          <h2 className="text-4xl sm:text-5xl font-black text-white uppercase">
            Team Curran <span className="text-brand">TV</span>
          </h2>
          <div className="w-16 h-1 bg-brand mx-auto mt-6" />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Group photo with logo overlay */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://teamcurrantv.com/wp-content/uploads/group.png"
                alt="Team Curran TV"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Logo badge overlay */}
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-black border border-gray-700 rounded-xl px-6 py-3 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://teamcurrantv.com/wp-content/uploads/teamcurrantvlogo.png"
                alt="Team Curran TV Logo"
                className="h-10 w-auto"
              />
            </div>
          </div>

          {/* Right: Text */}
          <div className="pt-8 lg:pt-0">
            <h3 className="text-3xl sm:text-5xl font-black text-white uppercase leading-none mb-6">
              Train With Us<br />
              <span className="text-brand">Anywhere.</span><br />
              Anytime.
            </h3>
            <div className="w-16 h-1 bg-brand mb-8" />
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Jiu-Jitsu on demand with Jeff Curran &amp; Adam Miller. Stream techniques,
              lessons, and full curriculum series for all skill levels — directly to any device, anywhere in the world.
            </p>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {features.map((f) => (
                <div key={f.title} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-white font-bold text-sm">{f.title}</p>
                    <p className="text-gray-400 text-xs leading-relaxed mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://teamcurrantv.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand hover:bg-blue-800 text-white font-black uppercase tracking-widest px-8 py-4 rounded text-sm transition-colors shadow-lg shadow-blue-900/40"
            >
              Get Access — Team Curran TV
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
