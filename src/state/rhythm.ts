import { addDays, daysBetween, parseDay, weekStart } from './day'
import { METRIC_SHORT, type DailyGoal } from './goals'

/**
 * The shape of a practice week.
 *
 * A streak says whether you practised; it says nothing about when the week
 * tends to break. Almost every learner who falls away does it on the same
 * weekday, at a predictable point, and cannot see it happening because a
 * calendar of dots hides the pattern in plain sight. These functions look for
 * that pattern and are deliberately pure, so what the app tells a singer about
 * their habit can be tested against a fixture instead of a hunch.
 */

export interface DayRecord {
  /** 'YYYY-MM-DD', practice days rather than calendar days. */
  day: string
  minutes: number
  /** Whether this day met the goal in force at the time. */
  met: boolean
  /** A rest day counts as met, but it is not evidence of a habit. */
  rest?: boolean
}

export interface WeekdayStat {
  /** 0 Sunday … 6 Saturday, matching Date#getDay. */
  weekday: number
  /** Days of this weekday that have actually passed in the window. */
  elapsed: number
  practised: number
  met: number
  /** Share of this weekday's days that met the goal, 0–1. */
  rate: number
  /** Median minutes across the days practice happened at all. */
  medianMinutes: number
}

export const WEEKDAY_LONG = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** Monday-first order, which is how the week is read on the grid. */
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]

export function weekdayOf(day: string): number {
  return parseDay(day).getDay()
}

function median(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

/**
 * How each weekday actually goes.
 *
 * The input must be a contiguous run of days including the ones with no
 * practice — a gap that is simply absent from the array would flatter the
 * singer by making a missed Thursday look like a Thursday that never came.
 */
export function weekdayStats(days: readonly DayRecord[]): WeekdayStat[] {
  const buckets = new Map<number, DayRecord[]>()
  for (const record of days) {
    const weekday = weekdayOf(record.day)
    const bucket = buckets.get(weekday)
    if (bucket) bucket.push(record)
    else buckets.set(weekday, [record])
  }

  return WEEK_ORDER.map((weekday) => {
    const rows = buckets.get(weekday) ?? []
    const practised = rows.filter((r) => r.minutes > 0)
    const met = rows.filter((r) => r.met).length
    return {
      weekday,
      elapsed: rows.length,
      practised: practised.length,
      met,
      rate: rows.length === 0 ? 0 : met / rows.length,
      medianMinutes: median(practised.map((r) => r.minutes)),
    }
  })
}

export interface HourBucket {
  hour: number
  sessions: number
  minutes: number
}

export interface SessionTime {
  startedAt: number
  durationSec: number
}

/** When in the day singing actually happens, in 24 one-hour buckets. */
export function timeOfDay(sessions: readonly SessionTime[]): HourBucket[] {
  const buckets: HourBucket[] = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    sessions: 0,
    minutes: 0,
  }))
  for (const session of sessions) {
    const hour = new Date(session.startedAt).getHours()
    buckets[hour].sessions += 1
    buckets[hour].minutes += session.durationSec / 60
  }
  return buckets
}

export interface AnchorHour {
  /** Start of the three-hour window holding most sessions. */
  start: number
  sessions: number
  /** Share of all sessions falling in that window, 0–1. */
  share: number
}

/**
 * The hour practice gravitates to, if there is one.
 *
 * A habit needs a time of day more than it needs willpower, so the useful
 * question is not "when did you sing" but "is there an hour you reliably
 * sing in". A three-hour window is wide enough to survive a normal life and
 * narrow enough that hitting it means something.
 */
export function anchorHour(sessions: readonly SessionTime[]): AnchorHour | null {
  if (sessions.length === 0) return null
  const buckets = timeOfDay(sessions)

  let best = { start: 0, sessions: -1 }
  for (let start = 0; start < 24; start += 1) {
    const count =
      buckets[start].sessions +
      buckets[(start + 1) % 24].sessions +
      buckets[(start + 2) % 24].sessions
    if (count > best.sessions) best = { start, sessions: count }
  }

  return { start: best.start, sessions: best.sessions, share: best.sessions / sessions.length }
}

export interface WeekRow {
  /** The Monday the row begins on. */
  weekStart: string
  /** Seven cells, Monday first. Null where the day is outside the history. */
  cells: (DayRecord | null)[]
}

/**
 * The last few weeks as rows, so a weak day shows up as a column.
 *
 * One bad Thursday is a bad Thursday. Eight of them in a column is a fact
 * about the week, and the difference is only visible when the weeks are
 * stacked.
 */
