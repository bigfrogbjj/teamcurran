import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { sendEmail } from '@/lib/brevo'

function fmt(minor: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(minor / 100)
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

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
  const { data: member } = await admin.from('members').select('is_admin').eq('id', user.id).single()
  if (!member?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await req.json() as { id: string }
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { data: order } = await admin.from('tc_shop_orders').select('*').eq('id', id).single()
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  if (!order.customer_email) return NextResponse.json({ error: 'No customer email' }, { status: 400 })

  const lines = order.lines as { name: string; price_minor: number; qty: number }[]
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://teamcurran.com'

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0d0d0d;font-family:Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;padding:32px 16px">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px">

  <tr><td style="background:#111;border-radius:12px 12px 0 0;padding:32px;border-bottom:3px solid #2255d0;text-align:center">
    <img src="https://teamcurran.com/Team%20Curran%20Circle%20Logo.png" alt="Team Curran" width="72" height="72" style="display:block;margin:0 auto 16px;width:72px;height:auto" />
    <h1 style="margin:0;font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:2px;color:#fff">You left something behind</h1>
    <p style="margin:12px 0 0;color:#888;font-size:13px">Hey ${order.customer_name} — your cart is still waiting.</p>
  </td></tr>

  <tr><td style="background:#111;padding:32px">
    <p style="margin:0 0 20px;color:#aaa;font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:bold">Your Cart</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px">
      ${lineRowsHtml(lines)}
      ${(order.shipping_minor as number) > 0
        ? `<tr><td style="padding:8px 16px 8px 0;color:#888;font-size:13px">Shipping</td><td></td><td style="padding:8px 0 8px 16px;text-align:right;color:#888;font-size:13px">${fmt(order.shipping_minor as number)}</td></tr>`
        : `<tr><td style="padding:8px 16px 8px 0;color:#888;font-size:13px">Gym Pickup</td><td></td><td style="padding:8px 0 8px 16px;text-align:right;color:#888;font-size:13px">Free</td></tr>`
      }
      <tr>
        <td style="padding:14px 16px 0 0;font-size:15px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:#fff;border-top:2px solid #2255d0">Total</td>
        <td style="border-top:2px solid #2255d0"></td>
        <td style="padding:14px 0 0 16px;text-align:right;font-size:18px;font-weight:900;color:#fff;border-top:2px solid #2255d0;white-space:nowrap">${fmt(order.total_minor as number)}</td>
      </tr>
    </table>

    <div style="margin-top:28px;text-align:center">
      <a href="${siteUrl}/shop" style="display:inline-block;background:#2255d0;color:#fff;font-size:14px;font-weight:900;text-transform:uppercase;letter-spacing:2px;text-decoration:none;padding:14px 32px;border-radius:8px">Complete Your Order →</a>
    </div>

    <p style="margin:24px 0 0;color:#555;font-size:12px;text-align:center">If you have any questions, reply to this email or reach us at <a href="mailto:info@bigfrogbjj.com" style="color:#2255d0;text-decoration:none">info@bigfrogbjj.com</a></p>
  </td></tr>

  <tr><td style="background:#0a0a0a;border-radius:0 0 12px 12px;padding:24px 32px;text-align:center;border-top:1px solid #1a1a1a">
    <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#444;font-weight:bold">Team Curran Jiu-Jitsu</p>
    <p style="margin:0;color:#333;font-size:11px">Crystal Lake, IL · teamcurran.com</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`

  await sendEmail({
    to: [{ email: order.customer_email as string, name: order.customer_name as string }],
    subject: `You left something in your cart — Team Curran`,
    htmlContent: html,
    senderName: 'Team Curran',
    senderEmail: 'info@bigfrogbjj.com',
  })

  return NextResponse.json({ ok: true, customer: order.customer_name })
}
