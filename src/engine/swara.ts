import type { Sthayi, SwaraLetter, SwaraName } from './types'

/**
 * The 16 named swaras of Carnatic theory laid onto the 12 semitones.
 *
 * Three positions carry two names each — R2/G1, R3/G2, D2/N1, D3/N2 — because
 * the same pitch is called a Ri or a Ga depending on which letters the raga
 * uses. Which name to show is a question about the raga, not about the pitch,
 * so `resolveSwara` needs a raga to answer it. `SEMITONE_NAMES` lists every
 * candidate; index 0 of each is the conventional default when no raga is known.
 */
const N = (letter: SwaraLetter, variant: 0 | 1 | 2 | 3, semitone: number): SwaraName => ({
  letter,
  variant,
  label: variant === 0 ? letter : `${letter}${variant}`,
  semitone,
})

export const SEMITONE_NAMES: readonly (readonly SwaraName[])[] = [
  [N('S', 0, 0)],
  [N('R', 1, 1)],
  [N('R', 2, 2), N('G', 1, 2)],
  [N('R', 3, 3), N('G', 2, 3)],
  [N('G', 3, 4)],
  [N('M', 1, 5)],
  [N('M', 2, 6)],
  [N('P', 0, 7)],
  [N('D', 1, 8)],
  [N('D', 2, 9), N('N', 1, 9)],
  [N('D', 3, 10), N('N', 2, 10)],
  [N('N', 3, 11)],
]

/** Cents above Sa for a frequency, given the learner's tonic. */
export function centsAboveSa(hz: number, saHz: number): number {
  return 1200 * Math.log2(hz / saHz)
}

export function hzForCents(cents: number, saHz: number): number {
  return saHz * Math.pow(2, cents / 1200)
}

/** Frequency of a swara position in a given octave, relative to Sa. */
export function hzForSwara(semitone: number, sthayi: Sthayi, saHz: number): number {
  return saHz * Math.pow(2, (semitone + 12 * sthayi) / 12)
}

export interface PitchPosition {
  /** Nearest chromatic step, 0–11, wrapped into one octave. */
  semitone: number
  sthayi: Sthayi
  /** Signed distance from the nearest chromatic step, −50…+50 cents. */
  centsOff: number
  /** Raw cents above Sa, unrounded. */
  cents: number
}

/**
 * Split a pitch into "which swara position" and "how far off it is".
 *
 * Sthayi is clamped to mandra/madhya/tara: a learner two octaves below Sa is
 * far more likely to be an octave-detection error than a real note, and the UI
 * has nowhere to draw it.
 */
export function locatePitch(hz: number, saHz: number): PitchPosition {
  const cents = centsAboveSa(hz, saHz)
  const step = Math.round(cents / 100)
  const centsOff = cents - step * 100
  const rawSthayi = Math.floor(step / 12)
  const sthayi = Math.max(-1, Math.min(1, rawSthayi)) as Sthayi
  const semitone = ((step % 12) + 12) % 12
  return { semitone, sthayi, centsOff, cents }
}

export interface ResolvedSwara extends PitchPosition {
  name: SwaraName
  /** False when the sung position is not one the raga uses. */
  inRaga: boolean
}

/**
 * Name a semitone within a raga.
 *
 * A raga is passed as the set of semitones it uses (arohana ∪ avarohana). When
 * the sung position is in that set, its name is the raga's name for it; the
 * shared positions are disambiguated by looking at which letters the raga
 * already spends elsewhere, so Bilahari's 9 reads D2 rather than N1.
 *
 * Out-of-raga pitches still get named — a beginner sliding through a foreign
 * note needs to see where they are — but are flagged so the UI can grey them.
 */
export function resolveSwara(
  semitone: number,
  ragaSemitones: readonly number[],
): { name: SwaraName; inRaga: boolean } {
  const candidates = SEMITONE_NAMES[((semitone % 12) + 12) % 12]
  const inRaga = ragaSemitones.includes(((semitone % 12) + 12) % 12)

  if (candidates.length === 1) return { name: candidates[0], inRaga }

  // Shared position. Prefer the reading whose letter the raga does not already
  // use at another position: a raga spends each letter once, so if 4 (G3) is
  // present, position 2 must be read as R2 rather than G1.
  const lettersElsewhere = new Set<SwaraLetter>()
  for (const s of ragaSemitones) {
    if (s === semitone) continue
    const only = SEMITONE_NAMES[s]
    if (only.length === 1) lettersElsewhere.add(only[0].letter)
  }
  const free = candidates.find((c) => !lettersElsewhere.has(c.letter))
  return { name: free ?? candidates[0], inRaga }
}

/** Full reading of a live frequency: position, name, and how far off it sits. */
export function readPitch(
  hz: number,
  saHz: number,
  ragaSemitones: readonly number[],
): ResolvedSwara {
  const pos = locatePitch(hz, saHz)
  const { name, inRaga } = resolveSwara(pos.semitone, ragaSemitones)
  return { ...pos, name, inRaga }
}

/** Display form with the octave dot: Ṡ tara, S madhya, Ṣ mandra. */
export function labelWithSthayi(name: SwaraName, sthayi: Sthayi): string {
  if (sthayi > 0) return `${name.label}̇` // combining dot above
  if (sthayi < 0) return `${name.label}̣` // combining dot below
  return name.label
}
