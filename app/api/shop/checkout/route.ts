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
  const { lines, fullName, email, phone, gym, shippingMinor, promoCode } = await req.json() as {
    lines: CartLine[]
    fullName: string
    email: string
    phone?: string
    gym?: string
    shippingMinor: number
    promoCode?: string
  }

  if (!lines?.length || !fullName || !email) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  if (!isCloverConfigured()) {
    return NextResponse.json({ error: 'Checkout is not configured.' }, { status: 500 })
  }

  // Promo code — server-side verification
  let discountPct = 0
  if (promoCode?.toUpperCase() === 'BFN20') {
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

  const subtotalMinor = lines.reduce((sum, l) => sum + discounted(l.priceMinor, discountPct) * l.qty, 0)
  const totalMinor = subtotalMinor + (shippingMinor ?? 0)

  const nameParts = fullName.trim().split(/\s+/)
  const firstName = nameParts[0] ?? ''
  const lastName = nameParts.slice(1).join(' ') || ''

  const cloverLineItems = [
    ...lines.map((line) => ({
      name: [line.name, line.colorLabel, `Size ${line.sizeLabel}`].filter(Boolean).join(' · '),
      price: discounted(line.priceMinor, discountPct),
      unitQty: line.qty,
    })),
    ...(shippingMinor > 0 ? [{ name: 'Shipping', price: shippingMinor, unitQty: 1 }] : []),
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
        lines: lines.map((l) => ({
          name: [l.name, l.colorLabel, `Size ${l.sizeLabel}`].filter(Boolean).join(' · '),
          price_minor: discounted(l.priceMinor, discountPct),
          qty: l.qty,
        })),
        subtotal_minor: subtotalMinor,
        shipping_minor: shippingMinor ?? 0,
        total_minor: totalMinor,
        discount_pct: discountPct,
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
