import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { discounted } from '@/lib/tc-products'
import { createHostedCheckout, isCloverConfigured } from '@/lib/clover'
import type { CartLine } from '@/app/shop/CartContext'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}

export async function POST(req: NextRequest) {
  const { lines, fullName, email, phone, gym, shippingMinor, promoCode, creditCode, shipAddress } = await req.json() as {
    lines: CartLine[]
    fullName: string
    email: string
    phone?: string
    gym?: string
    shippingMinor: number
    promoCode?: string
    creditCode?: string
    shipAddress?: string | null
  }

  if (!lines?.length || !fullName || !email) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  if (!isCloverConfigured()) {
    return NextResponse.json({ error: 'Checkout is not configured.' }, { status: 500 })
  }

  // Promo code — server-side verification
  let discountPct = 0
  let creditMinor = 0
  const upperPromo = promoCode?.toUpperCase()
  const upperCredit = creditCode?.toUpperCase()

  if (upperCredit === 'TIMSULLIVAN50') {
    creditMinor = 5000
  }

  if (upperPromo === 'WHOLESALE30') {
    // Applied after subtotal is known — enforced below
    discountPct = 30
  } else if (upperPromo === 'STAFF30') {
    discountPct = 30
  } else if (upperPromo === 'BFN20') {
    try {
      const bfn = createClient(
        process.env.BFN_SUPABASE_URL!,
        process.env.BFN_SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false, autoRefreshToken: false } }
      )
      const { data: bfnMember } = await bfn
        .from('members')
        .select('status')
        .eq('email', email.toLowerCase())
        .maybeSingle()
      if (bfnMember?.status === 'active') discountPct = 20
    } catch {}
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://teamcurran.com'
  const externalRef = `tc-shop-${Date.now()}`

  const totalQty = lines.reduce((s, l) => s + l.qty, 0)
  function calcShipping(qty: number) {
    if (qty <= 1) return 1000
    if (qty === 2) return 1500
    if (qty <= 5) return 2000
    return 2500
  }
  const computedShipping = shippingMinor > 0 ? calcShipping(totalQty) : 0
  // WHOLESALE30 requires $500 pre-discount subtotal
  const rawSubtotalMinor = lines.reduce((sum, l) => sum + l.priceMinor * l.qty, 0)
  if (upperPromo === 'WHOLESALE30' && rawSubtotalMinor < 50000) {
    return NextResponse.json({ error: 'WHOLESALE30 requires a minimum order of $500.' }, { status: 400 })
  }

  const subtotalAfterPct = lines.reduce((sum, l) => sum + discounted(l.priceMinor, discountPct) * l.qty, 0)
  const subtotalMinor = Math.max(0, subtotalAfterPct - creditMinor)
  const totalMinor = subtotalMinor + computedShipping

  const nameParts = fullName.trim().split(/\s+/)
  const firstName = nameParts[0] ?? ''
  const lastName = nameParts.slice(1).join(' ') || ''

  const cloverLineItems = [
    ...lines.map((line) => ({
      name: [line.name, line.colorLabel, `Size ${line.sizeLabel}`].filter(Boolean).join(' · '),
      price: discounted(line.priceMinor, discountPct),
      unitQty: line.qty,
    })),
    ...(creditMinor > 0 ? [{ name: '$50 Gift Credit', price: -creditMinor, unitQty: 1 }] : []),
    ...(computedShipping > 0 ? [{ name: 'Shipping', price: computedShipping, unitQty: 1 }] : []),
  ]

  try {
    const session = await createHostedCheckout({
      lineItems: cloverLineItems,
      customer: { email: email.toLowerCase(), firstName, lastName },
      externalReferenceId: externalRef,
      successUrl: `${siteUrl}/shop/success?checkoutSessionId={checkoutSessionId}`,
      cancelUrl: `${siteUrl}/shop/checkout`,
    })

    // Save pending order
    try {
      await adminClient().from('tc_shop_orders').insert({
        clover_session_id: session.checkoutSessionId,
        external_ref: externalRef,
        status: 'pending',
        customer_name: fullName,
        customer_email: email.toLowerCase(),
        customer_phone: phone ?? null,
        customer_gym: gym ?? null,
        ship_address: shipAddress ?? null,
        lines: lines.map((l) => ({
          name: [l.name, l.colorLabel, `Size ${l.sizeLabel}`].filter(Boolean).join(' · '),
          price_minor: discounted(l.priceMinor, discountPct),
          qty: l.qty,
        })),
        subtotal_minor: subtotalMinor,
        shipping_minor: computedShipping,
        total_minor: totalMinor,
        discount_pct: discountPct,
        credit_minor: creditMinor,
      })
    } catch (dbErr) {
      console.error('TC shop: failed to save pending order', dbErr)
    }

    return NextResponse.json({ url: session.href })
  } catch (err) {
    console.error('TC shop Clover checkout error:', err)
    return NextResponse.json({ error: 'Could not start checkout. Please try again.' }, { status: 500 })
  }
}
