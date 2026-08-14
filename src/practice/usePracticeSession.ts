import { useCallback, useEffect, useRef, useState } from 'react'
import { resumeAudio } from '../audio/audioContext'
import { MicPitchSource } from '../audio/micCapture'
import { Metronome, type AksharaEvent } from '../audio/metronome'
import { SwaraVoice } from '../audio/swaraSynth'
import { Tanpura } from '../audio/tanpura'
import { TakeRecorder, type Take } from '../audio/recorder'
import { buildTimeline } from '../content/timeline'
import { hzForCents } from '../engine/swara'
import { detectOnsets } from '../engine/scoring/onsets'
import { scoreExercise, SCORING_PRESETS } from '../engine/scoring/pitchScore'
import { scoreRhythm } from '../engine/scoring/rhythmScore'
import type { Lesson } from '../content/schema'
import type { Raga } from '../content/ragas'
import type { Tala } from '../content/talas'
import type { ExpectedNote, Kalam } from '../state/types'
import type { PitchFrame } from '../engine/types'

export type Phase = 'idle' | 'arming' | 'listen' | 'countIn' | 'singing' | 'scoring' | 'done'

export interface SessionResult {
  pitchAccuracy: number
  rhythmAccuracy: number
  clean: boolean
  worst: ReturnType<typeof scoreExercise>['worstNotes']
  tendencyMs: number
  take: Take | null
}

export interface SessionOptions {
  lesson: Lesson
  raga: Raga
  tala: Tala
  saHz: number
  kalam: Kalam
  aksharaBpm: number
  droneVolume: number
  referenceVolume: number
  metronomeVolume: number
  latencyOffsetMs: number
  preset: 'beginner' | 'standard' | 'strict'
  record: boolean
}

/**
 * One run of an exercise, from tapping start to a score.
 *
 * The reference voice, the metronome and the expected-note timeline are all
 * scheduled against the same AudioContext clock and the same `startAt`, which
 * is the only way the three stay in step — anything driven from a React render
 * would drift within a couple of avartanas.
 */
