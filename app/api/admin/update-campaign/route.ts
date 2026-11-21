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
  const { campaignId, htmlContent } = await req.json() as { campaignId: number; htmlContent: string }
  if (!campaignId || !htmlContent) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const res = await bf(`/emailCampaigns/${campaignId}`, {
    method: 'PUT',
    body: JSON.stringify({ htmlContent }),
  })
  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json({ error: `Brevo: ${text}` }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
