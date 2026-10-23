import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { sendEmail } from '@/lib/brevo'

const TITLE = 'Parking Lot Notice — Tomorrow (Friday)'
const EXCERPT = 'Our side of the parking lot will be sealcoated Friday Oct 24. Parking on the west side or across the street — path open to the building.'
const BODY = `<p>Hey Team Curran,</p>
<p>Just a heads up — they'll be sealcoating our side of the parking lot tomorrow, Friday October 24th.</p>
<p>Parking on the west side of the building or across the street works fine. They'll leave a path open on the west side so you can get onto the patio and into the building without any issues.</p>
<p>Pin striping may happen sometime this weekend as well, so things should be back to normal by next week.</p>
<p>See you on the mat!</p>
<p>— Jeff Curran</p>`

export async function POST() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )

  const { data: adminMember } = await admin.from('members').select('is_admin').eq('id', user.id).single()
  if (!adminMember?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // 1. Insert news post
  const { error: postError } = await admin.from('tc_posts').insert({
    title: TITLE,
    excerpt: EXCERPT,
    body: BODY,
    is_members_only: false,
    published_at: new Date().toISOString(),
  })
  if (postError) return NextResponse.json({ error: `Post insert failed: ${postError.message}` }, { status: 500 })

  // 2. Fetch all active members with an email
  const { data: members, error: membersError } = await admin
    .from('members')
    .select('email, first_name, last_name')
    .eq('status', 'active')
    .not('email', 'is', null)
  if (membersError) return NextResponse.json({ error: `Members fetch failed: ${membersError.message}` }, { status: 500 })

  if (!members || members.length === 0) {
    return NextResponse.json({ ok: true, postCreated: true, emailsSent: 0 })
  }

  // 3. Send email to each active member
  const htmlContent = `
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;background:#000;color:#fff;padding:32px 0;">
  <div style="max-width:560px;margin:0 auto;background:#111;border-radius:12px;padding:32px;">
    <img src="https://teamcurran.com/Team%20Curran%20C%20.png" alt="Team Curran" style="height:48px;margin-bottom:24px;" />
    <h2 style="color:#fff;font-size:22px;margin:0 0 16px;">Parking Lot Notice — Tomorrow (Friday)</h2>
    <p style="color:#ccc;line-height:1.6;">Hey Team Curran,</p>
    <p style="color:#ccc;line-height:1.6;">Just a heads up — they'll be sealcoating our side of the parking lot tomorrow, <strong>Friday October 24th</strong>.</p>
    <p style="color:#ccc;line-height:1.6;">Parking on the west side of the building or across the street works fine. They'll leave a path open on the west side so you can get onto the patio and into the building without any issues.</p>
    <p style="color:#ccc;line-height:1.6;">Pin striping may happen sometime this weekend as well, so things should be back to normal by next week.</p>
    <p style="color:#ccc;line-height:1.6;">See you on the mat!</p>
    <p style="color:#ccc;">— Jeff Curran</p>
    <hr style="border:none;border-top:1px solid #333;margin:24px 0;" />
    <p style="color:#555;font-size:12px;">Team Curran · Crystal Lake, IL · <a href="https://teamcurran.com/members" style="color:#3b82f6;">Members Portal</a></p>
  </div>
</body>
</html>`

  const recipients = members.map((m) => ({
    email: m.email as string,
    name: [m.first_name, m.last_name].filter(Boolean).join(' ') || undefined,
  }))

  // Send in batches of 50 to stay within Brevo rate limits
  const BATCH = 50
  let sent = 0
  for (let i = 0; i < recipients.length; i += BATCH) {
    const batch = recipients.slice(i, i + BATCH)
    await sendEmail({
      to: batch,
      subject: 'Parking Lot Notice — Tomorrow (Friday)',
      htmlContent,
      senderName: 'Team Curran',
      senderEmail: 'no-reply@teamcurran.com',
    })
    sent += batch.length
  }

  return NextResponse.json({ ok: true, postCreated: true, emailsSent: sent })
}
