import { describe, expect, it } from 'vitest'
import { lessonById } from '../content/generators/varisai'
import { RAGAS } from '../content/ragas'
import { TALAS } from '../content/talas'
import { buildTimeline } from '../content/timeline'
import type { ExpectedNote } from '../state/types'
// Type-only, so nothing from src/audio is loaded and this file stays pure. The
// point of the import is exactly that: proving at compile time that a Tala can
// drive the metronome without either module importing the other.
import type { TalaShape } from '../audio/metronome'
import { DEFAULT_SCORING, detectOnsets, scoreExercise, scoreRhythm } from './scoring'
import { centsAboveSa, hzForCents, hzForSwara } from './swara'
import type { PitchFrame } from './types'

/**
 * The seam test: curriculum → timeline → scoring.
 *
 * Each of those three lives behind its own unit tests, which pass against
 * hand-built fixtures. This one refuses fixtures. It takes a real generated
 * lesson, builds a real timeline from it, sings that timeline synthetically,
 * and scores the result — so a field renamed on one side of a seam fails here
 * even when both sides still pass their own suites.
 */

/** D3, a common enough Sa for a learner and far from any round number. */
const SA_HZ = 146.83
/** The analyser's hop: 512 samples at 48 kHz. */
const HOP_SEC = 0.0107
const AKSHARA_BPM = 60
const UNVOICED_RMS = 0.001

function saraliOneTimeline(): ExpectedNote[] {
  const lesson = lessonById('sarali-1')
  if (!lesson) throw new Error('sarali-1 is missing from the generated curriculum')
  return buildTimeline(lesson.notation, {
    tala: TALAS[lesson.talaId],
    raga: RAGAS[lesson.ragaId],
    aksharaBpm: AKSHARA_BPM,
    kalam: 1,
    saHz: SA_HZ,
    startAt: 0,
  })
}

/**
 * A synthetic performance of a timeline: every frame dead on its note.
 *
 * The pitch is built from `semitone` and `sthayi` through `hzForSwara`, never
 * from `targetCents`. Reading the target back would make the singer follow any
 * bug in the field the scorer is being tested against — with the octave term
 * dropped from `targetCents`, a singer driven by it sings the mistake and
 * scores a clean hundred. Going through the frequency makes the two agree only
 * when the timeline is actually right.
 *
 * `detune` shifts individual notes by a number of cents, which is how a
 * deliberate mistake is planted.
 */
function sing(timeline: ExpectedNote[], detune: Map<number, number> = new Map()): PitchFrame[] {
  const start = timeline[0].t0
  const end = timeline[timeline.length - 1].t1
  const frames: PitchFrame[] = []

  for (let i = 0; start + i * HOP_SEC < end; i++) {
    const t = start + i * HOP_SEC
    const index = timeline.findIndex((n) => t >= n.t0 && t < n.t1)
    const note = index < 0 ? undefined : timeline[index]

    if (note === undefined || note.rest === true) {
      frames.push({ t, hz: null, cents: null, clarity: 0, rms: UNVOICED_RMS })
      continue
    }

    const sungHz = hzForSwara(note.semitone, note.sthayi, SA_HZ)
    const offset = detune.get(index) ?? 0
    const hz = offset === 0 ? sungHz : hzForCents(centsAboveSa(sungHz, SA_HZ) + offset, SA_HZ)
    frames.push({ t, hz, cents: centsAboveSa(hz, SA_HZ), clarity: 0.97, rms: 0.05 })
  }

  return frames
}

describe('curriculum → timeline → scoring', () => {
  it('scores a perfectly sung sarali 1 above 95', () => {
    const timeline = saraliOneTimeline()
    const result = scoreExercise(sing(timeline), timeline, DEFAULT_SCORING)

    expect(result.pitchAccuracy).toBeGreaterThan(95)
    expect(result.noteScores).toHaveLength(timeline.length)
    expect(result.noteScores.every((s) => s.verdict === 'good')).toBe(true)
  })

  it('reports the one note sung eighty cents flat among the worst', () => {
    const timeline = saraliOneTimeline()
    const wrong = 5
    const result = scoreExercise(
      sing(timeline, new Map([[wrong, -80]])),
      timeline,
      DEFAULT_SCORING,
    )

    expect(result.worstNotes.map((n) => n.index)).toContain(wrong)
    expect(result.worstNotes[0].index).toBe(wrong)
    expect(result.noteScores[wrong].verdict).toBe('flat')
    expect(result.noteScores[wrong].centsError).toBeCloseTo(-80, 6)
    // The mistake has to cost something without sinking the whole pass.
    expect(result.pitchAccuracy).toBeLessThan(96)
    expect(result.pitchAccuracy).toBeGreaterThan(90)
  })

  it('builds the timeline the lesson actually notates', () => {
    const timeline = saraliOneTimeline()

    // Mayamalavagowla ascending, then back down: S R1 G3 M1 P D1 N3 Ṡ.
    expect(timeline.map((n) => n.targetCents)).toEqual([
      0, 100, 400, 500, 700, 800, 1100, 1200, 1200, 1100, 800, 700, 500, 400, 100, 0,
    ])
    // Two avartanas of adi, one akshara a note, with no gaps between them.
    expect(timeline).toHaveLength(2 * TALAS.adi.aksharaCount)
    for (let i = 1; i < timeline.length; i++) {
      expect(timeline[i].t0).toBeCloseTo(timeline[i - 1].t1, 9)
    }
  })
})

describe('timeline → onsets → rhythm', () => {
  it('places the detected onsets on the notes the timeline expects', () => {
    const timeline = saraliOneTimeline()
    const onsets = detectOnsets(sing(timeline))
    const rhythm = scoreRhythm(onsets, timeline, {
      aksharaSec: 60 / AKSHARA_BPM,
      latencyOffsetMs: 0,
    })

    // Notes 7 and 8 are both the tara Sa, sung as one unbroken two-akshara
    // tone. Nothing in a pitch trace can mark a second attack that the singer
    // never made, so exactly one note goes unmatched and it is that one.
    expect(rhythm.missed).toEqual([8])
    expect(rhythm.matched).toHaveLength(timeline.length - 1)
    for (const m of rhythm.matched) {
      expect(Math.abs(m.errorMs)).toBeLessThanOrEqual(HOP_SEC * 1000 * 3)
    }
    expect(rhythm.rhythmAccuracy).toBeGreaterThan(90)
  })
})

describe('tala → metronome', () => {
  it('satisfies the shape the metronome counts', () => {
    // The assignment is the assertion: if TalaShape and Tala ever drift apart,
    // this file stops compiling.
    const shapes: TalaShape[] = Object.values(TALAS)
    expect(shapes.length).toBeGreaterThan(0)

    for (const tala of shapes) {
      expect(tala.aksharaCount).toBeGreaterThan(0)
      expect(tala.angaStartIndices[0]).toBe(0)
      for (const start of tala.angaStartIndices) {
        expect(start).toBeLessThan(tala.aksharaCount)
      }
    }
  })
})
