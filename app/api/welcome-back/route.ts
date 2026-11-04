import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/brevo'

export async function POST(req: NextRequest) {
  const { name, email, phone, message } = await req.json()

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;background:#f9f9f9;padding:32px 0;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:10px;padding:32px;border:1px solid #e5e7eb;">
    <h2 style="margin:0 0 4px;font-size:20px;color:#111">Returning Member Inquiry</h2>
    <p style="margin:0 0 24px;font-size:13px;color:#888">Submitted via teamcurran.com/welcome-back</p>

    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#555;width:100px">Name</td>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#111;font-weight:600">${name}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#555">Email</td>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#111"><a href="mailto:${email}" style="color:#2255d0">${email}</a></td>
      </tr>
      ${phone ? `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#555">Phone</td>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#111">${phone}</td>
      </tr>` : ''}
      ${message ? `<tr>
        <td style="padding:10px 0;color:#555;vertical-align:top">Note</td>
        <td style="padding:10px 0;color:#111">${message}</td>
      </tr>` : ''}
    </table>

    <div style="margin-top:24px;background:#eff6ff;border-radius:8px;padding:16px;">
      <p style="margin:0;font-size:13px;color:#2255d0;font-weight:600">Offer: $99/mo for first 3 months returning member rate</p>
    </div>
  </div>
</body>
</html>`

  await sendEmail({
    to: [{ email: 'chuck@teamcurran.com', name: 'Chuck' }],
    cc: [{ email: 'jcinvitationalonline@gmail.com', name: 'Alexa' }],
    subject: `Returning Member: ${name} wants to come back`,
    htmlContent: html,
    senderName: 'Team Curran Website',
    senderEmail: 'no-reply@teamcurran.com',
  })

  return NextResponse.json({ ok: true })
}
