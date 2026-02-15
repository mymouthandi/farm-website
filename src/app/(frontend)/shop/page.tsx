import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Gift, Heart, ShoppingBag, Truck } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { AddToCartButton } from '@/components/shop/AddToCartButton'

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'Browse the Rutland Farm Park shop for merchandise, gifts, gift vouchers, and animal adoption packs.',
}

const placeholderColors = ['bg-farm-green/20', 'bg-farm-wheat/30', 'bg-farm-brown/20', 'bg-farm-sage/30']

const fallbackProducts = [
  { id: 'f1', name: 'Farm Animal Food Bag', slug: 'food-bag', shortDescription: 'A bag of animal feed to share with our friendly residents.', price: 300, compareAtPrice: null },
  { id: 'f2', name: 'Rutland Farm Park Cap', slug: 'cap', shortDescription: 'Embroidered cap with the farm park logo.', price: 1200, compareAtPrice: null },
  { id: 'f3', name: 'Cuddly Sheep Toy', slug: 'cuddly-sheep', shortDescription: 'Soft and huggable Lincoln Longwool plush toy.', price: 1500, compareAtPrice: 1800 },
  { id: 'f4', name: 'Local Honey Jar', slug: 'honey', shortDescription: 'Locally sourced Rutland honey (340g).', price: 750, compareAtPrice: null },
  { id: 'f5', name: 'Farm Park Mug', slug: 'mug', shortDescription: 'Ceramic mug with farm animals illustration.', price: 900, compareAtPrice: null },
  { id: 'f6', name: 'Kids Activity Book', slug: 'activity-book', shortDescription: 'Colouring and activity book featuring our farm animals.', price: 500, compareAtPrice: null },
]

async function getShopData(categorySlug?: string) {
  try {
    const payload = await getPayload({ config })

    const [products, categories, shopSettings] = await Promise.all([
      payload.find({
        collection: 'products',
        where: {
          active: { equals: true },
          ...(categorySlug && categorySlug !== 'all'
            ? {} // filter applied below after fetching
            : {}),
        },
        sort: 'order',
        limit: 100,
      }),
      payload.find({
        collection: 'product-categories',
        sort: 'order',
        limit: 50,
      }),
      payload.findGlobal({ slug: 'shop-settings' }),
    ])

    let filteredProducts = products.docs
    if (categorySlug && categorySlug !== 'all') {
      filteredProducts = products.docs.filter((p: any) => {
        const cat = p.category
        if (typeof cat === 'object' && cat?.slug) return cat.slug === categorySlug
        return false
      })
    }

    return {
      products: filteredProducts,
      categories: categories.docs,
      shopSettings,
    }
  } catch {
    return { products: [], categories: [], shopSettings: null }
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const { products, categories, shopSettings } = await getShopData(params.category)
  const shippingNote = (shopSettings as any)?.shipping?.shippingNote || 'Free delivery on orders over £30'

  const displayProducts = products.length > 0
    ? products.map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        shortDescription: p.shortDescription || '',
        price: p.price,
        compareAtPrice: p.compareAtPrice || null,
        requiresShipping: p.requiresShipping ?? true,
        weight: p.weight || 0,
      }))
    : fallbackProducts

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-farm-green-dark to-farm-green py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl text-white mb-4">Farm Shop</h1>
          <p className="text-farm-sage text-lg max-w-2xl mx-auto">
            Browse our collection of farm merchandise, gifts, and treats. Support the farm while
            taking home a memento of your visit.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm text-white">
            <Truck className="h-4 w-4" />
            {shippingNote}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick links */}
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          <Link
            href="/shop/vouchers"
            className="group flex items-center gap-4 bg-farm-cream rounded-2xl p-6 border border-farm-wheat/30 hover:shadow-lg hover:border-farm-wheat/60 transition-all"
          >
            <div className="w-14 h-14 rounded-xl bg-farm-wheat/30 flex items-center justify-center group-hover:bg-farm-wheat/50 transition-colors">
              <Gift className="h-7 w-7 text-farm-brown" />
            </div>
            <div>
              <h3 className="font-display text-lg text-farm-brown">Gift Vouchers</h3>
              <p className="text-sm text-gray-600">Give the gift of a farm park experience</p>
            </div>
          </Link>
          <Link
            href="/shop/adopt"
            className="group flex items-center gap-4 bg-red-50 rounded-2xl p-6 border border-red-100 hover:shadow-lg hover:border-red-200 transition-all"
          >
            <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <Heart className="h-7 w-7 text-farm-coral" />
            </div>
            <div>
              <h3 className="font-display text-lg text-farm-coral">Adopt an Animal</h3>
              <p className="text-sm text-gray-600">Support our animals with a yearly adoption</p>
            </div>
          </Link>
        </div>

        {/* Category filter */}
        {(categories as any[]).length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            <Link
              href="/shop"
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !params.category || params.category === 'all'
                  ? 'bg-farm-green text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </Link>
            {(categories as any[]).map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  params.category === cat.slug
                    ? 'bg-farm-green text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.map((product: any, i: number) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-farm-green/20 transition-all"
            >
              <Link href={`/shop/${product.slug}`}>
                <div
                  className={`aspect-square ${placeholderColors[i % placeholderColors.length]} flex items-center justify-center`}
                >
                  <ShoppingBag className="h-12 w-12 text-farm-green-dark/30 group-hover:scale-110 transition-transform" />
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/shop/${product.slug}`}>
                  <h3 className="font-display text-base text-gray-900 group-hover:text-farm-green transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {product.shortDescription}
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-farm-green">
                    {formatPrice(product.price)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <AddToCartButton
                    item={{
                      id: `product-${product.id}`,
                      type: 'product',
                      name: product.name,
                      price: product.price,
                      quantity: 1,
                      productId: product.id,
                      requiresShipping: product.requiresShipping ?? true,
                      weight: product.weight || 0,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
