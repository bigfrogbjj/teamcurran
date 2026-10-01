export interface TCVariant {
  sku: string
  label: string
}

export interface TCColorVariant {
  key: string
  label: string
  imageUrl: string
  swatch: string
}

export interface TCCustomization {
  enabled: boolean
  feeMinor: number
  namePlaceholder: string
  rankOptions: string[]
}

export interface TCProduct {
  slug: string
  name: string
  tagline: string
  description: string[]
  priceMinor: number
  shippingMinor: number
  imageUrl: string | null
  variants: TCVariant[]
  colorVariants?: TCColorVariant[]
  customization?: TCCustomization
  category: 'training' | 'apparel'
}

function sizes(labels: string[]): TCVariant[] {
  return labels.map((label) => ({ sku: label, label }))
}

const ADULT_SIZES = sizes(['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'])
const KIDS_SIZES = sizes(['XS', 'S', 'M', 'L', 'XL'])
const APPAREL_SIZES = sizes(['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'])

export const TC_PRODUCTS: TCProduct[] = [
  {
    slug: 'adult-rashguard',
    name: 'Adult Rashguard',
    tagline: 'Competition-cut compression rashguard. Choose your rank color, add your name for a custom build.',
    description: [
      'Competition-cut compression rashguard in the 2026 Team Curran design.',
      'Select the color that matches your belt rank. Add your name for a custom build.',
    ],
    priceMinor: 4995,
    shippingMinor: 1000,
    imageUrl: '/rashguards/rashguard-white-belt.webp',
    colorVariants: [
      { key: 'white-belt', label: 'White Belt', imageUrl: '/rashguards/rashguard-white-belt.webp', swatch: '#dc2626' },
      { key: 'blue-belt', label: 'Blue Belt', imageUrl: '/rashguards/rashguard-blue.webp', swatch: '#2563eb' },
      { key: 'purple-belt', label: 'Purple Belt', imageUrl: '/rashguards/rashguard-purple.webp', swatch: '#7c3aed' },
      { key: 'brown-belt', label: 'Brown Belt', imageUrl: '/rashguards/rashguard-brown.webp', swatch: '#78350f' },
      { key: 'black-belt', label: 'Black Belt', imageUrl: '/rashguards/rashguard-black.webp', swatch: '#111111' },
      { key: 'nonranked-black', label: 'Non-Ranked Black', imageUrl: '/rashguards/rashguard-nonranked-black.webp', swatch: '#374151' },
      { key: 'nonranked-white', label: 'Non-Ranked White', imageUrl: '/rashguards/rashguard-white.webp', swatch: '#e5e7eb' },
    ],
    variants: ADULT_SIZES,
    customization: {
      enabled: true,
      feeMinor: 2000,
      namePlaceholder: 'Name on the rashguard',
      rankOptions: ['White', 'Blue', 'Purple', 'Brown', 'Black'],
    },
    category: 'training',
  },
  {
    slug: 'kids-rashguard',
    name: 'Kids Rashguard',
    tagline: 'Youth compression rashguard. Choose your rank color, add a name for a custom build.',
    description: [
      'Youth compression rashguard in the 2026 Team Curran design.',
      'Select the color that matches your belt rank. Add a name for a custom build.',
    ],
    priceMinor: 4495,
    shippingMinor: 1000,
    imageUrl: '/rashguards/rashguard-nonranked-black.webp',
    colorVariants: [
      { key: 'nonranked-black', label: 'Non-Ranked Black', imageUrl: '/rashguards/rashguard-nonranked-black.webp', swatch: '#374151' },
      { key: 'nonranked-white', label: 'Non-Ranked White', imageUrl: '/rashguards/rashguard-white.webp', swatch: '#e5e7eb' },
    ],
    variants: KIDS_SIZES,
    customization: {
      enabled: true,
      feeMinor: 2000,
      namePlaceholder: 'Name on the rashguard',
      rankOptions: ['White', 'Gray', 'Yellow', 'Orange', 'Green'],
    },
    category: 'training',
  },
  {
    slug: 'adult-shorts',
    name: 'Adult Grappling Shorts',
    tagline: 'No-gi grappling shorts with a flexible 4-way stretch panel.',
    description: ['No-gi grappling shorts with a flexible 4-way stretch panel.'],
    priceMinor: 4995,
    shippingMinor: 1000,
    imageUrl: null,
    variants: ADULT_SIZES,
    category: 'training',
  },
  {
    slug: 'kids-shorts',
    name: 'Kids Grappling Shorts',
    tagline: 'Youth no-gi grappling shorts built to move.',
    description: ['Youth no-gi grappling shorts built to move.'],
    priceMinor: 4495,
    shippingMinor: 1000,
    imageUrl: null,
    variants: KIDS_SIZES,
    category: 'training',
  },
  {
    slug: 'tc-tee',
    name: 'Team Curran T-Shirt',
    tagline: 'Everyday cotton tee in the Team Curran design.',
    description: ['Everyday cotton tee in the Team Curran design.'],
    priceMinor: 2500,
    shippingMinor: 1000,
    imageUrl:
      'https://cxdbvexbceeszmjnrojb.supabase.co/storage/v1/object/public/shop-images/products/309324c4-ebee-4644-ba47-e0a1f43898d5/1790694819397-p2cfho.png',
    variants: APPAREL_SIZES,
    category: 'apparel',
  },
  {
    slug: 'tc-hoodie',
    name: 'Team Curran Hoodie',
    tagline: 'Fleece hoodie in the Team Curran design.',
    description: ['Fleece crew-neck sweatshirt.'],
    priceMinor: 4500,
    shippingMinor: 1000,
    imageUrl:
      'https://cxdbvexbceeszmjnrojb.supabase.co/storage/v1/object/public/shop-images/products/0b34e7c3-dc36-4628-be04-d0a49f6e13bf/1790695785216-pvvfi7.png',
    variants: APPAREL_SIZES,
    category: 'apparel',
  },
  {
    slug: 'tc-sweatpants',
    name: 'Team Curran Sweatpants',
    tagline: 'Fleece jogger with the Team Curran mark.',
    description: ['Fleece jogger with the Team Curran mark.'],
    priceMinor: 6500,
    shippingMinor: 1000,
    imageUrl:
      'https://cxdbvexbceeszmjnrojb.supabase.co/storage/v1/object/public/shop-images/products/b700972e-ea0d-4f75-95b5-956ffcc919b7/1790696061748-jknppf.png',
    variants: APPAREL_SIZES,
    category: 'apparel',
  },
]

export function money(minor: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(minor / 100)
}

export function discounted(minor: number, pct: number): number {
  if (pct <= 0) return minor
  return Math.round(minor * (100 - pct) / 100)
}
