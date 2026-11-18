import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/brevo'

// TEMP: send newsletter test email — remove after use
export async function POST(req: NextRequest) {
  if (req.headers.get('x-internal-secret') !== process.env.INTERNAL_API_SECRET)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { to, subject, htmlContent } = await req.json() as { to: string; subject: string; htmlContent: string }
  if (!to || !htmlContent) return NextResponse.json({ error: 'to and htmlContent required' }, { status: 400 })

  await sendEmail({
    to: [{ email: to }],
    subject: subject || 'Team Curran — November 2026 Newsletter',
    htmlContent,
    senderName: 'Team Curran',
    senderEmail: 'info@bigfrogbjj.com',
  })

  return NextResponse.json({ ok: true })
}
