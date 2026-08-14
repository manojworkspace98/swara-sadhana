import { describe, expect, it } from 'vitest'
import type { ExpectedNote } from '../../state/types'
import { hzForCents } from '../swara'
import type { PitchFrame } from '../types'
import {
  DEFAULT_SCORING,
  SCORING_PRESETS,
  scoreExercise,
  scoreNote,
  type ScoringConfig,
} from './pitchScore'

const SA = 138.591
const HOP_MS = 10

/**
 * A synthetic pitch trace at a fixed hop. `cents` returns null for an unvoiced
 * frame. Times are built from integer milliseconds so that a frame lands
 * exactly on the trim boundary rather than a float hair either side of it.
 */
function trace(
  durationSec: number,
  cents: (tRel: number, i: number) => number | null,
  t0 = 0,
): PitchFrame[] {
  const frames: PitchFrame[] = []
  const count = Math.round((durationSec * 1000) / HOP_MS)
  for (let i = 0; i < count; i++) {
    const tRel = (i * HOP_MS) / 1000
    const c = cents(tRel, i)
    frames.push({
      t: t0 + tRel,
      hz: c === null ? null : hzForCents(c, SA),
      cents: c,
      clarity: c === null ? 0.2 : 0.97,
      rms: c === null ? -60 : -22,
    })
  }
  return frames
}

function note(over: Partial<ExpectedNote> = {}): ExpectedNote {
  return {
    semitone: 0,
    sthayi: 0,
    targetCents: 0,
    startAkshara: 0,
    durAksharas: 1,
    t0: 0,
    t1: 1,
    ...over,
  }
}

const NO_TRIM: ScoringConfig = { ...DEFAULT_SCORING, onsetTrimMs: 0 }

describe('scoreNote — the easy cases', () => {
  it('gives a steady note on target full marks', () => {
    const s = scoreNote(trace(1, () => 0), note(), DEFAULT_SCORING)
    expect(s.score).toBeCloseTo(1, 6)
    expect(s.verdict).toBe('good')
    expect(s.medianCents).toBeCloseTo(0, 6)
    expect(s.centsError).toBeCloseTo(0, 6)
    expect(s.dwell).toBe(1)
    expect(s.voicedCoverage).toBe(1)
    expect(s.gamaka).toBe(false)
  })

  it('scores a rest without looking at the audio at all', () => {
    const s = scoreNote(trace(1, () => -900), note({ rest: true }), DEFAULT_SCORING)
    expect(s.score).toBe(1)
    expect(s.verdict).toBe('good')
  })

  it('reports silence as not sung rather than as a wrong note', () => {
    const s = scoreNote(trace(1, () => null), note(), DEFAULT_SCORING)
    expect(s.score).toBe(0)
    expect(s.verdict).toBe('not-sung')
    expect(s.voicedCoverage).toBe(0)
    expect(s.medianCents).toBeNull()
    expect(s.centsError).toBeNull()
  })

  it('reports a slot with no frames at all as not sung', () => {
    const s = scoreNote([], note(), DEFAULT_SCORING)
    expect(s.score).toBe(0)
    expect(s.verdict).toBe('not-sung')
  })

  it('needs the coverage threshold met, not merely one voiced frame', () => {
    // Voiced for a fifth of the slot: the singer came in late and gave up.
    const s = scoreNote(trace(1, (_t, i) => (i < 20 ? 0 : null)), note(), DEFAULT_SCORING)
    expect(s.voicedCoverage).toBeLessThan(DEFAULT_SCORING.minVoicedCoverage)
    expect(s.verdict).toBe('not-sung')
  })
})

describe('scoreNote — wrong notes', () => {
  it('clearly penalises a note sixty cents flat', () => {
    const s = scoreNote(trace(1, () => -60), note(), DEFAULT_SCORING)
    expect(s.centsError).toBeCloseTo(-60, 6)
    expect(s.score).toBeLessThan(0.6)
    expect(s.verdict).toBe('flat')
    expect(s.gamaka).toBe(false)
  })

  it('calls the same error sharp on the other side', () => {
    const s = scoreNote(trace(1, () => 60), note(), DEFAULT_SCORING)
    expect(s.verdict).toBe('sharp')
    expect(s.score).toBeLessThan(0.6)
  })

  it('gives nothing for accuracy beyond the zero-credit distance', () => {
    const s = scoreNote(trace(1, () => -140), note(), DEFAULT_SCORING)
    expect(s.score).toBeLessThan(0.2)
    expect(s.verdict).toBe('flat')
  })

  it('lets the preset decide how much error is still a note', () => {
    // Forty cents flat: inside a beginner's tolerance, outside a strict one.
    const take = trace(1, () => -40)
    const easy = scoreNote(take, note(), SCORING_PRESETS.beginner)
    const hard = scoreNote(take, note(), SCORING_PRESETS.strict)
    expect(easy.verdict).toBe('good')
    expect(easy.score).toBeCloseTo(1, 6)
    expect(hard.verdict).toBe('flat')
    expect(hard.score).toBeLessThan(easy.score)
  })
})

