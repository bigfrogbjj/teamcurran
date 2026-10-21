import { createClient } from '@supabase/supabase-js'
import { TC_PRODUCTS, type TCProduct } from './tc-products'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}

export async function getProductsWithPrices(): Promise<TCProduct[]> {
  try {
    const { data: rows } = await adminClient()
      .from('tc_shop_products')
      .select('slug, price_minor, regular_price_minor, shipping_minor')
    if (!rows?.length) return TC_PRODUCTS
    const overrides = new Map(rows.map((r: Record<string, unknown>) => [r.slug as string, r]))
    return TC_PRODUCTS.map((p) => {
      const ov = overrides.get(p.slug) as Record<string, unknown> | undefined
      if (!ov) return p
      return {
        ...p,
        priceMinor: (ov.price_minor as number) ?? p.priceMinor,
        regularPriceMinor: (ov.regular_price_minor as number | null) ?? p.regularPriceMinor,
        shippingMinor: (ov.shipping_minor as number) ?? p.shippingMinor,
      }
    })
  } catch {
    return TC_PRODUCTS
  }
}

export async function getProductWithPrice(slug: string): Promise<TCProduct | null> {
  const products = await getProductsWithPrices()
  return products.find((p) => p.slug === slug) ?? null
}
