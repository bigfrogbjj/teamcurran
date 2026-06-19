"use client";

import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Wire to a form backend (e.g. Formspree, Resend) here
    setSubmitted(true);
  };

  return (
    <section id="contact" className="bg-black py-24 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-3">
            Get In Touch
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white uppercase">
            Start Your <span className="text-brand">Journey</span>
          </h2>
          <div className="w-16 h-1 bg-brand mx-auto mt-6" />
          <p className="text-gray-400 mt-6 max-w-xl mx-auto">
            Ready to take that first step? Reach out and we&apos;ll get you set up with a free
            intro class or answer any questions you have.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          {submitted ? (
            <div className="bg-green-900/30 border border-green-700 rounded-xl p-10 text-center">
              <div className="text-5xl mb-4">✓</div>
              <h3 className="text-2xl font-black text-white mb-2">Message Sent!</h3>
              <p className="text-gray-400">
                We&apos;ll be in touch soon. Welcome to the Team Curran family!
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-gray-900 border border-gray-800 rounded-xl p-8 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="First & Last Name"
                    className="w-full bg-gray-800 border border-gray-700 focus:border-brand text-white placeholder-gray-600 rounded px-4 py-3 text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-1.5">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="(555) 555-5555"
                    className="w-full bg-gray-800 border border-gray-700 focus:border-brand text-white placeholder-gray-600 rounded px-4 py-3 text-sm outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full bg-gray-800 border border-gray-700 focus:border-brand text-white placeholder-gray-600 rounded px-4 py-3 text-sm outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-1.5">
                  How Can We Help?
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your goals or ask us anything..."
                  className="w-full bg-gray-800 border border-gray-700 focus:border-brand text-white placeholder-gray-600 rounded px-4 py-3 text-sm outline-none transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-brand hover:bg-blue-800 text-white font-black uppercase tracking-widest py-4 rounded text-sm transition-colors shadow-lg shadow-blue-900/40"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
