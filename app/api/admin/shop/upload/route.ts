import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const BUCKET = 'tc-shop-images'

async function requireAdmin() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
  const { data } = await admin.from('members').select('is_admin').eq('id', user.id).single()
  return data?.is_admin ? admin : null
}

export async function POST(req: NextRequest) {
  const db = await requireAdmin()
  if (!db) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await req.formData()
  const file = form.get('file') as File | null
  const slug = form.get('slug') as string | null

  if (!file || !slug) return NextResponse.json({ error: 'file and slug required' }, { status: 400 })

  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowed.includes(file.type)) return NextResponse.json({ error: 'Only JPG, PNG, WEBP allowed' }, { status: 400 })

  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
  const path = `${slug}/${Date.now()}.${ext}`

  // Ensure bucket exists
  await db.storage.createBucket(BUCKET, { public: true }).catch(() => {})

  const bytes = await file.arrayBuffer()
  const { error: uploadErr } = await db.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: true })

  if (uploadErr) return NextResponse.json({ error: uploadErr.message }, { status: 500 })

  const { data: { publicUrl } } = db.storage.from(BUCKET).getPublicUrl(path)

  // Save image_url to tc_shop_products
  await db.from('tc_shop_products').upsert(
    { slug, image_url: publicUrl, updated_at: new Date().toISOString() },
    { onConflict: 'slug' }
  )

  return NextResponse.json({ url: publicUrl })
}
