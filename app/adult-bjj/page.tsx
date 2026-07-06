import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Adult Brazilian Jiu-Jitsu in Crystal Lake, IL | Team Curran BJJ",
  description: "Adult BJJ classes in Crystal Lake, IL for all skill levels. Gi & No-Gi training under 5th Degree Pedro Sauer Black Belt Jeff Curran. Serving Crystal Lake, Algonquin, McHenry & Cary. Try 2 weeks for $45.",
  keywords: "adult bjj crystal lake, brazilian jiu jitsu crystal lake IL, no gi jiu jitsu crystal lake, jiu jitsu algonquin, BJJ mchenry, self defense crystal lake, jiu jitsu near me",
  openGraph: {
    title: "Adult Brazilian Jiu-Jitsu | Team Curran Crystal Lake, IL",
    description: "Gi & No-Gi BJJ classes for adults of all levels in Crystal Lake, IL. Pedro Sauer lineage. Start your 2-week trial today.",
    url: "https://teamcurran.com/adult-bjj",
  },
};

export default function AdultBJJPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative bg-black py-32 px-6 sm:px-10 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('/homepage.jpg')" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black" />
          <div className="relative max-w-4xl mx-auto text-center pt-16">
            <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-4">Crystal Lake, IL · Ages 13+</p>
            <h1 className="text-4xl sm:text-6xl font-black text-white uppercase leading-none mb-6">
              Adult <span className="text-brand">Brazilian</span><br />Jiu-Jitsu
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
              Gi and No-Gi BJJ classes for all levels — from complete beginners to experienced competitors — taught by 5th Degree Pedro Sauer Black Belt Professor Jeff Curran in Crystal Lake, Illinois.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/free-trial" className="bg-brand hover:bg-blue-800 text-white font-black uppercase tracking-widest px-8 py-4 rounded text-sm transition-colors shadow-lg shadow-blue-900/50">
                Start 2-Week Trial — $45
              </a>
              <a href="#schedule" className="border-2 border-white/30 hover:border-blue-500 text-white font-bold uppercase tracking-widest px-8 py-4 rounded text-sm transition-colors">
                View Schedule
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
                  Leverage Over <span className="text-brand">Strength</span>
                </h2>
                <div className="w-16 h-1 bg-brand mb-8" />
                <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
                  <p>
                    Brazilian Jiu-Jitsu is a ground-based martial art built on the principle that a smaller, weaker person can successfully defend themselves against a larger attacker using technique, leverage, and proper body mechanics. At Team Curran in Crystal Lake, Illinois, we teach a complete BJJ system developed directly from the Pedro Sauer Association — one of the most respected Gracie lineages in the world.
                  </p>
                  <p>
                    Our adult program runs both <strong className="text-white">Gi</strong> (traditional uniform) and <strong className="text-white">No-Gi</strong> classes throughout the week, so you get a well-rounded foundation in both formats. Whether you want to learn self-defense, get into the best shape of your life, compete in tournaments, or just roll with great training partners — this program has a place for you.
                  </p>
                  <p>
                    Classes are structured for all experience levels. Beginners start with our fundamentals curriculum — a 25-class system developed by Professor Curran specifically to take new students from zero to blue belt ready. More experienced students work advanced techniques, positional drilling, and live rolling.
                  </p>
                  <p>
                    We proudly serve students from Crystal Lake, Algonquin, Lake in the Hills, Cary, McHenry, Woodstock, and the surrounding McHenry County area.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-white font-black uppercase text-sm tracking-wider mb-4">Program Highlights</h3>
                  <ul className="space-y-3">
                    {[
                      "Gi & No-Gi classes every week",
                      "25-class fundamentals curriculum for beginners",
                      "Live sparring and competition preparation",
                      "Self-defense focus at every level",
                      "Taught by a Pedro Sauer 5th Degree Black Belt",
                      "All skill levels welcome — ages 13+",
                      "Safe, structured, and supportive environment",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-gray-300 text-sm">
                        <span className="text-brand mt-0.5 shrink-0">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-white font-black uppercase text-sm tracking-wider mb-4">Who This Is For</h3>
                  <ul className="space-y-3">
                    {[
                      "Complete beginners with zero experience",
                      "Athletes wanting to add grappling to their skill set",
                      "Anyone looking for effective self-defense",
                      "Students aiming to compete locally or nationally",
                      "People who want a real, functional workout",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-gray-300 text-sm">
                        <span className="text-brand mt-0.5 shrink-0">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Instructor */}
        <section className="bg-black py-24 px-6 sm:px-10">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-56 shrink-0">
                  <img
                    src="/DM1A9471-3.jpg"
                    alt="Professor Jeff Curran, 5th Degree BJJ Black Belt under Pedro Sauer, Crystal Lake IL"
                    className="w-full h-full object-cover object-top"
                    style={{ maxHeight: "320px" }}
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-2">Head Instructor</p>
                  <h2 className="text-2xl font-black text-white uppercase mb-1">Professor Jeff Curran</h2>
                  <p className="text-gray-400 text-sm uppercase tracking-wider mb-4">5th Degree Black Belt · Pedro Sauer Association</p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Professor Jeff "Big Frog" Curran has dedicated over 35 years to Brazilian Jiu-Jitsu. A 5th Degree Black Belt under Master Pedro Sauer and former professional MMA fighter, Jeff founded Team Curran in 1997 and has developed one of the most respected BJJ programs in Illinois. His teaching approach combines technical precision with the character development principles at the heart of the <a href="/gracie-jiu-jitsu" className="text-brand hover:underline">Gracie Jiu-Jitsu lineage</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nearby cities */}
        <section className="bg-gray-950 py-16 px-6 sm:px-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-3">Conveniently Located</p>
            <h2 className="text-2xl font-black text-white uppercase mb-4">Serving McHenry County & Beyond</h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mx-auto mb-8">
              Team Curran is located at 102 W Woodstock St in Crystal Lake, IL 60014 — just minutes from Algonquin, Lake in the Hills, Cary, McHenry, and Woodstock. If you&apos;re searching for <em>jiu jitsu near me</em> in northwest Chicagoland, we&apos;re your closest option for authentic Pedro Sauer BJJ.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["Crystal Lake", "Algonquin", "Lake in the Hills", "Cary", "McHenry", "Woodstock"].map((city) => (
                <span key={city} className="bg-gray-800 border border-gray-700 text-gray-300 text-xs font-semibold px-4 py-2 rounded uppercase tracking-wide">
                  {city}, IL
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-black py-24 px-6 sm:px-10">
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-900/40 to-blue-800/20 border border-blue-800 rounded-2xl p-10 text-center">
            <p className="text-blue-400 text-xs font-bold tracking-[0.3em] uppercase mb-3">New Student Offer</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase mb-3">Try BJJ for 2 Weeks</h2>
            <p className="text-6xl font-black text-brand mb-3">$45</p>
            <p className="text-gray-300 max-w-lg mx-auto mb-8">
              No long-term commitment. No prior experience needed. Come train at Crystal Lake&apos;s premier Brazilian Jiu-Jitsu academy.
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
