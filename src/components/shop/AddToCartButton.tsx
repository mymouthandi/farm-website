'use client'

import { useState } from 'react'
import { ShoppingBag, Check, Minus, Plus } from 'lucide-react'
import { useCart, type CartItem } from '@/components/cart/CartProvider'

interface AddToCartButtonProps {
  item: CartItem
  showQuantity?: boolean
}

export function AddToCartButton({ item, showQuantity = false }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const handleAdd = () => {
    addItem({ ...item, quantity })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="flex items-center gap-2">
      {showQuantity && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-6 text-center font-medium text-sm">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 rounded-full border border-farm-green text-farm-green flex items-center justify-center hover:bg-farm-green/10"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      )}
      <button
        onClick={handleAdd}
        disabled={added}
        className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
          added
            ? 'bg-farm-green-light text-white'
            : 'bg-farm-green text-white hover:bg-farm-green-dark'
        }`}
      >
        {added ? (
          <>
            <Check className="h-4 w-4" />
            Added
          </>
        ) : (
          <>
            <ShoppingBag className="h-4 w-4" />
            Add to Basket
          </>
        )}
      </button>
    </div>
  )
}
