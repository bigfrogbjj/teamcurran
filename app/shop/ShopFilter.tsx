'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { money, type TCProduct } from '@/lib/tc-products'

type Filter = 'all' | 'adult' | 'youth'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all',   label: 'All' },
  { key: 'adult', label: 'Adult' },
  { key: 'youth', label: 'Youth' },
]

export default function ShopFilter({ products }: { products: TCProduct[] }) {
  const [active, setActive] = useState<Filter>('all')

  const filtered = active === 'all' ? products : products.filter((p) => p.subcategory === active)
  const training = filtered.filter((p) => p.category === 'training')
  const apparel  = filtered.filter((p) => p.category === 'apparel')

  return (
    <>
      {/* Filter nav */}
      <div className="sticky top-0 z-20 bg-gray-950 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-none">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`
                  px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all
                  ${active === key
                    ? 'bg-blue-700 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'}
                `}
              >
                {label}
              </button>
            ))}
            <div className="ml-auto flex gap-4 text-xs text-gray-600 whitespace-nowrap pl-4">
              <a href="#training" className="hover:text-gray-400 transition-colors">Training Gear</a>
              <a href="#apparel"  className="hover:text-gray-400 transition-colors">Apparel</a>
            </div>
          </div>
        </div>
      </div>

      {/* Product sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Section id="training" title="Training Gear" products={training} />
        <Section id="apparel"  title="Apparel"       products={apparel}  />
        {!training.length && !apparel.length && (
          <p className="text-gray-600 text-center py-16">No products found.</p>
        )}
      </div>
    </>
  )
}

function Section({ id, title, products }: { id: string; title: string; products: TCProduct[] }) {
  if (!products.length) return null
  return (
    <div id={id} className="mb-14 scroll-mt-24">
      <h2 className="text-xl font-black uppercase tracking-widest text-gray-400 mb-6 border-b border-gray-800 pb-3"
          style={{ fontFamily: 'var(--font-anton), Arial, sans-serif' }}>
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
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-black uppercase text-sm leading-tight group-hover:text-blue-400 transition-colors"
                    style={{ fontFamily: 'var(--font-anton), Arial, sans-serif' }}>
                  {p.name}
                </h3>
                <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  p.subcategory === 'youth'
                    ? 'text-amber-400 border-amber-800 bg-amber-950/40'
                    : 'text-blue-400 border-blue-900 bg-blue-950/40'
                }`}>
                  {p.subcategory === 'youth' ? 'Youth' : 'Adult'}
                </span>
              </div>
              <p className="text-gray-400 text-xs mt-1 leading-snug line-clamp-2">{p.tagline}</p>
              <p className="text-white font-bold text-sm mt-3">{money(p.priceMinor)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
