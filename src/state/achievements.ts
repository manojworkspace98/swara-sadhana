import type { Achievement, LessonScore, ProgressStore } from './types'

export interface AchievementDef {
  id: string
  title: string
  /** What earns it, in the second person. */
  requirement: string
  /** 0–1. Anything at 1 is unlocked. */
  measure: (ctx: AchievementContext) => number
}

export interface AchievementContext {
  progress: ProgressStore
  totalPracticeSec: number
  streakCurrent: number
  /** Local hour of the session just finished, for the time-of-day badges. */
  sessionHour: number | null
  /** Lesson ids by curriculum kind, so form badges can be checked. */
  lessonKinds: Record<string, string>
  recordingsPinned: number
  /** Best daily steadiness ever measured, from the voice rollups. */
  steadinessBest: number | null
}

const ratio = (value: number, target: number) => Math.min(1, value / target)

function bestPitch(scores: Record<string, LessonScore>): number {
  return Object.values(scores).reduce((m, s) => Math.max(m, s.bestPitchAccuracy), 0)
}

function anyOfKindHeld(ctx: AchievementContext, kind: string): boolean {
  return Object.entries(ctx.lessonKinds).some(
    ([id, k]) => k === kind && (ctx.progress.lessonScores[id]?.stars ?? 0) >= 2,
  )
}

/**
 * Badges mark the milestones a teacher would actually remark on. Each one
 * reports partial progress so a locked badge can show how close it is —
 * knowing you are four days into a seven-day streak is the encouragement;
 * a blank grey square is not.
 */
export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first_session',
    title: 'First sitting',
    requirement: 'Finish your first practice session.',
    measure: (c) => ratio(c.totalPracticeSec, 60),
  },
  {
    id: 'streak_7',
    title: 'A week of mornings',
    requirement: 'Practise seven days running.',
    measure: (c) => ratio(c.streakCurrent, 7),
  },
  {
    id: 'streak_30',
    title: 'A month unbroken',
    requirement: 'Practise thirty days running.',
    measure: (c) => ratio(c.streakCurrent, 30),
  },
  {
    id: 'streak_100',
    title: 'A hundred days',
    requirement: 'Practise a hundred days running.',
    measure: (c) => ratio(c.streakCurrent, 100),
  },
  {
    id: 'early_bird',
    title: 'Before the day starts',
    requirement: 'Finish a session before seven in the morning.',
    measure: (c) => (c.sessionHour !== null && c.sessionHour < 7 ? 1 : 0),
  },
  {
    id: 'night_owl',
    title: 'After the house is quiet',
    requirement: 'Finish a session after ten at night.',
    measure: (c) => (c.sessionHour !== null && c.sessionHour >= 22 ? 1 : 0),
  },
  {
    id: 'sarali_complete',
    title: 'All fourteen',
    requirement: 'Hold every sarali varisai at two stars.',
    measure: (c) => {
      const ids = Object.entries(c.lessonKinds)
        .filter(([, k]) => k === 'sarali')
        .map(([id]) => id)
      if (ids.length === 0) return 0
      const held = ids.filter((id) => (c.progress.lessonScores[id]?.stars ?? 0) >= 2)
      return held.length / ids.length
    },
  },
  {
    id: 'first_geetam',
    title: 'Your first song',
    requirement: 'Hold a geetam at two stars.',
    measure: (c) => (anyOfKindHeld(c, 'geetam') ? 1 : 0),
  },
  {
    id: 'first_varnam',
    title: 'The varnam',
    requirement: 'Hold a varnam at two stars.',
    measure: (c) => (anyOfKindHeld(c, 'varnam') ? 1 : 0),
  },
  {
    id: 'first_kriti',
    title: 'A keerthana of your own',
    requirement: 'Hold a keerthana at two stars.',
    measure: (c) => (anyOfKindHeld(c, 'kriti') ? 1 : 0),
  },
  {
    id: 'accuracy_90',
    title: 'Ninety percent',
    requirement: 'Sing any lesson at ninety percent pitch accuracy.',
    measure: (c) => ratio(bestPitch(c.progress.lessonScores), 90),
  },
  {
    id: 'accuracy_95',
    title: 'Very close to the note',
    requirement: 'Sing any lesson at ninety-five percent pitch accuracy.',
    measure: (c) => ratio(bestPitch(c.progress.lessonScores), 95),
  },
  {
    id: 'three_kalams',
    title: 'All three speeds',
    requirement: 'Take one lesson to three stars.',
    measure: (c) => {
      const best = Object.values(c.progress.lessonScores).reduce(
        (m, s) => Math.max(m, s.stars),
        0,
      )
      return ratio(best, 3)
    },
  },
  {
    id: 'ten_hours',
    title: 'Ten hours in',
    requirement: 'Practise for ten hours in total.',
    measure: (c) => ratio(c.totalPracticeSec, 10 * 3600),
  },
  {
    id: 'fifty_hours',
    title: 'Fifty hours in',
    requirement: 'Practise for fifty hours in total.',
    measure: (c) => ratio(c.totalPracticeSec, 50 * 3600),
  },
  {
    id: 'range_octave',
    title: 'An octave and more',
    requirement: 'Hold notes across more than an octave.',
    measure: (c) => {
      const { rangeLowMidi: lo, rangeHighMidi: hi } = c.progress
      if (lo == null || hi == null) return 0
      return ratio(hi - lo, 13)
    },
  },
  {
    id: 'steady_hand',
    title: 'A steady note',
    requirement: 'Reach a steadiness of eighty-five on a held note.',
    measure: (c) => ratio(c.steadinessBest ?? 0, 85),
  },
  {
    id: 'archivist',
    title: 'Worth keeping',
    requirement: 'Pin ten recordings.',
    measure: (c) => ratio(c.recordingsPinned, 10),
  },
]

export interface AchievementOutcome {
  achievements: Record<string, Achievement>
  /** Newly earned this evaluation, for the toast. */
  unlocked: AchievementDef[]
}

/**
 * Re-measure every badge. Unlock times are never rewritten once set, so a
 * badge earned in March keeps its March date even if the measure later dips.
 */
export function evaluateAchievements(
  ctx: AchievementContext,
  now: number = Date.now(),
): AchievementOutcome {
  const next: Record<string, Achievement> = {}
  const unlocked: AchievementDef[] = []

  for (const def of ACHIEVEMENTS) {
    const prev = ctx.progress.achievements[def.id]
    const progress = Math.max(0, Math.min(1, def.measure(ctx)))
    const alreadyHad = prev?.unlockedAt != null

    if (!alreadyHad && progress >= 1) unlocked.push(def)

    next[def.id] = {
      id: def.id,
      progress: alreadyHad ? 1 : progress,
      unlockedAt: alreadyHad ? prev!.unlockedAt : progress >= 1 ? now : null,
    }
  }

  return { achievements: next, unlocked }
}

export function unlockedCount(achievements: Record<string, Achievement>): number {
  return Object.values(achievements).filter((a) => a.unlockedAt != null).length
}
