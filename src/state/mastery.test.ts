import { describe, expect, it } from 'vitest'
import {
  applyAttempt,
  deriveStars,
  dueReviews,
  emptyScore,
  highestUnlockedLevel,
  isLevelUnlocked,
  levelCompletion,
  REVIEW_INTERVALS_DAYS,
  type AttemptResult,
} from './mastery'
import type { LessonScore } from './types'

const DAY = 86_400_000
const T0 = new Date('2026-08-14T09:00:00').getTime()

function attempt(over: Partial<AttemptResult> = {}): AttemptResult {
  return {
    pitchAccuracy: 95,
    rhythmAccuracy: 90,
    kalam: 1,
    durationSec: 120,
    clean: true,
    at: T0,
    ...over,
  }
}

describe('deriveStars', () => {
  it('gives nothing until the first speed is clean and in tune', () => {
    expect(deriveStars(emptyScore())).toBe(0)
    expect(
      deriveStars({ ...emptyScore(), kalamsCompleted: [1], bestPitchAccuracy: 65 }),
    ).toBe(0)
  })

  it('gives one star for a clean first speed', () => {
    expect(
      deriveStars({ ...emptyScore(), kalamsCompleted: [1], bestPitchAccuracy: 72 }),
    ).toBe(1)
  })

  it('requires two speeds and rhythm for the second star', () => {
    const nearly: LessonScore = {
      ...emptyScore(),
      kalamsCompleted: [1, 2],
      bestPitchAccuracy: 85,
      bestRhythmAccuracy: 60,
    }
    expect(deriveStars(nearly)).toBe(1)
    expect(deriveStars({ ...nearly, bestRhythmAccuracy: 80 })).toBe(2)
  })

  it('requires all three speeds for the third star', () => {
    const two: LessonScore = {
      ...emptyScore(),
      kalamsCompleted: [1, 2],
      bestPitchAccuracy: 95,
      bestRhythmAccuracy: 95,
    }
    expect(deriveStars(two)).toBe(2)
    expect(deriveStars({ ...two, kalamsCompleted: [1, 2, 3] })).toBe(3)
  })
})

describe('applyAttempt', () => {
  it('records the first attempt', () => {
    const s = applyAttempt(emptyScore(), attempt())
    expect(s.attempts).toBe(1)
    expect(s.cleanPasses).toBe(1)
    expect(s.kalamsCompleted).toEqual([1])
    expect(s.firstPracticedAt).toBe(T0)
    expect(s.stars).toBe(1)
  })

  it('keeps the best score after a worse day', () => {
    const good = applyAttempt(emptyScore(), attempt({ pitchAccuracy: 92 }))
    const bad = applyAttempt(good, attempt({ pitchAccuracy: 55 }))
    expect(bad.bestPitchAccuracy).toBe(92)
    expect(bad.attempts).toBe(2)
  })

  it('only credits a speed when the pass was clean', () => {
    const messy = applyAttempt(emptyScore(), attempt({ kalam: 2, clean: false }))
    expect(messy.kalamsCompleted).toEqual([])
    expect(messy.cleanPasses).toBe(0)
  })

  it('accumulates practice time across attempts', () => {
    let s = applyAttempt(emptyScore(), attempt({ durationSec: 100 }))
    s = applyAttempt(s, attempt({ durationSec: 150 }))
    expect(s.totalPracticeSec).toBe(250)
  })

  it('schedules a review once the lesson reaches two stars', () => {
    let s = applyAttempt(emptyScore(), attempt({ kalam: 1 }))
    expect(s.reviewDueAt).toBeNull()
    s = applyAttempt(s, attempt({ kalam: 2 }))
    expect(s.stars).toBe(2)
    expect(s.srsIndex).toBe(0)
    expect(s.reviewDueAt).toBe(T0 + REVIEW_INTERVALS_DAYS[0] * DAY)
  })

  it('pushes the next review further out when the lesson holds up', () => {
    let s = applyAttempt(emptyScore(), attempt({ kalam: 1 }))
    s = applyAttempt(s, attempt({ kalam: 2 }))
    const later = applyAttempt(s, attempt({ kalam: 2, at: T0 + DAY }))
    expect(later.srsIndex).toBe(1)
    expect(later.reviewDueAt).toBe(T0 + DAY + REVIEW_INTERVALS_DAYS[1] * DAY)
  })

  it('brings a slipped lesson back sooner', () => {
    let s = applyAttempt(emptyScore(), attempt({ kalam: 1 }))
    s = applyAttempt(s, attempt({ kalam: 2 }))
    s = applyAttempt(s, attempt({ kalam: 2, at: T0 + DAY })) // index 1
    const slipped = applyAttempt(s, attempt({ kalam: 2, pitchAccuracy: 60, at: T0 + 2 * DAY }))
    expect(slipped.srsIndex).toBe(0)
  })

  it('does not push past the end of the interval ladder', () => {
    let s = applyAttempt(emptyScore(), attempt({ kalam: 1 }))
    s = applyAttempt(s, attempt({ kalam: 2 }))
    for (let i = 0; i < 12; i++) {
      s = applyAttempt(s, attempt({ kalam: 2, at: T0 + i * DAY }))
    }
    expect(s.srsIndex).toBe(REVIEW_INTERVALS_DAYS.length - 1)
  })
})

