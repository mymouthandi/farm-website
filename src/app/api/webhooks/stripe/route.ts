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
    const checkoutType = session.metadata?.type

    if (checkoutType === 'shop') {
      // Handle shop/voucher/adoption order
      const orderId = session.metadata?.orderId
      if (orderId) {
        try {
          const payload = await getPayload({ config })
          await payload.update({
            collection: 'orders',
            id: orderId,
            data: {
              status: 'paid',
              stripePaymentIntentId: session.payment_intent,
            },
          })

          // Activate any gift vouchers linked to this order
          const order = await payload.findByID({ collection: 'orders', id: orderId })
          if (order) {
            const voucherItems = ((order as any).items || []).filter(
              (i: any) => i.itemType === 'voucher'
            )
            if (voucherItems.length > 0) {
              const vouchers = await payload.find({
                collection: 'gift-vouchers',
                where: {
                  purchaserEmail: { equals: (order as any).customerEmail },
                  status: { equals: 'pending' },
                },
                limit: 20,
              })
              for (const v of vouchers.docs) {
                await payload.update({
                  collection: 'gift-vouchers',
                  id: String(v.id),
                  data: { status: 'active' },
                })
              }
            }

            // Activate any adoption records
            const adoptionItems = ((order as any).items || []).filter(
              (i: any) => i.itemType === 'adoption'
            )
            if (adoptionItems.length > 0) {
              const adoptions = await payload.find({
                collection: 'adoptions',
                where: {
                  adopterEmail: { equals: (order as any).customerEmail },
                  status: { equals: 'pending' },
                },
                limit: 20,
              })
              for (const a of adoptions.docs) {
                await payload.update({
                  collection: 'adoptions',
                  id: String(a.id),
                  data: { status: 'active' },
                })
              }
            }
          }
        } catch (error) {
          console.error('Failed to process shop order:', error)
        }
      }
    } else {
      // Handle booking
      const bookingId = session.metadata?.bookingId
      const bookingReference = session.metadata?.bookingReference

      if (bookingId) {
        try {
          const payload = await getPayload({ config })

          await payload.update({
            collection: 'bookings',
            id: bookingId,
            data: {
              status: 'confirmed',
              stripePaymentIntentId: session.payment_intent,
            },
          })

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
        }
      }
    }
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as any
    const checkoutType = session.metadata?.type

    if (checkoutType === 'shop') {
      const orderId = session.metadata?.orderId
      if (orderId) {
        try {
          const payload = await getPayload({ config })
          await payload.update({
            collection: 'orders',
            id: orderId,
            data: { status: 'cancelled' },
          })
        } catch (error) {
          console.error('Failed to cancel expired order:', error)
        }
      }
    } else {
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
  }

  return NextResponse.json({ received: true })
}
