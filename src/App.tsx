import { useEffect } from 'react'
import { Outlet } from 'react-router'
import { useApp } from './state/appStore'
import { ProfileGate } from './pages/ProfileGate'
import { InvocationScreen } from './pages/InvocationScreen'
import { applyDeviWatermark } from './content/art'

/**
 * Three gates, in order: the app must be booted, a singer must be chosen, and
 * the day's invocation offered. Only then does the practice app itself appear.
 */
export function App() {
  const { ready, activeProfile, invocationPending, boot, completeInvocation, settings } =
    useApp()

  useEffect(() => {
    void boot()
  }, [boot])

  useEffect(() => {
    applyDeviWatermark(settings?.deviArtwork)
  }, [settings?.deviArtwork])

  if (!ready) {
    return (
      <div className="relative z-10 grid min-h-dvh place-items-center">
        <p className="eyebrow">Opening your practice book…</p>
      </div>
    )
  }

  if (!activeProfile) return <ProfileGate />
  if (invocationPending) return <InvocationScreen onBegin={completeInvocation} />

  return <Outlet />
}