describe('dueReviews', () => {
  const withDue = (dueAt: number | null): LessonScore => ({
    ...emptyScore(),
    stars: 2,
    reviewDueAt: dueAt,
  })

  it('returns nothing when nothing is due', () => {
    expect(dueReviews({ a: withDue(T0 + DAY) }, T0)).toEqual([])
  })

  it('surfaces the most overdue first', () => {
    const out = dueReviews(
      {
        recent: withDue(T0 - DAY),
        ancient: withDue(T0 - 10 * DAY),
      },
      T0,
    )
    expect(out[0].lessonId).toBe('ancient')
    expect(out[0].overdueDays).toBe(10)
  })

  it('caps the day so revision stays doable', () => {
    const scores: Record<string, LessonScore> = {}
    for (let i = 0; i < 9; i++) scores[`l${i}`] = withDue(T0 - (i + 1) * DAY)
    expect(dueReviews(scores, T0)).toHaveLength(2)
    expect(dueReviews(scores, T0, 5)).toHaveLength(5)
  })

  it('ignores lessons that never entered review', () => {
    expect(dueReviews({ a: withDue(null) }, T0)).toEqual([])
  })
})

describe('level unlocking', () => {
  const held = (stars: 0 | 1 | 2 | 3): LessonScore => ({ ...emptyScore(), stars })

  it('measures completion by lessons at two stars or more', () => {
    const scores = { a: held(2), b: held(3), c: held(1), d: held(0), e: held(2) }
    expect(levelCompletion(['a', 'b', 'c', 'd', 'e'], scores)).toBeCloseTo(0.6, 6)
  })

  it('treats an empty level as complete rather than dividing by zero', () => {
    expect(levelCompletion([], {})).toBe(1)
  })

  it('always leaves the first level open', () => {
    expect(isLevelUnlocked(0, { 0: ['a'] }, {})).toBe(true)
  })

  it('opens the next level at eighty percent, not perfection', () => {
    const ids = ['a', 'b', 'c', 'd', 'e']
    const four = { a: held(2), b: held(2), c: held(2), d: held(2), e: held(0) }
    const three = { ...four, d: held(1) }
    expect(isLevelUnlocked(1, { 0: ids }, four)).toBe(true)
    expect(isLevelUnlocked(1, { 0: ids }, three)).toBe(false)
  })

  it('will not skip a level that was left behind', () => {
    const byLevel = { 0: ['a'], 1: ['b'], 2: ['c'] }
    const scores = { a: held(3), b: held(0), c: held(3) }
    expect(isLevelUnlocked(1, byLevel, scores)).toBe(true)
    expect(isLevelUnlocked(2, byLevel, scores)).toBe(false)
    expect(highestUnlockedLevel(byLevel, scores)).toBe(1)
  })
})
