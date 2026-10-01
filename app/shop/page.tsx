import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import Image from 'next/image'
import { TC_PRODUCTS, money } from '@/lib/tc-products'
import CartIcon from './CartIcon'

export const metadata = { title: 'Team Curran Shop', robots: 'noindex,nofollow' }

async function getMemberDiscount(): Promise<number> {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    )
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) return 0
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
    return member?.status === 'active' ? 5 : 0
  } catch {
    return 0
  }
}

export default async function ShopPage() {
  const discountPct = await getMemberDiscount()
  const training = TC_PRODUCTS.filter((p) => p.category === 'training')
  const apparel = TC_PRODUCTS.filter((p) => p.category === 'apparel')

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'var(--font-oswald), Arial, sans-serif' }}>
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-end justify-between">
          <div>
            <p className="text-blue-500 text-xs font-bold uppercase tracking-widest mb-2">Team Curran</p>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight" style={{ fontFamily: 'var(--font-anton), Arial, sans-serif' }}>
              Team Store
            </h1>
            <p className="text-gray-400 mt-2 text-base">Official Team Curran gear · Preorder closes Nov 1</p>
          </div>
          <CartIcon />
        </div>
      </div>

      {discountPct > 0 && (
        <div className="bg-blue-900/40 border-b border-blue-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <span className="text-blue-400 font-bold uppercase text-sm tracking-wide">
              ✓ Active student — {discountPct}% discount applied at checkout
            </span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Section title="Training Gear" products={training} />
        <Section title="Apparel" products={apparel} />
      </div>

      <footer className="border-t border-gray-800 py-8 mt-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-600 text-xs text-center">
            Team Curran · Crystal Lake, IL ·{' '}
            <a href="mailto:chuck@teamcurran.com" className="hover:text-gray-400 transition-colors">chuck@teamcurran.com</a>
          </p>
        </div>
      </footer>
    </div>
  )
}

function Section({ title, products }: { title: string; products: typeof TC_PRODUCTS }) {
  if (!products.length) return null
  return (
    <div className="mb-12">
      <h2 className="text-xl font-black uppercase tracking-widest text-gray-400 mb-6 border-b border-gray-800 pb-3" style={{ fontFamily: 'var(--font-anton), Arial, sans-serif' }}>
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <Link
            key={p.slug}
            href={`/shop/${p.slug}`}
            className="group bg-gray-900 border border-gray-800 hover:border-blue-700 rounded-xl overflow-hidden transition-colors"
          >
            <div className="aspect-square bg-gray-800 flex items-center justify-center overflow-hidden">
              {p.imageUrl ? (
                <Image
                  src={p.imageUrl}
                  alt={p.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              ) : (
                <div className="flex flex-col items-center gap-2 px-4 text-center">
                  <Image src="/Team Curran Circle Logo.png" alt="Team Curran" width={80} height={80} className="opacity-20" />
                  <span className="text-gray-600 text-xs uppercase tracking-wide">Photo coming soon</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-black uppercase text-sm leading-tight group-hover:text-blue-400 transition-colors" style={{ fontFamily: 'var(--font-anton), Arial, sans-serif' }}>
                {p.name}
              </h3>
              <p className="text-gray-400 text-xs mt-1 leading-snug line-clamp-2">{p.tagline}</p>
              <p className="text-white font-bold text-sm mt-3">{money(p.priceMinor)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
