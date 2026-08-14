import { describe, expect, it } from 'vitest'
import { validateLesson } from '../schema'
import type { Lesson, NotationElement } from '../schema'
import { TALAS } from '../talas'
import {
  ALL_GENERATED_LESSONS,
  DHATU_PATTERNS,
  JANTA_PATTERNS,
  KEEZHSTHAYI_PATTERNS,
  MELSTHAYI_PATTERNS,
  SARALI_PATTERNS,
  fitToAvartanas,
  generateAlankaraLessons,
  generateVarisaiLessons,
  generateVoiceBasics,
  markJanta,
  parsePattern,
} from './varisai'

const varisai = generateVarisaiLessons()
const alankaras = generateAlankaraLessons()
const voiceBasics = generateVoiceBasics()

function allElements(lesson: Lesson): NotationElement[] {
  return lesson.notation.flatMap((line) => line.elements)
}

function aksharasIn(lesson: Lesson): number {
  return allElements(lesson).reduce((sum, el) => sum + el.duration, 0)
}

describe('the pattern parser', () => {
  it('reads octave marks and karvai lengths', () => {
    expect(parsePattern("S R' N, -")).toEqual([
      { swara: 'S', octave: 0, duration: 1 },
      { swara: 'R', octave: 1, duration: 1 },
      { swara: 'N', octave: -1, duration: 1 },
      { swara: null, octave: 0, duration: 1, rest: true },
    ])
    expect(parsePattern("S*4 S'*2")).toEqual([
      { swara: 'S', octave: 0, duration: 4 },
      { swara: 'S', octave: 1, duration: 2 },
    ])
  })

  it('refuses a token it cannot read rather than guessing', () => {
    expect(() => parsePattern('S X')).toThrow()
    expect(() => parsePattern("S''")).toThrow()
  })
})

describe('fitToAvartanas', () => {
  it('leaves a pattern that already closes the cycle alone', () => {
    const eight = parsePattern('S R G M P D N S')
    expect(fitToAvartanas(eight, 8)).toEqual(eight)
  })

  it('holds the last note to fill the cycle rather than adding swaras', () => {
    const five = parsePattern('S R G M P')
    const fitted = fitToAvartanas(five, 8)
    expect(fitted).toHaveLength(5)
    expect(fitted[4].duration).toBe(4)
    expect(fitted.reduce((sum, el) => sum + el.duration, 0)).toBe(8)
  })
})

describe('markJanta', () => {
  it('flags the second of a pair and not the first', () => {
    const marked = markJanta(parsePattern('S S R R'))
    expect(marked[0].janta).toBeUndefined()
    expect(marked[1].janta).toBe(true)
    expect(marked[2].janta).toBeUndefined()
    expect(marked[3].janta).toBe(true)
  })

  it('does not pair swaras that differ only by octave', () => {
    const marked = markJanta(parsePattern("S S'"))
    expect(marked[1].janta).toBeUndefined()
  })
})

describe('sarali varisai', () => {
  const sarali = varisai.filter((l) => l.kind === 'sarali')

  it('has all fourteen, numbered in order', () => {
    expect(SARALI_PATTERNS).toHaveLength(14)
    expect(sarali).toHaveLength(14)
    expect(sarali.map((l) => l.id)).toEqual(
      Array.from({ length: 14 }, (_, i) => `sarali-${i + 1}`),
    )
    expect(sarali.map((l) => l.ordinal)).toEqual(Array.from({ length: 14 }, (_, i) => i + 1))
  })

  it('opens with the plain ascent and descent', () => {
    const first = allElements(sarali[0])
    expect(first).toHaveLength(16)
    expect(first.map((el) => el.swara).join('')).toBe('SRGMPDNSSNDPMGRS')
    expect(first[7].octave).toBe(1) // the tara Sa at the top
    expect(first[8].octave).toBe(1)
    expect(first[15].octave).toBe(0)
    expect(sarali[0].notation).toHaveLength(2)
  })

  it('fills whole avartanas of adi and offers three speeds', () => {
    for (const lesson of sarali) {
      expect(lesson.talaId, lesson.id).toBe('adi')
      expect(aksharasIn(lesson) % 8, lesson.id).toBe(0)
      expect(lesson.speeds.map((s) => s.kalam), lesson.id).toEqual([1, 2, 3])
      expect(lesson.speeds.map((s) => s.notesPerAkshara), lesson.id).toEqual([1, 2, 4])
    }
  })

  it('carries no janta flags — those belong to the janta varisai', () => {
    for (const lesson of sarali) {
      expect(allElements(lesson).some((el) => el.janta), lesson.id).toBe(false)
    }
  })
})

