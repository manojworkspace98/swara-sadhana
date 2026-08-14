/**
 * The reference voice — what the app sings when it shows the learner a phrase.
 *
 * A sawtooth through two bandpasses at the first two formants of an open "aa"
 * is not a voice, but it is close enough that a learner hears a note being
 * sung rather than a note being played, and it costs three nodes.
 */

const FORMANT_ONE_HZ = 600
const FORMANT_TWO_HZ = 1200
const FORMANT_ONE_Q = 5
const FORMANT_TWO_Q = 9
const FORMANT_TWO_GAIN = 0.45

const ATTACK_SEC = 0.03
const DECAY_SEC = 0.09
const SUSTAIN = 0.72
const RELEASE_SEC = 0.12
const PEAK = 0.9
/** Long enough to hear the note bend, short enough not to blur where it lands. */
const PORTAMENTO_SEC = 0.04

export class SwaraVoice {
  private ctx: AudioContext
  private osc: OscillatorNode
  private formantOne: BiquadFilterNode
  private formantTwo: BiquadFilterNode
  private formantTwoGain: GainNode
  private env: GainNode
  private out: GainNode
  private currentHz = 0
  private sounding = false
  private disposed = false

  constructor(ctx: AudioContext, destination: AudioNode) {
    this.ctx = ctx

    this.osc = ctx.createOscillator()
    this.osc.type = 'sawtooth'
    this.osc.frequency.value = 220

    this.formantOne = ctx.createBiquadFilter()
    this.formantOne.type = 'bandpass'
    this.formantOne.frequency.value = FORMANT_ONE_HZ
    this.formantOne.Q.value = FORMANT_ONE_Q

    this.formantTwo = ctx.createBiquadFilter()
    this.formantTwo.type = 'bandpass'
    this.formantTwo.frequency.value = FORMANT_TWO_HZ
    this.formantTwo.Q.value = FORMANT_TWO_Q

    this.formantTwoGain = ctx.createGain()
    this.formantTwoGain.gain.value = FORMANT_TWO_GAIN

    this.env = ctx.createGain()
    this.env.gain.value = 0

    this.out = ctx.createGain()
    this.out.gain.value = 1

    this.osc.connect(this.formantOne).connect(this.env)
    this.osc.connect(this.formantTwo).connect(this.formantTwoGain).connect(this.env)
    this.env.connect(this.out).connect(destination)

    // The oscillator runs for the life of the voice; the envelope is the gate.
    // Starting and stopping an oscillator per note costs a node graph edit at
    // exactly the moment the timing has to be exact.
    this.osc.start()
  }

  /**
   * Sing a note at `atTime` on the audio clock.
   *
   * With no `portamentoFromHz`, a note that follows another still sounding
   * glides from it: that slur is most of what makes a run of swaras sound sung
   * rather than typed. After a `noteOff` there is nothing to glide from, so
   * the note simply starts.
   */
  noteOn(hz: number, atTime: number, portamentoFromHz?: number): void {
    if (this.disposed || !Number.isFinite(hz) || hz <= 0) return
    const t = Math.max(atTime, this.ctx.currentTime)
    const from = portamentoFromHz ?? (this.sounding ? this.currentHz : 0)

    const freq = this.osc.frequency
    freq.cancelScheduledValues(t)
    if (from > 0 && Math.abs(from - hz) > 0.01) {
      freq.setValueAtTime(from, t)
      freq.exponentialRampToValueAtTime(hz, t + PORTAMENTO_SEC)
    } else {
      freq.setValueAtTime(hz, t)
    }

    const gain = this.env.gain
    // A note already sounding is held wherever the envelope stands, so that a
    // re-articulation inside a phrase swells rather than restarting from
    // silence. A note starting from silence has to be anchored explicitly: a
    // ramp with nothing before it on the timeline has no start point, and the
    // browser runs it from the current moment instead of from `t` — a note
    // scheduled half a second ahead would begin fading in immediately.
    if (this.sounding) holdAt(gain, t)
    else anchorAt(gain, 0, t)
    gain.linearRampToValueAtTime(PEAK, t + ATTACK_SEC)
    gain.linearRampToValueAtTime(PEAK * SUSTAIN, t + ATTACK_SEC + DECAY_SEC)

    this.currentHz = hz
    this.sounding = true
  }

  noteOff(atTime: number): void {
    if (this.disposed) return
    const t = Math.max(atTime, this.ctx.currentTime)
    const gain = this.env.gain
    if (!this.sounding) {
      anchorAt(gain, 0, t)
      return
    }
    holdAt(gain, t)
    gain.linearRampToValueAtTime(0, t + RELEASE_SEC)
    this.sounding = false
  }

  setVolume(v: number): void {
    if (this.disposed) return
    const level = Number.isFinite(v) ? Math.min(Math.max(v, 0), 1) : 0
    const t = this.ctx.currentTime
    this.out.gain.cancelScheduledValues(t)
    this.out.gain.setValueAtTime(this.out.gain.value, t)
    this.out.gain.linearRampToValueAtTime(level, t + 0.05)
  }

  dispose(): void {
    if (this.disposed) return
    this.disposed = true
    this.sounding = false
    try {
      this.osc.stop()
    } catch {
      // Never started, or already stopped.
    }
    this.osc.disconnect()
    this.formantOne.disconnect()
    this.formantTwo.disconnect()
    this.formantTwoGain.disconnect()
    this.env.disconnect()
    this.out.disconnect()
  }
}

/**
 * Freeze a parameter at its value at `t` before scheduling over it. Shared
 * with the tanpura, which has the same problem on its volume.
 *
 * Reading `param.value` is not a substitute: until the audio thread has
 * processed an automation event the getter still returns the parameter's old
 * intrinsic value, so anchoring a ramp to it just after scheduling one can
 * start the ramp from full scale.
 *
 * Firefox has never implemented `cancelAndHoldAtTime`, and there the fallback
 * has to read the value anyway; for envelopes this short it lands within a few
 * percent of the same place.
 */
/** Clear the timeline and pin a known value at `t`, so what follows has a
 *  start point to ramp from. */
function anchorAt(param: AudioParam, value: number, t: number): void {
  param.cancelScheduledValues(t)
  param.setValueAtTime(value, t)
}

export function holdAt(param: AudioParam, t: number): void {
  if (typeof param.cancelAndHoldAtTime === 'function') {
    param.cancelAndHoldAtTime(t)
    return
  }
  param.cancelScheduledValues(t)
  param.setValueAtTime(param.value, t)
}
