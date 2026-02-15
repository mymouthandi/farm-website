import type { Metadata } from 'next'
import Link from 'next/link'
import {
  MapPin,
  Car,
  Train,
  Footprints,
  ArrowRight,
  Clock,
  Coffee,
  Phone,
  Mail,
} from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { formatPrice } from '@/lib/utils'

async function getVisitData() {
  try {
    const payload = await getPayload({ config })

    const [openingHours, ticketTypes, siteSettings] = await Promise.all([
      payload.findGlobal({ slug: 'opening-hours' }),
      payload
        .find({
          collection: 'ticket-types',
          where: { active: { equals: true } },
          sort: 'order',
          limit: 20,
        })
        .then((r) => r.docs)
        .catch(() => []),
      payload.findGlobal({ slug: 'site-settings' }),
    ])

    return { openingHours, ticketTypes, siteSettings }
  } catch {
    return { openingHours: null, ticketTypes: [], siteSettings: null }
  }
}

const fallbackTicketTypes = [
  { name: 'Adult (16+)', description: null, weekdayPrice: 1000, weekendPrice: 1400 },
  { name: 'Child (3–15)', description: null, weekdayPrice: 1000, weekendPrice: 1200 },
  { name: 'Family', description: '2 Adults + 2 Children', weekdayPrice: 3750, weekendPrice: 4750 },
  { name: 'Concession', description: 'Students, seniors, disabled', weekdayPrice: 1500, weekendPrice: 1900 },
]

const fallbackOpeningHours = {
  summer: {
    label: 'Summer',
    days: 'Tuesday – Sunday',
    hours: '10am – 5pm',
    lastEntry: '4:30pm',
    closedDays: 'Monday – CLOSED',
  },
  winter: {
    label: 'Winter',
    days: 'Tuesday – Sunday',
    hours: '10am – 4pm',
    lastEntry: '3:00pm',
    closedDays: 'Monday – CLOSED',
  },
  notes: [
    { note: 'Open on Bank Holiday Mondays' },
    { note: 'Open Mondays during School Holidays' },
    { note: 'Closed Christmas Day and New Years Day' },
  ],
  todayOverride: { active: false, message: '' },
}

const fallbackSiteSettings = {
  contact: {
    email: 'info@rutlandfarmpark.com',
    phone: '01572 722122',
    address: {
      line1: 'Uppingham Road',
      line2: null,
      town: 'Oakham',
      postcode: 'LE15 6JD',
      country: 'United Kingdom',
    },
  },
}

export const metadata: Metadata = {
  title: 'Plan Your Visit',
  description:
    'Find directions, opening hours, admission prices, and visitor information for Rutland Farm Park in Oakham.',
}

