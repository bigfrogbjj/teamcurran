import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  if (req.headers.get('x-internal-secret') !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { emails } = await req.json() as { emails: string[] }

  const bfnAdmin = createClient(
    process.env.BFN_SUPABASE_URL!,
    process.env.BFN_SUPABASE_SERVICE_ROLE_KEY!
  )

  const results: Record<string, { tier: string; status: string; gym_tchq_access_until: string } | null> = {}
  for (const email of emails) {
    const { data } = await bfnAdmin
      .from('members')
      .select('email, tier, status, gym_tchq_access_until')
      .ilike('email', email.trim())
      .maybeSingle()
    results[email] = data ?? null
  }

  return NextResponse.json(results)
}
