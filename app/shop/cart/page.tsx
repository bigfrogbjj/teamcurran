'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart, lineKey } from '../CartContext'
import { money } from '@/lib/tc-products'

export default function CartPage() {
  const { lines, updateQty, removeItem, subtotalMinor } = useCart()
  const router = useRouter()

  // Use the max shipping across items (all items ship for one flat fee — take the highest)
  const shippingMinor = lines.length > 0
    ? Math.max(...lines.map((l) => l.shippingMinor))
    : 0
  const totalMinor = subtotalMinor + shippingMinor

  if (lines.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6 px-4" style={{ fontFamily: 'var(--font-oswald), Arial, sans-serif' }}>
        <Image src="/Team Curran Circle Logo.png" alt="Team Curran" width={64} height={64} className="opacity-30" />
        <p className="text-gray-400 text-lg uppercase tracking-wide">Your cart is empty</p>
        <Link
          href="/shop"
          className="bg-blue-700 hover:bg-blue-600 text-white font-black uppercase tracking-widest px-8 py-3 rounded-xl transition-colors"
          style={{ fontFamily: 'var(--font-anton), Arial, sans-serif' }}
        >
          Shop Now
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'var(--font-oswald), Arial, sans-serif' }}>
      <div className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/shop" className="text-gray-500 hover:text-blue-400 text-sm uppercase tracking-wide font-semibold transition-colors">
            ← Continue Shopping
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-black uppercase mb-8" style={{ fontFamily: 'var(--font-anton), Arial, sans-serif' }}>
          Your Cart
        </h1>

        <div className="space-y-4 mb-8">
          {lines.map((line) => {
            const key = lineKey(line)
            return (
              <div key={key} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex gap-4 items-start">
                {/* Image */}
                <div className="w-20 h-20 shrink-0 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                  {line.imageUrl ? (
                    <Image src={line.imageUrl} alt={line.name} width={80} height={80} className="w-full h-full object-cover" unoptimized />
                  ) : (
                    <Image src="/Team Curran Circle Logo.png" alt="" width={32} height={32} className="opacity-20" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-black uppercase text-sm" style={{ fontFamily: 'var(--font-anton), Arial, sans-serif' }}>{line.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {[line.colorLabel, `Size ${line.sizeLabel}`].filter(Boolean).join(' · ')}
                  </p>
                  <p className="text-white font-bold text-sm mt-1">{money(line.priceMinor)} ea.</p>
                </div>

                {/* Qty + remove */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(key, line.qty - 1)}
                      className="w-7 h-7 rounded border border-gray-700 text-white font-bold hover:border-blue-600 transition-colors flex items-center justify-center text-sm"
                    >
                      −
                    </button>
                    <span className="text-white font-bold w-5 text-center text-sm">{line.qty}</span>
                    <button
                      onClick={() => updateQty(key, line.qty + 1)}
                      className="w-7 h-7 rounded border border-gray-700 text-white font-bold hover:border-blue-600 transition-colors flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-white font-black text-sm">{money(line.priceMinor * line.qty)}</p>
                  <button
                    onClick={() => removeItem(key)}
                    className="text-gray-600 hover:text-red-400 text-xs uppercase tracking-wide transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-white font-bold">{money(subtotalMinor)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Shipping</span>
              <span className="text-white">{money(shippingMinor)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-700 pt-3 mt-3">
              <span className="font-black uppercase tracking-wide text-base">Total</span>
              <span className="font-black text-xl">{money(totalMinor)}</span>
            </div>
          </div>

          <button
            onClick={() => router.push('/shop/checkout')}
            className="w-full bg-blue-700 hover:bg-blue-600 text-white font-black uppercase tracking-widest py-4 rounded-xl text-base transition-colors mt-2"
            style={{ fontFamily: 'var(--font-anton), Arial, sans-serif' }}
          >
            Proceed to Checkout →
          </button>
          <p className="text-gray-600 text-xs text-center mt-3">Active TC members receive 5% off at checkout.</p>
        </div>
      </div>
    </div>
  )
}
