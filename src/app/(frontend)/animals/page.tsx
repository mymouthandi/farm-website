import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { PawPrint, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Our Animals',
  description:
    'Meet the wonderful variety of animals at Rutland Farm Park. From fluffy alpacas to friendly donkeys, discover our resident animals and rare breeds.',
}

const PLACEHOLDER_ANIMALS = [
  { name: 'Alpacas', breed: 'Suri & Huacaya', shortDescription: 'Gentle, curious alpacas love to meet visitors. Come and say hello!', color: 'farm-green' },
  { name: 'Shetland Ponies', breed: 'Shetland', shortDescription: 'Our sturdy little ponies are firm favourites with younger visitors.', color: 'farm-wheat' },
  { name: 'Pygmy Goats', breed: 'African Pygmy', shortDescription: 'Playful and energetic, these miniature goats are full of character.', color: 'farm-brown' },
  { name: 'Hereford Cows', breed: 'Hereford', shortDescription: 'Traditional British beef cattle known for their docile nature.', color: 'farm-green' },
  { name: 'Rabbits & Guinea Pigs', breed: 'Various', shortDescription: 'Perfect for gentle cuddles in our petting area.', color: 'farm-sage' },
  { name: 'Donkeys', breed: 'Miniature Mediterranean', shortDescription: 'Friendly donkeys who enjoy carrots and attention from visitors.', color: 'farm-coral' },
] as const

const RARE_BREED_FALLBACK = [
  { name: 'Gloucester Old Spot Pigs', breed: 'Gloucester Old Spot', shortDescription: 'One of the oldest pig breeds in Britain. Known for their distinctive white coat with black spots and docile temperament. These heritage pigs were traditionally kept in orchards.' },
  { name: 'Lincoln Longwool Sheep', breed: 'Lincoln Longwool', shortDescription: 'One of the largest British sheep breeds, famed for their lustrous, long wool. A historic breed that has graced British pastures for centuries.' },
] as const

const CARD_COLORS = ['farm-green', 'farm-wheat', 'farm-brown'] as const

type AnimalDoc = {
  id: string
  name: string
  breed: string
  shortDescription?: string | null
  isRareBreed?: boolean
  image?: { url?: string; alt?: string } | number | null
  order?: number
}

async function getAnimals() {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'animals',
      sort: 'order',
      depth: 1,
      pagination: false,
    })
    return result.docs as AnimalDoc[]
  } catch {
    return []
  }
}

