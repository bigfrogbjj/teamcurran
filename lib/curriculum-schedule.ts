export interface CurriculumVideo {
  num: number
  vimeoId: string
  title: string
  thumb: string
}

export interface DaySchedule {
  video?: CurriculumVideo
  special?: string // e.g. "No Gi Open Mat · 12pm"
}

export const FUNDAMENTALS: CurriculumVideo[] = [
  { num: 1,  vimeoId: '414780173', title: 'Escape the Mount',               thumb: 'https://i.vimeocdn.com/video/888006757-af7098bec58c5b4f7bedf716a0ffcfd21d30d934ad557e6bf1b91b9dce3e3177-d_640x360?&r=pad&region=us' },
  { num: 2,  vimeoId: '414788806', title: 'Clinching',                       thumb: 'https://i.vimeocdn.com/video/888122617-3e4c7385b082a80a7238264b9f37add0511b2934b51731f0d48963d94c989bf2-d_640x360?&r=pad&region=us' },
  { num: 3,  vimeoId: '414802274', title: 'Maintain the Mount',              thumb: 'https://i.vimeocdn.com/video/888039553-7411cbba24341053b1ec2efaeb06f5c4392edcf4bc53382f18787242aff8a5df-d_640x360?&r=pad&region=us' },
  { num: 4,  vimeoId: '414811808', title: 'Head Lock Defense (Standing)',    thumb: 'https://i.vimeocdn.com/video/888049373-f0be126e939f7a701289c18e7b5eb7a99aff2a3643ad07a7cfdb2e8f6d72c791-d_640x360?&r=pad&region=us' },
  { num: 5,  vimeoId: '414819157', title: 'Maintain Crossbody',              thumb: 'https://i.vimeocdn.com/video/888062071-703b6fe095d7381f96a6fbfb2b76eba3bbb4ed2a1d658c033f132a32a3b1fdf9-d_640x360?&r=pad&region=us' },
  { num: 6,  vimeoId: '414841888', title: 'Taking the Mount',                thumb: 'https://i.vimeocdn.com/video/1396744644-7a794c065b88511ab96e1ac7651098ea99d47840672ca216c307412be3d0e092-d_640x360?&r=pad&region=us' },
  { num: 7,  vimeoId: '414857059', title: 'Defensive Guard',                 thumb: 'https://i.vimeocdn.com/video/888122641-d1bf31699e09ece9d4ee8be14c6ddfc7e1f9073fcc84337558fdc103523b7690-d_640x360?&r=pad&region=us' },
  { num: 8,  vimeoId: '414871645', title: 'Guard Attack (Series 1)',         thumb: 'https://i.vimeocdn.com/video/888134232-b012c3532ee33412121dcd290390044279158cd4f124bdff64c9e8b1968316bf-d_640x360?&r=pad&region=us' },
  { num: 9,  vimeoId: '414879991', title: 'Rear Choke Defense (Standing)',   thumb: 'https://i.vimeocdn.com/video/888140466-51a84f5996c87ead2d1df5233e5ee49c532237d69a91c452dc84b0bb95ebdd68-d_640x360?&r=pad&region=us' },
  { num: 10, vimeoId: '417651191', title: 'Basic Takedowns',                 thumb: 'https://i.vimeocdn.com/video/891964217-97bb9e3bfd238e568e33fa02925d4eb3065ad19a8350db4e8f081d4e93ce8d07-d_640x360?&r=pad&region=us' },
  { num: 11, vimeoId: '417659730', title: 'Escape Cross-Side Control',       thumb: 'https://i.vimeocdn.com/video/891983530-1bdbf550555b28d3c4437ff33bb392c8c8a08d4eb4ce53527d2936a89bd562bb-d_640x360?&r=pad&region=us' },
  { num: 12, vimeoId: '417674322', title: 'Headlock Defense (Ground)',       thumb: 'https://i.vimeocdn.com/video/892002473-a24162d81c1808239bff6c26cbf6cb05932d9748def3bff0accfe6041f64e6a9-d_640x360?&r=pad&region=us' },
  { num: 13, vimeoId: '417689155', title: 'Cross-Side Submissions',          thumb: 'https://i.vimeocdn.com/video/892018334-3342e2fdf906b2b24c264be1ade0fc068fa4bdfcb5495c7a9770c4317d5982f0-d_640x360?&r=pad&region=us' },
  { num: 14, vimeoId: '417701256', title: 'Back Control & Submissions',      thumb: 'https://i.vimeocdn.com/video/892039542-4055e3328e22300df75b8e9f949c99b96ec18e5ca7f95362d8ac8f84199efd4b-d_640x360?&r=pad&region=us' },
  { num: 15, vimeoId: '417716957', title: 'Escape the Back',                 thumb: 'https://i.vimeocdn.com/video/892053708-f3a938ff5d7fcc520a9016e60acc7cd08c22b4627b88c82fe3e4cb18e082bd4e-d_640x360?&r=pad&region=us' },
  { num: 16, vimeoId: '417728024', title: 'Guard Attack (Series 2)',         thumb: 'https://i.vimeocdn.com/video/892067190-22b6f47a4574ee363c8bc98babffc0eab972d3c286124a8951a8446139e21196-d_640x360?&r=pad&region=us' },
  { num: 17, vimeoId: '425174238', title: 'Mount Attack (Series 1)',         thumb: 'https://i.vimeocdn.com/video/902537263-fab7e4694a50073e39959c3cc50e94f500935584af3f8bb41ba51ef5acfb5cc9-d_640x360?&r=pad&region=us' },
  { num: 18, vimeoId: '425186250', title: 'Passing the Guard (Closed)',      thumb: 'https://i.vimeocdn.com/video/902561185-a28fd975ed3a3e0d249e64bd81cc3666548aaaedb9116da5f0b911e8b17ee768-d_640x360?&r=pad&region=us' },
  { num: 19, vimeoId: '425201898', title: 'Triangle',                        thumb: 'https://i.vimeocdn.com/video/905108310-0145ffab186fd24365776e7be62ce06e4fbeafa33ed2d6e8459ccda4aca941b1-d_640x360?&r=pad&region=us' },
  { num: 20, vimeoId: '425220842', title: 'Mount Attack (Series 2)',         thumb: 'https://i.vimeocdn.com/video/902608054-6e197aea1822d799a10a69fa09310f8d7c90525b725c1fe88a516bcf0ee0128e-d_640x360?&r=pad&region=us' },
  { num: 21, vimeoId: '420490452', title: 'Guillotine Defense (Standing)',   thumb: 'https://i.vimeocdn.com/video/895761930-d4345831490ec118c27ed250191bc8f7241466e693f1ddd571ebe5493d4ad467-d_640x360?&r=pad&region=us' },
  { num: 22, vimeoId: '424843813', title: 'Sweeps (Kneeling Opponent)',      thumb: 'https://i.vimeocdn.com/video/902035682-e237634d1d8056d9db9d0015401d208673a4daa1a77845ed83b04bba0e39d3ba-d_640x360?&r=pad&region=us' },
  { num: 23, vimeoId: '425317339', title: 'Sweeps (Standing Opponent)',      thumb: 'https://i.vimeocdn.com/video/902768251-70e825dd998445ee41f7b78a6e55dae661bd7b1a5f2a893cac59443a2a1e2ea3-d_640x360?&r=pad&region=us' },
  { num: 24, vimeoId: '426996267', title: 'Guard Attack (Series 3)',         thumb: 'https://i.vimeocdn.com/video/905699970-162c9316407b3d4fdbb21efb87cdf01036da2cd1f8f545ef0cc5ff6c97bdec3a-d_640x360?&r=pad&region=us' },
  { num: 25, vimeoId: '427011286', title: 'Bear Hug Self-Defense',           thumb: 'https://i.vimeocdn.com/video/1376036907-fe13132ea318b0d28bc3e0c6adac72b17a7e5afcd6edbeb19e8d510628793910-d_640x360?&r=pad&region=us' },
]

