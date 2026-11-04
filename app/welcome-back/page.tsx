'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function WelcomeBackPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/welcome-back', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white" style={{ fontFamily: 'var(--font-oswald), Arial, sans-serif' }}>

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-[#1a2540]">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 to-transparent pointer-events-none" />
        <div className="max-w-2xl mx-auto px-6 pt-16 pb-14 text-center">
          <Link href="/">
            <Image
              src="/Team Curran Circle Logo.png"
              alt="Team Curran"
              width={88}
              height={88}
              className="mx-auto mb-8 w-20 h-20 object-contain"
            />
          </Link>
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-[0.25em] mb-4">
            A Special Offer for Returning Members
          </p>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none mb-5">
            Welcome Back<br />to the Mat
          </h1>
          <p className="text-gray-400 text-base leading-relaxed max-w-lg mx-auto">
            We&apos;ve missed you. Jeff and the whole Team Curran family would love to have you back training with us.
          </p>
        </div>
      </div>

      {/* Offer */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-[#0f1623] border border-blue-900/40 rounded-xl p-8 text-center mb-10">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-[0.2em] mb-3">Returning Member Rate</p>
          <div className="flex items-end justify-center gap-2 mb-2">
            <span className="text-6xl font-black text-white">$99</span>
            <span className="text-gray-400 text-lg mb-2">/mo</span>
          </div>
          <p className="text-gray-400 text-sm mb-1">for your first 3 months back</p>
          <p className="text-gray-600 text-xs">Then regular membership rates apply · No contracts</p>
          <div className="mt-6 pt-6 border-t border-[#1a2540] grid grid-cols-3 gap-4 text-center">
            {[
              ['Gi & NoGi', 'Classes all week'],
              ['Muay Thai', 'Included'],
              ['TeamCurranTV', 'Full access'],
            ].map(([title, sub]) => (
              <div key={title}>
                <p className="text-white text-sm font-bold uppercase tracking-wide">{title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-[#111] rounded-xl p-8 border border-[#1a2540]">
          {status === 'sent' ? (
            <div>
              <div className="text-center py-6">
                <div className="text-4xl mb-4">✓</div>
                <h2 className="text-xl font-black uppercase tracking-wide mb-2">You&apos;re All Set</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Chuck will reach out to you soon to lock in your returning member rate.<br />
                  See you on the mat!
                </p>
              </div>

              {/* Schedule — visual grid matching homepage */}
              <div className="mt-6 pt-6 border-t border-[#1a2540]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400 mb-5">Weekly Class Schedule</p>
                <div className="rounded-xl overflow-hidden border border-gray-800">
                  <div className="overflow-x-auto bg-gray-950">
                    <table className="w-full min-w-[560px] text-xs">
                      <thead>
                        <tr>
                          <th className="w-16" />
                          {['Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                            <th key={d} className="py-3 px-1 text-center">
                              <span className="block bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-1.5 rounded">{d}</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { time: '10am',   Mon: null,                        Tue: null,                    Wed: null,                        Thu: null,              Fri: null,                            Sat: 'Kids NoGi' },
                          { time: '11am',   Mon: 'Gi – Fundamentals',         Tue: 'Muay Thai',             Wed: 'Gi – Fundamentals',         Thu: 'Muay Thai',       Fri: null,                            Sat: 'Gi – Fundamentals' },
                          { time: '12pm',   Mon: 'Gi – Mixed Level',          Tue: 'NoGi – Mixed Level',    Wed: 'Gi – Mixed Level',          Thu: 'NoGi – Mixed Level', Fri: 'NoGi Open Mat\nVisitors Welcome!', Sat: 'Gi – Advanced*' },
                          { time: '4:15pm', Mon: 'Gi – Little Frogs**',       Tue: null,                    Wed: 'Gi – Little Frogs**',       Thu: null,              Fri: null,                            Sat: null },
                          { time: '5pm',    Mon: 'Gi – Kids Advanced*',       Tue: 'Gi – Kids All Ages',    Wed: 'NoGi – Kids Advanced*',     Thu: 'Gi – Kids All Ages', Fri: null,                         Sat: null },
                          { time: '6pm',    Mon: 'Muay Thai',                 Tue: 'Gi – Fundamentals',     Wed: 'Muay Thai',                 Thu: 'Gi – Fundamentals', Fri: null,                          Sat: null },
                          { time: '7–8pm',  Mon: 'NoGi – Fundamentals\n& Advanced*', Tue: 'Gi – Advanced*', Wed: 'NoGi – Fundamentals\n& Advanced*', Thu: 'Gi – Advanced*', Fri: null,                   Sat: null },
                        ].map((row, i) => (
                          <tr key={row.time} className={i % 2 === 0 ? 'bg-black/20' : ''}>
                            <td className="py-2 px-2 text-right align-middle">
                              <span className="inline-block bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded min-w-[48px] text-center">{row.time}</span>
                            </td>
                            {(['Mon','Tue','Wed','Thu','Fri','Sat'] as const).map(d => {
                              const cls = row[d as keyof typeof row] as string | null
                              return (
                                <td key={d} className="py-1.5 px-1 text-center align-middle">
                                  {cls ? (
                                    <div className="bg-white text-gray-900 rounded border border-gray-200 px-1.5 py-1.5 text-[10px] font-bold leading-snug whitespace-pre-line shadow-sm">{cls}</div>
                                  ) : (
                                    <div className="h-8" />
                                  )}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <p className="text-gray-600 text-[10px] mt-3">* Instructor Approval Required &nbsp;·&nbsp; ** Little Frogs: beginners under 8</p>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-black uppercase tracking-wide mb-1">Lock In Your Rate</h2>
              <p className="text-gray-500 text-sm mb-6">
                Fill this out and Chuck will reach out to get you set up with the $99/mo returning member rate.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-[#0d0d0d] border border-[#1a2540] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-600 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full bg-[#0d0d0d] border border-[#1a2540] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-600 transition-colors"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full bg-[#0d0d0d] border border-[#1a2540] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-600 transition-colors"
                    placeholder="(555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Anything you&apos;d like us to know?</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    rows={3}
                    className="w-full bg-[#0d0d0d] border border-[#1a2540] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-600 transition-colors resize-none"
                    placeholder="Questions, kids info, scheduling, etc."
                  />
                </div>
                {status === 'error' && (
                  <p className="text-red-400 text-xs">Something went wrong. Please email chuck@teamcurran.com directly.</p>
                )}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-blue-700 hover:bg-blue-600 disabled:opacity-60 text-white font-bold uppercase tracking-widest text-sm py-4 rounded-lg transition-colors"
                >
                  {status === 'sending' ? 'Sending...' : 'Contact Chuck to Get Started'}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-600 text-xs mt-8">
          Team Curran Jiu-Jitsu · Crystal Lake, IL ·{' '}
          <a href="https://teamcurran.com" className="hover:text-gray-400 transition-colors">teamcurran.com</a>
        </p>
      </div>
    </div>
  )
}
