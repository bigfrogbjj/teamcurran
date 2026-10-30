import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail, upsertContact, getOrCreateList } from '@/lib/brevo'

const ADMIN_EMAILS = ['bigfrog145@me.com', 'jcinvitationalonline@gmail.com']

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

function lineRowsHtml(lines: { name: string; price_minor: number; qty: number }[]) {
  return lines
    .map(
      (l) =>
        `<tr>
          <td style="padding:10px 16px 10px 0;border-bottom:1px solid #1e1e1e;color:#e5e5e5;font-size:14px">${l.name}</td>
          <td style="padding:10px 0;border-bottom:1px solid #1e1e1e;text-align:center;color:#888;font-size:14px">×${l.qty}</td>
          <td style="padding:10px 0 10px 16px;border-bottom:1px solid #1e1e1e;text-align:right;color:#e5e5e5;font-size:14px;white-space:nowrap">${fmt(l.price_minor * l.qty)}</td>
        </tr>`
    )
    .join('')
}

function customerEmailHtml(order: Record<string, unknown>, sessionId: string) {
  const lines = order.lines as { name: string; price_minor: number; qty: number }[]
  const discount = (order.discount_pct as number) > 0
    ? `<tr><td style="padding:6px 16px 6px 0;color:#4ade80;font-size:13px">BFN20 discount (${order.discount_pct}% off)</td><td></td><td style="padding:6px 0 6px 16px;text-align:right;color:#4ade80;font-size:13px">applied</td></tr>`
    : ''
  const shipping = (order.shipping_minor as number) === 0
    ? `<tr><td style="padding:6px 16px 6px 0;color:#888;font-size:13px">Gym Pickup</td><td></td><td style="padding:6px 0 6px 16px;text-align:right;color:#888;font-size:13px">Free</td></tr>`
    : `<tr><td style="padding:6px 16px 6px 0;color:#888;font-size:13px">Shipping</td><td></td><td style="padding:6px 0 6px 16px;text-align:right;color:#888;font-size:13px">${fmt(order.shipping_minor as number)}</td></tr>`

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0d0d0d;font-family:Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;padding:32px 16px">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px">

  <!-- Header -->
  <tr><td style="background:#111;border-radius:12px 12px 0 0;padding:32px;border-bottom:3px solid #1d4ed8;text-align:center">
    <img src="https://teamcurran.com/Team%20Curran%20Circle%20Logo.png" alt="Team Curran" width="72" height="72" style="display:block;margin:0 auto 16px;border-radius:50%" />
    <h1 style="margin:0;font-size:28px;font-weight:900;text-transform:uppercase;letter-spacing:2px;color:#fff">Order Confirmed</h1>
    <p style="margin:12px 0 0;color:#888;font-size:13px">Thanks for your order, ${order.customer_name}!</p>
  </td></tr>

  <!-- Body -->
  <tr><td style="background:#111;padding:32px">

    <p style="margin:0 0 20px;color:#aaa;font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:bold">Order Summary</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px">
      ${lineRowsHtml(lines)}
      ${discount}
      ${shipping}
      <tr>
        <td style="padding:14px 16px 0 0;font-size:15px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:#fff;border-top:2px solid #1d4ed8">Total</td>
        <td style="border-top:2px solid #1d4ed8"></td>
        <td style="padding:14px 0 0 16px;text-align:right;font-size:18px;font-weight:900;color:#fff;border-top:2px solid #1d4ed8;white-space:nowrap">${fmt(order.total_minor as number)}</td>
      </tr>
    </table>

    <div style="margin-top:28px;background:#0d0d0d;border-radius:8px;padding:20px">
      <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#555;font-weight:bold">Delivery</p>
      <p style="margin:0;color:#e5e5e5;font-size:14px">${(order.shipping_minor as number) === 0 ? 'Gym Pickup · Crystal Lake, IL' : 'Ships to your address'}</p>
    </div>

    <div style="margin-top:16px;background:#0d0d0d;border-radius:8px;padding:20px">
      <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#555;font-weight:bold">Questions?</p>
      <p style="margin:0;color:#e5e5e5;font-size:14px">Reply to this email or reach us at <a href="mailto:chuck@teamcurran.com" style="color:#1d4ed8;text-decoration:none">chuck@teamcurran.com</a></p>
    </div>

  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#0a0a0a;border-radius:0 0 12px 12px;padding:24px 32px;text-align:center;border-top:1px solid #1a1a1a">
    <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#444;font-weight:bold">Team Curran Jiu-Jitsu</p>
    <p style="margin:0;color:#333;font-size:11px">Crystal Lake, IL · teamcurran.com</p>
    <p style="margin:12px 0 0;color:#2a2a2a;font-size:10px">Order ref: ${order.external_ref as string}</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

function adminEmailHtml(order: Record<string, unknown>, sessionId: string) {
  const lines = order.lines as { name: string; price_minor: number; qty: number }[]
  const discount = (order.discount_pct as number) > 0
    ? `<p style="color:#4ade80;margin:4px 0;font-size:13px">BFN20 discount: ${order.discount_pct}% off</p>` : ''

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:24px;background:#0d0d0d;font-family:Arial,Helvetica,sans-serif;color:#e5e5e5">
<div style="max-width:520px;margin:0 auto;background:#111;border-radius:12px;padding:28px;border-top:3px solid #1d4ed8">
  <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#1d4ed8;font-weight:bold">Team Curran Shop</p>
  <h2 style="margin:0 0 20px;font-size:20px;font-weight:900;text-transform:uppercase;color:#fff">New Order — ${fmt(order.total_minor as number)}</h2>

  <div style="background:#0d0d0d;border-radius:8px;padding:16px;margin-bottom:16px">
    <p style="margin:0 0 2px;font-weight:bold;font-size:15px;color:#fff">${order.customer_name}</p>
    <p style="margin:0;color:#888;font-size:13px">${order.customer_email}</p>
    ${order.customer_phone ? `<p style="margin:4px 0 0;color:#888;font-size:13px">${order.customer_phone}</p>` : ''}
    ${order.customer_gym ? `<p style="margin:4px 0 0;color:#888;font-size:13px">Trains at: ${order.customer_gym}</p>` : ''}
    <p style="margin:4px 0 0;color:#888;font-size:13px">${(order.shipping_minor as number) === 0 ? '📍 Gym Pickup' : '📦 Ship to address'}</p>
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px">
    ${lineRowsHtml(lines)}
    <tr><td style="padding:8px 16px 8px 0;color:#888;font-size:13px">Shipping</td><td></td><td style="padding:8px 0 8px 16px;text-align:right;color:#888;font-size:13px">${fmt(order.shipping_minor as number)}</td></tr>
    <tr><td style="padding:8px 16px 8px 0;font-weight:bold;font-size:15px;color:#fff;border-top:1px solid #222">Total</td><td style="border-top:1px solid #222"></td><td style="padding:8px 0 8px 16px;text-align:right;font-weight:bold;font-size:15px;color:#fff;border-top:1px solid #222">${fmt(order.total_minor as number)}</td></tr>
  </table>
  ${discount}

  <p style="margin:16px 0 0;color:#333;font-size:11px">Ref: ${order.external_ref as string} · Session: ${sessionId}</p>
</div>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  const { checkoutSessionId } = await req.json() as { checkoutSessionId: string }
  if (!checkoutSessionId) return NextResponse.json({ error: 'Missing checkoutSessionId' }, { status: 400 })

  const db = adminClient()

  const { data: order, error } = await db
    .from('tc_shop_orders')
    .select('*')
    .eq('clover_session_id', checkoutSessionId)
    .single()

  if (error || !order) return NextResponse.json({ ok: true })

  if (order.status === 'paid') return NextResponse.json({ ok: true, already: true })

  await db.from('tc_shop_orders').update({ status: 'paid', notified_at: new Date().toISOString() }).eq('id', order.id)

  const firstName = (order.customer_name as string).split(' ')[0]

  try {
    // Customer receipt
    await sendEmail({
      to: [{ email: order.customer_email as string, name: order.customer_name as string }],
      subject: `Your Team Curran order is confirmed`,
      htmlContent: customerEmailHtml(order, checkoutSessionId),
      senderName: 'Team Curran',
      senderEmail: 'info@bigfrogbjj.com',
    })
  } catch (err) {
    console.error('TC shop: failed to send customer email', err)
  }

  try {
    // Admin notification
    await sendEmail({
      to: ADMIN_EMAILS.map((e) => ({ email: e })),
      subject: `TC Shop Order — ${order.customer_name} · ${fmt(order.total_minor as number)}`,
      htmlContent: adminEmailHtml(order, checkoutSessionId),
      senderName: 'Team Curran',
      senderEmail: 'info@bigfrogbjj.com',
    })
  } catch (err) {
    console.error('TC shop: failed to send admin notification', err)
  }

  // Add purchaser to Brevo lists (best-effort)
  try {
    const [tcListId, bfnListId] = await Promise.all([
      getOrCreateList('tc-shop-customers'),
      getOrCreateList('BFN Master List'),
    ])
    const nameParts = (order.customer_name as string).split(' ')
    await upsertContact({
      email: order.customer_email as string,
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(' ') || undefined,
      phone: order.customer_phone as string | undefined,
      listIds: [tcListId, bfnListId],
    })
  } catch (err) {
    console.error('TC shop: failed to sync contact to Brevo', err)
  }

  return NextResponse.json({ ok: true })
}
