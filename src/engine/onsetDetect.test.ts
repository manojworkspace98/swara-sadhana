import { describe, expect, it } from 'vitest'
import { findRmsSpikes, type RmsFrame } from './onsetDetect'

const HOP = 512 / 48_000 // the microphone's frame interval, about 10.7 ms

/** A quiet room with bursts of `burstFrames` frames starting at each time. */
function room(
  seconds: number,
  burstTimes: readonly number[],
  opts: { floorDb?: number; burstDb?: number; burstFrames?: number } = {},
): RmsFrame[] {
  const floorDb = opts.floorDb ?? -62
  const burstDb = opts.burstDb ?? -18
  const burstFrames = opts.burstFrames ?? 3
  const frames: RmsFrame[] = []
  const count = Math.round(seconds / HOP)
  for (let i = 0; i < count; i++) {
    const t = i * HOP
    const inBurst = burstTimes.some((b) => t >= b && t < b + burstFrames * HOP)
    // A hair of dither, so nothing depends on frames being bit-identical.
    frames.push({ t, rms: (inBurst ? burstDb : floorDb) + (i % 3) * 0.4 })
  }
  return frames
}

describe('findRmsSpikes', () => {
  it('finds one time per burst', () => {
    const times = [0.5, 1.05, 1.6, 2.15, 2.7]
    const spikes = findRmsSpikes(room(3.2, times))
    expect(spikes).toHaveLength(times.length)
    for (let i = 0; i < times.length; i++) {
      expect(spikes[i]).toBeGreaterThanOrEqual(times[i])
      expect(spikes[i] - times[i]).toBeLessThan(HOP)
    }
  })

  it('reports the leading edge rather than the peak', () => {
    const frames = room(1, [0.4], { burstFrames: 6 })
    // Make the burst climb, so a peak-picker would land four frames late.
    for (const f of frames) {
      if (f.t >= 0.4 && f.t < 0.4 + 6 * HOP) f.rms = -30 + (f.t - 0.4) * 400
    }
    const [spike] = findRmsSpikes(frames)
    expect(spike - 0.4).toBeLessThan(HOP)
  })

  it('counts one long burst once', () => {
    expect(findRmsSpikes(room(2, [0.6], { burstFrames: 40 }))).toHaveLength(1)
  })

  it('merges two hits closer together than the gap', () => {
    const close = room(2, [0.6, 0.64], { burstFrames: 2 })
    expect(findRmsSpikes(close, { minGapSec: 0.12 })).toHaveLength(1)
    expect(findRmsSpikes(close, { minGapSec: 0.02 })).toHaveLength(2)
  })

  it('finds nothing in a silent room', () => {
    expect(findRmsSpikes(room(3, []))).toEqual([])
  })

  it('finds nothing in a room that is uniformly loud', () => {
    // A held note is not an onset: the threshold is relative to the floor.
    expect(findRmsSpikes(room(3, [], { floorDb: -14 }))).toEqual([])
  })

  it('ignores a burst that clears the relative rise but not the absolute floor', () => {
    const veryQuiet = room(2, [0.5], { floorDb: -95, burstDb: -70 })
    expect(findRmsSpikes(veryQuiet)).toEqual([])
    expect(findRmsSpikes(veryQuiet, { minDb: -90 })).toHaveLength(1)
  })

  it('respects a raised rise threshold', () => {
    const soft = room(2, [0.5], { floorDb: -60, burstDb: -44 })
    expect(findRmsSpikes(soft)).toHaveLength(1)
    expect(findRmsSpikes(soft, { riseDb: 25 })).toEqual([])
  })

  it('survives short, empty and malformed input', () => {
    expect(findRmsSpikes([])).toEqual([])
    expect(findRmsSpikes([{ t: 0, rms: -10 }, { t: 0.01, rms: -10 }])).toEqual([])
    const dirty = room(2, [0.5]).map((f, i) =>
      i === 4 ? { t: Number.NaN, rms: Number.NaN } : f,
    )
    expect(findRmsSpikes(dirty)).toHaveLength(1)
  })

  it('sorts frames that arrive out of order', () => {
    const shuffled = [...room(2, [0.5, 1.2])].reverse()
    const spikes = findRmsSpikes(shuffled)
    expect(spikes).toHaveLength(2)
    expect(spikes[0]).toBeLessThan(spikes[1])
  })
})
