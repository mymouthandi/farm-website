import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Heart } from 'lucide-react'
import { AdoptionForm } from '@/components/shop/AdoptionForm'

const fallbackTiers = [
  { id: 'bronze', name: 'Bronze', price: 2500, description: 'A wonderful way to support your favourite animal.', includes: [{ item: 'Adoption certificate' }, { item: 'Photo of your animal' }, { item: 'Fact sheet' }] },
  { id: 'silver', name: 'Silver', price: 5000, description: 'Everything in Bronze plus a cuddly companion.', includes: [{ item: 'Adoption certificate' }, { item: 'Photo of your animal' }, { item: 'Fact sheet' }, { item: 'Cuddly toy' }] },
  { id: 'gold', name: 'Gold', price: 7500, description: 'The ultimate adoption pack with a free family visit.', includes: [{ item: 'Adoption certificate' }, { item: 'Photo of your animal' }, { item: 'Fact sheet' }, { item: 'Cuddly toy' }, { item: 'Free family entry ticket' }] },
]

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const payload = await getPayload({ config })
    const animal = await payload.findByID({ collection: 'animals', id })
    if (!animal) return { title: 'Animal Not Found' }
    return {
      title: `Adopt ${(animal as any).name}`,
      description: `Adopt ${(animal as any).name} the ${(animal as any).breed} at Rutland Farm Park.`,
    }
  } catch {
    return { title: 'Adopt an Animal' }
  }
}

export default async function AdoptAnimalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let animal: any = null
  let tiers: any[] = []

  try {
    const payload = await getPayload({ config })
    animal = await payload.findByID({ collection: 'animals', id })
    const tiersResult = await payload.find({
      collection: 'adoption-tiers',
      where: { active: { equals: true } },
      sort: 'order',
      limit: 10,
    })
    tiers = tiersResult.docs.length > 0 ? tiersResult.docs : fallbackTiers
  } catch {
    notFound()
  }

  if (!animal) notFound()
  if (tiers.length === 0) tiers = fallbackTiers

  const tierData = tiers.map((t: any) => ({
    id: t.id,
    name: t.name,
    price: t.price,
    description: t.description || '',
    includes: t.includes || [],
  }))

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-8">
        <Link href="/shop" className="hover:text-farm-green transition-colors">Shop</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/shop/adopt" className="hover:text-farm-green transition-colors">Adopt</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-gray-800 font-medium">{animal.name}</span>
      </nav>

      {/* Animal info */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="aspect-square bg-farm-sage/20 rounded-2xl flex items-center justify-center">
          <Heart className="h-24 w-24 text-farm-coral/20" />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="font-display text-3xl md:text-4xl text-gray-900">
            Adopt {animal.name}
          </h1>
          <span className="inline-block mt-2 px-3 py-1 bg-farm-brown/10 text-farm-brown text-sm font-medium rounded-full w-fit">
            {animal.breed}
          </span>
          <p className="mt-4 text-gray-600 leading-relaxed">
            {animal.shortDescription || `${animal.name} is one of our wonderful farm residents and would love your support through adoption. Your adoption helps us provide the best possible care.`}
          </p>
          {animal.isRareBreed && (
            <div className="mt-4 px-4 py-3 bg-farm-cream rounded-lg border border-farm-wheat/30">
              <p className="text-sm text-farm-brown font-medium">
                {animal.name} is a rare breed animal. Your adoption helps with conservation efforts.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Adoption form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
        <AdoptionForm animalId={animal.id} animalName={animal.name} tiers={tierData} />
      </div>
    </div>
  )
}
