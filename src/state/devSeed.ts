import { db } from './db'
import { addDays, dayKey, parseDay } from './day'
import type { Session, VoiceDaily } from './types'

/**
 * Fills six months of plausible practice for one profile so the charts can be
 * looked at during development. Development only — it is never bundled into a
 * production build, and it would be dishonest to let it near real progress.
 */
export async function seedDemoProgress(profileId: string): Promise<void> {
  if (!import.meta.env.DEV) return

  const today = dayKey(Date.now())
  const rows: VoiceDaily[] = []
  const sessions: Session[] = []

  // A beginner's arc: patchy at first, steadier later; accuracy climbing with
  // a plateau in the middle; range opening a few semitones over the months.
  for (let i = 181; i >= 0; i--) {
    const day = addDays(today, -i)
    const progressT = (181 - i) / 181

    // Thursdays go badly, as they do for most people with a weeknight
    // commitment, so the weekday views have a real pattern to find.
    const weekday = parseDay(day).getDay()
    const weekdayPenalty = weekday === 4 ? 0.45 : weekday === 0 ? 0.1 : 0

    const consistency = 0.45 + 0.45 * progressT - weekdayPenalty
    if (Math.random() > consistency) continue

    const minutes = 12 + Math.random() * 30 + progressT * 12
    const plateau = progressT > 0.4 && progressT < 0.6 ? -4 : 0
    const accuracy = Math.min(
      98,
      52 + progressT * 34 + plateau + (Math.random() - 0.5) * 9,
    )
    const steadiness = Math.min(96, 40 + progressT * 42 + (Math.random() - 0.5) * 12)

    rows.push({
      key: `${profileId}|${day}`,
      profileId,
      day,
      practiceSec: minutes * 60,
      avgPitchAccuracy: accuracy,
      steadiness,
      rangeLowMidi: Math.round(50 - progressT * 4 + (Math.random() - 0.5) * 1.5),
      rangeHighMidi: Math.round(64 + progressT * 7 + (Math.random() - 0.5) * 1.5),
    })

    // Most sittings are early, a few in the evening — enough of a habit for
    // the time-of-day view to show one without being unrealistically tidy.
    const startHour = Math.random() < 0.7 ? 6 + Math.floor(Math.random() * 3) : 19 + Math.floor(Math.random() * 3)
    const started = parseDay(day)
    started.setHours(startHour, Math.floor(Math.random() * 60), 0, 0)
    sessions.push({
      id: `demo-${profileId}-${day}`,
      profileId,
      startedAt: started.getTime(),
      endedAt: started.getTime() + minutes * 60_000,
      lessonId: `demo-lesson-${i % 14}`,
      activity: 'lesson',
      durationSec: minutes * 60,
      pitchAccuracy: accuracy,
      rhythmAccuracy: Math.min(97, accuracy - 3 + (Math.random() - 0.5) * 6),
      kalam: 1,
    })
  }

  await db.voiceDaily.bulkPut(rows)
  await db.sessions.bulkPut(sessions)
}

export async function clearDemoProgress(profileId: string): Promise<void> {
  await db.voiceDaily.where('profileId').equals(profileId).delete()
  await db.sessions.where('profileId').equals(profileId).delete()
}
