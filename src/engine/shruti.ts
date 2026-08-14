/**
 * Sruti (tonic) selection.
 *
 * Carnatic singers name their tonic by "kattai", the numbered position on a
 * sruti box, rather than by concert pitch. Both are shown: the kattai number is
 * what a teacher will ask for, the note name is what a tuner app will show.
 */

export interface ShrutiOption {
  /** 'C#3' — note name with octave. */
  id: string
  note: string
  octave: number
  hz: number
  /** Traditional kattai number, where 1 kattai = C. Half steps are '1½' etc. */
  kattai: string
  suits: 'male' | 'female' | 'either'
}

const NOTE_ORDER = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const KATTAI = ['1', '1½', '2', '2½', '3', '4', '4½', '5', '5½', '6', '6½', '7']

/** A4 = 440 Hz; MIDI 69. */
export function hzForMidi(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

export function midiForHz(hz: number): number {
  return 69 + 12 * Math.log2(hz / 440)
}

function buildOption(midi: number): ShrutiOption {
  const pc = midi % 12
  const octave = Math.floor(midi / 12) - 1
  const note = NOTE_ORDER[pc]
  // Below F3 the tessitura is male; from F3 up it is the usual female range.
  // The overlap is real, so the picker only uses this to order suggestions.
  const suits: ShrutiOption['suits'] = midi < 53 ? 'male' : midi >= 60 ? 'female' : 'either'
  return {
    id: `${note}${octave}`,
    note,
    octave,
    hz: hzForMidi(midi),
    kattai: KATTAI[pc],
    suits,
  }
}

/** B2 (MIDI 47) through A3 (MIDI 57) — the range real singers pick from. */
export const SHRUTI_OPTIONS: readonly ShrutiOption[] = Array.from({ length: 11 }, (_, i) =>
  buildOption(47 + i),
)

export const DEFAULT_SHRUTI_MALE = 'C#3'
export const DEFAULT_SHRUTI_FEMALE = 'G3'

export function findShruti(id: string): ShrutiOption | undefined {
  return SHRUTI_OPTIONS.find((s) => s.id === id)
}

export function shrutiHz(id: string): number {
  return findShruti(id)?.hz ?? hzForMidi(49) // C#3
}

/**
 * Suggest a tonic from the lowest note the learner can hold comfortably.
 *
 * Sa sits about a fourth above the bottom of the usable range, so that mandra
 * Pa — a fifth below Sa, and unavoidable from the very first varisai — is still
 * reachable. Five semitones is the compromise: enough headroom below, without
 * pushing tara Sa out of reach above.
 */
export function suggestShruti(lowestComfortableHz: number): ShrutiOption {
  const target = midiForHz(lowestComfortableHz) + 5
  let best = SHRUTI_OPTIONS[0]
  let bestDist = Infinity
  for (const opt of SHRUTI_OPTIONS) {
    const dist = Math.abs(midiForHz(opt.hz) - target)
    if (dist < bestDist) {
      best = opt
      bestDist = dist
    }
  }
  return best
}
