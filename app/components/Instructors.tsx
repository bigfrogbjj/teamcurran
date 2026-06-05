const instructors = [
  {
    name: "Jeff Curran",
    title: "Head Instructor & Co-Owner",
    rank: "5th Degree Black Belt",
    specialties: ["Adult Jiu-Jitsu", "Kids Jiu-Jitsu"],
    bio: "Professor Jeff Curran is a 5th Degree Black Belt under Master Pedro Sauer and the founder of Team Curran Jiu-Jitsu. With over 35 years of competitive martial arts experience, Jeff built one of the most recognized BJJ teams in the world — training champions, black belts, and everyday athletes alike.",
    img: "/DM1A9501.jpg",
  },
  {
    name: "Chuck Pilcher",
    title: "Co-Owner & Instructor",
    rank: "Adult Thaiboxing & Kids Jiu-Jitsu",
    specialties: ["Adult Muay Thai", "Kids Jiu-Jitsu"],
    bio: "Chuck has been a cornerstone of Team Curran since the very first day the gym opened in 1997. Over 20+ years he transitioned from dedicated student to co-owner and instructor, managing both the Adult Thaiboxing and Junior Jiu-Jitsu programs. Chuck is a true embodiment of the Team Curran family.",
    img: "/Chuck Pilcher.jpg",
  },
  {
    name: "Justin Seeberger",
    title: "Instructor",
    rank: "Adult Jiu-Jitsu & Thaiboxing",
    specialties: ["Adult Jiu-Jitsu", "Thaiboxing"],
    bio: "Justin is an undefeated amateur MMA competitor (5-0) and a skilled instructor for both Adult Jiu-Jitsu and Thaiboxing. His competitive background and technical precision make him an exceptional coach for students of all levels.",
    img: "/Justin Seeberger.jpg",
  },
  {
    name: "John Hudson",
    title: "Instructor",
    rank: "Black Belt under Professor Jeff Curran",
    specialties: ["Adult Jiu-Jitsu", "Gi & No-Gi"],
    bio: "John Hudson is a Black Belt under Professor Jeff Curran and a dedicated instructor at Team Curran Academy Headquarters. His deep understanding of the art and commitment to his students make him a valued part of the Team Curran coaching staff.",
    img: "/John Hudson.jpg",
  },
  {
    name: "AJ Serrato",
    title: "Instructor",
    rank: "Black Belt under Professor Jeff Curran",
    specialties: ["Adult Jiu-Jitsu", "Gi & No-Gi"],
    bio: "AJ Serrato is a Black Belt under Professor Jeff Curran and an instructor at Team Curran Academy Headquarters. AJ brings energy, technical depth, and a passion for developing students at every level of their Jiu-Jitsu journey.",
    img: "/AJ Serrato.jpg",
  },
];

export default function Instructors() {
  return (
    <section id="instructors" className="bg-gray-950 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-3">
            THE TEAM
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white uppercase">
            Our <span className="text-brand">Instructors</span>
          </h2>
          <div className="w-16 h-1 bg-brand mx-auto mt-6" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {instructors.map((instructor) => (
            <div
              key={instructor.name}
              className="group bg-gray-900 border border-gray-800 hover:border-brand rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/20"
            >
              {/* Photo */}
              <div className="aspect-[4/3] overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url('${instructor.img}')` }}
                />
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="text-xl font-black text-white uppercase mb-0.5">{instructor.name}</h3>
                <p className="text-brand text-xs font-bold tracking-wider uppercase mb-1">{instructor.title}</p>
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-4">{instructor.rank}</p>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">{instructor.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {instructor.specialties.map((s) => (
                    <span key={s} className="bg-gray-800 border border-blue-900/40 text-gray-300 text-xs font-semibold px-2.5 py-1 rounded uppercase tracking-wide">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
