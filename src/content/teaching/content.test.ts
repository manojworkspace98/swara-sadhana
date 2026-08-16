import { describe, expect, it } from 'vitest'
import { GLOSSARY, GLOSSARY_BY_ID, lookupTerm } from './glossary'
import { THEORY_CARDS, CARDS_BY_ID, cardsFor } from './cards'
import { HANDBOOK } from './handbook'
import { referencedTerms, type Block } from './types'
import { ALL_GENERATED_LESSONS as ALL_LESSONS } from '../generators/varisai'
import { TALAS } from '../talas'
import { RAGAS } from '../ragas'

/**
 * The teaching content is data, so its mistakes are data mistakes: a term that
 * links nowhere, a demo naming a raga that does not exist, a lesson pointing at
 * a card nobody wrote. Every one of those reaches a beginner as a dead end, and
 * a beginner who hits a dead end assumes the fault is theirs. These tests are
 * the reason that cannot ship.
 */

const ALL_BLOCKS: { where: string; blocks: Block[] }[] = [
  ...GLOSSARY.map((t) => ({ where: `term ${t.id}`, blocks: t.body })),
  ...THEORY_CARDS.map((c) => ({ where: `card ${c.id}`, blocks: c.body })),
  ...HANDBOOK.map((c) => ({ where: `chapter ${c.id}`, blocks: c.body })),
]

describe('glossary', () => {
  it('has an entry for every term the writing links to', () => {
    const dangling: string[] = []
    for (const { where, blocks } of ALL_BLOCKS) {
      for (const id of referencedTerms(blocks)) {
        if (!GLOSSARY_BY_ID[id]) dangling.push(`${where} → [[${id}]]`)
      }
    }
    expect(dangling).toEqual([])
  })

  it('has an entry for every term listed as further reading', () => {
    const dangling: string[] = []
    for (const term of GLOSSARY) {
      for (const id of term.see ?? []) {
        if (!GLOSSARY_BY_ID[id]) dangling.push(`${term.id} → see ${id}`)
      }
    }
    for (const card of [...THEORY_CARDS, ...HANDBOOK]) {
      for (const id of card.terms ?? []) {
        if (!GLOSSARY_BY_ID[id]) dangling.push(`${card.id} → terms ${id}`)
      }
    }
    expect(dangling).toEqual([])
  })

  it('gives every term a pronunciation, because an unsayable word goes unused', () => {
    expect(GLOSSARY.filter((t) => !t.say.trim()).map((t) => t.id)).toEqual([])
  })

  it('gives every term a one-line summary that can stand alone in a tooltip', () => {
    expect(GLOSSARY.filter((t) => t.short.trim().length < 20).map((t) => t.id)).toEqual([])
  })

  it('uses each id exactly once', () => {
    expect(GLOSSARY.length).toBe(new Set(GLOSSARY.map((t) => t.id)).size)
  })
})

describe('demos', () => {
  it('only names ragas and talas the app actually has', () => {
    const problems: string[] = []
    for (const { where, blocks } of ALL_BLOCKS) {
      for (const block of blocks) {
        const demo = block.kind === 'try' || block.kind === 'audio' ? block.demo : undefined
        if (!demo) continue
        if (demo.kind === 'tala' && !TALAS[demo.talaId]) {
          problems.push(`${where}: tala "${demo.talaId}"`)
        }
        if (demo.kind === 'swaras' && demo.ragaId && !RAGAS[demo.ragaId]) {
          problems.push(`${where}: raga "${demo.ragaId}"`)
        }
      }
    }
    expect(problems).toEqual([])
  })

  // A swaras demo naming a raga that does not contain the note would be sung
  // at whatever the fallback resolves to, which is a wrong sound presented as
  // an authority.
  it('only sings swaras the named raga contains', () => {
    const problems: string[] = []
    for (const { where, blocks } of ALL_BLOCKS) {
      for (const block of blocks) {
        const demo = block.kind === 'try' || block.kind === 'audio' ? block.demo : undefined
        if (demo?.kind !== 'swaras') continue
        const raga = RAGAS[demo.ragaId ?? 'mayamalavagowla']
        if (!raga) continue
        for (const note of demo.swaras) {
          if (!raga.letters.includes(note.swara)) {
            problems.push(`${where}: ${note.swara} is not in ${raga.name}`)
          }
        }
      }
    }
    expect(problems).toEqual([])
  })
})

describe('lessons and their cards', () => {
  it('never points a lesson at a card that was not written', () => {
    const dangling: string[] = []
    for (const lesson of ALL_LESSONS) {
      for (const id of lesson.theoryCardIds) {
        if (!CARDS_BY_ID[id]) dangling.push(`${lesson.id} → ${id}`)
      }
    }
    expect(dangling).toEqual([])
  })

  it('gives every lesson at least one card to read', () => {
    expect(ALL_LESSONS.filter((l) => l.theoryCardIds.length === 0).map((l) => l.id)).toEqual([])
  })

  it('resolves card ids in order and drops nothing silently', () => {
    expect(cardsFor(['sruti', 'sthayi']).map((c) => c.id)).toEqual(['sruti', 'sthayi'])
  })
})

describe('handbook', () => {
  it('opens with what this music is, before any of the vocabulary', () => {
    expect(HANDBOOK[0].id).toBe('what-is-this')
  })

  it('gives every chapter an honest reading time', () => {
    for (const chapter of HANDBOOK) {
      expect(chapter.minutes).toBeGreaterThan(0)
      expect(chapter.minutes).toBeLessThan(30)
    }
  })

  it('keeps the two most practical chapters', () => {
    const ids = HANDBOOK.map((c) => c.id)
    expect(ids).toContain('a-days-practice')
    expect(ids).toContain('how-to-improve')
  })
})

describe('lookupTerm', () => {
  it('finds a term by id', () => {
    expect(lookupTerm('sruti')?.term).toBe('sruti')
  })

  it('returns nothing for a word that is not in the glossary', () => {
    expect(lookupTerm('not-a-term')).toBeUndefined()
  })
})
