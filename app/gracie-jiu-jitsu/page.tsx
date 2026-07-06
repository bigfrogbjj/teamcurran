import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Gracie Jiu-Jitsu & Pedro Sauer Lineage in Illinois | Team Curran Crystal Lake",
  description: "Team Curran is an official Pedro Sauer Association school in Crystal Lake, IL. Learn about our Rickson Gracie → Pedro Sauer → Jeff Curran lineage — one of the most authentic Gracie BJJ lineages in Illinois.",
  keywords: "gracie jiu jitsu crystal lake, pedro sauer jiu jitsu illinois, pedro sauer association illinois, rickson gracie lineage illinois, authentic bjj illinois, gracie self defense crystal lake",
  openGraph: {
    title: "Gracie Jiu-Jitsu Lineage | Team Curran Crystal Lake, IL",
    description: "Pedro Sauer Association school in Crystal Lake, IL. Rickson Gracie → Pedro Sauer → Jeff Curran lineage. One of the most authentic BJJ programs in Illinois.",
    url: "https://teamcurran.com/gracie-jiu-jitsu",
  },
};

export default function GracieJiuJitsuPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative bg-black py-32 px-6 sm:px-10 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: "url('/gi-bjj-instruction.jpg')" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black" />
          <div className="relative max-w-4xl mx-auto text-center pt-16">
            <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-4">Pedro Sauer Association · Crystal Lake, IL</p>
            <h1 className="text-4xl sm:text-6xl font-black text-white uppercase leading-none mb-6">
              Gracie <span className="text-brand">Jiu-Jitsu</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
              Team Curran carries one of the most authentic Gracie Jiu-Jitsu lineages in Illinois — directly through Master Pedro Sauer, a legendary black belt under Rickson Gracie himself.
            </p>
            <a href="/adult-bjj" className="bg-brand hover:bg-blue-800 text-white font-black uppercase tracking-widest px-8 py-4 rounded text-sm transition-colors shadow-lg shadow-blue-900/50">
              See Our BJJ Program
            </a>
          </div>
        </section>

        {/* Lineage */}
        <section className="bg-gray-950 py-24 px-6 sm:px-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-3">The Lineage</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase mb-4">
                Where Our <span className="text-brand">Jiu-Jitsu</span> Comes From
              </h2>
              <div className="w-16 h-1 bg-brand mx-auto" />
            </div>

            {/* Lineage tree */}
            <div className="flex flex-col items-center gap-0">
              {[
                {
                  name: "Mitsuyo Maeda",
                  title: "Founder of Brazilian Jiu-Jitsu",
                  note: "Japanese judoka who brought jiu-jitsu to Brazil in the early 1900s and taught the Gracie family.",
                },
                {
                  name: "Hélio Gracie",
                  title: "Co-Founder of Gracie Jiu-Jitsu",
                  note: "Hélio refined Maeda's teachings into the leverage-based system known as Gracie Jiu-Jitsu, proving that technique beats strength.",
                },
                {
                  name: "Rickson Gracie",
                  title: "Gracie Family Champion",
                  note: "Widely regarded as one of the greatest BJJ competitors of all time, Rickson has a legendary undefeated record spanning decades.",
                },
                {
                  name: "Master Pedro Sauer",
                  title: "9th Degree Red-and-Black Belt · Pedro Sauer Association",
                  note: "A personal black belt under Rickson Gracie, Master Pedro Sauer is regarded as one of the finest technicians and teachers in the history of Gracie Jiu-Jitsu. He established the Pedro Sauer BJJ Association with schools worldwide.",
                  highlight: true,
                },
                {
                  name: "Professor Jeff Curran",
                  title: "5th Degree Black Belt · Team Curran Crystal Lake, IL",
                  note: "A direct black belt under Master Pedro Sauer, Professor Curran has trained under and alongside the Sauer Association since the 1990s. He founded Team Curran in Crystal Lake in 1997 and has carried the authentic Gracie teaching tradition ever since.",
                  highlight: true,
                },
              ].map((person, i, arr) => (
                <div key={person.name} className="flex flex-col items-center w-full max-w-2xl">
                  <div className={`w-full rounded-xl p-6 text-center border ${person.highlight ? "bg-blue-900/20 border-brand" : "bg-gray-900 border-gray-800"}`}>
                    <h3 className={`font-black text-lg uppercase ${person.highlight ? "text-white" : "text-gray-200"}`}>{person.name}</h3>
                    <p className={`text-xs font-bold tracking-wider uppercase mb-3 ${person.highlight ? "text-brand" : "text-gray-500"}`}>{person.title}</p>
                    <p className="text-gray-400 text-sm leading-relaxed">{person.note}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex flex-col items-center my-2">
                      <div className="w-0.5 h-6 bg-brand" />
                      <svg className="w-4 h-4 text-brand" fill="currentColor" viewBox="0 0 24 24"><path d="M12 16l-6-6h12z" /></svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why lineage matters */}
        <section className="bg-black py-24 px-6 sm:px-10">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div>
                <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-3">Why It Matters</p>
                <h2 className="text-3xl font-black text-white uppercase mb-6">
                  Not All <span className="text-brand">BJJ</span> Is the Same
                </h2>
                <div className="w-16 h-1 bg-brand mb-8" />
                <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
                  <p>
                    As Brazilian Jiu-Jitsu has exploded in popularity, many schools have opened that lack a verifiable connection to the original Gracie family system. Lineage is how you trace exactly where the art you&apos;re learning comes from — and how faithful it remains to the principles Hélio Gracie developed.
                  </p>
                  <p>
                    At Team Curran, there is no guessing. Our lineage runs directly from Hélio Gracie through Rickson Gracie and Master Pedro Sauer — one of the clearest, most respected chains in all of BJJ. When Professor Curran teaches you a technique, he learned it from people who helped define the art itself.
                  </p>
                  <p>
                    This is particularly rare in Illinois. There are very few Pedro Sauer Association schools in the state, making Team Curran&apos;s Crystal Lake academy one of the only places in northwest Chicagoland where you can train authentic Gracie Jiu-Jitsu at this level.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-white font-black uppercase text-sm tracking-wider mb-4">What Makes Pedro Sauer BJJ Different</h3>
                  <ul className="space-y-3">
                    {[
                      "Emphasis on self-defense as the foundation of all technique",
                      "Leverage and timing over strength and athleticism",
                      "Moral and ethical development alongside physical training",
                      "Respect for lineage and the original Gracie system",
                      "Technical precision — every position has a reason",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-gray-300 text-sm">
                        <span className="text-brand mt-0.5 shrink-0">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-6">
                  <p className="text-blue-300 text-sm font-semibold mb-1">One of Illinois&apos;s Only Pedro Sauer Schools</p>
                  <p className="text-gray-400 text-sm">If you&apos;re searching for authentic Gracie or Pedro Sauer BJJ in the Crystal Lake, Algonquin, McHenry, or Lake in the Hills area — Team Curran is your source.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-950 py-24 px-6 sm:px-10">
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-900/40 to-blue-800/20 border border-blue-800 rounded-2xl p-10 text-center">
            <p className="text-blue-400 text-xs font-bold tracking-[0.3em] uppercase mb-3">Train Authentic Gracie Jiu-Jitsu</p>
            <h2 className="text-3xl font-black text-white uppercase mb-4">Start at Team Curran</h2>
            <p className="text-gray-300 max-w-lg mx-auto mb-8">
              Try our <a href="/adult-bjj" className="text-brand hover:underline">Adult BJJ program</a> or <a href="/kids-jiu-jitsu" className="text-brand hover:underline">Kids Jiu-Jitsu</a> for two full weeks. 102 W Woodstock St, Crystal Lake, IL 60014.
            </p>
            <a
              href="/free-trial"
              className="inline-block bg-brand hover:bg-blue-800 text-white font-black uppercase tracking-widest px-10 py-4 rounded transition-colors shadow-lg shadow-blue-900/50"
            >
              Get Your 2-Week Trial — $45
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
