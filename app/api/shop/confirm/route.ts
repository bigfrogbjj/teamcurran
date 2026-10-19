import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/brevo'

const ORDER_NOTIFY_EMAILS = [
  'jcinvitationalonline@gmail.com',
  'bigfrog145@me.com',
]

function fmt(minor: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(minor / 100)
}

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}

export async function POST(req: NextRequest) {
  const { checkoutSessionId } = await req.json() as { checkoutSessionId: string }
  if (!checkoutSessionId) return NextResponse.json({ error: 'Missing checkoutSessionId' }, { status: 400 })

  const db = adminClient()

  // Look up the order
  const { data: order, error } = await db
    .from('tc_shop_orders')
    .select('*')
    .eq('clover_session_id', checkoutSessionId)
    .single()

  if (error || !order) return NextResponse.json({ ok: true }) // unknown session, ignore

  // Idempotent — only mark paid and notify once
  if (order.status === 'paid') return NextResponse.json({ ok: true, already: true })

  await db.from('tc_shop_orders').update({ status: 'paid', notified_at: new Date().toISOString() }).eq('id', order.id)

  // Build line items HTML
  const lines = order.lines as { name: string; price_minor: number; qty: number }[]
  const lineRows = lines
    .map((l) => `<tr><td style="padding:4px 8px 4px 0">${l.name}</td><td style="padding:4px 0;text-align:right">×${l.qty}</td><td style="padding:4px 0 4px 12px;text-align:right">${fmt(l.price_minor * l.qty)}</td></tr>`)
    .join('')

  const discount = order.discount_pct > 0 ? `<p style="color:#4ade80;margin:4px 0">Discount applied: ${order.discount_pct}% off</p>` : ''

  const html = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:12px">
  <h2 style="margin:0 0 4px;font-size:22px;text-transform:uppercase;letter-spacing:1px">New Team Curran Shop Order</h2>
  <p style="color:#888;margin:0 0 24px;font-size:13px">${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'full', timeStyle: 'short' })} CT</p>

  <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
    ${lineRows}
    <tr style="border-top:1px solid #333"><td colspan="2" style="padding:8px 0;color:#888">Shipping</td><td style="padding:8px 0 8px 12px;text-align:right">${fmt(order.shipping_minor)}</td></tr>
    <tr><td colspan="2" style="padding:4px 0;font-weight:bold;font-size:16px">Total</td><td style="padding:4px 0 4px 12px;text-align:right;font-weight:bold;font-size:16px">${fmt(order.total_minor)}</td></tr>
  </table>
  ${discount}

  <div style="background:#111;border-radius:8px;padding:16px;margin-top:16px">
    <p style="margin:0 0 4px;font-weight:bold">${order.customer_name}</p>
    <p style="margin:0;color:#888;font-size:13px">${order.customer_email}</p>
  </div>

  <p style="color:#555;font-size:11px;margin-top:24px">Order ref: ${order.external_ref} · Session: ${checkoutSessionId}</p>
</div>`

  try {
    await sendEmail({
      to: ORDER_NOTIFY_EMAILS.map((e) => ({ email: e })),
      subject: `TC Shop Order — ${order.customer_name} · ${fmt(order.total_minor)}`,
      htmlContent: html,
    })
  } catch (emailErr) {
    console.error('TC shop: failed to send order notification', emailErr)
  }

  return NextResponse.json({ ok: true })
}
