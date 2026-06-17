export default function JoinUs() {
  return (
    <section className="bg-black py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase">
            Be Part of <span className="text-brand">Our Team</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Student */}
          <div className="relative group overflow-hidden rounded-xl min-h-[480px] flex items-end">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: "url('/8U0A2065.jpg')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="relative z-10 p-8 w-full">
              <h3 className="text-3xl sm:text-4xl font-black text-white uppercase mb-3 leading-tight">
                I Want to Be a{" "}
                <span className="text-brand">Student</span>
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-md">
                We believe in Jiu-Jitsu as a tool for continuous growth that transcends the mat
                and improves every area of your life. Start your journey today.
              </p>
              <a
                href="https://teamcurran.sites.zenplanner.com/sign-up-now.cfm" target="_blank" rel="noopener noreferrer"
                className="inline-block border-2 border-white hover:bg-white hover:text-black text-white font-black uppercase tracking-widest px-8 py-3 rounded transition-all text-sm"
              >
                Start Your Trial
              </a>
            </div>
          </div>

          {/* Affiliate */}
          <div className="relative group overflow-hidden rounded-xl min-h-[480px] flex items-end">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: "url('/8U0A2416.jpg')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="relative z-10 p-8 w-full">
              <h3 className="text-3xl sm:text-4xl font-black text-white uppercase mb-3 leading-tight">
                I Want to Be an{" "}
                <span className="text-brand">Affiliate</span>
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-md">
                Join the Team Curran affiliate network. We have a dedicated team focused on
                ensuring the success of each of our affiliate schools worldwide.
              </p>
              <a
                href="/affiliates"
                className="inline-block border-2 border-white hover:bg-white hover:text-black text-white font-black uppercase tracking-widest px-8 py-3 rounded transition-all text-sm"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
