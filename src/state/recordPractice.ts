import { db } from './db'
import { dayKey } from './day'
import { applyAttempt, emptyScore, type AttemptResult } from './mastery'
import { recordVoiceObservation, saveSession, type SessionInput } from './sessions'
import { recordQualifyingDay } from './streaks'
import { evaluateAchievements, type AchievementDef } from './achievements'
import { getProgress, saveProgress } from './profiles'
import type { ProgressStore, Session } from './types'

export interface PracticeOutcome {
  session: Session
  progress: ProgressStore
  /** True when this session is what carried the day over the goal. */
  goalMetNow: boolean
  streakEvent: ReturnType<typeof recordQualifyingDay>['event'] | null
  newAchievements: AchievementDef[]
}

export interface PracticeRecord {
  profileId: string
  dailyGoalMin: number
  session: Omit<SessionInput, 'profileId'>
  /** Present when the session was a scored lesson attempt. */
  attempt?: Omit<AttemptResult, 'at'> & { lessonId: string }
  voice?: {
    steadiness: number | null
    rangeLowMidi: number | null
    rangeHighMidi: number | null
  }
  lessonKinds?: Record<string, string>
}

/**
 * The single place a finished practice turns into everything the app tracks.
 *
 * Session row, daily voice rollup, lesson score, streak, achievements — all of
 * it moves together or not at all, so a crash mid-save cannot leave a streak
 * that no session supports.
 */
export async function recordPractice(rec: PracticeRecord): Promise<PracticeOutcome> {
  const at = rec.session.endedAt
  const day = dayKey(at)

  const minutesBefore =
    ((await db.voiceDaily.get(`${rec.profileId}|${day}`))?.practiceSec ?? 0) / 60

  const session = await saveSession({ profileId: rec.profileId, ...rec.session })

  await recordVoiceObservation(rec.profileId, at, {
    steadiness: rec.voice?.steadiness ?? null,
    rangeLowMidi: rec.voice?.rangeLowMidi ?? null,
    rangeHighMidi: rec.voice?.rangeHighMidi ?? null,
    pitchAccuracy: rec.session.pitchAccuracy,
    practiceSec: rec.session.durationSec,
  })

  let progress = await getProgress(rec.profileId)

  if (rec.attempt) {
    const { lessonId, ...attempt } = rec.attempt
    const prev = progress.lessonScores[lessonId] ?? emptyScore()
    progress = {
      ...progress,
      lessonScores: {
        ...progress.lessonScores,
        [lessonId]: applyAttempt(prev, { ...attempt, at }),
      },
    }
  }

  progress = {
    ...progress,
    totalPracticeSec: progress.totalPracticeSec + rec.session.durationSec,
    rangeLowMidi: minOrNull(progress.rangeLowMidi, rec.voice?.rangeLowMidi),
    rangeHighMidi: maxOrNull(progress.rangeHighMidi, rec.voice?.rangeHighMidi),
  }

  // The streak turns over only on the session that crosses the goal, so a
  // second sitting on the same day cannot count twice.
  const minutesAfter = minutesBefore + rec.session.durationSec / 60
  const goalMetNow = minutesBefore < rec.dailyGoalMin && minutesAfter >= rec.dailyGoalMin
  let streakEvent: PracticeOutcome['streakEvent'] = null
  if (minutesAfter >= rec.dailyGoalMin) {
    const out = recordQualifyingDay(progress.streak, day)
    progress = { ...progress, streak: out.streak }
    streakEvent = out.event
  }

  const steadinessBest = await bestSteadiness(rec.profileId)
  const pinned = await db.recordings
    .where('profileId')
    .equals(rec.profileId)
    .filter((r) => r.pinned)
    .count()

  const evaluated = evaluateAchievements(
    {
      progress,
      totalPracticeSec: progress.totalPracticeSec,
      streakCurrent: progress.streak.current,
      sessionHour: new Date(at).getHours(),
      lessonKinds: rec.lessonKinds ?? {},
      recordingsPinned: pinned,
      steadinessBest,
    },
    at,
  )
  progress = { ...progress, achievements: evaluated.achievements }

  await saveProgress(progress)

  return {
    session,
    progress,
    goalMetNow,
    streakEvent,
    newAchievements: evaluated.unlocked,
  }
}

async function bestSteadiness(profileId: string): Promise<number | null> {
  const rows = await db.voiceDaily.where('profileId').equals(profileId).toArray()
  const values = rows.map((r) => r.steadiness).filter((v): v is number => v != null)
  return values.length ? Math.max(...values) : null
}

function minOrNull(a: number | null, b: number | null | undefined): number | null {
  if (a == null) return b ?? null
  if (b == null) return a
  return Math.min(a, b)
}

function maxOrNull(a: number | null, b: number | null | undefined): number | null {
  if (a == null) return b ?? null
  if (b == null) return a
  return Math.max(a, b)
}