describe('scoreNote — gamaka tolerance', () => {
  it('does not punish a kampita that oscillates eighty cents about the target', () => {
    // Five shakes a second, the rate of a sung kampita.
    const s = scoreNote(
      trace(1, (t) => 80 * Math.sin(2 * Math.PI * 5 * t)),
      note(),
      DEFAULT_SCORING,
    )
    expect(s.score).toBeGreaterThanOrEqual(0.9)
    expect(s.verdict).toBe('good')
    expect(Math.abs(s.centsError ?? 999)).toBeLessThanOrEqual(
      DEFAULT_SCORING.fullCreditCents,
    )
  })

  it('grants the ornament amnesty to a centred oscillation that never rests in the band', () => {
    // Snapping between the two flanks: the median is exact, the dwell is zero.
    const s = scoreNote(
      trace(1, (_t, i) => (Math.floor(i / 10) % 2 === 0 ? 70 : -70)),
      note(),
      NO_TRIM,
    )
    expect(s.dwell).toBe(0)
    expect(s.gamaka).toBe(true)
    expect(s.score).toBeGreaterThanOrEqual(0.9)
    expect(s.verdict).toBe('good')
  })

  it('refuses the amnesty to the same oscillation centred seventy cents flat', () => {
    const s = scoreNote(
      trace(1, (t) => -70 + 80 * Math.sin(2 * Math.PI * 5 * t)),
      note(),
      DEFAULT_SCORING,
    )
    expect(s.gamaka).toBe(false)
    expect(s.score).toBeLessThan(0.7)
    expect(s.verdict).toBe('flat')
  })

  it('refuses the amnesty to a single step across the target', () => {
    // One crossing is a change of note, not a shake, even though the median
    // lands exactly on target and the two flanks are close enough together.
    const s = scoreNote(trace(1, (_t, i) => (i < 50 ? -70 : 70)), note(), NO_TRIM)
    expect(s.medianCents).toBeCloseTo(0, 6)
    expect(s.dwell).toBe(0)
    expect(s.gamaka).toBe(false)
  })

  it('refuses the amnesty to an oscillation wider than one note', () => {
    const s = scoreNote(
      trace(1, (_t, i) => (Math.floor(i / 10) % 2 === 0 ? 120 : -120)),
      note(),
      NO_TRIM,
    )
    expect(s.gamaka).toBe(false)
  })
})

describe('scoreNote — approach glides', () => {
  it('ignores a scoop into the note from a third below', () => {
    // 120 ms sliding up from −400 cents, then steady on target.
    const scooped = trace(0.5, (_t, i) => (i < 12 ? -400 + (400 * i) / 12 : 0))
    const s = scoreNote(scooped, note({ t1: 0.5 }), DEFAULT_SCORING)
    expect(s.dwell).toBe(1)
    expect(s.score).toBeCloseTo(1, 6)
    expect(s.verdict).toBe('good')

    // Without the trim the same take carries the glide into the dwell figure,
    // which is the whole reason the trim exists.
    const untrimmed = scoreNote(scooped, note({ t1: 0.5 }), NO_TRIM)
    expect(untrimmed.dwell).toBeLessThan(1)
  })

  it('never trims more than a quarter of a very short note', () => {
    // 200 ms slot, so the 120 ms trim would swallow most of it.
    const s = scoreNote(trace(0.2, () => 0), note({ t1: 0.2 }), DEFAULT_SCORING)
    expect(s.voicedCoverage).toBe(1)
    expect(s.score).toBeCloseTo(1, 6)
  })
})

describe('scoreExercise', () => {
  const perfect = (t0: number, t1: number) => note({ t0, t1 })

  it('weights the mean by note duration', () => {
    // One second sung perfectly, a quarter second not sung at all.
    const frames = [
      ...trace(1, () => 0),
      ...trace(0.25, () => null, 1),
    ]
    const timeline = [perfect(0, 1), perfect(1, 1.25)]
    const ex = scoreExercise(frames, timeline, DEFAULT_SCORING)
    expect(ex.pitchAccuracy).toBeCloseTo(80, 4)
    expect(ex.noteScores).toHaveLength(2)
  })

  it('leaves rests out of the mean rather than handing out free marks', () => {
    const frames = trace(1, () => -60)
    const timeline = [perfect(0, 1), note({ t0: 1, t1: 2, rest: true })]
    const ex = scoreExercise(frames, timeline, DEFAULT_SCORING)
    expect(ex.noteScores[1].score).toBe(1)
    expect(ex.pitchAccuracy).toBe(ex.noteScores[0].score * 100)
  })

  it('names the three weakest sung notes, worst first', () => {
    const frames = [
      ...trace(0.5, () => 0),
      ...trace(0.5, () => -60, 0.5),
      ...trace(0.5, () => null, 1),
      ...trace(0.5, () => -30, 1.5),
      ...trace(0.5, () => 0, 2),
    ]
    const timeline = [
      perfect(0, 0.5),
      perfect(0.5, 1),
      perfect(1, 1.5),
      perfect(1.5, 2),
      perfect(2, 2.5),
    ]
    const ex = scoreExercise(frames, timeline, DEFAULT_SCORING)
    expect(ex.worstNotes).toHaveLength(3)
    expect(ex.worstNotes[0].index).toBe(2)
    expect(ex.worstNotes[0].score.verdict).toBe('not-sung')
    expect(ex.worstNotes[1].index).toBe(1)
    expect(ex.worstNotes[0].score.score).toBeLessThanOrEqual(ex.worstNotes[1].score.score)
    expect(ex.worstNotes[1].score.score).toBeLessThanOrEqual(ex.worstNotes[2].score.score)
  })

  it('returns zero for a timeline with nothing to sing', () => {
    const ex = scoreExercise(trace(1, () => 0), [], DEFAULT_SCORING)
    expect(ex.pitchAccuracy).toBe(0)
    expect(ex.worstNotes).toHaveLength(0)
  })
})
