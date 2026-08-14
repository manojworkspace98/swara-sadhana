import { describe, expect, it } from 'vitest'
import { currentStreak, recordQualifyingDay, refillFreezes, streakAtRisk } from './streaks'
import type { StreakState } from './types'

function fresh(over: Partial<StreakState> = {}): StreakState {
  return {
    current: 0,
    longest: 0,
    lastQualifyingDay: null,
    freezesRemaining: 1,
    freezeUsedOn: [],
    freezeRefilledWeek: null,
    ...over,
  }
}

// 2026-08-10 is a Monday; 14th is Friday.
const MON = '2026-08-10'
const TUE = '2026-08-11'
const WED = '2026-08-12'
const THU = '2026-08-13'
const FRI = '2026-08-14'

describe('recordQualifyingDay', () => {
  it('starts a streak on the first practice', () => {
    const { streak, event } = recordQualifyingDay(fresh(), MON)
    expect(event).toBe('started')
    expect(streak.current).toBe(1)
    expect(streak.longest).toBe(1)
  })

  it('extends across consecutive days', () => {
    let s = recordQualifyingDay(fresh(), MON).streak
    s = recordQualifyingDay(s, TUE).streak
    const last = recordQualifyingDay(s, WED)
    expect(last.event).toBe('extended')
    expect(last.streak.current).toBe(3)
    expect(last.streak.longest).toBe(3)
  })

  it('does not double-count a second session the same day', () => {
    const s = recordQualifyingDay(fresh(), MON).streak
    const again = recordQualifyingDay(s, MON)
    expect(again.event).toBe('already-counted')
    expect(again.streak.current).toBe(1)
  })

  it('spends a freeze to survive one missed day', () => {
    let s = recordQualifyingDay(fresh(), MON).streak
    s = recordQualifyingDay(s, TUE).streak
    // Wednesday is missed; Thursday's practice should rescue the streak.
    const out = recordQualifyingDay(s, THU)
    expect(out.event).toBe('frozen')
    expect(out.streak.current).toBe(3)
    expect(out.streak.freezesRemaining).toBe(0)
    expect(out.streak.freezeUsedOn).toContain(WED)
  })

  it('breaks when two days are missed, freeze or not', () => {
    let s = recordQualifyingDay(fresh(), MON).streak
    s = recordQualifyingDay(s, TUE).streak
    const out = recordQualifyingDay(s, FRI) // Wed and Thu both missed
    expect(out.event).toBe('broken')
    expect(out.streak.current).toBe(1)
  })

  it('breaks on a second miss in the same week once the freeze is spent', () => {
    let s = recordQualifyingDay(fresh(), MON).streak
    s = recordQualifyingDay(s, WED).streak // freeze spent on Tuesday
    expect(s.freezesRemaining).toBe(0)
    const out = recordQualifyingDay(s, FRI) // Thursday missed, nothing left
    expect(out.event).toBe('broken')
  })

  it('keeps the longest streak after a break', () => {
    let s = recordQualifyingDay(fresh(), MON).streak
    s = recordQualifyingDay(s, TUE).streak
    s = recordQualifyingDay(s, WED).streak
    const broken = recordQualifyingDay(s, '2026-08-20')
    expect(broken.streak.current).toBe(1)
    expect(broken.streak.longest).toBe(3)
  })
})

describe('refillFreezes', () => {
  it('grants one freeze per week', () => {
    const spent = fresh({ freezesRemaining: 0, freezeRefilledWeek: '2026-08-03' })
    expect(refillFreezes(spent, MON).freezesRemaining).toBe(1)
  })

  it('does not top up twice in the same week', () => {
    const s = refillFreezes(fresh({ freezesRemaining: 0 }), MON)
    const spent = { ...s, freezesRemaining: 0 }
    expect(refillFreezes(spent, FRI).freezesRemaining).toBe(0)
  })

  it('refills again the following Monday', () => {
    const s = refillFreezes(fresh({ freezesRemaining: 0 }), MON)
    const spent = { ...s, freezesRemaining: 0 }
    expect(refillFreezes(spent, '2026-08-17').freezesRemaining).toBe(1)
  })
})

describe('currentStreak', () => {
  const at = (day: string) => new Date(`${day}T12:00:00`).getTime()

  it('counts nothing before any practice', () => {
    expect(currentStreak(fresh())).toBe(0)
  })

  it('holds through today even before today has been practised', () => {
    const s = fresh({ current: 5, lastQualifyingDay: THU })
    expect(currentStreak(s, at(FRI))).toBe(5)
  })

  it('still holds one further day while a freeze is in hand', () => {
    const s = fresh({ current: 5, lastQualifyingDay: WED, freezesRemaining: 1 })
    expect(currentStreak(s, at(FRI))).toBe(5)
  })

  it('reads zero once the gap outruns the freeze', () => {
    const s = fresh({ current: 5, lastQualifyingDay: WED, freezesRemaining: 0 })
    expect(currentStreak(s, at(FRI))).toBe(0)
  })
})

describe('streakAtRisk', () => {
  const at = (day: string) => new Date(`${day}T12:00:00`).getTime()

  it('is calm on a day already practised', () => {
    const s = fresh({ current: 3, lastQualifyingDay: FRI })
    expect(streakAtRisk(s, at(FRI))).toBe(false)
  })

  it('warns once a day has gone by', () => {
    const s = fresh({ current: 3, lastQualifyingDay: THU })
    expect(streakAtRisk(s, at(FRI))).toBe(true)
  })

  it('says nothing when there is no streak to lose', () => {
    expect(streakAtRisk(fresh(), at(FRI))).toBe(false)
  })
})
