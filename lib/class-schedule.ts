export interface ClassEntry {
  time: string
  name: string
  concurrent?: boolean // shown at same time as the next entry
  tag?: 'gi' | 'nogi' | 'kids' | 'muay-thai' | 'open-mat'
}

// Day index: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
export const WEEKLY_SCHEDULE: Record<number, ClassEntry[]> = {
  0: [], // Sunday — no classes
  1: [ // Monday
    { time: '11am', name: 'Gi – Fundamentals',    tag: 'gi' },
    { time: '12pm', name: 'Gi – Mixed Level',     tag: 'gi' },
    { time: '4:15pm', name: 'Gi – Little Frogs',  tag: 'kids' },
    { time: '5pm',  name: 'Gi – Kids Advanced',   tag: 'kids' },
    { time: '6pm',  name: 'Muay Thai',             tag: 'muay-thai' },
    { time: '7pm',  name: 'NoGi – Fundamentals',  tag: 'nogi' },
    { time: '8pm',  name: 'NoGi – Advanced',      tag: 'nogi' },
  ],
  2: [ // Tuesday — 12pm NoGi runs two concurrent classes
    { time: '11am', name: 'Muay Thai',                          tag: 'muay-thai' },
    { time: '12pm', name: 'NoGi Adult Fundamentals',            tag: 'nogi', concurrent: true },
    { time: '12pm', name: 'NoGi Adult Advanced',                tag: 'nogi' },
    { time: '5pm',  name: 'Gi – Kids All Ages',                 tag: 'kids' },
    { time: '6pm',  name: 'Gi – Fundamentals',                  tag: 'gi' },
    { time: '7pm',  name: 'Gi – Advanced',                      tag: 'gi' },
  ],
  3: [ // Wednesday
    { time: '11am', name: 'Gi – Fundamentals',    tag: 'gi' },
    { time: '12pm', name: 'Gi – Mixed Level',     tag: 'gi' },
    { time: '4:15pm', name: 'Gi – Little Frogs',  tag: 'kids' },
    { time: '5pm',  name: 'NoGi – Kids Advanced', tag: 'kids' },
    { time: '6pm',  name: 'Muay Thai',             tag: 'muay-thai' },
    { time: '7pm',  name: 'NoGi – Fundamentals',  tag: 'nogi' },
    { time: '8pm',  name: 'NoGi – Advanced',      tag: 'nogi' },
  ],
  4: [ // Thursday — 12pm NoGi runs two concurrent classes
    { time: '11am', name: 'Muay Thai',                          tag: 'muay-thai' },
    { time: '12pm', name: 'NoGi Adult Fundamentals',            tag: 'nogi', concurrent: true },
    { time: '12pm', name: 'NoGi Adult Advanced',                tag: 'nogi' },
    { time: '5pm',  name: 'Gi – Kids All Ages',                 tag: 'kids' },
    { time: '6pm',  name: 'Gi – Fundamentals',                  tag: 'gi' },
    { time: '7pm',  name: 'Gi – Advanced',                      tag: 'gi' },
  ],
  5: [ // Friday
    { time: '12pm', name: 'NoGi Open Mat — Visitors Welcome!', tag: 'open-mat' },
  ],
  6: [ // Saturday
    { time: '10am', name: 'Kids NoGi',            tag: 'kids' },
    { time: '11am', name: 'Gi – Fundamentals',    tag: 'gi' },
    { time: '12pm', name: 'Gi – Advanced',        tag: 'gi' },
  ],
}

export function getTodaySchedule(): ClassEntry[] {
  const day = new Date().getDay()
  return WEEKLY_SCHEDULE[day] ?? []
}

export const TAG_COLORS: Record<string, string> = {
  'gi':        'bg-black text-white border-gray-700',
  'nogi':      'bg-brand text-white border-brand',
  'kids':      'bg-sky-500/20 text-sky-300 border-sky-500/40',
  'muay-thai': 'bg-black text-white border-gray-700',
  'open-mat':  'bg-gray-800 text-white border-gray-600',
}
