const programs = [
  {
    id: "adult-bjj",
    title: "Adult Jiu-Jitsu",
    subtitle: "Ages 13+",
    description:
      "Master the art of Gracie Jiu-Jitsu — a complete system of submission holds, defensive positioning, and leverage-based techniques. Whether your goal is self-defense, fitness, or competition, our adult BJJ program has a place for you.",
    highlights: ["Submission Grappling", "Self-Defense", "Competition Prep", "All Skill Levels"],
    color: "red",
    img: "https://placehold.co/600x400/1a1a1a/444444?text=Adult+BJJ",
  },
  {
    id: "muay-thai",
    title: "Adult Muay Thai",
    subtitle: "All Levels",
    description:
      "Develop powerful striking skills and improve your overall fitness with our Muay Thai program. Learn the art of eight limbs — punches, kicks, elbows, and knees — with a focus on practical self-defense applications.",
    highlights: ["Striking Fundamentals", "Fitness & Conditioning", "Self-Defense", "Pad Work"],
    color: "orange",
    img: "https://placehold.co/600x400/1a1a1a/444444?text=Muay+Thai",
  },
  {
    id: "junior-bjj",
    title: "Junior Jiu-Jitsu",
    subtitle: "K–8th Grade",
    description:
      "Build confidence, discipline, and real-world self-defense skills in a safe and encouraging environment. Our junior program helps kids develop strong character as much as physical technique.",
    highlights: ["Anti-Bullying Skills", "Builds Confidence", "Character Development", "Safe Environment"],
    color: "blue",
    img: "https://placehold.co/600x400/1a1a1a/444444?text=Junior+BJJ",
  },
];

export default function Programs() {
  return (
    <section id="programs" className="bg-black py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-red-500 text-xs font-bold tracking-[0.3em] uppercase mb-3">
            What We Offer
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white uppercase">
            Our <span className="text-red-600">Programs</span>
          </h2>
          <div className="w-16 h-1 bg-red-600 mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((prog) => (
            <div
              key={prog.id}
              id={prog.id}
              className="group bg-gray-900 border border-gray-800 hover:border-red-700 rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-900/20"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={prog.img}
                  alt={prog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-black text-white uppercase">{prog.title}</h3>
                    <p className="text-red-500 text-xs font-bold tracking-wider uppercase mt-0.5">
                      {prog.subtitle}
                    </p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">{prog.description}</p>
                <ul className="flex flex-wrap gap-2 mb-6">
                  {prog.highlights.map((h) => (
                    <li
                      key={h}
                      className="text-xs text-gray-300 bg-gray-800 px-2.5 py-1 rounded uppercase tracking-wide font-semibold"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className="block text-center bg-red-600 hover:bg-red-700 text-white font-bold text-sm uppercase tracking-widest py-2.5 rounded transition-colors"
                >
                  Get Started
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Trial CTA */}
        <div
          id="trial"
          className="mt-16 bg-gradient-to-r from-red-900/40 to-red-800/20 border border-red-800 rounded-xl p-8 sm:p-12 text-center"
        >
          <p className="text-red-400 text-xs font-bold tracking-[0.3em] uppercase mb-3">
            New Student Offer
          </p>
          <h3 className="text-3xl sm:text-4xl font-black text-white uppercase mb-3">
            2-Week Trial
          </h3>
          <p className="text-6xl font-black text-red-500 mb-3">$45</p>
          <p className="text-gray-300 max-w-lg mx-auto mb-8">
            Try any of our programs for two full weeks. Experience the Team Curran difference — no
            long-term commitment required.
          </p>
          <a
            href="#contact"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest px-10 py-4 rounded transition-colors shadow-lg shadow-red-900/50"
          >
            Claim Your Trial
          </a>
        </div>
      </div>
    </section>
  );
}
