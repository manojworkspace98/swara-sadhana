import { describe, expect, it } from 'vitest'
import { addDays } from './day'
import {
  anchorHour,
  consistencyScore,
  consistencyTrend,
  rhythmInsights,
  timeOfDay,
  toDayRecords,
  weekGrid,
  weekdayStats,
  type DayRecord,
} from './rhythm'
import type { DailyGoal } from './goals'

const GOAL: DailyGoal = { rules: [{ metric: 'minutes', target: 30 }], restDays: [] }

/** 2026-08-10 is a Monday, which keeps the weekday arithmetic legible. */
const MONDAY = '2026-08-10'

function series(from: string, length: number, fn: (i: number, day: string) => Partial<DayRecord>) {
  return Array.from({ length }, (_, i) => {
    const day = addDays(from, i)
    return { day, minutes: 0, met: false, ...fn(i, day) }
  })
}

function sessionsAt(hours: number[], onDay = MONDAY): { startedAt: number; durationSec: number }[] {
  return hours.map((h) => {
    const [y, m, d] = onDay.split('-').map(Number)
    return { startedAt: new Date(y, m - 1, d, h, 0, 0).getTime(), durationSec: 1800 }
  })
}

describe('weekdayStats', () => {
  it('reads the week Monday first', () => {
    const stats = weekdayStats(series(MONDAY, 7, () => ({})))
    expect(stats.map((s) => s.weekday)).toEqual([1, 2, 3, 4, 5, 6, 0])
  })

  it('counts a missed day against its weekday, not out of existence', () => {
    // Four weeks where every Thursday is missed and everything else is met.
    const days = series(MONDAY, 28, (_, day) => {
      const isThursday = new Date(...dayParts(day)).getDay() === 4
      return { minutes: isThursday ? 0 : 30, met: !isThursday }
    })
    const stats = weekdayStats(days)
    const thursday = stats.find((s) => s.weekday === 4)!
    expect(thursday.elapsed).toBe(4)
    expect(thursday.met).toBe(0)
    expect(thursday.rate).toBe(0)

    const monday = stats.find((s) => s.weekday === 1)!
    expect(monday.rate).toBe(1)
  })

  it('takes the median only over days practice actually happened', () => {
    const days = series(MONDAY, 21, (i) => {
      if (i % 7 !== 0) return {}
      // Three Mondays: 10, 20 and 60 minutes.
      return { minutes: [10, 20, 60][i / 7], met: true }
    })
    const monday = weekdayStats(days).find((s) => s.weekday === 1)!
    expect(monday.practised).toBe(3)
    expect(monday.medianMinutes).toBe(20)
  })
})

describe('timeOfDay and anchorHour', () => {
  it('buckets sessions by the hour they started', () => {
    const buckets = timeOfDay(sessionsAt([7, 7, 21]))
    expect(buckets[7].sessions).toBe(2)
    expect(buckets[21].sessions).toBe(1)
    expect(buckets[7].minutes).toBe(60)
  })

  it('finds the three-hour window most practice starts in', () => {
    const anchor = anchorHour(sessionsAt([6, 7, 7, 8, 20]))!
    expect(anchor.start).toBe(6)
    expect(anchor.sessions).toBe(4)
    expect(anchor.share).toBeCloseTo(0.8)
  })

  it('reports a low share when practice is scattered', () => {
    const anchor = anchorHour(sessionsAt([6, 10, 14, 18, 22]))!
    expect(anchor.share).toBeLessThan(0.5)
  })

  it('has nothing to say without sessions', () => {
    expect(anchorHour([])).toBeNull()
  })
})

describe('weekGrid', () => {
  it('lays weeks out as rows and weekdays as columns', () => {
    const today = addDays(MONDAY, 13) // a Sunday, two weeks on
    const grid = weekGrid(series(MONDAY, 14, () => ({ minutes: 30, met: true })), 2, today)
    expect(grid).toHaveLength(2)
    expect(grid[0].weekStart).toBe(MONDAY)
    expect(grid[0].cells).toHaveLength(7)
    expect(grid[0].cells.every((c) => c?.met)).toBe(true)
  })

  it('leaves days after today empty rather than counting them as missed', () => {
    const today = addDays(MONDAY, 2) // Wednesday
    const grid = weekGrid(series(MONDAY, 3, () => ({ minutes: 30, met: true })), 1, today)
    expect(grid[0].cells.slice(0, 3).every((c) => c?.met)).toBe(true)
    expect(grid[0].cells.slice(3)).toEqual([null, null, null, null])
  })

  it('fills a day with no record as a missed day', () => {
    const today = addDays(MONDAY, 6)
    const grid = weekGrid([], 1, today)
    expect(grid[0].cells[0]).toEqual({ day: MONDAY, minutes: 0, met: false })
  })
})

describe('consistencyScore', () => {
  it('is the share of the window that met the goal', () => {
    const days = series(MONDAY, 28, (i) => ({ minutes: i % 2 === 0 ? 30 : 0, met: i % 2 === 0 }))
    const today = addDays(MONDAY, 27)
    expect(consistencyScore(days, today, 28)).toBeCloseTo(14 / 28)
  })

  it('counts days outside the history as missed, not as absent', () => {
    const days = series(MONDAY, 7, () => ({ minutes: 30, met: true }))
    const today = addDays(MONDAY, 6)
    expect(consistencyScore(days, today, 28)).toBeCloseTo(7 / 28)
  })
})

