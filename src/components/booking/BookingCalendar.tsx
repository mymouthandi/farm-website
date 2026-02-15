'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface BookingCalendarProps {
  onDateSelect: (date: string, isWeekend: boolean) => void
}

function isWeekendDay(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}

function isMonday(date: Date): boolean {
  return date.getDay() === 1
}

export function BookingCalendar({ onDateSelect }: BookingCalendarProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [checking, setChecking] = useState(false)

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  // Adjust for Monday start (0 = Mon, 6 = Sun)
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

  const monthName = new Date(currentYear, currentMonth).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })

  const days = useMemo(() => {
    const result: Array<{ day: number; date: Date; isPast: boolean; isClosed: boolean; isWeekend: boolean }> = []
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentYear, currentMonth, d)
      const isPast = date < today
      // Mondays are typically closed (simplified check)
      const isClosed = isMonday(date) && !isPast
      const isWeekend = isWeekendDay(date)
      result.push({ day: d, date, isPast, isClosed, isWeekend })
    }
    return result
  }, [currentMonth, currentYear, daysInMonth])

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const canGoPrev = new Date(currentYear, currentMonth, 1) > today

  const handleDateClick = async (dayInfo: (typeof days)[0]) => {
    if (dayInfo.isPast || dayInfo.isClosed) return

    const dateStr = dayInfo.date.toISOString().split('T')[0]
    setChecking(true)

    try {
      const res = await fetch('/api/bookings/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateStr }),
      })
      const data = await res.json()

      if (data.available === false) {
        alert(data.reason || 'This date is not available.')
        return
      }

      onDateSelect(dateStr, dayInfo.isWeekend)
    } catch {
      // If availability check fails, still allow booking
      onDateSelect(dateStr, dayInfo.isWeekend)
    } finally {
      setChecking(false)
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl text-gray-900 mb-2">Choose Your Date</h2>
      <p className="text-sm text-gray-500 mb-6">
        Select a date for your visit. Weekend &amp; holiday prices apply on Saturdays, Sundays,
        bank holidays, and school holidays.
      </p>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="font-semibold text-lg text-gray-800">{monthName}</h3>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for offset */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((dayInfo) => {
          const isDisabled = dayInfo.isPast || dayInfo.isClosed
          const isToday =
            dayInfo.date.toDateString() === today.toDateString()

          return (
            <button
              key={dayInfo.day}
              onClick={() => handleDateClick(dayInfo)}
              disabled={isDisabled || checking}
              className={`
                relative aspect-square rounded-lg text-sm font-medium transition-all
                ${isDisabled
                  ? 'text-gray-300 cursor-not-allowed'
                  : dayInfo.isWeekend
                    ? 'text-farm-coral hover:bg-farm-coral/10 hover:shadow-sm cursor-pointer'
                    : 'text-gray-700 hover:bg-farm-green/10 hover:shadow-sm cursor-pointer'
                }
                ${isToday ? 'ring-2 ring-farm-green ring-offset-1' : ''}
              `}
            >
              {dayInfo.day}
              {dayInfo.isClosed && !dayInfo.isPast && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[8px] text-gray-400">
                  closed
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gray-100 border border-gray-200" />
          <span>Weekday</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-farm-coral/10 border border-farm-coral/30" />
          <span>Weekend/Holiday pricing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gray-50 border border-gray-200 ring-2 ring-farm-green ring-offset-1" />
          <span>Today</span>
        </div>
      </div>

      {checking && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Checking availability...
        </div>
      )}
    </div>
  )
}
