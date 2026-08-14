import { describe, expect, it } from 'vitest'
import {
  ALANKARA_SOURCE,
  DHATU_SOURCE,
  JANTA_SOURCE,
  KEEZHSTHAYI_SOURCE,
  MELSTHAYI_SOURCE,
  SARALI_SOURCE,
} from './karnatikVarisai'
import { fitsAvartana, parseKarnatikLine, totalAksharas } from './parseKarnatik'
import { RAGAS, ragaSemitones } from '../ragas'
import { resolveSwara } from '../../engine/swara'

const ADI = 8
const MAYAMALAVAGOWLA = ragaSemitones(RAGAS.mayamalavagowla)

/** The letters Mayamalavagowla actually uses — all seven. */
const RAGA_LETTERS = new Set(
  MAYAMALAVAGOWLA.map((s) => resolveSwara(s, MAYAMALAVAGOWLA).name.letter),
)

const ADI_SETS: [string, readonly (readonly string[])[]][] = [
  ['sarali', SARALI_SOURCE],
  ['janta', JANTA_SOURCE],
  ['dhatu', DHATU_SOURCE],
  ['melsthayi', MELSTHAYI_SOURCE],
  ['keezhsthayi', KEEZHSTHAYI_SOURCE],
]

describe('the published varisai fill their avartanas', () => {
  for (const [name, groups] of ADI_SETS) {
    it(`${name}: every line is a whole number of Adi cycles`, () => {
      const bad: string[] = []
      groups.forEach((group, gi) => {
        group.forEach((line, li) => {
          const fit = fitsAvartana(parseKarnatikLine(line), ADI)
          if (!fit.ok) bad.push(`${name} ${gi + 1} line ${li + 1}: ${fit.got} — "${line}"`)
        })
      })
      expect(bad).toEqual([])
    })
  }

  it('each alankara fills the tala it is written for', () => {
    const bad: string[] = []
    for (const alankara of ALANKARA_SOURCE) {
      alankara.lines.forEach((line, i) => {
        const fit = fitsAvartana(parseKarnatikLine(line), alankara.aksharaCount)
        if (!fit.ok) {
          bad.push(`${alankara.name} line ${i + 1}: ${fit.got}/${alankara.aksharaCount} — "${line}"`)
        }
      })
    }
    expect(bad).toEqual([])
  })
})

describe('the published varisai stay inside the raga', () => {
  it('use only letters Mayamalavagowla contains', () => {
    const all = [...ADI_SETS.flatMap(([, g]) => g.flat()), ...ALANKARA_SOURCE.flatMap((a) => a.lines)]
    const strays = new Set<string>()
    for (const line of all) {
      for (const el of parseKarnatikLine(line)) {
        if (el.swara && !RAGA_LETTERS.has(el.swara)) strays.add(el.swara)
      }
    }
    expect([...strays]).toEqual([])
  })
})

describe('the sets are the expected size', () => {
  it('has all fourteen sarali varisai', () => {
    expect(SARALI_SOURCE).toHaveLength(14)
  })

  it('opens with the plain ascent and descent', () => {
    expect(SARALI_SOURCE[0]).toEqual([
      's r g m | p d | n S ||',
      'S n d p | m g | r s ||',
    ])
  })

  it('covers the seven suladi sapta talas', () => {
    expect(ALANKARA_SOURCE.map((a) => a.talaId)).toEqual([
      'dhruva',
      'matya',
      'rupaka',
      'jhampa',
      'triputa',
      'ata',
      'eka',
    ])
  })

  it('gives each alankara ten lines, one per starting swara up and down', () => {
    for (const a of ALANKARA_SOURCE) expect(a.lines).toHaveLength(10)
  })

  it('has janta, dhatu and both sthayi sets', () => {
    expect(JANTA_SOURCE.length).toBeGreaterThanOrEqual(10)
    expect(DHATU_SOURCE.length).toBeGreaterThanOrEqual(3)
    expect(MELSTHAYI_SOURCE.length).toBeGreaterThanOrEqual(5)
    expect(KEEZHSTHAYI_SOURCE.length).toBeGreaterThanOrEqual(5)
  })
})

describe('parseKarnatikLine', () => {
  it('reads case as octave', () => {
    const els = parseKarnatikLine('s r g m | p d | n S ||')
    expect(els).toHaveLength(8)
    expect(els[0]).toMatchObject({ swara: 'S', octave: 0, duration: 1 })
    expect(els[7]).toMatchObject({ swara: 'S', octave: 1 })
  })

  it('treats a comma as holding the previous swara', () => {
    const els = parseKarnatikLine('s r g m | p , | g m ||')
    expect(totalAksharas(els)).toBe(8)
    expect(els.find((e) => e.duration === 2)).toMatchObject({ swara: 'P' })
  })

  it('gives a cell separator no time of its own', () => {
    expect(totalAksharas(parseKarnatikLine('s r - s r - | s r | g m ||'))).toBe(8)
  })

  it('ignores the printed bar lines', () => {
    expect(parseKarnatikLine('s r g m | p d | n S ||')).toHaveLength(8)
  })

  it('refuses a line that opens with a karvai', () => {
    expect(() => parseKarnatikLine(', s r')).toThrow()
  })

  it('refuses an unreadable token', () => {
    expect(() => parseKarnatikLine('s r x m')).toThrow()
  })
})
