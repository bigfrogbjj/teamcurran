import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";

const affiliates = [
  { slug: "team-haanpaa-rockford", name: "Team Haanpaa Rockford", location: "Rockford, IL", website: "teamhaanpaa.com", img: "/8U0A2065.jpg" },
  { slug: "team-haanpaa-beloit", name: "Team Haanpaa Beloit", location: "Beloit, WI", website: "teamhaanpaa.com", img: "/8U0A2181.jpg" },
  { slug: "madison-wi", name: "Team Curran Madison", location: "Madison, WI", website: "wi-mafc.com", img: "/8U0A2416.jpg" },
  { slug: "cedar-valley", name: "Cedar Valley BJJ", location: "Waterloo, IA", website: "cv-bjj.com", img: "/8U0A2337.jpg" },
  { slug: "gracie-commerce", name: "Gracie Commerce", location: "Commerce, GA", website: "graciecommerce.com", img: "/DM1A9471-3.jpg" },
  { slug: "bushin-martial-arts", name: "Bushin Martial Arts", location: "Richmond, VA", website: "bushinwilliamsburg.com", img: "/DM1A9501.jpg" },
  { slug: "pa-grappling", name: "PA Grappling", location: "Altoona & Bedford, PA", website: "pa-grappling.com", img: "/8U0A2065.jpg" },
  { slug: "open-guard", name: "Open Guard Gym", location: "Oconomowoc, WI", website: "openguardgym.com", img: "/8U0A2181.jpg" },
  { slug: "chattanooga-grappling", name: "Chattanooga Grappling Club", location: "Chattanooga, TN", website: "", img: "/8U0A2416.jpg" },
  { slug: "dekalb-county", name: "DeKalb County BJJ", location: "Hinckley, IL", website: "dekalbcountybjj.com", img: "/8U0A2337.jpg" },
  { slug: "gracie-destin", name: "Gracie Destin", location: "Destin, FL", website: "destinmma.com", img: "/DM1A9471-3.jpg" },
  { slug: "ga-defense-academy", name: "GA Defense Academy", location: "Locust Grove, GA", website: "gadacad.com", img: "/DM1A9501.jpg" },
  { slug: "hosford-bjj", name: "Hosford BJJ", location: "Knoxville, TN", website: "hosfordbjj.com", img: "/8U0A2065.jpg" },
];

export default function AffiliatesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-black min-h-screen">
        {/* Hero */}
        <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/8U0A2416.jpg')" }} />
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-4">TEAM CURRAN NETWORK</p>
            <h1 className="text-5xl sm:text-7xl font-black text-white uppercase leading-none mb-4">
              Our <span className="text-brand">Affiliates</span>
            </h1>
            <div className="w-24 h-1 bg-brand mx-auto mb-6" />
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Team Curran certified schools across the country — sharing the same values, curriculum, and standards of excellence.
            </p>
          </div>
        </section>

        {/* Grid */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-3">CERTIFIED LOCATIONS</p>
              <h2 className="text-4xl font-black text-white uppercase">Find a <span className="text-brand">School</span></h2>
              <div className="w-16 h-1 bg-brand mx-auto mt-6" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {affiliates.map((a) => (
                <Link
                  key={a.slug}
                  href={`/affiliates/${a.slug}`}
                  className="group bg-gray-900 border border-gray-800 hover:border-brand rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/20"
                >
                  <div className="aspect-video overflow-hidden">
                    <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url('${a.img}')` }} />
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-black text-white uppercase mb-1 leading-tight">{a.name}</h3>
                    <p className="text-brand text-xs font-bold tracking-wider uppercase mb-3">{a.location}</p>
                    <span className="text-brand text-xs font-bold uppercase tracking-widest group-hover:underline">VIEW ACADEMY →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why Affiliate */}
        <section className="bg-gray-950 py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-3">WHY TEAM CURRAN</p>
              <h2 className="text-4xl font-black text-white uppercase">THE <span className="text-brand">AFFILIATE ADVANTAGE</span></h2>
              <div className="w-16 h-1 bg-brand mx-auto mt-6" />
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "WORLD-CLASS CURRICULUM", desc: "Access Professor Jeff Curran's proven system — 35+ years of producing champions and black belts.", icon: "🥋" },
                { title: "GLOBAL RECOGNITION", desc: "The Team Curran name carries weight worldwide. Align your school with a respected brand.", icon: "🌎" },
                { title: "DEDICATED SUPPORT", desc: "Ongoing support for curriculum, marketing, operations, and student development.", icon: "🤝" },
                { title: "PEDRO SAUER ASSOCIATION", desc: "Benefit from one of the most respected lineages in the art.", icon: "🏆" },
                { title: "SEMINARS & EVENTS", desc: "Exclusive seminars, camps, and events. Bring Team Curran instructors to your academy.", icon: "📅" },
                { title: "COMMUNITY", desc: "A tight-knit family of affiliate schools who support, compete, and grow together.", icon: "👥" },
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

        {/* CTA */}
        <section className="bg-brand py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase mb-4">WANT TO BECOME AN AFFILIATE?</h2>
            <p className="text-blue-200 mb-8">Join the Team Curran network and build your academy on a foundation of excellence.</p>
            <Link href="/#contact" className="inline-block bg-white text-brand font-black uppercase tracking-widest px-10 py-4 rounded hover:bg-gray-100 transition-colors">
              GET IN TOUCH
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
