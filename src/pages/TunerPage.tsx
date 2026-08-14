import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { IN_TUNE_CENTS, NEAR_CENTS, SwaraLadder } from '../components/SwaraLadder'
import { MicPitchSource } from '../audio/micCapture'
import { readPitch } from '../engine/swara'
import { midiForHz, shrutiHz, suggestShruti, SHRUTI_OPTIONS } from '../engine/shruti'
import { DEFAULT_RAGA, ragaSemitones } from '../content/ragas'
import { useApp } from '../state/appStore'
import { updateProfile } from '../state/profiles'
import type { PitchFrame } from '../engine/types'

type MicState = 'idle' | 'starting' | 'listening' | 'denied' | 'error'

export function TunerPage() {
  const { activeProfile, refreshProfiles } = useApp()
  const [micState, setMicState] = useState<MicState>('idle')
  const [errorText, setErrorText] = useState('')
  const sourceRef = useRef<MicPitchSource | null>(null)
  const latest = useRef<PitchFrame | null>(null)

  // Readout updates at a readable rate; the canvas gets every frame.
  const [readout, setReadout] = useState<{
    label: string
    centsOff: number
    hz: number
  } | null>(null)

  const saHz = shrutiHz(activeProfile?.shruti ?? 'C#3')
  const semitones = useMemo(() => ragaSemitones(DEFAULT_RAGA), [])

  useEffect(() => {
    sourceRef.current?.setSa(saHz)
  }, [saHz])

  const start = useCallback(async () => {
    setMicState('starting')
    setErrorText('')
    try {
      const src = sourceRef.current ?? new MicPitchSource()
      sourceRef.current = src
      src.subscribe((f) => {
        latest.current = f
      })
      await src.start(saHz)
      setMicState('listening')
    } catch (err) {
      const e = err as DOMException
      if (e.name === 'NotAllowedError' || e.name === 'SecurityError') {
        setMicState('denied')
      } else {
        setMicState('error')
        setErrorText(e.message || String(err))
      }
    }
  }, [saHz])

  const stop = useCallback(() => {
    sourceRef.current?.stop()
    latest.current = null
    setReadout(null)
    setMicState('idle')
  }, [])

  useEffect(() => () => sourceRef.current?.stop(), [])

  // Sample the live frame a few times a second for the text readout.
  useEffect(() => {
    if (micState !== 'listening') return
    const id = setInterval(() => {
      const f = latest.current
      if (f?.hz == null || f.cents == null) {
        setReadout(null)
        return
      }
      const r = readPitch(f.hz, saHz, semitones)
      setReadout({ label: r.name.label, centsOff: r.centsOff, hz: f.hz })
    }, 90)
    return () => clearInterval(id)
  }, [micState, saHz, semitones])

  return (
    <>
      <PageHeader
        eyebrow="Sruti"
        title="Tuner"
        lead="Sing a steady note and watch where it lands. The ladder shows Mayamalavagowla, the scale every exercise starts in."
      />

      <div className="grid max-w-4xl gap-6 lg:grid-cols-[1fr_320px]">
        <section className="card p-5">
          <SwaraLadder saHz={saHz} ragaSemitones={semitones} latest={latest} height={440} />
        </section>

        <div className="flex flex-col gap-6">
          <section className="card p-5">
            <p className="eyebrow mb-3">Your voice</p>
            {micState === 'listening' ? (
              readout ? (
                <>
                  <p className="font-[family-name:var(--font-mono)] text-5xl font-medium">
                    {readout.label}
                  </p>
                  <p
                    className="mt-1 font-[family-name:var(--font-mono)] text-lg"
                    style={{ color: tuneColour(readout.centsOff) }}
                  >
                    {readout.centsOff > 0 ? '+' : ''}
                    {readout.centsOff.toFixed(0)}¢ · {readout.hz.toFixed(1)} Hz
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    {verdict(readout.centsOff)}
                  </p>
                </>
              ) : (
                <p className="text-[var(--color-muted)]">Listening — sing a note.</p>
              )
            ) : (
              <p className="text-[var(--color-muted)]">
                {micState === 'denied'
                  ? 'Microphone access was blocked. Allow it in your browser settings, then start listening again.'
                  : micState === 'error'
                    ? `The microphone could not start. ${errorText}`
                    : 'Start listening to see your pitch.'}
              </p>
            )}

            <button
              onClick={micState === 'listening' ? stop : start}
              disabled={micState === 'starting'}
              className={`mt-5 min-h-11 w-full rounded-lg px-4 py-2 font-medium transition-colors ${
                micState === 'listening'
                  ? 'border border-[var(--color-line)] text-[var(--color-jasmine)]'
                  : 'bg-[var(--color-brass)] text-[var(--color-ink)]'
              }`}
            >
              {micState === 'listening'
                ? 'Stop listening'
                : micState === 'starting'
                  ? 'Starting…'
                  : 'Start listening'}
            </button>
          </section>

          <FindMyShruti
            listening={micState === 'listening'}
            latest={latest}
            current={activeProfile?.shruti ?? 'C#3'}
            onPick={async (id) => {
              if (!activeProfile) return
              await updateProfile(activeProfile.id, { shruti: id })
              await refreshProfiles()
              useApp.setState({ activeProfile: { ...activeProfile, shruti: id } })
            }}
          />
        </div>
      </div>
    </>
  )
}

