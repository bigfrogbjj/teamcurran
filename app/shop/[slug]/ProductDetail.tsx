'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { money, type TCProduct, type TCColorVariant, type TCSleeveVariant } from '@/lib/tc-products'
import { useCart } from '../CartContext'

export function ProductDetail({ product }: { product: TCProduct }) {
  const router = useRouter()
  const { addItem, totalItems } = useCart()

  const firstSleeve = product.sleeveVariants?.[0] ?? null
  const [selectedSleeve, setSelectedSleeve] = useState<TCSleeveVariant | null>(firstSleeve)

  const activeColorVariants = selectedSleeve?.colorVariants ?? product.colorVariants ?? []
  const [selectedColor, setSelectedColor] = useState<TCColorVariant | null>(
    activeColorVariants[0] ?? null
  )
  const [selectedSize, setSelectedSize] = useState('')
  const [qty, setQty] = useState(1)
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)

  function handleSleeveChange(sv: TCSleeveVariant) {
    setSelectedSleeve(sv)
    setSelectedColor(sv.colorVariants[0] ?? null)
  }

  const activeImage = selectedColor?.imageUrl ?? selectedSleeve?.imageUrl ?? product.imageUrl

  function handleAdd() {
    if (!selectedSize) { setError('Please select a size.'); return }
    setError('')

    addItem(
      {
        slug: product.slug,
        name: selectedSleeve ? `${product.name} (${selectedSleeve.label})` : product.name,
        colorKey: selectedColor?.key ?? null,
        colorLabel: selectedColor?.label ?? null,
        imageUrl: activeImage,
        sizeLabel: selectedSize,
        priceMinor: product.priceMinor,
        shippingMinor: product.shippingMinor,
      },
      qty
    )

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'var(--font-oswald), Arial, sans-serif' }}>
      {/* Top bar */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/shop" className="text-gray-500 hover:text-blue-400 text-sm uppercase tracking-wide font-semibold transition-colors">
            ← Back to Shop
          </Link>
          <Link href="/shop/cart" className="relative text-gray-300 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <div className="aspect-square bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center">
            {activeImage ? (
              <Image
                src={activeImage}
                alt={`${product.name}${selectedColor ? ` – ${selectedColor.label}` : ''}`}
                width={600}
                height={600}
                className="w-full h-full object-cover transition-opacity duration-200"
                unoptimized
              />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Image src="/Team Curran Circle Logo.png" alt="Team Curran" width={120} height={120} className="opacity-20" />
                <span className="text-gray-600 text-sm uppercase tracking-wide">Photo coming soon</span>
              </div>
            )}
          </div>

          {/* Details + form */}
          <div className="flex flex-col">
            <p className="text-blue-500 text-xs font-bold uppercase tracking-widest mb-2">Team Curran</p>
            <h1
              className="text-3xl sm:text-4xl font-black uppercase leading-tight"
              style={{ fontFamily: 'var(--font-anton), Arial, sans-serif' }}
            >
              {product.name}
            </h1>
            <p className="text-gray-400 mt-2">{product.tagline}</p>

            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-3xl font-black">{money(product.priceMinor)}</span>
            </div>
            <p className="text-gray-500 text-xs mt-1">+ {money(product.shippingMinor)} shipping</p>
            <div className="mt-3 inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-500/40 rounded-lg px-3 py-2">
              <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider">Preorder</span>
              <span className="text-yellow-300/70 text-xs">— ships after production · order by Nov 26</span>
            </div>

            <div className="mt-4 space-y-1">
              {product.description.map((line, i) => (
                <p key={i} className="text-gray-300 text-sm leading-relaxed">{line}</p>
              ))}
            </div>

            <div className="mt-8 space-y-6">
              {/* Sleeve length */}
              {product.sleeveVariants && product.sleeveVariants.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Sleeve</p>
                  <div className="flex gap-2">
                    {product.sleeveVariants.map((sv) => (
                      <button
                        key={sv.key}
                        onClick={() => handleSleeveChange(sv)}
                        className={`px-4 py-2 rounded border text-sm font-bold uppercase tracking-wide transition-colors ${
                          selectedSleeve?.key === sv.key
                            ? 'bg-blue-700 border-blue-600 text-white'
                            : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-blue-700 hover:text-white'
                        }`}
                      >
                        {sv.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color */}
              {activeColorVariants.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                    Color{selectedColor && <span className="text-white ml-2 normal-case font-normal">— {selectedColor.label}</span>}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeColorVariants.map((cv) => (
                      <button
                        key={cv.key}
                        onClick={() => setSelectedColor(cv)}
                        title={cv.label}
                        className={`w-9 h-9 rounded-full border-2 transition-all ${
                          selectedColor?.key === cv.key ? 'border-blue-500 scale-110' : 'border-gray-700 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: cv.swatch }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Size</p>
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

              {/* Qty */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Quantity</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded border border-gray-700 text-white text-lg font-bold hover:border-blue-700 transition-colors flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="text-white font-bold text-lg w-6 text-center">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(10, q + 1))}
                    className="w-9 h-9 rounded border border-gray-700 text-white text-lg font-bold hover:border-blue-700 transition-colors flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div className="flex gap-3">
                <button
                  onClick={handleAdd}
                  className={`flex-1 font-black uppercase tracking-widest py-4 rounded-xl text-base transition-colors ${
                    added
                      ? 'bg-green-700 text-white'
                      : 'bg-blue-700 hover:bg-blue-600 text-white'
                  }`}
                  style={{ fontFamily: 'var(--font-anton), Arial, sans-serif' }}
                >
                  {added ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
                {totalItems > 0 && (
                  <button
                    onClick={() => router.push('/shop/cart')}
                    className="px-5 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl border border-gray-700 transition-colors text-sm uppercase tracking-wide"
                  >
                    View Cart ({totalItems})
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Gi size chart */}
        {(product.slug === 'tc-gi-adult' || product.slug === 'tc-gi-kids') && (
          <div className="mt-14 border-t border-gray-800 pt-10">
            <h2 className="text-xl font-black uppercase tracking-widest text-gray-400 mb-6"
                style={{ fontFamily: 'var(--font-anton), Arial, sans-serif' }}>
              Size Guide
            </h2>

            {product.slug === 'tc-gi-adult' && (
              <div className="space-y-6">
                <p className="text-gray-400 text-sm">Adult sizes by height &amp; weight. Between two sizes? Size up.</p>

                {[
                  { group: 'Standard', sizes: [
                    { id: 'A00', height: "4'9\"–5'2\"", weight: '90–115 lbs' },
                    { id: 'A0',  height: "5'0\"–5'5\"", weight: '105–135 lbs' },
                    { id: 'A1',  height: "5'5\"–5'8\"", weight: '135–170 lbs' },
                    { id: 'A2',  height: "5'8\"–6'0\"", weight: '170–190 lbs' },
                    { id: 'A3',  height: "5'11\"–6'2\"", weight: '190–230 lbs' },
                    { id: 'A4',  height: "6'2\"–6'5\"", weight: '220–260 lbs' },
                    { id: 'A5',  height: "6'4\"–6'7\"", weight: '250–290 lbs' },
                  ]},
                  { group: 'Husky', sizes: [
                    { id: 'A0H', height: "5'0\"–5'5\"", weight: '150–180 lbs' },
                    { id: 'A1H', height: "5'5\"–5'8\"", weight: '180–200 lbs' },
                    { id: 'A2H', height: "5'8\"–6'0\"", weight: '190–235 lbs' },
                    { id: 'A3H', height: "5'11\"–6'2\"", weight: '225–265 lbs' },
                    { id: 'A4H', height: "6'2\"–6'5\"", weight: '245–290 lbs' },
                  ]},
                  { group: 'Tall', sizes: [
                    { id: 'A1T', height: "5'8\"–5'11\"", weight: '140–175 lbs' },
                    { id: 'A2T', height: "5'11\"–6'2\"", weight: '175–200 lbs' },
                    { id: 'A3T', height: "6'2\"–6'5\"", weight: '195–240 lbs' },
                  ]},
                  { group: 'Female Fitted', sizes: [
                    { id: 'F1', height: "5'1\"–5'5\"", weight: '105–130 lbs' },
                    { id: 'F2', height: "5'4\"–5'7\"", weight: '125–155 lbs' },
                    { id: 'F3', height: "5'6\"–5'9\"", weight: '150–180 lbs' },
                  ]},
                ].map(({ group, sizes }) => (
                  <div key={group}>
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">{group}</p>
                    <div className="overflow-x-auto rounded-lg border border-gray-800">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-900 text-left">
                            <th className="px-4 py-2 text-gray-400 font-bold uppercase tracking-wider text-xs">Size</th>
                            <th className="px-4 py-2 text-gray-400 font-bold uppercase tracking-wider text-xs">Height</th>
                            <th className="px-4 py-2 text-gray-400 font-bold uppercase tracking-wider text-xs">Weight</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sizes.map((s, i) => (
                            <tr key={s.id} className={i % 2 === 0 ? 'bg-black' : 'bg-gray-900/50'}>
                              <td className="px-4 py-2 font-bold text-white">{s.id}</td>
                              <td className="px-4 py-2 text-gray-300">{s.height}</td>
                              <td className="px-4 py-2 text-gray-300">{s.weight}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {product.slug === 'tc-gi-kids' && (
              <div>
                <p className="text-gray-400 text-sm mb-4">Kids sizes (M000–M4) by garment measurement.</p>
                <div className="overflow-x-auto rounded-lg border border-gray-800">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-900 text-left">
                        <th className="px-4 py-2 text-gray-400 font-bold uppercase tracking-wider text-xs">Size</th>
                        <th className="px-4 py-2 text-gray-400 font-bold uppercase tracking-wider text-xs">Jacket Length (in)</th>
                        <th className="px-4 py-2 text-gray-400 font-bold uppercase tracking-wider text-xs">Sleeve (in)</th>
                        <th className="px-4 py-2 text-gray-400 font-bold uppercase tracking-wider text-xs">Pant Inseam (in)</th>
                        <th className="px-4 py-2 text-gray-400 font-bold uppercase tracking-wider text-xs">Weight (lbs)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { size: 'M000', jacket: '17', sleeve: '11', inseam: '13', weight: '33–44' },
                        { size: 'M00',  jacket: '19', sleeve: '12', inseam: '15', weight: '44–55' },
                        { size: 'M0',   jacket: '21', sleeve: '14', inseam: '17', weight: '55–77' },
                        { size: 'M1',   jacket: '23', sleeve: '16', inseam: '20', weight: '77–99' },
                        { size: 'M2',   jacket: '25', sleeve: '18', inseam: '23', weight: '99–121' },
                        { size: 'M3',   jacket: '27', sleeve: '20', inseam: '26', weight: '121–143' },
                        { size: 'M4',   jacket: '29', sleeve: '22', inseam: '29', weight: '143–165' },
                      ].map((s, i) => (
                        <tr key={s.size} className={i % 2 === 0 ? 'bg-black' : 'bg-gray-900/50'}>
                          <td className="px-4 py-2 font-bold text-white">{s.size}</td>
                          <td className="px-4 py-2 text-gray-300">{s.jacket}</td>
                          <td className="px-4 py-2 text-gray-300">{s.sleeve}</td>
                          <td className="px-4 py-2 text-gray-300">{s.inseam}</td>
                          <td className="px-4 py-2 text-gray-300">{s.weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
