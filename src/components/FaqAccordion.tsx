'use client'

import { ChevronDown } from 'lucide-react'

export interface FaqItem {
  question: string
  answer: string
}

interface FaqAccordionProps {
  items: FaqItem[]
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <details
          key={index}
          className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none focus:outline-none focus-visible:ring-2 focus-visible:ring-farm-green focus-visible:ring-offset-2 rounded-xl [&::-webkit-details-marker]:hidden">
            <span className="font-display text-lg text-farm-green-dark pr-4">
              {item.question}
            </span>
            <ChevronDown className="h-5 w-5 text-farm-green shrink-0 transition-transform duration-200 group-open:rotate-180" />
          </summary>
          <div className="px-6 pb-5 pt-0 border-t border-gray-50 mt-0 transition-[max-height] duration-300 ease-in-out">
            <p className="text-gray-600 leading-relaxed">{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  )
}
