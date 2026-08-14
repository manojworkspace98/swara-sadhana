import type { PitchFrame } from '../engine/types'

/**
 * Records a take, and keeps the pitch trace alongside it.
 *
 * Storing the trace with the audio means playback can draw what you sang
 * without re-analysing the file every time it is opened — and it makes a
 * take from March directly comparable with one from today.
 */
export interface Take {
  blob: Blob
  mimeType: string
  durationSec: number
  /** Cents above Sa per hop; NaN marks an unvoiced hop. */
  pitchTrace: Float32Array
  hopSec: number
}

/** Safari has never supported webm; ask for what the browser will actually give. */
function pickMimeType(): string {
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4;codecs=mp4a.40.2',
    'audio/mp4',
  ]
  for (const type of candidates) {
    if (MediaRecorder.isTypeSupported?.(type)) return type
  }
  return ''
}

export class TakeRecorder {
  private recorder: MediaRecorder | null = null
  private chunks: Blob[] = []
  private trace: number[] = []
  private startedAt = 0
  private mimeType = ''

  get recording(): boolean {
    return this.recorder?.state === 'recording'
  }

  start(stream: MediaStream): void {
    if (this.recording) return
    this.chunks = []
    this.trace = []
    this.mimeType = pickMimeType()
    this.recorder = new MediaRecorder(
      stream,
      this.mimeType ? { mimeType: this.mimeType } : undefined,
    )
    this.recorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.chunks.push(e.data)
    }
    this.recorder.start(250)
    this.startedAt = performance.now()
  }

  /** Feed every frame in while recording so the trace lines up with the audio. */
  addFrame(frame: PitchFrame): void {
    if (!this.recording) return
    this.trace.push(frame.cents ?? NaN)
  }

  async stop(hopSec: number): Promise<Take | null> {
    const rec = this.recorder
    if (!rec || rec.state === 'inactive') return null

    const done = new Promise<void>((resolve) => {
      rec.onstop = () => resolve()
    })
    rec.stop()
    await done

    const blob = new Blob(this.chunks, { type: this.mimeType || 'audio/webm' })
    const take: Take = {
      blob,
      mimeType: blob.type,
      durationSec: (performance.now() - this.startedAt) / 1000,
      pitchTrace: Float32Array.from(this.trace),
      hopSec,
    }

    this.recorder = null
    this.chunks = []
    this.trace = []
    return take
  }

  cancel(): void {
    if (this.recorder?.state === 'recording') this.recorder.stop()
    this.recorder = null
    this.chunks = []
    this.trace = []
  }
}
