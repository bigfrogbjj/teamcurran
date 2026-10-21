import { notFound } from 'next/navigation'
import { getProductWithPrice } from '@/lib/tc-shop-prices'
import { ProductDetail } from './ProductDetail'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductWithPrice(slug)
  if (!product) notFound()
  return <ProductDetail product={product} />
}