export function weekGrid(days: readonly DayRecord[], weeks: number, today: string): WeekRow[] {
  const byDay = new Map(days.map((d) => [d.day, d]))
  const thisMonday = weekStart(today)

  return Array.from({ length: weeks }, (_, i) => {
    const start = addDays(thisMonday, -(weeks - 1 - i) * 7)
    return {
      weekStart: start,
      cells: Array.from({ length: 7 }, (_, offset) => {
        const day = addDays(start, offset)
        if (day > today) return null
        return byDay.get(day) ?? { day, minutes: 0, met: false }
      }),
    }
  })
}

/** Share of the last `window` days that met the goal, 0–1. */
export function consistencyScore(
  days: readonly DayRecord[],
  today: string,
  window = 28,
): number {
  const byDay = new Map(days.map((d) => [d.day, d]))
  let met = 0
  for (let i = 0; i < window; i += 1) {
    if (byDay.get(addDays(today, -i))?.met) met += 1
  }
  return met / window
}

export interface TrendPoint {
  day: string
  score: number
}

/**
 * Consistency itself, plotted.
 *
 * Accuracy improving while consistency falls is the most common way practice
 * quietly stops, and neither chart shows it alone.
 */
export function consistencyTrend(
  days: readonly DayRecord[],
  today: string,
  options: { window?: number; points?: number; step?: number } = {},
): TrendPoint[] {
  const { window = 28, points = 12, step = 7 } = options
  return Array.from({ length: points }, (_, i) => {
    const day = addDays(today, -(points - 1 - i) * step)
    return { day, score: consistencyScore(days, day, window) }
  })
}

export type InsightTone = 'good' | 'watch' | 'act'

export interface Insight {
  id: string
  tone: InsightTone
  title: string
  detail: string
}

export interface RhythmInput {
  days: readonly DayRecord[]
  sessions: readonly SessionTime[]
  goal: DailyGoal
  today: string
  /** Local hour right now, for the end-of-day nudge. */
  hour: number
}

/** Enough history for a weekday claim to mean anything. */
const MIN_DAYS_FOR_PATTERN = 21
const MIN_OCCURRENCES = 3

/**
 * What the data actually says to do differently.
 *
 * Every line here has to be earned by a number, and the app says the number,
 * because "practise more consistently" is advice nobody has ever been able to
 * act on. The rules are ordered by how actionable they are, not how alarming.
 */
