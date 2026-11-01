import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// One-time sync: ensures every active TC member exists in BFN with watch library access.
// Protected by INTERNAL_API_SECRET header.
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-internal-secret')
  if (!secret || secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tcAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )

  const bfnAdmin = createClient(
    process.env.BFN_SUPABASE_URL!,
    process.env.BFN_SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )

  const gymId = process.env.BFN_TC_GYM_ID!

  // Fetch all active TC members
  const { data: tcMembers, error: tcErr } = await tcAdmin
    .from('members')
    .select('email, full_name, status')
    .eq('status', 'active')
    .order('full_name')

  if (tcErr || !tcMembers) {
    return NextResponse.json({ error: 'Failed to fetch TC members', detail: tcErr }, { status: 500 })
  }

  const results: { email: string; action: string; error?: string }[] = []

  for (const member of tcMembers) {
    if (!member.email) continue
    try {
      // Generate magic link — this creates the BFN auth user if they don't exist
      const { data, error } = await bfnAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: member.email,
      })
      if (error) throw error

      const bfnUserId = data.user?.id
      if (!bfnUserId) throw new Error('No BFN user id returned')

      // Upsert BFN members row with active status + gym access
      const { error: upsertErr } = await bfnAdmin.from('members').upsert(
        {
          id: bfnUserId,
          email: member.email,
          full_name: member.full_name || member.email,
          gym_id: gymId,
          tier: 'nation',
          status: 'active',
        },
        { onConflict: 'id' }
      )
      if (upsertErr) throw upsertErr

      results.push({ email: member.email, action: 'synced' })
    } catch (err: unknown) {
      results.push({ email: member.email, action: 'error', error: String(err) })
    }
  }

  const synced = results.filter((r) => r.action === 'synced').length
  const errors = results.filter((r) => r.action === 'error')

  return NextResponse.json({ total: tcMembers.length, synced, errors })
}
