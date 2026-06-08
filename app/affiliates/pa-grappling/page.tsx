import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="bg-black min-h-screen">
        <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/8U0A2416.jpg')" }} />
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-4">TEAM CURRAN AFFILIATE</p>
            <h1 className="text-4xl sm:text-6xl font-black text-white uppercase leading-none mb-4">PA <span className="text-brand">Grappling</span></h1>
            <div className="w-24 h-1 bg-brand mx-auto mb-6" />
            <p className="text-gray-300 text-lg">Altoona & Bedford, PA</p>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-3">ABOUT THE ACADEMY</p>
              <h2 className="text-3xl font-black text-white uppercase mb-6">PA <span className="text-brand">GRAPPLING</span></h2>
              <div className="w-16 h-1 bg-brand mb-8" />
              <p className="text-gray-300 leading-relaxed mb-4">PA Grappling is a Team Curran certified affiliate with two locations in Pennsylvania — Altoona and Bedford. Led by Black Belt Allen Coble, the academy offers Gracie Brazilian Jiu-Jitsu focused on self-defense, sport competition, and personal fitness for all ages.</p>
              <p className="text-gray-300 leading-relaxed mb-8">With a deep instructor roster including multiple brown and purple belts, PA Grappling provides structured, curriculum-based training in a welcoming environment for beginners through advanced practitioners.</p>
              <div className="flex flex-wrap gap-3 mb-8">
                {["Gracie Jiu-Jitsu", "Youth Jiu-Jitsu", "No-Gi", "Fitness Classes", "Private Lessons"].map(p => (
                  <span key={p} className="bg-gray-800 border border-blue-900/50 text-gray-300 text-xs font-semibold px-3 py-1.5 rounded uppercase tracking-wide">{p}</span>
                ))}
              </div>
              <a href="https://pa-grappling.com" target="_blank" rel="noopener noreferrer" className="inline-block bg-brand hover:bg-blue-800 text-white font-black uppercase tracking-widest px-8 py-3 rounded transition-colors">VISIT WEBSITE</a>
            </div>

            <div className="space-y-5">
              {[
                { label: "ALTOONA LOCATION", value: "2900 Plank Road\nAltoona, PA 16602", icon: "📍" },
                { label: "PHONE", value: "(814) 312-3845", icon: "📞" },
                { label: "EMAIL", value: "info@pa-grappling.com", icon: "✉️" },
                { label: "HEAD INSTRUCTOR", value: "Allen Coble — Black Belt", icon: "🥋" },
                { label: "ALTOONA SCHEDULE", value: "Mon/Wed/Fri: 9:00 AM\nTue/Thu: 6:00 PM Kids · 7:00 PM Adults", icon: "🕐" },
                { label: "BEDFORD SCHEDULE", value: "Mon & Thu: 7:00–8:00 PM\n(Fundamentals)", icon: "🕐" },
              ].map(item => (
                <div key={item.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <p className="text-brand text-xs font-bold uppercase tracking-widest mb-1">{item.icon} {item.label}</p>
                  <p className="text-gray-300 text-sm whitespace-pre-line">{item.value}</p>
                </div>
              ))}
              <a href="https://maps.google.com/?q=2900+Plank+Road+Altoona+PA+16602" target="_blank" rel="noopener noreferrer" className="block text-center border-2 border-brand text-brand hover:bg-brand hover:text-white font-black uppercase tracking-widest px-8 py-3 rounded transition-colors">GET DIRECTIONS</a>
            </div>
          </div>
        </section>
        <div className="text-center py-8 px-4"><Link href="/affiliates" className="text-brand hover:underline text-sm font-bold uppercase tracking-widest">← BACK TO ALL AFFILIATES</Link></div>
      </main>
      <Footer />
    </>
  );
}
