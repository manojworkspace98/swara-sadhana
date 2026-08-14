let ctx: AudioContext | null = null

/**
 * One AudioContext for the whole app. Browsers refuse to start one outside a
 * user gesture, so every caller has to be reachable from a click.
 */
export function getAudioContext(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext({ latencyHint: 'interactive' })
    if (import.meta.env.DEV) {
      ;(window as unknown as { __audio?: AudioContext }).__audio = ctx
    }
  }
  return ctx
}

export async function resumeAudio(): Promise<AudioContext> {
  const c = getAudioContext()
  if (c.state === 'suspended') await c.resume()
  return c
}

export function audioReady(): boolean {
  return ctx !== null && ctx.state === 'running'
}
