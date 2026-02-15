'use client'

import { useState } from 'react'
import { BookingCalendar } from './BookingCalendar'
import { TicketSelector } from './TicketSelector'
import { BookingForm } from './BookingForm'
import { ChevronRight, ChevronLeft } from 'lucide-react'

interface TicketType {
  id: string
  name: string
  description?: string
  weekdayPrice: number
  weekendPrice: number
  maxPerBooking: number
}

interface TicketSelection {
  ticketTypeId: string
  quantity: number
}

type Step = 'date' | 'tickets' | 'details'

export function BookingWidget({ ticketTypes }: { ticketTypes: TicketType[] }) {
  const [step, setStep] = useState<Step>('date')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [tickets, setTickets] = useState<TicketSelection[]>([])
  const [isWeekendRate, setIsWeekendRate] = useState(false)

  const steps: { key: Step; label: string }[] = [
    { key: 'date', label: '1. Choose Date' },
    { key: 'tickets', label: '2. Select Tickets' },
    { key: 'details', label: '3. Your Details' },
  ]

  const currentStepIndex = steps.findIndex((s) => s.key === step)

  const handleDateSelect = (date: string, isWeekend: boolean) => {
    setSelectedDate(date)
    setIsWeekendRate(isWeekend)
    setStep('tickets')
  }

  const handleTicketsConfirm = (selections: TicketSelection[]) => {
    setTickets(selections)
    setStep('details')
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Step indicator */}
      <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-2 text-sm">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (i < currentStepIndex) setStep(s.key)
                }}
                disabled={i > currentStepIndex}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  s.key === step
                    ? 'bg-farm-green text-white'
                    : i < currentStepIndex
                      ? 'bg-farm-green/10 text-farm-green cursor-pointer hover:bg-farm-green/20'
                      : 'bg-gray-200 text-gray-400'
                }`}
              >
                {s.label}
              </button>
              {i < steps.length - 1 && (
                <ChevronRight className="h-4 w-4 text-gray-300 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="p-6">
        {step === 'date' && <BookingCalendar onDateSelect={handleDateSelect} />}

        {step === 'tickets' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setStep('date')}
                className="text-sm text-farm-green hover:underline inline-flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Change date
              </button>
              <span className="text-sm text-gray-500">
                Selected:{' '}
                <strong className="text-gray-800">
                  {new Date(selectedDate).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </strong>
                {isWeekendRate && (
                  <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                    Weekend/Holiday pricing
                  </span>
                )}
              </span>
            </div>
            <TicketSelector
              ticketTypes={ticketTypes}
              isWeekendRate={isWeekendRate}
              onConfirm={handleTicketsConfirm}
            />
          </div>
        )}

        {step === 'details' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setStep('tickets')}
                className="text-sm text-farm-green hover:underline inline-flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Change tickets
              </button>
            </div>
            <BookingForm
              date={selectedDate}
              tickets={tickets}
              ticketTypes={ticketTypes}
              isWeekendRate={isWeekendRate}
            />
          </div>
        )}
      </div>
    </div>
  )
}
