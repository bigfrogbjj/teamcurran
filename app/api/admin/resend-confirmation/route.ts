import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

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

  const { id } = await req.json() as { id: string }
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { data: order } = await admin.from('tc_shop_orders').select('*').eq('id', id).maybeSingle()
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  // Mark paid
  await admin.from('tc_shop_orders').update({ status: 'paid', notified_at: new Date().toISOString() }).eq('id', id)

  // Fire confirm flow (skipCloverCheck since admin is manually confirming)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://teamcurran.com'
  await fetch(`${siteUrl}/api/shop/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ checkoutSessionId: order.clover_session_id, skipCloverCheck: true }),
    cache: 'no-store',
  })

  return NextResponse.json({ ok: true, customer: order.customer_name })
}
