import type { ExpectedNote } from '../../state/types'
import type { PitchFrame } from '../types'

/**
 * How forgiving the judgement is. Every number is a musical decision, not a
 * tuning knob: widen `bandCents` and a wobble reads as steady, narrow it and a
 * correctly sung gamaka reads as a mistake.
 */
export interface ScoringConfig {
  /** Errors this small are indistinguishable from exact to a listener. */
  fullCreditCents: number
  /** At this error the note has earned nothing for accuracy. */
  zeroCreditCents: number
  /** Half-width of the band a frame must sit inside to count as dwelling. */
  bandCents: number
  /** Below this fraction of voiced frames the slot counts as not sung at all. */
  minVoicedCoverage: number
  /** Head of the slot to ignore, where the approach glide lives. */
  onsetTrimMs: number
  /** Dwell fraction that already earns the whole steadiness half of the score. */
  dwellForFullCredit: number
}

export type ScoringPreset = 'beginner' | 'standard' | 'strict'

export const SCORING_PRESETS: Record<ScoringPreset, ScoringConfig> = {
  beginner: {
    fullCreditCents: 50,
    zeroCreditCents: 150,
    bandCents: 80,
    minVoicedCoverage: 0.35,
    onsetTrimMs: 150,
    dwellForFullCredit: 0.5,
  },
  standard: {
    fullCreditCents: 35,
    zeroCreditCents: 100,
    bandCents: 60,
    minVoicedCoverage: 0.4,
    onsetTrimMs: 120,
    dwellForFullCredit: 0.6,
  },
  strict: {
    fullCreditCents: 20,
    zeroCreditCents: 70,
    bandCents: 45,
    minVoicedCoverage: 0.5,
    onsetTrimMs: 100,
    dwellForFullCredit: 0.7,
  },
}

export const DEFAULT_SCORING: ScoringConfig = SCORING_PRESETS.standard

export type Verdict = 'good' | 'flat' | 'sharp' | 'unsteady' | 'not-sung'

export interface NoteScore {
  /** 0–1. */
  score: number
  medianCents: number | null
  /** Signed: negative is flat. Null when the note was not sung. */
  centsError: number | null
  /** Fraction of voiced frames inside the tolerance band. */
  dwell: number
  voicedCoverage: number
  /** True when the ornament amnesty rescued a correctly centred oscillation. */
  gamaka: boolean
  verdict: Verdict
}

export interface ScoredNote {
  index: number
  note: ExpectedNote
  score: NoteScore
}

export interface ExerciseScore {
  /** 0–100. */
  pitchAccuracy: number
  /** One entry per timeline note, indices aligned with the timeline. */
  noteScores: NoteScore[]
  worstNotes: ScoredNote[]
}

/** Accuracy is worth more than steadiness: singing the right note matters most. */
const ACCURACY_WEIGHT = 0.65
const DWELL_WEIGHT = 1 - ACCURACY_WEIGHT
const GOOD_SCORE = 0.75

/** A kampita has to cross the target to be a kampita rather than a drift. */
const GAMAKA_MIN_SIGN_CHANGES = 2
/** Wider than this and the trace is wandering between notes, not ornamenting one. */
const GAMAKA_MAX_EXTENT_CENTS = 150
const GAMAKA_DWELL_FLOOR = 0.8

const WORST_NOTE_COUNT = 3

function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x
}

