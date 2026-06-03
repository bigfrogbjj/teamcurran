const hours = [
  { day: "Monday – Thursday", time: "10:00 AM – 9:00 PM" },
  { day: "Friday", time: "10:00 AM – 8:00 PM" },
  { day: "Saturday", time: "9:00 AM – 1:00 PM" },
  { day: "Sunday", time: "By Appointment Only" },
];

export default function Schedule() {
  return (
    <section id="schedule" className="bg-gray-950 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-red-500 text-xs font-bold tracking-[0.3em] uppercase mb-3">
            When We Train
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white uppercase">
            Facility <span className="text-red-600">Hours</span>
          </h2>
          <div className="w-16 h-1 bg-red-600 mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start max-w-4xl mx-auto">
          {/* Hours table */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="bg-red-700 px-6 py-4">
              <h3 className="text-white font-black uppercase tracking-widest text-sm">
                Academy Hours
              </h3>
            </div>
            <div className="divide-y divide-gray-800">
              {hours.map((h) => (
                <div key={h.day} className="flex justify-between items-center px-6 py-4">
                  <span className="text-gray-300 font-semibold text-sm">{h.day}</span>
                  <span className="text-red-400 font-bold text-sm">{h.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location card */}
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-red-600/20 rounded-lg p-3 mt-0.5">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold mb-1">Location</p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    102 W Woodstock St<br />
                    Crystal Lake, IL 60014
                  </p>
                  <a
                    href="https://maps.google.com/?q=102+W+Woodstock+St+Crystal+Lake+IL+60014"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-wide mt-2 inline-block"
                  >
                    Get Directions →
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-red-600/20 rounded-lg p-3 mt-0.5">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold mb-1">Phone</p>
                  <a href="tel:8153560454" className="text-gray-400 text-sm hover:text-red-400 transition-colors">
                    (815) 356-0454
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-red-600/20 rounded-lg p-3 mt-0.5">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold mb-1">Email</p>
                  <a href="mailto:chuck@teamcurran.com" className="text-gray-400 text-sm hover:text-red-400 transition-colors">
                    chuck@teamcurran.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
