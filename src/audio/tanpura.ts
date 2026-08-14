import { getAudioContext, resumeAudio } from './audioContext'
import { holdAt } from './swaraSynth'
import { pluck } from '../engine/karplusStrong'

/**
 * The tanpura drone.
 *
 * A whole four-pluck cycle is synthesised once into an AudioBuffer and then
 * looped, so a twenty-minute practice session costs one render and nothing
 * after it. Rendering rather than looping a recording keeps the drone exactly
 * in tune with whatever sruti the learner picked, which a sampled drone can
 * never be.
 */

/** Which note the first string is tuned to. */
export type TanpuraFifth = 'pa' | 'ma'

export interface TanpuraOptions {
  fifth?: TanpuraFifth
}

const SPACING_SEC = 1.3
const STRING_COUNT = 4
const LOOP_SEC = SPACING_SEC * STRING_COUNT
/** Two whole cycles of ring-out are folded back into the loop; what is left
 *  after that sits below −50 dB and is inaudible under the next pluck. */
const TAIL_CYCLES = 2
const CROSSFADE_SEC = 0.04
const PEAK_TARGET = 0.85

const FADE_IN_SEC = 0.9
const FADE_OUT_SEC = 0.5
const SWAP_SEC = 0.18
const VOLUME_RAMP_SEC = 0.08

/**
 * Pa–Sa–Sa–Ṣa, the standard tuning. The first string is the fifth *below*
 * madhya Sa; in the Ma tuning, for a raga that never touches Pa, it drops to
 * the Ma below Sa rather than rising above it, so the drone still sits under
 * the singer instead of crossing into the phrase.
 */
const PA_RATIO = Math.pow(2, -5 / 12)
const MA_RATIO = Math.pow(2, -7 / 12)

interface StringPlan {
  hz: number
  /** Seconds into the cycle. */
  at: number
  gain: number
  damping: number
}

/**
 * The offsets are deliberately uneven by a few milliseconds. Four plucks are a
 * hand, not a clock, and a metronomic drone is the one thing that gives a
 * synthesised tanpura away. The cycle length stays exact, which is what the
 * seamless loop depends on.
 */
function stringPlan(saHz: number, fifth: TanpuraFifth): StringPlan[] {
  const first = saHz * (fifth === 'ma' ? MA_RATIO : PA_RATIO)
  return [
    { hz: first, at: 0, gain: 0.5, damping: 0.9962 },
    { hz: saHz, at: SPACING_SEC + 0.012, gain: 0.46, damping: 0.9958 },
    { hz: saHz, at: 2 * SPACING_SEC - 0.009, gain: 0.46, damping: 0.9958 },
    { hz: saHz / 2, at: 3 * SPACING_SEC + 0.006, gain: 0.62, damping: 0.9968 },
  ]
}

export class Tanpura {
  private ctx: AudioContext | null = null
  private buffer: AudioBuffer | null = null
  private source: AudioBufferSourceNode | null = null
  private gain: GainNode | null = null
  private volume = 0.5
  private saHz = 0
  private fifth: TanpuraFifth = 'pa'
  private isPlaying = false
  /** Guards against an older render landing after a newer one. */
  private buildId = 0

  get playing(): boolean {
    return this.isPlaying
  }

  /** Render the loop. Cheap to call again with the same arguments. */
  async prepare(saHz: number, opts: TanpuraOptions = {}): Promise<void> {
    const fifth = opts.fifth ?? 'pa'
    if (!Number.isFinite(saHz) || saHz <= 0) {
      throw new RangeError('The tanpura needs a positive tonic frequency.')
    }
    if (this.buffer && this.saHz === saHz && this.fifth === fifth) return

    const ctx = getAudioContext()
    const id = ++this.buildId
    const buffer = await renderLoop(ctx, saHz, fifth)
    if (id !== this.buildId) return

    this.ctx = ctx
    this.buffer = buffer
    this.saHz = saHz
    this.fifth = fifth
    if (this.isPlaying) this.swapSource()
  }

  /** No-op until `prepare` has resolved; there is nothing to play before then. */
  start(volume: number): void {
    this.volume = clampVolume(volume)
    if (this.isPlaying) {
      this.setVolume(this.volume)
      return
    }
    if (!this.buffer || !this.ctx) return
    this.isPlaying = true
    void resumeAudio()
    this.spin(FADE_IN_SEC)
  }

  stop(): void {
    if (!this.isPlaying) return
    this.isPlaying = false
    this.retire(this.source, this.gain, FADE_OUT_SEC)
    this.source = null
    this.gain = null
  }

  setVolume(v: number): void {
    this.volume = clampVolume(v)
    const ctx = this.ctx
    if (!this.gain || !ctx) return
    const t = ctx.currentTime
    holdAt(this.gain.gain, t)
    this.gain.gain.linearRampToValueAtTime(this.volume, t + VOLUME_RAMP_SEC)
  }

  private spin(fadeSec: number): void {
    const ctx = this.ctx
    const buffer = this.buffer
    if (!ctx || !buffer) return
    const t = ctx.currentTime
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(this.volume, t + fadeSec)
    source.connect(gain).connect(ctx.destination)
    source.start()
    this.source = source
    this.gain = gain
  }

  /** Re-tuned mid-drone: fade the old loop out under the new one. */
  private swapSource(): void {
    this.retire(this.source, this.gain, SWAP_SEC)
    this.source = null
    this.gain = null
    this.spin(SWAP_SEC)
  }

