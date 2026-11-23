import { NextRequest, NextResponse } from 'next/server'

const SECRET = process.env.INTERNAL_API_SECRET
const BREVO_KEY = process.env.BREVO_API_KEY

export async function GET(req: NextRequest) {
  if (req.headers.get('x-internal-secret') !== SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const res = await fetch(`https://api.brevo.com/v3/emailCampaigns/${id}`, {
    headers: { 'api-key': BREVO_KEY! },
  })
  const data = await res.json()
  return NextResponse.json({ name: data.name, subject: data.subject, sender: data.sender, recipients: data.recipients, status: data.status })
}

export async function POST(req: NextRequest) {
  if (req.headers.get('x-internal-secret') !== SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { campaignId, htmlContent, subject, sendTestTo } = await req.json()

  if (!campaignId || !BREVO_KEY) {
    return NextResponse.json({ error: 'Missing config' }, { status: 400 })
  }

  // Update campaign content
  if (htmlContent) {
    const updateRes = await fetch(`https://api.brevo.com/v3/emailCampaigns/${campaignId}`, {
      method: 'PUT',
      headers: { 'api-key': BREVO_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...(subject ? { subject } : {}), htmlContent }),
    })
    if (!updateRes.ok) {
      const err = await updateRes.text()
      return NextResponse.json({ error: 'Brevo update failed', detail: err }, { status: 500 })
    }
  }

  // Send test
  if (sendTestTo?.length) {
    const testRes = await fetch(`https://api.brevo.com/v3/emailCampaigns/${campaignId}/sendTest`, {
      method: 'POST',
      headers: { 'api-key': BREVO_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailTo: sendTestTo }),
    })
    if (!testRes.ok) {
      const err = await testRes.text()
      return NextResponse.json({ error: 'Brevo test send failed', detail: err }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true })
}
