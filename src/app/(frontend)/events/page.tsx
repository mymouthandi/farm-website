import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Calendar, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Events & News',
  description:
    'Discover upcoming events, seasonal activities, and the latest news from Rutland Farm Park. From Easter egg hunts to lambing season and summer fairs.',
}

type EventDoc = {
  id: string
  title: string
  excerpt: string
  date: string
  endDate?: string | null
  category: 'event' | 'news' | 'seasonal'
  status: string
}

const FALLBACK_EVENTS = [
  { title: 'Easter Egg Hunt', excerpt: 'Join us for our popular Easter egg hunt across the farm. Fun for all the family!', date: '2026-04-06', endDate: null as string | null, category: 'event' as const },
  { title: 'Lambing Season', excerpt: 'Watch newborn lambs take their first steps. A magical time to visit the farm.', date: '2026-03-15', endDate: '2026-04-30', category: 'seasonal' as const },
  { title: 'Summer Fair', excerpt: 'Our annual summer fair with stalls, games, and farm activities for all ages.', date: '2026-07-18', endDate: null as string | null, category: 'event' as const },
  { title: 'Halloween at the Farm', excerpt: 'Spooky fun for families! Pumpkin carving, fancy dress, and autumnal activities.', date: '2026-10-31', endDate: null as string | null, category: 'seasonal' as const },
  { title: 'New Petting Area Opens', excerpt: 'We\'re excited to announce our expanded petting area with rabbits, guinea pigs, and more!', date: '2026-02-01', endDate: null as string | null, category: 'news' as const },
]

const CATEGORY_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Events', value: 'event' },
  { label: 'News', value: 'news' },
  { label: 'Seasonal', value: 'seasonal' },
] as const

async function getEvents() {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'events',
      where: { status: { equals: 'published' } },
      sort: 'date',
      depth: 0,
      pagination: false,
    })
    return result.docs as EventDoc[]
  } catch {
    return []
  }
}

function getTodayISO() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString().split('T')[0]
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category = 'all' } = await searchParams
  const validCategory = CATEGORY_TABS.some((t) => t.value === category) ? category : 'all'

  const cmsEvents = await getEvents()
  const today = getTodayISO()
  const hasEvents = cmsEvents.length > 0

  const filterByCategory = (events: EventDoc[]) => {
    if (validCategory === 'all') return events
    return events.filter((e) => e.category === validCategory)
  }

  const allEvents = hasEvents ? filterByCategory(cmsEvents) : filterByCategory(FALLBACK_EVENTS.map((e, i) => ({ ...e, id: `fallback-${i}`, status: 'published' })))
  const upcomingEvents = allEvents.filter((e) => e.date >= today)
  const pastEvents = allEvents.filter((e) => e.date < today)

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-farm-sage/30 to-farm-cream/50 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-farm-green-dark">
            Events & News
          </h1>
          <p className="mt-6 text-lg text-gray-700 max-w-2xl mx-auto">
            Discover upcoming events, seasonal highlights, and the latest news from Rutland Farm Park.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="border-b border-gray-200 bg-white/80 sticky top-16 z-40">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex gap-1 overflow-x-auto py-4 scrollbar-hide">
            {CATEGORY_TABS.map((tab) => (
              <Link
                key={tab.value}
                href={`/events${tab.value === 'all' ? '' : `?category=${tab.value}`}`}
                className={cn(
                  'whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  validCategory === tab.value
                    ? 'bg-farm-green text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-farm-green'
                )}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-display text-2xl md:text-3xl text-farm-green-dark mb-10">
            Upcoming Events
          </h2>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} variant="upcoming" />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No upcoming events at the moment. Check back soon!</p>
          )}
        </div>
      </section>

      {/* Past Events */}
      <section className="py-16 md:py-20 bg-farm-cream/30">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-display text-2xl md:text-3xl text-farm-green-dark mb-10">
            Past Events
          </h2>

          {pastEvents.length > 0 ? (
            <div className="space-y-4">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} variant="past" />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No past events to display.</p>
          )}
        </div>
      </section>
    </div>
  )
}

function EventCard({
  event,
  variant,
}: {
  event: EventDoc
  variant: 'upcoming' | 'past'
}) {
  const dateRange =
    event.endDate && event.endDate !== event.date
      ? `${formatDate(event.date)} – ${formatDate(event.endDate)}`
      : formatDate(event.date)
  const isFallback = event.id.startsWith('fallback-')
  const href = isFallback ? '#' : `/events/${event.id}`

  if (variant === 'past') {
    return (
      <Link
        href={href}
        className={cn(
          'flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition-colors hover:bg-farm-cream/50',
          isFallback && 'pointer-events-none'
        )}
      >
        <div className="flex shrink-0 items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{dateRange}</span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg text-farm-green-dark">{event.title}</h3>
          <p className="mt-0.5 text-sm text-gray-600 line-clamp-1">{event.excerpt}</p>
        </div>
        <span className="shrink-0 rounded-full bg-farm-sage/30 px-3 py-0.5 text-xs font-medium text-farm-green-dark capitalize">
          {event.category}
        </span>
        {!isFallback && (
          <ChevronRight className="h-5 w-5 shrink-0 text-farm-green" />
        )}
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        'group block overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.01]',
        isFallback && 'pointer-events-none'
      )}
    >
      <div className="p-6">
        <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-farm-green px-3 py-1.5 text-sm font-semibold text-white">
          <Calendar className="h-4 w-4" />
          {dateRange}
        </div>
        <h3 className="font-display text-xl text-farm-green-dark group-hover:text-farm-green">
          {event.title}
        </h3>
        <p className="mt-2 text-gray-600 line-clamp-2">{event.excerpt}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-farm-sage/30 px-3 py-0.5 text-xs font-medium text-farm-green-dark capitalize">
            {event.category}
          </span>
          {!isFallback && (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-farm-green group-hover:underline">
              Learn more
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
