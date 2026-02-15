import Link from 'next/link'
import {
  Heart,
  Calendar,
  Star,
  MapPin,
  Users,
  Coffee,
  Clock,
  ArrowRight,
  ChevronRight,
  Rabbit,
} from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { formatDate } from '@/lib/utils'

const iconMap = {
  heart: Heart,
  calendar: Calendar,
  star: Star,
  'map-pin': MapPin,
  users: Users,
  coffee: Coffee,
} as const

async function getHomepageData() {
  try {
    const payload = await getPayload({ config })

    const [homepage, openingHours, animals, events] = await Promise.all([
      payload.findGlobal({ slug: 'homepage' }),
      payload.findGlobal({ slug: 'opening-hours' }),
      payload
        .find({
          collection: 'animals',
          limit: 4,
          sort: 'order',
        })
        .then((r) => r.docs)
        .catch(() => []),
      payload
        .find({
          collection: 'events',
          where: {
            and: [
              {
                date: {
                  greater_than_equal: new Date().toISOString().split('T')[0],
                },
              },
              { status: { equals: 'published' } },
            ],
          },
          limit: 3,
          sort: 'date',
        })
        .then((r) => r.docs)
        .catch(() => []),
    ])

    return {
      homepage,
      openingHours,
      animals,
      events,
    }
  } catch {
    return {
      homepage: null,
      openingHours: null,
      animals: [],
      events: [],
    }
  }
}

const fallbackHomepage = {
  hero: {
    headline: 'Welcome to Rutland Farm Park',
    subheadline:
      "Visit our 18-acre family-friendly working farm park in the Market town of Oakham, England's smallest County, Rutland.",
    ctaText: 'Plan Your Visit',
    ctaLink: '/visit',
  },
  announcement: { active: false, message: '', type: 'info' },
  highlights: [
    {
      title: 'Animal Encounters',
      description:
        'Get up close with our animals — feed, pet, and learn about them in a safe environment.',
      icon: 'heart',
    },
    {
      title: 'Family Events',
      description:
        'Join us for exciting events throughout the year, perfect for parents and children to enjoy together.',
      icon: 'calendar',
    },
    {
      title: 'Rare Breeds',
      description:
        'Discover rare and heritage breed animals including Lincoln Longwool sheep and Gloucester Old Spot pigs.',
      icon: 'star',
    },
  ],
  animalsSection: {
    heading: 'Meet Our Animals',
    description:
      'At our farm park, visitors can enjoy a delightful encounter with a variety of charming animals. From friendly Hereford cows to playful Shetland ponies, pygmy goats, alpacas, and rare breed sheep and pigs.',
  },
}

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
  todayOverride: { active: false, message: '' },
}

const fallbackAnimals = [
  {
    id: '1',
    name: 'Daisy',
    breed: 'Hereford',
    shortDescription: 'Friendly cow who loves a gentle scratch.',
    slug: 'daisy',
  },
  {
    id: '2',
    name: 'Pippin',
    breed: 'Shetland Pony',
    shortDescription: 'Playful pony perfect for young visitors.',
    slug: 'pippin',
  },
  {
    id: '3',
    name: 'Woolly',
    breed: 'Lincoln Longwool',
    shortDescription: 'Rare breed sheep with luxurious fleece.',
    slug: 'woolly',
  },
  {
    id: '4',
    name: 'Patch',
    breed: 'Gloucester Old Spot',
    shortDescription: 'Heritage pig with a gentle temperament.',
    slug: 'patch',
  },
]

const fallbackEvents = [
  {
    id: '1',
    title: 'Spring Lambing Weekend',
    excerpt: 'Meet our newborn lambs and learn about spring on the farm.',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    slug: 'spring-lambing',
  },
  {
    id: '2',
    title: 'Easter Egg Trail',
    excerpt: 'Hunt for eggs around the farm park this Easter.',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    slug: 'easter-egg-trail',
  },
  {
    id: '3',
    title: 'Farm to Fork Day',
    excerpt: 'Discover where your food comes from with hands-on activities.',
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    slug: 'farm-to-fork',
  },
]

