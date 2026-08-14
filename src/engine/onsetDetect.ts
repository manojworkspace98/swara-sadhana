/**
 * Finding loud events in a stream of frame loudnesses.
 *
 * Used by latency calibration: the app plays clicks at known moments on the
 * audio clock and looks for them coming back through the microphone, and the
 * gap between the two is the round trip the rhythm scorer has to subtract.
 */

export interface RmsFrame {
  /** Seconds on the AudioContext clock. */
  t: number
  /** Frame loudness in dBFS, as `PitchFrame.rms` carries it. */
  rms: number
}

export interface SpikeOptions {
  /** How far above the room's noise floor a frame must rise to count. */
  riseDb?: number
  /** Absolute floor. Nothing quieter than this is ever an event. */
  minDb?: number
  /** Two hits closer together than this are one event. */
  minGapSec?: number
}

const DEFAULT_RISE_DB = 12
const DEFAULT_MIN_DB = -55
const DEFAULT_MIN_GAP_SEC = 0.12

/**
 * Return the time of each loud event, in seconds.
 *
 * The threshold is relative to the median frame, which is the noise floor of
 * the room for any recording that is mostly silence — a fixed dBFS threshold
 * would find nothing on a quiet laptop mic and everything on a hot one.
 *
 * The time reported is the leading edge, the first frame over the threshold,
 * not the peak: the peak can sit a frame or two late and latency measured to
 * the peak comes out biased long.
 */
export function findRmsSpikes(frames: readonly RmsFrame[], opts: SpikeOptions = {}): number[] {
  const riseDb = opts.riseDb ?? DEFAULT_RISE_DB
  const minDb = opts.minDb ?? DEFAULT_MIN_DB
  const minGapSec = opts.minGapSec ?? DEFAULT_MIN_GAP_SEC

  const usable = frames
    .filter((f) => Number.isFinite(f.t) && Number.isFinite(f.rms))
    .sort((a, b) => a.t - b.t)
  if (usable.length < 3) return []

  const threshold = Math.max(noiseFloorDb(usable) + riseDb, minDb)

  const hits: number[] = []
  let above = false
  for (const f of usable) {
    if (f.rms < threshold) {
      above = false
      continue
    }
    if (above) continue
    above = true
    const last = hits[hits.length - 1]
    if (last === undefined || f.t - last >= minGapSec) hits.push(f.t)
  }
  return hits
}

/** Median loudness. Robust to the events themselves, which are a small
 *  minority of frames in any recording long enough to calibrate against. */
function noiseFloorDb(frames: readonly RmsFrame[]): number {
  const sorted = frames.map((f) => f.rms).sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}
