'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface ShopProduct {
  slug: string
  name: string
  price_minor: number
  shipping_minor: number
  preorder_closes_at: string | null
  active: boolean
}

function money(minor: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(minor / 100)
}

export default function AdminShopPage() {
  const [products, setProducts] = useState<ShopProduct[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<ShopProduct>>({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/shop')
      .then((r) => r.json())
      .then((d) => { setProducts(d.products ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function startEdit(p: ShopProduct) {
    setEditing(p.slug)
    setForm({
      name: p.name,
      price_minor: p.price_minor,
      shipping_minor: p.shipping_minor,
      preorder_closes_at: p.preorder_closes_at ? p.preorder_closes_at.slice(0, 10) : '',
      active: p.active,
    })
    setMsg('')
  }

  async function save(slug: string) {
    setSaving(true)
    setMsg('')
    const payload = {
      slug,
      name: form.name,
      price_minor: Number(form.price_minor),
      shipping_minor: Number(form.shipping_minor),
      preorder_closes_at: form.preorder_closes_at
        ? new Date(form.preorder_closes_at + 'T00:00:00Z').toISOString()
        : null,
      active: form.active,
    }
    const res = await fetch('/api/admin/shop', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      setProducts((prev) =>
        prev.map((p) => (p.slug === slug ? { ...p, ...payload, name: payload.name ?? p.name, active: payload.active ?? p.active } : p))
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
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.slug} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                {editing === p.slug ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">Name</label>
                        <input
                          value={form.name ?? ''}
                          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">Preorder Closes</label>
                        <input
                          type="date"
                          value={form.preorder_closes_at ?? ''}
                          onChange={(e) => setForm((f) => ({ ...f, preorder_closes_at: e.target.value }))}
                          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">Price (cents)</label>
                        <input
                          type="number"
                          value={form.price_minor ?? ''}
                          onChange={(e) => setForm((f) => ({ ...f, price_minor: Number(e.target.value) }))}
                          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-blue-600 focus:outline-none"
                        />
                        <p className="text-gray-600 text-xs mt-0.5">{money(Number(form.price_minor ?? 0))}</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">Shipping (cents)</label>
                        <input
                          type="number"
                          value={form.shipping_minor ?? ''}
                          onChange={(e) => setForm((f) => ({ ...f, shipping_minor: Number(e.target.value) }))}
                          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-blue-600 focus:outline-none"
                        />
                        <p className="text-gray-600 text-xs mt-0.5">{money(Number(form.shipping_minor ?? 0))}</p>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.active ?? true}
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
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${p.active ? 'bg-green-500' : 'bg-gray-600'}`} />
                        <p className="font-black uppercase text-sm" style={{ fontFamily: 'var(--font-anton), Arial, sans-serif' }}>{p.name}</p>
                      </div>
                      <p className="text-gray-400 text-xs">
                        {money(p.price_minor)} · Shipping {money(p.shipping_minor)}
                        {p.preorder_closes_at && (
                          <span className="ml-2 text-yellow-500">
                            · Closes {new Date(p.preorder_closes_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        )}
                        {!p.preorder_closes_at && <span className="ml-2 text-gray-600">· No close date</span>}
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
