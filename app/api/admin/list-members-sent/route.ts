import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SECRET = 'mk_1TcUA7JDBd3pXADf5IhHV8IK'

export async function POST(req: NextRequest) {
  if (req.headers.get('x-internal-secret') !== SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
  const { data, error } = await admin
    .from('members')
    .select('email, full_name')
    .eq('active', true)
    .eq('is_tc_member', true)
    .not('email', 'is', null)
    .order('full_name')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ count: data.length, members: data })
}