export default async function VisitPage() {
  const { openingHours, ticketTypes, siteSettings } = await getVisitData()

  const hours = (openingHours as typeof fallbackOpeningHours) ?? fallbackOpeningHours
  const todayOverride = hours?.todayOverride ?? fallbackOpeningHours.todayOverride
  const tickets =
    (ticketTypes?.length ? ticketTypes : fallbackTicketTypes) as Array<{
      name: string
      description?: string | null
      weekdayPrice: number
      weekendPrice: number
    }>
  const contact =
    (siteSettings as { contact?: typeof fallbackSiteSettings.contact })?.contact ??
    fallbackSiteSettings.contact
  const googleMapsUrl =
    (siteSettings as { googleMapsEmbedUrl?: string })?.googleMapsEmbedUrl ?? null

  const address = contact?.address
  const addressLine = [address?.line1, address?.line2, address?.town, address?.postcode]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="flex flex-col">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-farm-green-dark to-farm-green py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl text-white">
            Plan Your Visit
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
            Everything you need to know for a wonderful day at Rutland Farm Park — directions,
            opening hours, admission, and more.
          </p>
        </div>
      </section>

      {/* How to Find Us */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-farm-green-dark mb-10">
            How to Find Us
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-farm-green/10 flex items-center justify-center">
                  <Car className="h-6 w-6 text-farm-green" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-farm-green-dark mb-2">
                    By Car
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We are located on Uppingham Road, just a 10-minute drive from Oakham town
                    centre. Free parking is available on-site for all visitors.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-farm-green/10 flex items-center justify-center">
                  <Train className="h-6 w-6 text-farm-green" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-farm-green-dark mb-2">
                    By Train
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Oakham station is approximately 15 minutes away on foot. Regular services
                    run to Leicester, Peterborough, and Stansted Airport.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-farm-green/10 flex items-center justify-center">
                  <Footprints className="h-6 w-6 text-farm-green" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-farm-green-dark mb-2">
                    Walking from Town
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    A pleasant 10-minute walk from Oakham town centre. Perfect for combining
                    your farm visit with a spot of lunch or shopping in the market town.
                  </p>
                </div>
              </div>
            </div>

            {/* Google Maps placeholder */}
            <div className="lg:sticky lg:top-24">
              {googleMapsUrl ? (
                <iframe
                  src={googleMapsUrl}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-2xl shadow-lg"
                  title="Rutland Farm Park location"
                />
              ) : (
                <div className="w-full h-[400px] rounded-2xl bg-gray-200 flex flex-col items-center justify-center text-gray-500">
                  <MapPin className="h-16 w-16 mb-4 text-gray-400" />
                  <p className="font-medium">Map placeholder</p>
                  <p className="text-sm mt-1">Add Google Maps embed URL in site settings</p>
                  <p className="text-sm mt-4 text-gray-400">
                    Uppingham Road, Oakham, LE15 6JD
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Opening Hours */}
      <section className="py-16 md:py-24 bg-farm-cream/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-farm-green-dark mb-10">
            Opening Hours
          </h2>

          {todayOverride?.active && todayOverride?.message && (
            <div className="mb-8 p-6 rounded-2xl bg-farm-coral/10 border border-farm-coral/30">
              <p className="font-semibold text-farm-coral flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today: {todayOverride.message}
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="font-display text-xl text-farm-green mb-4">
                {hours?.summer?.label || 'Summer'}
              </h3>
              <p className="text-gray-600">
                {hours?.summer?.days || 'Tuesday – Sunday'}
              </p>
              <p className="text-lg font-medium text-farm-green-dark mt-2">
                {hours?.summer?.hours || '10am – 5pm'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Last entry {hours?.summer?.lastEntry || '4:30pm'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {hours?.summer?.closedDays || 'Monday – CLOSED'}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="font-display text-xl text-farm-green mb-4">
                {hours?.winter?.label || 'Winter'}
              </h3>
              <p className="text-gray-600">
                {hours?.winter?.days || 'Tuesday – Sunday'}
              </p>
              <p className="text-lg font-medium text-farm-green-dark mt-2">
                {hours?.winter?.hours || '10am – 4pm'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Last entry {hours?.winter?.lastEntry || '3:00pm'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {hours?.winter?.closedDays || 'Monday – CLOSED'}
              </p>
            </div>
          </div>

          {hours?.notes?.length ? (
            <div className="mt-8 p-6 rounded-2xl bg-white/80 border border-gray-100">
              <h4 className="font-semibold text-farm-green-dark mb-3">Important Notes</h4>
              <ul className="space-y-2 text-gray-600">
                {(hours.notes as Array<{ note: string }>).map((n, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-farm-green mt-1">•</span>
                    {n.note}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      {/* Admission Prices */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-farm-green-dark mb-4">
            Admission Prices
          </h2>
          <p className="text-gray-600 mb-10 max-w-2xl">
            All prices are per person unless otherwise stated. Under 3s go free. We recommend
            booking online to guarantee entry during peak times.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl border-collapse rounded-2xl overflow-hidden shadow-sm border border-gray-200">
              <thead>
                <tr className="bg-farm-green text-white">
                  <th className="text-left px-6 py-4 font-display text-lg">Ticket Type</th>
                  <th className="text-right px-6 py-4 font-display text-lg">Weekday</th>
                  <th className="text-right px-6 py-4 font-display text-lg">Weekend & Holidays</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-100 last:border-0 bg-white hover:bg-farm-cream/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-farm-green-dark">{ticket.name}</span>
                      {ticket.description && (
                        <p className="text-sm text-gray-500 mt-0.5">{ticket.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      {formatPrice(ticket.weekdayPrice)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      {formatPrice(ticket.weekendPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            * Weekends, bank holidays & school holidays. Under 3s free.
          </p>

          <div className="mt-10">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-farm-green text-white font-semibold hover:bg-farm-green-dark transition-colors"
            >
              Book Tickets Online
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* While You're Here */}
      <section className="py-16 md:py-24 bg-farm-cream/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-farm-green-dark mb-10">
            While You&apos;re Here
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="font-display text-xl text-farm-green-dark mb-4">
                Daily Activities
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Enjoy a full day of farm fun! Feed the animals, explore our trails, take part in
                seasonal activities, and watch demonstrations. Check our events page for special
                themed days and seasonal highlights.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-farm-wheat/20 flex items-center justify-center">
                  <Coffee className="h-6 w-6 text-farm-brown" />
                </div>
                <h3 className="font-display text-xl text-farm-green-dark">
                  Daphne&apos;s Tea Room
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Refuel at Daphne&apos;s Tea Room with homemade cakes, light lunches, and
                refreshments. Our family-friendly café offers a cosy spot to rest during your
                visit. High chairs and children&apos;s portions available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-farm-green-dark mb-10">
            Get in Touch
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <a
              href="https://maps.google.com/?q=Uppingham+Road+Oakham+LE15+6JD"
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-4 hover:opacity-80 transition-opacity"
            >
              <MapPin className="h-6 w-6 text-farm-green flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-farm-green-dark mb-1">Address</h3>
                <p className="text-gray-600">{addressLine || 'Uppingham Road, Oakham, LE15 6JD'}</p>
                <p className="text-gray-600">{contact?.address?.country || 'United Kingdom'}</p>
              </div>
            </a>
            <div className="flex gap-4">
              <Phone className="h-6 w-6 text-farm-green flex-shrink-0 mt-1" />
              <a
                href={`tel:${(contact?.phone || '').replace(/\s/g, '')}`}
                className="hover:text-farm-green transition-colors"
              >
                <h3 className="font-semibold text-farm-green-dark mb-1">Phone</h3>
                <p className="text-gray-600">{contact?.phone || '01572 722122'}</p>
              </a>
            </div>
            <div className="flex gap-4">
              <Mail className="h-6 w-6 text-farm-green flex-shrink-0 mt-1" />
              <a
                href={`mailto:${contact?.email}`}
                className="hover:text-farm-green transition-colors"
              >
                <h3 className="font-semibold text-farm-green-dark mb-1">Email</h3>
                <p className="text-gray-600">{contact?.email || 'info@rutlandfarmpark.com'}</p>
              </a>
            </div>
          </div>

          <div className="mt-10">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-farm-green text-white font-semibold hover:bg-farm-green-dark transition-colors"
            >
              Contact Form
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
