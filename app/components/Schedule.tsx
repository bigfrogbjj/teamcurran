const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const schedule: Record<string, Partial<Record<string, string>>> = {
  "10am":   { Saturday: "Kids NoGi" },
  "11am":   { Monday: "Gi – Fundamentals", Tuesday: "Muay Thai", Wednesday: "Gi – Fundamentals", Thursday: "Muay Thai", Saturday: "Gi – Fundamentals" },
  "12pm":   { Monday: "Gi – Mixed Level", Tuesday: "NoGi – Mixed Level", Wednesday: "Gi – Mixed Level", Thursday: "NoGi – Mixed Level", Friday: "NoGi Open Mat\nVisitors Welcome!", Saturday: "Gi – Advanced*" },
  "4:15pm": { Monday: "Gi – Little Frogs**", Wednesday: "Gi – Little Frogs**" },
  "5pm":    { Monday: "Gi – Kids Advanced*", Tuesday: "Gi – Kids All Ages", Wednesday: "NoGi – Kids Advanced*", Thursday: "Gi – Kids All Ages" },
  "6pm":    { Monday: "Muay Thai", Tuesday: "Gi – Fundamentals", Wednesday: "Muay Thai", Thursday: "Gi – Fundamentals" },
  "7pm":    { Monday: "NoGi – Mixed Level", Tuesday: "Gi – Advanced*", Wednesday: "NoGi – Mixed Level", Thursday: "Gi – Advanced*" },
};

const times = Object.keys(schedule);

const hours = [
  { day: "Monday & Wednesday", time: "10:30 AM – 2:00 PM · 3:45 PM – 9:00 PM" },
  { day: "Thursday", time: "10:30 AM – 2:00 PM · 4:30 PM – 9:00 PM" },
  { day: "Friday", time: "11:30 AM – 2:00 PM" },
  { day: "Saturday", time: "9:30 AM – 2:00 PM" },
];

export default function Schedule() {
  return (
    <section id="schedule" className="bg-black py-24 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-blue-400 text-xs font-bold tracking-[0.3em] uppercase mb-3">
            When We Train
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white uppercase">
            Class <span className="text-blue-500">Schedule</span>
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto mt-6" />
        </div>

        {/* Schedule card with logo watermark */}
        <div className="relative rounded-2xl overflow-hidden border border-gray-800 mb-10">
          {/* Logo watermark */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            aria-hidden="true"
          >
            <div className="w-80 h-80 opacity-[0.04] bg-[url('https://placehold.co/320x320/ffffff/ffffff?text=')] rounded-full border-[24px] border-white" />
          </div>

          <div className="relative bg-gray-950/95 overflow-x-auto">
            <table className="w-full min-w-[700px]">
              {/* Day headers */}
              <thead>
                <tr>
                  <th className="w-20" />
                  {days.map((d) => (
                    <th key={d} className="py-4 px-2 text-center">
                      <span className="block bg-blue-600 text-white text-xs font-black uppercase tracking-wider px-3 py-2 rounded">
                        {d}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {times.map((time, i) => (
                  <tr key={time} className={i % 2 === 0 ? "bg-black/20" : ""}>
                    {/* Time cell */}
                    <td className="py-3 px-3 text-right align-middle">
                      <span className="inline-block bg-blue-600 text-white text-xs font-black px-3 py-1.5 rounded min-w-[56px] text-center">
                        {time}
                      </span>
                    </td>

                    {/* Class cells */}
                    {days.map((day) => {
                      const cls = schedule[time][day];
                      return (
                        <td key={day} className="py-2 px-2 text-center align-middle">
                          {cls ? (
                            <div className="bg-white text-gray-900 rounded border border-gray-200 px-2 py-2 text-xs font-bold leading-snug whitespace-pre-line shadow-sm">
                              {cls}
                            </div>
                          ) : (
                            <div className="h-10" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col sm:flex-row gap-2 justify-center text-center text-gray-400 text-xs mb-16 flex-wrap">
          <span>Live training is open to students after each mixed level or advanced class.</span>
          <span className="hidden sm:block text-gray-700">·</span>
          <span>* Instructor Approval Required</span>
          <span className="hidden sm:block text-gray-700">·</span>
          <span>** Little Frogs: beginners under 8 years of age</span>
        </div>

        {/* Hours + Location */}
        <div className="grid md:grid-cols-2 gap-12 items-start max-w-4xl mx-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="bg-blue-700 px-6 py-4">
              <h3 className="text-white font-black uppercase tracking-widest text-sm">Facility Hours</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {hours.map((h) => (
                <div key={h.day} className="flex justify-between items-center px-6 py-4">
                  <span className="text-gray-300 font-semibold text-sm">{h.day}</span>
                  <span className="text-blue-400 font-bold text-sm">{h.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600/20 rounded-lg p-3 mt-0.5">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold mb-1">Location</p>
                  <p className="text-gray-400 text-sm leading-relaxed">102 W Woodstock St<br />Crystal Lake, IL 60014</p>
                  <a href="https://maps.google.com/?q=102+W+Woodstock+St+Crystal+Lake+IL+60014" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-xs font-bold uppercase tracking-wide mt-2 inline-block">
                    Get Directions →
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600/20 rounded-lg p-3 mt-0.5">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold mb-1">Phone</p>
                  <a href="tel:8153560454" className="text-gray-400 text-sm hover:text-blue-400 transition-colors">(815) 356-0454</a>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600/20 rounded-lg p-3 mt-0.5">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold mb-1">Email</p>
                  <a href="mailto:chuck@teamcurran.com" className="text-gray-400 text-sm hover:text-blue-400 transition-colors">chuck@teamcurran.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
