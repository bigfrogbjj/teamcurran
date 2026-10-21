import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { WEEKLY_SCHEDULE, TAG_COLORS } from '../../../lib/class-schedule'
import type { ClassEntry } from '../../../lib/class-schedule'
import React from 'react'

export const metadata = { title: 'Class Schedule · Team Curran Members' }

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default async function SchedulePage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/members/login')

  const { data: member } = await supabase
    .from('members')
    .select('is_tc_member')
    .eq('id', user.id)
    .single()
  if (!member?.is_tc_member) redirect('/members/login')

  const todayIndex = new Date().getDay()

  // Active days (indices with at least one class)
  const activeDays = [1, 2, 3, 4, 5, 6]

  function renderDay(dayIndex: number) {
    const classes = WEEKLY_SCHEDULE[dayIndex] ?? []
    const isToday = dayIndex === todayIndex
    const rows: React.ReactNode[] = []
    let i = 0
    while (i < classes.length) {
      const cls = classes[i]
      if (cls.concurrent && i + 1 < classes.length) {
        const next = classes[i + 1]
        rows.push(
          <div key={i} className="flex items-stretch gap-2">
            <div className="w-14 shrink-0 flex items-center">
              <span className="text-gray-500 text-xs font-bold">{cls.time}</span>
            </div>
            <div className="flex-1 flex gap-2">
              <div className={`flex-1 text-xs font-bold px-3 py-2 rounded-lg border ${TAG_COLORS[cls.tag ?? 'gi']}`}>
                {cls.name}
              </div>
              <div className={`flex-1 text-xs font-bold px-3 py-2 rounded-lg border ${TAG_COLORS[next.tag ?? 'nogi']}`}>
                {next.name}
              </div>
            </div>
          </div>
        )
        i += 2
      } else {
        rows.push(
          <div key={i} className="flex items-center gap-2">
            <div className="w-14 shrink-0">
              <span className="text-gray-500 text-xs font-bold">{cls.time}</span>
            </div>
            <div className={`flex-1 text-xs font-bold px-3 py-2 rounded-lg border ${TAG_COLORS[cls.tag ?? 'gi']}`}>
              {cls.name}
            </div>
          </div>
        )
        i++
      }
    }
    return (
      <div
        key={dayIndex}
        className={`bg-gray-900 border rounded-xl p-4 ${isToday ? 'border-brand/60 ring-1 ring-brand/30' : 'border-gray-800'}`}
      >
        <div className="flex items-center justify-between mb-3">
          <p className={`text-xs font-black uppercase tracking-widest ${isToday ? 'text-brand' : 'text-gray-400'}`}>
            {DAYS[dayIndex]}
          </p>
          {isToday && (
            <span className="text-[10px] font-black uppercase tracking-widest bg-brand/20 text-brand px-2 py-0.5 rounded-full">
              Today
            </span>
          )}
        </div>
        {classes.length === 0 ? (
          <p className="text-gray-600 text-xs italic">No classes</p>
        ) : (
          <div className="space-y-1.5">{rows}</div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-950 border-b border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-brand text-xs font-bold uppercase tracking-widest mb-0.5">Team Curran Members</p>
            <h1 className="text-xl font-black uppercase">Class Schedule</h1>
          </div>
          <Link href="/members" className="text-xs text-gray-400 hover:text-brand transition-colors uppercase tracking-wide">← Portal</Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* Legend */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { tag: 'gi', label: 'Gi' },
            { tag: 'nogi', label: 'NoGi' },
            { tag: 'kids', label: 'Kids' },
            { tag: 'muay-thai', label: 'Muay Thai' },
            { tag: 'open-mat', label: 'Open Mat' },
            { tag: 'womens', label: "Women's" },
          ].map(({ tag, label }) => (
            <span key={tag} className={`text-[11px] font-bold px-3 py-1 rounded-full border ${TAG_COLORS[tag]}`}>
              {label}
            </span>
          ))}
        </div>

        {/* Weekly grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeDays.map(renderDay)}
        </div>

        {/* Notes */}
        <div className="mt-8 bg-gray-950 border border-gray-800 rounded-xl px-5 py-4 space-y-1">
          <p className="text-gray-500 text-xs">* Instructor approval required for advanced classes.</p>
          <p className="text-gray-500 text-xs">** Little Frogs: beginners under 8 years of age.</p>
          <p className="text-gray-500 text-xs">Live training is open to students after each mixed level or advanced class.</p>
        </div>

      </main>
    </div>
  )
}
