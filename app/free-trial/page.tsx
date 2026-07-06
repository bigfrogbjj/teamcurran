import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Free Trial — 2 Weeks for $45 | Team Curran BJJ Crystal Lake, IL",
  description: "Try Brazilian Jiu-Jitsu, Muay Thai, or Kids BJJ at Team Curran in Crystal Lake, IL for two full weeks — just $45. No long-term commitment. No experience needed. Serving Crystal Lake, Algonquin, McHenry & Cary.",
  keywords: "bjj free trial crystal lake, jiu jitsu trial crystal lake IL, 2 week trial martial arts crystal lake, try bjj near me, martial arts trial algonquin IL",
  openGraph: {
    title: "2-Week BJJ Trial for $45 | Team Curran Crystal Lake, IL",
    description: "Try any program at Team Curran for two full weeks — just $45. No commitment. No experience needed. Crystal Lake, IL.",
    url: "https://teamcurran.com/free-trial",
  },
};

export default function FreeTrialPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-black py-32 px-6 sm:px-10">
          <div className="max-w-3xl mx-auto text-center pt-16">
            <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-4">New Student Offer</p>
            <h1 className="text-4xl sm:text-6xl font-black text-white uppercase leading-none mb-4">
              2-Week <span className="text-brand">Trial</span>
            </h1>
            <p className="text-8xl font-black text-brand mb-6">$45</p>
            <p className="text-gray-300 text-lg max-w-xl mx-auto mb-10">
              Try any class at Team Curran for two full weeks. No long-term contract. No prior experience needed.
            </p>
            <a
              href="https://teamcurran.sites.zenplanner.com/sign-up-now.cfm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand hover:bg-blue-800 text-white font-black uppercase tracking-widest px-12 py-5 rounded text-base transition-colors shadow-xl shadow-blue-900/50"
            >
              Sign Up Now
            </a>
            <p className="text-gray-500 text-xs mt-4">Questions? Call us at <a href="tel:8153560454" className="text-brand hover:underline">(815) 356-0454</a></p>
          </div>
        </section>

        {/* What's included */}
        <section className="bg-gray-950 py-24 px-6 sm:px-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-black text-white uppercase mb-4">What&apos;s Included</h2>
              <p className="text-gray-400 text-sm max-w-xl mx-auto">Your 2-week trial gives you full access to all beginner-friendly classes across any of our programs.</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  title: "Adult Jiu-Jitsu",
                  desc: "Gi and No-Gi BJJ classes for ages 13 and up. All skill levels welcome — most students start with zero experience.",
                  href: "/adult-bjj",
                  img: "/homepage.jpg",
                  imgAlt: "Adult BJJ gi class at Team Curran Crystal Lake IL",
                },
                {
                  title: "Muay Thai",
                  desc: "Striking fundamentals, pad work, and conditioning for all fitness levels. No fighting experience necessary.",
                  href: "/muay-thai",
                  img: "/8U0A1304.jpg",
                  imgAlt: "Muay Thai class at Team Curran Crystal Lake Illinois",
                },
                {
                  title: "Kids Jiu-Jitsu",
                  desc: "Junior BJJ for K–8th grade. Builds confidence, anti-bullying skills, and discipline in a safe environment.",
                  href: "/kids-jiu-jitsu",
                  img: "/kids-program.jpg",
                  imgAlt: "Kids BJJ class at Team Curran Crystal Lake Illinois",
                },
              ].map((program) => (
                <a key={program.title} href={program.href} className="group bg-gray-900 border border-gray-800 hover:border-brand rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5">
                  <div className="aspect-video overflow-hidden">
                    <img src={program.img} alt={program.imgAlt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-black uppercase mb-2">{program.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{program.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-black py-24 px-6 sm:px-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-black text-white uppercase text-center mb-12">How It Works</h2>
            <div className="space-y-6">
              {[
                { step: "1", title: "Sign up online", desc: "Click the button above to register through our Zen Planner portal. Takes about 2 minutes." },
                { step: "2", title: "Show up to class", desc: "Wear comfortable athletic clothing. We'll provide everything else. Come to 102 W Woodstock St, Crystal Lake, IL 60014." },
                { step: "3", title: "Train for two weeks", desc: "Attend as many classes as you like across any of our programs. Ask questions. Get sweaty. Have fun." },
                { step: "4", title: "Decide if it's right for you", desc: "No pressure. If you love it — and most people do — we'll talk about membership options that fit your schedule and budget." },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-6 items-start">
                  <div className="bg-brand text-white font-black text-xl w-12 h-12 rounded-full flex items-center justify-center shrink-0">{step}</div>
                  <div>
                    <h3 className="text-white font-bold text-base mb-1">{title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-gray-950 py-24 px-6 sm:px-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-black text-white uppercase mb-10 text-center">Common Questions</h2>
            <div className="space-y-4">
              {[
                { q: "Do I need any experience?", a: "No. The two-week trial is designed specifically for people who have never trained before. You'll be with other beginners and no one will put you on the spot." },
                { q: "What should I wear?", a: "Athletic shorts or joggers and a t-shirt are perfect. We'll provide loaner equipment as needed. If you want to train in a Gi we can discuss options after your first class." },
                { q: "Am I going to get hurt?", a: "BJJ has one of the lowest injury rates of any contact sport when practiced safely. Our instructors prioritize safety above everything else, especially with new students." },
                { q: "I'm out of shape — is that okay?", a: "Completely fine. Many of our students start exactly where you are. The fitness comes with the training — you don't need it to begin." },
                { q: "Can I try more than one program in two weeks?", a: "Yes. Your trial gives you access to all beginner-friendly classes. You can try Adult BJJ, Muay Thai, and Kids BJJ (for your child) all within the same trial period." },
                { q: "Where are you located?", a: "102 W Woodstock St, Crystal Lake, IL 60014. We're easy to reach from Algonquin, Lake in the Hills, Cary, McHenry, and Woodstock." },
              ].map(({ q, a }) => (
                <div key={q} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-white font-bold text-sm mb-2">{q}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-black py-24 px-6 sm:px-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-black text-white uppercase mb-4">Ready to Start?</h2>
            <p className="text-gray-400 text-sm mb-8 max-w-lg mx-auto">
              Crystal Lake&apos;s most authentic Brazilian Jiu-Jitsu academy — Pedro Sauer lineage, since 1997.
            </p>
            <a
              href="https://teamcurran.sites.zenplanner.com/sign-up-now.cfm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand hover:bg-blue-800 text-white font-black uppercase tracking-widest px-12 py-5 rounded text-base transition-colors shadow-xl shadow-blue-900/50"
            >
              Start Your 2-Week Trial — $45
            </a>
            <div className="mt-8 text-gray-500 text-sm space-y-1">
              <p>Team Curran Jiu-Jitsu Academy</p>
              <p>102 W Woodstock St · Crystal Lake, IL 60014</p>
              <a href="tel:8153560454" className="text-brand hover:underline">(815) 356-0454</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
