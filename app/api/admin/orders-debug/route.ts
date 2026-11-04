import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  if (req.headers.get('x-internal-secret') !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
  const { data, error } = await db
    .from('tc_shop_orders')
    .select('id, created_at, status, customer_name, customer_email, total_minor, clover_session_id')
    .order('created_at', { ascending: false })
    .limit(50)
  return NextResponse.json({ orders: data ?? [], error })
}

// Also expose a manual confirm trigger
export async function POST(req: NextRequest) {
  if (req.headers.get('x-internal-secret') !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { checkoutSessionId } = await req.json() as { checkoutSessionId?: string }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://teamcurran.com'
  const res = await fetch(`${siteUrl}/api/shop/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ checkoutSessionId }),
  })
  return NextResponse.json(await res.json())
}
