'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '../CartContext'
import { money } from '@/lib/tc-products'

export default function CheckoutPage() {
  const { lines, subtotalMinor, clear } = useCart()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const shippingMinor = lines.length > 0 ? Math.max(...lines.map((l) => l.shippingMinor)) : 0
  const totalMinor = subtotalMinor + shippingMinor

  if (lines.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4 px-4" style={{ fontFamily: 'var(--font-oswald), Arial, sans-serif' }}>
        <p className="text-gray-400 text-lg uppercase tracking-wide">Your cart is empty.</p>
        <Link href="/shop" className="text-blue-400 hover:underline">← Back to Shop</Link>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!fullName.trim() || !email.trim()) { setError('Please fill in all fields.'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines, fullName: fullName.trim(), email: email.trim(), shippingMinor }),
      })
      const data = await res.json()
      if (data.url) {
        clear()
        window.location.href = data.url
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
        setLoading(false)
      }
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'var(--font-oswald), Arial, sans-serif' }}>
      <div className="border-b border-gray-800">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
          <Link href="/shop/cart" className="text-gray-500 hover:text-blue-400 text-sm uppercase tracking-wide font-semibold transition-colors">
            ← Back to Cart
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-black uppercase mb-8" style={{ fontFamily: 'var(--font-anton), Arial, sans-serif' }}>
          Checkout
        </h1>

        {/* Order summary */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6 space-y-3">
          {lines.map((line) => (
            <div key={`${line.slug}|${line.colorKey}|${line.sizeLabel}`} className="flex justify-between text-sm">
              <span className="text-gray-300">
                {line.name}
                {line.colorLabel ? ` · ${line.colorLabel}` : ''}
                {` · ${line.sizeLabel}`}
                {line.qty > 1 ? ` × ${line.qty}` : ''}
              </span>
              <span className="text-white font-bold shrink-0 ml-4">{money(line.priceMinor * line.qty)}</span>
            </div>
          ))}
          <div className="border-t border-gray-800 pt-3 flex justify-between text-sm">
            <span className="text-gray-400">Shipping</span>
            <span className="text-white">{money(shippingMinor)}</span>
          </div>
          <div className="flex justify-between font-black text-base border-t border-gray-700 pt-3">
            <span>Total</span>
            <span>{money(totalMinor)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-600 focus:outline-none"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white font-black uppercase tracking-widest py-4 rounded-xl text-base transition-colors"
            style={{ fontFamily: 'var(--font-anton), Arial, sans-serif' }}
          >
            {loading ? 'Processing...' : `Pay ${money(totalMinor)} →`}
          </button>
          <p className="text-gray-600 text-xs text-center">You'll be redirected to our secure payment page.</p>
        </form>
      </div>
    </div>
  )
}
