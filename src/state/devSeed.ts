import { db } from './db'
import { addDays, dayKey } from './day'
import type { VoiceDaily } from './types'

/**
 * Fills six months of plausible practice for one profile so the charts can be
 * looked at during development. Development only — it is never bundled into a
 * production build, and it would be dishonest to let it near real progress.
 */
export async function seedDemoProgress(profileId: string): Promise<void> {
  if (!import.meta.env.DEV) return

  const today = dayKey(Date.now())
  const rows: VoiceDaily[] = []

  // A beginner's arc: patchy at first, steadier later; accuracy climbing with
  // a plateau in the middle; range opening a few semitones over the months.
  for (let i = 181; i >= 0; i--) {
    const day = addDays(today, -i)
    const progressT = (181 - i) / 181

    const consistency = 0.45 + 0.45 * progressT
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
  }

  await db.voiceDaily.bulkPut(rows)
}

export async function clearDemoProgress(profileId: string): Promise<void> {
  await db.voiceDaily.where('profileId').equals(profileId).delete()
}
