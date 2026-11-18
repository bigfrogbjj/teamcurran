import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/brevo'

const SECRET = 'mk_1TcUA7JDBd3pXADf5IhHV8IK'

export async function POST(req: NextRequest) {
  if (req.headers.get('x-internal-secret') !== SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { to, subject, htmlContent } = await req.json()
  if (!to || !subject || !htmlContent) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  await sendEmail({
    to: [{ email: to }],
    subject,
    htmlContent,
    senderName: 'Team Curran',
    senderEmail: 'info@bigfrogbjj.com',
  })
  return NextResponse.json({ ok: true })
}
