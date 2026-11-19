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

async function getOrCreateList(name: string): Promise<number> {
  const res = await bf('/contacts/lists?limit=50&offset=0')
  if (res.ok) {
    const data = await res.json() as { lists?: { id: number; name: string }[] }
    const existing = data.lists?.find((l) => l.name === name)
    if (existing) return existing.id
  }
  const createRes = await bf('/contacts/lists', {
    method: 'POST',
    body: JSON.stringify({ name, isVisible: true }),
  })
  const created = await createRes.json() as { id: number }
  return created.id
}

export async function POST(req: NextRequest) {
  if (req.headers.get('x-internal-secret') !== SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { subject, htmlContent } = await req.json() as { subject: string; htmlContent: string }
  if (!subject || !htmlContent) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Get or create the TC Affiliates list
  const listId = await getOrCreateList('TC Affiliates')

  // Create draft campaign
  const res = await bf('/emailCampaigns', {
    method: 'POST',
    body: JSON.stringify({
      name: `TC Affiliate Newsletter - November 2026`,
      subject,
      sender: { name: 'Jeff Curran - Team Curran', email: 'info@bigfrogbjj.com' },
      type: 'classic',
      htmlContent,
      recipients: { listIds: [listId] },
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json({ error: `Brevo error: ${text}` }, { status: 500 })
  }

  const data = await res.json() as { id: number }
  return NextResponse.json({ ok: true, campaignId: data.id, listId, brevoUrl: `https://app.brevo.com/campaign/detail/${data.id}` })
}
