import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { discounted } from '@/lib/tc-products'
import { createHostedCheckout } from '@/lib/clover'
import type { CartLine } from '@/app/shop/CartContext'

export async function POST(req: NextRequest) {
  const { lines, fullName, email, shippingMinor } = await req.json() as {
    lines: CartLine[]
    fullName: string
    email: string
    shippingMinor: number
  }

  if (!lines?.length || !fullName || !email) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  // Resolve member discount server-side
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
  } catch {}

  const cloverLineItems = lines.map((line) => {
    const unit = discounted(line.priceMinor, discountPct)
    return {
      name: [line.name, line.colorLabel, `Size ${line.sizeLabel}`].filter(Boolean).join(' · '),
      price: unit,
      unitQty: line.qty,
    }
  })

  if (shippingMinor > 0) {
    cloverLineItems.push({ name: 'Shipping', price: shippingMinor, unitQty: 1 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://teamcurran.com'
  const [firstName, ...rest] = fullName.trim().split(' ')

  try {
    const session = await createHostedCheckout({
      lineItems: cloverLineItems,
      customer: { email: email.toLowerCase(), firstName, lastName: rest.join(' ') || undefined },
      externalReferenceId: `tc-shop-${Date.now()}`,
      successUrl: `${siteUrl}/shop/success`,
      cancelUrl: `${siteUrl}/shop/checkout`,
    })
    return NextResponse.json({ url: session.href })
  } catch (err) {
    console.error('TC shop Clover checkout error:', err)
    return NextResponse.json({ error: 'Could not start checkout. Please try again.' }, { status: 500 })
  }
}
