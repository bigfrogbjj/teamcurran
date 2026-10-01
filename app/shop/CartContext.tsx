'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'

export interface CartItem {
  slug: string
  name: string
  colorKey: string | null
  colorLabel: string | null
  imageUrl: string | null
  sizeLabel: string
  priceMinor: number
  shippingMinor: number
}

export interface CartLine extends CartItem {
  qty: number
}

interface CartCtx {
  lines: CartLine[]
  addItem: (item: CartItem, qty: number) => void
  updateQty: (key: string, qty: number) => void
  removeItem: (key: string) => void
  clear: () => void
  totalItems: number
  subtotalMinor: number
}

const Ctx = createContext<CartCtx | null>(null)

function lineKey(item: Pick<CartItem, 'slug' | 'colorKey' | 'sizeLabel'>) {
  return `${item.slug}|${item.colorKey ?? ''}|${item.sizeLabel}`
}

const STORAGE_KEY = 'tc-shop-cart'

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save(lines: CartLine[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  } catch {}
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setLines(load())
    setReady(true)
  }, [])

  const setAndSave = useCallback((next: CartLine[]) => {
    setLines(next)
    save(next)
  }, [])

  const addItem = useCallback(
    (item: CartItem, qty: number) => {
      setLines((prev) => {
        const key = lineKey(item)
        const idx = prev.findIndex((l) => lineKey(l) === key)
        let next: CartLine[]
        if (idx >= 0) {
          next = prev.map((l, i) => (i === idx ? { ...l, qty: l.qty + qty } : l))
        } else {
          next = [...prev, { ...item, qty }]
        }
        save(next)
        return next
      })
    },
    []
  )

  const updateQty = useCallback((key: string, qty: number) => {
    setLines((prev) => {
      const next =
        qty <= 0
          ? prev.filter((l) => lineKey(l) !== key)
          : prev.map((l) => (lineKey(l) === key ? { ...l, qty } : l))
      save(next)
      return next
    })
  }, [])

  const removeItem = useCallback((key: string) => {
    setLines((prev) => {
      const next = prev.filter((l) => lineKey(l) !== key)
      save(next)
      return next
    })
  }, [])

  const clear = useCallback(() => setAndSave([]), [setAndSave])

  const totalItems = lines.reduce((n, l) => n + l.qty, 0)
  const subtotalMinor = lines.reduce((n, l) => n + l.priceMinor * l.qty, 0)

  if (!ready) return null

  return (
    <Ctx.Provider value={{ lines, addItem, updateQty, removeItem, clear, totalItems, subtotalMinor }}>
      {children}
    </Ctx.Provider>
  )
}

export function useCart() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}

export { lineKey }
