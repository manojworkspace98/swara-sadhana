import type { ExpectedNote } from '../../state/types'

export interface RhythmOptions {
  /** Seconds per akshara at the tempo the exercise was sung. */
  aksharaSec: number
  /** Measured round-trip audio latency, in milliseconds. */
  latencyOffsetMs: number
}

export interface MatchedOnset {
  noteIndex: number
  /** Latency-corrected, so it sits on the same clock as the expected timeline. */
  onsetTime: number
  /** Signed: positive is late. */
  errorMs: number
}

export interface RhythmScore {
  /** 0–100. */
  rhythmAccuracy: number
  matched: MatchedOnset[]
  /** Timeline indices of notes that no onset landed near. */
  missed: number[]
  /** Mean signed error: positive is dragging, negative is rushing. */
  tendencyMs: number
}

/** Below a fast akshara the ear stops hearing the difference at all. */
const MIN_FULL_CREDIT_SEC = 0.08
const FULL_CREDIT_FRACTION = 0.1
const ZERO_CREDIT_FRACTION = 0.35
const MATCH_WINDOW_FRACTION = 0.5

export function scoreRhythm(
  onsets: number[],
  timeline: ExpectedNote[],
  opts: RhythmOptions,
): RhythmScore {
  // Everything the microphone hears arrives late by the round trip through the
  // browser's audio stack. Left in, it reads as a singer who always drags.
  const latencySec = opts.latencyOffsetMs / 1000
  const corrected = onsets.map((t) => t - latencySec)
  const used = new Array<boolean>(corrected.length).fill(false)

  const matchWindow = MATCH_WINDOW_FRACTION * opts.aksharaSec
  const fullCredit = Math.max(MIN_FULL_CREDIT_SEC, FULL_CREDIT_FRACTION * opts.aksharaSec)
  const zeroCredit = ZERO_CREDIT_FRACTION * opts.aksharaSec

  const matched: MatchedOnset[] = []
  const missed: number[] = []
  let creditTotal = 0
  let sungNotes = 0

  timeline.forEach((note, index) => {
    if (note.rest) return
    sungNotes++

    let best = -1
    let bestDistance = Infinity
    for (let i = 0; i < corrected.length; i++) {
      if (used[i]) continue
      const distance = Math.abs(corrected[i] - note.t0)
      if (distance <= matchWindow && distance < bestDistance) {
        bestDistance = distance
        best = i
      }
    }

    if (best < 0) {
      missed.push(index)
      return
    }

    used[best] = true
    const errorSec = corrected[best] - note.t0
    matched.push({ noteIndex: index, onsetTime: corrected[best], errorMs: errorSec * 1000 })
    creditTotal += timingCredit(Math.abs(errorSec), fullCredit, zeroCredit)
  })

  const rhythmAccuracy = sungNotes > 0 ? (creditTotal / sungNotes) * 100 : 0
  const tendencyMs =
    matched.length > 0
      ? matched.reduce((sum, m) => sum + m.errorMs, 0) / matched.length
      : 0

  return { rhythmAccuracy, matched, missed, tendencyMs }
}

function timingCredit(errorSec: number, fullCredit: number, zeroCredit: number): number {
  if (errorSec <= fullCredit) return 1
  // A very fast akshara puts the zero-credit distance inside the floor on full
  // credit, leaving no ramp to interpolate along.
  if (zeroCredit <= fullCredit) return 0
  if (errorSec >= zeroCredit) return 0
  return (zeroCredit - errorSec) / (zeroCredit - fullCredit)
}
