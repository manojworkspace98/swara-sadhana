import type { Sthayi } from '../engine/types'
import type { DailyGoal } from './goals'
import type { ReminderSettings, ReminderState } from './reminders'

export type LessonId = string
/** Kalam — the three traditional speeds a varisai is sung at. */
export type Kalam = 1 | 2 | 3
export type Stars = 0 | 1 | 2 | 3

/**
 * A singer using this device. There is no password and no account: a profile
 * is a name, a face, and the settings that make the app fit one voice. Anyone
 * holding the device can pick any profile, which is the intent — this is a
 * practice book left open on the music stand, not a bank.
 */
export interface Profile {
  id: string
  name: string
  /** Emoji or single glyph shown on the picker card. */
  avatar: string
  /** Accent colour token so profiles are told apart at a glance. */
  hue: string
  /** Sruti id, e.g. 'C#3'. */
  shruti: string
  voiceType: 'male' | 'female' | 'unset'
  /** Kept for profiles made before goals became structured. */
  dailyGoalMin: number
  goal?: DailyGoal
  createdAt: number
  lastUsedAt: number
}

export interface Session {
  id: string
  profileId: string
  startedAt: number
  endedAt: number
  lessonId: LessonId | null
  activity: 'lesson' | 'review' | 'free' | 'warmup' | 'song'
  /** Seconds of actual practice; the timer pauses when the room goes quiet. */
  durationSec: number
  pitchAccuracy: number | null
  rhythmAccuracy: number | null
  kalam: Kalam | null
}

export interface LessonScore {
  bestPitchAccuracy: number
  bestRhythmAccuracy: number
  kalamsCompleted: Kalam[]
  stars: Stars
  attempts: number
  cleanPasses: number
  totalPracticeSec: number
  firstPracticedAt: number | null
  lastPracticedAt: number | null
  /** Index into REVIEW_INTERVALS_DAYS; -1 until the lesson enters review. */
  srsIndex: number
  reviewDueAt: number | null
}

export interface StreakState {
  current: number
  longest: number
  /** 'YYYY-MM-DD' of the last day that met the goal. */
  lastQualifyingDay: string | null
  /** Refills to 1 each Monday; covers a single missed day. */
  freezesRemaining: number
  freezeUsedOn: string[]
  /** Monday whose refill has already been granted, so it happens once. */
  freezeRefilledWeek: string | null
}

export interface Achievement {
  id: string
  unlockedAt: number | null
  /** 0–1 toward unlocking, so locked badges can show a progress ring. */
  progress: number
}

export interface VoiceDaily {
  /** Composite key `${profileId}|${day}`. */
  key: string
  profileId: string
  day: string
  steadiness: number | null
  rangeLowMidi: number | null
  rangeHighMidi: number | null
  avgPitchAccuracy: number | null
  practiceSec: number
}

export interface Recording {
  id: string
  profileId: string
  createdAt: number
  lessonId: LessonId | null
  title: string
  blob: Blob
  durationSec: number
  sizeBytes: number
  /** Cents above Sa per hop, NaN where unvoiced. */
  pitchTrace: Float32Array | null
  hopSec: number
  saHz: number
  pitchAccuracy: number | null
  rhythmAccuracy: number | null
  pinned: boolean
  lastPlayedAt: number
}

/** One row per profile: everything small enough to load at once. */
export interface ProgressStore {
  profileId: string
  schemaVersion: number
  streak: StreakState
  unlockedLevel: number
  lessonScores: Record<LessonId, LessonScore>
  achievements: Record<string, Achievement>
  totalPracticeSec: number
  /** Widest range ever measured, so the badge does not flicker day to day. */
  rangeLowMidi: number | null
  rangeHighMidi: number | null
}

export interface AppSettings {
  theme: 'dark'
  recordingCapMB: number
  scoringPreset: 'beginner' | 'standard' | 'strict'
  /** Measured round-trip audio latency, subtracted before rhythm scoring. */
  latencyOffsetMs: number
  metronomeVolume: number
  droneVolume: number
  referenceVolume: number
  /** Show the invocation screen once per day rather than on every visit. */
  invocationShownOn: string | null
  /** Which devotional image the invocation and the page watermark use. */
  deviArtwork: 'shyamala' | 'saraswati'
  reminders: ReminderSettings
  /** Which reminders have already been raised, so each fires only once a day. */
  reminderState: ReminderState
}

export interface PracticePlanItem {
  kind: 'warmup' | 'lesson' | 'review' | 'stretch'
  lessonId: LessonId | null
  targetMin: number
  reason: string
}

export interface ExpectedNote {
  semitone: number
  sthayi: Sthayi
  /** Cents above Sa — semitone + 12·sthayi, precomputed for scoring. */
  targetCents: number
  startAkshara: number
  durAksharas: number
  /** Seconds, on the same clock as PitchFrame.t. */
  t0: number
  t1: number
  syllable?: string
  janta?: boolean
  /** True for a rest: nothing to sing, nothing to score. */
  rest?: boolean
}
