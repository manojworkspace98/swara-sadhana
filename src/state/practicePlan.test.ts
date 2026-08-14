import { describe, expect, it } from 'vitest'
import { buildPlan, nextLessonToLearn, planTotalMinutes } from './practicePlan'
import { emptyScore } from './mastery'
import type { LessonScore } from './types'

const T0 = new Date('2026-08-14T09:00:00').getTime()
const DAY = 86_400_000

const held = (stars: 0 | 1 | 2 | 3, reviewDueAt: number | null = null): LessonScore => ({
  ...emptyScore(),
  stars,
  reviewDueAt,
})

const LESSONS = ['L1.01', 'L1.02', 'L1.03', 'L1.04']

describe('nextLessonToLearn', () => {
  it('starts at the beginning for a new learner', () => {
    expect(nextLessonToLearn(LESSONS, {})).toBe('L1.01')
  })

  it('moves on once a lesson is held at two stars', () => {
    expect(nextLessonToLearn(LESSONS, { 'L1.01': held(2) })).toBe('L1.02')
  })

  it('returns to the earliest weak link rather than the furthest reached', () => {
    const scores = { 'L1.01': held(3), 'L1.02': held(1), 'L1.03': held(3) }
    expect(nextLessonToLearn(LESSONS, scores)).toBe('L1.02')
  })

  it('settles on the last lesson when everything is held', () => {
    const scores = Object.fromEntries(LESSONS.map((id) => [id, held(3)]))
    expect(nextLessonToLearn(LESSONS, scores)).toBe('L1.04')
  })

  it('copes with an empty curriculum', () => {
    expect(nextLessonToLearn([], {})).toBeNull()
  })
})

describe('buildPlan', () => {
  const base = {
    scores: {},
    availableLessonIds: LESSONS,
    warmupLessonId: 'L0.3',
    now: T0,
  }

  it('opens with a warm-up and spends the bulk on the current lesson', () => {
    const plan = buildPlan({ ...base, minutes: 20 })
    expect(plan[0].kind).toBe('warmup')
    expect(plan.some((p) => p.kind === 'lesson')).toBe(true)
    const lesson = plan.find((p) => p.kind === 'lesson')!
    expect(lesson.targetMin).toBeGreaterThan(plan[0].targetMin)
  })

  it('roughly fills the time asked for', () => {
    for (const minutes of [10, 20, 30, 45, 60]) {
      const total = planTotalMinutes(buildPlan({ ...base, minutes }))
      expect(total).toBeGreaterThanOrEqual(minutes - 2)
      expect(total).toBeLessThanOrEqual(minutes + 4)
    }
  })

  it('adds revision only when something is actually due', () => {
    expect(buildPlan({ ...base, minutes: 30 }).some((p) => p.kind === 'review')).toBe(false)

    const withDue = buildPlan({
      ...base,
      minutes: 30,
      scores: { 'L1.01': held(2, T0 - 2 * DAY) },
    })
    const review = withDue.find((p) => p.kind === 'review')
    expect(review?.lessonId).toBe('L1.01')
    expect(review?.reason).toContain('2 days ago')
  })

  it('caps revision at one item so the session stays finishable', () => {
    const scores: Record<string, LessonScore> = {}
    for (const id of LESSONS) scores[id] = held(2, T0 - 5 * DAY)
    const plan = buildPlan({ ...base, minutes: 45, scores })
    expect(plan.filter((p) => p.kind === 'review')).toHaveLength(1)
  })

  it('adds free singing only when the session is long enough to afford it', () => {
    expect(buildPlan({ ...base, minutes: 20 }).some((p) => p.kind === 'stretch')).toBe(false)
    expect(buildPlan({ ...base, minutes: 45 }).some((p) => p.kind === 'stretch')).toBe(true)
  })

  it('still produces a usable plan with no warm-up lesson defined', () => {
    const plan = buildPlan({ ...base, minutes: 20, warmupLessonId: null })
    expect(plan.some((p) => p.kind === 'warmup')).toBe(false)
    expect(plan.some((p) => p.kind === 'lesson')).toBe(true)
  })

  it('never proposes a session of nothing', () => {
    const plan = buildPlan({
      ...base,
      minutes: 10,
      availableLessonIds: [],
      warmupLessonId: null,
    })
    expect(plan.every((p) => p.targetMin > 0)).toBe(true)
  })
})
