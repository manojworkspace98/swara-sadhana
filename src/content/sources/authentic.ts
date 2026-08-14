import type { NotationElement } from '../schema'
import {
  ALANKARA_SOURCE,
  DHATU_SOURCE,
  JANTA_SOURCE,
  KEEZHSTHAYI_SOURCE,
  MELSTHAYI_SOURCE,
  SARALI_SOURCE,
} from './karnatikVarisai'
import { mandraShift, parseKarnatikLine } from './parseKarnatik'

/**
 * The published exercises, flattened into the shape the lesson builder wants.
 *
 * Each exercise arrives as several printed avartanas; a lesson is all of them
 * in order, because that is how the exercise is sung — the ascent and its
 * answering descent are one thing, not two.
 */
function flatten(group: readonly string[]): NotationElement[] {
  return group.flatMap((line) => parseKarnatikLine(line))
}

export const SARALI_ELEMENTS: NotationElement[][] = SARALI_SOURCE.map(flatten)
export const DHATU_ELEMENTS: NotationElement[][] = DHATU_SOURCE.map(flatten)
export const MELSTHAYI_ELEMENTS: NotationElement[][] = MELSTHAYI_SOURCE.map(flatten)

/**
 * Janta pairs are re-articulated: the second of each doubled swara is struck
 * again rather than held. The published text writes them as two swaras, so the
 * flag is derived here instead of being carried in the source strings.
 */
export const JANTA_ELEMENTS: NotationElement[][] = JANTA_SOURCE.map((group) =>
  flatten(group).map((el, i, all) => {
    const prev = all[i - 1]
    const doubled = prev && prev.swara === el.swara && prev.octave === el.octave
    return doubled ? { ...el, janta: true } : el
  }),
)

/** The lower-octave set, shifted down since plain text loses the mandra dot. */
export const KEEZHSTHAYI_ELEMENTS: NotationElement[][] =
  KEEZHSTHAYI_SOURCE.map((group) => mandraShift(flatten(group)))

export interface AuthenticAlankara {
  talaId: string
  name: string
  aksharaCount: number
  elements: NotationElement[]
}

export const ALANKARA_ELEMENTS: AuthenticAlankara[] = ALANKARA_SOURCE.map((a) => ({
  talaId: a.talaId,
  name: a.name,
  aksharaCount: a.aksharaCount,
  elements: flatten(a.lines),
}))
