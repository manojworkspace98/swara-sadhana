/** One analysis frame from the microphone. Produced by `src/audio`, consumed
 *  by everything in `src/engine` — which is why this file imports nothing. */
export interface PitchFrame {
  /** Seconds on the AudioContext clock, not wall clock. */
  t: number
  /** Detected fundamental, or null when the frame is unvoiced. */
  hz: number | null
  /** Cents above the learner's Sa. Null whenever `hz` is null. */
  cents: number | null
  /** MPM clarity, 0–1. */
  clarity: number
  /** Frame loudness, dBFS. */
  rms: number
}

/** The seven swara letters. Variants (R1/R2/R3 …) are the letter plus a
 *  position, resolved against a raga — see `swara.ts`. */
export type SwaraLetter = 'S' | 'R' | 'G' | 'M' | 'P' | 'D' | 'N'

/** Mandra (below), madhya (the learner's own octave), tara (above). */
export type Sthayi = -1 | 0 | 1

/** A named swara position: the letter plus its variant index, as Carnatic
 *  theory names them (R1 śuddha, R2 chatuśruti, R3 ṣaṭśruti, …). S and P have
 *  no variants and carry index 0. */
export interface SwaraName {
  letter: SwaraLetter
  variant: 0 | 1 | 2 | 3
  /** 'S', 'R1', 'G3', 'M2', 'P', 'D2', 'N3' … */
  label: string
  /** Semitones above Sa, 0–11. */
  semitone: number
}
