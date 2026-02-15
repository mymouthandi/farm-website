'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'

interface TicketType {
  id: string
  name: string
  description?: string
  weekdayPrice: number
  weekendPrice: number
  maxPerBooking: number
}

interface TicketSelection {
  ticketTypeId: string
  quantity: number
}

interface TicketSelectorProps {
  ticketTypes: TicketType[]
  isWeekendRate: boolean
  onConfirm: (selections: TicketSelection[]) => void
}

function formatPrice(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`
}

export function TicketSelector({ ticketTypes, isWeekendRate, onConfirm }: TicketSelectorProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    ticketTypes.forEach((t) => {
      initial[t.id] = 0
    })
    return initial
  })

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const ticketType = ticketTypes.find((t) => t.id === id)
      if (!ticketType) return prev
      const newQty = Math.max(0, Math.min(ticketType.maxPerBooking, (prev[id] || 0) + delta))
      return { ...prev, [id]: newQty }
    })
  }

  const totalAmount = ticketTypes.reduce((sum, t) => {
    const qty = quantities[t.id] || 0
    const price = isWeekendRate ? t.weekendPrice : t.weekdayPrice
    return sum + price * qty
  }, 0)

  const totalTickets = Object.values(quantities).reduce((sum, qty) => sum + qty, 0)

  const handleConfirm = () => {
    const selections = ticketTypes
      .filter((t) => (quantities[t.id] || 0) > 0)
      .map((t) => ({
        ticketTypeId: t.id,
        quantity: quantities[t.id],
      }))
    onConfirm(selections)
  }

  return (
    <div>
      <h2 className="font-display text-2xl text-gray-900 mb-2">Select Tickets</h2>
      <p className="text-sm text-gray-500 mb-6">
        {isWeekendRate
          ? 'Weekend, bank holiday & school holiday prices apply.'
          : 'Weekday (term time) prices apply.'}
      </p>

      <div className="space-y-3">
        {ticketTypes.map((ticket) => {
          const price = isWeekendRate ? ticket.weekendPrice : ticket.weekdayPrice
          const qty = quantities[ticket.id] || 0

          return (
            <div
              key={ticket.id}
              className="flex items-center justify-between bg-gray-50 rounded-xl p-4 border border-gray-100"
            >
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-semibold text-gray-800">{ticket.name}</h3>
                  <span className="text-farm-green font-bold">{formatPrice(price)}</span>
                </div>
                {ticket.description && (
                  <p className="text-xs text-gray-500 mt-0.5">{ticket.description}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(ticket.id, -1)}
                  disabled={qty === 0}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label={`Decrease ${ticket.name}`}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-6 text-center font-semibold text-gray-800">{qty}</span>
                <button
                  onClick={() => updateQuantity(ticket.id, 1)}
                  disabled={qty >= ticket.maxPerBooking}
                  className="w-8 h-8 rounded-full border border-farm-green text-farm-green flex items-center justify-center hover:bg-farm-green/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label={`Increase ${ticket.name}`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Total and confirm */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-sm text-gray-500">
            {totalTickets} ticket{totalTickets !== 1 ? 's' : ''} selected
          </p>
          <p className="text-2xl font-bold text-gray-900">{formatPrice(totalAmount)}</p>
        </div>
        <button
          onClick={handleConfirm}
          disabled={totalTickets === 0}
          className="w-full sm:w-auto px-8 py-3 bg-farm-green text-white font-semibold rounded-xl hover:bg-farm-green-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        Under 3s do not need a ticket and enter for free.
      </p>
    </div>
  )
}
