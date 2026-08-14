import { describe, expect, it } from 'vitest'
import {
  DEFAULT_GOAL,
  describeGoal,
  goalMet,
  goalProgress,
  GOAL_PRESETS,
  isRestDay,
  remainingText,
  sanitiseGoal,
  type DailyGoal,
  type DayTotals,
} from './goals'

const WED = new Date(2026, 7, 12, 10, 0) // Wednesday
const SUN = new Date(2026, 7, 16, 10, 0) // Sunday

const totals = (over: Partial<DayTotals> = {}): DayTotals => ({
  minutes: 0,
  exercises: 0,
  cleanPasses: 0,
  ...over,
})

const minutesGoal = (target: number): DailyGoal => ({
  rules: [{ metric: 'minutes', target }],
  restDays: [],
})

describe('goalMet', () => {
  it('counts a day once the target is reached', () => {
    expect(goalMet(minutesGoal(30), totals({ minutes: 29 }), WED)).toBe(false)
    expect(goalMet(minutesGoal(30), totals({ minutes: 30 }), WED)).toBe(true)
    expect(goalMet(minutesGoal(30), totals({ minutes: 45 }), WED)).toBe(true)
  })

  it('requires every rule when more than one is set', () => {
    const goal: DailyGoal = {
      rules: [
        { metric: 'minutes', target: 45 },
        { metric: 'cleanPasses', target: 2 },
      ],
      restDays: [],
    }
    expect(goalMet(goal, totals({ minutes: 60, cleanPasses: 1 }), WED)).toBe(false)
    expect(goalMet(goal, totals({ minutes: 30, cleanPasses: 3 }), WED)).toBe(false)
    expect(goalMet(goal, totals({ minutes: 45, cleanPasses: 2 }), WED)).toBe(true)
  })

  it('lets a goal be set by work rather than by the clock', () => {
    const goal: DailyGoal = { rules: [{ metric: 'cleanPasses', target: 3 }], restDays: [] }
    expect(goalMet(goal, totals({ minutes: 120, cleanPasses: 2 }), WED)).toBe(false)
    expect(goalMet(goal, totals({ minutes: 12, cleanPasses: 3 }), WED)).toBe(true)
  })

  it('treats a rest day as met without any practice', () => {
    const goal = { ...minutesGoal(30), restDays: [0] }
    expect(isRestDay(goal, SUN)).toBe(true)
    expect(goalMet(goal, totals(), SUN)).toBe(true)
    expect(goalMet(goal, totals(), WED)).toBe(false)
  })

  it('is never met when no rule is set', () => {
    expect(goalMet({ rules: [], restDays: [] }, totals({ minutes: 999 }), WED)).toBe(false)
  })
})

describe('goalProgress', () => {
  it('reports part of the way there', () => {
    expect(goalProgress(minutesGoal(30), totals({ minutes: 15 }))).toBeCloseTo(0.5, 6)
  })

  it('averages across rules so both show movement', () => {
    const goal: DailyGoal = {
      rules: [
        { metric: 'minutes', target: 40 },
        { metric: 'cleanPasses', target: 4 },
      ],
      restDays: [],
    }
    expect(goalProgress(goal, totals({ minutes: 40, cleanPasses: 0 }))).toBeCloseTo(0.5, 6)
    expect(goalProgress(goal, totals({ minutes: 20, cleanPasses: 2 }))).toBeCloseTo(0.5, 6)
  })

  it('does not run past one when a target is beaten', () => {
    expect(goalProgress(minutesGoal(20), totals({ minutes: 200 }))).toBe(1)
  })
})

describe('describeGoal and remainingText', () => {
  it('reads as a phrase', () => {
    expect(describeGoal(minutesGoal(30))).toBe('30 min')
    expect(
      describeGoal({
        rules: [
          { metric: 'minutes', target: 45 },
          { metric: 'cleanPasses', target: 2 },
        ],
        restDays: [],
      }),
    ).toBe('45 min and 2 clean')
  })

  it('says what is left, and nothing once the day is done', () => {
    expect(remainingText(minutesGoal(30), totals({ minutes: 12 }))).toBe('18 more min')
    expect(remainingText(minutesGoal(30), totals({ minutes: 30 }))).toBeNull()
  })
})

describe('sanitiseGoal', () => {
  it('drops rules that ask for nothing', () => {
    const out = sanitiseGoal({ rules: [{ metric: 'minutes', target: 0 }], restDays: [] })
    expect(out.rules).toEqual(DEFAULT_GOAL.rules)
  })

  it('keeps one rule per measure', () => {
    const out = sanitiseGoal({
      rules: [
        { metric: 'minutes', target: 20 },
        { metric: 'minutes', target: 40 },
      ],
      restDays: [],
    })
    expect(out.rules).toHaveLength(1)
    expect(out.rules[0].target).toBe(40)
  })

  it('caps a target at something a person could actually do', () => {
    const out = sanitiseGoal({ rules: [{ metric: 'minutes', target: 5000 }], restDays: [] })
    expect(out.rules[0].target).toBe(600)
  })

  it('rounds fractional targets and rejects nonsense', () => {
    expect(sanitiseGoal({ rules: [{ metric: 'minutes', target: 20.4 }], restDays: [] }).rules[0].target).toBe(20)
    expect(sanitiseGoal({ rules: [{ metric: 'minutes', target: NaN }], restDays: [] }).rules).toEqual(DEFAULT_GOAL.rules)
  })

  it('tidies rest days', () => {
    const out = sanitiseGoal({ rules: [{ metric: 'minutes', target: 30 }], restDays: [0, 0, 9, -1, 6] })
    expect(out.restDays).toEqual([0, 6])
  })
})

describe('the presets', () => {
  it('are all usable as they stand', () => {
    for (const p of GOAL_PRESETS) {
      expect(sanitiseGoal(p.goal)).toEqual(p.goal)
      expect(p.goal.rules.length).toBeGreaterThan(0)
    }
  })
})
