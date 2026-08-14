/**
 * Karplus-Strong plucked string, written straight into a Float32Array.
 *
 * This lives in `engine/` rather than `audio/` because the tanpura is rendered
 * once, offline, as a single JS pass: there is no node graph until the buzz is
 * added on top of the finished samples. Being pure also makes the string
 * testable — a synthesised pluck either has the period it was asked for or it
 * does not.
 */

/**
 * Loop gain, applied once per trip around the delay line rather than once per
 * sample: y[n] refers back to y[n-N], so the string loses this fraction every
 * period, not every sample. At 140 Hz that makes 0.996 a decay of roughly ten
 * seconds — a tanpura string — not the 30 ms tick the number suggests.
 */
export const DEFAULT_DAMPING = 0.996

/** Below −80 dB the string is inaudible under its own successors. */
const SILENCE = 1e-4

/**
 * Mix one plucked string into `out`, starting at `startIdx`.
 *
 * Adds rather than overwrites, so overlapping tails sum the way four strings
 * ringing together do. Headroom is the caller's problem.
 */
export function pluck(
  out: Float32Array,
  startIdx: number,
  freqHz: number,
  sampleRate: number,
  damping: number,
  gain: number,
): void {
  if (!Number.isFinite(freqHz) || freqHz <= 0) return
  if (!Number.isFinite(sampleRate) || sampleRate <= 0) return
  if (!Number.isFinite(gain) || gain === 0) return
  const start = Math.max(0, Math.round(startIdx))
  if (start >= out.length) return

  // The two-point average in the loop delays by half a sample, so the string
  // sounds at sampleRate / (N + 0.5). Solving for N against that, rather than
  // against N alone, keeps the tuning inside a fifth of a cent.
  const n = Math.max(2, Math.round(sampleRate / freqHz - 0.5))
  const m = n + 1
  const rho = Math.min(Math.max(damping, 0.5), 0.99999)

  const line = excite(m, seedFor(start, n))

  const trips = Math.log(SILENCE) / Math.log(rho)
  const wanted = Math.ceil(trips * n) + m
  const total = Math.min(out.length - start, wanted)

  const head = Math.min(m, total)
  for (let k = 0; k < head; k++) out[start + k] += line[k] * gain

  // line[j % m] holds y[j]. y[k-n-1] is at k % m — the slot about to be
  // retired — and y[k-n] is the one after it.
  for (let k = m; k < total; k++) {
    const older = k % m
    const newer = (k + 1) % m
    const y = rho * 0.5 * (line[newer] + line[older])
    line[older] = y
    out[start + k] += y * gain
  }
}

/**
 * The initial burst: white noise, de-meaned and softened.
 *
 * The loop filter passes DC at nearly unity, so any offset left in the burst
 * sits under the note as a slow thump. The one-pole afterwards is the finger:
 * a bronze string plucked with flesh is far darker than white noise, and the
 * raw burst reads as a click rather than an attack.
 */
function excite(length: number, seed: number): Float32Array {
  const rand = mulberry32(seed)
  const buf = new Float32Array(length)
  let sum = 0
  for (let i = 0; i < length; i++) {
    buf[i] = rand() * 2 - 1
    sum += buf[i]
  }
  const mean = sum / length
  let lp = 0
  let peak = 0
  for (let i = 0; i < length; i++) {
    lp += 0.5 * (buf[i] - mean - lp)
    buf[i] = lp
    peak = Math.max(peak, Math.abs(lp))
  }
  if (peak > 0) {
    for (let i = 0; i < length; i++) buf[i] /= peak
  }
  return buf
}

/**
 * A seeded generator rather than Math.random: the drone is rendered once into
 * a loop the learner hears for twenty minutes, so it should be the same loop
 * every session — and a reproducible burst is one a test can assert on.
 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function seedFor(startIdx: number, n: number): number {
  return (Math.imul(startIdx + 1, 2654435761) ^ Math.imul(n + 1, 40503)) >>> 0
}
