import { describe, expect, it } from 'vitest'
import { RAGAS } from './ragas'
import type { NotationLine } from './schema'
import { TALAS } from './talas'
import { buildTimeline, letterSemitoneMap, timelineDuration } from './timeline'

const SA = 138.591 // C#3
const MMG = RAGAS.mayamalavagowla
const ADI = TALAS.adi

function line(id: string, swaras: string, avartanas = 1): NotationLine {
  return {
    id,
    avartanas,
    elements: swaras.split(' ').map((token) => {
      const tara = token.endsWith("'")
      const letter = tara ? token[0] : token
      if (letter === '-') return { swara: null, octave: 0 as const, duration: 1, rest: true }
      return {
        swara: letter as 'S' | 'R' | 'G' | 'M' | 'P' | 'D' | 'N',
        octave: tara ? (1 as const) : (0 as const),
        duration: 1,
      }
    }),
  }
}

const SCALE = [line('l1', "S R G M P D N S'")]

const base = {
  tala: ADI,
  raga: MMG,
  aksharaBpm: 60,
  kalam: 1 as const,
  saHz: SA,
  startAt: 0,
}

describe('letterSemitoneMap', () => {
  it('places the seven letters of Mayamalavagowla', () => {
    expect(letterSemitoneMap(MMG)).toEqual({ S: 0, R: 1, G: 4, M: 5, P: 7, D: 8, N: 11 })
  })

  it('reads the shared position as Dha in Bilahari rather than Ni', () => {
    const map = letterSemitoneMap(RAGAS.bilahari)
    expect(map.D).toBe(9)
    expect(map.N).toBe(11)
    expect(map.R).toBe(2)
  })

  it('omits letters the raga does not use', () => {
    const map = letterSemitoneMap(RAGAS.mohanam)
    expect(map.M).toBeUndefined()
    expect(map.N).toBeUndefined()
    expect(map.G).toBe(4)
  })

  it('covers a raga whose ascent and descent differ', () => {
    // Malahari drops Ga on the way up, so the map has to read both directions.
    expect(letterSemitoneMap(RAGAS.malahari)).toEqual({ S: 0, R: 1, G: 4, M: 5, P: 7, D: 8 })
  })
})

describe('buildTimeline timing', () => {
  it('spends one avartana in the seconds the tala tempo says it should', () => {
    const notes = buildTimeline(SCALE, base)
    expect(notes).toHaveLength(8)
    // Eight aksharas at 60 per minute is eight seconds.
    expect(notes[0].t0).toBe(0)
    expect(notes[7].t1).toBeCloseTo(8, 9)
    expect(timelineDuration(notes)).toBeCloseTo(ADI.aksharaCount * (60 / base.aksharaBpm), 9)
  })

  it('runs kalam 2 in exactly half the time of kalam 1, and kalam 3 in a quarter', () => {
    const first = timelineDuration(buildTimeline(SCALE, base))
    const second = timelineDuration(buildTimeline(SCALE, { ...base, kalam: 2 }))
    const third = timelineDuration(buildTimeline(SCALE, { ...base, kalam: 3 }))
    expect(second).toBeCloseTo(first / 2, 9)
    expect(third).toBeCloseTo(first / 4, 9)
  })

  it('reports aksharas of the real cycle, so a doubled speed halves the count', () => {
    const first = buildTimeline(SCALE, base)
    const second = buildTimeline(SCALE, { ...base, kalam: 2 })
    expect(first.map((n) => n.durAksharas)).toEqual(Array(8).fill(1))
    expect(second.map((n) => n.durAksharas)).toEqual(Array(8).fill(0.5))
    expect(second[7].startAkshara).toBe(3.5)
  })

  it('leaves no gap between consecutive notes, across line boundaries too', () => {
    const notes = buildTimeline([...SCALE, line('l2', "S' N D P M G R S")], base)
    expect(notes).toHaveLength(16)
    for (let i = 1; i < notes.length; i += 1) {
      expect(notes[i].t0).toBeCloseTo(notes[i - 1].t1, 9)
    }
    expect(notes[15].t1).toBeCloseTo(16, 9)
  })

  it('honours a held note and a slower tempo', () => {
    const held: NotationLine[] = [
      { id: 'h1', avartanas: 1, elements: [{ swara: 'S', octave: 0, duration: 8 }] },
    ]
    const notes = buildTimeline(held, { ...base, aksharaBpm: 30 })
    expect(notes).toHaveLength(1)
    expect(notes[0].t1).toBeCloseTo(16, 9)
  })

  it('starts where it is told to', () => {
    const notes = buildTimeline(SCALE, { ...base, startAt: 4.25 })
    expect(notes[0].t0).toBeCloseTo(4.25, 9)
    expect(notes[7].t1).toBeCloseTo(12.25, 9)
  })

  it('refuses a tempo of zero rather than producing infinities', () => {
    expect(() => buildTimeline(SCALE, { ...base, aksharaBpm: 0 })).toThrow()
  })
})

