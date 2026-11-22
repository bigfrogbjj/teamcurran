import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SECRET = 'mk_1TcUA7JDBd3pXADf5IhHV8IK'

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}

export async function POST(req: NextRequest) {
  if (req.headers.get('x-internal-secret') !== SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { action, payload } = await req.json() as { action: string; payload?: Record<string, unknown> }
  const sb = admin()

  if (action === 'delete-events') {
    const { data, error } = await sb.from('tc_events').delete().in('id', payload!.ids as string[]).select()
    return NextResponse.json({ data, error })
  }

  if (action === 'insert-events') {
    const { data, error } = await sb.from('tc_events').insert(payload!.events as object[]).select()
    return NextResponse.json({ data, error })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
