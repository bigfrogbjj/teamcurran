import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="bg-black min-h-screen">
        <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/DM1A9471-3.jpg')" }} />
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-4">TEAM CURRAN AFFILIATE</p>
            <h1 className="text-4xl sm:text-6xl font-black text-white uppercase leading-none mb-4">Gracie <span className="text-brand">Destin</span></h1>
            <div className="w-24 h-1 bg-brand mx-auto mb-6" />
            <p className="text-gray-300 text-lg">Destin, FL</p>
          </div>
        </section>
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-3">ABOUT THE ACADEMY</p>
              <h2 className="text-3xl font-black text-white uppercase mb-6">GRACIE <span className="text-brand">DESTIN</span></h2>
              <div className="w-16 h-1 bg-brand mb-8" />
              <p className="text-gray-300 leading-relaxed mb-4">Gracie Destin is a Team Curran certified affiliate bringing authentic Gracie Jiu-Jitsu to the Destin, Florida community. As part of the Team Curran and Pedro Sauer BJJ Association network, they uphold the highest standards of Jiu-Jitsu instruction.</p>
              <p className="text-gray-300 leading-relaxed mb-8">Whether your goal is self-defense, fitness, or competition, Gracie Destin provides a professional and welcoming training environment for students of all ages and skill levels.</p>
              <div className="flex flex-wrap gap-3 mb-8">
                {["Gracie Jiu-Jitsu", "Brazilian Jiu-Jitsu", "Self-Defense", "All Levels"].map(p => (
                  <span key={p} className="bg-gray-800 border border-blue-900/50 text-gray-300 text-xs font-semibold px-3 py-1.5 rounded uppercase tracking-wide">{p}</span>
                ))}
              </div>
              <a href="https://www.destinmma.com" target="_blank" rel="noopener noreferrer" className="inline-block bg-brand hover:bg-blue-800 text-white font-black uppercase tracking-widest px-8 py-3 rounded transition-colors">VISIT WEBSITE</a>
            </div>
            <div className="space-y-5">
              {[
                { label: "LOCATION", value: "Destin, FL", icon: "📍" },
                { label: "AFFILIATION", value: "Team Curran Jiu-Jitsu\nPedro Sauer Association", icon: "🥋" },
              ].map(item => (
                <div key={item.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <p className="text-brand text-xs font-bold uppercase tracking-widest mb-1">{item.icon} {item.label}</p>
                  <p className="text-gray-300 text-sm whitespace-pre-line">{item.value}</p>
                </div>
              ))}
              <a href="https://maps.google.com/?q=Gracie+Destin+FL" target="_blank" rel="noopener noreferrer" className="block text-center border-2 border-brand text-brand hover:bg-brand hover:text-white font-black uppercase tracking-widest px-8 py-3 rounded transition-colors">GET DIRECTIONS</a>
            </div>
          </div>
        </section>
        <div className="text-center py-8 px-4"><Link href="/affiliates" className="text-brand hover:underline text-sm font-bold uppercase tracking-widest">← BACK TO ALL AFFILIATES</Link></div>
      </main>
      <Footer />
    </>
  );
}
