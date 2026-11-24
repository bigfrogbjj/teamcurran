import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const BREVO_KEY = process.env.BREVO_API_KEY

function tcDb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}

// GET: list Brevo contact lists
export async function GET(req: NextRequest) {
  if (req.headers.get('x-internal-secret') !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const res = await fetch('https://api.brevo.com/v3/contacts/lists?limit=50', {
    headers: { 'api-key': BREVO_KEY! },
  })
  const data = await res.json()
  return NextResponse.json(data)
}

// POST: add contacts from TC DB (by status) to a Brevo list
export async function POST(req: NextRequest) {
  if (req.headers.get('x-internal-secret') !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { listId, statuses } = await req.json() as { listId: number; statuses: string[] }

  const db = tcDb()
  const { data: members, error } = await db
    .from('members')
    .select('email, full_name, status')
    .in('status', statuses)
    .not('email', 'is', null)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!members?.length) return NextResponse.json({ ok: true, added: 0, contacts: [] })

  const emails = members.map((m) => m.email.toLowerCase().trim()).filter(Boolean)

  // Brevo batch import
  const importRes = await fetch('https://api.brevo.com/v3/contacts/import', {
    method: 'POST',
    headers: { 'api-key': BREVO_KEY!, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      listIds: [listId],
      updateEnabled: true,
      jsonBody: members.map((m) => ({
        email: m.email.toLowerCase().trim(),
        attributes: { FIRSTNAME: m.full_name?.split(' ')[0] ?? '', LASTNAME: m.full_name?.split(' ').slice(1).join(' ') ?? '' },
      })),
    }),
  })

  const importData = await importRes.json()
  return NextResponse.json({ ok: true, count: emails.length, brevo: importData, contacts: members.map((m) => ({ email: m.email, status: m.status })) })
}
