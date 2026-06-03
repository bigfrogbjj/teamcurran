import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Contact from "../components/Contact";

export default function AffiliatesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-black pt-20">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/8U0A2416.jpg')" }}
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-4">
              Team Curran Network
            </p>
            <h1 className="text-5xl sm:text-7xl font-black text-white uppercase leading-none mb-4">
              Become an <span className="text-brand">Affiliate</span>
            </h1>
            <div className="w-24 h-1 bg-brand mx-auto mb-6" />
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Join a globally recognized team built on passion, persistence, and perfection.
              Professor Jeff Curran and his staff are dedicated to the success of every affiliate school.
            </p>
          </div>
        </section>

        {/* Why Affiliate */}
        <section className="bg-gray-950 py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-3">Why Team Curran</p>
              <h2 className="text-4xl font-black text-white uppercase">
                The <span className="text-brand">Affiliate Advantage</span>
              </h2>
              <div className="w-16 h-1 bg-brand mx-auto mt-6" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "World-Class Curriculum",
                  desc: "Access Professor Jeff Curran's proven system — the same curriculum that has produced champions and black belts for over 35 years.",
                  icon: "🥋",
                },
                {
                  title: "Global Recognition",
                  desc: "The Team Curran name carries weight worldwide. Align your school with a brand that students and competitors respect.",
                  icon: "🌎",
                },
                {
                  title: "Dedicated Support",
                  desc: "You're never alone. Our team provides ongoing support for curriculum, marketing, operations, and student development.",
                  icon: "🤝",
                },
                {
                  title: "Pedro Sauer Association",
                  desc: "As a proud member of the Pedro Sauer BJJ Association, affiliates benefit from one of the most respected lineages in the art.",
                  icon: "🏆",
                },
                {
                  title: "Seminars & Events",
                  desc: "Access exclusive seminars, camps, and events. Bring Professor Curran and Team Curran instructors directly to your academy.",
                  icon: "📅",
                },
                {
                  title: "Community",
                  desc: "Join a tight-knit family of affiliate schools who support each other, compete together, and grow together.",
                  icon: "👥",
                },
              ].map((item) => (
                <div key={item.title} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-brand transition-colors">
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <h3 className="text-white font-black uppercase text-sm tracking-wide mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote */}
        <section className="bg-brand py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-white text-2xl sm:text-3xl font-black uppercase leading-tight mb-4">
              "The hardest part about starting training in any martial art is that first step through the academy door."
            </p>
            <p className="text-blue-200 font-bold tracking-widest uppercase text-sm">— Professor Jeff Curran</p>
          </div>
        </section>

        {/* Contact form reused */}
        <Contact />
      </main>
      <Footer />
    </>
  );
}
