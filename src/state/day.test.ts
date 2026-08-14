import { describe, expect, it } from 'vitest'
import { addDays, dayKey, daysBetween, parseDay, weekStart } from './day'

describe('dayKey', () => {
  it('uses the calendar date during waking hours', () => {
    expect(dayKey(new Date(2026, 7, 14, 9, 0))).toBe('2026-08-14')
    expect(dayKey(new Date(2026, 7, 14, 23, 59))).toBe('2026-08-14')
  })

  it('counts a late-night session toward the evening it began in', () => {
    expect(dayKey(new Date(2026, 7, 15, 1, 30))).toBe('2026-08-14')
    expect(dayKey(new Date(2026, 7, 15, 2, 59))).toBe('2026-08-14')
  })

  it('starts the new day at 3 AM', () => {
    expect(dayKey(new Date(2026, 7, 15, 3, 0))).toBe('2026-08-15')
  })

  it('rolls back across a month boundary', () => {
    expect(dayKey(new Date(2026, 8, 1, 1, 0))).toBe('2026-08-31')
  })

  it('rolls back across a year boundary', () => {
    expect(dayKey(new Date(2027, 0, 1, 2, 0))).toBe('2026-12-31')
  })
})

describe('day arithmetic', () => {
  it('adds and subtracts days across months', () => {
    expect(addDays('2026-08-31', 1)).toBe('2026-09-01')
    expect(addDays('2026-09-01', -1)).toBe('2026-08-31')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
  })

  it('handles a leap day', () => {
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29')
    expect(addDays('2028-02-29', 1)).toBe('2028-03-01')
  })

  it('measures gaps between days', () => {
    expect(daysBetween('2026-08-14', '2026-08-15')).toBe(1)
    expect(daysBetween('2026-08-14', '2026-08-14')).toBe(0)
    expect(daysBetween('2026-08-31', '2026-09-02')).toBe(2)
    expect(daysBetween('2026-08-15', '2026-08-14')).toBe(-1)
  })

  it('survives a spring-forward DST transition', () => {
    // US DST begins 2026-03-08; noon anchoring keeps the arithmetic honest.
    expect(daysBetween('2026-03-07', '2026-03-09')).toBe(2)
    expect(addDays('2026-03-07', 1)).toBe('2026-03-08')
  })

  it('parses a day to local noon', () => {
    const d = parseDay('2026-08-14')
    expect(d.getFullYear()).toBe(2026)
    expect(d.getMonth()).toBe(7)
    expect(d.getDate()).toBe(14)
    expect(d.getHours()).toBe(12)
  })
})

describe('weekStart', () => {
  it('returns the Monday of that week', () => {
    // 2026-08-14 is a Friday.
    expect(weekStart('2026-08-14')).toBe('2026-08-10')
    expect(weekStart('2026-08-10')).toBe('2026-08-10') // Monday itself
  })

  it('treats Sunday as the end of the week, not the start', () => {
    // 2026-08-16 is a Sunday; its week began Monday the 10th.
    expect(weekStart('2026-08-16')).toBe('2026-08-10')
    expect(weekStart('2026-08-17')).toBe('2026-08-17') // next Monday
  })
})
