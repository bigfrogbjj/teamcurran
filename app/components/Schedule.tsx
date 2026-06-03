const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const schedule: Record<string, Partial<Record<string, string>>> = {
  "10am":    { Saturday: "Kids NoGi" },
  "11am":    { Monday: "Gi – Fundamentals", Tuesday: "Muay Thai", Wednesday: "Gi – Fundamentals", Thursday: "Muay Thai", Saturday: "Gi – Fundamentals" },
  "12pm":    { Monday: "Gi – Mixed Level", Tuesday: "NoGi – Mixed Level", Wednesday: "Gi – Mixed Level", Thursday: "NoGi – Mixed Level", Friday: "NoGi Open Mat\nVisitors Welcome!", Saturday: "Gi – Advanced*" },
  "4:15pm":  { Monday: "Gi – Little Frogs**", Wednesday: "Gi – Little Frogs**" },
  "5pm":     { Monday: "Gi – Kids Advanced*", Tuesday: "Gi – Kids All Ages", Wednesday: "NoGi – Kids Advanced*", Thursday: "Gi – Kids All Ages" },
  "6pm":     { Monday: "Muay Thai", Tuesday: "Gi – Fundamentals", Wednesday: "Muay Thai", Thursday: "Gi – Fundamentals" },
  "7pm":     { Monday: "NoGi – Mixed Level", Tuesday: "Gi – Advanced*", Wednesday: "NoGi – Mixed Level", Thursday: "Gi – Advanced*" },
};

const times = Object.keys(schedule);

const hours = [
  { day: "Monday – Thursday", time: "10:00 AM – 9:00 PM" },
  { day: "Friday", time: "10:00 AM – 8:00 PM" },
  { day: "Saturday", time: "9:00 AM – 1:00 PM" },
  { day: "Sunday", time: "By Appointment Only" },
];

function classColor(cls: string) {
  if (cls.includes("Muay Thai")) return "bg-orange-900/40 border-orange-700/50 text-orange-300";
  if (cls.includes("NoGi") || cls.includes("Open Mat")) return "bg-blue-900/40 border-blue-700/50 text-blue-300";
  if (cls.includes("Kids") || cls.includes("Frogs")) return "bg-green-900/40 border-green-700/50 text-green-300";
  return "bg-red-900/30 border-red-800/50 text-red-300";
}

export default function Schedule() {
  return (
    <section id="schedule" className="bg-gray-950 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-red-500 text-xs font-bold tracking-[0.3em] uppercase mb-3">
            When We Train
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white uppercase">
            Class <span className="text-red-600">Schedule</span>
          </h2>
          <div className="w-16 h-1 bg-red-600 mx-auto mt-6" />
        </div>

        {/* Schedule grid — scrollable on mobile */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr>
                <th className="w-16 py-3 pr-4 text-left text-gray-500 font-bold text-xs uppercase tracking-widest" />
                {days.map((d) => (
                  <th key={d} className="py-3 px-2 text-center">
                    <span className="bg-red-700 text-white text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded">
                      {d}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {times.map((time) => (
                <tr key={time} className="border-t border-gray-800/50">
                  <td className="py-3 pr-4 text-right">
                    <span className="bg-gray-800 text-red-400 text-xs font-black px-2 py-1 rounded whitespace-nowrap">
                      {time}
                    </span>
                  </td>
                  {days.map((day) => {
                    const cls = schedule[time][day];
                    return (
                      <td key={day} className="py-2 px-2 text-center align-middle">
                        {cls ? (
                          <div className={`border rounded px-2 py-1.5 text-xs font-semibold leading-tight whitespace-pre-line ${classColor(cls)}`}>
                            {cls}
                          </div>
                        ) : (
                          <div className="h-8" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 justify-center mb-14 text-xs">
          {[
            { color: "bg-red-900/40 border-red-800/50 text-red-300", label: "Gi BJJ" },
            { color: "bg-blue-900/40 border-blue-700/50 text-blue-300", label: "NoGi BJJ" },
            { color: "bg-orange-900/40 border-orange-700/50 text-orange-300", label: "Muay Thai" },
            { color: "bg-green-900/40 border-green-700/50 text-green-300", label: "Kids" },
          ].map((l) => (
            <span key={l.label} className={`border rounded px-3 py-1 font-semibold ${l.color}`}>
              {l.label}
            </span>
          ))}
        </div>

        {/* Notes */}
        <div className="text-center text-gray-500 text-xs space-y-1 mb-16">
          <p>Live training is open to students after each mixed level or advanced class.</p>
          <p>* Instructor Approval Required &nbsp;|&nbsp; ** Little Frogs: beginners under 8 years of age</p>
        </div>

        {/* Hours + Location */}
        <div className="grid md:grid-cols-2 gap-12 items-start max-w-4xl mx-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="bg-red-700 px-6 py-4">
              <h3 className="text-white font-black uppercase tracking-widest text-sm">Facility Hours</h3>
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
                  <p className="text-gray-400 text-sm leading-relaxed">102 W Woodstock St<br />Crystal Lake, IL 60014</p>
                  <a href="https://maps.google.com/?q=102+W+Woodstock+St+Crystal+Lake+IL+60014" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-wide mt-2 inline-block">
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
                  <a href="tel:8153560454" className="text-gray-400 text-sm hover:text-red-400 transition-colors">(815) 356-0454</a>
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
                  <a href="mailto:chuck@teamcurran.com" className="text-gray-400 text-sm hover:text-red-400 transition-colors">chuck@teamcurran.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
