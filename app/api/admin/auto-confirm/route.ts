import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Called by a daily cron to confirm any orders still pending after payment.
// Auth: internal secret only (no browser session in cron context).

export async function POST(req: NextRequest) {
  const secret = process.env.INTERNAL_API_SECRET
  if (!secret || req.headers.get('x-internal-secret') !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )

  const { data: pending } = await db
    .from('tc_shop_orders')
    .select('clover_session_id, customer_name, created_at')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  if (!pending || pending.length === 0) {
    return NextResponse.json({ ok: true, confirmed: 0 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://teamcurran.com'
  let confirmed = 0
  const errors: string[] = []

  for (const order of pending) {
    try {
      const res = await fetch(`${siteUrl}/api/shop/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkoutSessionId: order.clover_session_id }),
        cache: 'no-store',
      })
      const data = await res.json()
      if (data.ok) confirmed++
    } catch (err) {
      errors.push(`${order.customer_name}: ${String(err)}`)
    }
  }

  return NextResponse.json({ ok: true, checked: pending.length, confirmed, errors })
}
