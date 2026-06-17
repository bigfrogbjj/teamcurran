import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";

export default function CedarValleyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-black min-h-screen">
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/cedar-valley.jpg')" }} />
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-4">TEAM CURRAN AFFILIATE</p>
            <h1 className="text-4xl sm:text-6xl font-black text-white uppercase leading-none mb-4">
              Cedar Valley <span className="text-brand">Jiu-Jitsu</span>
            </h1>
            <div className="w-24 h-1 bg-brand mx-auto mb-6" />
            <p className="text-gray-300 text-lg">Waterloo, IA</p>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-3">ABOUT THE ACADEMY</p>
              <h2 className="text-3xl font-black text-white uppercase mb-6">CEDAR VALLEY <span className="text-brand">JIU-JITSU</span></h2>
              <div className="w-16 h-1 bg-brand mb-8" />
              <p className="text-gray-300 leading-relaxed mb-4">
                Cedar Valley Jiu-Jitsu is a proud Team Curran certified affiliate serving the Waterloo, Iowa area. Their academy delivers the same world-class Gracie Jiu-Jitsu curriculum and standards upheld by Team Curran Headquarters in Crystal Lake, IL.
              </p>
              <p className="text-gray-300 leading-relaxed mb-8">
                Whether you are new to martial arts or an experienced practitioner, Cedar Valley BJJ offers a welcoming and professional environment to grow your game.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {["Brazilian Jiu-Jitsu", "Gracie Jiu-Jitsu", "Self-Defense", "All Levels"].map(p => (
                  <span key={p} className="bg-gray-800 border border-blue-900/50 text-gray-300 text-xs font-semibold px-3 py-1.5 rounded uppercase tracking-wide">{p}</span>
                ))}
              </div>
              <a href="https://cv-bjj.com" target="_blank" rel="noopener noreferrer"
                className="inline-block bg-brand hover:bg-blue-800 text-white font-black uppercase tracking-widest px-8 py-3 rounded transition-colors">
                VISIT WEBSITE
              </a>
            </div>

            <div className="space-y-5">
              {[
                { label: "LOCATION", value: "Waterloo, IA", icon: "📍" },
                { label: "WEBSITE", value: "cedarvalleybjj.com", icon: "🌐" },
                { label: "PROGRAMS", value: "Brazilian Jiu-Jitsu\nSelf-Defense\nGracie Jiu-Jitsu", icon: "🥋" },
                { label: "AFFILIATION", value: "Team Curran Jiu-Jitsu", icon: "🏆" },
              ].map(item => (
                <div key={item.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <p className="text-brand text-xs font-bold uppercase tracking-widest mb-1">{item.icon} {item.label}</p>
                  <p className="text-gray-300 text-sm whitespace-pre-line">{item.value}</p>
                </div>
              ))}
              <a href="https://maps.google.com/?q=Cedar+Valley+Jiu-Jitsu+Waterloo+IA" target="_blank" rel="noopener noreferrer"
                className="block text-center border-2 border-brand text-brand hover:bg-brand hover:text-white font-black uppercase tracking-widest px-8 py-3 rounded transition-colors">
                GET DIRECTIONS
              </a>
            </div>
          </div>
        </section>

        <div className="text-center py-8 px-4">
          <Link href="/affiliates" className="text-brand hover:underline text-sm font-bold uppercase tracking-widest">← BACK TO ALL AFFILIATES</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
