import type { PitchFrame } from './types'

/** Below this the detector is reporting noise, not a note. */
export const CLARITY_GATE = 0.9
/** Room tone on a laptop sits well under this; singing sits well over. */
export const RMS_GATE_DB = -50

export interface RawDetection {
  t: number
  hz: number
  clarity: number
  rms: number
}

export function rmsToDb(rms: number): number {
  return 20 * Math.log10(Math.max(rms, 1e-9))
}

export function computeRms(samples: Float32Array): number {
  let sum = 0
  for (let i = 0; i < samples.length; i++) sum += samples[i] * samples[i]
  return Math.sqrt(sum / samples.length)
}

/**
 * A three-frame median on the detected frequency.
 *
 * The McLeod method occasionally reports a note an octave off for a single
 * frame — harmless to the ear, but it puts a spike through the pitch trace and
 * can register as a spurious note onset. A median of three throws away any
 * single-frame excursion while costing only one hop (about 11 ms) of lag.
 */
export class MedianPitchFilter {
  private window: number[] = []

  push(hz: number): number {
    this.window.push(hz)
    if (this.window.length > 3) this.window.shift()
    const sorted = [...this.window].sort((a, b) => a - b)
    return sorted[Math.floor(sorted.length / 2)]
  }

  reset(): void {
    this.window = []
  }
}

/**
 * Decide whether a detection is a sung note, and convert it to a frame.
 *
 * Unvoiced frames are kept rather than dropped: a gap in the trace is real
 * information — it is where the singer breathed, and the rhythm scorer reads
 * those gaps as note boundaries.
 */
export function toFrame(
  det: RawDetection,
  saHz: number,
  filter: MedianPitchFilter,
  opts: { clarityGate?: number; rmsGateDb?: number } = {},
): PitchFrame {
  const clarityGate = opts.clarityGate ?? CLARITY_GATE
  const rmsGateDb = opts.rmsGateDb ?? RMS_GATE_DB
  const db = rmsToDb(det.rms)
  const voiced =
    det.clarity >= clarityGate && db >= rmsGateDb && Number.isFinite(det.hz) && det.hz > 0

  if (!voiced) {
    filter.reset()
    return { t: det.t, hz: null, cents: null, clarity: det.clarity, rms: db }
  }

  const hz = filter.push(det.hz)
  return {
    t: det.t,
    hz,
    cents: 1200 * Math.log2(hz / saHz),
    clarity: det.clarity,
    rms: db,
  }
}
