import type { PitchFrame } from '../types'

export interface OnsetOptions {
  /** Two onsets closer than this are the same attack seen twice. */
  minGapMs?: number
  /** Level drop that counts as a break between two articulations. */
  rmsDropDb?: number
}

const DEFAULT_MIN_GAP_MS = 70
const DEFAULT_RMS_DROP_DB = 6
/** A voiced run shorter than this is a detector blip, not a note. */
const MIN_VOICED_RUN_MS = 60
/** Frames that must agree on a new semitone before the change is believed. */
const STABLE_FRAMES = 3
/** Frame times are floats; comparisons of exact hop boundaries need slack. */
const EPS = 1e-9

/**
 * Where the singer actually started each note.
 *
 * Three things start a note and only the first two show up in the pitch trace:
 * the voice coming in after silence, and the pitch moving to a new swara. The
 * third is a janta — the same swara struck twice — which is a pure loudness
 * event, so it needs the level envelope to be seen at all.
 */
export function detectOnsets(frames: PitchFrame[], opts: OnsetOptions = {}): number[] {
  const minGapSec = (opts.minGapMs ?? DEFAULT_MIN_GAP_MS) / 1000
  const rmsDropDb = opts.rmsDropDb ?? DEFAULT_RMS_DROP_DB

  const candidates = [
    ...voicedStarts(frames),
    ...pitchChanges(frames),
    ...reArticulations(frames, rmsDropDb),
  ].sort((a, b) => a - b)

  // The three detectors see the same attack from different angles, so a real
  // onset usually arrives two or three times. Keep the earliest of each cluster.
  const merged: number[] = []
  for (const t of candidates) {
    if (merged.length === 0 || t - merged[merged.length - 1] >= minGapSec - EPS) {
      merged.push(t)
    }
  }
  return merged
}

function isVoiced(f: PitchFrame): boolean {
  return f.cents !== null
}

function voicedStarts(frames: PitchFrame[]): number[] {
  const out: number[] = []
  for (let i = 0; i < frames.length; i++) {
    if (!isVoiced(frames[i])) continue
    if (i > 0 && isVoiced(frames[i - 1])) continue
    let end = i
    while (end + 1 < frames.length && isVoiced(frames[end + 1])) end++
    if (frames[end].t - frames[i].t >= MIN_VOICED_RUN_MS / 1000 - EPS) out.push(frames[i].t)
    i = end
  }
  return out
}

function pitchChanges(frames: PitchFrame[]): number[] {
  const out: number[] = []
  let stable: number | null = null
  let runSemitone: number | null = null
  let runCount = 0
  let runStart = 0

  for (const f of frames) {
    if (f.cents === null) {
      // A breath breaks the run: the voiced-start detector owns what follows.
      runSemitone = null
      runCount = 0
      continue
    }
    const semitone = Math.round(f.cents / 100)
    if (semitone === runSemitone) {
      runCount++
    } else {
      runSemitone = semitone
      runCount = 1
      runStart = f.t
    }
    if (runCount === STABLE_FRAMES && semitone !== stable) {
      // The first stable pitch establishes the reference without being an
      // onset of its own — the note it belongs to already started.
      if (stable !== null) out.push(runStart)
      stable = semitone
    }
  }
  return out
}

function reArticulations(frames: PitchFrame[], rmsDropDb: number): number[] {
  const out: number[] = []
  let peakDb = -Infinity
  let troughDb = Infinity
  let dipping = false

  for (const f of frames) {
    if (!dipping) {
      if (f.rms > peakDb) peakDb = f.rms
      if (f.rms < peakDb - rmsDropDb) {
        dipping = true
        troughDb = f.rms
      }
    } else {
      if (f.rms < troughDb) troughDb = f.rms
      if (f.rms > troughDb + rmsDropDb) {
        // The recovery frame, roughly one hop after the true attack.
        out.push(f.t)
        dipping = false
        peakDb = f.rms
      }
    }
  }
  return out
}