export default async function AnimalsPage() {
  const animals = await getAnimals()
  const rareBreeds = animals.filter((a) => a.isRareBreed)
  const regularAnimals = animals.filter((a) => !a.isRareBreed)
  const hasAnimals = animals.length > 0
  const hasRareBreeds = rareBreeds.length > 0

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-farm-sage/30 to-farm-cream/50 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-farm-green-dark">
            Our Animals
          </h1>
          <p className="mt-6 text-lg text-gray-700 max-w-2xl mx-auto">
            Meet the wonderful variety of animals at Rutland Farm Park. From fluffy alpacas and
            friendly donkeys to rare breed pigs and sheep, our residents love meeting visitors.
            Come and say hello!
          </p>
        </div>
      </section>

      {/* Animals Grid */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-display text-2xl md:text-3xl text-farm-green-dark mb-10">
            Meet Our Residents
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {hasAnimals
              ? regularAnimals.map((animal, index) => (
                  <AnimalCard key={animal.id} animal={animal} index={index} />
                ))
              : PLACEHOLDER_ANIMALS.map((animal, index) => (
                  <PlaceholderCard key={animal.name} animal={animal} index={index} />
                ))}
          </div>
        </div>
      </section>

      {/* Rare Breeds Section */}
      <section className="py-16 md:py-20 bg-farm-cream/50">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-display text-2xl md:text-3xl text-farm-green-dark mb-4">
            Rare & Heritage Breeds
          </h2>
          <p className="text-gray-700 mb-6 max-w-3xl">
            We are proud to support rare breed conservation. Many of our animals are heritage
            breeds at risk of extinction. By visiting and learning about them, you help raise
            awareness and support breeding programmes. Find out more at the{' '}
            <Link
              href="https://www.rbst.org.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-farm-green hover:text-farm-green-dark font-medium underline inline-flex items-center gap-1"
            >
              Rare Breeds Survival Trust
              <ExternalLink className="h-4 w-4" />
            </Link>
            .
          </p>

          {hasRareBreeds ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {rareBreeds.map((animal, index) => (
                <RareBreedCard key={animal.id} animal={animal} index={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {RARE_BREED_FALLBACK.map((animal, index) => (
                <RareBreedFallbackCard key={animal.name} animal={animal} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

const BG_CLASSES: Record<string, string> = {
  'farm-green': 'bg-farm-green',
  'farm-wheat': 'bg-farm-wheat',
  'farm-brown': 'bg-farm-brown',
  'farm-sage': 'bg-farm-sage',
  'farm-coral': 'bg-farm-coral',
}

function AnimalCard({ animal, index }: { animal: AnimalDoc; index: number }) {
  const bgClass = BG_CLASSES[CARD_COLORS[index % CARD_COLORS.length]]
  const imageUrl =
    animal.image && typeof animal.image === 'object' && 'url' in animal.image
      ? animal.image.url
      : null

  return (
    <article
      className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
    >
      <div className={cn('aspect-[4/3] flex items-center justify-center', bgClass)}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={typeof animal.image === 'object' && animal.image?.alt ? animal.image.alt : animal.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <PawPrint className="h-20 w-20 text-white/80" />
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl text-farm-green-dark">{animal.name}</h3>
        <span className="mt-1 inline-block rounded-full bg-farm-sage/30 px-3 py-0.5 text-sm text-farm-green-dark">
          {animal.breed}
        </span>
        {animal.shortDescription && (
          <p className="mt-3 text-gray-600 text-sm line-clamp-3">{animal.shortDescription}</p>
        )}
      </div>
    </article>
  )
}

function PlaceholderCard({
  animal,
  index,
}: {
  animal: (typeof PLACEHOLDER_ANIMALS)[number]
  index: number
}) {
  const bgClass = BG_CLASSES[animal.color]

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      <div className={cn('aspect-[4/3] flex items-center justify-center', bgClass)}>
        <PawPrint className="h-20 w-20 text-white/80" />
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl text-farm-green-dark">{animal.name}</h3>
        <span className="mt-1 inline-block rounded-full bg-farm-sage/30 px-3 py-0.5 text-sm text-farm-green-dark">
          {animal.breed}
        </span>
        <p className="mt-3 text-gray-600 text-sm">{animal.shortDescription}</p>
      </div>
    </article>
  )
}

function RareBreedCard({ animal, index }: { animal: AnimalDoc; index: number }) {
  const bgClass = index % 2 === 0 ? 'bg-farm-green' : 'bg-farm-brown'
  const imageUrl =
    animal.image && typeof animal.image === 'object' && 'url' in animal.image
      ? animal.image.url
      : null

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-lg">
      <div className={cn('aspect-video flex items-center justify-center', bgClass)}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={typeof animal.image === 'object' && animal.image?.alt ? animal.image.alt : animal.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <PawPrint className="h-24 w-24 text-white/80" />
        )}
      </div>
      <div className="p-6">
        <span className="rounded-full bg-farm-coral/20 px-3 py-1 text-sm font-medium text-farm-brown">
          Rare Breed
        </span>
        <h3 className="font-display mt-2 text-2xl text-farm-green-dark">{animal.name}</h3>
        <p className="mt-1 text-sm text-gray-500">{animal.breed}</p>
        {animal.shortDescription && (
          <p className="mt-4 text-gray-700">{animal.shortDescription}</p>
        )}
      </div>
    </article>
  )
}

function RareBreedFallbackCard({
  animal,
  index,
}: {
  animal: (typeof RARE_BREED_FALLBACK)[number]
  index: number
}) {
  const bgClass = index % 2 === 0 ? 'bg-farm-green' : 'bg-farm-brown'

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-lg">
      <div className={cn('aspect-video flex items-center justify-center', bgClass)}>
        <PawPrint className="h-24 w-24 text-white/80" />
      </div>
      <div className="p-6">
        <span className="rounded-full bg-farm-coral/20 px-3 py-1 text-sm font-medium text-farm-brown">
          Rare Breed
        </span>
        <h3 className="font-display mt-2 text-2xl text-farm-green-dark">{animal.name}</h3>
        <p className="mt-1 text-sm text-gray-500">{animal.breed}</p>
        <p className="mt-4 text-gray-700">{animal.shortDescription}</p>
      </div>
    </article>
  )
}
