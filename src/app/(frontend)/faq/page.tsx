import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { MessageCircle, Phone } from 'lucide-react'
import { FaqAccordion } from '@/components/FaqAccordion'
import { extractTextFromLexical } from '@/lib/lexical'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
}

const FALLBACK_FAQS = [
  {
    question: 'Is there parking on site?',
    answer:
      'Yes, we have an on site car park which you can park in for FREE.',
  },
  {
    question: 'Can you feed the animals?',
    answer: 'Yes you can, we sell food bags in the shop.',
  },
  {
    question: 'Can you touch the animals?',
    answer:
      'The animals are all very friendly, but please remember that they are animals on a working farm and they are not pets, so please do be careful.',
  },
  {
    question: 'Can I bring my dog?',
    answer:
      'Yes and no. Dogs are welcome in the car park and outside the Tea Room, but only assistance dogs will be allowed in to the farm park. Dogs must not be left unattended in cars.',
  },
  {
    question: 'Is the farm wheelchair accessible?',
    answer:
      'Mostly, but this also depends somewhat on the weather. Parts of the farm walkways are not suitable for wheelchairs, particularly in Winter.',
  },
  {
    question: "Is the farm safe to visit if I'm pregnant?",
    answer:
      "Yes it is. The only potential risk is when animals are giving birth. If you have any concerns when you visit, please speak to a member of staff.",
  },
  {
    question: 'Can I pay by debit or credit card?',
    answer: 'Yes you can, anything but American Express.',
  },
  {
    question: 'Do you host Birthday parties?',
    answer:
      'Yes we do and we love hosting them! Birthdays and other celebrations are all welcome in the Tea Room, but if you would like a larger outdoor space then the barn is also available for hire.',
  },
]

async function getFaqs() {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'faqs',
      sort: 'order',
      limit: 100,
    })
    return result.docs
  } catch {
    return []
  }
}

function faqToItem(doc: { question?: string; answer?: unknown }): {
  question: string
  answer: string
} {
  const answer =
    typeof doc.answer === 'string'
      ? doc.answer
      : extractTextFromLexical(doc.answer ?? null) || '(No answer content)'
  return {
    question: doc.question ?? 'Question',
    answer: answer.trim() || '(No answer content)',
  }
}

export default async function FaqPage() {
  const cmsFaqs = await getFaqs()
  const items =
    cmsFaqs.length > 0
      ? cmsFaqs.map((doc) =>
          faqToItem(doc as { question?: string; answer?: unknown })
        )
      : FALLBACK_FAQS

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
            Frequently Asked Questions
          </h1>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FaqAccordion items={items} />
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-20 bg-farm-cream/50">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl md:text-3xl text-farm-green-dark mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-8">
            We&apos;re happy to help. Get in touch and we&apos;ll get back to
            you as soon as we can.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-farm-green text-white font-semibold hover:bg-farm-green-dark transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              Contact Us
            </Link>
            <a
              href="tel:01572722122"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-farm-green text-farm-green font-semibold hover:bg-farm-green hover:text-white transition-colors"
            >
              <Phone className="h-5 w-5" />
              01572 722122
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
