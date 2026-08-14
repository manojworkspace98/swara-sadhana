import type { NotationElement } from '../schema'
import type { Sthayi, SwaraLetter } from '../../engine/types'

const LETTERS: readonly string[] = ['s', 'r', 'g', 'm', 'p', 'd', 'n']

/**
 * Read one published line of karnATik notation.
 *
 * The source writes octave by case, holds with a comma, and separates repeated
 * cells with a hyphen that occupies no time. Bar lines are decoration here: the
 * tala already says where the angas fall, and trusting the printed bars would
 * mean carrying two sources of truth for the same fact.
 */
export function parseKarnatikLine(line: string): NotationElement[] {
  const elements: NotationElement[] = []

  for (const token of line.trim().split(/\s+/)) {
    if (token === '|' || token === '||' || token === '-') continue

    if (token === ',') {
      const prev = elements.at(-1)
      if (!prev) throw new Error(`a karvai opens the line: "${line}"`)
      prev.duration += 1
      continue
    }

    const letter = token[0]
    const index = LETTERS.indexOf(letter.toLowerCase())
    if (index === -1) throw new Error(`unreadable token "${token}" in "${line}"`)

    // Upper case is the octave above. The source never needs a mandra mark in
    // these lessons except in the keezhsthayi set, which writes it as a dot we
    // lose in plain text — those lines are handled by `mandraShift` instead.
    const octave: Sthayi = letter === letter.toUpperCase() ? 1 : 0
    elements.push({
      swara: LETTERS[index].toUpperCase() as SwaraLetter,
      octave,
      duration: 1,
    })
  }

  return elements
}

/**
 * Move a line down an octave.
 *
 * The keezhsthayi lessons descend below Sa, which plain-text sources mark with
 * a dot that does not survive being stripped out of HTML. Those exercises are
 * simply the ascending patterns transposed down, so shifting is both faithful
 * and unambiguous — anything already in the tara sthayi drops to madhya, and
 * madhya drops to mandra.
 */
export function mandraShift(elements: NotationElement[]): NotationElement[] {
  return elements.map((el) => ({
    ...el,
    octave: Math.max(-1, el.octave - 1) as Sthayi,
  }))
}

export function totalAksharas(elements: readonly NotationElement[]): number {
  return elements.reduce((sum, el) => sum + el.duration, 0)
}

/**
 * Check a parsed line against the tala it claims to be in.
 *
 * Every published line should fill its avartana exactly. When one does not, it
 * means the source used a convention this parser has not accounted for, and
 * that is worth failing loudly over rather than quietly teaching a bar that
 * does not close.
 */
export function fitsAvartana(
  elements: readonly NotationElement[],
  aksharaCount: number,
): { ok: true; avartanas: number } | { ok: false; got: number } {
  const total = totalAksharas(elements)
  if (total === 0 || total % aksharaCount !== 0) return { ok: false, got: total }
  return { ok: true, avartanas: total / aksharaCount }
}
