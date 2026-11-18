import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

  const { data: products } = await db.from('tc_shop_products').select('slug, name, preorder_closes_at')

  const { error } = await db
    .from('tc_shop_products')
    .update({ preorder_closes_at: '2026-11-26T23:59:59Z' })
    .neq('slug', '')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, updated: products?.length ?? 0, products: products?.map(p => p.name) })
}
