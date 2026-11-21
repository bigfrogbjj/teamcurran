import { NextRequest, NextResponse } from 'next/server'

const SECRET = 'mk_1TcUA7JDBd3pXADf5IhHV8IK'
const BREVO_API = 'https://api.brevo.com/v3'

function bf(path: string, init?: RequestInit) {
  return fetch(`${BREVO_API}${path}`, {
    ...init,
    headers: {
      'api-key': process.env.BREVO_API_KEY as string,
      accept: 'application/json',
      'content-type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
}

export async function POST(req: NextRequest) {
  if (req.headers.get('x-internal-secret') !== SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { action, campaignId, htmlContent, subject } = await req.json() as {
    action: string; campaignId?: number; htmlContent?: string; subject?: string
  }

  if (action === 'lists') {
    const res = await bf('/contacts/lists?limit=50&offset=0')
    const data = await res.json()
    return NextResponse.json(data)
  }

  if (action === 'update-campaign') {
    const body: Record<string, unknown> = { htmlContent }
    if (subject) body.subject = subject
    const res = await bf(`/emailCampaigns/${campaignId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: `Brevo: ${text}` }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
