import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Gift, Mail, Heart } from 'lucide-react'
import { VoucherForm } from '@/components/shop/VoucherForm'

export const metadata: Metadata = {
  title: 'Gift Vouchers',
  description:
    'Give the gift of a Rutland Farm Park experience with our gift vouchers. Valid for 12 months.',
}

const fallbackAmounts = [
  { amount: 1000, label: '£10' },
  { amount: 2500, label: '£25' },
  { amount: 5000, label: '£50' },
  { amount: 7500, label: '£75' },
  { amount: 10000, label: '£100' },
]

async function getVoucherAmounts() {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'shop-settings' })
    const amounts = (settings as any)?.voucherAmounts
    if (amounts && amounts.length > 0) return amounts
    return fallbackAmounts
  } catch {
    return fallbackAmounts
  }
}

export default async function VouchersPage() {
  const amounts = await getVoucherAmounts()

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-farm-wheat/80 to-farm-cream py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl text-farm-brown mb-4">Gift Vouchers</h1>
          <p className="text-farm-brown/70 text-lg max-w-2xl mx-auto">
            Give someone special the gift of a wonderful day out at Rutland Farm Park. Our vouchers
            make the perfect present for birthdays, Christmas, or any occasion.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-14 h-14 rounded-xl bg-farm-wheat/30 flex items-center justify-center mx-auto mb-4">
              <Gift className="h-7 w-7 text-farm-brown" />
            </div>
            <h3 className="font-display text-lg text-gray-900 mb-2">1. Choose Amount</h3>
            <p className="text-sm text-gray-600">
              Select a voucher value that suits your budget.
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 rounded-xl bg-farm-wheat/30 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-7 w-7 text-farm-brown" />
            </div>
            <h3 className="font-display text-lg text-gray-900 mb-2">2. Personalise It</h3>
            <p className="text-sm text-gray-600">
              Add a personal message for the lucky recipient.
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 rounded-xl bg-farm-wheat/30 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-7 w-7 text-farm-brown" />
            </div>
            <h3 className="font-display text-lg text-gray-900 mb-2">3. Send It</h3>
            <p className="text-sm text-gray-600">
              We&apos;ll deliver a beautiful voucher by email.
            </p>
          </div>
        </div>
      </section>

      {/* Voucher form */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
          <VoucherForm amounts={amounts} />
        </div>
      </section>

      {/* Info */}
      <section className="bg-farm-cream/50 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl text-gray-900 mb-4">Good to Know</h2>
          <div className="grid sm:grid-cols-3 gap-6 text-sm text-gray-600">
            <div>
              <p className="font-semibold text-gray-800 mb-1">Valid for 12 Months</p>
              <p>From the date of purchase.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-1">Redeemable For</p>
              <p>Entry tickets, tea room, and shop purchases.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-1">No Change Given</p>
              <p>Remaining balance stays on the voucher.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