function median(xs: number[]): number {
  const sorted = [...xs].sort((a, b) => a - b)
  const mid = sorted.length >> 1
  return sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

/**
 * Does the trace swing back and forth across the target within one note's
 * worth of pitch? Sign changes prove it crosses rather than drifts; the extent
 * cap stops a slide through a neighbouring swara from claiming to be an
 * ornament.
 */
function oscillatesAround(cents: number[], targetCents: number): boolean {
  let lowest = Infinity
  let highest = -Infinity
  let lastSign = 0
  let signChanges = 0
  for (const c of cents) {
    if (c < lowest) lowest = c
    if (c > highest) highest = c
    const sign = Math.sign(c - targetCents)
    if (sign === 0) continue
    if (lastSign !== 0 && sign !== lastSign) signChanges++
    lastSign = sign
  }
  return (
    signChanges >= GAMAKA_MIN_SIGN_CHANGES && highest - lowest <= GAMAKA_MAX_EXTENT_CENTS
  )
}

function notSung(voicedCoverage: number): NoteScore {
  return {
    score: 0,
    medianCents: null,
    centsError: null,
    dwell: 0,
    voicedCoverage,
    gamaka: false,
    verdict: 'not-sung',
  }
}

/**
 * Judge one expected note against the pitch trace.
 *
 * The judgement is deliberately gamaka-tolerant. Carnatic notes are not held
 * flat lines: they are approached from below, shaken, and released, and a
 * scorer built on mean deviation from a target would mark good singing wrong.
 * So the centre is a median, the head of the slot is thrown away, and a trace
 * that oscillates about a correct target keeps most of its steadiness credit.
 */
export function scoreNote(
  frames: PitchFrame[],
  note: ExpectedNote,
  cfg: ScoringConfig,
): NoteScore {
  const inSlot = frames.filter((f) => f.t >= note.t0 && f.t < note.t1)

  // A rest is silence written into the lesson; there is nothing to sing and so
  // nothing that can be sung wrong.
  if (note.rest) {
    return {
      score: 1,
      medianCents: null,
      centsError: null,
      dwell: 0,
      voicedCoverage: 0,
      gamaka: false,
      verdict: 'good',
    }
  }

  // Never trim more than a quarter of the slot: at the third kalam a note is
  // shorter than the glide that starts it.
  const trimSec = Math.min(cfg.onsetTrimMs / 1000, 0.25 * (note.t1 - note.t0))
  const scored = inSlot.filter((f) => f.t >= note.t0 + trimSec)

  const voiced: number[] = []
  for (const f of scored) if (f.cents !== null) voiced.push(f.cents)

  const voicedCoverage = scored.length === 0 ? 0 : voiced.length / scored.length
  if (voiced.length === 0 || voicedCoverage < cfg.minVoicedCoverage) {
    return notSung(voicedCoverage)
  }

  // Median, not mean: a gamaka swings wide by design and the detector drops the
  // odd frame an octave out. Both move a mean; neither moves a median.
  const medianCents = median(voiced)
  const centsError = medianCents - note.targetCents
  const absError = Math.abs(centsError)

  const accScore = clamp01(
    (cfg.zeroCreditCents - absError) / (cfg.zeroCreditCents - cfg.fullCreditCents),
  )

  // Strictly inside the band. A frame parked exactly on the edge is not
  // dwelling on the note, and counting it would let a note a full band flat
  // still come out as good.
  let inBand = 0
  for (const c of voiced) if (Math.abs(c - note.targetCents) < cfg.bandCents) inBand++
  const dwell = inBand / voiced.length
  let dwellScore = clamp01(dwell / cfg.dwellForFullCredit)

  // Ornament amnesty. A kampita centred on the right note is correct singing,
  // and it fails a dwell test for exactly the reason it is correct.
  let gamaka = false
  if (
    dwell < cfg.dwellForFullCredit &&
    absError <= cfg.fullCreditCents &&
    oscillatesAround(voiced, note.targetCents)
  ) {
    gamaka = true
    dwellScore = Math.max(dwellScore, GAMAKA_DWELL_FLOOR)
  }

  const score = ACCURACY_WEIGHT * accScore + DWELL_WEIGHT * dwellScore

  let verdict: Verdict
  if (score >= GOOD_SCORE) verdict = 'good'
  else if (centsError < -cfg.fullCreditCents) verdict = 'flat'
  else if (centsError > cfg.fullCreditCents) verdict = 'sharp'
  else verdict = 'unsteady'

  return { score, medianCents, centsError, dwell, voicedCoverage, gamaka, verdict }
}

/**
 * Score a whole exercise.
 *
 * The mean is weighted by note duration so that a long held Sa counts for what
 * it is worth, and rests are left out of it entirely — free marks for silence
 * would let a sparse lesson out-score a dense one.
 */
export function scoreExercise(
  frames: PitchFrame[],
  timeline: ExpectedNote[],
  cfg: ScoringConfig,
): ExerciseScore {
  const noteScores = timeline.map((note) => scoreNote(frames, note, cfg))

  const sung: ScoredNote[] = []
  let weightedTotal = 0
  let totalWeight = 0
  timeline.forEach((note, index) => {
    if (note.rest) return
    const weight = Math.max(note.t1 - note.t0, 0)
    weightedTotal += noteScores[index].score * weight
    totalWeight += weight
    sung.push({ index, note, score: noteScores[index] })
  })

  const pitchAccuracy = totalWeight > 0 ? (weightedTotal / totalWeight) * 100 : 0

  const worstNotes = sung
    .sort((a, b) => a.score.score - b.score.score || a.index - b.index)
    .slice(0, WORST_NOTE_COUNT)

  return { pitchAccuracy, noteScores, worstNotes }
}
