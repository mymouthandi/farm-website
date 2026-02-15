import { nanoid } from './nanoid'

export function generateBookingReference(): string {
  const prefix = 'RFP'
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, '')
  const random = nanoid(4).toUpperCase()
  return `${prefix}-${date}-${random}`
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}

// UK Bank Holidays for 2026 (approximate - should be updated annually)
const bankHolidays2026 = [
  '2026-01-01', // New Year's Day
  '2026-04-03', // Good Friday
  '2026-04-06', // Easter Monday
  '2026-05-04', // Early May Bank Holiday
  '2026-05-25', // Spring Bank Holiday
  '2026-08-31', // Summer Bank Holiday
  '2026-12-25', // Christmas Day
  '2026-12-28', // Boxing Day (substitute)
]

export function isBankHoliday(date: Date): boolean {
  const dateStr = date.toISOString().slice(0, 10)
  return bankHolidays2026.includes(dateStr)
}

export function isSchoolHoliday(date: Date): boolean {
  // Approximate UK school holiday periods for 2026
  const month = date.getMonth() // 0-based
  const day = date.getDate()

  // February half-term (week of 16 Feb)
  if (month === 1 && day >= 14 && day <= 22) return true
  // Easter holidays (late March to mid April)
  if (month === 2 && day >= 28) return true
  if (month === 3 && day <= 12) return true
  // May half-term (week of 25 May)
  if (month === 4 && day >= 23 && day <= 31) return true
  // Summer holidays (mid July to early Sept)
  if (month === 6 && day >= 18) return true
  if (month === 7) return true
  if (month === 8 && day <= 2) return true
  // October half-term (week of 26 Oct)
  if (month === 9 && day >= 24 && day <= 30) return true
  // Christmas holidays (mid Dec onwards)
  if (month === 11 && day >= 19) return true

  return false
}

export function isWeekendPricing(date: Date): boolean {
  return isWeekend(date) || isBankHoliday(date) || isSchoolHoliday(date)
}

export function isClosedDay(date: Date): boolean {
  const day = date.getDay()
  // Closed on Mondays (except bank holidays and school holidays)
  if (day === 1 && !isBankHoliday(date) && !isSchoolHoliday(date)) return true
  // Closed Christmas Day and New Year's Day
  const month = date.getMonth()
  const dateOfMonth = date.getDate()
  if (month === 11 && dateOfMonth === 25) return true
  if (month === 0 && dateOfMonth === 1) return true
  return false
}
