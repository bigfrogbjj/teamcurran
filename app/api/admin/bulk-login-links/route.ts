import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// TEMP: bulk send login links to members who never got welcome emails — remove after use
export async function POST(req: NextRequest) {
  if (req.headers.get('x-internal-secret') !== process.env.INTERNAL_API_SECRET)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { ids } = await req.json() as { ids: string[] }
  if (!ids?.length) return NextResponse.json({ error: 'ids required' }, { status: 400 })

  const tcAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
  const secret = process.env.INTERNAL_API_SECRET!

  const results: { email: string; ok: boolean; error?: string }[] = []

  for (const id of ids) {
    const { data: member } = await tcAdmin
      .from('members')
      .select('email, full_name')
      .eq('id', id)
      .single()

    if (!member) {
      results.push({ email: id, ok: false, error: 'not found' })
      continue
    }

    try {
      const { data, error } = await tcAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: member.email,
        options: { redirectTo: 'https://teamcurran.com/members' },
      })

      if (error || !data?.properties?.action_link) throw new Error(error?.message || 'no link')

      const magicLink = data.properties.action_link
      const firstName = (member.full_name as string).split(' ')[0]

      const bfnRes = await fetch('https://bigfrogbjj.com/api/internal/send-tc-login-link', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-internal-secret': secret },
        body: JSON.stringify({ email: member.email, name: member.full_name, firstName, magicLink }),
      })

      if (!bfnRes.ok) throw new Error(`BFN send failed: ${bfnRes.status}`)

      // Mark welcome_sent
      await tcAdmin.from('members').update({ welcome_sent: true }).eq('id', id)

      results.push({ email: member.email as string, ok: true })
    } catch (err) {
      results.push({ email: member.email as string, ok: false, error: String(err) })
    }
  }

  return NextResponse.json({ results })
}
