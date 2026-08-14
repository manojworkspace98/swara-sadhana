import { useEffect } from 'react'
import { useApp } from './appStore'
import { dayKey } from './day'
import { goalForProfile, goalMet, isRestDay } from './goals'
import { dailyHistory } from './sessions'
import {
  dueReminder,
  markRaised,
  notificationPermission,
  raiseNotification,
} from './reminders'

/** Checked once a minute; the reminder rules are hourly, so this is plenty. */
const TICK_MS = 60_000

/**
 * Raise the day's reminder when it comes due.
 *
 * The app can only do this while it is running — there is no server to push
 * from — so the tick lives at the root of the app rather than on one page, and
 * fires on the first check after the hour arrives. Settings says plainly that
 * a closed browser hears nothing.
 */
export function useReminders(): void {
  const { activeProfile, settings, patchSettings } = useApp()

  useEffect(() => {
    if (!activeProfile || !settings?.reminders.enabled) return
    if (notificationPermission() !== 'granted') return

    let cancelled = false

    const check = async () => {
      const now = Date.now()
      const today = dayKey(now)
      const goal = goalForProfile(activeProfile)

      // Nothing to raise on a rest day, and nothing to raise once the day is
      // already won — both are cheap to establish before touching the tables.
      if (isRestDay(goal, now)) return

      const history = await dailyHistory(activeProfile.id, today, today)
      if (cancelled) return

      const row = history[0]
      const totals = {
        minutes: row?.minutes ?? 0,
        exercises: row?.exercises ?? 0,
        cleanPasses: row?.cleanPasses ?? 0,
      }

      const due = dueReminder({
        settings: settings.reminders,
        state: settings.reminderState,
        now,
        metToday: goalMet(goal, totals, now),
        minutesToday: totals.minutes,
        sessions: (await dailyHistory(activeProfile.id, '0000-00-00', today)).flatMap((r) =>
          r.startedAt.map((startedAt) => ({ startedAt, durationSec: 0 })),
        ),
      })
      if (!due || cancelled) return

      await raiseNotification(due, import.meta.env.BASE_URL)
      await patchSettings({
        reminderState: markRaised(settings.reminderState, due.kind, now),
      })
    }

    void check()
    const timer = window.setInterval(() => void check(), TICK_MS)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [activeProfile, settings, patchSettings])
}
