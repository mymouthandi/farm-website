import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Heart, Gift, Mail, Check } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Adopt an Animal',
  description:
    'Support Rutland Farm Park by adopting one of our animals. Receive a physical adoption pack with certificate, photo, and more.',
}

const fallbackAnimals = [
  { id: 'f1', name: 'Daisy', breed: 'Hereford Cow', shortDescription: 'Friendly cow who loves a gentle scratch behind the ears.' },
  { id: 'f2', name: 'Pippin', breed: 'Shetland Pony', shortDescription: 'Playful pony who is a favourite with young visitors.' },
  { id: 'f3', name: 'Woolly', breed: 'Lincoln Longwool', shortDescription: 'Rare breed sheep with an impressively luxurious fleece.' },
  { id: 'f4', name: 'Patch', breed: 'Gloucester Old Spot', shortDescription: 'Heritage pig with a gentle temperament and distinctive spots.' },
  { id: 'f5', name: 'Luna', breed: 'Alpaca', shortDescription: 'Graceful alpaca who is always curious about new visitors.' },
  { id: 'f6', name: 'Pickles', breed: 'Pygmy Goat', shortDescription: 'Cheeky goat with endless energy and playful antics.' },
]

const fallbackTiers = [
  { id: 'bronze', name: 'Bronze', price: 2500, description: 'A wonderful way to support your favourite animal.', includes: [{ item: 'Adoption certificate' }, { item: 'Photo of your animal' }, { item: 'Fact sheet' }] },
  { id: 'silver', name: 'Silver', price: 5000, description: 'Everything in Bronze plus a cuddly companion.', includes: [{ item: 'Adoption certificate' }, { item: 'Photo of your animal' }, { item: 'Fact sheet' }, { item: 'Cuddly toy' }] },
  { id: 'gold', name: 'Gold', price: 7500, description: 'The ultimate adoption pack with a free family visit.', includes: [{ item: 'Adoption certificate' }, { item: 'Photo of your animal' }, { item: 'Fact sheet' }, { item: 'Cuddly toy' }, { item: 'Free family entry ticket' }] },
]

const animalColors = ['bg-farm-sage/30', 'bg-farm-wheat/30', 'bg-farm-green/10', 'bg-red-50', 'bg-farm-cream', 'bg-farm-brown/10']

async function getAdoptionData() {
  try {
    const payload = await getPayload({ config })
    const [animals, tiers] = await Promise.all([
      payload.find({ collection: 'animals', sort: 'order', limit: 50 }),
      payload.find({ collection: 'adoption-tiers', where: { active: { equals: true } }, sort: 'order', limit: 10 }),
    ])
    return {
      animals: animals.docs.length > 0 ? animals.docs : fallbackAnimals,
      tiers: tiers.docs.length > 0 ? tiers.docs : fallbackTiers,
    }
  } catch {
    return { animals: fallbackAnimals, tiers: fallbackTiers }
  }
}

export default async function AdoptPage() {
  const { animals, tiers } = await getAdoptionData()

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-farm-coral/80 to-red-400 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl text-white mb-4">Adopt an Animal</h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Support Rutland Farm Park and our wonderful animals with a yearly adoption. You&apos;ll
            receive a physical adoption pack posted to your door with a certificate, photo, and
            more.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-7 w-7 text-farm-coral" />
            </div>
            <h3 className="font-display text-lg text-gray-900 mb-2">1. Choose Your Animal</h3>
            <p className="text-sm text-gray-600">Pick the animal you&apos;d like to adopt.</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Gift className="h-7 w-7 text-farm-coral" />
            </div>
            <h3 className="font-display text-lg text-gray-900 mb-2">2. Pick a Tier</h3>
            <p className="text-sm text-gray-600">Choose what&apos;s included in your adoption pack.</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-7 w-7 text-farm-coral" />
            </div>
            <h3 className="font-display text-lg text-gray-900 mb-2">3. Receive Your Pack</h3>
            <p className="text-sm text-gray-600">We&apos;ll post your adoption pack to you.</p>
          </div>
        </div>
      </section>

      {/* Animals */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="font-display text-3xl text-gray-900 text-center mb-8">
          Choose an Animal to Adopt
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {(animals as any[]).map((animal, i) => (
            <Link
              key={animal.id}
              href={`/shop/adopt/${animal.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-farm-coral/30 transition-all"
            >
              <div
                className={`aspect-[4/3] ${animalColors[i % animalColors.length]} flex items-center justify-center`}
              >
                <Heart className="h-12 w-12 text-farm-coral/30 group-hover:scale-110 group-hover:text-farm-coral/50 transition-all" />
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg text-gray-900 group-hover:text-farm-coral transition-colors">
                  {animal.name}
                </h3>
                <p className="text-sm text-farm-brown font-medium">{animal.breed}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {animal.shortDescription || 'A wonderful farm resident looking for an adopter.'}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-farm-coral">
                  Adopt Me
                  <Heart className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tiers preview */}
      <section className="bg-farm-cream/50 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-gray-900 text-center mb-8">
            Adoption Tiers
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {(tiers as any[]).map((tier) => (
              <div
                key={tier.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center"
              >
                <h3 className="font-display text-xl text-gray-900">{tier.name}</h3>
                <p className="text-3xl font-bold text-farm-coral mt-2">
                  {formatPrice(tier.price)}
                </p>
                <p className="text-xs text-gray-500 mb-4">per year</p>
                <p className="text-sm text-gray-600 mb-4">{tier.description}</p>
                <ul className="space-y-2 text-sm text-left">
                  {(tier.includes || []).map((inc: any, j: number) => (
                    <li key={j} className="flex items-center gap-2 text-gray-700">
                      <Check className="h-4 w-4 text-farm-green shrink-0" />
                      {inc.item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
