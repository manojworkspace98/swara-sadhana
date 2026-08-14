/**
 * Deliberately dumb: it copies microphone samples out of the audio thread and
 * does nothing else. Pitch detection runs on the main thread where it can be
 * tested and swapped out. The one thing only this file can supply is an honest
 * timestamp from the audio clock — `performance.now()` read on the main thread
 * would already be tens of milliseconds stale, and rhythm scoring lives or dies
 * on that number.
 *
 * Plain JavaScript in `public/` on purpose: it imports nothing, so there is
 * nothing to bundle, and a static file removes every build-tool question about
 * how worklets are emitted.
 */

const HOP = 512

class PitchForwarder extends AudioWorkletProcessor {
  constructor() {
    super()
    this.buf = new Float32Array(HOP)
    this.filled = 0
  }

  process(inputs) {
    const channel = inputs[0] && inputs[0][0]
    if (!channel) return true

    for (let i = 0; i < channel.length; i++) {
      this.buf[this.filled++] = channel[i]
      if (this.filled === HOP) {
        const out = this.buf
        this.buf = new Float32Array(HOP)
        this.filled = 0
        // `currentFrame` counts samples since the context started; divided by
        // the rate it gives the exact moment this hop ended.
        this.port.postMessage({ samples: out, t: currentFrame / sampleRate }, [out.buffer])
      }
    }
    return true
  }
}

registerProcessor('pitch-forwarder', PitchForwarder)
