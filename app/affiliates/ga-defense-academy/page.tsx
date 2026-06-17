import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="bg-black min-h-screen">
        <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/ga-defense-academy.jpg')" }} />
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-4">TEAM CURRAN AFFILIATE</p>
            <h1 className="text-4xl sm:text-6xl font-black text-white uppercase leading-none mb-4">GA Defense <span className="text-brand">Academy</span></h1>
            <div className="w-24 h-1 bg-brand mx-auto mb-6" />
            <p className="text-gray-300 text-lg">Locust Grove, GA</p>
          </div>
        </section>
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-3">ABOUT THE ACADEMY</p>
              <h2 className="text-3xl font-black text-white uppercase mb-6">GA DEFENSE <span className="text-brand">ACADEMY</span></h2>
              <div className="w-16 h-1 bg-brand mb-8" />
              <p className="text-gray-300 leading-relaxed mb-4">Georgia Defense Academy is a Team Curran certified affiliate located in Locust Grove, Georgia. A civilian and law-enforcement friendly environment that blends traditional Shorin-Ryu Karate with Gracie Jiu-Jitsu for a comprehensive martial arts experience.</p>
              <p className="text-gray-300 leading-relaxed mb-8">The academy provides adults aged 14+ with lifelong self-protection skills through blended training classes, welcoming all skill levels from beginner to advanced practitioners.</p>
              <div className="flex flex-wrap gap-3 mb-8">
                {["Gracie Jiu-Jitsu", "Shorin-Ryu Karate", "Blended Training", "Self-Defense", "Law Enforcement Friendly"].map(p => (
                  <span key={p} className="bg-gray-800 border border-blue-900/50 text-gray-300 text-xs font-semibold px-3 py-1.5 rounded uppercase tracking-wide">{p}</span>
                ))}
              </div>
              <a href="https://gadacad.com" target="_blank" rel="noopener noreferrer" className="inline-block bg-brand hover:bg-blue-800 text-white font-black uppercase tracking-widest px-8 py-3 rounded transition-colors">VISIT WEBSITE</a>
            </div>
            <div className="space-y-5">
              {[
                { label: "ADDRESS", value: "3000 Tanger Blvd\nLocust Grove, GA 30248", icon: "📍" },
                { label: "PHONE", value: "(678) 561-4099", icon: "📞" },
                { label: "EMAIL", value: "contact@gadacad.com", icon: "✉️" },
                { label: "SCHEDULE", value: "Mon & Thu\nKarate: 6:15 PM\nJiu-Jitsu: 7:30 PM", icon: "🕐" },
              ].map(item => (
                <div key={item.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <p className="text-brand text-xs font-bold uppercase tracking-widest mb-1">{item.icon} {item.label}</p>
                  <p className="text-gray-300 text-sm whitespace-pre-line">{item.value}</p>
                </div>
              ))}
              <a href="https://maps.google.com/?q=3000+Tanger+Blvd+Locust+Grove+GA+30248" target="_blank" rel="noopener noreferrer" className="block text-center border-2 border-brand text-brand hover:bg-brand hover:text-white font-black uppercase tracking-widest px-8 py-3 rounded transition-colors">GET DIRECTIONS</a>
            </div>
          </div>
        </section>
        <div className="text-center py-8 px-4"><Link href="/affiliates" className="text-brand hover:underline text-sm font-bold uppercase tracking-widest">← BACK TO ALL AFFILIATES</Link></div>
      </main>
      <Footer />
    </>
  );
}
