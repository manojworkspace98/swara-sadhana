import { db } from './db'
import { addDays, dayKey, weekStart } from './day'
import type { Session, VoiceDaily } from './types'

export interface SessionInput {
  profileId: string
  lessonId: string | null
  activity: Session['activity']
  startedAt: number
  endedAt: number
  durationSec: number
  pitchAccuracy: number | null
  rhythmAccuracy: number | null
  kalam: Session['kalam']
}

export async function saveSession(input: SessionInput): Promise<Session> {
  const session: Session = { id: crypto.randomUUID(), ...input }
  await db.sessions.add(session)
  return session
}

export interface VoiceObservation {
  steadiness: number | null
  rangeLowMidi: number | null
  rangeHighMidi: number | null
  pitchAccuracy: number | null
  practiceSec: number
}

/**
 * Fold one session's measurements into the day's row.
 *
 * Daily rows are kept as a rollup rather than recomputed from sessions so the
 * charts stay instant after a year of practice. Range ratchets outward within
 * a day: the widest thing the voice managed is the honest reading, since a
 * later tired attempt does not un-sing the earlier one.
 */
export async function recordVoiceObservation(
  profileId: string,
  at: number,
  obs: VoiceObservation,
): Promise<void> {
  const day = dayKey(at)
  const key = `${profileId}|${day}`
  const prev = await db.voiceDaily.get(key)

  const practiceSec = (prev?.practiceSec ?? 0) + obs.practiceSec
  const next: VoiceDaily = {
    key,
    profileId,
    day,
    practiceSec,
    steadiness: maxOrNull(prev?.steadiness, obs.steadiness),
    rangeLowMidi: minOrNull(prev?.rangeLowMidi, obs.rangeLowMidi),
    rangeHighMidi: maxOrNull(prev?.rangeHighMidi, obs.rangeHighMidi),
    avgPitchAccuracy: weightedMean(
      prev?.avgPitchAccuracy,
      prev?.practiceSec ?? 0,
      obs.pitchAccuracy,
      obs.practiceSec,
    ),
  }
  await db.voiceDaily.put(next)
}

function maxOrNull(a: number | null | undefined, b: number | null | undefined): number | null {
  if (a == null) return b ?? null
  if (b == null) return a
  return Math.max(a, b)
}

function minOrNull(a: number | null | undefined, b: number | null | undefined): number | null {
  if (a == null) return b ?? null
  if (b == null) return a
  return Math.min(a, b)
}

function weightedMean(
  prevVal: number | null | undefined,
  prevWeight: number,
  nextVal: number | null | undefined,
  nextWeight: number,
): number | null {
  if (nextVal == null) return prevVal ?? null
  if (prevVal == null || prevWeight === 0) return nextVal
  const total = prevWeight + nextWeight
  return (prevVal * prevWeight + nextVal * nextWeight) / total
}

export async function voiceDailyRange(
  profileId: string,
  fromDay: string,
  toDay: string,
): Promise<VoiceDaily[]> {
  const rows = await db.voiceDaily.where('profileId').equals(profileId).toArray()
  return rows
    .filter((r) => r.day >= fromDay && r.day <= toDay)
    .sort((a, b) => a.day.localeCompare(b.day))
}

/** Every day in the window, with gaps filled so charts show absence honestly. */
export function fillDays<T extends { day: string }>(
  rows: T[],
  fromDay: string,
  toDay: string,
): { day: string; row: T | undefined }[] {
  const byDay = new Map(rows.map((r) => [r.day, r]))
  const out: { day: string; row: T | undefined }[] = []
  for (let d = fromDay; d <= toDay; d = addDays(d, 1)) {
    out.push({ day: d, row: byDay.get(d) })
  }
  return out
}

export function groupByWeek(
  rows: { day: string; practiceSec: number }[],
): { label: string; minutes: number }[] {
  const weeks = new Map<string, number>()
  for (const r of rows) {
    const w = weekStart(r.day)
    weeks.set(w, (weeks.get(w) ?? 0) + r.practiceSec / 60)
  }
  return [...weeks.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([label, minutes]) => ({ label, minutes }))
}

export async function minutesToday(profileId: string, now = Date.now()): Promise<number> {
  const row = await db.voiceDaily.get(`${profileId}|${dayKey(now)}`)
  return (row?.practiceSec ?? 0) / 60
}

export async function totalPracticeSec(profileId: string): Promise<number> {
  const rows = await db.voiceDaily.where('profileId').equals(profileId).toArray()
  return rows.reduce((sum, r) => sum + r.practiceSec, 0)
}
