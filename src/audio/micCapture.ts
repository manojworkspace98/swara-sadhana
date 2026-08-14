import { PitchDetector } from 'pitchy'
import { resumeAudio } from './audioContext'
import {
  computeRms,
  MedianPitchFilter,
  toFrame,
} from '../engine/pitchFilter'
import type { PitchFrame } from '../engine/types'
import { preferredDeviceId } from './inputDevices'

const WORKLET_URL = `${import.meta.env.BASE_URL}worklets/pitch-forwarder.js`

export type Unsubscribe = () => void

export interface PitchSource {
  start(saHz: number): Promise<void>
  stop(): void
  setSa(saHz: number): void
  subscribe(cb: (frame: PitchFrame) => void): Unsubscribe
  readonly running: boolean
}

const HOP = 512
/** 2048 samples ≈ 43 ms: reliable down to about 90 Hz at 48 kHz. */
const WINDOW_NORMAL = 2048
/**
 * A male singer at a low sruti reaches mandra Pa near 90 Hz, where a 2048
 * window has barely two periods to work with. Below E3 we trade latency for a
 * 4096 window so the bottom of the range stays detectable.
 */
const WINDOW_LOW = 4096
const LOW_SA_HZ = 165 // E3

export class MicPitchSource implements PitchSource {
  private stream: MediaStream | null = null
  private node: AudioWorkletNode | null = null
  private source: MediaStreamAudioSourceNode | null = null
  private detector: PitchDetector<Float32Array> | null = null
  private ring = new Float32Array(WINDOW_LOW)
  private windowSize = WINDOW_NORMAL
  private writeIdx = 0
  private filled = 0
  private saHz = 138.591
  private filter = new MedianPitchFilter()
  private listeners = new Set<(f: PitchFrame) => void>()
  private analysisBuf = new Float32Array(WINDOW_NORMAL)

  get running(): boolean {
    return this.node !== null
  }

  /** The live capture, so a recorder can write the same audio being analysed. */
  get mediaStream(): MediaStream | null {
    return this.stream
  }

  async start(saHz: number): Promise<void> {
    if (this.node) return
    this.setSa(saHz)

    const ctx = await resumeAudio()

    // Chrome's voice processing is tuned for speech intelligibility on calls.
    // Automatic gain control in particular rides the level of a held note and
    // smears the very steadiness we are trying to measure, so all three are off.
    const deviceId = preferredDeviceId()
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        channelCount: 1,
        ...(deviceId ? { deviceId: { exact: deviceId } } : {}),
      },
    })

    await ctx.audioWorklet.addModule(WORKLET_URL)

    this.source = ctx.createMediaStreamSource(this.stream)
    this.node = new AudioWorkletNode(ctx, 'pitch-forwarder')
    this.node.port.onmessage = (e: MessageEvent<{ samples: Float32Array; t: number }>) => {
      this.onHop(e.data.samples, e.data.t, ctx.sampleRate)
    }
    this.source.connect(this.node)
    // The worklet emits no audio; it still needs a sink to be pulled.
    this.node.connect(ctx.destination)
  }

  stop(): void {
    this.node?.port.close()
    this.node?.disconnect()
    this.source?.disconnect()
    this.stream?.getTracks().forEach((t) => t.stop())
    this.node = null
    this.source = null
    this.stream = null
    this.detector = null
    this.filled = 0
    this.writeIdx = 0
    this.filter.reset()
  }

  setSa(saHz: number): void {
    this.saHz = saHz
    const wanted = saHz <= LOW_SA_HZ ? WINDOW_LOW : WINDOW_NORMAL
    if (wanted !== this.windowSize) {
      this.windowSize = wanted
      this.analysisBuf = new Float32Array(wanted)
      this.detector = null
      this.filled = 0
      this.writeIdx = 0
    }
  }

  subscribe(cb: (frame: PitchFrame) => void): Unsubscribe {
    this.listeners.add(cb)
    return () => this.listeners.delete(cb)
  }

  private onHop(samples: Float32Array, t: number, sampleRate: number): void {
    // Ring buffer: newest hop overwrites the oldest, so the analysis window
    // always covers the most recent `windowSize` samples.
    for (let i = 0; i < samples.length; i++) {
      this.ring[this.writeIdx] = samples[i]
      this.writeIdx = (this.writeIdx + 1) % this.windowSize
    }
    this.filled = Math.min(this.filled + samples.length, this.windowSize)
    if (this.filled < this.windowSize) return

    for (let i = 0; i < this.windowSize; i++) {
      this.analysisBuf[i] = this.ring[(this.writeIdx + i) % this.windowSize]
    }

    if (!this.detector) {
      this.detector = PitchDetector.forFloat32Array(this.windowSize)
    }
    const [hz, clarity] = this.detector.findPitch(this.analysisBuf, sampleRate)
    const frame = toFrame(
      { t, hz, clarity, rms: computeRms(samples) },
      this.saHz,
      this.filter,
    )
    for (const cb of this.listeners) cb(frame)
  }
}

/**
 * Seconds per analysis hop at this device's actual rate. iPads and Macs do not
 * agree on 48 kHz, and a hardcoded rate would put the saved pitch trace out of
 * step with its own audio on any device that runs at 44.1.
 */
export function hopSeconds(ctx: AudioContext): number {
  return HOP / ctx.sampleRate
}
