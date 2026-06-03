export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-blue-950 opacity-90" />

      {/* Placeholder hero image area */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url('https://placehold.co/1920x1080/1a1a1a/333333?text=Team+Curran+BJJ')",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="text-brand text-sm font-bold tracking-[0.3em] uppercase mb-4">
          Crystal Lake, IL · Est. 1997
        </p>
        <h1 className="text-5xl sm:text-7xl font-black text-white uppercase leading-none mb-4 tracking-tight">
          Team
          <span className="text-brand"> Curran</span>
        </h1>
        <p className="text-2xl sm:text-3xl text-gray-300 font-light mb-3 tracking-widest uppercase">
          Jiu-Jitsu Academy
        </p>
        <div className="w-24 h-1 bg-brand mx-auto mb-6" />
        <p className="text-gray-300 text-lg sm:text-xl italic mb-3 max-w-2xl mx-auto">
          "Leverage over Strength. Timing over Speed."
        </p>
        <p className="text-blue-400 font-bold tracking-[0.25em] uppercase text-sm mb-10">
          Passion · Persistence · Perfection
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#trial"
            className="bg-brand hover:bg-blue-800 text-white font-black uppercase tracking-widest px-8 py-4 rounded text-sm transition-colors shadow-lg shadow-blue-900/50"
          >
            Start Your 2-Week Trial — $45
          </a>
          <a
            href="#programs"
            className="border-2 border-white/30 hover:border-blue-500 text-white font-bold uppercase tracking-widest px-8 py-4 rounded text-sm transition-colors"
          >
            Explore Programs
          </a>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[
            { value: "27+", label: "Years Experience" },
            { value: "4th", label: "Degree Black Belt" },
            { value: "1997", label: "Founded" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black text-brand">{s.value}</div>
              <div className="text-gray-400 text-xs uppercase tracking-wider mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
