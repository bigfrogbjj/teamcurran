'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface ShopProduct {
  slug: string
  name: string
  price_minor: number
  regular_price_minor: number | null
  shipping_minor: number
  preorder_closes_at: string | null
  active: boolean
  image_url: string | null
  inventory: number | null
}

interface OrderLine {
  name: string
  price_minor: number
  qty: number
}

interface ShopOrder {
  clover_session_id: string
  id: string
  created_at: string
  status: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  customer_gym: string | null
  ship_address: string | null
  lines: OrderLine[]
  subtotal_minor: number
  shipping_minor: number
  total_minor: number
  discount_pct: number
  external_ref: string
}

function toDollars(minor: number | null | undefined): string {
  if (minor == null) return ''
  return (minor / 100).toFixed(2)
}

function toCents(dollars: string): number | null {
  const n = parseFloat(dollars)
  return isNaN(n) ? null : Math.round(n * 100)
}

function fmt(minor: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(minor / 100)
}

function isPreorderClosed(closesAt: string | null) {
  if (!closesAt) return false
  return Date.now() > new Date(closesAt).getTime()
}

export default function AdminShopPage() {
  const [tab, setTab] = useState<'orders' | 'products'>('orders')

  // ── Products state ──
  const [products, setProducts] = useState<ShopProduct[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState<{
    name: string
    preorder_closes_at: string
    price: string
    regular_price: string
    shipping: string
    active: boolean
    inventory: string
  }>({ name: '', preorder_closes_at: '', price: '', regular_price: '', shipping: '', active: true, inventory: '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // ── Orders state ──
  const [orders, setOrders] = useState<ShopOrder[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [ordersError, setOrdersError] = useState('')

  useEffect(() => {
    fetch('/api/admin/shop')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setLoadError(d.error); setLoadingProducts(false); return }
        setProducts(d.products ?? [])
        setLoadingProducts(false)
      })
      .catch((e) => { setLoadError(String(e)); setLoadingProducts(false) })

    fetch('/api/admin/shop-orders')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setOrdersError(d.error); setLoadingOrders(false); return }
        setOrders(d.orders ?? [])
        setLoadingOrders(false)
      })
      .catch((e) => { setOrdersError(String(e)); setLoadingOrders(false) })
  }, [])

  function startEdit(p: ShopProduct) {
    setEditing(p.slug)
    setForm({
      name: p.name,
      preorder_closes_at: p.preorder_closes_at ? p.preorder_closes_at.slice(0, 10) : '',
      price: toDollars(p.price_minor),
      regular_price: toDollars(p.regular_price_minor),
      shipping: toDollars(p.shipping_minor),
      active: p.active,
      inventory: p.inventory != null ? String(p.inventory) : '',
    })
    setPreviewUrl(p.image_url)
    setMsg('')
  }

  async function handleUpload(slug: string, file: File) {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('slug', slug)
    const res = await fetch('/api/admin/shop/upload', { method: 'POST', body: fd })
    const d = await res.json()
    if (d.url) {
      setPreviewUrl(d.url)
      setProducts((prev) => prev.map((p) => p.slug === slug ? { ...p, image_url: d.url } : p))
      setMsg('Photo updated.')
    } else {
      setMsg(d.error || 'Upload failed.')
    }
    setUploading(false)
  }

  async function save(slug: string) {
    setSaving(true)
    setMsg('')
    const payload = {
      slug,
      name: form.name,
      price_minor: toCents(form.price),
      regular_price_minor: form.regular_price ? toCents(form.regular_price) : null,
      shipping_minor: toCents(form.shipping),
      preorder_closes_at: form.preorder_closes_at
        ? new Date(form.preorder_closes_at + 'T00:00:00Z').toISOString()
        : null,
      active: form.active,
      inventory: form.inventory !== '' ? parseInt(form.inventory, 10) : null,
    }
    const res = await fetch('/api/admin/shop', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      setProducts((prev) =>
        prev.map((p) =>
          p.slug === slug
            ? {
                ...p,
                name: payload.name,
                price_minor: payload.price_minor ?? p.price_minor,
                regular_price_minor: payload.regular_price_minor,
                shipping_minor: payload.shipping_minor ?? p.shipping_minor,
                preorder_closes_at: payload.preorder_closes_at,
                active: payload.active,
                inventory: payload.inventory,
              }
            : p
        )
      )
      setEditing(null)
      setMsg('Saved.')
    } else {
      const d = await res.json()
      setMsg(d.error || 'Save failed.')
    }
    setSaving(false)
  }

  async function deleteOrder(id: string) {
    if (!confirm('Delete this order? This cannot be undone.')) return
    await fetch('/api/admin/shop-orders', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setOrders((prev) => prev.filter((o) => o.id !== id))
  }

  async function resendConfirmation(id: string) {
    const res = await fetch('/api/admin/resend-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    const d = await res.json()
    if (d.ok) {
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: 'paid' } : o))
      alert(`Confirmation sent to ${d.customer}`)
    } else {
      alert(d.error || 'Failed to send confirmation')
    }
  }

  // ── Order summary stats ──
  const paidOrders = orders.filter((o) => o.status === 'paid')
  const totalRevenue = paidOrders.reduce((s, o) => s + o.total_minor, 0)

  // All valid gi / apparel size tokens
  const SIZE_RE = /^(M0{0,3}|M[0-4]|[2-4]XL|XS|[SML]|A0{0,2}|A[0-5][HT]?|F[1-4])$/i

  // Extract the size token from the last segment of a dot-separated line name
  function extractSize(parts: string[]): string | null {
    if (parts.length < 2) return null
    const last = parts[parts.length - 1]
    const token = last.startsWith('Size ') ? last.slice(5).trim() : last.trim()
    return SIZE_RE.test(token) ? token.toUpperCase() : null
  }

  // Normalize a line name into { product, ageGroup, color, size }
  // Handles current format "Competition Gi — Adult · Royal Blue · Size A3"
  // and legacy formats like "Adult Gi Royal Blue · A2", "TC Adult Gi Black · F2"
  function normalizeLine(raw: string): { product: string; ageGroup: string | null; color: string | null; size: string } {
    const parts = raw.split(/\s*·\s*/)
    const sizeToken = extractSize(parts)
    const coreParts = sizeToken ? parts.slice(0, -1) : parts

    // Current format: "Competition Gi — Adult" or "Competition Gi — Kids"
    const giMatch = coreParts[0]?.match(/^Competition\s+Gi\s*[—–-]\s*(Adult|Kids)/i)
    if (giMatch) {
      return {
        product: 'Competition Gi',
        ageGroup: giMatch[1].charAt(0).toUpperCase() + giMatch[1].slice(1).toLowerCase(),
        color: coreParts[1] ?? null,
        size: sizeToken ?? '—',
      }
    }

    // Legacy: "Adult Gi …", "TC Adult Gi …", "TC Gi Adult …"
    const legacyAdult = /^(?:TC\s+)?(?:Adult\s+Gi|Gi\s+Adult)/i.test(coreParts[0] ?? '')
    const legacyKids  = /^(?:TC\s+)?(?:Kids?\s+Gi|Gi\s+Kids?)/i.test(coreParts[0] ?? '')
    if (legacyAdult || legacyKids) {
      // Color may be part of the product name ("Adult Gi Royal Blue") or a separate segment
      let color: string | null = coreParts[1] ?? null
      if (!color) {
        // Try to extract color from the product name string itself
        const colorMatch = coreParts[0].match(/(White|Royal\s+Blue|Black)$/i)
        if (colorMatch) color = colorMatch[1]
      }
      return {
        product: 'Competition Gi',
        ageGroup: legacyAdult ? 'Adult' : 'Kids',
        color,
        size: sizeToken ?? '—',
      }
    }

    // Grappling Shorts: "Adult Grappling Shorts · Size M", "Kids Grappling Shorts · Size M2"
    const shortsAdult = /^Adult\s+Grappling\s+Shorts/i.test(coreParts[0] ?? '')
    const shortsKids  = /^Kids?\s+Grappling\s+Shorts/i.test(coreParts[0] ?? '')
    if (shortsAdult || shortsKids) {
      return { product: 'Grappling Shorts', ageGroup: shortsKids ? 'Kids' : 'Adult', color: coreParts[1] ?? null, size: sizeToken ?? '—' }
    }

    // T-Shirts: "Adult T-Shirt · Black · Size M", "Youth T-Shirt · Size S"
    const teeAdult = /^Adult\s+T-?Shirt/i.test(coreParts[0] ?? '')
    const teeYouth = /^Youth\s+T-?Shirt/i.test(coreParts[0] ?? '')
    if (teeAdult || teeYouth) {
      return { product: 'T-Shirt', ageGroup: teeYouth ? 'Kids' : 'Adult', color: coreParts[1] ?? null, size: sizeToken ?? '—' }
    }

    // Hoodies: "Adult Hoodie · Size L", "Youth Hoodie · Size S"
    const hoodieAdult = /^Adult\s+Hoodie/i.test(coreParts[0] ?? '')
    const hoodieYouth = /^Youth\s+Hoodie/i.test(coreParts[0] ?? '')
    if (hoodieAdult || hoodieYouth) {
      return { product: 'Hoodie', ageGroup: hoodieYouth ? 'Kids' : 'Adult', color: coreParts[1] ?? null, size: sizeToken ?? '—' }
    }

    // Joggers: "Adult Joggers · Size M", "Youth Joggers · Size S"
    const joggersAdult = /^Adult\s+Joggers/i.test(coreParts[0] ?? '')
    const joggersYouth = /^Youth\s+Joggers/i.test(coreParts[0] ?? '')
    if (joggersAdult || joggersYouth) {
      return { product: 'Joggers', ageGroup: joggersYouth ? 'Kids' : 'Adult', color: coreParts[1] ?? null, size: sizeToken ?? '—' }
    }

    // Rashguards: "Adult Rashguard (Short Sleeve) · Non-Ranked Black · Size M"
    //             "Kids Rashguard · Black · Size S"
    const rashAdult = /^Adult\s+Rashguard/i.test(coreParts[0] ?? '')
    const rashKids  = /^Kids\s+Rashguard/i.test(coreParts[0] ?? '')
    if (rashAdult || rashKids) {
      const sleeveMatch = coreParts[0].match(/\((Short|Long)\s+Sleeve\)/i)
      const sleeve = sleeveMatch ? `${sleeveMatch[1].charAt(0).toUpperCase() + sleeveMatch[1].slice(1).toLowerCase()} Sleeve` : null
      const rawColor = coreParts[1] ?? null
      const color = rawColor ? rawColor.replace(/Non[\s-]?Ranked?/i, 'Unranked') : null
      const ageGroup = rashKids ? 'Kids' : (sleeve ? `Adult · ${sleeve}` : 'Adult')
      return { product: 'Rashguard', ageGroup, color, size: sizeToken ?? '—' }
    }

    // Everything else: flat product, no age group, optional color
    const product = coreParts[0] ?? raw
    const color = coreParts.length > 1 ? coreParts[1] : null
    return { product, ageGroup: null, color, size: sizeToken ?? '—' }
  }

  // ── Hierarchical pivot ──
  // Structure: product → ageGroup (or '__') → color (or '__') → size → qty
  type SizeQty = Record<string, number>
  type ColorEntry = { sizes: SizeQty; qty: number; revenue: number }
  type AgeEntry   = { colors: Record<string, ColorEntry>; qty: number; revenue: number }
  type ProductEntry = { ages: Record<string, AgeEntry>; qty: number; revenue: number }
  const hpivot: Record<string, ProductEntry> = {}

  // Product display order
  const PRODUCT_ORDER = ['Competition Gi', 'Rashguard', 'Grappling Shorts', 'T-Shirt', 'Hoodie', 'Zip Hoodie', 'Crew Neck', 'Joggers', 'Jacket']
  const GI_COLOR_ORDER = ['Royal Blue', 'Black', 'White']
  const AGE_GROUP_ORDER = ['Adult', 'Adult · Short Sleeve', 'Adult · Long Sleeve', 'Kids', '__']
  const ADULT_SIZE_ORDER = ['A00','A0','A1','A2','A3','A3T','A3H','A4','A4T','A4H','A5','F1','F2','F3']
  const KIDS_SIZE_ORDER  = ['M000','M00','M0','M1','M2','M3','M4']
  const APPAREL_SIZE_ORDER = ['XS','S','M','L','XL','2XL','3XL','4XL']
  const RASH_COLOR_ORDER = ['Unranked Black','Unranked White','White Belt','Blue Belt','Purple Belt','Brown Belt','Black Belt']

  function sizeOrderFor(product: string, ageGroup: string | null): string[] {
    if (product === 'Competition Gi') {
      if (ageGroup === 'Adult') return ADULT_SIZE_ORDER
      if (ageGroup === 'Kids')  return KIDS_SIZE_ORDER
    }
    if (ageGroup === 'Kids') return KIDS_SIZE_ORDER
    return APPAREL_SIZE_ORDER
  }

  function sortAgeGroups(ageKeys: string[]): string[] {
    return ageKeys.sort((a, b) => {
      const ai = AGE_GROUP_ORDER.indexOf(a), bi = AGE_GROUP_ORDER.indexOf(b)
      if (ai >= 0 && bi >= 0) return ai - bi
      if (ai >= 0) return -1
      if (bi >= 0) return 1
      return a.localeCompare(b)
    })
  }

  function colorOrderFor(product: string): string[] {
    if (product === 'Competition Gi') return GI_COLOR_ORDER
    if (product === 'Rashguard') return RASH_COLOR_ORDER
    return []
  }

  for (const order of paidOrders) {
    for (const line of order.lines) {
      const { product, ageGroup, color, size } = normalizeLine(line.name)
      const ag = ageGroup ?? '__'
      const cl = color ?? '__'
      if (!hpivot[product]) hpivot[product] = { ages: {}, qty: 0, revenue: 0 }
      const pe = hpivot[product]
      if (!pe.ages[ag]) pe.ages[ag] = { colors: {}, qty: 0, revenue: 0 }
      const ae = pe.ages[ag]
      if (!ae.colors[cl]) ae.colors[cl] = { sizes: {}, qty: 0, revenue: 0 }
      const ce = ae.colors[cl]
      ce.sizes[size] = (ce.sizes[size] ?? 0) + line.qty
      ce.qty += line.qty
      ce.revenue += line.price_minor * line.qty
      ae.qty += line.qty
      ae.revenue += line.price_minor * line.qty
      pe.qty += line.qty
      pe.revenue += line.price_minor * line.qty
    }
  }

  // Sort products: known order first, then alphabetical
  const sortedProducts = Object.keys(hpivot).sort((a, b) => {
    const ai = PRODUCT_ORDER.indexOf(a), bi = PRODUCT_ORDER.indexOf(b)
    if (ai >= 0 && bi >= 0) return ai - bi
    if (ai >= 0) return -1
    if (bi >= 0) return 1
    return a.localeCompare(b)
  })

  // parseLine kept for order-card display (unchanged)
  function parseLine(name: string) {
    const { product, ageGroup, color, size } = normalizeLine(name)
    const baseParts = [product, ageGroup, color].filter(Boolean)
    return { base: baseParts.join(' · '), size }
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'var(--font-oswald), Arial, sans-serif' }}>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-blue-500 text-xs font-bold uppercase tracking-widest mb-1">Admin</p>
            <h1 className="text-3xl font-black uppercase" style={{ fontFamily: 'var(--font-anton), Arial, sans-serif' }}>Team Store</h1>
          </div>
          <Link href="/admin" className="text-gray-500 hover:text-blue-400 text-sm transition-colors">← Admin</Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-gray-800">
          {(['orders', 'products'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 -mb-px ${
                tab === t ? 'border-blue-600 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {t === 'orders' ? `Orders${paidOrders.length ? ` (${paidOrders.length})` : ''}` : 'Products'}
            </button>
          ))}
        </div>

        {/* ── ORDERS TAB ── */}
        {tab === 'orders' && (
          <div>
            {loadingOrders ? (
              <p className="text-gray-500">Loading…</p>
            ) : ordersError ? (
              <p className="text-red-400">Error: {ordersError}</p>
            ) : orders.length === 0 ? (
              <p className="text-gray-500">No orders yet.</p>
            ) : (
              <div className="space-y-8">
                {/* Summary stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Total Orders</p>
                    <p className="text-2xl font-black">{paidOrders.length}</p>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Total Revenue</p>
                    <p className="text-2xl font-black">{fmt(totalRevenue)}</p>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 col-span-2 sm:col-span-1">
                    <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Pending</p>
                    <p className="text-2xl font-black">{orders.filter((o) => o.status === 'pending').length}</p>
                  </div>
                </div>

                {/* Hierarchical inventory breakdown */}
                {sortedProducts.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-blue-500 text-xs font-bold uppercase tracking-widest">Inventory by Product</p>
                    {sortedProducts.map((product) => {
                      const pe = hpivot[product]
                      const ages = sortAgeGroups(Object.keys(pe.ages))
                      const hasAgeGroups = ages.some((ag) => ag !== '__')
                      return (
                        <div key={product} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                          {/* Product header */}
                          <div className="flex items-center justify-between px-5 py-3 bg-gray-800/60 border-b border-gray-700">
                            <p className="font-black uppercase tracking-wide text-sm text-white">{product}</p>
                            <div className="flex items-center gap-4 text-xs">
                              <span className="text-gray-400">{pe.qty} units</span>
                              <span className="text-green-400 font-black">{fmt(pe.revenue)}</span>
                            </div>
                          </div>

                          {ages.map((ag) => {
                            const ae = pe.ages[ag]
                            const ageLabel = ag === '__' ? null : ag
                            const knownColors = colorOrderFor(product)
                            const colorsInOrder = knownColors.length
                              ? [...knownColors.filter((c) => ae.colors[c]), ...Object.keys(ae.colors).filter((c) => !knownColors.includes(c))]
                              : Object.keys(ae.colors)
                            const orderedSizes = sizeOrderFor(product, ageLabel)

                            // Collect all sizes present for this age group
                            const sizesPresent = orderedSizes.filter((s) =>
                              colorsInOrder.some((c) => ae.colors[c]?.sizes[s])
                            )
                            // Fallback: include any sizes not in the order list
                            const extraSizes = [...new Set(colorsInOrder.flatMap((c) => Object.keys(ae.colors[c]?.sizes ?? {})))]
                              .filter((s) => s !== '—' && !orderedSizes.includes(s))
                            const allSizeCols = [...sizesPresent, ...extraSizes]
                            const hasDash = colorsInOrder.some((c) => ae.colors[c]?.sizes['—'])

                            return (
                              <div key={ag}>
                                {hasAgeGroups && (
                                  <div className="px-5 pt-3 pb-1">
                                    <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">{ageLabel}</p>
                                  </div>
                                )}
                                <div className="overflow-x-auto px-5 pb-4 pt-2">
                                  <table className="text-xs w-full" style={{ minWidth: `${200 + allSizeCols.length * 48}px` }}>
                                    <thead>
                                      <tr className="border-b border-gray-700">
                                        <th className="text-left text-gray-500 font-bold uppercase tracking-wider pb-2 pr-4 whitespace-nowrap w-28">Color</th>
                                        {allSizeCols.map((s) => (
                                          <th key={s} className="text-center text-gray-500 font-bold uppercase tracking-wider pb-2 px-1.5 whitespace-nowrap min-w-[36px]">{s}</th>
                                        ))}
                                        {hasDash && <th className="text-center text-gray-600 font-bold pb-2 px-1.5 whitespace-nowrap">?</th>}
                                        <th className="text-center text-gray-400 font-bold uppercase tracking-wider pb-2 px-3 whitespace-nowrap">Total</th>
                                        <th className="text-right text-gray-400 font-bold uppercase tracking-wider pb-2 pl-3 whitespace-nowrap">Rev</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {colorsInOrder.map((color) => {
                                        const ce = ae.colors[color]
                                        const displayColor = color === '__' ? '—' : color
                                        return (
                                          <tr key={color} className="border-t border-gray-800/60">
                                            <td className="py-2 pr-4 text-white font-bold whitespace-nowrap">{displayColor}</td>
                                            {allSizeCols.map((s) => (
                                              <td key={s} className="py-2 px-1.5 text-center">
                                                {ce.sizes[s] ? (
                                                  <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-blue-700/20 text-blue-300 font-black">
                                                    {ce.sizes[s]}
                                                  </span>
                                                ) : (
                                                  <span className="text-gray-800">—</span>
                                                )}
                                              </td>
                                            ))}
                                            {hasDash && (
                                              <td className="py-2 px-1.5 text-center text-gray-600 text-xs">{ce.sizes['—'] ?? '—'}</td>
                                            )}
                                            <td className="py-2 px-3 text-center text-white font-black">{ce.qty}</td>
                                            <td className="py-2 pl-3 text-right text-gray-400 whitespace-nowrap">{fmt(ce.revenue)}</td>
                                          </tr>
                                        )
                                      })}
                                      {/* Age subtotal */}
                                      {hasAgeGroups && colorsInOrder.length > 1 && (
                                        <tr className="border-t border-gray-700">
                                          <td className="py-2 pr-4 text-gray-500 text-xs font-bold uppercase tracking-widest">Subtotal</td>
                                          {allSizeCols.map((s) => {
                                            const tot = colorsInOrder.reduce((sum, c) => sum + (ae.colors[c]?.sizes[s] ?? 0), 0)
                                            return (
                                              <td key={s} className="py-2 px-1.5 text-center">
                                                {tot > 0 ? <span className="text-gray-300 font-black">{tot}</span> : <span className="text-gray-800">—</span>}
                                              </td>
                                            )
                                          })}
                                          {hasDash && <td />}
                                          <td className="py-2 px-3 text-center text-white font-black">{ae.qty}</td>
                                          <td className="py-2 pl-3 text-right text-green-400 font-black whitespace-nowrap">{fmt(ae.revenue)}</td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Order list */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-blue-500 text-xs font-bold uppercase tracking-widest">All Orders</p>
                    <button
                      onClick={() => {
                        const rows = [
                          ['Date', 'Name', 'Email', 'Phone', 'Gym', 'Ship To', 'Items', 'Subtotal', 'Shipping', 'Discount %', 'Total', 'Status', 'Ref'].join(','),
                          ...orders.map((o) => [
                            new Date(o.created_at).toLocaleDateString('en-US'),
                            `"${o.customer_name}"`,
                            o.customer_email || '',
                            o.customer_phone || '',
                            `"${o.customer_gym || ''}"`,
                            `"${o.ship_address || ''}"`,
                            `"${o.lines.map((l) => `${l.name} x${l.qty}`).join('; ')}"`,
                            (o.subtotal_minor / 100).toFixed(2),
                            (o.shipping_minor / 100).toFixed(2),
                            o.discount_pct,
                            (o.total_minor / 100).toFixed(2),
                            o.status,
                            o.external_ref || '',
                          ].join(','))
                        ].join('\n')
                        const blob = new Blob([rows], { type: 'text/csv' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `tc-shop-orders-${new Date().toISOString().slice(0,10)}.csv`
                        a.click()
                        URL.revokeObjectURL(url)
                      }}
                      className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      ↓ CSV
                    </button>
                  </div>
                  {orders.map((order) => (
                    <div key={order.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <p className="font-black uppercase text-sm">{order.customer_name}</p>
                          <p className="text-gray-400 text-xs">{order.customer_email}</p>
                          {order.customer_phone && <p className="text-gray-400 text-xs">{order.customer_phone}</p>}
                          {order.customer_gym && <p className="text-gray-500 text-xs">{order.customer_gym}</p>}
                          {order.ship_address && <p className="text-blue-400 text-xs">📦 {order.ship_address}</p>}
                          <p className="text-gray-600 text-xs mt-0.5">
                            {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                          </p>
                        </div>
                        <div className="text-right shrink-0 flex flex-col items-end gap-1">
                          <div className="flex items-center gap-2">
                            <p className="font-black text-lg">{fmt(order.total_minor)}</p>
                            <button
                              onClick={() => deleteOrder(order.id)}
                              className="text-gray-600 hover:text-red-400 transition-colors text-lg leading-none"
                              title="Delete order"
                            >
                              ×
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${order.status === 'paid' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                              {order.status}
                            </span>
                            {order.status !== 'paid' && (
                              <button
                                onClick={() => resendConfirmation(order.id)}
                                className="text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 border border-blue-700/40 hover:border-blue-500 px-2 py-0.5 rounded transition-colors"
                              >
                                Confirm
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 mt-1">
                        {(() => {
                          // Group lines by product base
                          const groups: Record<string, { base: string; size: string; qty: number; price_minor: number }[]> = {}
                          for (const line of order.lines) {
                            const { base, size } = parseLine(line.name)
                            if (!groups[base]) groups[base] = []
                            groups[base].push({ base, size, qty: line.qty, price_minor: line.price_minor })
                          }
                          return Object.entries(groups).map(([base, items]) => {
                            const groupTotal = items.reduce((s, i) => s + i.price_minor * i.qty, 0)
                            const groupQty = items.reduce((s, i) => s + i.qty, 0)
                            const sizeSummary = items.map(i => `${i.size}${i.qty > 1 ? ` ×${i.qty}` : ''}`).join(' · ')
                            return (
                              <div key={base} className="bg-gray-800/50 rounded-lg px-3 py-2">
                                <div className="flex justify-between items-baseline">
                                  <span className="text-white font-bold text-sm">{base}{groupQty > 1 && items.length === 1 ? ` ×${groupQty}` : ''}</span>
                                  <span className="text-white font-black text-sm ml-4 shrink-0">{fmt(groupTotal)}</span>
                                </div>
                                <p className="text-gray-500 text-xs mt-0.5">{sizeSummary}</p>
                              </div>
                            )
                          })
                        })()}
                        {order.shipping_minor > 0 && (
                          <div className="flex justify-between text-xs px-1">
                            <span className="text-gray-500">Shipping</span>
                            <span className="text-gray-500">{fmt(order.shipping_minor)}</span>
                          </div>
                        )}
                        {order.discount_pct > 0 && (
                          <p className="text-green-500 text-xs px-1">{order.discount_pct}% discount applied</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── PRODUCTS TAB ── */}
        {tab === 'products' && (
          <div>
            {msg && <p className="text-blue-400 text-sm mb-4">{msg}</p>}
            {loadingProducts ? (
              <p className="text-gray-500">Loading…</p>
            ) : loadError ? (
              <p className="text-red-400">Error: {loadError}</p>
            ) : (
              <div className="space-y-3">
                {products.map((p) => (
                  <div key={p.slug} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                    {editing === p.slug ? (
                      <div className="space-y-5">
                        {/* Photo */}
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Product Photo</p>
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                              {previewUrl ? (
                                <Image src={previewUrl} alt={p.name} width={80} height={80} className="w-full h-full object-cover" unoptimized />
                              ) : (
                                <span className="text-gray-600 text-xs text-center px-2">No photo</span>
                              )}
                            </div>
                            <div>
                              <input
                                ref={fileRef}
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0]
                                  if (f) handleUpload(p.slug, f)
                                }}
                              />
                              <button
                                onClick={() => fileRef.current?.click()}
                                disabled={uploading}
                                className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white text-sm font-bold uppercase tracking-wide px-4 py-2 rounded-lg border border-gray-700 transition-colors"
                              >
                                {uploading ? 'Uploading…' : 'Upload Photo'}
                              </button>
                              <p className="text-gray-600 text-xs mt-1">JPG, PNG, or WEBP</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">Name</label>
                            <input
                              value={form.name}
                              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-blue-600 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">Preorder Price ($)</label>
                            <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-blue-600 focus:outline-none" placeholder="49.95" />
                          </div>
                          <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">Regular Price ($) <span className="text-gray-600 normal-case font-normal">(struck out)</span></label>
                            <input type="number" step="0.01" min="0" value={form.regular_price} onChange={(e) => setForm((f) => ({ ...f, regular_price: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-blue-600 focus:outline-none" placeholder="59.95 (optional)" />
                          </div>
                          <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">Shipping ($)</label>
                            <input type="number" step="0.01" min="0" value={form.shipping} onChange={(e) => setForm((f) => ({ ...f, shipping: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-blue-600 focus:outline-none" placeholder="10.00" />
                          </div>
                          <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">Preorder Closes</label>
                            <input type="date" value={form.preorder_closes_at} onChange={(e) => setForm((f) => ({ ...f, preorder_closes_at: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-blue-600 focus:outline-none" />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">Inventory <span className="text-gray-600 normal-case font-normal">(units in stock)</span></label>
                            <input type="number" min="0" value={form.inventory} onChange={(e) => setForm((f) => ({ ...f, inventory: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-blue-600 focus:outline-none" placeholder="Leave blank during preorder" />
                          </div>
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="w-4 h-4 accent-blue-600" />
                          <span className="text-sm text-gray-300">Active (visible in shop)</span>
                        </label>

                        <div className="flex gap-3">
                          <button onClick={() => save(p.slug)} disabled={saving} className="bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white font-bold uppercase tracking-wide text-sm px-5 py-2 rounded-lg transition-colors">
                            {saving ? 'Saving…' : 'Save'}
                          </button>
                          <button onClick={() => setEditing(null)} className="bg-gray-800 hover:bg-gray-700 text-white font-bold uppercase tracking-wide text-sm px-5 py-2 rounded-lg transition-colors">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 justify-between">
                        <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                          {p.image_url ? (
                            <Image src={p.image_url} alt={p.name} width={48} height={48} className="w-full h-full object-cover" unoptimized />
                          ) : (
                            <span className="text-gray-700 text-[10px] text-center">–</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${p.active ? 'bg-green-500' : 'bg-gray-600'}`} />
                            <p className="font-black uppercase text-sm truncate" style={{ fontFamily: 'var(--font-anton), Arial, sans-serif' }}>{p.name}</p>
                          </div>
                          <p className="text-gray-400 text-xs">
                            {fmt(p.price_minor)}
                            {p.regular_price_minor && <span className="line-through text-gray-600 ml-1">{fmt(p.regular_price_minor)}</span>}
                            {' · Shipping '}{fmt(p.shipping_minor)}
                            {p.preorder_closes_at && (
                              <span className={`ml-2 ${isPreorderClosed(p.preorder_closes_at) ? 'text-red-500' : 'text-yellow-500'}`}>
                                · {isPreorderClosed(p.preorder_closes_at) ? 'Closed' : 'Closes'}{' '}
                                {new Date(p.preorder_closes_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            )}
                            {p.inventory != null && <span className="ml-2 text-blue-400">· {p.inventory} in stock</span>}
                          </p>
                        </div>
                        <button onClick={() => startEdit(p)} className="text-blue-500 hover:text-blue-400 text-sm font-bold uppercase tracking-wide transition-colors shrink-0">Edit</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
