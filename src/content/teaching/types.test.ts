import { describe, expect, it } from 'vitest'
import { parseTermLinks, referencedTerms, type Block } from './types'

describe('parseTermLinks', () => {
  it('leaves plain prose alone', () => {
    expect(parseTermLinks('Sit tall and breathe.')).toEqual([{ text: 'Sit tall and breathe.' }])
  })

  it('turns a bare marker into a linked term', () => {
    expect(parseTermLinks('Choose your [[sruti]] first.')).toEqual([
      { text: 'Choose your ' },
      { text: 'sruti', termId: 'sruti' },
      { text: ' first.' },
    ])
  })

  // The link text has to be free to read naturally in the sentence, or the
  // prose ends up written around the glossary rather than for the reader.
  it('keeps the sentence own wording when a label is given', () => {
    expect(parseTermLinks('Everything is measured from [[sruti|the note you chose]].')).toEqual([
      { text: 'Everything is measured from ' },
      { text: 'the note you chose', termId: 'sruti' },
      { text: '.' },
    ])
  })

  it('handles several links in one sentence', () => {
    const segments = parseTermLinks('A [[varisai]] is sung in [[adi-tala|Adi tala]].')
    expect(segments.filter((s) => s.termId).map((s) => s.termId)).toEqual(['varisai', 'adi-tala'])
  })

  it('does not treat a stray bracket as a link', () => {
    expect(parseTermLinks('Notation uses [ and ] for repeats.')).toEqual([
      { text: 'Notation uses [ and ] for repeats.' },
    ])
  })
})

describe('referencedTerms', () => {
  it('collects ids from every kind of block that carries prose', () => {
    const blocks: Block[] = [
      { kind: 'p', text: 'Start from [[sruti]].' },
      { kind: 'heading', text: 'About [[tala]]' },
      { kind: 'list', items: ['One [[akshara]]', 'One [[avartana]]'] },
      { kind: 'note', text: 'See [[kalam]].' },
      { kind: 'watch', text: 'Do not rush the [[karvai]].' },
      { kind: 'try', text: 'Sing [[akara|on aa]].', demo: { kind: 'drone' } },
      { kind: 'audio', label: 'Hear [[gamaka]]', demo: { kind: 'drone' } },
    ]
    expect(referencedTerms(blocks).sort()).toEqual([
      'akara',
      'akshara',
      'avartana',
      'gamaka',
      'kalam',
      'karvai',
      'sruti',
      'tala',
    ])
  })

  it('reports each term once however often it appears', () => {
    expect(referencedTerms([{ kind: 'p', text: '[[sruti]] and [[sruti]] again' }])).toEqual([
      'sruti',
    ])
  })
})
