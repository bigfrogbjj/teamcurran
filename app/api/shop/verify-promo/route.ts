import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const { code, email } = await req.json() as { code?: string; email?: string }
  if (!code || !email) {
    return NextResponse.json({ valid: false, error: 'Missing code or email.' })
  }

  const upper = code.toUpperCase()

  if (upper === 'WHOLESALE30') {
    return NextResponse.json({ valid: true, discountPct: 30, minOrderMinor: 50000 })
  }

  if (upper === 'STAFF30') {
    return NextResponse.json({ valid: true, discountPct: 30 })
  }

  if (upper === 'TIMSULLIVAN50') {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )
    const { data: used } = await sb
      .from('tc_shop_orders')
      .select('id')
      .eq('credit_code', 'TIMSULLIVAN50')
      .eq('status', 'paid')
      .maybeSingle()
    if (used) {
      return NextResponse.json({ valid: false, error: 'This gift credit has already been used.' })
    }
    return NextResponse.json({ valid: true, creditMinor: 5000 })
  }

  if (upper !== 'BFN20') {
    return NextResponse.json({ valid: false, error: 'Invalid promo code.' })
  }

  const bfn = createClient(
    process.env.BFN_SUPABASE_URL!,
    process.env.BFN_SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )

  const { data: member } = await bfn
    .from('members')
    .select('status')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle()

  if (!member || member.status !== 'active') {
    return NextResponse.json({ valid: false, error: 'BFN20 is for Big Frog Nation All Access members only.' })
  }

  return NextResponse.json({ valid: true, discountPct: 20 })
}
