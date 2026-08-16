import { getAudioContext, resumeAudio } from '../../audio/audioContext'
import { SwaraVoice } from '../../audio/swaraSynth'
import { Tanpura } from '../../audio/tanpura'
import { playClick } from '../../audio/metronome'
import { TALAS } from '../talas'
import { RAGAS } from '../ragas'
import { letterSemitoneMap } from '../timeline'
import type { Demo } from './types'
import type { SwaraLetter } from '../../engine/types'

/**
 * Make a sentence audible.
 *
 * The one thing this app can do that a book cannot is play the sound at the
 * moment the word is explained. "The drone sits under everything you sing" is
 * a sentence a beginner can read twice and still not understand; the same
 * sentence next to four seconds of tanpura is understood immediately.
 */

/** A demo in progress, so a second press can interrupt the first. */
export interface DemoHandle {
  stop: () => void
  /** Resolves when the demo finishes on its own or is stopped. */
  done: Promise<void>
}

let current: DemoHandle | null = null

export function stopDemo(): void {
  current?.stop()
  current = null
}

export async function playDemo(demo: Demo, saHz: number): Promise<DemoHandle> {
  stopDemo()
  const ctx = await resumeAudio()

  const handle =
    demo.kind === 'drone'
      ? playDrone(saHz)
      : demo.kind === 'swaras'
        ? await playSwaras(demo, saHz, ctx)
        : demo.kind === 'tala'
          ? playTala(demo.talaId, ctx)
          : speak(demo.text)

  current = handle
  void handle.done.then(() => {
    if (current === handle) current = null
  })
  return handle
}

/** Six seconds of tanpura — long enough to hear it settle, short enough to end. */
const DRONE_SEC = 6

function playDrone(saHz: number): DemoHandle {
  const tanpura = new Tanpura()
  let stopped = false

  const done = (async () => {
    await tanpura.prepare(saHz)
    if (stopped) return
    tanpura.start(0.5)
    await wait(DRONE_SEC * 1000, () => stopped)
    tanpura.stop()
  })()

  return {
    stop: () => {
      stopped = true
      tanpura.stop()
    },
    done,
  }
}

/**
 * Sung swaras over the drone.
 *
 * The drone is not decoration here. A swara heard alone is just a pitch; heard
 * against Sa it has a character, and that relationship is the thing the
 * beginner is being taught to hear.
 */
async function playSwaras(
  demo: Extract<Demo, { kind: 'swaras' }>,
  saHz: number,
  ctx: AudioContext,
): Promise<DemoHandle> {
  const raga = RAGAS[demo.ragaId ?? 'mayamalavagowla'] ?? RAGAS.mayamalavagowla
  const bpm = demo.bpm ?? 60
  const secPerAkshara = 60 / bpm

  const tanpura = new Tanpura()
  const voice = new SwaraVoice(ctx, ctx.destination)
  let stopped = false

  const done = (async () => {
    await tanpura.prepare(saHz)
    if (stopped) {
      voice.dispose()
      return
    }
    tanpura.start(0.32)

    // A beat of drone before the first note, so the ear has something to
    // measure the note against when it arrives.
    const start = ctx.currentTime + 0.6
    let at = start
    let previousHz: number | undefined

    for (const note of demo.swaras) {
      const hz = swaraHz(note.swara, note.octave, raga, saHz)
      const seconds = note.duration * secPerAkshara
      voice.noteOn(hz, at, previousHz)
      voice.noteOff(at + seconds * 0.92)
      previousHz = hz
      at += seconds
    }

    const totalMs = (at - ctx.currentTime + 1.2) * 1000
    await wait(totalMs, () => stopped)
    tanpura.stop()
    voice.dispose()
  })()

  return {
    stop: () => {
      stopped = true
      tanpura.stop()
      voice.noteOff(ctx.currentTime)
      voice.dispose()
    },
    done,
  }
}

function swaraHz(
  swara: SwaraLetter,
  octave: number,
  raga: (typeof RAGAS)[string],
  saHz: number,
): number {
  const semitone = letterSemitoneMap(raga)[swara] ?? 0
  return saHz * Math.pow(2, (semitone + 12 * octave) / 12)
}

/** One avartana, counted. */
function playTala(talaId: string, ctx: AudioContext): DemoHandle {
  const tala = TALAS[talaId] ?? TALAS.adi
  const secPerAkshara = 60 / 70
  let stopped = false

  const start = ctx.currentTime + 0.2
  const angaStarts = new Set(cumulativeAngaStarts(tala))

  for (let i = 0; i < tala.aksharaCount; i += 1) {
    const weight = i === 0 ? 'sam' : angaStarts.has(i) ? 'anga' : 'akshara'
    playClick(ctx, ctx.destination, start + i * secPerAkshara, weight, 0.5)
  }

  const done = wait((tala.aksharaCount * secPerAkshara + 0.6) * 1000, () => stopped)
  return { stop: () => void (stopped = true), done }
}

function cumulativeAngaStarts(tala: (typeof TALAS)[string]): number[] {
  const starts: number[] = []
  let at = 0
  for (const anga of tala.angas) {
    starts.push(at)
    at += anga === 'laghu' ? tala.jati : anga === 'drutam' ? 2 : 1
  }
  return starts
}

/**
 * Say a word aloud.
 *
 * Speech synthesis pronounces Sanskrit-derived names imperfectly, which is why
 * every glossary entry also carries a written respelling — the spoken form is
 * a second opinion, not the authority.
 */
function speak(text: string): DemoHandle {
  let stopped = false
  if (typeof speechSynthesis === 'undefined') {
    return { stop: () => {}, done: Promise.resolve() }
  }

  speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.85
  // An Indian-English voice gets the retroflex consonants closer than the
  // default does; fall back silently when the device has none.
  const voice = speechSynthesis.getVoices().find((v) => v.lang === 'en-IN' || v.lang === 'hi-IN')
  if (voice) utterance.voice = voice

  const done = new Promise<void>((resolve) => {
    utterance.onend = () => resolve()
    utterance.onerror = () => resolve()
    speechSynthesis.speak(utterance)
  })

  return {
    stop: () => {
      stopped = true
      speechSynthesis.cancel()
    },
    done: done.then(() => {
      if (stopped) return
    }),
  }
}

function wait(ms: number, cancelled: () => boolean): Promise<void> {
  return new Promise((resolve) => {
    const started = Date.now()
    const tick = () => {
      if (cancelled() || Date.now() - started >= ms) resolve()
      else setTimeout(tick, 60)
    }
    tick()
  })
}

/** Read the tonic once, for components that only need it to start a demo. */
export function currentSaHz(fallback: number): number {
  return Number.isFinite(fallback) && fallback > 0 ? fallback : 146.83
}

export { getAudioContext }
