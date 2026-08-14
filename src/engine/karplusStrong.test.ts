import { describe, expect, it } from 'vitest'
import { DEFAULT_DAMPING, pluck } from './karplusStrong'

const SR = 48_000

function render(freqHz: number, seconds: number, damping = 0.999, gain = 0.9): Float32Array {
  const out = new Float32Array(Math.round(SR * seconds))
  pluck(out, 0, freqHz, SR, damping, gain)
  return out
}

function rms(samples: Float32Array, from: number, to: number): number {
  let sum = 0
  for (let i = from; i < to; i++) sum += samples[i] * samples[i]
  return Math.sqrt(sum / (to - from))
}

/**
 * YIN-style pitch detection, used only to check what the string actually
 * sounds. Plain autocorrelation would happily lock onto twice the period —
 * the cumulative mean normalisation is what rules the octave error out.
 */
function detectHz(samples: Float32Array, offset: number, windowSize = 4096): number {
  const maxLag = Math.min(1200, windowSize - 1)
  const diff = new Float64Array(maxLag + 1)
  for (let lag = 1; lag <= maxLag; lag++) {
    let sum = 0
    for (let j = 0; j < windowSize; j++) {
      const d = samples[offset + j] - samples[offset + j + lag]
      sum += d * d
    }
    diff[lag] = sum
  }

  const norm = new Float64Array(maxLag + 1)
  norm[0] = 1
  let running = 0
  for (let lag = 1; lag <= maxLag; lag++) {
    running += diff[lag]
    norm[lag] = running === 0 ? 1 : (diff[lag] * lag) / running
  }

  for (let lag = 2; lag < maxLag; lag++) {
    if (norm[lag] < 0.15 && norm[lag] <= norm[lag - 1] && norm[lag] <= norm[lag + 1]) {
      return SR / lag
    }
  }
  let best = 1
  for (let lag = 2; lag <= maxLag; lag++) if (norm[lag] < norm[best]) best = lag
  return SR / best
}

describe('pluck', () => {
  it('produces a finite, bounded, audible signal', () => {
    const out = render(220, 1)
    for (let i = 0; i < out.length; i++) {
      expect(Number.isFinite(out[i])).toBe(true)
      expect(Math.abs(out[i])).toBeLessThanOrEqual(1)
    }
    expect(rms(out, 0, out.length)).toBeGreaterThan(1e-3)
  })

  it('sounds the pitch it was asked for', () => {
    for (const hz of [98, 138.591, 220, 440]) {
      const out = render(hz, 0.6)
      const detected = detectHz(out, 8_000)
      expect(Math.abs(detected - hz) / hz).toBeLessThan(0.03)
    }
  })

  it('decays, and decays more slowly the closer damping sits to one', () => {
    const short = render(220, 3, 0.99)
    const long = render(220, 3, 0.999)
    const late = 2.5 * SR

    expect(rms(short, late, late + 4096)).toBeLessThan(rms(short, 0, 4096))
    expect(rms(long, late, late + 4096)).toBeGreaterThan(rms(short, late, late + 4096))
  })

  it('holds a tanpura string audible for several seconds at the default damping', () => {
    const out = render(138.591, 6, DEFAULT_DAMPING)
    const at5s = rms(out, 5 * SR, 5 * SR + 4096)
    expect(at5s).toBeGreaterThan(1e-4)
    expect(at5s).toBeLessThan(rms(out, 0, 4096))
  })

  it('scales with gain and mixes into what is already there', () => {
    const soft = render(220, 0.5, 0.999, 0.25)
    const loud = render(220, 0.5, 0.999, 0.5)
    expect(rms(loud, 0, loud.length) / rms(soft, 0, soft.length)).toBeCloseTo(2, 1)

    const mixed = new Float32Array(soft.length)
    pluck(mixed, 0, 220, SR, 0.999, 0.25)
    pluck(mixed, 0, 220, SR, 0.999, 0.25)
    // The same string twice is the same waveform twice: exactly double.
    expect(rms(mixed, 0, mixed.length)).toBeCloseTo(rms(loud, 0, loud.length), 4)
  })

  it('is reproducible, so the rendered drone loop is the same every session', () => {
    const a = render(220, 0.2)
    const b = render(220, 0.2)
    expect(Array.from(a.slice(0, 512))).toEqual(Array.from(b.slice(0, 512)))
  })

  it('starts where it is told and leaves earlier samples alone', () => {
    const out = new Float32Array(SR)
    pluck(out, 12_000, 220, SR, 0.999, 0.8)
    expect(rms(out, 0, 12_000)).toBe(0)
    expect(rms(out, 12_000, out.length)).toBeGreaterThan(1e-3)
  })

  it('writes nothing for a nonsensical string', () => {
    const out = new Float32Array(1024)
    pluck(out, 0, 0, SR, 0.999, 0.8)
    pluck(out, 0, -220, SR, 0.999, 0.8)
    pluck(out, 0, Number.NaN, SR, 0.999, 0.8)
    pluck(out, 0, 220, SR, 0.999, 0)
    pluck(out, 2048, 220, SR, 0.999, 0.8)
    expect(rms(out, 0, out.length)).toBe(0)
  })
})
