import { useCallback, useEffect, useRef, useState } from 'react'

/** Silence longer than this stops counting — you stepped away. */
const IDLE_TIMEOUT_SEC = 20

export interface PracticeTimer {
  /** Seconds of actual practice, excluding idle stretches. */
  activeSec: number
  running: boolean
  paused: boolean
  start: () => void
  stop: () => number
  /** Call whenever the singer makes a sound, to keep the clock alive. */
  noteActivity: () => void
}

/**
 * Counts practice, not wall clock.
 *
 * A timer that keeps running while a lesson sits open in a background tab
 * turns the daily goal into a lie, and the streak with it. This one pauses on
 * a hidden tab and after twenty seconds of silence, and resumes the moment the
 * singer makes a sound again.
 */
export function usePracticeTimer(): PracticeTimer {
  const [activeSec, setActiveSec] = useState(0)
  const [running, setRunning] = useState(false)
  const [paused, setPaused] = useState(false)

  const lastActivity = useRef(0)
  const accumulated = useRef(0)

  const start = useCallback(() => {
    accumulated.current = 0
    lastActivity.current = performance.now()
    setActiveSec(0)
    setPaused(false)
    setRunning(true)
  }, [])

  const stop = useCallback(() => {
    setRunning(false)
    setPaused(false)
    return Math.round(accumulated.current)
  }, [])

  const noteActivity = useCallback(() => {
    lastActivity.current = performance.now()
    setPaused(false)
  }, [])

  useEffect(() => {
    if (!running) return

    let last = performance.now()
    const id = setInterval(() => {
      const now = performance.now()
      const dt = (now - last) / 1000
      last = now

      const idle = (now - lastActivity.current) / 1000 > IDLE_TIMEOUT_SEC
      const hidden = document.visibilityState === 'hidden'

      if (idle || hidden) {
        setPaused(true)
        return
      }

      accumulated.current += dt
      setActiveSec(Math.round(accumulated.current))
    }, 500)

    return () => clearInterval(id)
  }, [running])

  // Coming back to the tab should not credit the time spent away.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') lastActivity.current = performance.now()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  return { activeSec, running, paused, start, stop, noteActivity }
}

/**
 * Keeps the screen awake while a lesson is open. A tablet on a music stand
 * that dims halfway through an avartana is worse than no tablet.
 */
export function useWakeLock(active: boolean): void {
  useEffect(() => {
    if (!active) return
    let sentinel: WakeLockSentinel | null = null
    let cancelled = false

    const request = async () => {
      try {
        sentinel = (await navigator.wakeLock?.request('screen')) ?? null
      } catch {
        // Denied or unsupported: practice continues, the screen just sleeps.
      }
    }

    void request()
    const onVisible = () => {
      if (document.visibilityState === 'visible' && !cancelled) void request()
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisible)
      void sentinel?.release().catch(() => {})
    }
  }, [active])
}
