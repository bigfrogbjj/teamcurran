import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail, upsertContact, getOrCreateList } from '@/lib/brevo'

const SECRET = 'mk_1TcUA7JDBd3pXADf5IhHV8IK'

export const maxDuration = 300

export async function POST(req: NextRequest) {
  if (req.headers.get('x-internal-secret') !== SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { subject, htmlContent } = await req.json() as { subject: string; htmlContent: string }
  if (!subject || !htmlContent) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )

  const { data: members, error } = await admin
    .from('members')
    .select('email, full_name')
    .eq('active', true)
    .eq('is_tc_member', true)
    .not('email', 'is', null)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!members?.length) return NextResponse.json({ ok: true, sent: 0 })

  // Sync to Brevo list
  const listId = await getOrCreateList('Team Curran Members')
  for (const m of members) {
    const parts = (m.full_name ?? '').trim().split(/\s+/)
    await upsertContact({
      email: m.email,
      firstName: parts[0],
      lastName: parts.slice(1).join(' ') || undefined,
      listIds: [listId],
    }).catch(() => {})
  }

  // Send in batches of 50
  const BATCH = 50
  let sent = 0
  for (let i = 0; i < members.length; i += BATCH) {
    const batch = members.slice(i, i + BATCH).map((m) => ({ email: m.email as string }))
    await sendEmail({
      to: batch,
      subject,
      htmlContent,
      senderName: 'Team Curran',
      senderEmail: 'info@bigfrogbjj.com',
    })
    sent += batch.length
  }

  return NextResponse.json({ ok: true, sent, listSynced: members.length })
}
