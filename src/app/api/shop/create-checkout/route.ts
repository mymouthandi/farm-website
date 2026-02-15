import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { stripe } from '@/lib/stripe'
import { nanoid } from '@/lib/nanoid'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      items,
      deliveryMethod,
      shippingAddress,
      customerName,
      customerEmail,
      customerPhone,
    } = body

    if (!items?.length || !customerName || !customerEmail) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const orderReference = `RFP-S${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${nanoid(4).toUpperCase()}`
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Build Stripe line items and order items
    const lineItems: any[] = []
    const orderItems: any[] = []
    let subtotal = 0

    for (const item of items) {
      const itemTotal = item.price * item.quantity
      subtotal += itemTotal

      lineItems.push({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: item.name,
            ...(item.variant ? { description: item.variant } : {}),
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      })

      orderItems.push({
        itemType: item.type === 'voucher' ? 'voucher' : item.type === 'adoption' ? 'adoption' : 'product',
        product: item.type === 'product' ? item.productId : undefined,
        name: item.name,
        variant: item.variant || undefined,
        quantity: item.quantity,
        unitPrice: item.price,
      })
    }

    // Calculate shipping
    let shippingCost = 0
    const hasPhysical = items.some(
      (i: any) => i.type === 'product' || i.type === 'adoption'
    )

    if (deliveryMethod === 'shipping' && hasPhysical) {
      // Get shipping settings
      try {
        const payload = await getPayload({ config })
        const settings = await payload.findGlobal({ slug: 'shop-settings' })
        const standardRate = (settings as any)?.shipping?.standardRate || 395
        const freeThreshold = (settings as any)?.shipping?.freeShippingThreshold || 3000
        shippingCost = subtotal >= freeThreshold ? 0 : standardRate
      } catch {
        shippingCost = subtotal >= 3000 ? 0 : 395
      }
    }

    // Add shipping as a line item if applicable
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'gbp',
          product_data: { name: 'Standard Shipping' },
          unit_amount: shippingCost,
        },
        quantity: 1,
      })
    }

    const totalAmount = subtotal + shippingCost

    // Create order in CMS
    let orderId: string | undefined
    try {
      const payload = await getPayload({ config })
      const order = await payload.create({
        collection: 'orders',
        data: {
          orderReference,
          items: orderItems,
          deliveryMethod: deliveryMethod || 'collection',
          shippingAddress: deliveryMethod === 'shipping' ? shippingAddress : undefined,
          shippingCost,
          subtotal,
          totalAmount,
          customerName,
          customerEmail,
          customerPhone: customerPhone || undefined,
          status: 'pending',
        },
      })
      orderId = String(order.id)

      // Create gift voucher records if any voucher items
      for (const item of items) {
        if (item.type === 'voucher') {
          const voucherCode = `RFP-V${nanoid(8).toUpperCase()}`
          const expiresAt = new Date()
          expiresAt.setFullYear(expiresAt.getFullYear() + 1)

          await payload.create({
            collection: 'gift-vouchers',
            data: {
              code: voucherCode,
              amount: item.price,
              remainingBalance: item.price,
              purchaserName: customerName,
              purchaserEmail: customerEmail,
              recipientName: item.recipientName || customerName,
              recipientEmail: item.recipientEmail || undefined,
              personalMessage: item.personalMessage || undefined,
              expiresAt: expiresAt.toISOString(),
              status: 'pending',
            },
          })
        }

        // Create adoption records
        if (item.type === 'adoption') {
          const adoptionRef = `RFP-A${nanoid(6).toUpperCase()}`
          const startsAt = new Date()
          const expiresAt = new Date()
          expiresAt.setFullYear(expiresAt.getFullYear() + 1)

          await payload.create({
            collection: 'adoptions',
            data: {
              adoptionReference: adoptionRef,
              animal: item.animalId,
              tier: item.tierId,
              adopterName: customerName,
              adopterEmail: customerEmail,
              isGift: item.isGift || false,
              giftRecipientName: item.giftRecipientName || undefined,
              shippingAddress: shippingAddress || {
                line1: 'TBC',
                city: 'TBC',
                postcode: 'TBC',
              },
              startsAt: startsAt.toISOString(),
              expiresAt: expiresAt.toISOString(),
              status: 'pending',
            },
          })
        }
      }
    } catch (dbError) {
      console.error('Failed to create order:', dbError)
      return NextResponse.json(
        { error: 'Failed to create order. Please try again.' },
        { status: 500 }
      )
    }

    // Create Stripe Checkout session
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${siteUrl}/checkout/confirmation?ref=${orderReference}`,
        cancel_url: `${siteUrl}/checkout?cancelled=true`,
        customer_email: customerEmail,
        metadata: {
          orderId: orderId || '',
          orderReference,
          type: 'shop',
        },
      })

      // Update order with Stripe session ID
      if (orderId) {
        try {
          const payload = await getPayload({ config })
          await payload.update({
            collection: 'orders',
            id: orderId,
            data: { stripeSessionId: session.id },
          })
        } catch {
          // Non-critical
        }
      }

      return NextResponse.json({
        url: session.url,
        orderReference,
      })
    } catch (stripeError: any) {
      console.error('Stripe error:', stripeError)
      return NextResponse.json(
        { error: 'Failed to create payment session.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
