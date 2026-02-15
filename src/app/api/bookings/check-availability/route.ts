import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { isClosedDay } from '@/lib/booking'

export async function POST(req: NextRequest) {
  try {
    const { date } = await req.json()

    if (!date) {
      return NextResponse.json({ error: 'Date is required.' }, { status: 400 })
    }

    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Can't book in the past
    if (selectedDate < today) {
      return NextResponse.json({
        available: false,
        reason: 'Cannot book a date in the past.',
      })
    }

    // Check if the farm is closed on this day
    if (isClosedDay(selectedDate)) {
      return NextResponse.json({
        available: false,
        reason: 'The farm is closed on this date.',
      })
    }

    // Get capacity from site settings
    let capacity = 100
    try {
      const payload = await getPayload({ config })
      const settings = await payload.findGlobal({ slug: 'site-settings' })
      capacity = (settings as any).bookingCapacityPerSlot || 100
    } catch {
      // Use default capacity
    }

    // Count existing confirmed bookings for this date
    let bookedCount = 0
    try {
      const payload = await getPayload({ config })
      const bookings = await payload.find({
        collection: 'bookings',
        where: {
          date: { equals: date },
          status: { equals: 'confirmed' },
        },
        limit: 0,
      })

      // Sum up total visitors from all bookings
      for (const booking of bookings.docs) {
        const tickets = (booking as any).tickets || []
        for (const ticket of tickets) {
          // Family tickets count as 4 people, others count per quantity
          const name = (ticket.ticketName || '').toLowerCase()
          const qty = ticket.quantity || 0
          if (name.includes('family')) {
            bookedCount += qty * 4
          } else {
            bookedCount += qty
          }
        }
      }
    } catch {
      // If CMS isn't available, assume availability
    }

    const remaining = Math.max(0, capacity - bookedCount)

    return NextResponse.json({
      available: remaining > 0,
      remaining,
      capacity,
      reason: remaining <= 0 ? 'This date is fully booked.' : undefined,
    })
  } catch (error) {
    console.error('Availability check error:', error)
    return NextResponse.json(
      { error: 'Failed to check availability.' },
      { status: 500 }
    )
  }
}
