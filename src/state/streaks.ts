import { addDays, dayKey, daysBetween, weekStart } from './day'
import type { StreakState } from './types'

/**
 * Streaks, with one act of mercy.
 *
 * A streak that snaps on the first missed day punishes exactly the person it
 * is meant to encourage — someone who practised forty days running and then
 * had a bad Tuesday. One freeze per week absorbs a single miss. It refills on
 * Monday, so it cannot be hoarded into a licence to practise fortnightly.
 */
export const FREEZES_PER_WEEK = 1

export interface StreakUpdate {
  streak: StreakState
  /** What happened, for the UI to announce honestly. */
  event: 'extended' | 'already-counted' | 'frozen' | 'broken' | 'started'
}

/**
 * Fold a qualifying day into the streak. Call this only when the day's
 * practice has actually met the goal.
 */
export function recordQualifyingDay(state: StreakState, day: string): StreakUpdate {
  const refilled = refillFreezes(state, day)

  if (refilled.lastQualifyingDay === null) {
    return {
      streak: { ...refilled, current: 1, longest: Math.max(1, refilled.longest), lastQualifyingDay: day },
      event: 'started',
    }
  }

  const gap = daysBetween(refilled.lastQualifyingDay, day)

  if (gap <= 0) return { streak: refilled, event: 'already-counted' }

  if (gap === 1) {
    const current = refilled.current + 1
    return {
      streak: {
        ...refilled,
        current,
        longest: Math.max(current, refilled.longest),
        lastQualifyingDay: day,
      },
      event: 'extended',
    }
  }

  // Exactly one day was missed and a freeze is available: spend it.
  if (gap === 2 && refilled.freezesRemaining > 0) {
    const missed = addDays(day, -1)
    const current = refilled.current + 1
    return {
      streak: {
        ...refilled,
        current,
        longest: Math.max(current, refilled.longest),
        lastQualifyingDay: day,
        freezesRemaining: refilled.freezesRemaining - 1,
        freezeUsedOn: [...refilled.freezeUsedOn, missed],
      },
      event: 'frozen',
    }
  }

  return {
    streak: { ...refilled, current: 1, lastQualifyingDay: day },
    event: 'broken',
  }
}

/** Grant the weekly freeze, at most once per week. */
export function refillFreezes(state: StreakState, day: string): StreakState {
  const week = weekStart(day)
  if (state.freezeRefilledWeek === week) return state
  return {
    ...state,
    freezesRemaining: FREEZES_PER_WEEK,
    freezeRefilledWeek: week,
  }
}

/**
 * What the streak is worth *right now*, without recording anything.
 *
 * A streak stays alive through today even before today's practice: the day is
 * not over. It only dies once a whole day has passed unpractised and unfrozen.
 */
export function currentStreak(state: StreakState, now: number = Date.now()): number {
  if (!state.lastQualifyingDay) return 0
  const today = dayKey(now)
  const gap = daysBetween(state.lastQualifyingDay, today)
  if (gap <= 1) return state.current
  if (gap === 2 && state.freezesRemaining > 0) return state.current
  return 0
}

/** True when missing today would end the streak — worth saying out loud. */
export function streakAtRisk(state: StreakState, now: number = Date.now()): boolean {
  if (!state.lastQualifyingDay || state.current === 0) return false
  return daysBetween(state.lastQualifyingDay, dayKey(now)) >= 1
}
