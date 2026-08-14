import { findRmsSpikes } from '../engine/onsetDetect'
import { playClick } from './metronome'
import type { PitchFrame } from '../engine/types'

/**
 * Round-trip latency.
 *
 * Between scheduling a click and hearing it back through the microphone sit
 * the output buffer, the speaker, the room, the input buffer and the analysis
 * window. Rhythm scoring has to subtract all of it, and none of it is
 * knowable in advance — so the app plays five clicks at known moments and
 * looks for them coming back.
 */

/** Anything that emits microphone frames. `MicPitchSource` satisfies it. */
export interface CalibrationSource {
  subscribe(cb: (frame: PitchFrame) => void): () => void
}

export interface LatencyResult {
  offsetMs: number
  confidence: 'good' | 'poor'
}

const CLICKS = 5
const CLICK_GAP_SEC = 0.55
const LEAD_IN_SEC = 0.4
const TAIL_SEC = 0.4
/** Beyond this the "echo" is something else in the room, not the click. */
const MAX_PLAUSIBLE_MS = 400
/** Frames arrive about every 11 ms, so agreement finer than this is luck. */
const SPREAD_LIMIT_MS = 40
const MIN_HITS = 3

export async function calibrateLatency(
  ctx: AudioContext,
  source: CalibrationSource,
): Promise<LatencyResult> {
  if (ctx.state === 'suspended') await ctx.resume()

  const frames: { t: number; rms: number }[] = []
  const unsubscribe = source.subscribe((f) => {
    frames.push({ t: f.t, rms: f.rms })
  })

  const scheduled: number[] = []
  const first = ctx.currentTime + LEAD_IN_SEC
  for (let i = 0; i < CLICKS; i++) {
    const at = first + i * CLICK_GAP_SEC
    scheduled.push(at)
    playClick(ctx, ctx.destination, at, 'sam')
  }

  const runSec = LEAD_IN_SEC + CLICKS * CLICK_GAP_SEC + TAIL_SEC
  await new Promise<void>((resolve) => setTimeout(resolve, runSec * 1000))
  unsubscribe()

  const floorMs = outputLatencySec(ctx) * 1000
  // Half the click gap: close enough to reject the room's reflection of a
  // click, wide enough that two clicks are never merged into one.
  const spikes = findRmsSpikes(frames, { minGapSec: CLICK_GAP_SEC * 0.5 })

  const deltas: number[] = []
  for (const at of scheduled) {
    const heard = spikes.find((t) => t >= at && t <= at + MAX_PLAUSIBLE_MS / 1000)
    if (heard !== undefined) deltas.push((heard - at) * 1000)
  }

  if (deltas.length < MIN_HITS) {
    // Nothing came back — muted speakers, headphones, a very quiet room. The
    // output latency the device reports is the least the delay can be.
    return { offsetMs: Math.round(floorMs), confidence: 'poor' }
  }

  const spread = Math.max(...deltas) - Math.min(...deltas)
  const offsetMs = Math.max(median(deltas), floorMs)
  const confidence: LatencyResult['confidence'] =
    deltas.length >= CLICKS - 1 && spread <= SPREAD_LIMIT_MS ? 'good' : 'poor'
  return { offsetMs: Math.round(offsetMs), confidence }
}

/**
 * What the device admits to on its own, in seconds.
 *
 * This counts only the output side and no browser reports the microphone's
 * share, so it is a floor on the round trip rather than a measurement of it.
 * Safari reports neither, and returns zero.
 */
export function outputLatencySec(ctx: AudioContext): number {
  const output = Number.isFinite(ctx.outputLatency) ? ctx.outputLatency : 0
  const base = Number.isFinite(ctx.baseLatency) ? ctx.baseLatency : 0
  return Math.max(output, base, 0)
}

function median(values: readonly number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}
