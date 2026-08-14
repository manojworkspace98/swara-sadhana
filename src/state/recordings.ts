import { db } from './db'
import type { Take } from '../audio/recorder'
import type { Recording } from './types'

export interface SaveTakeInput {
  profileId: string
  lessonId: string | null
  title: string
  saHz: number
  pitchAccuracy: number | null
  rhythmAccuracy: number | null
  take: Take
}

export async function saveTake(input: SaveTakeInput): Promise<Recording> {
  const now = Date.now()
  const rec: Recording = {
    id: crypto.randomUUID(),
    profileId: input.profileId,
    createdAt: now,
    lessonId: input.lessonId,
    title: input.title,
    blob: input.take.blob,
    durationSec: input.take.durationSec,
    sizeBytes: input.take.blob.size,
    pitchTrace: input.take.pitchTrace,
    hopSec: input.take.hopSec,
    saHz: input.saHz,
    pitchAccuracy: input.pitchAccuracy,
    rhythmAccuracy: input.rhythmAccuracy,
    pinned: false,
    lastPlayedAt: now,
  }
  await db.recordings.add(rec)
  return rec
}

export async function listTakes(profileId: string): Promise<Recording[]> {
  const rows = await db.recordings.where('profileId').equals(profileId).toArray()
  return rows.sort((a, b) => b.createdAt - a.createdAt)
}

export async function takesForLesson(
  profileId: string,
  lessonId: string,
): Promise<Recording[]> {
  const rows = await listTakes(profileId)
  return rows.filter((r) => r.lessonId === lessonId)
}

export async function setPinned(id: string, pinned: boolean): Promise<void> {
  await db.recordings.update(id, { pinned })
}

export async function markPlayed(id: string): Promise<void> {
  await db.recordings.update(id, { lastPlayedAt: Date.now() })
}

export async function deleteTake(id: string): Promise<void> {
  await db.recordings.delete(id)
}

export async function usedBytes(profileId: string): Promise<number> {
  const rows = await db.recordings.where('profileId').equals(profileId).toArray()
  return rows.reduce((sum, r) => sum + r.sizeBytes, 0)
}

export interface EvictionCandidate {
  id: string
  title: string
  createdAt: number
  sizeBytes: number
}

/**
 * What to delete when the library outgrows its cap, oldest-played first.
 *
 * Nothing here deletes anything. Recordings are the one thing in this app the
 * learner cannot regenerate, so the decision belongs to them — this only
 * proposes a list, and pinned takes are never on it.
 */
export async function proposeEvictions(
  profileId: string,
  capBytes: number,
): Promise<{ over: number; candidates: EvictionCandidate[] }> {
  const rows = await db.recordings.where('profileId').equals(profileId).toArray()
  const total = rows.reduce((s, r) => s + r.sizeBytes, 0)
  const over = total - capBytes
  if (over <= 0) return { over: 0, candidates: [] }

  const candidates: EvictionCandidate[] = []
  let freed = 0
  for (const r of rows
    .filter((r) => !r.pinned)
    .sort((a, b) => a.lastPlayedAt - b.lastPlayedAt)) {
    if (freed >= over) break
    candidates.push({
      id: r.id,
      title: r.title,
      createdAt: r.createdAt,
      sizeBytes: r.sizeBytes,
    })
    freed += r.sizeBytes
  }
  return { over, candidates }
}
