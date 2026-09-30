import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { TC_PRODUCTS, discounted } from '@/lib/tc-products'
import { createHostedCheckout } from '@/lib/clover'

export async function POST(req: NextRequest) {
  const { slug, sku, qty = 1, fullName, email, customName, customRank } = await req.json()

  if (!slug || !sku || !fullName || !email) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  const product = TC_PRODUCTS.find((p) => p.slug === slug)
  if (!product) return NextResponse.json({ error: 'Product not found.' }, { status: 404 })

  const variant = product.variants.find((v) => v.sku === sku)
  if (!variant) return NextResponse.json({ error: 'Size not available.' }, { status: 404 })

  // Resolve member discount server-side — never trust client-sent prices.
  let discountPct = 0
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    )
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.email) {
      const admin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false, autoRefreshToken: false } }
      )
      const { data: member } = await admin
        .from('members')
        .select('status')
        .eq('email', user.email.toLowerCase())
        .maybeSingle()
      if (member?.status === 'active') discountPct = 5
    }
  } catch {
    // Non-fatal; proceed at list price.
  }

  const hasCustom = Boolean(product.customization?.enabled && (customName || customRank))
  const customFee = hasCustom ? (product.customization?.feeMinor ?? 0) : 0
  const listUnit = product.priceMinor + customFee
  const unit = discounted(listUnit, discountPct)
  const safeQty = Math.max(1, Math.min(10, Number(qty)))

  const lineItems = [
    {
      name: [
        product.name,
        `Size: ${variant.label}`,
        customName ? `Name: ${customName}` : null,
        customRank ? `Rank: ${customRank}` : null,
      ]
        .filter(Boolean)
        .join(' · '),
      price: unit,
      unitQty: safeQty,
    },
  ]
  if (product.shippingMinor > 0) {
    lineItems.push({ name: 'Shipping', price: product.shippingMinor, unitQty: 1 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://teamcurran.com'
  const [firstName, ...rest] = fullName.trim().split(' ')

  try {
    const session = await createHostedCheckout({
      lineItems,
      customer: { email: email.toLowerCase(), firstName, lastName: rest.join(' ') || undefined },
      externalReferenceId: `tc-shop-${slug}-${Date.now()}`,
      successUrl: `${siteUrl}/shop/success?product=${encodeURIComponent(product.name)}&size=${encodeURIComponent(variant.label)}`,
      cancelUrl: `${siteUrl}/shop/${slug}`,
    })
    return NextResponse.json({ url: session.href })
  } catch (err) {
    console.error('TC shop Clover checkout error:', err)
    return NextResponse.json({ error: 'Could not start checkout. Please try again.' }, { status: 500 })
  }
}
