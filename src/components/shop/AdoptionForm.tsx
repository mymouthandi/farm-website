'use client'

import { useState } from 'react'
import { useCart } from '@/components/cart/CartProvider'
import { Check, Heart } from 'lucide-react'

interface Tier {
  id: string
  name: string
  price: number
  description: string
  includes: Array<{ item: string }>
}

interface AdoptionFormProps {
  animalId: string
  animalName: string
  tiers: Tier[]
}

function formatPrice(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`
}

export function AdoptionForm({ animalId, animalName, tiers }: AdoptionFormProps) {
  const { addItem } = useCart()
  const [selectedTier, setSelectedTier] = useState<string>(tiers[0]?.id || '')
  const [adopterName, setAdopterName] = useState('')
  const [adopterEmail, setAdopterEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isGift, setIsGift] = useState(false)
  const [giftRecipientName, setGiftRecipientName] = useState('')
  const [address, setAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    county: '',
    postcode: '',
  })
  const [added, setAdded] = useState(false)

  const currentTier = tiers.find((t) => t.id === selectedTier)

  const handleAdd = () => {
    if (!selectedTier || !adopterName || !adopterEmail || !address.line1 || !address.city || !address.postcode) return
    if (!currentTier) return

    addItem({
      id: `adoption-${animalId}-${selectedTier}`,
      type: 'adoption',
      name: `Adopt ${animalName} - ${currentTier.name}`,
      price: currentTier.price,
      quantity: 1,
      animalId,
      animalName,
      tierId: selectedTier,
      tierName: currentTier.name,
      isGift,
      giftRecipientName: isGift ? giftRecipientName : undefined,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Tier selector */}
      <div>
        <h3 className="font-display text-xl text-gray-900 mb-4">Choose Your Tier</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {tiers.map((tier) => (
            <button
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={`text-left rounded-xl p-4 border-2 transition-all ${
                selectedTier === tier.id
                  ? 'border-farm-coral bg-red-50/50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="font-display text-lg text-gray-900">{tier.name}</h4>
              <p className="text-2xl font-bold text-farm-coral mt-1">{formatPrice(tier.price)}</p>
              <p className="text-xs text-gray-500 mb-3">per year</p>
              <ul className="space-y-1">
                {tier.includes.map((inc, j) => (
                  <li key={j} className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Check className="h-3 w-3 text-farm-green shrink-0" />
                    {inc.item}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </div>

      {/* Adopter details */}
      <div>
        <h3 className="font-display text-xl text-gray-900 mb-4">Your Details</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
            <input
              type="text"
              required
              value={adopterName}
              onChange={(e) => setAdopterName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-farm-coral/30 focus:border-farm-coral outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              required
              value={adopterEmail}
              onChange={(e) => setAdopterEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-farm-coral/30 focus:border-farm-coral outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-farm-coral/30 focus:border-farm-coral outline-none"
            />
          </div>
        </div>
      </div>

      {/* Gift option */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isGift}
            onChange={(e) => setIsGift(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-farm-coral focus:ring-farm-coral"
          />
          <span className="text-sm font-medium text-gray-700">
            This adoption is a gift for someone else
          </span>
        </label>
        {isGift && (
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Name (for the certificate) *
            </label>
            <input
              type="text"
              value={giftRecipientName}
              onChange={(e) => setGiftRecipientName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-farm-coral/30 focus:border-farm-coral outline-none"
            />
          </div>
        )}
      </div>

      {/* Shipping address */}
      <div>
        <h3 className="font-display text-xl text-gray-900 mb-4">
          Delivery Address for Adoption Pack
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
            <input
              type="text"
              required
              value={address.line1}
              onChange={(e) => setAddress({ ...address, line1: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-farm-coral/30 focus:border-farm-coral outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
            <input
              type="text"
              value={address.line2}
              onChange={(e) => setAddress({ ...address, line2: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-farm-coral/30 focus:border-farm-coral outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <input
              type="text"
              required
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-farm-coral/30 focus:border-farm-coral outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">County</label>
            <input
              type="text"
              value={address.county}
              onChange={(e) => setAddress({ ...address, county: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-farm-coral/30 focus:border-farm-coral outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Postcode *</label>
            <input
              type="text"
              required
              value={address.postcode}
              onChange={(e) => setAddress({ ...address, postcode: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-farm-coral/30 focus:border-farm-coral outline-none"
            />
          </div>
        </div>
      </div>

      {/* Add to basket */}
      <button
        onClick={handleAdd}
        disabled={!selectedTier || !adopterName || !adopterEmail || !address.line1 || !address.city || !address.postcode || added}
        className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-white font-semibold transition-all ${
          added
            ? 'bg-farm-green-light'
            : 'bg-farm-coral hover:bg-farm-coral/90 disabled:opacity-50 disabled:cursor-not-allowed'
        }`}
      >
        {added ? (
          <>
            <Check className="h-5 w-5" />
            Added to Basket
          </>
        ) : (
          <>
            <Heart className="h-5 w-5" />
            Adopt {animalName} &mdash; {currentTier ? formatPrice(currentTier.price) : ''}
          </>
        )}
      </button>
    </div>
  )
}
