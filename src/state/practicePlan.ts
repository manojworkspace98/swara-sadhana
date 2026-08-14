import { dueReviews } from './mastery'
import type { LessonScore, PracticePlanItem } from './types'

export interface PlanInput {
  minutes: number
  scores: Record<string, LessonScore>
  /** Curriculum order, already filtered to what the learner has unlocked. */
  availableLessonIds: readonly string[]
  /** A short, always-safe warm-up. */
  warmupLessonId: string | null
  now?: number
}

/**
 * Compose today's session.
 *
 * The shape follows how a class actually runs: open the voice, revisit
 * something older, then spend the bulk of the time on what is currently being
 * learned. Revision is capped rather than exhaustive — a plan that cannot be
 * finished is a plan that gets abandoned.
 */
export function buildPlan(input: PlanInput): PracticePlanItem[] {
  const { minutes, scores, availableLessonIds, warmupLessonId, now = Date.now() } = input
  const plan: PracticePlanItem[] = []

  const warmupMin = Math.max(3, Math.round(minutes * 0.15))
  if (warmupLessonId) {
    plan.push({
      kind: 'warmup',
      lessonId: warmupLessonId,
      targetMin: warmupMin,
      reason: 'Open the voice against the drone before anything else.',
    })
  }

  const due = dueReviews(scores, now, 1)[0]
  const reviewMin = due ? Math.max(3, Math.round(minutes * 0.2)) : 0
  if (due) {
    plan.push({
      kind: 'review',
      lessonId: due.lessonId,
      targetMin: reviewMin,
      reason:
        due.overdueDays > 0
          ? `Due for revision — last sung ${due.overdueDays} day${due.overdueDays === 1 ? '' : 's'} ago.`
          : 'Due for revision today.',
    })
  }

  const current = nextLessonToLearn(availableLessonIds, scores)
  const stretchMin = minutes >= 30 ? Math.round(minutes * 0.1) : 0
  const currentMin = Math.max(
    5,
    minutes - warmupMin - reviewMin - stretchMin,
  )

  if (current) {
    plan.push({
      kind: 'lesson',
      lessonId: current,
      targetMin: currentMin,
      reason: scores[current]
        ? 'Carry on where you left off.'
        : 'The next lesson in the ladder.',
    })
  }

  if (stretchMin > 0) {
    plan.push({
      kind: 'stretch',
      lessonId: null,
      targetMin: stretchMin,
      reason: 'Free singing over the drone. No scoring, no goal.',
    })
  }

  return plan
}

/**
 * The lesson to work on: the first one in curriculum order not yet held at two
 * stars. Working forward from the earliest weak link matches how the ladder is
 * meant to be climbed.
 */
export function nextLessonToLearn(
  availableLessonIds: readonly string[],
  scores: Record<string, LessonScore>,
): string | null {
  for (const id of availableLessonIds) {
    if ((scores[id]?.stars ?? 0) < 2) return id
  }
  return availableLessonIds.at(-1) ?? null
}

export function planTotalMinutes(plan: PracticePlanItem[]): number {
  return plan.reduce((sum, item) => sum + item.targetMin, 0)
}
