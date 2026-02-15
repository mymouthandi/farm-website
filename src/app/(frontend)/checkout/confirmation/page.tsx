import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Mail, MapPin, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Order Confirmed',
  description: 'Your order from Rutland Farm Park has been confirmed.',
}

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>
}) {
  const params = await searchParams
  const orderRef = params.ref || 'N/A'

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="h-10 w-10 text-farm-green" />
        </div>

        <h1 className="font-display text-3xl md:text-4xl text-gray-900 mb-3">
          Order Confirmed!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase from Rutland Farm Park.
        </p>

        <div className="bg-farm-cream rounded-xl p-6 mb-8">
          <p className="text-sm text-farm-brown font-medium mb-1">Order Reference</p>
          <p className="font-mono text-2xl font-bold text-farm-green-dark">{orderRef}</p>
        </div>

        <div className="space-y-3 text-left mb-8">
          <div className="flex items-start gap-3 bg-white rounded-lg p-4 border border-gray-100">
            <Mail className="h-5 w-5 text-farm-green mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-800">Confirmation Email</p>
              <p className="text-sm text-gray-500">
                Order details and any voucher codes have been sent to your email.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white rounded-lg p-4 border border-gray-100">
            <MapPin className="h-5 w-5 text-farm-green mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-800">Collection or Delivery</p>
              <p className="text-sm text-gray-500">
                If collecting, we&apos;ll email you when your order is ready. Deliveries are usually dispatched within 2-3 working days.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="px-6 py-3 rounded-xl bg-farm-green text-white font-semibold hover:bg-farm-green-dark transition-colors inline-flex items-center justify-center gap-2"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl border-2 border-farm-green text-farm-green font-semibold hover:bg-farm-green/5 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
