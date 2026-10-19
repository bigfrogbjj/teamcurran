import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FUNDAMENTALS, MONTHLY_SCHEDULES } from '../../../lib/curriculum-schedule'

export const metadata = { title: 'Curriculum · Team Curran Members' }

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default async function CurriculumPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/members/login')
  const { data: member } = await supabase.from('members').select('is_tc_member').eq('id', user.id).single()
  if (!member?.is_tc_member) redirect('/members/login')

  const today = new Date()
  const todayKey = today.toISOString().split('T')[0]
  const monthKey = todayKey.slice(0, 7)
  const schedule = MONTHLY_SCHEDULES[monthKey] ?? {}

  // Build calendar grid for current month
  const year = today.getFullYear()
  const month = today.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-950 border-b border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-brand text-xs font-bold uppercase tracking-widest mb-0.5">Team Curran Members</p>
            <h1 className="text-xl font-black uppercase">Fundamental Curriculum</h1>
          </div>
          <Link href="/members" className="text-xs text-gray-400 hover:text-brand transition-colors uppercase tracking-wide">← Portal</Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">

        {/* Today's video */}
        {(() => {
          const day = schedule[todayKey]
          if (!day) return null
          if (day.special) return (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <p className="text-brand text-xs font-bold uppercase tracking-widest mb-1">Today</p>
              <p className="text-2xl font-black uppercase">{day.special}</p>
              <p className="text-gray-400 text-sm mt-2">No curriculum video today — come roll!</p>
            </div>
          )
          const vid = day.video!
          return (
            <div className="bg-gray-900 border border-brand/30 rounded-2xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="relative md:w-72 aspect-video md:aspect-auto shrink-0">
                  <Image src={vid.thumb} alt={vid.title} fill className="object-cover" unoptimized />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-black/60 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-center">
                  <p className="text-brand text-xs font-bold uppercase tracking-widest mb-1">Today's Curriculum Video</p>
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Class {String(vid.num).padStart(2,'0')} of 25</p>
                  <h2 className="text-2xl font-black uppercase mb-4">{vid.title}</h2>
                  <a
                    target="_blank" rel="noopener noreferrer" href={`/api/bfn-sso?class=${vid.num}`}
                    className="inline-block bg-brand hover:bg-blue-800 text-white text-sm font-black uppercase tracking-widest px-6 py-3 rounded-lg transition-colors text-center"
                  >
                    Watch Now →
                  </a>
                </div>
              </div>
            </div>
          )
        })()}

        {/* Monthly calendar */}
        <div>
          <p className="text-brand text-xs font-bold uppercase tracking-widest mb-1">Schedule</p>
          <h2 className="text-2xl font-black uppercase mb-6">{MONTHS[month]} {year}</h2>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-bold uppercase tracking-widest text-gray-500 py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells before month start */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1
              const dateKey = `${year}-${String(month+1).padStart(2,'0')}-${String(dayNum).padStart(2,'0')}`
              const day = schedule[dateKey]
              const isToday = dateKey === todayKey
              const isPast = dateKey < todayKey

              return (
                <div
                  key={dayNum}
                  className={`rounded-lg p-1.5 min-h-[72px] flex flex-col ${
                    isToday ? 'bg-brand/20 border border-brand/50' :
                    day ? 'bg-gray-900 border border-gray-800' :
                    'bg-gray-950'
                  } ${isPast && !isToday ? 'opacity-50' : ''}`}
                >
                  <span className={`text-xs font-bold mb-1 ${isToday ? 'text-brand' : 'text-gray-400'}`}>{dayNum}</span>
                  {day?.video && (
                    <a target="_blank" rel="noopener noreferrer" href={`/api/bfn-sso?class=${day.video.num}`} className="flex-1 block">
                      <div className="relative w-full aspect-video rounded overflow-hidden mb-1">
                        <Image src={day.video.thumb} alt={day.video.title} fill className="object-cover" unoptimized />
                      </div>
                      <p className="text-white text-[10px] font-bold leading-tight line-clamp-2">
                        #{day.video.num} {day.video.title}
                      </p>
                    </a>
                  )}
                  {day?.special && (
                    <p className="text-brand text-[10px] font-bold leading-tight">{day.special}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Full curriculum list */}
        <div>
          <p className="text-brand text-xs font-bold uppercase tracking-widest mb-1">Full Curriculum</p>
          <h2 className="text-2xl font-black uppercase mb-6">All 25 Classes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {FUNDAMENTALS.map(vid => (
              <a key={vid.num} target="_blank" rel="noopener noreferrer" href={`/api/bfn-sso?class=${vid.num}`} className="group bg-gray-900 border border-gray-800 hover:border-brand rounded-xl overflow-hidden transition-colors">
                <div className="relative aspect-video">
                  <Image src={vid.thumb} alt={vid.title} fill className="object-cover group-hover:scale-105 transition-transform duration-200" unoptimized />
                  <div className="absolute top-2 left-2 bg-brand text-white text-xs font-black px-2 py-0.5 rounded">
                    {String(vid.num).padStart(2,'0')}
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-white text-sm font-bold leading-snug">{vid.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">Class {vid.num} of 25</p>
                </div>
              </a>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}