describe('consistencyTrend', () => {
  it('walks the window backwards so the trend can be plotted', () => {
    const days = series(MONDAY, 84, () => ({ minutes: 30, met: true }))
    const today = addDays(MONDAY, 83)
    const trend = consistencyTrend(days, today, { points: 4, step: 7 })
    expect(trend).toHaveLength(4)
    expect(trend.at(-1)!.day).toBe(today)
    expect(trend.at(-1)!.score).toBe(1)
  })
})

describe('rhythmInsights', () => {
  const baseInput = (days: DayRecord[], extra: Partial<Parameters<typeof rhythmInsights>[0]> = {}) => ({
    days,
    sessions: [],
    goal: GOAL,
    today: days.at(-1)!.day,
    hour: 12,
    ...extra,
  })

  it('says it is too early rather than inventing a pattern', () => {
    const days = series(MONDAY, 10, () => ({ minutes: 30, met: true }))
    const ids = rhythmInsights(baseInput(days)).map((i) => i.id)
    expect(ids).toEqual(['early-days'])
  })

  it('names the weekday the week breaks on', () => {
    const days = series(MONDAY, 28, (_, day) => {
      const isThursday = new Date(...dayParts(day)).getDay() === 4
      return { minutes: isThursday ? 0 : 30, met: !isThursday }
    })
    const weak = rhythmInsights(baseInput(days)).find((i) => i.id === 'weak-weekday')
    expect(weak).toBeDefined()
    expect(weak!.title).toMatch(/Thursday/)
    expect(weak!.detail).toMatch(/4 of the last 4 Thursdays/)
  })

  it('stays quiet about weekdays when every day is much the same', () => {
    const days = series(MONDAY, 28, () => ({ minutes: 30, met: true }))
    const ids = rhythmInsights(baseInput(days)).map((i) => i.id)
    expect(ids).not.toContain('weak-weekday')
  })

  it('suggests lowering a goal that sits above the typical day', () => {
    // Practises every day for 18 minutes against a 30-minute goal.
    const days = series(MONDAY, 28, () => ({ minutes: 18, met: false }))
    const insight = rhythmInsights(baseInput(days)).find((i) => i.id === 'goal-above-habit')
    expect(insight).toBeDefined()
    expect(insight!.detail).toMatch(/typical practice day is 18/)
  })

  it('does not suggest lowering a goal that is being met', () => {
    const days = series(MONDAY, 28, () => ({ minutes: 32, met: true }))
    const ids = rhythmInsights(baseInput(days)).map((i) => i.id)
    expect(ids).not.toContain('goal-above-habit')
  })

  it('points out the days that ended just short', () => {
    const days = series(MONDAY, 28, (i) => {
      if (i < 3) return { minutes: 27, met: false }
      return { minutes: 30, met: true }
    })
    const insight = rhythmInsights(baseInput(days)).find((i) => i.id === 'near-miss')
    expect(insight).toBeDefined()
    expect(insight!.title).toMatch(/3 days ended just short/)
  })

  it('warns in the evening when the day has not counted', () => {
    const days = series(MONDAY, 28, (i, day) =>
      i === 27 ? { minutes: 0, met: false } : { minutes: 30, met: true, day },
    )
    const evening = rhythmInsights(baseInput(days, { hour: 20 })).map((i) => i.id)
    const midday = rhythmInsights(baseInput(days, { hour: 11 })).map((i) => i.id)
    expect(evening).toContain('streak-risk')
    expect(midday).not.toContain('streak-risk')
  })

  it('praises a settled practice hour and flags a scattered one', () => {
    const days = series(MONDAY, 28, () => ({ minutes: 30, met: true }))
    const settled = rhythmInsights(
      baseInput(days, { sessions: sessionsAt([7, 7, 7, 8, 7, 8, 7, 6]) }),
    ).map((i) => i.id)
    expect(settled).toContain('anchored')

    const scattered = rhythmInsights(
      baseInput(days, { sessions: sessionsAt([6, 9, 12, 15, 18, 21, 23, 3]) }),
    ).map((i) => i.id)
    expect(scattered).toContain('no-anchor')
  })

  it('always ends with where consistency stands', () => {
    const days = series(MONDAY, 28, () => ({ minutes: 30, met: true }))
    const last = rhythmInsights(baseInput(days)).at(-1)!
    expect(last.id).toBe('consistency')
    expect(last.title).toMatch(/100% of the last four weeks/)
  })
})

describe('toDayRecords', () => {
  it('fills the gaps so a missed week cannot vanish', () => {
    const records = toDayRecords(
      [{ day: MONDAY, minutes: 30, met: true }],
      MONDAY,
      addDays(MONDAY, 6),
    )
    expect(records).toHaveLength(7)
    expect(records[0].met).toBe(true)
    expect(records.slice(1).every((r) => r.minutes === 0 && !r.met)).toBe(true)
  })
})

/** 'YYYY-MM-DD' as the local-noon parts Date wants. */
function dayParts(day: string): [number, number, number, number] {
  const [y, m, d] = day.split('-').map(Number)
  return [y, m - 1, d, 12]
}
