import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

export const metadata = { title: 'Order Received — Team Curran', robots: 'noindex,nofollow' }

function fmt(minor: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(minor / 100)
}

export default async function ShopSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ checkoutSessionId?: string }>
}) {
  const sp = await searchParams
  const checkoutSessionId = sp.checkoutSessionId

  // Mark order paid and send notifications (best-effort, idempotent)
  if (checkoutSessionId) {
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://teamcurran.com'
      await fetch(`${siteUrl}/api/shop/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkoutSessionId }),
        cache: 'no-store',
      })
    } catch {}
  }

  type OrderRow = { customer_name: string; lines: { name: string; price_minor: number; qty: number }[]; subtotal_minor: number; shipping_minor: number; total_minor: number; discount_pct: number; ship_address: string | null; external_ref: string }
  // Fetch order for display
  let order: OrderRow | null = null
  if (checkoutSessionId) {
    try {
      const db = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false, autoRefreshToken: false } }
      )
      const { data } = await db
        .from('tc_shop_orders')
        .select('customer_name, lines, subtotal_minor, shipping_minor, total_minor, discount_pct, ship_address, external_ref')
        .eq('clover_session_id', checkoutSessionId)
        .single()
      order = data
    } catch {}
  }

  const lines = order?.lines

  return (
    <div
      className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-16"
      style={{ fontFamily: 'var(--font-oswald), Arial, sans-serif' }}
    >
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Image
            src="/Team Curran Circle Logo.png"
            alt="Team Curran"
            width={72}
            height={72}
            className="mx-auto mb-6"
          />
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-700/20 border border-blue-700 mb-5">
            <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-black uppercase mb-2" style={{ fontFamily: 'var(--font-anton), Arial, sans-serif' }}>
            Order Confirmed
          </h1>
          {order?.customer_name && (
            <p className="text-gray-400 text-sm">Thanks, {order.customer_name.split(' ')[0]}! A confirmation email is on its way.</p>
          )}
        </div>

        {lines && lines.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-5 space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Your Order</p>
            {lines.map((line, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-300">{line.name}{line.qty > 1 ? ` ×${line.qty}` : ''}</span>
                <span className="text-white font-bold">{fmt(line.price_minor * line.qty)}</span>
              </div>
            ))}
            {order && order.shipping_minor > 0 && (
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span>{fmt(order.shipping_minor)}</span>
              </div>
            )}
            {order && order.discount_pct > 0 && (
              <p className="text-green-400 text-xs">{order.discount_pct}% BFN discount applied</p>
            )}
            {order && (
              <div className="flex justify-between font-black text-base border-t border-gray-800 pt-2 mt-1">
                <span>Total</span>
                <span>{fmt(order.total_minor)}</span>
              </div>
            )}
            {order && (
              <div className="pt-2 border-t border-gray-800">
                <p className="text-gray-500 text-xs">
                  {order.shipping_minor === 0
                    ? '📍 Gym Pickup · Crystal Lake, IL'
                    : `📦 Ships to: ${order.ship_address || 'your address'}`}
                </p>
              </div>
            )}
          </div>
        )}

        <p className="text-gray-500 text-sm text-center mb-6">
          Questions? Email{' '}
          <a href="mailto:info@bigfrogbjj.com" className="text-blue-400 hover:underline">
            info@bigfrogbjj.com
          </a>
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            href="/shop"
            className="bg-gray-900 border border-gray-700 hover:border-blue-700 text-white font-bold uppercase tracking-wide text-sm px-5 py-3 rounded-xl transition-colors"
          >
            Back to Shop
          </Link>
          <Link
            href="/members"
            className="bg-blue-700 hover:bg-blue-600 text-white font-bold uppercase tracking-wide text-sm px-5 py-3 rounded-xl transition-colors"
          >
            Members Portal
          </Link>
        </div>
      </div>
    </div>
  )
}
