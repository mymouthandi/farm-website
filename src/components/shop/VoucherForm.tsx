'use client'

import { useState } from 'react'
import { useCart } from '@/components/cart/CartProvider'
import { Check, ShoppingBag } from 'lucide-react'

interface VoucherAmount {
  amount: number
  label: string
}

export function VoucherForm({ amounts }: { amounts: VoucherAmount[] }) {
  const { addItem } = useCart()
  const [selected, setSelected] = useState<number | null>(null)
  const [recipientName, setRecipientName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [personalMessage, setPersonalMessage] = useState('')
  const [purchaserName, setPurchaserName] = useState('')
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    if (!selected || !recipientName || !purchaserName) return

    const amt = amounts.find((a) => a.amount === selected)
    if (!amt) return

    addItem({
      id: `voucher-${amt.amount}-${Date.now()}`,
      type: 'voucher',
      name: `Gift Voucher - ${amt.label}`,
      price: amt.amount,
      quantity: 1,
      recipientName,
      recipientEmail: recipientEmail || undefined,
      personalMessage: personalMessage || undefined,
    })

    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      setRecipientName('')
      setRecipientEmail('')
      setPersonalMessage('')
      setPurchaserName('')
      setSelected(null)
    }, 2000)
  }

  return (
    <div className="space-y-8">
      {/* Amount selection */}
      <div>
        <h3 className="font-display text-xl text-gray-900 mb-4">Choose an Amount</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {amounts.map((amt) => (
            <button
              key={amt.amount}
              onClick={() => setSelected(amt.amount)}
              className={`py-4 px-3 rounded-xl border-2 text-center font-bold text-lg transition-all ${
                selected === amt.amount
                  ? 'border-farm-green bg-farm-green/5 text-farm-green'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {amt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recipient details */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="purchaserName" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name *
          </label>
          <input
            id="purchaserName"
            type="text"
            required
            value={purchaserName}
            onChange={(e) => setPurchaserName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green outline-none"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Name *
          </label>
          <input
            id="recipientName"
            type="text"
            required
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green outline-none"
            placeholder="Who is this for?"
          />
        </div>
        <div>
          <label htmlFor="recipientEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Email <span className="text-gray-400">(optional)</span>
          </label>
          <input
            id="recipientEmail"
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green outline-none"
            placeholder="Send directly to them"
          />
        </div>
      </div>

      {/* Personal message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Personal Message <span className="text-gray-400">(optional, max 500 chars)</span>
        </label>
        <textarea
          id="message"
          value={personalMessage}
          onChange={(e) => setPersonalMessage(e.target.value.slice(0, 500))}
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green outline-none resize-none"
          placeholder="Add a personal message to your voucher..."
        />
        <p className="text-xs text-gray-400 mt-1">{personalMessage.length}/500</p>
      </div>

      {/* Add to basket */}
      <button
        onClick={handleAdd}
        disabled={!selected || !recipientName || !purchaserName || added}
        className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-white font-semibold transition-all ${
          added
            ? 'bg-farm-green-light'
            : 'bg-farm-green hover:bg-farm-green-dark disabled:opacity-50 disabled:cursor-not-allowed'
        }`}
      >
        {added ? (
          <>
            <Check className="h-5 w-5" />
            Added to Basket
          </>
        ) : (
          <>
            <ShoppingBag className="h-5 w-5" />
            Add to Basket
          </>
        )}
      </button>
    </div>
  )
}
