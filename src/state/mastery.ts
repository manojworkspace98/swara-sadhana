import type { Kalam, LessonScore, Stars } from './types'

/**
 * When a lesson comes back for review. A teacher does not let you abandon
 * sarali varisai the week you pass it — the ladder widens rather than moves.
 */
export const REVIEW_INTERVALS_DAYS = [1, 3, 7, 14, 30, 60] as const

/** At most this many revision items are put in front of the learner per day. */
export const MAX_DAILY_REVIEWS = 2

export interface StarThreshold {
  kalams: number
  pitch: number
  rhythm: number
}

/**
 * Stars mean speed as well as accuracy: singing sarali cleanly at first kalam
 * is genuinely not the same accomplishment as singing it at third.
 */
export const STAR_THRESHOLDS: Record<1 | 2 | 3, StarThreshold> = {
  1: { kalams: 1, pitch: 70, rhythm: 0 },
  2: { kalams: 2, pitch: 80, rhythm: 75 },
  3: { kalams: 3, pitch: 90, rhythm: 85 },
}

export function emptyScore(): LessonScore {
  return {
    bestPitchAccuracy: 0,
    bestRhythmAccuracy: 0,
    kalamsCompleted: [],
    stars: 0,
    attempts: 0,
    cleanPasses: 0,
    totalPracticeSec: 0,
    firstPracticedAt: null,
    lastPracticedAt: null,
    srsIndex: -1,
    reviewDueAt: null,
  }
}

export function deriveStars(score: LessonScore): Stars {
  const kalams = score.kalamsCompleted.length
  for (const n of [3, 2, 1] as const) {
    const t = STAR_THRESHOLDS[n]
    if (
      kalams >= t.kalams &&
      score.bestPitchAccuracy >= t.pitch &&
      score.bestRhythmAccuracy >= t.rhythm
    ) {
      return n
    }
  }
  return 0
}

export interface AttemptResult {
  pitchAccuracy: number
  rhythmAccuracy: number
  kalam: Kalam
  durationSec: number
  /** A full run with no note falling below the lesson's tolerance. */
  clean: boolean
  at: number
}

/**
 * Fold an attempt into a lesson's record.
 *
 * Bests only ever improve — a tired Tuesday should not erase what the voice
 * has already proved it can do. Review scheduling, by contrast, reads the
 * attempt just made, because that is what says whether the lesson is still
 * held.
 */
export function applyAttempt(prev: LessonScore, r: AttemptResult): LessonScore {
  const next: LessonScore = {
    ...prev,
    attempts: prev.attempts + 1,
    totalPracticeSec: prev.totalPracticeSec + r.durationSec,
    bestPitchAccuracy: Math.max(prev.bestPitchAccuracy, r.pitchAccuracy),
    bestRhythmAccuracy: Math.max(prev.bestRhythmAccuracy, r.rhythmAccuracy),
    cleanPasses: r.clean ? prev.cleanPasses + 1 : prev.cleanPasses,
    firstPracticedAt: prev.firstPracticedAt ?? r.at,
    lastPracticedAt: r.at,
    kalamsCompleted: r.clean
      ? [...new Set([...prev.kalamsCompleted, r.kalam])].sort() as Kalam[]
      : prev.kalamsCompleted,
  }

  next.stars = deriveStars(next)

  // A lesson enters the review rotation once it is genuinely held (2 stars).
  if (next.stars >= 2) {
    next.srsIndex = nextSrsIndex(prev, r)
    next.reviewDueAt = r.at + REVIEW_INTERVALS_DAYS[next.srsIndex] * 86_400_000
  }

  return next
}

/**
 * Move along the interval ladder. Holding up near your own best pushes the
 * lesson further out; slipping pulls it back so it returns sooner.
 */
function nextSrsIndex(prev: LessonScore, r: AttemptResult): number {
  if (prev.srsIndex < 0) return 0
  const heldUp = r.pitchAccuracy >= prev.bestPitchAccuracy - 5
  const moved = heldUp ? 1 : -1
  return Math.max(0, Math.min(REVIEW_INTERVALS_DAYS.length - 1, prev.srsIndex + moved))
}

export interface DueReview {
  lessonId: string
  dueAt: number
  overdueDays: number
}

/** Lessons wanting revision, most overdue first, capped so a day stays doable. */
export function dueReviews(
  scores: Record<string, LessonScore>,
  now: number = Date.now(),
  limit: number = MAX_DAILY_REVIEWS,
): DueReview[] {
  return Object.entries(scores)
    .filter(([, s]) => s.reviewDueAt !== null && s.reviewDueAt <= now)
    .map(([lessonId, s]) => ({
      lessonId,
      dueAt: s.reviewDueAt!,
      overdueDays: Math.floor((now - s.reviewDueAt!) / 86_400_000),
    }))
    .sort((a, b) => a.dueAt - b.dueAt)
    .slice(0, limit)
}

/** Share of a level's lessons held at two stars or better. */
export function levelCompletion(
  lessonIds: readonly string[],
  scores: Record<string, LessonScore>,
): number {
  if (lessonIds.length === 0) return 1
  const held = lessonIds.filter((id) => (scores[id]?.stars ?? 0) >= 2).length
  return held / lessonIds.length
}

export const UNLOCK_THRESHOLD = 0.8

/**
 * The next level opens at 80% rather than 100% so one stubborn exercise cannot
 * dam the whole curriculum — the straggler comes back through review anyway.
 */
export function isLevelUnlocked(
  level: number,
  lessonsByLevel: Record<number, readonly string[]>,
  scores: Record<string, LessonScore>,
): boolean {
  if (level <= 0) return true
  for (let l = 0; l < level; l++) {
    if (levelCompletion(lessonsByLevel[l] ?? [], scores) < UNLOCK_THRESHOLD) return false
  }
  return true
}

export function highestUnlockedLevel(
  lessonsByLevel: Record<number, readonly string[]>,
  scores: Record<string, LessonScore>,
): number {
  const levels = Object.keys(lessonsByLevel)
    .map(Number)
    .sort((a, b) => a - b)
  let highest = 0
  for (const l of levels) {
    if (isLevelUnlocked(l, lessonsByLevel, scores)) highest = l
  }
  return highest
}