export function usePracticeSession(opts: SessionOptions) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [avartana, setAvartana] = useState(0)
  const [akshara, setAkshara] = useState(0)
  const [result, setResult] = useState<SessionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [droneOn, setDroneOn] = useState(false)

  const latest = useRef<PitchFrame | null>(null)
  const frames = useRef<PitchFrame[]>([])
  const timeline = useRef<ExpectedNote[]>([])

  const mic = useRef<MicPitchSource | null>(null)
  const tanpura = useRef<Tanpura | null>(null)
  const metronome = useRef<Metronome | null>(null)
  const voice = useRef<SwaraVoice | null>(null)
  const recorder = useRef<TakeRecorder | null>(null)
  const stream = useRef<MediaStream | null>(null)

  const optsRef = useRef(opts)
  optsRef.current = opts

  useEffect(() => {
    return () => {
      metronome.current?.stop()
      tanpura.current?.stop()
      voice.current?.dispose()
      recorder.current?.cancel()
      mic.current?.stop()
    }
  }, [])

  const toggleDrone = useCallback(async () => {
    const o = optsRef.current
    await resumeAudio()
    if (!tanpura.current) tanpura.current = new Tanpura()
    if (droneOn) {
      tanpura.current.stop()
      setDroneOn(false)
      return
    }
    await tanpura.current.prepare(o.saHz, {
      fifth: o.raga.arohana.includes(7) || o.raga.avarohana.includes(7) ? 'pa' : 'ma',
    })
    tanpura.current.start(o.droneVolume)
    setDroneOn(true)
  }, [droneOn])

  /** Play the exercise so the learner hears it before attempting it. */
  const listen = useCallback(async () => {
    const o = optsRef.current
    const ctx = await resumeAudio()
    setPhase('listen')

    const startAt = ctx.currentTime + 0.4
    const notes = buildTimeline(o.lesson.notation, {
      tala: o.tala,
      raga: o.raga,
      aksharaBpm: o.aksharaBpm,
      kalam: o.kalam,
      saHz: o.saHz,
      startAt,
    })

    voice.current?.dispose()
    const v = new SwaraVoice(ctx, ctx.destination)
    voice.current = v
    v.setVolume(o.referenceVolume)

    let prevHz: number | undefined
    for (const n of notes) {
      if (n.rest) continue
      const hz = hzForCents(n.targetCents, o.saHz)
      v.noteOn(hz, n.t0, prevHz)
      v.noteOff(n.t1 - 0.02)
      prevHz = hz
    }

    metronome.current?.stop()
    const m = new Metronome(ctx, ctx.destination)
    metronome.current = m
    m.start({
      tala: o.tala,
      aksharaBpm: o.aksharaBpm,
      startAt,
      onAkshara: (e: AksharaEvent) => {
        setAkshara(e.aksharaIndex)
        setAvartana(e.avartana)
      },
    })

    const endAt = (notes.at(-1)?.t1 ?? startAt) - ctx.currentTime
    window.setTimeout(
      () => {
        m.stop()
        setPhase('idle')
      },
      Math.max(0, endAt * 1000 + 400),
    )
  }, [])

  const stopAll = useCallback(() => {
    metronome.current?.stop()
    voice.current?.dispose()
    voice.current = null
    setPhase('idle')
  }, [])

  /** Count in, then listen and score what the learner sings. */
  const sing = useCallback(async () => {
    const o = optsRef.current
    setError(null)
    setResult(null)
    setPhase('arming')

    try {
      const ctx = await resumeAudio()

      if (!mic.current) mic.current = new MicPitchSource()
      frames.current = []
      mic.current.subscribe((f) => {
        latest.current = f
        frames.current.push(f)
        recorder.current?.addFrame(f)
      })
      await mic.current.start(o.saHz)
      stream.current = mic.current.mediaStream ?? null

      if (o.record && stream.current) {
        recorder.current = new TakeRecorder()
      }

      const countInAvartanas = 1
      const aksharaSec = 60 / o.aksharaBpm
      const startAt = ctx.currentTime + 0.3
      const singFrom = startAt + countInAvartanas * o.tala.aksharaCount * aksharaSec

      timeline.current = buildTimeline(o.lesson.notation, {
        tala: o.tala,
        raga: o.raga,
        aksharaBpm: o.aksharaBpm,
        kalam: o.kalam,
        saHz: o.saHz,
        startAt: singFrom,
      })

      metronome.current?.stop()
      const m = new Metronome(ctx, ctx.destination)
      metronome.current = m
      setPhase('countIn')
      m.start({
        tala: o.tala,
        aksharaBpm: o.aksharaBpm,
        startAt,
        onAkshara: (e) => {
          setAkshara(e.aksharaIndex)
          setAvartana(e.avartana)
          if (e.avartana === countInAvartanas && e.aksharaIndex === 0) {
            setPhase('singing')
            if (recorder.current && stream.current) recorder.current.start(stream.current)
          }
        },
      })

      const endsAt = timeline.current.at(-1)?.t1 ?? singFrom
      window.setTimeout(
        () => void finish(),
        Math.max(0, (endsAt - ctx.currentTime) * 1000 + 600),
      )
    } catch (err) {
      const e = err as DOMException
      setError(
        e.name === 'NotAllowedError'
          ? 'Microphone access was blocked. Allow it in your browser settings and try again.'
          : (e.message ?? 'The microphone could not start.'),
      )
      setPhase('idle')
    }
  }, [])

  const finish = useCallback(async () => {
    const o = optsRef.current
    setPhase('scoring')
    metronome.current?.stop()

    const take = recorder.current ? await recorder.current.stop(512 / 48_000) : null
    mic.current?.stop()

    const cfg = SCORING_PRESETS[o.preset]
    const pitch = scoreExercise(frames.current, timeline.current, cfg)
    const onsets = detectOnsets(frames.current)
    const rhythm = scoreRhythm(onsets, timeline.current, {
      aksharaSec: 60 / o.aksharaBpm,
      latencyOffsetMs: o.latencyOffsetMs,
    })

    setResult({
      pitchAccuracy: pitch.pitchAccuracy,
      rhythmAccuracy: rhythm.rhythmAccuracy,
      clean: pitch.noteScores.every((n) => n.score >= 0.6),
      worst: pitch.worstNotes,
      tendencyMs: rhythm.tendencyMs,
      take,
    })
    setPhase('done')
  }, [])

  const abort = useCallback(() => {
    metronome.current?.stop()
    recorder.current?.cancel()
    mic.current?.stop()
    setPhase('idle')
  }, [])

  return {
    phase,
    avartana,
    akshara,
    result,
    error,
    droneOn,
    latest,
    timeline,
    listen,
    sing,
    abort,
    stopAll,
    toggleDrone,
    reset: () => {
      setResult(null)
      setPhase('idle')
    },
  }
}
