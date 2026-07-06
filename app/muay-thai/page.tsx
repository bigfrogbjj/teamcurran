import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Muay Thai Classes in Crystal Lake, IL | Team Curran",
  description: "Adult Muay Thai classes in Crystal Lake, IL for all levels. Learn striking, pad work, and self-defense from experienced instructors. Serving Crystal Lake, Algonquin, McHenry & Cary. Try 2 weeks for $45.",
  keywords: "muay thai crystal lake IL, muay thai classes crystal lake, striking classes crystal lake illinois, self defense crystal lake, muay thai algonquin, kickboxing crystal lake",
  openGraph: {
    title: "Muay Thai Classes in Crystal Lake, IL | Team Curran",
    description: "Adult Muay Thai for all skill levels in Crystal Lake, IL. Punches, kicks, elbows, knees — the art of eight limbs. Try 2 weeks for $45.",
    url: "https://teamcurran.com/muay-thai",
  },
};

export default function MuayThaiPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative bg-black py-32 px-6 sm:px-10 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('/8U0A1304.jpg')" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black" />
          <div className="relative max-w-4xl mx-auto text-center pt-16">
            <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-4">Crystal Lake, IL · All Levels</p>
            <h1 className="text-4xl sm:text-6xl font-black text-white uppercase leading-none mb-6">
              Adult <span className="text-brand">Muay Thai</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
              Learn the art of eight limbs — punches, kicks, elbows, and knees — from experienced striking instructors at Team Curran in Crystal Lake, Illinois. All fitness levels welcome.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/free-trial" className="bg-brand hover:bg-blue-800 text-white font-black uppercase tracking-widest px-8 py-4 rounded text-sm transition-colors shadow-lg shadow-blue-900/50">
                Start 2-Week Trial — $45
              </a>
              <a href="/#contact" className="border-2 border-white/30 hover:border-blue-500 text-white font-bold uppercase tracking-widest px-8 py-4 rounded text-sm transition-colors">
                Ask a Question
              </a>
            </div>
          </div>
        </section>

        {/* About the program */}
        <section className="bg-gray-950 py-24 px-6 sm:px-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div>
                <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-3">The Program</p>
                <h2 className="text-3xl sm:text-4xl font-black text-white uppercase mb-6">
                  The Art of <span className="text-brand">Eight Limbs</span>
                </h2>
                <div className="w-16 h-1 bg-brand mb-8" />
                <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
                  <p>
                    Muay Thai is Thailand&apos;s national combat sport and one of the most effective striking systems ever developed. Unlike boxing or karate, Muay Thai trains the entire body as a weapon — fists, elbows, knees, and shins — making it a complete stand-up fighting art used by martial artists and MMA competitors worldwide.
                  </p>
                  <p>
                    At Team Curran in Crystal Lake, Illinois, our Muay Thai program is open to all fitness levels. You do not need any prior martial arts experience to start. Classes cover striking technique, footwork, defense, pad work, and conditioning — giving you a full-body workout alongside practical self-defense skills.
                  </p>
                  <p>
                    Muay Thai pairs exceptionally well with our <a href="/adult-bjj" className="text-brand hover:underline">Adult Brazilian Jiu-Jitsu</a> program. Together, they cover the full spectrum of combat — stand-up and ground — making Team Curran one of the most complete martial arts training environments in McHenry County.
                  </p>
                  <p>
                    We welcome students from Crystal Lake, Algonquin, Lake in the Hills, Cary, McHenry, Woodstock, and the surrounding area.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <img
                  src="/8U0A1304.jpg"
                  alt="Adult Muay Thai striking class at Team Curran Crystal Lake IL — pad work and technique"
                  className="w-full rounded-xl object-cover"
                  style={{ maxHeight: "320px" }}
                />
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-white font-black uppercase text-sm tracking-wider mb-4">What You&apos;ll Learn</h3>
                  <ul className="space-y-3">
                    {[
                      "Punches, kicks, elbows, and knees",
                      "Defensive footwork and distance management",
                      "Pad work and partner drilling",
                      "Clinch work and off-balancing",
                      "Conditioning and functional fitness",
                      "Practical self-defense applications",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-gray-300 text-sm">
                        <span className="text-brand mt-0.5 shrink-0">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Instructors */}
        <section className="bg-black py-16 px-6 sm:px-10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-black text-white uppercase mb-8 text-center">Your Instructors</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  name: "Chuck Pilcher",
                  role: "Co-Owner · Muay Thai & Kids BJJ",
                  img: "/Chuck Pilcher.jpg",
                  imgAlt: "Chuck Pilcher, Muay Thai instructor at Team Curran Crystal Lake IL",
                  bio: "Chuck has been leading Team Curran's Thaiboxing program since the gym opened in 1997. His decades of experience and passion for the art make him an exceptional coach for students at any level.",
                },
                {
                  name: "Justin Seeberger",
                  role: "Instructor · BJJ & Thaiboxing",
                  img: "/Justin Seeberger.jpg",
                  imgAlt: "Justin Seeberger, Muay Thai and BJJ instructor at Team Curran",
                  bio: "Justin is an undefeated amateur MMA competitor (5-0) who brings competitive intensity and technical precision to both the Muay Thai and Adult BJJ mat.",
                },
              ].map((instructor) => (
                <div key={instructor.name} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col sm:flex-row">
                  <div className="sm:w-32 shrink-0">
                    <img src={instructor.img} alt={instructor.imgAlt} className="w-full h-48 sm:h-full object-cover object-top" />
                  </div>
                  <div className="p-5 flex flex-col justify-center">
                    <h3 className="text-white font-black text-base uppercase">{instructor.name}</h3>
                    <p className="text-brand text-xs font-bold tracking-wider uppercase mb-2">{instructor.role}</p>
                    <p className="text-gray-400 text-sm leading-relaxed">{instructor.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-950 py-24 px-6 sm:px-10">
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-900/40 to-blue-800/20 border border-blue-800 rounded-2xl p-10 text-center">
            <p className="text-blue-400 text-xs font-bold tracking-[0.3em] uppercase mb-3">New Student Offer</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase mb-3">Try Muay Thai for 2 Weeks</h2>
            <p className="text-6xl font-black text-brand mb-3">$45</p>
            <p className="text-gray-300 max-w-lg mx-auto mb-8">
              No experience needed. No long-term contract. Try our Muay Thai program at Crystal Lake&apos;s Team Curran Academy for two full weeks.
            </p>
            <a
              href="https://teamcurran.sites.zenplanner.com/sign-up-now.cfm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand hover:bg-blue-800 text-white font-black uppercase tracking-widest px-10 py-4 rounded transition-colors shadow-lg shadow-blue-900/50"
            >
              Start Your Trial Today
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
