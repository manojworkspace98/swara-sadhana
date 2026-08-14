import { resolveSwara } from '../engine/swara'
import type { SwaraLetter } from '../engine/types'
import type { ExpectedNote } from '../state/types'
import type { NotationLine } from './schema'

/** Just enough of a raga to place its letters; `Raga` satisfies this. */
export interface RagaScale {
  arohana: readonly number[]
  avarohana: readonly number[]
}

export interface TimelineOptions {
  tala: { aksharaCount: number }
  raga: RagaScale
  /** Aksharas per minute. It stays put across the kalams — density doubles. */
  aksharaBpm: number
  kalam: 1 | 2 | 3
  saHz: number
  /** Seconds on the AudioContext clock at which the first note begins. */
  startAt: number
}

const NOTES_PER_AKSHARA: Record<1 | 2 | 3, number> = { 1: 1, 2: 2, 3: 4 }

/**
 * Which semitone each letter occupies in this raga.
 *
 * Notation names a letter; scoring needs a pitch. A raga spends each letter on
 * exactly one position, so walking its semitones through `resolveSwara` — which
 * already knows how to read a shared position as Ri rather than Ga — recovers
 * the mapping without a second table to keep in step.
 */
export function letterSemitoneMap(raga: RagaScale): Partial<Record<SwaraLetter, number>> {
  const semitones = [...new Set([...raga.arohana, ...raga.avarohana])].sort((a, b) => a - b)
  const map: Partial<Record<SwaraLetter, number>> = {}
  for (const semitone of semitones) {
    const { name } = resolveSwara(semitone, semitones)
    if (map[name.letter] === undefined) map[name.letter] = semitone
  }
  return map
}

/**
 * Flatten written notation into the note-by-note timeline the player and the
 * scorer both read.
 *
 * `startAkshara` and `durAksharas` are reported in real aksharas of the cycle,
 * not in notation units: at kalam 2 a written akshara occupies half of one, so
 * a 32-note line fills four avartanas of adi at kalam 1 and two at kalam 2.
 */
export function buildTimeline(notation: NotationLine[], opts: TimelineOptions): ExpectedNote[] {
  if (opts.aksharaBpm <= 0) throw new Error('aksharaBpm must be positive')

  const perAkshara = NOTES_PER_AKSHARA[opts.kalam]
  const secondsPerAkshara = 60 / opts.aksharaBpm
  const letters = letterSemitoneMap(opts.raga)

  const notes: ExpectedNote[] = []
  let akshara = 0

  for (const line of notation) {
    for (const el of line.elements) {
      const durAksharas = el.duration / perAkshara
      const t0 = opts.startAt + akshara * secondsPerAkshara
      const t1 = t0 + durAksharas * secondsPerAkshara

      if (el.swara === null || el.rest === true) {
        notes.push({
          semitone: 0,
          sthayi: el.octave,
          targetCents: 0,
          startAkshara: akshara,
          durAksharas,
          t0,
          t1,
          rest: true,
          ...(el.sahitya === undefined ? {} : { syllable: el.sahitya }),
        })
      } else {
        const semitone = letters[el.swara]
        if (semitone === undefined) {
          throw new Error(`the raga has no ${el.swara}, but line "${line.id}" writes one`)
        }
        notes.push({
          semitone,
          sthayi: el.octave,
          targetCents: (semitone + 12 * el.octave) * 100,
          startAkshara: akshara,
          durAksharas,
          t0,
          t1,
          ...(el.sahitya === undefined ? {} : { syllable: el.sahitya }),
          ...(el.janta === undefined ? {} : { janta: el.janta }),
        })
      }

      akshara += durAksharas
    }
  }

  return notes
}

/** Seconds one pass of the notation takes at the given speed. */
export function timelineDuration(notes: readonly ExpectedNote[]): number {
  if (notes.length === 0) return 0
  return notes[notes.length - 1].t1 - notes[0].t0
}
