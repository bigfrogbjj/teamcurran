import Image from 'next/image'
import Link from 'next/link'

export const metadata = { title: 'Order Received — Team Curran', robots: 'noindex,nofollow' }

export default function ShopSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; size?: string }>
}) {
  return <SuccessContent searchParamsPromise={searchParams} />
}

async function SuccessContent({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ product?: string; size?: string }>
}) {
  const sp = await searchParamsPromise
  const product = sp.product ? decodeURIComponent(sp.product) : null
  const size = sp.size ? decodeURIComponent(sp.size) : null

  return (
    <div
      className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4"
      style={{ fontFamily: 'var(--font-oswald), Arial, sans-serif' }}
    >
      <div className="max-w-md w-full text-center">
        <Image
          src="/Team Curran Circle Logo.png"
          alt="Team Curran"
          width={80}
          height={80}
          className="mx-auto mb-8"
        />

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-700/20 border border-blue-700 mb-6">
          <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1
          className="text-4xl font-black uppercase mb-3"
          style={{ fontFamily: 'var(--font-anton), Arial, sans-serif' }}
        >
          Order Received
        </h1>

        <p className="text-gray-300 text-base leading-relaxed mb-2">
          Thanks for your order! You'll receive a confirmation email from Clover shortly.
        </p>

        {product && (
          <p className="text-gray-500 text-sm mb-6">
            {product}
            {size && ` · Size ${size}`}
          </p>
        )}

        <p className="text-gray-500 text-sm mb-8">
          Questions? Email{' '}
          <a href="mailto:chuck@teamcurran.com" className="text-blue-400 hover:underline">
            chuck@teamcurran.com
          </a>
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            href="/shop"
            className="bg-gray-900 border border-gray-700 hover:border-blue-700 text-white font-bold uppercase tracking-wide text-sm px-5 py-3 rounded-xl transition-colors"
          >
            Back to Shop
          </Link>
          <Link
            href="/members"
            className="bg-blue-700 hover:bg-blue-600 text-white font-bold uppercase tracking-wide text-sm px-5 py-3 rounded-xl transition-colors"
          >
            Members Portal
          </Link>
        </div>
      </div>
    </div>
  )
}
