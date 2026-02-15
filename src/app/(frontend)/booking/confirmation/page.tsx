import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Mail, Calendar, MapPin, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Booking Confirmed',
  description: 'Your booking at Rutland Farm Park has been confirmed.',
}

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>
}) {
  const params = await searchParams
  const bookingRef = params.ref || 'N/A'

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-lg w-full text-center">
        {/* Success icon */}
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="h-10 w-10 text-farm-green" />
        </div>

        <h1 className="font-display text-3xl md:text-4xl text-gray-900 mb-3">
          Booking Confirmed!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for booking with Rutland Farm Park. We can&apos;t wait to see you!
        </p>

        {/* Booking reference */}
        <div className="bg-farm-cream rounded-xl p-6 mb-8">
          <p className="text-sm text-farm-brown font-medium mb-1">Booking Reference</p>
          <p className="font-mono text-2xl font-bold text-farm-green-dark">{bookingRef}</p>
        </div>

        {/* Info cards */}
        <div className="space-y-3 text-left mb-8">
          <div className="flex items-start gap-3 bg-white rounded-lg p-4 border border-gray-100">
            <Mail className="h-5 w-5 text-farm-green mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-800">Confirmation Email</p>
              <p className="text-sm text-gray-500">
                A confirmation email with your booking details has been sent to your email address.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white rounded-lg p-4 border border-gray-100">
            <Calendar className="h-5 w-5 text-farm-green mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-800">On the Day</p>
              <p className="text-sm text-gray-500">
                Simply give your booking reference at the entrance. No need to print anything.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white rounded-lg p-4 border border-gray-100">
            <MapPin className="h-5 w-5 text-farm-green mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-800">Getting Here</p>
              <p className="text-sm text-gray-500">
                Uppingham Road, Oakham, LE15 6JD. Free parking available on site.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-farm-green text-white font-semibold hover:bg-farm-green-dark transition-colors inline-flex items-center justify-center gap-2"
          >
            Back to Home
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/visit"
            className="px-6 py-3 rounded-xl border-2 border-farm-green text-farm-green font-semibold hover:bg-farm-green/5 transition-colors"
          >
            Plan Your Visit
          </Link>
        </div>
      </div>
    </div>
  )
}
