import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { TC_PRODUCTS } from '@/lib/tc-products'

async function requireAdmin() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return null
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
  const { data } = await admin.from('admin_users').select('id').eq('supabase_user_id', user.id).maybeSingle()
  return data ? admin : null
}

// GET: return product list merged with DB overrides
export async function GET() {
  const db = await requireAdmin()
  if (!db) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: rows } = await db.from('tc_shop_products').select('*')
  const overrides = new Map((rows ?? []).map((r: Record<string, unknown>) => [r.slug, r]))

  const products = TC_PRODUCTS.map((p) => {
    const ov = overrides.get(p.slug) as Record<string, unknown> | undefined
    return {
      slug: p.slug,
      name: ov?.name ?? p.name,
      price_minor: ov?.price_minor ?? p.priceMinor,
      shipping_minor: ov?.shipping_minor ?? p.shippingMinor,
      preorder_closes_at: ov?.preorder_closes_at ?? null,
      active: ov?.active !== undefined ? ov.active : true,
    }
  })

  return NextResponse.json({ products })
}

// PATCH: upsert a product override
export async function PATCH(req: NextRequest) {
  const db = await requireAdmin()
  if (!db) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug, name, price_minor, shipping_minor, preorder_closes_at, active } = await req.json()
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })

  const known = TC_PRODUCTS.find((p) => p.slug === slug)
  if (!known) return NextResponse.json({ error: 'Unknown product slug' }, { status: 400 })

  const { error } = await db.from('tc_shop_products').upsert(
    {
      slug,
      name: name ?? known.name,
      price_minor: price_minor ?? known.priceMinor,
      shipping_minor: shipping_minor ?? known.shippingMinor,
      preorder_closes_at: preorder_closes_at ?? null,
      active: active !== undefined ? active : true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'slug' }
  )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