function tuneColour(centsOff: number): string {
  const off = Math.abs(centsOff)
  return off <= IN_TUNE_CENTS ? '#7ba05b' : off <= NEAR_CENTS ? '#e8b33d' : '#c7472f'
}

function verdict(centsOff: number): string {
  const off = Math.abs(centsOff)
  if (off <= IN_TUNE_CENTS) return 'In tune.'
  return centsOff > 0 ? 'A little sharp — ease down.' : 'A little flat — lift it slightly.'
}

/**
 * Finding your own sruti is the first thing a teacher does with a new student.
 * The learner holds their lowest comfortable note; we take the median of what
 * we heard and place Sa a fourth above it, so mandra Pa stays within reach.
 */
function FindMyShruti({
  listening,
  latest,
  current,
  onPick,
}: {
  listening: boolean
  latest: React.RefObject<PitchFrame | null>
  current: string
  onPick: (id: string) => void
}) {
  const [phase, setPhase] = useState<'idle' | 'recording' | 'done'>('idle')
  const [secondsLeft, setSecondsLeft] = useState(4)
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const collected = useRef<number[]>([])

  useEffect(() => {
    if (phase !== 'recording') return
    collected.current = []
    setSecondsLeft(4)

    const sample = setInterval(() => {
      const f = latest.current
      if (f?.hz != null) collected.current.push(f.hz)
    }, 50)

    const tick = setInterval(() => setSecondsLeft((s) => s - 1), 1000)

    const done = setTimeout(() => {
      clearInterval(sample)
      clearInterval(tick)
      const heard = collected.current
      if (heard.length < 15) {
        setSuggestion(null)
        setPhase('done')
        return
      }
      const sorted = [...heard].sort((a, b) => a - b)
      const median = sorted[Math.floor(sorted.length / 2)]
      setSuggestion(suggestShruti(median).id)
      setPhase('done')
    }, 4000)

    return () => {
      clearInterval(sample)
      clearInterval(tick)
      clearTimeout(done)
    }
  }, [phase, latest])

  return (
    <section className="card p-5">
      <p className="eyebrow mb-2">Find your sruti</p>

      {phase === 'idle' && (
        <>
          <p className="mb-4 text-sm text-[var(--color-muted)]">
            Sing the lowest note you can hold comfortably — not the lowest you can
            reach — and hold it for four seconds.
          </p>
          <button
            onClick={() => setPhase('recording')}
            disabled={!listening}
            className="min-h-11 w-full rounded-lg border border-[var(--color-line)] px-4 py-2 text-sm disabled:opacity-40"
          >
            {listening ? 'Hold your lowest note' : 'Start listening first'}
          </button>
        </>
      )}

      {phase === 'recording' && (
        <>
          <p className="mb-2 text-sm">Hold it…</p>
          <p className="font-[family-name:var(--font-mono)] text-4xl text-[var(--color-turmeric)]">
            {Math.max(secondsLeft, 0)}
          </p>
        </>
      )}

      {phase === 'done' && (
        <>
          {suggestion ? (
            <>
              <p className="mb-1 text-sm text-[var(--color-muted)]">
                That voice suits a sruti of
              </p>
              <p className="mb-1 font-[family-name:var(--font-mono)] text-3xl">
                {suggestion}
              </p>
              <p className="mb-4 text-sm text-[var(--color-muted)]">
                {SHRUTI_OPTIONS.find((s) => s.id === suggestion)?.kattai} kattai
                {suggestion === current ? ' — the one you already use.' : ''}
              </p>
              {suggestion !== current && (
                <button
                  onClick={() => onPick(suggestion)}
                  className="mb-2 min-h-11 w-full rounded-lg bg-[var(--color-brass)] px-4 py-2 text-sm font-medium text-[var(--color-ink)]"
                >
                  Use {suggestion} as my sruti
                </button>
              )}
            </>
          ) : (
            <p className="mb-4 text-sm text-[var(--color-muted)]">
              Not enough steady sound to judge. Try again a little louder, closer to
              the microphone.
            </p>
          )}
          <button
            onClick={() => setPhase('idle')}
            className="min-h-11 w-full rounded-lg border border-[var(--color-line)] px-4 py-2 text-sm"
          >
            Try again
          </button>
        </>
      )}
    </section>
  )
}

/** Kept for the settings page's range display. */
export { midiForHz }
