import { describe, expect, it } from 'vitest'
import {
  computeRms,
  MedianPitchFilter,
  rmsToDb,
  toFrame,
  type RawDetection,
} from './pitchFilter'

const SA = 138.591

function det(over: Partial<RawDetection> = {}): RawDetection {
  return { t: 0, hz: SA, clarity: 0.97, rms: 0.05, ...over }
}

describe('level helpers', () => {
  it('measures RMS of a known signal', () => {
    const dc = new Float32Array(64).fill(0.5)
    expect(computeRms(dc)).toBeCloseTo(0.5, 6)
    expect(computeRms(new Float32Array(64))).toBe(0)
  })

  it('converts RMS to dBFS without dividing by zero', () => {
    expect(rmsToDb(1)).toBeCloseTo(0, 6)
    expect(rmsToDb(0.1)).toBeCloseTo(-20, 6)
    expect(Number.isFinite(rmsToDb(0))).toBe(true)
  })
})

describe('MedianPitchFilter', () => {
  it('passes a steady pitch through untouched', () => {
    const f = new MedianPitchFilter()
    expect(f.push(200)).toBe(200)
    expect(f.push(200)).toBe(200)
    expect(f.push(200)).toBe(200)
  })

  it('rejects a single-frame octave jump', () => {
    const f = new MedianPitchFilter()
    f.push(200)
    f.push(200)
    // One frame reports the octave above; the median holds the real pitch.
    expect(f.push(400)).toBe(200)
    expect(f.push(200)).toBe(200)
  })

  it('follows a genuine change rather than fighting it', () => {
    const f = new MedianPitchFilter()
    f.push(200)
    f.push(200)
    f.push(300) // median of [200,200,300]
    f.push(300) // median of [200,300,300]
    expect(f.push(300)).toBe(300)
  })

  it('starts clean after a reset', () => {
    const f = new MedianPitchFilter()
    f.push(200)
    f.push(200)
    f.reset()
    expect(f.push(440)).toBe(440)
  })
})

describe('toFrame', () => {
  it('reports a clear loud detection as voiced, in cents above Sa', () => {
    const f = toFrame(det({ hz: SA * 2 }), SA, new MedianPitchFilter())
    expect(f.hz).toBeCloseTo(SA * 2, 3)
    expect(f.cents).toBeCloseTo(1200, 3)
  })

  it('treats a low-clarity detection as unvoiced', () => {
    const f = toFrame(det({ clarity: 0.5 }), SA, new MedianPitchFilter())
    expect(f.hz).toBeNull()
    expect(f.cents).toBeNull()
  })

  it('treats a quiet room as unvoiced even when clarity looks high', () => {
    const f = toFrame(det({ rms: 0.0005 }), SA, new MedianPitchFilter())
    expect(f.hz).toBeNull()
  })

  it('keeps the timestamp on unvoiced frames so gaps stay measurable', () => {
    const f = toFrame(det({ t: 4.25, clarity: 0.1 }), SA, new MedianPitchFilter())
    expect(f.t).toBe(4.25)
    expect(f.hz).toBeNull()
  })

  it('clears the median history when the voice stops', () => {
    const filter = new MedianPitchFilter()
    toFrame(det({ hz: 200 }), SA, filter)
    toFrame(det({ hz: 200 }), SA, filter)
    toFrame(det({ clarity: 0 }), SA, filter) // breath
    // The next note starts fresh instead of being dragged toward the old one.
    const after = toFrame(det({ hz: 300 }), SA, filter)
    expect(after.hz).toBeCloseTo(300, 6)
  })

  it('rejects a nonsense frequency', () => {
    expect(toFrame(det({ hz: 0 }), SA, new MedianPitchFilter()).hz).toBeNull()
    expect(toFrame(det({ hz: NaN }), SA, new MedianPitchFilter()).hz).toBeNull()
  })

  it('honours a relaxed gate for quiet singers', () => {
    const f = toFrame(det({ clarity: 0.75 }), SA, new MedianPitchFilter(), {
      clarityGate: 0.7,
    })
    expect(f.hz).not.toBeNull()
  })
})
