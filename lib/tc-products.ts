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

export interface TCSleeveVariant {
  key: 'short' | 'long'
  label: string
  colorVariants: TCColorVariant[]
  imageUrl: string
}

export interface TCProduct {
  slug: string
  name: string
  tagline: string
  description: string[]
  priceMinor: number
  regularPriceMinor?: number
  shippingMinor: number
  imageUrl: string | null
  variants: TCVariant[]
  colorVariants?: TCColorVariant[]
  sleeveVariants?: TCSleeveVariant[]
  customization?: TCCustomization
  category: 'training' | 'apparel'
}

function sizes(labels: string[]): TCVariant[] {
  return labels.map((label) => ({ sku: label, label }))
}

const ADULT_SIZES = sizes(['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'])
const KIDS_SIZES = sizes(['XS', 'S', 'M', 'L', 'XL'])
const APPAREL_SIZES = sizes(['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'])
const YOUTH_APPAREL_SIZES = sizes(['XS', 'S', 'M', 'L', 'XL'])

const TEE_COLORS: TCColorVariant[] = [
  { key: 'black', label: 'Black', imageUrl: '/tshirt-black.png', swatch: '#1a1a1a' },
  { key: 'dark-heather-grey', label: 'Dark Heather Grey', imageUrl: '/tshirt-grey.png', swatch: '#4a4a4a' },
  { key: 'heather-columbia-blue', label: 'Heather Columbia Blue', imageUrl: '/tshirt-blue.png', swatch: '#6fa8dc' },
]

// Gi sizes — Standard, Husky, Tall, Female (no Fitted), Kids
const GI_ADULT_SIZES = sizes([
  'A00','A0','A1','A2','A3','A4','A5',
  'A0H','A1H','A2H','A3H','A4H',
  'A1T','A2T','A3T',
  'F1','F2','F3',
])
const GI_KIDS_SIZES = sizes(['M000','M00','M0','M1','M2','M3','M4'])

const GI_COLORS: TCColorVariant[] = [
  { key: 'white', label: 'White', imageUrl: '/gi-white.jpg', swatch: '#f5f5f0' },
  { key: 'blue',  label: 'Royal Blue', imageUrl: '/gi-blue.jpg',  swatch: '#1f3a93' },
  { key: 'black', label: 'Black', imageUrl: '/gi-black.jpg', swatch: '#1a1a1a' },
]

