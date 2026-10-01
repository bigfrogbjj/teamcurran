'use client'

import { use, useState } from 'react'
import { notFound, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { TC_PRODUCTS, money, type TCProduct, type TCColorVariant } from '@/lib/tc-products'
import { useCart } from '../CartContext'

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const product = TC_PRODUCTS.find((p) => p.slug === slug)
  if (!product) notFound()
  return <ProductDetail product={product} />
}

function ProductDetail({ product }: { product: TCProduct }) {
  const router = useRouter()
  const { addItem, totalItems } = useCart()

  const [selectedColor, setSelectedColor] = useState<TCColorVariant | null>(
    product.colorVariants?.[0] ?? null
  )
  const [selectedSize, setSelectedSize] = useState('')
  const [qty, setQty] = useState(1)
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)

  const activeImage = selectedColor?.imageUrl ?? product.imageUrl

  function handleAdd() {
    if (!selectedSize) { setError('Please select a size.'); return }
    setError('')

    addItem(
      {
        slug: product.slug,
        name: product.name,
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

            <div className="mt-4 space-y-1">
              {product.description.map((line, i) => (
                <p key={i} className="text-gray-300 text-sm leading-relaxed">{line}</p>
              ))}
            </div>

            <div className="mt-8 space-y-6">
              {/* Color */}
              {product.colorVariants && product.colorVariants.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                    Color{selectedColor && <span className="text-white ml-2 normal-case font-normal">— {selectedColor.label}</span>}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.colorVariants.map((cv) => (
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
      </div>
    </div>
  )
}
