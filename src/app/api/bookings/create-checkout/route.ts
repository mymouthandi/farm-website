import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { stripe } from '@/lib/stripe'
import { generateBookingReference, isWeekendPricing, isClosedDay } from '@/lib/booking'

interface TicketSelection {
  ticketTypeId: string
  quantity: number
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      date,
      tickets,
      customerName,
      customerEmail,
      customerPhone,
      specialRequirements,
    }: {
      date: string
      tickets: TicketSelection[]
      customerName: string
      customerEmail: string
      customerPhone?: string
      specialRequirements?: string
    } = body

    // Validate required fields
    if (!date || !tickets?.length || !customerName || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      )
    }

    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      return NextResponse.json({ error: 'Cannot book a past date.' }, { status: 400 })
    }

    if (isClosedDay(selectedDate)) {
      return NextResponse.json({ error: 'The farm is closed on this date.' }, { status: 400 })
    }

    // Fetch ticket types from CMS
    let ticketTypes: any[] = []
    try {
      const payload = await getPayload({ config })
      const result = await payload.find({
        collection: 'ticket-types',
        where: { active: { equals: true } },
        limit: 100,
      })
      ticketTypes = result.docs
    } catch {
      return NextResponse.json(
        { error: 'Unable to fetch ticket types. Please try again.' },
        { status: 500 }
      )
    }

    // Calculate pricing
    const useWeekendPrice = isWeekendPricing(selectedDate)
    const bookingReference = generateBookingReference()

    const lineItems: any[] = []
    const bookingTickets: any[] = []
    let totalAmount = 0

    for (const selection of tickets) {
      if (selection.quantity <= 0) continue

      const ticketType = ticketTypes.find(
        (t: any) => t.id === selection.ticketTypeId
      )
      if (!ticketType) {
        return NextResponse.json(
          { error: `Invalid ticket type: ${selection.ticketTypeId}` },
          { status: 400 }
        )
      }

      if (selection.quantity > (ticketType.maxPerBooking || 10)) {
        return NextResponse.json(
          { error: `Maximum ${ticketType.maxPerBooking || 10} ${ticketType.name} tickets per booking.` },
          { status: 400 }
        )
      }

      const unitPrice = useWeekendPrice
        ? ticketType.weekendPrice
        : ticketType.weekdayPrice

      const subtotal = unitPrice * selection.quantity
      totalAmount += subtotal

      lineItems.push({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: `${ticketType.name} - Rutland Farm Park`,
            description: `${useWeekendPrice ? 'Weekend/Holiday' : 'Weekday'} admission for ${new Date(date).toLocaleDateString('en-GB')}`,
          },
          unit_amount: unitPrice,
        },
        quantity: selection.quantity,
      })

      bookingTickets.push({
        ticketType: ticketType.id,
        ticketName: ticketType.name,
        quantity: selection.quantity,
        unitPrice,
      })
    }

    if (lineItems.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one ticket.' },
        { status: 400 }
      )
    }

    // Create booking record in CMS (pending status)
    let bookingId: string | undefined
    try {
      const payload = await getPayload({ config })
      const booking = await payload.create({
        collection: 'bookings',
        data: {
          bookingReference,
          date,
          tickets: bookingTickets,
          totalAmount,
          customerName,
          customerEmail,
          customerPhone: customerPhone || undefined,
          specialRequirements: specialRequirements || undefined,
          status: 'pending',
        },
      })
      bookingId = booking.id as string
    } catch (dbError) {
      console.error('Failed to create booking record:', dbError)
      return NextResponse.json(
        { error: 'Failed to create booking. Please try again.' },
        { status: 500 }
      )
    }

    // Create Stripe Checkout session
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${siteUrl}/booking/confirmation?ref=${bookingReference}`,
        cancel_url: `${siteUrl}/booking?cancelled=true`,
        customer_email: customerEmail,
        metadata: {
          bookingId: bookingId || '',
          bookingReference,
          date,
        },
      })

      // Update booking with Stripe session ID
      if (bookingId) {
        try {
          const payload = await getPayload({ config })
          await payload.update({
            collection: 'bookings',
            id: bookingId,
            data: {
              stripeSessionId: session.id,
            },
          })
        } catch {
          // Non-critical - continue
        }
      }

      return NextResponse.json({
        sessionId: session.id,
        url: session.url,
        bookingReference,
      })
    } catch (stripeError: any) {
      console.error('Stripe checkout creation failed:', stripeError)
      return NextResponse.json(
        { error: 'Failed to create payment session. Please try again.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