export const TC_PRODUCTS: TCProduct[] = [
  {
    slug: 'adult-rashguard',
    name: 'Adult Rashguard',
    tagline: 'Competition-cut compression rashguard. Choose your sleeve length and rank color.',
    description: [
      'Competition-cut compression rashguard in the 2026 Team Curran design.',
      'Available in short sleeve and long sleeve. Select the color that matches your belt rank.',
    ],
    priceMinor: 4995,
    shippingMinor: 1000,
    imageUrl: '/rashguards/rashguard-nonranked-black.png',
    sleeveVariants: [
      {
        key: 'short',
        label: 'Short Sleeve',
        imageUrl: '/rashguards/rashguard-nonranked-black.png',
        colorVariants: [
          { key: 'nonranked-black', label: 'Non-Ranked Black', imageUrl: '/rashguards/rashguard-nonranked-black.png', swatch: '#374151' },
          { key: 'nonranked-white', label: 'Non-Ranked White', imageUrl: '/rashguards/rashguard-nonranked-white.png', swatch: '#e5e7eb' },
          { key: 'white-belt',      label: 'White Belt',       imageUrl: '/rashguards/rashguard-white-belt.png',     swatch: '#f3f4f6' },
          { key: 'blue-belt',       label: 'Blue Belt',        imageUrl: '/rashguards/rashguard-blue.png',           swatch: '#2563eb' },
          { key: 'purple-belt',     label: 'Purple Belt',      imageUrl: '/rashguards/rashguard-purple.png',         swatch: '#7c3aed' },
          { key: 'brown-belt',      label: 'Brown Belt',       imageUrl: '/rashguards/rashguard-brown.png',          swatch: '#78350f' },
          { key: 'black-belt',      label: 'Black Belt',       imageUrl: '/rashguards/rashguard-black-belt.png',     swatch: '#dc2626' },
        ],
      },
      {
        key: 'long',
        label: 'Long Sleeve',
        imageUrl: '/rashguards/rashguard-ls-nonranked-black.png',
        colorVariants: [
          { key: 'nonranked-black', label: 'Non-Ranked Black', imageUrl: '/rashguards/rashguard-ls-nonranked-black.png', swatch: '#374151' },
          { key: 'nonranked-white', label: 'Non-Ranked White', imageUrl: '/rashguards/rashguard-ls-nonranked-white.png', swatch: '#f3f4f6' },
          { key: 'white-belt',      label: 'White Belt',       imageUrl: '/rashguards/rashguard-ls-white-belt.png',     swatch: '#e5e7eb' },
          { key: 'blue-belt',       label: 'Blue Belt',        imageUrl: '/rashguards/rashguard-ls-blue-belt.png',      swatch: '#2563eb' },
          { key: 'purple-belt',     label: 'Purple Belt',      imageUrl: '/rashguards/rashguard-ls-purple-belt.png',    swatch: '#7c3aed' },
          { key: 'brown-belt',      label: 'Brown Belt',       imageUrl: '/rashguards/rashguard-ls-brown-belt.png',     swatch: '#78350f' },
          { key: 'black-belt',      label: 'Black Belt',       imageUrl: '/rashguards/rashguard-ls-black-belt.png',     swatch: '#dc2626' },
        ],
      },
    ],
    variants: ADULT_SIZES,
    category: 'training',
  },
  {
    slug: 'kids-rashguard',
    name: 'Kids Rashguard',
    tagline: 'Youth compression rashguard. Choose your rank color.',
    description: ['Youth compression rashguard in the 2026 Team Curran design.'],
    priceMinor: 4495,
    shippingMinor: 1000,
    imageUrl: '/rashguards/rashguard-nonranked-black.png',
    colorVariants: [
      { key: 'black', label: 'Black', imageUrl: '/rashguards/rashguard-nonranked-black.png', swatch: '#374151' },
      { key: 'white', label: 'White', imageUrl: '/rashguards/rashguard-nonranked-white.png', swatch: '#e5e7eb' },
    ],
    variants: KIDS_SIZES,
    category: 'training',
  },
  {
    slug: 'adult-shorts',
    name: 'Adult Grappling Shorts',
    tagline: 'No-gi grappling shorts with a flexible 4-way stretch panel.',
    description: ['No-gi grappling shorts with a flexible 4-way stretch panel.'],
    priceMinor: 4995,
    shippingMinor: 1000,
    imageUrl: '/shorts.png',
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
    imageUrl: '/shorts.png',
    variants: KIDS_SIZES,
    category: 'training',
  },
  {
    slug: 'tc-gi-adult',
    name: 'Competition Gi — Adult',
    tagline: 'Pearl-weave jacket, ripstop pant. IBJJF competition-legal cut.',
    description: [
      '450gsm pearl-weave jacket with reinforced seams and a ripstop pant.',
      'IBJJF competition-legal cut, pre-shrunk, with embroidered Team Curran detailing.',
      'Available in Standard, Husky, Tall, and Female fits.',
    ],
    priceMinor: 16900,
    shippingMinor: 1500,
    imageUrl: '/gi-white.jpg',
    colorVariants: GI_COLORS,
    variants: GI_ADULT_SIZES,
    category: 'training',
  },
  {
    slug: 'tc-gi-kids',
    name: 'Competition Gi — Kids',
    tagline: 'Pearl-weave jacket, ripstop pant. Built for young competitors.',
    description: [
      '450gsm pearl-weave jacket with reinforced seams and a ripstop pant.',
      'IBJJF competition-legal cut with embroidered Team Curran detailing.',
    ],
    priceMinor: 12900,
    shippingMinor: 1500,
    imageUrl: '/gi-white.jpg',
    colorVariants: GI_COLORS,
    variants: GI_KIDS_SIZES,
    category: 'training',
  },
  // ── Apparel ────────────────────────────────────────────────
  {
    slug: 'tc-tee',
    name: 'Adult T-Shirt',
    tagline: 'Next Level CVC unisex tee. Three colorways.',
    description: ['Next Level Unisex CVC Tee in the 2026 Team Curran design. Available in Black, Dark Heather Grey, and Heather Columbia Blue.'],
    priceMinor: 2995,
    shippingMinor: 1000,
    imageUrl: '/tshirt-black.png',
    colorVariants: TEE_COLORS,
    variants: APPAREL_SIZES,
    category: 'apparel',
  },
  {
    slug: 'tc-kids-tee',
    name: 'Youth T-Shirt',
    tagline: 'Hanes Youth Essential-T in the Team Curran design.',
    description: ['Hanes Youth Essential-T in the 2026 Team Curran design. Black only.'],
    priceMinor: 2495,
    shippingMinor: 1000,
    imageUrl: '/tshirt-black.png',
    variants: YOUTH_APPAREL_SIZES,
    category: 'apparel',
  },
  {
    slug: 'tc-crewneck',
    name: 'Adult Crew Neck',
    tagline: 'Fleece crew neck sweatshirt in the Team Curran design.',
    description: ['Fleece crew neck sweatshirt in the 2026 Team Curran design. Black only.'],
    priceMinor: 4995,
    shippingMinor: 1000,
    imageUrl: '/crewneck.png',
    variants: APPAREL_SIZES,
    category: 'apparel',
  },
  {
    slug: 'tc-hoodie',
    name: 'Adult Hoodie',
    tagline: 'Tultex unisex fleece pullover hoodie. Black only.',
    description: ['Tultex Unisex Fleece Hooded Sweatshirt in the 2026 Team Curran design. Black only.'],
    priceMinor: 4995,
    shippingMinor: 1000,
    imageUrl: '/hoodie.png',
    variants: APPAREL_SIZES,
    category: 'apparel',
  },
  {
    slug: 'tc-zip-hoodie',
    name: 'Adult Zip Hoodie',
    tagline: 'Full-zip fleece hoodie in the Team Curran design. Black only.',
    description: ['Full-zip fleece hoodie in the 2026 Team Curran design. Black only.'],
    priceMinor: 4995,
    shippingMinor: 1000,
    imageUrl: '/zip-hoodie.png',
    variants: APPAREL_SIZES,
    category: 'apparel',
  },
  {
    slug: 'tc-kids-hoodie',
    name: 'Youth Hoodie',
    tagline: 'Gildan Youth Softstyle midweight hoodie. Black only.',
    description: ['Gildan Youth Softstyle® Midweight Hooded Sweatshirt in the 2026 Team Curran design. Black only.'],
    priceMinor: 4495,
    shippingMinor: 1000,
    imageUrl: '/hoodie.png',
    variants: YOUTH_APPAREL_SIZES,
    category: 'apparel',
  },
  {
    slug: 'tc-joggers',
    name: 'Adult Joggers',
    tagline: 'Lane Seven unisex urban jogger with the Team Curran mark.',
    description: ['Lane Seven Unisex Urban Joggers in the 2026 Team Curran design.'],
    priceMinor: 4995,
    shippingMinor: 1000,
    imageUrl: '/sweatpants.png',
    variants: APPAREL_SIZES,
    category: 'apparel',
  },
  {
    slug: 'tc-kids-joggers',
    name: 'Youth Joggers',
    tagline: 'Gildan Youth Heavy Blend sweatpants with the Team Curran mark.',
    description: ['Gildan Youth Heavy Blend™ Sweatpants in the 2026 Team Curran design.'],
    priceMinor: 4495,
    shippingMinor: 1000,
    imageUrl: '/sweatpants.png',
    variants: YOUTH_APPAREL_SIZES,
    category: 'apparel',
  },
  {
    slug: 'tc-jacket',
    name: 'Adult Jacket',
    tagline: 'Harriton fleece-lined nylon jacket. Black only.',
    description: ['Harriton Unisex Fleece Lined Nylon Jacket in the 2026 Team Curran design. Black only.'],
    priceMinor: 9495,
    shippingMinor: 1000,
    imageUrl: '/jacket.png',
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
