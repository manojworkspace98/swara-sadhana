import { describe, expect, it } from 'vitest'
import {
  DEFAULT_REMINDERS,
  EMPTY_REMINDER_STATE,
  dueReminder,
  markRaised,
  reminderHour,
  type ReminderInput,
} from './reminders'

function at(hour: number, day = '2026-08-10'): number {
  const [y, m, d] = day.split('-').map(Number)
  return new Date(y, m - 1, d, hour, 0, 0).getTime()
}

function sessionsAt(hours: number[]): { startedAt: number; durationSec: number }[] {
  return hours.map((h) => ({ startedAt: at(h), durationSec: 1800 }))
}

function input(overrides: Partial<ReminderInput> = {}): ReminderInput {
  return {
    settings: { ...DEFAULT_REMINDERS, enabled: true, hour: 7 },
    state: EMPTY_REMINDER_STATE,
    now: at(7),
    metToday: false,
    minutesToday: 0,
    sessions: [],
    ...overrides,
  }
}

describe('reminderHour', () => {
  it('uses the hour the singer chose', () => {
    expect(reminderHour({ ...DEFAULT_REMINDERS, hour: 6 }, [])).toBe(6)
  })

  it('follows the usual practice window when left on automatic', () => {
    const hour = reminderHour({ ...DEFAULT_REMINDERS, hour: null }, sessionsAt([6, 7, 7, 8, 7]))
    expect(hour).toBe(7)
  })

  it('stays silent until there is enough history to guess an hour', () => {
    expect(reminderHour({ ...DEFAULT_REMINDERS, hour: null }, sessionsAt([7, 7]))).toBeNull()
  })
})

describe('dueReminder', () => {
  it('says nothing when reminders are switched off', () => {
    expect(dueReminder(input({ settings: { ...DEFAULT_REMINDERS, enabled: false } }))).toBeNull()
  })

  it('says nothing once the day has been met', () => {
    expect(dueReminder(input({ metToday: true }))).toBeNull()
  })

  it('says nothing on a planned rest day', () => {
    expect(dueReminder(input({ restDay: true }))).toBeNull()
  })

  it('nudges at the practice hour', () => {
    const due = dueReminder(input({ now: at(7) }))
    expect(due?.kind).toBe('practice')
  })

  it('does not nudge before the practice hour', () => {
    expect(dueReminder(input({ now: at(5) }))).toBeNull()
  })

  // Opening the app at midnight should not produce a reminder for an hour
  // that passed long ago.
  it('lets the practice nudge go stale after a couple of hours', () => {
    expect(dueReminder(input({ now: at(11) }))).toBeNull()
  })

  it('only nudges once a day', () => {
    const first = dueReminder(input())!
    const state = markRaised(EMPTY_REMINDER_STATE, first.kind, at(7))
    expect(dueReminder(input({ state }))).toBeNull()
  })

  it('nudges again the next day', () => {
    const state = markRaised(EMPTY_REMINDER_STATE, 'practice', at(7, '2026-08-10'))
    const next = dueReminder(input({ state, now: at(7, '2026-08-11') }))
    expect(next?.kind).toBe('practice')
  })

  it('raises the evening guard when the day has not counted', () => {
    const due = dueReminder(input({ now: at(20) }))
    expect(due?.kind).toBe('streak-guard')
  })

  it('acknowledges work already done in the evening message', () => {
    const due = dueReminder(input({ now: at(21), minutesToday: 12 }))
    expect(due?.body).toMatch(/12 minutes so far/)
  })

  it('asks for ten minutes when nothing has been done', () => {
    const due = dueReminder(input({ now: at(21), minutesToday: 0 }))
    expect(due?.body).toMatch(/ten minutes/)
  })

  it('can have the evening guard switched off on its own', () => {
    const settings = { ...DEFAULT_REMINDERS, enabled: true, hour: 7, streakGuard: false }
    expect(dueReminder(input({ settings, now: at(20) }))).toBeNull()
  })

  it('prefers the evening guard over a stale practice nudge', () => {
    const due = dueReminder(input({ now: at(20), settings: { ...DEFAULT_REMINDERS, enabled: true, hour: 19 } }))
    expect(due?.kind).toBe('streak-guard')
  })
})

describe('markRaised', () => {
  it('records each kind separately, so one does not silence the other', () => {
    const afterPractice = markRaised(EMPTY_REMINDER_STATE, 'practice', at(7))
    expect(afterPractice.lastPracticeDay).toBe('2026-08-10')
    expect(afterPractice.lastGuardDay).toBeNull()

    const afterBoth = markRaised(afterPractice, 'streak-guard', at(20))
    expect(afterBoth.lastPracticeDay).toBe('2026-08-10')
    expect(afterBoth.lastGuardDay).toBe('2026-08-10')
  })
})
