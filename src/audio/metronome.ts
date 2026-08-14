/**
 * The tala clock.
 *
 * Every click is scheduled ahead of time against the AudioContext clock, from
 * a plain interval timer that only ever looks a tenth of a second forward. A
 * click fired from a frame callback or a bare timeout inherits every hitch the
 * main thread has; scheduled this way the clicks land on the sample the audio
 * hardware asks for, whatever the page is doing.
 */

/**
 * The shape of a tala this needs, kept structural on purpose: the tala content
 * itself lives in `src/content/talas.ts`, and the clock should not care which
 * tala it is counting.
 */
export interface TalaShape {
  aksharaCount: number
  /** Indices that begin an anga — laghu, drutam, anudrutam. */
  angaStartIndices: readonly number[]
}

export interface AksharaEvent {
  /** Position within the avartana, 0-based; 0 is sam. */
  aksharaIndex: number
  /** How many complete cycles have gone by since `start`. */
  avartana: number
  isSam: boolean
  /** True on sam too, which does begin an anga. */
  isAngaStart: boolean
  /** The audio-clock moment the click sounds, so the UI can align to it. */
  atTime: number
}

export interface MetronomeOptions {
  tala: TalaShape
  /** Beats per minute counted in aksharas, not in avartanas. */
  aksharaBpm: number
  onAkshara: (e: AksharaEvent) => void
  /** Audio-clock start. Defaults to a beat's grace from now. */
  startAt?: number
}

export type ClickWeight = 'sam' | 'anga' | 'akshara'

const LOOKAHEAD_MS = 25
const SCHEDULE_AHEAD_SEC = 0.1
const START_GRACE_SEC = 0.12

interface ClickVoice {
  hz: number
  q: number
  gain: number
  decaySec: number
}

/** Three weights, told apart by brightness as much as by loudness — a sam that
 *  is merely louder gets lost the moment the singer is loud too. */
const VOICES: Record<ClickWeight, ClickVoice> = {
  sam: { hz: 2400, q: 1.1, gain: 0.9, decaySec: 0.055 },
  anga: { hz: 1500, q: 1.4, gain: 0.5, decaySec: 0.045 },
  akshara: { hz: 950, q: 1.7, gain: 0.28, decaySec: 0.035 },
}

const NOISE_SEC = 0.12
const noiseCache = new WeakMap<BaseAudioContext, AudioBuffer>()

/** One noise buffer per context: the clicks differ by filter, not by source. */
function noiseBuffer(ctx: BaseAudioContext): AudioBuffer {
  const cached = noiseCache.get(ctx)
  if (cached) return cached
  const length = Math.ceil(ctx.sampleRate * NOISE_SEC)
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1
  noiseCache.set(ctx, buffer)
  return buffer
}

/**
 * Schedule one click. Returns the source so a caller can cut it short.
 * Shared with latency calibration, which measures this exact sound.
 */
export function playClick(
  ctx: BaseAudioContext,
  destination: AudioNode,
  atTime: number,
  weight: ClickWeight = 'akshara',
  volume = 1,
): AudioBufferSourceNode {
  const voice = VOICES[weight]
  const t = Math.max(atTime, ctx.currentTime)
  const peak = Math.max(voice.gain * Math.min(Math.max(volume, 0), 1), 0.0002)

  const source = ctx.createBufferSource()
  source.buffer = noiseBuffer(ctx)

  const band = ctx.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.value = voice.hz
  band.Q.value = voice.q

  const env = ctx.createGain()
  env.gain.setValueAtTime(0.0001, t)
  env.gain.exponentialRampToValueAtTime(peak, t + 0.001)
  env.gain.exponentialRampToValueAtTime(0.0001, t + voice.decaySec)
  env.gain.setValueAtTime(0, t + voice.decaySec)

  source.connect(band).connect(env).connect(destination)
  source.start(t)
  source.stop(t + voice.decaySec + 0.01)
  source.onended = () => {
    source.disconnect()
    band.disconnect()
    env.disconnect()
  }
  return source
}

export class Metronome {
  private ctx: AudioContext
  private destination: AudioNode
  private timer: ReturnType<typeof setInterval> | null = null
  private opts: MetronomeOptions | null = null
  private secPerAkshara = 0.5
  private startTime = 0
  private nextTime = 0
  private nextIndex = 0
  private avartana = 0
  private volume = 1
  private live = new Set<AudioBufferSourceNode>()

  constructor(ctx: AudioContext, destination: AudioNode) {
    this.ctx = ctx
    this.destination = destination
  }

  get running(): boolean {
    return this.timer !== null
  }

  start(opts: MetronomeOptions): void {
    if (!Number.isFinite(opts.aksharaBpm) || opts.aksharaBpm <= 0) {
      throw new RangeError('The akshara tempo must be a positive number of beats per minute.')
    }
    if (!Number.isInteger(opts.tala.aksharaCount) || opts.tala.aksharaCount < 1) {
      throw new RangeError('A tala must have at least one akshara.')
    }
    this.stop()

    this.opts = opts
    this.secPerAkshara = 60 / opts.aksharaBpm
    this.startTime = Math.max(
      opts.startAt ?? this.ctx.currentTime + START_GRACE_SEC,
      this.ctx.currentTime,
    )
    this.nextTime = this.startTime
    this.nextIndex = 0
    this.avartana = 0

    // Fill the first window now rather than waiting 25 ms for the first tick,
    // which would otherwise be enough to miss a sam at a fast tempo.
    this.tick()
    this.timer = setInterval(() => this.tick(), LOOKAHEAD_MS)
  }

  stop(): void {
    if (this.timer !== null) {
      clearInterval(this.timer)
      this.timer = null
    }
    this.opts = null
    // Clicks already scheduled inside the lookahead window would otherwise
    // keep sounding after the learner pressed stop.
    for (const source of this.live) {
      try {
        source.stop()
      } catch {
        // Already finished; nothing to cut short.
      }
    }
    this.live.clear()
  }

  setVolume(v: number): void {
    this.volume = Number.isFinite(v) ? Math.min(Math.max(v, 0), 1) : 0
  }

  /** Which akshara of the avartana is sounding right now, or −1 when stopped
   *  or still inside the count-in. */
  nowAkshara(): number {
    const opts = this.opts
    if (!opts || this.timer === null) return -1
    const elapsed = this.ctx.currentTime - this.startTime
    if (elapsed < 0) return -1
    return Math.floor(elapsed / this.secPerAkshara) % opts.tala.aksharaCount
  }

  private tick(): void {
    const opts = this.opts
    if (!opts) return
    const horizon = this.ctx.currentTime + SCHEDULE_AHEAD_SEC

    while (this.nextTime < horizon) {
      const aksharaIndex = this.nextIndex
      const avartana = this.avartana
      const atTime = this.nextTime
      const isSam = aksharaIndex === 0
      const isAngaStart = isSam || opts.tala.angaStartIndices.includes(aksharaIndex)

      // Advance before anything else runs: a listener that throws must not be
      // able to wedge the clock or double-schedule a beat.
      this.nextTime += this.secPerAkshara
      this.nextIndex = aksharaIndex + 1
      if (this.nextIndex >= opts.tala.aksharaCount) {
        this.nextIndex = 0
        this.avartana += 1
      }

      const weight: ClickWeight = isSam ? 'sam' : isAngaStart ? 'anga' : 'akshara'
      const source = playClick(this.ctx, this.destination, atTime, weight, this.volume)
      this.live.add(source)
      source.addEventListener('ended', () => this.live.delete(source))

      opts.onAkshara({ aksharaIndex, avartana, isSam, isAngaStart, atTime })
    }
  }
}
