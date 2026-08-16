import type { SwaraLetter, Sthayi } from '../../engine/types'

/**
 * The teaching layer.
 *
 * The app could already listen to a voice and score it before it could explain
 * a single word it used, which is the wrong way round: a beginner told to
 * "find your sruti" has been asked to do something in a language nobody taught
 * them. Everything here exists to make sure a term is explained at the moment
 * it is first needed, in words that assume nothing.
 *
 * Content is structured rather than free markdown so that a sentence can carry
 * a sound. A paragraph about the drone is worth little next to a button that
 * plays it, and both live in the same block list.
 */

/** Something the app can play to show what a word means. */
export type Demo =
  | { kind: 'drone' }
  /** Swaras sung by the reference voice, over the drone. */
  | { kind: 'swaras'; swaras: { swara: SwaraLetter; octave: Sthayi; duration: number }[]; ragaId?: string; bpm?: number }
  /** One avartana of a tala, counted with the metronome. */
  | { kind: 'tala'; talaId: string }
  /** A term spoken aloud, so a name can be said as well as read. */
  | { kind: 'say'; text: string }

export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'heading'; text: string }
  | { kind: 'list'; items: string[]; ordered?: boolean }
  /** An aside — useful, but not needed to get on with the lesson. */
  | { kind: 'note'; text: string }
  /** Something to do right now, usually with a sound attached. */
  | { kind: 'try'; text: string; demo?: Demo }
  | { kind: 'audio'; label: string; demo: Demo }
  /** A common mistake, named so it can be avoided rather than discovered. */
  | { kind: 'watch'; text: string }

/**
 * A term, with how to say it.
 *
 * Reading a word is not knowing it. Half the difficulty of starting Carnatic
 * music is a vocabulary that is never pronounced aloud for you, so every entry
 * carries a respelling and can be spoken by the app.
 */
export interface GlossaryTerm {
  id: string
  /** Roman spelling as the app uses it, e.g. "sruti". */
  term: string
  /** With diacritics, e.g. "śruti". */
  iso?: string
  devanagari?: string
  telugu?: string
  /** Plain respelling, e.g. "SHROO-thi". Capitals mark the stressed part. */
  say: string
  /** One sentence a beginner can hold on to. */
  short: string
  /** The fuller explanation, shown when the term is opened. */
  body: Block[]
  /** Other terms worth reading next. */
  see?: string[]
}

export interface TheoryCard {
  id: string
  title: string
  /** Shown collapsed, before the card is opened. */
  summary: string
  body: Block[]
  /** Terms this card assumes; surfaced as chips the reader can open. */
  terms?: string[]
}

export interface HandbookChapter {
  id: string
  title: string
  /** One line saying what the reader will know by the end. */
  lead: string
  /** Rough reading time in minutes, so nobody is ambushed by a long chapter. */
  minutes: number
  body: Block[]
  terms?: string[]
}

/**
 * Inline glossary links.
 *
 * Body text marks a term as [[sruti]] or [[sruti|your sruti]]. Keeping it to a
 * marker rather than a nested structure means the prose stays readable in the
 * source, which matters when the prose is the product.
 */
export interface TextSegment {
  text: string
  termId?: string
}

const TERM_PATTERN = /\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g

export function parseTermLinks(text: string): TextSegment[] {
  const segments: TextSegment[] = []
  let lastIndex = 0

  for (const match of text.matchAll(TERM_PATTERN)) {
    const at = match.index
    if (at > lastIndex) segments.push({ text: text.slice(lastIndex, at) })
    segments.push({ text: match[2] ?? match[1], termId: match[1] })
    lastIndex = at + match[0].length
  }

  if (lastIndex < text.length) segments.push({ text: text.slice(lastIndex) })
  return segments
}

/** Every term id referenced by a piece of content, for the link check. */
export function referencedTerms(blocks: readonly Block[]): string[] {
  const ids = new Set<string>()
  const scan = (text: string) => {
    for (const match of text.matchAll(TERM_PATTERN)) ids.add(match[1])
  }

  for (const block of blocks) {
    switch (block.kind) {
      case 'p':
      case 'heading':
      case 'note':
      case 'watch':
        scan(block.text)
        break
      case 'try':
        scan(block.text)
        break
      case 'list':
        block.items.forEach(scan)
        break
      case 'audio':
        scan(block.label)
        break
    }
  }
  return [...ids]
}
