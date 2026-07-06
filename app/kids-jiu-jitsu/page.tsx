import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Kids Jiu-Jitsu & Martial Arts in Crystal Lake, IL | Team Curran",
  description: "Kids Brazilian Jiu-Jitsu classes in Crystal Lake, IL for K–8th grade. Anti-bullying skills, confidence, and discipline in a safe environment. Serving Crystal Lake, Algonquin, Lake in the Hills & McHenry. Try 2 weeks for $45.",
  keywords: "kids jiu jitsu crystal lake, kids martial arts crystal lake IL, children bjj crystal lake, anti-bullying martial arts crystal lake, junior bjj illinois, jiu jitsu for kids algonquin",
  openGraph: {
    title: "Kids Jiu-Jitsu in Crystal Lake, IL | Team Curran",
    description: "BJJ classes for kids K–8th grade in Crystal Lake, IL. Builds confidence, discipline, and anti-bullying skills. Try 2 weeks for $45.",
    url: "https://teamcurran.com/kids-jiu-jitsu",
  },
};

export default function KidsJiuJitsuPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative bg-black py-32 px-6 sm:px-10 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('/kids-program.jpg')", backgroundPosition: "center 30%" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black" />
          <div className="relative max-w-4xl mx-auto text-center pt-16">
            <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-4">Crystal Lake, IL · K–8th Grade</p>
            <h1 className="text-4xl sm:text-6xl font-black text-white uppercase leading-none mb-6">
              Kids <span className="text-brand">Jiu-Jitsu</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
              Build your child&apos;s confidence, discipline, and real-world self-defense skills in a safe, structured, and encouraging environment at Team Curran in Crystal Lake, Illinois.
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
                  More Than <span className="text-brand">Martial Arts</span>
                </h2>
                <div className="w-16 h-1 bg-brand mb-8" />
                <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
                  <p>
                    Our Junior Jiu-Jitsu program at Team Curran is designed for children from kindergarten through 8th grade. Brazilian Jiu-Jitsu is one of the most effective tools for teaching kids not just how to protect themselves physically, but how to carry themselves with confidence, respect, and resilience in everyday life.
                  </p>
                  <p>
                    Every class is built around three pillars: <strong className="text-white">technique</strong>, <strong className="text-white">character</strong>, and <strong className="text-white">fun</strong>. Kids learn real BJJ fundamentals — positions, escapes, and basic submissions — in a safe, controlled environment where no one gets hurt and everyone improves together.
                  </p>
                  <p>
                    Bullying is one of the biggest concerns parents face today. Our program teaches kids how to de-escalate situations and, when necessary, how to defend themselves without becoming the aggressor. Students graduate with the awareness and tools to handle physical confrontations calmly and effectively.
                  </p>
                  <p>
                    Instructor <strong className="text-white">Chuck Pilcher</strong> — co-owner of Team Curran since 1997 — leads the Junior BJJ program with patience, structure, and genuine care for every child who walks through the door.
                  </p>
                  <p>
                    We welcome students from Crystal Lake, Algonquin, Lake in the Hills, Cary, McHenry, Woodstock, and all surrounding McHenry County communities.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <img
                  src="/kids-program.jpg"
                  alt="Kids Brazilian Jiu-Jitsu class at Team Curran Academy in Crystal Lake, IL"
                  className="w-full rounded-xl object-cover"
                  style={{ objectPosition: "center 30%", maxHeight: "320px" }}
                />
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-white font-black uppercase text-sm tracking-wider mb-4">What Kids Learn</h3>
                  <ul className="space-y-3">
                    {[
                      "Anti-bullying awareness and de-escalation",
                      "Basic BJJ positions and escapes",
                      "Discipline, focus, and respect",
                      "Confidence and self-esteem",
                      "Teamwork and sportsmanship",
                      "How to set and achieve goals",
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

        {/* Instructor */}
        <section className="bg-black py-16 px-6 sm:px-10">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-56 shrink-0">
                  <img
                    src="/Chuck Pilcher.jpg"
                    alt="Chuck Pilcher, Kids BJJ and Muay Thai instructor at Team Curran Crystal Lake IL"
                    className="w-full h-full object-cover object-top"
                    style={{ maxHeight: "300px" }}
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-2">Kids Program Instructor</p>
                  <h2 className="text-2xl font-black text-white uppercase mb-1">Chuck Pilcher</h2>
                  <p className="text-gray-400 text-sm uppercase tracking-wider mb-4">Co-Owner · Junior BJJ & Muay Thai</p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Chuck has been a cornerstone of Team Curran since day one in 1997. Over more than 25 years, he has guided hundreds of children through their martial arts journey — building confident, disciplined, and respectful young athletes. Chuck&apos;s patience and passion for youth development make him the perfect instructor for the next generation of Team Curran grapplers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-gray-950 py-24 px-6 sm:px-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-black text-white uppercase mb-10 text-center">Common Questions</h2>
            <div className="space-y-4">
              {[
                { q: "What age can my child start?", a: "We accept children from kindergarten (roughly age 5) through 8th grade. Contact us if you have a child outside this range and we'll find the right fit." },
                { q: "Does my child need any experience?", a: "Absolutely not. Most kids start with zero experience and that's perfectly fine. Our curriculum is designed to take complete beginners from the ground up." },
                { q: "Is it safe?", a: "Yes. BJJ is a contact sport, but our kids classes are structured so that safety is always the priority. Techniques are taught progressively, and sparring is always supervised and controlled." },
                { q: "How is jiu-jitsu different from karate or other martial arts?", a: "BJJ is ground-based and focuses on realistic grappling — the same techniques used in MMA and proven in real-world self-defense situations. It emphasizes leverage over strength, making it effective for smaller children against larger opponents." },
                { q: "Will it help with bullying?", a: "Yes — and not just physically. BJJ builds the mental confidence that bullies look for as a target. Most parents tell us their kids carry themselves differently within weeks of starting." },
              ].map(({ q, a }) => (
                <div key={q} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-white font-bold text-sm mb-2">{q}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-black py-24 px-6 sm:px-10">
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-900/40 to-blue-800/20 border border-blue-800 rounded-2xl p-10 text-center">
            <p className="text-blue-400 text-xs font-bold tracking-[0.3em] uppercase mb-3">New Student Offer</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase mb-3">Try Kids BJJ for 2 Weeks</h2>
            <p className="text-6xl font-black text-brand mb-3">$45</p>
            <p className="text-gray-300 max-w-lg mx-auto mb-8">
              No long-term commitment. No prior experience needed. Let your child experience Team Curran for two full weeks.
            </p>
            <a
              href="https://teamcurran.sites.zenplanner.com/sign-up-now.cfm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand hover:bg-blue-800 text-white font-black uppercase tracking-widest px-10 py-4 rounded transition-colors shadow-lg shadow-blue-900/50"
            >
              Sign Up Today
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
