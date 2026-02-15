import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { BookingWidget } from '@/components/booking/BookingWidget'
import { Ticket, ShieldCheck, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Book Tickets',
  description:
    'Book your tickets online for Rutland Farm Park. Choose your date and ticket types for a great day out.',
}

interface TicketType {
  id: string
  name: string
  description?: string
  weekdayPrice: number
  weekendPrice: number
  maxPerBooking: number
  order: number
}

async function getTicketTypes(): Promise<TicketType[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'ticket-types',
      where: { active: { equals: true } },
      sort: 'order',
      limit: 20,
    })
    return result.docs.map((doc: any) => ({
      id: doc.id,
      name: doc.name,
      description: doc.description || undefined,
      weekdayPrice: doc.weekdayPrice,
      weekendPrice: doc.weekendPrice,
      maxPerBooking: doc.maxPerBooking || 10,
      order: doc.order || 0,
    }))
  } catch {
    // Fallback ticket types matching the current site pricing
    return [
      {
        id: 'adult',
        name: 'Adult',
        weekdayPrice: 1000,
        weekendPrice: 1400,
        maxPerBooking: 10,
        order: 0,
      },
      {
        id: 'child',
        name: 'Child',
        description: 'Under 3s go free',
        weekdayPrice: 1000,
        weekendPrice: 1200,
        maxPerBooking: 10,
        order: 1,
      },
      {
        id: 'family',
        name: 'Family',
        description: '2 Adults, 2 Children / 1 Adult, 3 Children',
        weekdayPrice: 3750,
        weekendPrice: 4750,
        maxPerBooking: 3,
        order: 2,
      },
      {
        id: 'concession',
        name: 'Concession',
        description: 'Registered disabled and carer',
        weekdayPrice: 1500,
        weekendPrice: 1900,
        maxPerBooking: 10,
        order: 3,
      },
    ]
  }
}

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ cancelled?: string }>
}) {
  const ticketTypes = await getTicketTypes()
  const params = await searchParams
  const wasCancelled = params.cancelled === 'true'

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-farm-green-dark to-farm-green py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl text-white mb-4">Book Your Visit</h1>
          <p className="text-farm-sage text-lg max-w-2xl mx-auto">
            Secure your tickets online and skip the queue. Choose your preferred date and ticket
            types below.
          </p>
        </div>
      </section>

      {/* Cancelled notice */}
      {wasCancelled && (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm">
            Your booking was cancelled. No payment was taken. You can start a new booking below.
          </div>
        </div>
      )}

      {/* Info badges */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="p-2 bg-farm-green/10 rounded-lg">
              <Ticket className="h-5 w-5 text-farm-green" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Instant Confirmation</p>
              <p className="text-xs text-gray-500">E-ticket sent to your email</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="p-2 bg-farm-green/10 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-farm-green" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Secure Payment</p>
              <p className="text-xs text-gray-500">Powered by Stripe</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="p-2 bg-farm-green/10 rounded-lg">
              <Clock className="h-5 w-5 text-farm-green" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Under 3s Free</p>
              <p className="text-xs text-gray-500">No ticket needed for under 3s</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking widget */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-16">
        <BookingWidget ticketTypes={ticketTypes} />
      </section>
    </div>
  )
}
