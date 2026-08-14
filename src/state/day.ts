/**
 * Practice days, not calendar days.
 *
 * A late-night session belongs to the evening it started in. The boundary sits
 * at 3 AM local time: anything before that counts toward the day before, so
 * finishing at 1 AM still keeps the streak that day earned.
 */
export const DAY_BOUNDARY_HOUR = 3

export function dayKey(at: number | Date): string {
  const d = at instanceof Date ? new Date(at.getTime()) : new Date(at)
  if (d.getHours() < DAY_BOUNDARY_HOUR) d.setDate(d.getDate() - 1)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Parse 'YYYY-MM-DD' as local noon, avoiding DST edges when adding days. */
export function parseDay(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d, 12, 0, 0, 0)
}

export function addDays(key: string, n: number): string {
  const d = parseDay(key)
  d.setDate(d.getDate() + n)
  const y = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${mm}-${dd}`
}

export function daysBetween(from: string, to: string): number {
  const ms = parseDay(to).getTime() - parseDay(from).getTime()
  return Math.round(ms / 86_400_000)
}

/** The Monday of the practice week a day falls in — when freezes refill. */
export function weekStart(key: string): string {
  const d = parseDay(key)
  const dow = d.getDay() // 0 Sun … 6 Sat
  const backToMonday = (dow + 6) % 7
  return addDays(key, -backToMonday)
}
