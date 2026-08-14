import { db, SCHEMA_VERSION } from './db'
import type { Profile, ProgressStore } from './types'

const LAST_PROFILE_KEY = 'swara-sadhana:last-profile'

/** Accent colours a profile card can wear. Drawn from the app palette so a
 *  second singer never looks like a foreign element. */
export const PROFILE_HUES = [
  '#c89b4a',
  '#7ba05b',
  '#c7472f',
  '#5b8ba0',
  '#9a6ba0',
  '#e8b33d',
]

export const PROFILE_AVATARS = ['🪷', '🎵', '🕉️', '🪈', '🎶', '🌸', '🪔', '🦚']

function newId(): string {
  return crypto.randomUUID()
}

export function emptyProgress(profileId: string): ProgressStore {
  return {
    profileId,
    schemaVersion: SCHEMA_VERSION,
    streak: {
      current: 0,
      longest: 0,
      lastQualifyingDay: null,
      freezesRemaining: 1,
      freezeUsedOn: [],
      freezeRefilledWeek: null,
    },
    unlockedLevel: 0,
    lessonScores: {},
    achievements: {},
    totalPracticeSec: 0,
    rangeLowMidi: null,
    rangeHighMidi: null,
  }
}

export async function listProfiles(): Promise<Profile[]> {
  const all = await db.profiles.toArray()
  return all.sort((a, b) => b.lastUsedAt - a.lastUsedAt)
}

export async function createProfile(input: {
  name: string
  avatar: string
  hue: string
  shruti: string
  voiceType: Profile['voiceType']
  dailyGoalMin: number
}): Promise<Profile> {
  const now = Date.now()
  const profile: Profile = { id: newId(), createdAt: now, lastUsedAt: now, ...input }
  await db.transaction('rw', db.profiles, db.progress, async () => {
    await db.profiles.add(profile)
    await db.progress.add(emptyProgress(profile.id))
  })
  return profile
}

export async function updateProfile(id: string, patch: Partial<Profile>): Promise<void> {
  await db.profiles.update(id, patch)
}

/**
 * Remove a profile and everything it owns. Deleting a singer's history is not
 * something to do quietly, so callers must confirm first — this function only
 * carries it out.
 */
export async function deleteProfile(id: string): Promise<void> {
  await db.transaction(
    'rw',
    [db.profiles, db.progress, db.sessions, db.recordings, db.voiceDaily],
    async () => {
      await db.sessions.where('profileId').equals(id).delete()
      await db.recordings.where('profileId').equals(id).delete()
      await db.voiceDaily.where('profileId').equals(id).delete()
      await db.progress.delete(id)
      await db.profiles.delete(id)
    },
  )
  if (getLastProfileId() === id) clearLastProfile()
}

export async function touchProfile(id: string): Promise<void> {
  await db.profiles.update(id, { lastUsedAt: Date.now() })
  localStorage.setItem(LAST_PROFILE_KEY, id)
}

export function getLastProfileId(): string | null {
  return localStorage.getItem(LAST_PROFILE_KEY)
}

export function clearLastProfile(): void {
  localStorage.removeItem(LAST_PROFILE_KEY)
}

export async function getProgress(profileId: string): Promise<ProgressStore> {
  const existing = await db.progress.get(profileId)
  if (existing) return existing
  const fresh = emptyProgress(profileId)
  await db.progress.put(fresh)
  return fresh
}

export async function saveProgress(progress: ProgressStore): Promise<void> {
  await db.progress.put(progress)
}