export default async function HomePage() {
  const { homepage, openingHours, animals, events } = await getHomepageData()

  const hero = (homepage as typeof fallbackHomepage)?.hero ?? fallbackHomepage.hero
  const announcement =
    (homepage as typeof fallbackHomepage)?.announcement ?? fallbackHomepage.announcement
  const highlights =
    (homepage as typeof fallbackHomepage)?.highlights ?? fallbackHomepage.highlights
  const animalsSection =
    (homepage as typeof fallbackHomepage)?.animalsSection ?? fallbackHomepage.animalsSection
  const hours = (openingHours as typeof fallbackOpeningHours) ?? fallbackOpeningHours
  const todayOverride = hours?.todayOverride ?? fallbackOpeningHours.todayOverride
  const animalsList = (animals?.length ? animals : fallbackAnimals) as Array<{
    id: string
    name: string
    breed: string
    shortDescription?: string | null
    slug?: string
  }>
  const eventsList = (events?.length ? events : fallbackEvents) as Array<{
    id: string
    title: string
    excerpt: string
    date: string
    slug?: string
  }>

  const announcementBg = {
    info: 'bg-blue-500',
    warning: 'bg-amber-500',
    special: 'bg-purple-600',
  }[announcement?.type || 'info']

  return (
    <div className="flex flex-col">
      {/* Announcement Banner */}
      {announcement?.active && announcement?.message && (
        <div
          className={`${announcementBg} text-white py-2.5 px-4 text-center text-sm font-medium`}
        >
          {announcement.message}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-farm-green-dark via-farm-green to-farm-green-light">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-normal text-white drop-shadow-md">
            {hero.headline}
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-white/95 leading-relaxed">
            {hero.subheadline}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={hero.ctaLink || '/visit'}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-farm-cream text-farm-green-dark font-semibold text-lg shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {hero.ctaText || 'Plan Your Visit'}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border-2 border-white/80 text-white font-semibold text-lg hover:bg-white/20 transition-all duration-300"
            >
              Book Tickets
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Opening Hours Quick Widget */}
      <section className="relative -mt-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
            {todayOverride?.active && todayOverride?.message ? (
              <div className="mb-4 p-4 rounded-lg bg-farm-coral/10 border border-farm-coral/30">
                <p className="font-semibold text-farm-coral flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Today: {todayOverride.message}
                </p>
              </div>
            ) : null}
            <h2 className="font-display text-xl text-farm-green-dark mb-4">Opening Hours</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="font-semibold text-farm-green">{hours?.summer?.label || 'Summer'}</p>
                <p className="text-gray-600">{hours?.summer?.days || 'Tuesday – Sunday'}</p>
                <p className="text-gray-600">{hours?.summer?.hours || '10am – 5pm'}</p>
                <p className="text-sm text-gray-500">
                  Last entry {hours?.summer?.lastEntry || '4:30pm'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-farm-green">{hours?.winter?.label || 'Winter'}</p>
                <p className="text-gray-600">{hours?.winter?.days || 'Tuesday – Sunday'}</p>
                <p className="text-gray-600">{hours?.winter?.hours || '10am – 4pm'}</p>
                <p className="text-sm text-gray-500">
                  Last entry {hours?.winter?.lastEntry || '3:00pm'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 md:py-24 bg-farm-cream/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((item, i) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap] || Star
              return (
                <div
                  key={i}
                  className="group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-farm-green/20 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-xl bg-farm-green/10 flex items-center justify-center mb-6 group-hover:bg-farm-green/20 transition-colors">
                    <Icon className="h-7 w-7 text-farm-green" />
                  </div>
                  <h3 className="font-display text-xl text-farm-green-dark mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Meet Our Animals Preview */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-farm-green-dark mb-4">
              {animalsSection.heading}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {animalsSection.description}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {animalsList.map((animal) => (
              <Link
                key={animal.id}
                href="/animals"
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-farm-green/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-farm-sage to-farm-green-light/30 flex items-center justify-center">
                  <Rabbit className="h-16 w-16 text-farm-green-dark/40 group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg text-farm-green-dark group-hover:text-farm-green transition-colors">
                    {animal.name}
                  </h3>
                  <p className="text-sm text-farm-brown font-medium">{animal.breed}</p>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {animal.shortDescription || 'Meet this lovely farm resident.'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/animals"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-farm-green text-white font-semibold hover:bg-farm-green-dark transition-colors"
            >
              Meet All Our Animals
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview */}
      <section className="py-16 md:py-24 bg-farm-cream/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-farm-green-dark">
              Upcoming Events
            </h2>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-farm-green font-semibold hover:text-farm-green-dark transition-colors"
            >
              View all events
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {eventsList.map((event) => (
              <Link
                key={event.id}
                href="/events"
                className="group flex flex-col sm:flex-row gap-4 p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:border-farm-green/20 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-24 rounded-xl bg-farm-green/10 flex flex-col items-center justify-center p-3">
                  <span className="text-farm-green font-display text-sm leading-tight text-center">
                    {formatDate(event.date)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-xl text-farm-green-dark group-hover:text-farm-green transition-colors">
                    {event.title}
                  </h3>
                  <p className="mt-1 text-gray-600 line-clamp-2">{event.excerpt}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-farm-green flex-shrink-0 self-center group-hover:translate-x-1 transition-transform hidden sm:block" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-farm-green-dark to-farm-green">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
            Plan Your Visit
          </h2>
          <p className="text-lg text-white/90 mb-10 max-w-xl mx-auto">
            Discover opening hours, directions, admission prices, and everything you need for a
            wonderful day at the farm.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/visit"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-farm-cream text-farm-green-dark font-semibold hover:bg-white transition-colors"
            >
              Visit Information
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border-2 border-white/80 text-white font-semibold hover:bg-white/20 transition-colors"
            >
              Book Tickets
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
