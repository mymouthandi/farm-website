'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

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

interface BookingFormProps {
  date: string
  tickets: TicketSelection[]
  ticketTypes: TicketType[]
  isWeekendRate: boolean
}

function formatPrice(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`
}

export function BookingForm({ date, tickets, ticketTypes, isWeekendRate }: BookingFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [specialRequirements, setSpecialRequirements] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const selectedTickets = tickets
    .map((t) => {
      const ticketType = ticketTypes.find((tt) => tt.id === t.ticketTypeId)
      if (!ticketType) return null
      const price = isWeekendRate ? ticketType.weekendPrice : ticketType.weekdayPrice
      return {
        ...t,
        name: ticketType.name,
        unitPrice: price,
        subtotal: price * t.quantity,
      }
    })
    .filter(Boolean) as Array<{
    ticketTypeId: string
    quantity: number
    name: string
    unitPrice: number
    subtotal: number
  }>

  const totalAmount = selectedTickets.reduce((sum, t) => sum + t.subtotal, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/bookings/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          tickets: tickets.map((t) => ({
            ticketTypeId: t.ticketTypeId,
            quantity: t.quantity,
          })),
          customerName: name,
          customerEmail: email,
          customerPhone: phone || undefined,
          specialRequirements: specialRequirements || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Failed to create payment session. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Form */}
      <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
        <h2 className="font-display text-2xl text-gray-900 mb-2">Your Details</h2>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green outline-none transition-shadow"
            placeholder="John Smith"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green outline-none transition-shadow"
            placeholder="john@example.com"
          />
          <p className="text-xs text-gray-400 mt-1">Your booking confirmation will be sent here.</p>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green outline-none transition-shadow"
            placeholder="07123 456789"
          />
        </div>

        <div>
          <label htmlFor="special" className="block text-sm font-medium text-gray-700 mb-1">
            Special Requirements
          </label>
          <textarea
            id="special"
            value={specialRequirements}
            onChange={(e) => setSpecialRequirements(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green outline-none transition-shadow resize-none"
            placeholder="Any accessibility needs, dietary requirements for the tea room, etc."
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-farm-green text-white font-semibold rounded-xl hover:bg-farm-green-dark disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ${formatPrice(totalAmount)}`
          )}
        </button>

        <p className="text-xs text-gray-400 text-center">
          You will be redirected to Stripe to complete your payment securely.
        </p>
      </form>

      {/* Order summary */}
      <div className="lg:col-span-2">
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 sticky top-24">
          <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>

          <div className="text-sm space-y-2 mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Date</span>
              <span className="font-medium text-gray-800">{formattedDate}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Pricing</span>
              <span className="font-medium text-gray-800">
                {isWeekendRate ? 'Weekend/Holiday' : 'Weekday'}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3 space-y-2">
            {selectedTickets.map((ticket) => (
              <div key={ticket.ticketTypeId} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {ticket.name} x{ticket.quantity}
                </span>
                <span className="font-medium text-gray-800">{formatPrice(ticket.subtotal)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold text-farm-green">{formatPrice(totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
