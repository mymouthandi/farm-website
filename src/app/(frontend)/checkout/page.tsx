'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/components/cart/CartProvider'
import { ShoppingBag, Truck, MapPin, Loader2, Trash2 } from 'lucide-react'

function formatPrice(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`
}

export default function CheckoutPage() {
  const { items, subtotal, hasPhysicalItems, removeItem, clearCart } = useCart()

  const [deliveryMethod, setDeliveryMethod] = useState<'collection' | 'shipping'>('collection')
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [address, setAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    county: '',
    postcode: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Flat rate shipping: £3.95, free over £30
  const shippingCost =
    deliveryMethod === 'shipping' && hasPhysicalItems
      ? subtotal >= 3000
        ? 0
        : 395
      : 0

  const total = subtotal + shippingCost

  const handleCheckout = async () => {
    if (!customerName || !customerEmail) {
      setError('Please fill in your name and email.')
      return
    }
    if (deliveryMethod === 'shipping' && hasPhysicalItems) {
      if (!address.line1 || !address.city || !address.postcode) {
        setError('Please fill in your delivery address.')
        return
      }
    }

    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/shop/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            type: item.type,
            name: item.name,
            variant: item.variant,
            price: item.price,
            quantity: item.quantity,
            productId: item.productId,
            variantIndex: item.variantIndex,
            animalId: item.animalId,
            animalName: item.animalName,
            tierId: item.tierId,
            tierName: item.tierName,
            isGift: item.isGift,
            giftRecipientName: item.giftRecipientName,
            recipientName: item.recipientName,
            recipientEmail: item.recipientEmail,
            personalMessage: item.personalMessage,
          })),
          deliveryMethod: hasPhysicalItems ? deliveryMethod : 'collection',
          shippingAddress:
            deliveryMethod === 'shipping' && hasPhysicalItems ? address : undefined,
          customerName,
          customerEmail,
          customerPhone: customerPhone || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        return
      }

      if (data.url) {
        clearCart()
        window.location.href = data.url
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="font-display text-2xl text-gray-900 mb-2">Your Basket is Empty</h1>
          <p className="text-gray-500 mb-6">Add some items before checking out.</p>
          <Link
            href="/shop"
            className="px-6 py-3 bg-farm-green text-white font-semibold rounded-xl hover:bg-farm-green-dark transition-colors"
          >
            Browse the Shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl text-gray-900 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3 space-y-8">
          {/* Cart items */}
          <div>
            <h2 className="font-display text-xl text-gray-900 mb-4">Your Basket</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-gray-50 rounded-xl p-4 border border-gray-100"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{item.name}</p>
                    {item.variant && (
                      <p className="text-xs text-gray-500">{item.variant}</p>
                    )}
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-gray-800">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery method */}
          {hasPhysicalItems && (
            <div>
              <h2 className="font-display text-xl text-gray-900 mb-4">Delivery Method</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setDeliveryMethod('collection')}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    deliveryMethod === 'collection'
                      ? 'border-farm-green bg-farm-green/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <MapPin className="h-5 w-5 text-farm-green" />
                  <div className="text-left">
                    <p className="font-semibold text-sm">Collect from Farm</p>
                    <p className="text-xs text-gray-500">Free</p>
                  </div>
                </button>
                <button
                  onClick={() => setDeliveryMethod('shipping')}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    deliveryMethod === 'shipping'
                      ? 'border-farm-green bg-farm-green/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Truck className="h-5 w-5 text-farm-green" />
                  <div className="text-left">
                    <p className="font-semibold text-sm">Delivery</p>
                    <p className="text-xs text-gray-500">
                      {subtotal >= 3000 ? 'Free' : '£3.95'}
                    </p>
                  </div>
                </button>
              </div>

              {deliveryMethod === 'shipping' && (
                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Address Line 1 *"
                      value={address.line1}
                      onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green outline-none text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Address Line 2"
                      value={address.line2}
                      onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green outline-none text-sm"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="City *"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green outline-none text-sm"
                  />
                  <input
                    type="text"
                    placeholder="County"
                    value={address.county}
                    onChange={(e) => setAddress({ ...address, county: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green outline-none text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Postcode *"
                    value={address.postcode}
                    onChange={(e) => setAddress({ ...address, postcode: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green outline-none text-sm"
                  />
                </div>
              )}
            </div>
          )}

          {/* Customer details */}
          <div>
            <h2 className="font-display text-xl text-gray-900 mb-4">Your Details</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Full Name *"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green outline-none text-sm"
              />
              <input
                type="email"
                placeholder="Email *"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green outline-none text-sm"
              />
              <input
                type="tel"
                placeholder="Phone (optional)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 sticky top-24">
            <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>

            <div className="space-y-2 text-sm border-b border-gray-200 pb-3 mb-3">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                </span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              {hasPhysicalItems && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium">
                    {deliveryMethod === 'collection'
                      ? 'Free (collection)'
                      : shippingCost === 0
                        ? 'Free'
                        : formatPrice(shippingCost)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-between text-lg mb-6">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold text-farm-green">{formatPrice(total)}</span>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full px-6 py-3 bg-farm-green text-white font-semibold rounded-xl hover:bg-farm-green-dark disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${formatPrice(total)}`
              )}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              Secure payment powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
