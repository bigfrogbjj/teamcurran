import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Hero photo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/8U0A2416.jpg')" }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="text-white text-sm font-bold tracking-[0.3em] uppercase mb-6">
          Crystal Lake, IL · Est. 1997
        </p>
        <h1 className="text-5xl sm:text-7xl font-black text-white uppercase leading-none mb-2 tracking-tight">
          Curran
          <span className="text-brand"> Jiu-Jitsu</span>
        </h1>
        <p className="text-xl sm:text-2xl font-black text-white uppercase tracking-widest mb-3">
          Pedro Sauer Team
        </p>
        <div className="flex justify-center mb-4">
          <Image
            src="/Team Curran C .png"
            alt="Curran Jiu-Jitsu"
            width={280}
            height={70}
            className="h-12 w-auto"
          />
        </div>
        <div className="w-24 h-1 bg-brand mx-auto mb-6" />
        <p className="text-gray-300 text-lg sm:text-xl italic mb-3 max-w-2xl mx-auto">
          "Leverage over Strength. Timing over Speed."
        </p>
        <p className="text-blue-400 font-bold tracking-[0.25em] uppercase text-sm mb-10">
          Passion · Persistence · Perfection
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://teamcurran.sites.zenplanner.com/sign-up-now.cfm" target="_blank" rel="noopener noreferrer"
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
            { value: "35+", label: "Years Experience" },
            { value: "5th", label: "Degree Black Belt" },
            { value: "1997", label: "Founded" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black text-white">{s.value}</div>
              <div className="text-gray-300 text-xs uppercase tracking-wider mt-1">
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