const v = (n: number) => FUNDAMENTALS[n - 1]
const NOGI = { special: 'No Gi Open Mat · 12pm' }

// October 2026 schedule (from whiteboard). Key = "YYYY-MM-DD"
export const OCTOBER_2026: Record<string, DaySchedule> = {
  '2026-10-01': { video: v(24) },
  '2026-10-02': NOGI,
  '2026-10-03': { video: v(25) },
  '2026-10-05': { video: v(1) },
  '2026-10-06': { video: v(2) },
  '2026-10-07': { video: v(3) },
  '2026-10-08': { video: v(4) },
  '2026-10-09': NOGI,
  '2026-10-10': { video: v(5) },
  '2026-10-12': { video: v(6) },
  '2026-10-13': { video: v(7) },
  '2026-10-14': { video: v(8) },
  '2026-10-15': { video: v(9) },
  '2026-10-16': NOGI,
  '2026-10-17': { video: v(10) },
  '2026-10-19': { video: v(11) },
  '2026-10-20': { video: v(12) },
  '2026-10-21': { video: v(13) },
  '2026-10-22': { video: v(14) },
  '2026-10-23': NOGI,
  '2026-10-24': { video: v(15) },
  '2026-10-26': { video: v(16) },
  '2026-10-27': { video: v(17) },
  '2026-10-28': { video: v(18) },
  '2026-10-29': { video: v(19) },
  '2026-10-30': NOGI,
  '2026-10-31': { video: v(21) },
}

export const MONTHLY_SCHEDULES: Record<string, Record<string, DaySchedule>> = {
  '2026-10': OCTOBER_2026,
}

export function getScheduleForDate(date: Date): DaySchedule | null {
  const key = date.toISOString().split('T')[0]
  const monthKey = key.slice(0, 7)
  return MONTHLY_SCHEDULES[monthKey]?.[key] ?? null
}