describe('janta varisai', () => {
  const janta = varisai.filter((l) => l.kind === 'janta')

  it('has ten', () => {
    expect(JANTA_PATTERNS).toHaveLength(10)
    expect(janta).toHaveLength(10)
  })

  it('doubles the scale in the first one', () => {
    const first = allElements(janta[0])
    expect(first.slice(0, 4).map((el) => el.swara)).toEqual(['S', 'S', 'R', 'R'])
  })

  it('flags the second of each pair and never the first', () => {
    for (const lesson of janta) {
      const els = allElements(lesson)
      expect(els[0].janta, lesson.id).toBeUndefined()
      for (let i = 1; i < els.length; i += 1) {
        const repeat = els[i].swara === els[i - 1].swara && els[i].octave === els[i - 1].octave
        expect(els[i].janta === true, `${lesson.id} element ${i + 1}`).toBe(repeat)
      }
    }
  })

  it('actually contains pairs to flag', () => {
    for (const lesson of janta) {
      expect(allElements(lesson).filter((el) => el.janta).length, lesson.id).toBeGreaterThan(4)
    }
  })
})

describe('dhatu and sthayi varisai', () => {
  it('has six dhatu, four melsthayi and two keezhsthayi', () => {
    expect(DHATU_PATTERNS).toHaveLength(6)
    expect(MELSTHAYI_PATTERNS).toHaveLength(4)
    expect(KEEZHSTHAYI_PATTERNS).toHaveLength(2)
    expect(varisai.filter((l) => l.kind === 'dhatu')).toHaveLength(6)
    expect(varisai.filter((l) => l.kind === 'sthayi')).toHaveLength(6)
  })

  it('reaches above the tara Sa in the melsthayi exercises', () => {
    for (const lesson of varisai.filter((l) => l.id.startsWith('melsthayi-'))) {
      expect(allElements(lesson).some((el) => el.octave === 1), lesson.id).toBe(true)
    }
  })

  it('reaches below Sa in the keezhsthayi exercises', () => {
    for (const lesson of varisai.filter((l) => l.id.startsWith('keezhsthayi-'))) {
      expect(allElements(lesson).some((el) => el.octave === -1), lesson.id).toBe(true)
    }
  })
})

describe('alankaras', () => {
  it('has one for each of the seven suladi sapta talas', () => {
    expect(alankaras).toHaveLength(7)
    expect(alankaras.map((l) => l.talaId)).toEqual([
      'dhruva',
      'matya',
      'rupaka',
      'jhampa',
      'triputa',
      'ata',
      'eka',
    ])
  })

  it('fits each tala exactly, with no karvai padding', () => {
    for (const lesson of alankaras) {
      const tala = TALAS[lesson.talaId]
      const els = allElements(lesson)
      expect(els.every((el) => el.duration === 1), lesson.id).toBe(true)
      expect(els.length % tala.aksharaCount, lesson.id).toBe(0)
      const declared = lesson.notation.reduce((sum, line) => sum + line.avartanas, 0)
      expect(declared * tala.aksharaCount, lesson.id).toBe(els.length)
    }
  })

  it('climbs to the tara Sa and returns to Sa', () => {
    for (const lesson of alankaras) {
      const els = allElements(lesson)
      expect(els[0].swara, lesson.id).toBe('S')
      expect(els[0].octave, lesson.id).toBe(0)
      expect(els[els.length - 1].swara, lesson.id).toBe('S')
      expect(els[els.length - 1].octave, lesson.id).toBe(0)
      expect(els.some((el) => el.swara === 'S' && el.octave === 1), lesson.id).toBe(true)
    }
  })

  it('uses the rupaka cell of three, the classic S R G / R G M run', () => {
    const rupaka = alankaras.find((l) => l.talaId === 'rupaka')!
    const first = allElements(rupaka).slice(0, 6).map((el) => el.swara)
    expect(first).toEqual(['S', 'R', 'G', 'R', 'G', 'M'])
  })
})

