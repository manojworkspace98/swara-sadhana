import Dexie, { type EntityTable } from 'dexie'
import { DEFAULT_REMINDERS, EMPTY_REMINDER_STATE } from './reminders'
import type {
  AppSettings,
  Profile,
  ProgressStore,
  Recording,
  Session,
  VoiceDaily,
} from './types'

export const SCHEMA_VERSION = 1

/**
 * Everything is keyed by profile so two singers can share a device without
 * seeing each other's streaks. `settings` is the one exception — volume and
 * latency belong to the device, not the person.
 */
class SadhanaDB extends Dexie {
  profiles!: EntityTable<Profile, 'id'>
  progress!: EntityTable<ProgressStore, 'profileId'>
  sessions!: EntityTable<Session, 'id'>
  recordings!: EntityTable<Recording, 'id'>
  voiceDaily!: EntityTable<VoiceDaily, 'key'>
  settings!: EntityTable<{ key: string; value: unknown }, 'key'>

  constructor() {
    super('swara-sadhana')
    this.version(1).stores({
      profiles: 'id, lastUsedAt',
      progress: 'profileId',
      sessions: 'id, profileId, startedAt, [profileId+startedAt], lessonId',
      recordings:
        'id, profileId, createdAt, lessonId, lastPlayedAt, pinned, [profileId+createdAt]',
      voiceDaily: 'key, profileId, day, [profileId+day]',
      settings: 'key',
    })
  }
}

export const db = new SadhanaDB()

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  recordingCapMB: 500,
  scoringPreset: 'beginner',
  latencyOffsetMs: 0,
  metronomeVolume: 0.5,
  droneVolume: 0.45,
  referenceVolume: 0.6,
  invocationShownOn: null,
  deviArtwork: 'shyamala',
  reminders: DEFAULT_REMINDERS,
  reminderState: EMPTY_REMINDER_STATE,
}

export async function getSettings(): Promise<AppSettings> {
  const rows = await db.settings.toArray()
  const stored = Object.fromEntries(rows.map((r) => [r.key, r.value]))
  return { ...DEFAULT_SETTINGS, ...stored } as AppSettings
}

export async function setSetting<K extends keyof AppSettings>(
  key: K,
  value: AppSettings[K],
): Promise<void> {
  await db.settings.put({ key, value })
}

/**
 * Ask the browser to stop treating our data as disposable cache. Without this,
 * a few hundred megabytes of practice recordings can be evicted silently under
 * storage pressure — which for this app means losing months of takes.
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (!navigator.storage?.persist) return false
  if (await navigator.storage.persisted?.()) return true
  try {
    return await navigator.storage.persist()
  } catch {
    return false
  }
}

export async function storageEstimate(): Promise<{ usage: number; quota: number } | null> {
  if (!navigator.storage?.estimate) return null
  const e = await navigator.storage.estimate()
  return { usage: e.usage ?? 0, quota: e.quota ?? 0 }
}
