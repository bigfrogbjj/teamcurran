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

// Cross-reference orders missing emails against TC members table
export async function PATCH(req: NextRequest) {
  if (req.headers.get('x-internal-secret') !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
  // Get orders with missing emails
  const { data: orders } = await db
    .from('tc_shop_orders')
    .select('id, customer_name, customer_email')
    .or('customer_email.is.null,customer_email.eq.')

  if (!orders?.length) return NextResponse.json({ updated: 0 })

  const results: { name: string; email: string | null; found: boolean }[] = []
  for (const order of orders) {
    const nameParts = order.customer_name?.trim().split(/\s+/) ?? []
    if (nameParts.length < 2) { results.push({ name: order.customer_name, email: null, found: false }); continue }

    // Try exact full_name match first, then first+last separately
    const { data: exact } = await db
      .from('members')
      .select('email')
      .ilike('full_name', order.customer_name.trim())
      .maybeSingle()

    let email = exact?.email ?? null

    if (!email) {
      // Try matching first and last name parts anywhere in full_name
      const first = nameParts[0]
      const last = nameParts[nameParts.length - 1]
      const { data: fuzzy } = await db
        .from('members')
        .select('email')
        .ilike('full_name', `%${first}%${last}%`)
        .maybeSingle()
      email = fuzzy?.email ?? null
    }

    if (email) {
      await db.from('tc_shop_orders').update({ customer_email: email }).eq('id', order.id)
    }
    results.push({ name: order.customer_name, email, found: !!email })
  }

  return NextResponse.json({ updated: results.filter((r) => r.found).length, results })
}

// Direct order insert (for backfilling orders from Clover)
export async function POST(req: NextRequest) {
  if (req.headers.get('x-internal-secret') !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
  const order = await req.json()
  const { error } = await db.from('tc_shop_orders').upsert(order, { onConflict: 'clover_session_id' })
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ ok: true })
}
