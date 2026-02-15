import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, ShoppingBag, Truck, MapPin } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { AddToCartButton } from '@/components/shop/AddToCartButton'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug }, active: { equals: true } },
      limit: 1,
    })
    const product = result.docs[0] as any
    if (!product) return { title: 'Product Not Found' }
    return {
      title: product.name,
      description: product.shortDescription || `Buy ${product.name} from Rutland Farm Park`,
    }
  } catch {
    return { title: 'Shop' }
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let product: any = null
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug }, active: { equals: true } },
      limit: 1,
      depth: 2,
    })
    product = result.docs[0]
  } catch {
    notFound()
  }

  if (!product) notFound()

  const category = typeof product.category === 'object' ? product.category : null
  const hasVariants = product.variants && product.variants.length > 0

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-8">
        <Link href="/shop" className="hover:text-farm-green transition-colors">
          Shop
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        {category && (
          <>
            <Link
              href={`/shop?category=${category.slug}`}
              className="hover:text-farm-green transition-colors"
            >
              {category.name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
          </>
        )}
        <span className="text-gray-800 font-medium">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div className="aspect-square bg-farm-sage/20 rounded-2xl flex items-center justify-center">
          <ShoppingBag className="h-24 w-24 text-farm-green-dark/20" />
        </div>

        {/* Details */}
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-gray-900">{product.name}</h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-farm-green">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {product.shortDescription && (
            <p className="mt-4 text-gray-600 leading-relaxed">{product.shortDescription}</p>
          )}

          {/* Variants */}
          {hasVariants && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Options</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant: any, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700"
                  >
                    {variant.name}
                    {variant.priceOverride
                      ? ` (${formatPrice(variant.priceOverride)})`
                      : ''}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          <div className="mt-4">
            {product.inStock ? (
              <span className="text-sm text-farm-green font-medium">In Stock</span>
            ) : (
              <span className="text-sm text-farm-coral font-medium">Out of Stock</span>
            )}
          </div>

          {/* Add to cart */}
          <div className="mt-6">
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
              showQuantity
            />
          </div>

          {/* Delivery info */}
          <div className="mt-8 space-y-3">
            {product.requiresShipping && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck className="h-5 w-5 text-farm-green shrink-0" />
                <span>Delivery available &middot; Free over £30</span>
              </div>
            )}
            {product.allowCollection && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MapPin className="h-5 w-5 text-farm-green shrink-0" />
                <span>Collect from the farm shop</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