  private retire(source: AudioBufferSourceNode | null, gain: GainNode | null, fadeSec: number): void {
    const ctx = this.ctx
    if (!source || !gain || !ctx) return
    const t = ctx.currentTime
    holdAt(gain.gain, t)
    gain.gain.linearRampToValueAtTime(0, t + fadeSec)
    source.stop(t + fadeSec + 0.02)
    source.onended = () => {
      source.disconnect()
      gain.disconnect()
    }
  }
}

function clampVolume(v: number): number {
  if (!Number.isFinite(v)) return 0
  return Math.min(Math.max(v, 0), 1)
}

/**
 * Synthesise one cycle: four strings into a flat buffer, the jvari on top, and
 * a seam that cannot be heard.
 */
async function renderLoop(
  ctx: BaseAudioContext,
  saHz: number,
  fifth: TanpuraFifth,
): Promise<AudioBuffer> {
  const sr = ctx.sampleRate
  const loopLen = Math.round(LOOP_SEC * sr)
  const xfade = Math.round(CROSSFADE_SEC * sr)

  const dry = new Float32Array(loopLen * (1 + TAIL_CYCLES))
  for (const s of stringPlan(saHz, fifth)) {
    pluck(dry, Math.round(s.at * sr), s.hz, sr, s.damping, s.gain)
  }

  // Fold the ring-out back to the front. A string still sounding at the end of
  // the cycle is a string sounding over the beginning of the next repeat, so
  // adding the overhang in is not an approximation of looping — it is exactly
  // what looping does. Reads stay above loopLen and writes stay below it, so
  // the buffer can be folded in place.
  for (let i = loopLen; i < dry.length; i++) dry[i % loopLen] += dry[i]

  const normal = normaliser(dry, loopLen, PEAK_TARGET)

  // Two copies plus the crossfade: by the second copy the comb filter has
  // settled, so its state at the start of the extracted cycle matches its
  // state at the end. One copy would leave a filter-warm-up bump at the seam.
  const renderLen = loopLen * 2 + xfade
  const offline = new OfflineAudioContext(1, renderLen, sr)
  const srcBuffer = offline.createBuffer(1, renderLen, sr)
  const srcData = srcBuffer.getChannelData(0)
  for (let i = 0; i < renderLen; i++) srcData[i] = dry[i % loopLen] * normal

  const source = offline.createBufferSource()
  source.buffer = srcBuffer
  buildJvari(offline, source).connect(offline.destination)
  source.start()

  const rendered = await offline.startRendering()
  return extractLoop(ctx, rendered.getChannelData(0), loopLen, xfade, sr)
}

/**
 * The jvari — the buzz a tanpura's bridge makes as the string grazes it.
 *
 * A real jvari is the string touching a curved bridge thousands of times a
 * second, which is beyond a plucked-string model. Two cheap things stand in
 * for it: a shelf that lifts the upper partials the model damps away, and a
 * short comb whose delay drifts, which is what makes the harmonics swim in and
 * out instead of sitting still. The LFO completes exactly one turn per cycle,
 * so the drift is periodic with the loop and survives being spliced.
 */
function buildJvari(ctx: BaseAudioContext, source: AudioNode): AudioNode {
  const shelf = ctx.createBiquadFilter()
  shelf.type = 'highshelf'
  shelf.frequency.value = 2200
  shelf.gain.value = 5.5

  const mix = ctx.createGain()
  mix.gain.value = 1

  const direct = ctx.createGain()
  direct.gain.value = 0.78

  const delay = ctx.createDelay(0.05)
  delay.delayTime.value = 0.007
  const feedback = ctx.createGain()
  feedback.gain.value = 0.2
  const shimmer = ctx.createGain()
  shimmer.gain.value = 0.22

  const lfo = ctx.createOscillator()
  lfo.type = 'sine'
  lfo.frequency.value = 1 / LOOP_SEC
  const lfoDepth = ctx.createGain()
  lfoDepth.gain.value = 0.0012

  source.connect(shelf)
  shelf.connect(direct).connect(mix)
  shelf.connect(delay)
  delay.connect(feedback).connect(delay)
  delay.connect(shimmer).connect(mix)
  lfo.connect(lfoDepth).connect(delay.delayTime)
  lfo.start()

  return mix
}

/**
 * Take the second cycle out of the render and crossfade its natural
 * continuation over the start.
 *
 * The samples the renderer produced past the second cycle are what the loop
 * would have sounded like had it kept going, so fading them into the loop's
 * first frames makes the seam continuous sample by sample.
 */
function extractLoop(
  ctx: BaseAudioContext,
  rendered: Float32Array,
  loopLen: number,
  xfade: number,
  sr: number,
): AudioBuffer {
  const loop = ctx.createBuffer(1, loopLen, sr)
  const out = loop.getChannelData(0)
  for (let i = 0; i < loopLen; i++) out[i] = rendered[loopLen + i]
  for (let j = 0; j < xfade; j++) {
    const w = j / xfade
    out[j] = rendered[loopLen * 2 + j] * (1 - w) + rendered[loopLen + j] * w
  }
  const normal = normaliser(out, loopLen, PEAK_TARGET)
  if (normal !== 1) {
    for (let i = 0; i < loopLen; i++) out[i] *= normal
  }
  return loop
}

/** Scale factor that brings the loudest sample to `target`, never louder. */
function normaliser(samples: Float32Array, length: number, target: number): number {
  let peak = 0
  for (let i = 0; i < length; i++) peak = Math.max(peak, Math.abs(samples[i]))
  return peak > target ? target / peak : 1
}
