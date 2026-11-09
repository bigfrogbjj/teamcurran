import { NextRequest, NextResponse } from 'next/server'

// Clover webhook: fires server-side when a hosted checkout session is paid.
// Register this URL in Clover Dashboard → Developers → Webhooks:
//   https://teamcurran.com/api/shop/webhook
// Events to subscribe: PAYMENT (or CHECKOUT)
//
// Clover sends: { merchantId, type, appId, time, objectId }
// objectId for a PAYMENT event is the paymentId — we look up the checkout session via externalReferenceId.
// For a CHECKOUT event, objectId is the checkoutSessionId directly.

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const eventType = (body.type as string | undefined)?.toUpperCase()
  const objectId = body.objectId as string | undefined

  if (!objectId) {
    return NextResponse.json({ ok: true, skipped: 'no objectId' })
  }

  // We handle PAYMENT and CHECKOUT event types.
  // For either, we look up the matching tc_shop_order by clover_session_id or external_ref.
  if (!eventType || !['PAYMENT', 'CHECKOUT', 'INVOICINGCHECKOUT'].some(t => eventType.includes(t))) {
    return NextResponse.json({ ok: true, skipped: `unhandled event type: ${eventType}` })
  }

  // Clover checkout events include the checkoutSessionId as objectId.
  // We fire our existing confirm flow which is idempotent (skips if already paid).
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://teamcurran.com'

  try {
    // First try objectId as a checkoutSessionId directly
    const confirmRes = await fetch(`${siteUrl}/api/shop/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkoutSessionId: objectId }),
      cache: 'no-store',
    })
    const result = await confirmRes.json()

    // If confirm found and processed the order, we're done
    if (result.ok && !result.skipped) {
      return NextResponse.json({ ok: true, confirmed: objectId })
    }

    // If not found by session id, try looking up by external_ref (payment event case)
    const { createClient } = await import('@supabase/supabase-js')
    const db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )

    const { data: order } = await db
      .from('tc_shop_orders')
      .select('clover_session_id')
      .eq('external_ref', objectId)
      .single()

    if (order?.clover_session_id) {
      await fetch(`${siteUrl}/api/shop/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkoutSessionId: order.clover_session_id }),
        cache: 'no-store',
      })
    }
  } catch (err) {
    console.error('Clover webhook error:', err)
    // Return 200 so Clover doesn't retry endlessly
  }

  return NextResponse.json({ ok: true })
}