describe('voice basics', () => {
  it('has five, and the first two need no notation', () => {
    expect(voiceBasics).toHaveLength(5)
    expect(voiceBasics[0].notation).toEqual([])
    expect(voiceBasics[1].notation).toEqual([])
  })

  it('holds one Sa across four cycles', () => {
    const sustained = voiceBasics[2]
    expect(sustained.notation).toHaveLength(1)
    expect(sustained.notation[0].avartanas).toBe(4)
    expect(sustained.notation[0].elements).toEqual([{ swara: 'S', octave: 0, duration: 32 }])
  })

  it('asks for one speed only, because there is nothing to double', () => {
    for (const lesson of voiceBasics) {
      expect(lesson.speeds, lesson.id).toHaveLength(1)
      expect(lesson.speeds[0].kalam, lesson.id).toBe(1)
    }
  })
})

describe('the generated curriculum', () => {
  it('validates every lesson', () => {
    for (const lesson of ALL_GENERATED_LESSONS) {
      const result = validateLesson(lesson)
      if (!result.ok) throw new Error(`${lesson.id}: ${result.problems.join('; ')}`)
      expect(result.ok).toBe(true)
    }
  })

  it('gives every lesson a unique id', () => {
    const ids = ALL_GENERATED_LESSONS.map((l) => l.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('holds forty-eight lessons across five levels', () => {
    const perLevel = new Map<number, number>()
    for (const lesson of ALL_GENERATED_LESSONS) {
      perLevel.set(lesson.level, (perLevel.get(lesson.level) ?? 0) + 1)
    }
    expect([...perLevel.entries()].sort((a, b) => a[0] - b[0])).toEqual([
      [0, 5],
      [1, 14],
      [2, 10],
      [3, 12],
      [4, 7],
    ])
    expect(ALL_GENERATED_LESSONS).toHaveLength(48)
  })

  it('chains each level linearly and gates the next on the whole level before it', () => {
    const byLevel = new Map<number, Lesson[]>()
    for (const lesson of ALL_GENERATED_LESSONS) {
      const list = byLevel.get(lesson.level) ?? []
      list.push(lesson)
      byLevel.set(lesson.level, list)
    }

    const levels = [...byLevel.keys()].sort((a, b) => a - b)
    for (const level of levels) {
      const lessons = byLevel.get(level)!
      const previous = level === 0 ? [] : byLevel.get(level - 1)!.map((l) => l.id)
      expect(lessons[0].prerequisites, `level ${level} entry`).toEqual(previous)
      for (let i = 1; i < lessons.length; i += 1) {
        expect(lessons[i].prerequisites, lessons[i].id).toEqual([lessons[i - 1].id])
      }
    }
  })

  it('names only lessons that exist as prerequisites', () => {
    const ids = new Set(ALL_GENERATED_LESSONS.map((l) => l.id))
    for (const lesson of ALL_GENERATED_LESSONS) {
      for (const prereq of lesson.prerequisites) {
        expect(ids.has(prereq), `${lesson.id} -> ${prereq}`).toBe(true)
      }
    }
  })

  it('is entirely in Mayamalavagowla and marked as generated', () => {
    for (const lesson of ALL_GENERATED_LESSONS) {
      expect(lesson.ragaId, lesson.id).toBe('mayamalavagowla')
      expect(lesson.generated, lesson.id).toBe(true)
    }
  })
})

describe('validateLesson as a gate', () => {
  it('catches a line whose durations do not fill its avartanas', () => {
    const broken: Lesson = {
      ...ALL_GENERATED_LESSONS[5],
      id: 'broken-1',
      notation: [
        {
          id: 'broken-1-l1',
          elements: parsePattern('S R G M P D N'),
          avartanas: 1,
        },
      ],
    }
    const result = validateLesson(broken)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.problems[0]).toContain('spans 7 aksharas')
  })

  it('catches a swara the raga does not contain', () => {
    const broken: Lesson = {
      ...ALL_GENERATED_LESSONS[5],
      id: 'broken-2',
      ragaId: 'mohanam', // no Ma, no Ni
      notation: [
        {
          id: 'broken-2-l1',
          elements: parsePattern('S R G M P D N S'),
          avartanas: 1,
        },
      ],
    }
    const result = validateLesson(broken)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.problems.join(' ')).toContain('M, which Mohanam does not contain')
      expect(result.problems.join(' ')).toContain('N, which Mohanam does not contain')
    }
  })

  it('catches a kalam whose note density is wrong', () => {
    const broken: Lesson = {
      ...ALL_GENERATED_LESSONS[5],
      id: 'broken-3',
      speeds: [{ kalam: 2, notesPerAkshara: 1, suggestedBpm: [40, 60], required: true }],
    }
    const result = validateLesson(broken)
    expect(result.ok).toBe(false)
  })
})
