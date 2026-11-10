'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '../CartContext'
import { money } from '@/lib/tc-products'


export default function CheckoutPage() {
  const { lines, subtotalMinor, clear } = useCart()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [gym, setGym] = useState('')
  const [shippingOption, setShippingOption] = useState<'ship' | 'pickup'>('pickup')
  const [shipStreet, setShipStreet] = useState('')
  const [shipCity, setShipCity] = useState('')
  const [shipState, setShipState] = useState('')
  const [shipZip, setShipZip] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoDiscountPct, setPromoDiscountPct] = useState(0)
  const [promoError, setPromoError] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const totalQty = lines.reduce((s, l) => s + l.qty, 0)
  function calcShipping(qty: number) {
    if (qty <= 1) return 1000
    if (qty === 2) return 1500
    if (qty <= 5) return 2000
    return 2500
  }
  const shippingMinor = shippingOption === 'pickup' ? 0 : calcShipping(totalQty)
  const promoSavings = promoApplied ? Math.round(subtotalMinor * promoDiscountPct / 100) : 0
  const totalMinor = subtotalMinor - promoSavings + shippingMinor

  async function applyPromo() {
    setPromoError('')
    setPromoApplied(false)
    setPromoDiscountPct(0)
    if (!email.trim()) {
      setPromoError('Enter your email first.')
      return
    }
    setPromoLoading(true)
    try {
      const res = await fetch('/api/shop/verify-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode.trim(), email: email.trim() }),
      })
      const data = await res.json()
      if (data.valid) {
        setPromoApplied(true)
        setPromoDiscountPct(data.discountPct)
      } else {
        setPromoError(data.error || 'Invalid promo code.')
      }
    } catch {
      setPromoError('Could not verify code. Try again.')
    } finally {
      setPromoLoading(false)
    }
  }

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
    if (!fullName.trim() || !email.trim() || !phone.trim() || !gym.trim()) {
      setError('Please fill in all fields.')
      return
    }
    if (shippingOption === 'ship' && (!shipStreet.trim() || !shipCity.trim() || !shipState.trim() || !shipZip.trim())) {
      setError('Please enter your full shipping address.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines,
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          gym: gym.trim(),
          shippingMinor,
          promoCode: promoCode.trim().toUpperCase(),
          shipAddress: shippingOption === 'ship' ? `${shipStreet.trim()}, ${shipCity.trim()}, ${shipState.trim()} ${shipZip.trim()}` : null,
        }),
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
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">Phone</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 555-5555"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">Where do you train?</label>
            <input
              type="text"
              required
              value={gym}
              onChange={(e) => setGym(e.target.value)}
              placeholder="e.g. Team Curran Crystal Lake"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">Delivery</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShippingOption('pickup')}
                className={`rounded-lg border px-4 py-3 text-sm font-bold uppercase tracking-wide text-left transition-colors ${
                  shippingOption === 'pickup'
                    ? 'bg-blue-900/60 border-blue-600 text-white'
                    : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-500'
                }`}
              >
                <span className="block">Gym Pickup — Free</span>
                <span className="text-xs font-normal normal-case text-gray-400">Crystal Lake, IL</span>
              </button>
              <button
                type="button"
                onClick={() => setShippingOption('ship')}
                className={`rounded-lg border px-4 py-3 text-sm font-bold uppercase tracking-wide text-left transition-colors ${
                  shippingOption === 'ship'
                    ? 'bg-blue-900/60 border-blue-600 text-white'
                    : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-500'
                }`}
              >
                <span className="block">Ship to me</span>
                <span className="text-xs font-normal normal-case text-gray-400">{money(calcShipping(totalQty))}</span>
              </button>
            </div>
          </div>

          {shippingOption === 'ship' && (
            <div className="space-y-3 border border-gray-800 rounded-xl p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Shipping Address</p>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1">Street Address</label>
                <input
                  type="text"
                  value={shipStreet}
                  onChange={(e) => setShipStreet(e.target.value)}
                  placeholder="123 Main St"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1">City</label>
                  <input
                    type="text"
                    value={shipCity}
                    onChange={(e) => setShipCity(e.target.value)}
                    placeholder="Crystal Lake"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1">State</label>
                  <input
                    type="text"
                    value={shipState}
                    onChange={(e) => setShipState(e.target.value)}
                    placeholder="IL"
                    maxLength={2}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-600 focus:outline-none uppercase"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1">ZIP Code</label>
                <input
                  type="text"
                  value={shipZip}
                  onChange={(e) => setShipZip(e.target.value)}
                  placeholder="60014"
                  maxLength={10}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>
          )}

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
