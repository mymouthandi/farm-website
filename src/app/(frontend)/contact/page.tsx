import type { Metadata } from 'next'
import { Phone, Mail, MapPin } from 'lucide-react'
import { ContactForm } from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us',
}

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-farm-green-dark via-farm-green to-farm-green-light">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal text-white drop-shadow-md">
            Contact Us
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/95">
            Get in touch with questions, bookings, or just to say hello
          </p>
        </div>
      </section>

      {/* Two-column layout */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: Contact Form */}
            <div>
              <h2 className="font-display text-2xl text-farm-green-dark mb-6">
                Send us a message
              </h2>
              <ContactForm />
            </div>

            {/* Right: Contact Info */}
            <div className="space-y-6">
              <h2 className="font-display text-2xl text-farm-green-dark mb-6">
                Get in touch
              </h2>

              <div className="space-y-4">
                <a
                  href="tel:01572722122"
                  className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-farm-green/20 transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-farm-green/10 flex items-center justify-center shrink-0 group-hover:bg-farm-green/20">
                    <Phone className="h-6 w-6 text-farm-green" />
                  </div>
                  <div>
                    <p className="font-semibold text-farm-green-dark">Phone</p>
                    <p className="text-farm-green hover:underline">
                      01572 722122
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:info@rutlandfarmpark.com"
                  className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-farm-green/20 transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-farm-green/10 flex items-center justify-center shrink-0 group-hover:bg-farm-green/20">
                    <Mail className="h-6 w-6 text-farm-green" />
                  </div>
                  <div>
                    <p className="font-semibold text-farm-green-dark">Email</p>
                    <p className="text-farm-green hover:underline break-all">
                      info@rutlandfarmpark.com
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-farm-green/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6 text-farm-green" />
                  </div>
                  <div>
                    <p className="font-semibold text-farm-green-dark">Address</p>
                    <p className="text-gray-600">
                      Uppingham Road, Oakham, LE15 6JD
                    </p>
                  </div>
                </div>

                {/* Google Maps placeholder */}
                <div className="aspect-video rounded-xl bg-gray-200 flex items-center justify-center border border-gray-200">
                  <div className="text-center text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm font-medium">Map coming soon</p>
                    <p className="text-xs">Uppingham Road, Oakham, LE15 6JD</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 p-6 rounded-xl bg-farm-cream/60 border border-farm-sage/30">
            <h3 className="font-display text-lg text-farm-green-dark mb-2">
              Birthday parties, group bookings &amp; enquiries
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Planning a birthday party, school visit, or group outing? We&apos;d
              love to hear from you. Use the form above or give us a call to
              discuss availability, pricing, and how we can make your visit
              special.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
