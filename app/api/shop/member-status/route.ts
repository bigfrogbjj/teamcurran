import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// Called client-side from the product page to show the correct discounted price.
export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    )
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) return NextResponse.json({ discount: 0 })

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )
    const { data: member } = await admin
      .from('members')
      .select('status')
      .eq('email', user.email.toLowerCase())
      .maybeSingle()

    return NextResponse.json({ discount: member?.status === 'active' ? 5 : 0 })
  } catch {
    return NextResponse.json({ discount: 0 })
  }
}
