import { describe, expect, it } from 'vitest'
import {
  ACHIEVEMENTS,
  evaluateAchievements,
  unlockedCount,
  type AchievementContext,
} from './achievements'
import { emptyScore } from './mastery'
import { emptyProgress } from './profiles'
import type { LessonScore, ProgressStore } from './types'

const NOW = new Date('2026-08-14T09:00:00').getTime()

function ctx(over: Partial<AchievementContext> = {}): AchievementContext {
  return {
    progress: emptyProgress('p1'),
    totalPracticeSec: 0,
    streakCurrent: 0,
    sessionHour: 9,
    lessonKinds: {},
    recordingsPinned: 0,
    steadinessBest: null,
    ...over,
  }
}

const scored = (over: Partial<LessonScore>): LessonScore => ({ ...emptyScore(), ...over })

function withScores(
  base: ProgressStore,
  lessonScores: Record<string, LessonScore>,
): ProgressStore {
  return { ...base, lessonScores }
}

describe('evaluateAchievements', () => {
  it('reports every badge, locked, for a brand-new singer', () => {
    const out = evaluateAchievements(ctx(), NOW)
    expect(Object.keys(out.achievements)).toHaveLength(ACHIEVEMENTS.length)
    expect(unlockedCount(out.achievements)).toBe(0)
    expect(out.unlocked).toEqual([])
  })

  it('unlocks the first sitting after a minute of practice', () => {
    const out = evaluateAchievements(ctx({ totalPracticeSec: 90 }), NOW)
    expect(out.achievements.first_session.unlockedAt).toBe(NOW)
    expect(out.unlocked.map((a) => a.id)).toContain('first_session')
  })

  it('shows partial progress on a locked badge', () => {
    const out = evaluateAchievements(ctx({ streakCurrent: 4 }), NOW)
    expect(out.achievements.streak_7.progress).toBeCloseTo(4 / 7, 5)
    expect(out.achievements.streak_7.unlockedAt).toBeNull()
  })

  it('keeps the original date once a badge is earned', () => {
    const first = evaluateAchievements(ctx({ streakCurrent: 7 }), NOW)
    expect(first.achievements.streak_7.unlockedAt).toBe(NOW)

    // The streak later breaks; the badge stays earned, dated when it happened.
    const later = evaluateAchievements(
      ctx({
        streakCurrent: 0,
        progress: { ...emptyProgress('p1'), achievements: first.achievements },
      }),
      NOW + 86_400_000,
    )
    expect(later.achievements.streak_7.unlockedAt).toBe(NOW)
    expect(later.achievements.streak_7.progress).toBe(1)
    expect(later.unlocked).toEqual([])
  })

  it('announces a badge only the first time', () => {
    const first = evaluateAchievements(ctx({ totalPracticeSec: 120 }), NOW)
    expect(first.unlocked.map((a) => a.id)).toContain('first_session')

    const second = evaluateAchievements(
      ctx({
        totalPracticeSec: 240,
        progress: { ...emptyProgress('p1'), achievements: first.achievements },
      }),
      NOW,
    )
    expect(second.unlocked.map((a) => a.id)).not.toContain('first_session')
  })

  it('tracks the sarali set as a fraction of the fourteen', () => {
    const lessonKinds = Object.fromEntries(
      Array.from({ length: 14 }, (_, i) => [`L1.${i}`, 'sarali']),
    )
    const scores = Object.fromEntries(
      Array.from({ length: 7 }, (_, i) => [`L1.${i}`, scored({ stars: 2 })]),
    )
    const out = evaluateAchievements(
      ctx({ lessonKinds, progress: withScores(emptyProgress('p1'), scores) }),
      NOW,
    )
    expect(out.achievements.sarali_complete.progress).toBeCloseTo(0.5, 5)
  })

  it('needs the form actually held, not merely attempted', () => {
    const lessonKinds = { 'L4.1': 'geetam' }
    const attempted = evaluateAchievements(
      ctx({
        lessonKinds,
        progress: withScores(emptyProgress('p1'), { 'L4.1': scored({ stars: 1 }) }),
      }),
      NOW,
    )
    expect(attempted.achievements.first_geetam.unlockedAt).toBeNull()

    const held = evaluateAchievements(
      ctx({
        lessonKinds,
        progress: withScores(emptyProgress('p1'), { 'L4.1': scored({ stars: 2 }) }),
      }),
      NOW,
    )
    expect(held.achievements.first_geetam.unlockedAt).toBe(NOW)
  })

  it('rewards the time of day a session actually ended', () => {
    expect(evaluateAchievements(ctx({ sessionHour: 6 }), NOW).achievements.early_bird.unlockedAt).toBe(NOW)
    expect(evaluateAchievements(ctx({ sessionHour: 6 }), NOW).achievements.night_owl.unlockedAt).toBeNull()
    expect(evaluateAchievements(ctx({ sessionHour: 23 }), NOW).achievements.night_owl.unlockedAt).toBe(NOW)
  })

  it('measures range as an octave plus one semitone', () => {
    const narrow = { ...emptyProgress('p1'), rangeLowMidi: 48, rangeHighMidi: 58 }
    const wide = { ...emptyProgress('p1'), rangeLowMidi: 48, rangeHighMidi: 61 }
    expect(evaluateAchievements(ctx({ progress: narrow }), NOW).achievements.range_octave.unlockedAt).toBeNull()
    expect(evaluateAchievements(ctx({ progress: wide }), NOW).achievements.range_octave.unlockedAt).toBe(NOW)
  })

  it('never reports progress outside zero to one', () => {
    const out = evaluateAchievements(
      ctx({
        streakCurrent: 500,
        totalPracticeSec: 10_000_000,
        steadinessBest: 200,
        recordingsPinned: 99,
      }),
      NOW,
    )
    for (const a of Object.values(out.achievements)) {
      expect(a.progress).toBeGreaterThanOrEqual(0)
      expect(a.progress).toBeLessThanOrEqual(1)
    }
  })

  it('gives every badge a unique id', () => {
    const ids = ACHIEVEMENTS.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