describe('buildTimeline pitch', () => {
  it('puts each swara of Mayamalavagowla at its cents above Sa', () => {
    const notes = buildTimeline(SCALE, base)
    expect(notes.map((n) => n.targetCents)).toEqual([0, 100, 400, 500, 700, 800, 1100, 1200])
    expect(notes.map((n) => n.semitone)).toEqual([0, 1, 4, 5, 7, 8, 11, 0])
    expect(notes.map((n) => n.sthayi)).toEqual([0, 0, 0, 0, 0, 0, 0, 1])
  })

  it('reads the mandra sthayi as negative cents', () => {
    const mandra: NotationLine[] = [
      {
        id: 'm1',
        avartanas: 1,
        elements: [
          { swara: 'P', octave: -1, duration: 4 },
          { swara: 'N', octave: -1, duration: 4 },
        ],
      },
    ]
    const notes = buildTimeline(mandra, base)
    expect(notes[0].targetCents).toBe(-500) // mandra Pa: 7 − 12 semitones
    expect(notes[1].targetCents).toBe(-100) // mandra Ni: 11 − 12
  })

  it('places the same letters differently in a different raga', () => {
    const notes = buildTimeline([line('b1', 'S R G M P D N S')], {
      ...base,
      raga: RAGAS.bilahari,
    })
    expect(notes.map((n) => n.targetCents)).toEqual([0, 200, 400, 500, 700, 900, 1100, 0])
  })

  it('refuses a swara the raga does not contain', () => {
    expect(() => buildTimeline([line('x1', 'S R G M P')], { ...base, raga: RAGAS.mohanam })).toThrow(
      /no M/,
    )
  })
})

describe('buildTimeline rests and syllables', () => {
  it('keeps a rest in place, with nothing to score', () => {
    const notes = buildTimeline([line('r1', 'S R - M P D N S')], base)
    expect(notes).toHaveLength(8)
    expect(notes[2].rest).toBe(true)
    expect(notes[2].targetCents).toBe(0)
    expect(notes[2].t0).toBeCloseTo(2, 9)
    expect(notes[2].t1).toBeCloseTo(3, 9)
    expect(notes[3].t0).toBeCloseTo(3, 9)
    expect(notes.filter((n) => n.rest).length).toBe(1)
  })

  it('carries sahitya through as the syllable to score', () => {
    const sung: NotationLine[] = [
      {
        id: 's1',
        avartanas: 1,
        elements: [
          { swara: 'S', octave: 0, duration: 4, sahitya: 'la' },
          { swara: 'R', octave: 0, duration: 4, janta: true },
        ],
      },
    ]
    const notes = buildTimeline(sung, base)
    expect(notes[0].syllable).toBe('la')
    expect(notes[0].janta).toBeUndefined()
    expect(notes[1].syllable).toBeUndefined()
    expect(notes[1].janta).toBe(true)
  })
})
