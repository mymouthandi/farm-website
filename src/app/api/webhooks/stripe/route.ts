import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { stripe } from '@/lib/stripe'
import { sendBookingConfirmation } from '@/lib/email'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature.' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any

    const bookingId = session.metadata?.bookingId
    const bookingReference = session.metadata?.bookingReference

    if (bookingId) {
      try {
        const payload = await getPayload({ config })

        // Update booking status to confirmed
        await payload.update({
          collection: 'bookings',
          id: bookingId,
          data: {
            status: 'confirmed',
            stripePaymentIntentId: session.payment_intent,
          },
        })

        // Fetch the full booking to send confirmation email
        const booking = await payload.findByID({
          collection: 'bookings',
          id: bookingId,
        })

        if (booking) {
          await sendBookingConfirmation({
            customerName: (booking as any).customerName,
            customerEmail: (booking as any).customerEmail,
            bookingReference: (booking as any).bookingReference || bookingReference,
            date: (booking as any).date,
            tickets: ((booking as any).tickets || []).map((t: any) => ({
              ticketName: t.ticketName,
              quantity: t.quantity,
              unitPrice: t.unitPrice,
            })),
            totalAmount: (booking as any).totalAmount,
          })
        }
      } catch (error) {
        console.error('Failed to process booking confirmation:', error)
        // Don't return error to Stripe - acknowledge receipt
      }
    }
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as any
    const bookingId = session.metadata?.bookingId

    if (bookingId) {
      try {
        const payload = await getPayload({ config })
        await payload.update({
          collection: 'bookings',
          id: bookingId,
          data: { status: 'cancelled' },
        })
      } catch (error) {
        console.error('Failed to cancel expired booking:', error)
      }
    }
  }

  return NextResponse.json({ received: true })
}
