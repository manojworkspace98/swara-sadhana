import { dayKey } from './day'
import { anchorHour, type SessionTime } from './rhythm'

/**
 * Reminders, and an honest account of what they can do.
 *
 * This app has no server, so it cannot push. A notification can only be raised
 * by code that is running, which means reminders arrive when the app is open
 * in a tab or sitting in the background — not when the browser is shut. That
 * is a real limitation and the settings screen says so plainly rather than
 * letting a singer rely on something that will quietly not happen.
 *
 * What it still buys: the app is usually open on the machine practice happens
 * on, and the two reminders that matter are the one at the usual hour and the
 * one late in the evening when the day has not counted yet.
 */

export type ReminderKind = 'practice' | 'streak-guard'

export interface ReminderSettings {
  enabled: boolean
  /** null means follow the hour practice actually tends to start. */
  hour: number | null
  /** The evening nudge when nothing has counted yet. */
  streakGuard: boolean
  streakGuardHour: number
}

export const DEFAULT_REMINDERS: ReminderSettings = {
  enabled: false,
  hour: null,
  streakGuard: true,
  streakGuardHour: 20,
}

/** Which reminders have already been raised, so each fires once a day. */
export interface ReminderState {
  lastPracticeDay: string | null
  lastGuardDay: string | null
}

export const EMPTY_REMINDER_STATE: ReminderState = { lastPracticeDay: null, lastGuardDay: null }

export interface DueReminder {
  kind: ReminderKind
  title: string
  body: string
}

export interface ReminderInput {
  settings: ReminderSettings
  state: ReminderState
  now: number
  /** Whether today has already met the goal. */
  metToday: boolean
  /** Minutes practised today, for a warmer message when some work is done. */
  minutesToday: number
  /** Sessions so far, used when the hour is left on automatic. */
  sessions: readonly SessionTime[]
  /** True on a planned rest day, when no reminder should be raised at all. */
  restDay?: boolean
}

/** The hour the practice reminder should land on. */
export function reminderHour(
  settings: ReminderSettings,
  sessions: readonly SessionTime[],
): number | null {
  if (settings.hour != null) return settings.hour
  const anchor = anchorHour(sessions)
  if (!anchor || sessions.length < 5) return null
  // The middle of the usual three-hour window, so the nudge arrives while the
  // window is still open rather than as it closes.
  return (anchor.start + 1) % 24
}

/**
 * Whether a reminder is due right now.
 *
 * Pure, so the rules about rest days, days already met, and not nagging twice
 * are settled by tests rather than by watching the clock.
 */
export function dueReminder(input: ReminderInput): DueReminder | null {
  const { settings, state, now, metToday, minutesToday, sessions, restDay } = input
  if (!settings.enabled) return null
  if (restDay) return null
  if (metToday) return null

  const today = dayKey(now)
  const hour = new Date(now).getHours()

  // The evening guard takes precedence: it is the more urgent of the two, and
  // by that hour the gentle reminder has already had its chance.
  if (settings.streakGuard && hour >= settings.streakGuardHour && state.lastGuardDay !== today) {
    return {
      kind: 'streak-guard',
      title: 'The day has not counted yet',
      body:
        minutesToday > 0
          ? `${Math.round(minutesToday)} minutes so far. A short sitting now keeps the streak.`
          : 'Even ten minutes on the drone keeps the streak alive.',
    }
  }

  const practiceHour = reminderHour(settings, sessions)
  if (practiceHour != null && hour >= practiceHour && state.lastPracticeDay !== today) {
    // Only within a couple of hours of the intended time — a reminder that
    // fires because the app happened to be opened at midnight is noise.
    if (hour - practiceHour <= 2) {
      return {
        kind: 'practice',
        title: 'Time to sing',
        body: 'Your usual practice hour. The tanpura is one tap away.',
      }
    }
  }

  return null
}

export function markRaised(state: ReminderState, kind: ReminderKind, now: number): ReminderState {
  const today = dayKey(now)
  return kind === 'streak-guard'
    ? { ...state, lastGuardDay: today }
    : { ...state, lastPracticeDay: today }
}

export type PermissionState = 'unsupported' | 'default' | 'granted' | 'denied'

export function notificationPermission(): PermissionState {
  if (typeof Notification === 'undefined') return 'unsupported'
  return Notification.permission as PermissionState
}

export async function requestNotificationPermission(): Promise<PermissionState> {
  if (typeof Notification === 'undefined') return 'unsupported'
  return (await Notification.requestPermission()) as PermissionState
}

/**
 * Raise the notification.
 *
 * Through the service worker when one is controlling the page, because that is
 * the path that survives the tab being in the background on Android, and
 * directly otherwise.
 */
export async function raiseNotification(reminder: DueReminder, basePath: string): Promise<void> {
  if (notificationPermission() !== 'granted') return

  const options: NotificationOptions = {
    body: reminder.body,
    icon: `${basePath}icons/icon-192.png`,
    badge: `${basePath}icons/icon-192.png`,
    tag: `swara-${reminder.kind}`,
    // A practice reminder that stacks up three deep is worse than none.
    renotify: false,
  } as NotificationOptions

  try {
    const registration = await navigator.serviceWorker?.ready
    if (registration) {
      await registration.showNotification(reminder.title, options)
      return
    }
  } catch {
    // Fall through to the direct path below.
  }

  new Notification(reminder.title, options)
}
