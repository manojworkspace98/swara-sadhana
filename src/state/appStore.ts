import { create } from 'zustand'
import { getSettings, requestPersistentStorage, setSetting } from './db'
import {
  getLastProfileId,
  getProgress,
  listProfiles,
  saveProgress,
  touchProfile,
} from './profiles'
import type { AppSettings, Profile, ProgressStore } from './types'
import { dayKey } from './day'

interface AppState {
  ready: boolean
  profiles: Profile[]
  activeProfile: Profile | null
  progress: ProgressStore | null
  settings: AppSettings | null
  /** Cleared once the learner has passed the invocation screen today. */
  invocationPending: boolean

  boot: () => Promise<void>
  refreshProfiles: () => Promise<void>
  selectProfile: (id: string) => Promise<void>
  signOut: () => void
  completeInvocation: () => Promise<void>
  patchSettings: (patch: Partial<AppSettings>) => Promise<void>
  setProgress: (next: ProgressStore) => Promise<void>
}

export const useApp = create<AppState>((set, get) => ({
  ready: false,
  profiles: [],
  activeProfile: null,
  progress: null,
  settings: null,
  invocationPending: true,

  async boot() {
    await requestPersistentStorage()
    const [profiles, settings] = await Promise.all([listProfiles(), getSettings()])
    const invocationPending = settings.invocationShownOn !== dayKey(Date.now())

    const lastId = getLastProfileId()
    const remembered = lastId ? profiles.find((p) => p.id === lastId) : undefined

    set({
      profiles,
      settings,
      invocationPending,
      activeProfile: remembered ?? null,
      progress: remembered ? await getProgress(remembered.id) : null,
      ready: true,
    })
  },

  async refreshProfiles() {
    set({ profiles: await listProfiles() })
  },

  async selectProfile(id) {
    const profile = get().profiles.find((p) => p.id === id)
    if (!profile) return
    await touchProfile(id)
    set({ activeProfile: profile, progress: await getProgress(id) })
  },

  signOut() {
    set({ activeProfile: null, progress: null })
  },

  async completeInvocation() {
    const today = dayKey(Date.now())
    await setSetting('invocationShownOn', today)
    set((s) => ({
      invocationPending: false,
      settings: s.settings ? { ...s.settings, invocationShownOn: today } : s.settings,
    }))
  },

  async patchSettings(patch) {
    const current = get().settings
    if (!current) return
    const next = { ...current, ...patch }
    set({ settings: next })
    await Promise.all(
      (Object.keys(patch) as (keyof AppSettings)[]).map((k) => setSetting(k, next[k])),
    )
  },

  async setProgress(next) {
    set({ progress: next })
    await saveProgress(next)
  },
}))
