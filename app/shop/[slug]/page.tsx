'use client'

import { notFound } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { TC_PRODUCTS, money, discounted, type TCProduct } from '@/lib/tc-products'

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const product = TC_PRODUCTS.find((p) => p.slug === slug)
  if (!product) notFound()

  return <ProductDetail product={product} />
}

function ProductDetail({ product }: { product: TCProduct }) {
  const [selectedSize, setSelectedSize] = useState('')
  const [customName, setCustomName] = useState('')
  const [customRank, setCustomRank] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [discountPct, setDiscountPct] = useState(0)
  const [showForm, setShowForm] = useState(false)

  // Check member status client-side for price display
  useEffect(() => {
    fetch('/api/shop/member-status')
      .then((r) => r.json())
      .then((d) => { if (d.discount) setDiscountPct(d.discount) })
      .catch(() => {})
  }, [])

  const hasCustom = Boolean(product.customization?.enabled && (customName || customRank))
  const customFee = hasCustom ? (product.customization?.feeMinor ?? 0) : 0
  const listUnit = product.priceMinor + customFee
  const unitPrice = discounted(listUnit, discountPct)

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!selectedSize) { setError('Please select a size.'); return }
    if (!fullName.trim()) { setError('Please enter your name.'); return }
    if (!email.trim()) { setError('Please enter your email.'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: product.slug,
          sku: selectedSize,
          qty,
          fullName: fullName.trim(),
          email: email.trim(),
          customName: customName.trim() || undefined,
          customRank: customRank || undefined,
        }),
      })
      const data = await res.json()
      if (data.url) {
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
      {/* Back nav */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/shop"
            className="text-gray-500 hover:text-blue-400 text-sm uppercase tracking-wide font-semibold transition-colors"
          >
            ← Back to Shop
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <div className="aspect-square bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Image
                  src="/Team Curran Circle Logo.png"
                  alt="Team Curran"
                  width={120}
                  height={120}
                  className="opacity-20"
                />
                <span className="text-gray-600 text-sm uppercase tracking-wide">Photo coming soon</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="text-blue-500 text-xs font-bold uppercase tracking-widest mb-2">Team Curran</p>
            <h1
              className="text-3xl sm:text-4xl font-black uppercase leading-tight"
              style={{ fontFamily: 'var(--font-anton), Arial, sans-serif' }}
            >
              {product.name}
            </h1>
            <p className="text-gray-400 mt-2 text-base">{product.tagline}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-5">
              <span className="text-3xl font-black text-white">{money(unitPrice)}</span>
              {discountPct > 0 && (
                <>
                  <span className="text-gray-600 text-lg line-through">{money(listUnit)}</span>
                  <span className="text-blue-400 text-sm font-bold uppercase tracking-wide">{discountPct}% member discount</span>
                </>
              )}
            </div>
            {product.shippingMinor > 0 && (
              <p className="text-gray-500 text-xs mt-1">+ {money(product.shippingMinor)} shipping</p>
            )}

            {/* Description */}
            <div className="mt-6 space-y-2">
              {product.description.map((line, i) => (
                <p key={i} className="text-gray-300 text-sm leading-relaxed">{line}</p>
              ))}
            </div>

            {/* Order form */}
            {!showForm ? (
              <div className="mt-8">
                {/* Size selector */}
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Select Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.sku}
                        onClick={() => setSelectedSize(v.sku)}
                        className={`px-4 py-2 rounded border text-sm font-bold uppercase tracking-wide transition-colors ${
                          selectedSize === v.sku
                            ? 'bg-blue-700 border-blue-600 text-white'
                            : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-blue-700 hover:text-white'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customization */}
                {product.customization?.enabled && (
                  <div className="mb-6 bg-gray-900 border border-gray-800 rounded-xl p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                      Personalization{' '}
                      <span className="text-gray-600 normal-case font-normal">
                        (optional · +{money(product.customization.feeMinor)})
                      </span>
                    </p>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">
                          {product.customization.namePlaceholder}
                        </label>
                        <input
                          type="text"
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          placeholder="e.g. Jeff Curran"
                          maxLength={40}
                          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Belt rank</label>
                        <select
                          value={customRank}
                          onChange={(e) => setCustomRank(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-blue-600 focus:outline-none"
                        >
                          <option value="">— None —</option>
                          {product.customization.rankOptions.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (!selectedSize) { setError('Please select a size first.'); return }
                    setError('')
                    setShowForm(true)
                  }}
                  className="w-full bg-blue-700 hover:bg-blue-600 text-white font-black uppercase tracking-widest py-4 rounded-xl text-base transition-colors"
                  style={{ fontFamily: 'var(--font-anton), Arial, sans-serif' }}
                >
                  Continue to Checkout
                </button>
                {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
              </div>
            ) : (
              <form onSubmit={handleCheckout} className="mt-8 space-y-4">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-sm">
                  <span className="text-gray-400">Size: </span>
                  <span className="text-white font-bold">{selectedSize}</span>
                  {hasCustom && (
                    <span className="text-gray-400 ml-3">
                      · {customName} {customRank && `(${customRank})`}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="ml-3 text-blue-500 hover:text-blue-400 text-xs underline"
                  >
                    Change
                  </button>
                </div>

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
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">Quantity</label>
                  <select
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-600 focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                {/* Order summary */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal ({qty}×)</span>
                    <span className="text-white font-bold">{money(unitPrice * qty)}</span>
                  </div>
                  {product.shippingMinor > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Shipping</span>
                      <span className="text-white">{money(product.shippingMinor)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gray-800 pt-2">
                    <span className="font-bold uppercase tracking-wide">Total</span>
                    <span className="text-white font-black text-base">{money(unitPrice * qty + product.shippingMinor)}</span>
                  </div>
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-700 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest py-4 rounded-xl text-base transition-colors"
                  style={{ fontFamily: 'var(--font-anton), Arial, sans-serif' }}
                >
                  {loading ? 'Processing...' : 'Pay with Card →'}
                </button>
                <p className="text-gray-600 text-xs text-center">
                  You'll be redirected to our secure payment page.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
