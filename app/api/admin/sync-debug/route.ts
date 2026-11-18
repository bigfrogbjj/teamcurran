import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// TEMP: internal-secret debug endpoint for sync verification — remove after use
export async function GET(req: NextRequest) {
  if (req.headers.get('x-internal-secret') !== process.env.INTERNAL_API_SECRET)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  // Recent members ordered by creation date
  const { data: recent, error: recentErr } = await admin
    .from('members')
    .select('id, email, full_name, active, is_tc_member, welcome_sent, is_admin, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  // Count totals
  const { data: all, error: allErr } = await admin
    .from('members')
    .select('active, is_admin, welcome_sent, is_tc_member')

  const summary = {
    total: all?.length ?? 0,
    active: all?.filter(m => m.active).length ?? 0,
    inactive: all?.filter(m => !m.active).length ?? 0,
    admins: all?.filter(m => m.is_admin).length ?? 0,
    tc_members: all?.filter(m => m.is_tc_member).length ?? 0,
    welcome_sent: all?.filter(m => m.welcome_sent).length ?? 0,
    welcome_not_sent: all?.filter(m => !m.welcome_sent).length ?? 0,
  }

  return NextResponse.json({ summary, recent, errors: { recentErr, allErr } })
}
