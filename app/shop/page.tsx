import Link from 'next/link'
import Image from 'next/image'
import { getProductsWithPrices } from '@/lib/tc-shop-prices'
import CartIcon from './CartIcon'
import ShopFilter from './ShopFilter'

export const metadata = { title: 'Team Curran Shop', robots: 'noindex,nofollow' }

export default async function ShopPage() {
  const allProducts = await getProductsWithPrices()

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'var(--font-oswald), Arial, sans-serif' }}>
      {/* Top nav */}
      <header className="bg-gray-950 border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/Team Curran C .png" alt="Team Curran" width={44} height={44} className="h-9 w-auto" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Team Store</p>
              <p className="text-sm font-bold text-white leading-none">Team Curran</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/members" className="text-xs text-gray-400 hover:text-blue-400 transition-colors uppercase tracking-wide">
              Portal
            </Link>
            <Link href="/members/schedule" className="text-xs text-gray-400 hover:text-blue-400 transition-colors uppercase tracking-wide">
              Schedule
            </Link>
            <CartIcon />
          </div>
        </div>
      </header>

      {/* Page title */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight" style={{ fontFamily: 'var(--font-anton), Arial, sans-serif' }}>
          Team Store
        </h1>
        <p className="text-gray-400 mt-2 text-base">Official Team Curran gear · Preorder closes Nov 26</p>
        <p className="text-amber-500/80 text-xs mt-1">Note: Gi orders may take longer to arrive — apparel ships faster.</p>
      </div>

      {/* Filter nav + products */}
      <ShopFilter products={allProducts} />

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
