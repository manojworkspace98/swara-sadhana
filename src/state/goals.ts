/**
 * What counts as a day's practice.
 *
 * Minutes are the default because they are the one measure that always
 * applies, but they are a poor description of some days: a morning spent
 * taking one line of a keerthana apart is not idle because it covered no new
 * ground. So the goal can also be set in exercises, or in clean passes, and a
 * learner can require more than one of those at once.
 */
export type GoalMetric = 'minutes' | 'exercises' | 'cleanPasses'

export interface GoalRule {
  metric: GoalMetric
  target: number
}

export interface DailyGoal {
  /** Every rule must be met for the day to count. */
  rules: GoalRule[]
  /** Days the goal is expected. Empty means every day. */
  restDays: number[]
}

export interface DayTotals {
  minutes: number
  exercises: number
  cleanPasses: number
}

export const METRIC_LABEL: Record<GoalMetric, string> = {
  minutes: 'minutes of practice',
  exercises: 'exercises worked',
  cleanPasses: 'clean passes',
}

export const METRIC_SHORT: Record<GoalMetric, string> = {
  minutes: 'min',
  exercises: 'exercises',
  cleanPasses: 'clean',
}

/** Sensible starting points, and what each suits. */
export const GOAL_PRESETS: { id: string; name: string; blurb: string; goal: DailyGoal }[] = [
  {
    id: 'gentle',
    name: 'Gentle',
    blurb: 'Fifteen minutes. Enough to keep the voice in touch on a busy day.',
    goal: { rules: [{ metric: 'minutes', target: 15 }], restDays: [] },
  },
  {
    id: 'steady',
    name: 'Steady',
    blurb: 'Half an hour daily — the pace most teachers ask a new student for.',
    goal: { rules: [{ metric: 'minutes', target: 30 }], restDays: [] },
  },
  {
    id: 'serious',
    name: 'Serious',
    blurb: 'Forty-five minutes and two clean passes, with Sundays off.',
    goal: {
      rules: [
        { metric: 'minutes', target: 45 },
        { metric: 'cleanPasses', target: 2 },
      ],
      restDays: [0],
    },
  },
  {
    id: 'quality',
    name: 'By the work, not the clock',
    blurb: 'Three clean passes, however long they take.',
    goal: { rules: [{ metric: 'cleanPasses', target: 3 }], restDays: [] },
  },
]

export const DEFAULT_GOAL: DailyGoal = GOAL_PRESETS[1].goal

export function totalFor(metric: GoalMetric, totals: DayTotals): number {
  return totals[metric]
}

/** A rest day is satisfied by definition; that is what makes it restful. */
export function isRestDay(goal: DailyGoal, at: number | Date): boolean {
  const d = at instanceof Date ? at : new Date(at)
  return goal.restDays.includes(d.getDay())
}

export function goalMet(goal: DailyGoal, totals: DayTotals, at: number | Date): boolean {
  if (isRestDay(goal, at)) return true
  if (goal.rules.length === 0) return false
  return goal.rules.every((r) => totalFor(r.metric, totals) >= r.target)
}

/** 0–1 across all rules, so a part-finished day still shows movement. */
export function goalProgress(goal: DailyGoal, totals: DayTotals): number {
  if (goal.rules.length === 0) return 0
  const parts = goal.rules.map((r) =>
    Math.min(1, r.target === 0 ? 1 : totalFor(r.metric, totals) / r.target),
  )
  return parts.reduce((a, b) => a + b, 0) / parts.length
}

/** "30 min" or "45 min and 2 clean" — short enough for a header. */
export function describeGoal(goal: DailyGoal): string {
  if (goal.rules.length === 0) return 'no goal set'
  return goal.rules
    .map((r) => `${r.target} ${METRIC_SHORT[r.metric]}`)
    .join(' and ')
}

export function remainingText(goal: DailyGoal, totals: DayTotals): string | null {
  const short = goal.rules
    .map((r) => ({ r, left: r.target - totalFor(r.metric, totals) }))
    .filter((x) => x.left > 0)
  if (short.length === 0) return null
  return short
    .map((x) => `${Math.ceil(x.left)} more ${METRIC_SHORT[x.r.metric]}`)
    .join(' and ')
}

/** Keep a goal usable: at least one rule, and targets that a person can reach. */
export function sanitiseGoal(goal: DailyGoal): DailyGoal {
  const rules = goal.rules
    .filter((r) => Number.isFinite(r.target) && r.target > 0)
    .map((r) => ({
      metric: r.metric,
      target: Math.min(r.metric === 'minutes' ? 600 : 100, Math.round(r.target)),
    }))
  return {
    rules: rules.length ? dedupeByMetric(rules) : DEFAULT_GOAL.rules,
    restDays: [...new Set(goal.restDays.filter((d) => d >= 0 && d <= 6))].sort(),
  }
}

function dedupeByMetric(rules: GoalRule[]): GoalRule[] {
  const seen = new Map<GoalMetric, GoalRule>()
  for (const r of rules) seen.set(r.metric, r)
  return [...seen.values()]
}

/**
 * The goal a profile is actually working to.
 *
 * Profiles created before goals became structured carry only a minutes number,
 * so that is read as a single-rule goal rather than being migrated on write —
 * nothing is lost, and the profile picks up the richer form as soon as it is
 * edited.
 */
export function goalForProfile(profile: {
  goal?: DailyGoal
  dailyGoalMin: number
}): DailyGoal {
  if (profile.goal) return sanitiseGoal(profile.goal)
  return { rules: [{ metric: 'minutes', target: profile.dailyGoalMin }], restDays: [] }
}
