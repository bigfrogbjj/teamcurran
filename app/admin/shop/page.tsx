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
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/admin/shop')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setLoadError(d.error); setLoading(false); return }
        setProducts(d.products ?? [])
        setLoading(false)
      })
      .catch((e) => { setLoadError(String(e)); setLoading(false) })
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

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'var(--font-oswald), Arial, sans-serif' }}>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-blue-500 text-xs font-bold uppercase tracking-widest mb-1">Admin</p>
            <h1 className="text-3xl font-black uppercase" style={{ fontFamily: 'var(--font-anton), Arial, sans-serif' }}>Shop Products</h1>
          </div>
          <Link href="/admin" className="text-gray-500 hover:text-blue-400 text-sm transition-colors">← Admin</Link>
        </div>

        {msg && <p className="text-blue-400 text-sm mb-4">{msg}</p>}

        {loading ? (
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
                      {/* Name */}
                      <div className="sm:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">Name</label>
                        <input
                          value={form.name}
                          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-blue-600 focus:outline-none"
                        />
                      </div>

                      {/* Preorder Price */}
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">Preorder Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={form.price}
                          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-blue-600 focus:outline-none"
                          placeholder="49.95"
                        />
                      </div>

                      {/* Regular Price */}
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">Regular Price ($) <span className="text-gray-600 normal-case font-normal">(shown struck out)</span></label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={form.regular_price}
                          onChange={(e) => setForm((f) => ({ ...f, regular_price: e.target.value }))}
                          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-blue-600 focus:outline-none"
                          placeholder="59.95 (optional)"
                        />
                      </div>

                      {/* Shipping */}
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">Shipping ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={form.shipping}
                          onChange={(e) => setForm((f) => ({ ...f, shipping: e.target.value }))}
                          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-blue-600 focus:outline-none"
                          placeholder="10.00"
                        />
                      </div>

                      {/* Preorder Close Date */}
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">Preorder Closes</label>
                        <input
                          type="date"
                          value={form.preorder_closes_at}
                          onChange={(e) => setForm((f) => ({ ...f, preorder_closes_at: e.target.value }))}
                          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-blue-600 focus:outline-none"
                        />
                      </div>

                      {/* Inventory (always shown, labeled clearly) */}
                      <div className="sm:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">
                          Inventory <span className="text-gray-600 normal-case font-normal">(units in stock — used after preorder closes)</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={form.inventory}
                          onChange={(e) => setForm((f) => ({ ...f, inventory: e.target.value }))}
                          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-blue-600 focus:outline-none"
                          placeholder="Leave blank during preorder"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.active}
                        onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="text-sm text-gray-300">Active (visible in shop)</span>
                    </label>

                    <div className="flex gap-3">
                      <button
                        onClick={() => save(p.slug)}
                        disabled={saving}
                        className="bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white font-bold uppercase tracking-wide text-sm px-5 py-2 rounded-lg transition-colors"
                      >
                        {saving ? 'Saving…' : 'Save'}
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="bg-gray-800 hover:bg-gray-700 text-white font-bold uppercase tracking-wide text-sm px-5 py-2 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 justify-between">
                    {/* Thumbnail */}
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
                        {p.regular_price_minor && (
                          <span className="line-through text-gray-600 ml-1">{fmt(p.regular_price_minor)}</span>
                        )}
                        {' · Shipping '}{fmt(p.shipping_minor)}
                        {p.preorder_closes_at && (
                          <span className={`ml-2 ${isPreorderClosed(p.preorder_closes_at) ? 'text-red-500' : 'text-yellow-500'}`}>
                            · {isPreorderClosed(p.preorder_closes_at) ? 'Closed' : 'Closes'}{' '}
                            {new Date(p.preorder_closes_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        )}
                        {p.inventory != null && (
                          <span className="ml-2 text-blue-400">· {p.inventory} in stock</span>
                        )}
                      </p>
                    </div>

                    <button
                      onClick={() => startEdit(p)}
                      className="text-blue-500 hover:text-blue-400 text-sm font-bold uppercase tracking-wide transition-colors shrink-0"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
