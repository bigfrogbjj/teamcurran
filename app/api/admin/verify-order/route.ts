import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { getCheckoutStatus } from '@/lib/clover'

export async function POST(req: NextRequest) {
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
  const { data: member } = await admin.from('members').select('is_admin').eq('id', user.id).single()
  if (!member?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { cloverSessionId } = await req.json() as { cloverSessionId: string }
  if (!cloverSessionId) return NextResponse.json({ error: 'Missing cloverSessionId' }, { status: 400 })

  // Check Clover for payment status
  const { paid, state } = await getCheckoutStatus(cloverSessionId)

  if (paid) {
    // Fire the same confirm flow as the success page
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://teamcurran.com'
    await fetch(`${siteUrl}/api/shop/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkoutSessionId: cloverSessionId }),
      cache: 'no-store',
    })
  }

  return NextResponse.json({ paid, state })
}
