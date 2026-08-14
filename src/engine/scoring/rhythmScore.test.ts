import { describe, expect, it } from 'vitest'
import type { ExpectedNote } from '../../state/types'
import { scoreRhythm } from './rhythmScore'

/** One akshara at a comfortable first-kalam tempo. */
const AKSHARA = 0.5

function note(t0: number, durSec: number, over: Partial<ExpectedNote> = {}): ExpectedNote {
  return {
    semitone: 0,
    sthayi: 0,
    targetCents: 0,
    startAkshara: Math.round(t0 / AKSHARA),
    durAksharas: Math.round(durSec / AKSHARA),
    t0,
    t1: t0 + durSec,
    ...over,
  }
}

function phrase(count: number, aksharaSec = AKSHARA): ExpectedNote[] {
  return Array.from({ length: count }, (_, i) => note(i * aksharaSec, aksharaSec))
}

describe('scoreRhythm — how close counts as on time', () => {
  it('gives full credit forty milliseconds early', () => {
    const r = scoreRhythm([0.96], [note(1, AKSHARA)], {
      aksharaSec: AKSHARA,
      latencyOffsetMs: 0,
    })
    expect(r.rhythmAccuracy).toBeCloseTo(100, 6)
    expect(r.matched).toHaveLength(1)
    expect(r.matched[0].errorMs).toBeCloseTo(-40, 6)
    expect(r.missed).toEqual([])
  })

  it('gives nothing three hundred milliseconds late', () => {
    // A slower akshara, so the onset is still inside the matching window and
    // the zero comes from the timing ramp rather than from being unmatched.
    const r = scoreRhythm([1.3], [note(1, 0.7)], { aksharaSec: 0.7, latencyOffsetMs: 0 })
    expect(r.matched).toHaveLength(1)
    expect(r.matched[0].errorMs).toBeCloseTo(300, 6)
    expect(r.rhythmAccuracy).toBeCloseTo(0, 6)
  })

  it('falls off linearly between the two', () => {
    // Halfway along the ramp: 80 ms of full credit, zero at 175 ms.
    const r = scoreRhythm([1.1275], [note(1, AKSHARA)], {
      aksharaSec: AKSHARA,
      latencyOffsetMs: 0,
    })
    expect(r.rhythmAccuracy).toBeCloseTo(50, 4)
  })

  it('records an onset further than half an akshara away as missed', () => {
    const r = scoreRhythm([1.4], [note(1, AKSHARA)], {
      aksharaSec: AKSHARA,
      latencyOffsetMs: 0,
    })
    expect(r.matched).toEqual([])
    expect(r.missed).toEqual([0])
    expect(r.rhythmAccuracy).toBe(0)
  })
})

describe('scoreRhythm — latency', () => {
  const timeline = phrase(4)
  const onsets = [0.1, 0.6, 1.1, 1.6]

  it('subtracts the measured round trip before judging anything', () => {
    const r = scoreRhythm(onsets, timeline, { aksharaSec: AKSHARA, latencyOffsetMs: 100 })
    expect(r.rhythmAccuracy).toBeCloseTo(100, 6)
    expect(r.tendencyMs).toBeCloseTo(0, 6)
    expect(r.matched[0].onsetTime).toBeCloseTo(0, 6)
  })

  it('reads the same take as dragging when the offset is not applied', () => {
    const r = scoreRhythm(onsets, timeline, { aksharaSec: AKSHARA, latencyOffsetMs: 0 })
    expect(r.rhythmAccuracy).toBeLessThan(100)
    expect(r.tendencyMs).toBeCloseTo(100, 6)
  })
})

describe('scoreRhythm — tendency', () => {
  it('reports dragging as a positive number', () => {
    const timeline = phrase(4)
    const late = timeline.map((n) => n.t0 + 0.09)
    const r = scoreRhythm(late, timeline, { aksharaSec: AKSHARA, latencyOffsetMs: 0 })
    expect(r.tendencyMs).toBeGreaterThan(0)
    expect(r.tendencyMs).toBeCloseTo(90, 6)
  })

  it('reports rushing as a negative number', () => {
    const timeline = phrase(4)
    const early = timeline.map((n) => n.t0 - 0.09)
    const r = scoreRhythm(early, timeline, { aksharaSec: AKSHARA, latencyOffsetMs: 0 })
    expect(r.tendencyMs).toBeCloseTo(-90, 6)
  })

  it('reports no tendency when nothing matched', () => {
    const r = scoreRhythm([], phrase(2), { aksharaSec: AKSHARA, latencyOffsetMs: 0 })
    expect(r.tendencyMs).toBe(0)
    expect(r.missed).toEqual([0, 1])
    expect(r.rhythmAccuracy).toBe(0)
  })
})

describe('scoreRhythm — matching', () => {
  it('takes the nearest onset and does not reuse it', () => {
    const timeline = phrase(2)
    const r = scoreRhythm([0.02, 0.52], timeline, {
      aksharaSec: AKSHARA,
      latencyOffsetMs: 0,
    })
    expect(r.matched.map((m) => m.noteIndex)).toEqual([0, 1])
    expect(r.matched[0].onsetTime).toBeCloseTo(0.02, 6)
    expect(r.matched[1].onsetTime).toBeCloseTo(0.52, 6)
  })

  it('leaves a later note unmatched when one onset was sung for two', () => {
    const timeline = phrase(2)
    const r = scoreRhythm([0.02], timeline, { aksharaSec: AKSHARA, latencyOffsetMs: 0 })
    expect(r.matched).toHaveLength(1)
    expect(r.missed).toEqual([1])
    expect(r.rhythmAccuracy).toBeCloseTo(50, 6)
  })

  it('does not expect an onset on a rest', () => {
    const timeline = [note(0, AKSHARA), note(0.5, AKSHARA, { rest: true }), note(1, AKSHARA)]
    const r = scoreRhythm([0, 1], timeline, { aksharaSec: AKSHARA, latencyOffsetMs: 0 })
    expect(r.matched.map((m) => m.noteIndex)).toEqual([0, 2])
    expect(r.missed).toEqual([])
    expect(r.rhythmAccuracy).toBeCloseTo(100, 6)
  })

  it('returns zero for a timeline with nothing to sing', () => {
    const r = scoreRhythm([0.1], [note(0, AKSHARA, { rest: true })], {
      aksharaSec: AKSHARA,
      latencyOffsetMs: 0,
    })
    expect(r.rhythmAccuracy).toBe(0)
    expect(r.matched).toEqual([])
    expect(r.missed).toEqual([])
  })
})
