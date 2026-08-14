import { describe, expect, it } from 'vitest'
import { hzForCents } from '../swara'
import type { PitchFrame } from '../types'
import { detectOnsets } from './onsets'

const SA = 138.591
const HOP_MS = 10
const SILENT_DB = -60
const SUNG_DB = -22

interface Segment {
  durMs: number
  /** Null for an unvoiced segment. */
  cents: number | null
  rms?: number
}

/** Splice segments into one trace at a fixed hop, times in whole milliseconds. */
function build(segments: Segment[]): PitchFrame[] {
  const frames: PitchFrame[] = []
  let ms = 0
  for (const seg of segments) {
    const count = Math.round(seg.durMs / HOP_MS)
    for (let i = 0; i < count; i++) {
      frames.push({
        t: ms / 1000,
        hz: seg.cents === null ? null : hzForCents(seg.cents, SA),
        cents: seg.cents,
        clarity: seg.cents === null ? 0.2 : 0.97,
        rms: seg.rms ?? (seg.cents === null ? SILENT_DB : SUNG_DB),
      })
      ms += HOP_MS
    }
  }
  return frames
}

describe('detectOnsets — the voice coming in', () => {
  it('finds the start of a note after silence', () => {
    const onsets = detectOnsets(
      build([
        { durMs: 200, cents: null },
        { durMs: 400, cents: 0 },
      ]),
    )
    expect(onsets).toHaveLength(1)
    expect(onsets[0]).toBeCloseTo(0.2, 6)
  })

  it('finds the start of a trace that is already voiced', () => {
    const onsets = detectOnsets(build([{ durMs: 400, cents: 0 }]))
    expect(onsets).toHaveLength(1)
    expect(onsets[0]).toBeCloseTo(0, 6)
  })

  it('ignores a voiced blip too short to be a note', () => {
    const onsets = detectOnsets(
      build([
        { durMs: 200, cents: null },
        { durMs: 30, cents: 0 },
        { durMs: 200, cents: null },
      ]),
    )
    expect(onsets).toEqual([])
  })

  it('finds a second note after a breath', () => {
    const onsets = detectOnsets(
      build([
        { durMs: 300, cents: 0 },
        { durMs: 120, cents: null },
        { durMs: 300, cents: 0 },
      ]),
    )
    expect(onsets).toHaveLength(2)
    expect(onsets[1]).toBeCloseTo(0.42, 6)
  })
})

describe('detectOnsets — the pitch moving', () => {
  it('finds a change of swara inside one continuous phrase', () => {
    const onsets = detectOnsets(
      build([
        { durMs: 300, cents: 0 },
        { durMs: 300, cents: 200 },
      ]),
    )
    expect(onsets).toHaveLength(2)
    expect(onsets[0]).toBeCloseTo(0, 6)
    expect(onsets[1]).toBeCloseTo(0.3, 6)
  })

  it('does not fire on a single frame of detector noise', () => {
    const noisy = build([{ durMs: 400, cents: 0 }])
    noisy[20] = { ...noisy[20], cents: 1200, hz: hzForCents(1200, SA) }
    expect(detectOnsets(noisy)).toHaveLength(1)
  })

  it('does not fire on a wobble that stays inside one semitone', () => {
    const onsets = detectOnsets(
      build([
        { durMs: 300, cents: -40 },
        { durMs: 300, cents: 40 },
      ]),
    )
    expect(onsets).toHaveLength(1)
  })
})

describe('detectOnsets — janta re-articulation', () => {
  it('finds a note struck twice on the same pitch', () => {
    const onsets = detectOnsets(
      build([
        { durMs: 300, cents: 0, rms: SUNG_DB },
        { durMs: 40, cents: 0, rms: -40 },
        { durMs: 300, cents: 0, rms: SUNG_DB },
      ]),
    )
    expect(onsets).toHaveLength(2)
    expect(onsets[0]).toBeCloseTo(0, 6)
    expect(onsets[1]).toBeCloseTo(0.34, 6)
  })

  it('leaves an ordinary swell alone', () => {
    const onsets = detectOnsets(
      build([
        { durMs: 300, cents: 0, rms: -30 },
        { durMs: 300, cents: 0, rms: -26 },
      ]),
    )
    expect(onsets).toHaveLength(1)
  })

  it('honours a raised drop threshold', () => {
    const janta = build([
      { durMs: 300, cents: 0, rms: SUNG_DB },
      { durMs: 40, cents: 0, rms: -40 },
      { durMs: 300, cents: 0, rms: SUNG_DB },
    ])
    expect(detectOnsets(janta, { rmsDropDb: 20 })).toHaveLength(1)
  })
})

describe('detectOnsets — merging', () => {
  it('reports one onset when two detectors see the same attack', () => {
    // The voice enters and settles on its swara thirty milliseconds later.
    const onsets = detectOnsets(
      build([
        { durMs: 200, cents: null },
        { durMs: 30, cents: 0 },
        { durMs: 300, cents: 200 },
      ]),
    )
    expect(onsets).toHaveLength(1)
    expect(onsets[0]).toBeCloseTo(0.2, 6)
  })

  it('keeps both when the gap is widened past them', () => {
    const trace = build([
      { durMs: 200, cents: null },
      { durMs: 30, cents: 0 },
      { durMs: 300, cents: 200 },
    ])
    expect(detectOnsets(trace, { minGapMs: 20 })).toHaveLength(2)
  })

  it('returns nothing for an empty trace', () => {
    expect(detectOnsets([])).toEqual([])
  })
})