export function rhythmInsights(input: RhythmInput): Insight[] {
  const { days, sessions, goal, today, hour } = input
  const insights: Insight[] = []

  const observed = days.filter((d) => d.day <= today)
  const span = observed.length
  const practisedDays = observed.filter((d) => d.minutes > 0)

  if (span < MIN_DAYS_FOR_PATTERN) {
    insights.push({
      id: 'early-days',
      tone: 'good',
      title: 'Still early to read a pattern',
      detail:
        `${span} day${span === 1 ? '' : 's'} of history so far. After three weeks ` +
        `this page can tell you which weekday your practice tends to slip on.`,
    })
    return insights
  }

  const stats = weekdayStats(observed)
  const ranked = stats.filter((s) => s.elapsed >= MIN_OCCURRENCES).sort((a, b) => a.rate - b.rate)
  const weakest = ranked[0]
  const strongest = ranked.at(-1)

  // The weak weekday, but only when it is genuinely worse than the rest —
  // otherwise this fires on noise and teaches the singer to ignore the page.
  if (weakest && strongest && strongest.rate - weakest.rate >= 0.3) {
    const missed = weakest.elapsed - weakest.met
    const strongestMissed = strongest.elapsed - strongest.met
    insights.push({
      id: 'weak-weekday',
      tone: 'act',
      title: `${WEEKDAY_LONG[weakest.weekday]}s are where the week breaks`,
      detail:
        `${missed} of the last ${weakest.elapsed} ${WEEKDAY_LONG[weakest.weekday]}s missed the goal — ` +
        `on ${WEEKDAY_LONG[strongest.weekday]}s only ${strongestMissed} of ${strongest.elapsed} did. ` +
        `Either move something into that day, or make it a rest day on purpose: ` +
        `a planned rest keeps the streak, an unplanned one costs it.`,
    })
  }

  if (strongest && strongest.rate >= 0.8 && strongest.elapsed >= MIN_OCCURRENCES) {
    insights.push({
      id: 'strong-weekday',
      tone: 'good',
      title: `${WEEKDAY_LONG[strongest.weekday]} is your reliable day`,
      detail:
        `${strongest.met} of ${strongest.elapsed} met, median ${Math.round(strongest.medianMinutes)} ` +
        `minutes. Worth putting the hardest thing you are learning here.`,
    })
  }

  // A goal set above the median practice day is the usual reason a streak
  // dies, and lowering it is the fix nobody suggests.
  const minutesRule = goal.rules.find((r) => r.metric === 'minutes')
  if (minutesRule && practisedDays.length >= 5) {
    const typical = median(practisedDays.map((d) => d.minutes))
    if (typical > 0 && typical < minutesRule.target * 0.8) {
      const wouldHaveCounted = practisedDays.filter(
        (d) => d.minutes >= Math.round(typical) && !d.met,
      ).length
      insights.push({
        id: 'goal-above-habit',
        tone: 'act',
        title: 'Your goal is set above your actual day',
        detail:
          `The goal asks ${minutesRule.target} ${METRIC_SHORT.minutes}, but your typical practice ` +
          `day is ${Math.round(typical)}. ` +
          (wouldHaveCounted > 0
            ? `${wouldHaveCounted} day${wouldHaveCounted === 1 ? '' : 's'} you did practise did not count. `
            : '') +
          `A goal you meet on a bad day beats one you meet on a good one — ` +
          `consider ${Math.round(typical)} minutes and let the long days be a bonus.`,
      })
    }
  }

  // Days that came close are the cheapest to rescue.
  if (minutesRule) {
    const nearMiss = observed.filter(
      (d) => !d.met && d.minutes > 0 && minutesRule.target - d.minutes <= 5,
    ).length
    if (nearMiss >= 2) {
      insights.push({
        id: 'near-miss',
        tone: 'watch',
        title: `${nearMiss} days ended just short`,
        detail:
          `Each was within five minutes of counting. One more varisai at the end of ` +
          `those sittings would have carried the day.`,
      })
    }
  }

  const anchor = anchorHour(sessions)
  if (anchor && sessions.length >= 8) {
    const window = `${formatHour(anchor.start)}–${formatHour((anchor.start + 3) % 24)}`
    if (anchor.share >= 0.6) {
      insights.push({
        id: 'anchored',
        tone: 'good',
        title: `You sing between ${window}`,
        detail:
          `${Math.round(anchor.share * 100)}% of your sittings start in that window. ` +
          `A fixed hour is what turns practice into a habit — protect it.`,
      })
    } else {
      insights.push({
        id: 'no-anchor',
        tone: 'watch',
        title: 'Your practice hour moves around',
        detail:
          `Only ${Math.round(anchor.share * 100)}% of sittings start in your commonest window ` +
          `(${window}). Practice that has no fixed time competes with everything else in the ` +
          `day, and usually loses. Pick the hour that already works and defend it.`,
      })
    }
  }

  // The nudge that can still be acted on today.
  const todayRecord = observed.find((d) => d.day === today)
  if (todayRecord && !todayRecord.met && hour >= 18) {
    insights.push({
      id: 'streak-risk',
      tone: 'act',
      title: "Today has not counted yet",
      detail:
        todayRecord.minutes > 0
          ? `${Math.round(todayRecord.minutes)} minutes so far. A short sitting now still keeps the day.`
          : `Nothing recorded today. Even ten minutes on the drone keeps the streak alive.`,
    })
  }

  const score = consistencyScore(observed, today)
  insights.push({
    id: 'consistency',
    tone: score >= 0.7 ? 'good' : score >= 0.4 ? 'watch' : 'act',
    title: `${Math.round(score * 100)}% of the last four weeks counted`,
    detail:
      score >= 0.7
        ? 'A habit at this point rather than an intention. Keep the bar where it is.'
        : 'Consistency moves faster than accuracy does, and it is the one that decides whether you reach a keerthana.',
  })

  return insights
}

function formatHour(hour: number): string {
  if (hour === 0) return '12am'
  if (hour === 12) return '12pm'
  return hour < 12 ? `${hour}am` : `${hour - 12}pm`
}

/**
 * Build the contiguous day series the functions above expect.
 *
 * Days with no practice have to be present as zeroes; leaving them out would
 * turn a missed week into a week that never happened.
 */
export function toDayRecords(
  rows: readonly { day: string; minutes: number; met: boolean; rest?: boolean }[],
  from: string,
  to: string,
): DayRecord[] {
  const byDay = new Map(rows.map((r) => [r.day, r]))
  const length = Math.max(0, daysBetween(from, to) + 1)
  return Array.from({ length }, (_, i) => {
    const day = addDays(from, i)
    return byDay.get(day) ?? { day, minutes: 0, met: false }
  })
}
