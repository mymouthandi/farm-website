'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, X, Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from './CartProvider'

function formatPrice(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`
}

export function CartButton() {
  const { itemCount } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative p-2 rounded-lg text-gray-700 hover:text-farm-green hover:bg-farm-green/5 transition-colors"
        aria-label="Open cart"
      >
        <ShoppingBag className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-farm-coral text-white text-xs font-bold rounded-full flex items-center justify-center">
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
      </button>

      {open && <CartDrawer onClose={() => setOpen(false)} />}
    </>
  )
}

function CartDrawer({ onClose }: { onClose: () => void }) {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart()

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-display text-xl text-gray-900">
            Your Basket ({itemCount})
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Your basket is empty</p>
              <Link
                href="/shop"
                onClick={onClose}
                className="mt-4 inline-block text-farm-green font-semibold hover:underline"
              >
                Browse the shop
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-gray-50 rounded-xl p-3 border border-gray-100"
                >
                  {/* Placeholder image */}
                  <div className="w-16 h-16 rounded-lg bg-farm-sage/30 flex items-center justify-center shrink-0">
                    <ShoppingBag className="h-6 w-6 text-farm-green-dark/40" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-800 truncate">
                      {item.name}
                    </h3>
                    {item.variant && (
                      <p className="text-xs text-gray-500">{item.variant}</p>
                    )}
                    {item.type === 'adoption' && item.animalName && (
                      <p className="text-xs text-farm-green">Adopting: {item.animalName}</p>
                    )}
                    <p className="text-sm font-bold text-farm-green mt-1">
                      {formatPrice(item.price)}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      {item.type === 'voucher' || item.type === 'adoption' ? (
                        <span className="text-xs text-gray-400">Qty: 1</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-medium w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded border border-farm-green text-farm-green flex items-center justify-center hover:bg-farm-green/10"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-4 space-y-3">
            <div className="flex justify-between text-lg">
              <span className="font-medium text-gray-600">Subtotal</span>
              <span className="font-bold text-gray-900">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-gray-400">Shipping calculated at checkout</p>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full px-6 py-3 bg-farm-green text-white text-center font-semibold rounded-xl hover:bg-farm-green-dark transition-colors"
            >
              Checkout
            </Link>
            <button
              onClick={onClose}
              className="block w-full text-center text-sm text-farm-green font-medium hover:underline"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
