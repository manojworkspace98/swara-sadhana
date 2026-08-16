import { useEffect, useRef, useState } from 'react'
import { MicPitchSource } from '../../audio/micCapture'
import { Tanpura } from '../../audio/tanpura'
import { SHRUTI_OPTIONS, findShruti, shrutiHz, suggestShruti } from '../../engine/shruti'
import type { PitchFrame } from '../../engine/types'

/**
 * Finding your sruti, step by step.
 *
 * This used to be a settings row: a dropdown of eleven pitches offered to
 * somebody who had not yet been told what a sruti is or how one would know
 * which to pick. The information was all present and none of it was any use.
 *
 * So the flow asks for something a beginner can actually do — hum a note that
 * feels easy — and works outward from that. The singer never has to know the
 * vocabulary to reach the right answer; the vocabulary is explained on the way
 * through.
 */

type Step = 'why' | 'listen' | 'hum' | 'judge' | 'settled'

export function SrutiWalkthrough({
  current,
  onPick,
  onOpenTerm,
}: {
  current: string
  onPick: (id: string) => void
  onOpenTerm?: (termId: string) => void
}) {
  const [step, setStep] = useState<Step>('why')
  const [picked, setPicked] = useState(current)
  const [heardHz, setHeardHz] = useState<number | null>(null)
  const [micError, setMicError] = useState('')

  const source = useRef<MicPitchSource | null>(null)
  const latest = useRef<PitchFrame | null>(null)
  const tanpura = useRef<Tanpura | null>(null)

  useEffect(() => {
    return () => {
      source.current?.stop()
      tanpura.current?.stop()
    }
  }, [])

  async function playDroneAt(id: string) {
    const t = (tanpura.current ??= new Tanpura())
    await t.prepare(shrutiHz(id))
    t.start(0.5)
  }

  function stopDrone() {
    tanpura.current?.stop()
  }

  return (
    <div className="card flex flex-col gap-5 p-5 md:p-6">
      <StepDots step={step} />

      {step === 'why' && (
        <>
          <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-turmeric)]">
            First, what a sruti is
          </h2>
          <div className="flex flex-col gap-3 text-[15px] leading-relaxed">
            <p>
              Carnatic music has no fixed pitch the way a piano does. There is no note
              that is always "C". Instead, every singer chooses one pitch to build on,
              and every other note is heard in relation to it. That chosen pitch is your{' '}
              <TermLink id="sruti" onOpenTerm={onOpenTerm}>
                sruti
              </TermLink>
              , and the note sung at it is called <strong>Sa</strong>.
            </p>
            <p>
              Sa is not a pitch you memorise. It is wherever you decide to put it. Move
              your sruti up two semitones and every note in every exercise moves with it
              — the music is unchanged, because it was never about the absolute pitches,
              only the distances between them.
            </p>
            <p>
              This is why the drone runs underneath everything. It sounds your Sa
              continuously so your ear always has it to measure against.
            </p>
            <p className="rounded-md border-l-2 border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-line)_22%,transparent)] px-4 py-3 text-sm text-[var(--color-muted)]">
              You may also meet "sruti" used for something else entirely — the very small
              intervals of classical theory, where an octave is divided into twenty-two.
              That is a different sense of the same word. Here it always means the pitch
              you sing from.
            </p>
          </div>
          <button onClick={() => setStep('listen')} className="btn-primary">
            Next — hear one
          </button>
        </>
      )}

      {step === 'listen' && (
        <>
          <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-turmeric)]">
            This is what a sruti sounds like
          </h2>
          <p className="text-[15px] leading-relaxed">
            Press play. What you hear is a tanpura: four strings tuned around one pitch,
            plucked in turn so the sound never stops. Listen for a few seconds. You are
            not doing anything yet — you are letting your ear settle onto the pitch
            everything else will be measured from.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => void playDroneAt(picked)} className="btn-primary">
              Play the drone
            </button>
            <button onClick={stopDrone} className="btn-ghost">
              Stop
            </button>
          </div>
          <p className="text-sm text-[var(--color-muted)]">
            Try humming along with it. If that feels easy, this sruti may already suit
            you. If you find yourself straining, the next step will find a better one.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                stopDrone()
                setStep('hum')
              }}
              className="btn-primary"
            >
              Next — find mine
            </button>
            <button onClick={() => setStep('why')} className="btn-ghost">
              Back
            </button>
          </div>
        </>
      )}

      {step === 'hum' && (
        <HumStep
          source={source}
          latest={latest}
          micError={micError}
          setMicError={setMicError}
          onHeard={(hz) => {
            setHeardHz(hz)
            setPicked(suggestShruti(hz).id)
            setStep('judge')
          }}
          onBack={() => setStep('listen')}
        />
      )}

      {step === 'judge' && (
        <>
          <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-turmeric)]">
            Try it and see how it sits
          </h2>
          {heardHz && (
            <p className="text-sm text-[var(--color-muted)]">
              You hummed around {heardHz.toFixed(0)} Hz. Starting from that, a good sruti
              to try is <strong className="text-[var(--color-jasmine)]">{labelFor(picked)}</strong>.
            </p>
          )}
          <p className="text-[15px] leading-relaxed">
            Play the drone and sing Sa with it — any comfortable "aa". Then judge it
            honestly: you want a pitch where your ordinary speaking-range notes sit
            easily, with room to go both above and below without strain. Exercises climb
            an octave from Sa, and songs go lower.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => void playDroneAt(picked)} className="btn-primary">
              Play {labelFor(picked)}
            </button>
            <button onClick={stopDrone} className="btn-ghost">
              Stop
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <p className="eyebrow">How does it feel?</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => void shift(-1)} className="btn-ghost">
                Too high — lower it
              </button>
              <button onClick={() => void shift(1)} className="btn-ghost">
                Too low — raise it
              </button>
              <button
                onClick={() => {
                  stopDrone()
                  onPick(picked)
                  setStep('settled')
                }}
                className="btn-primary"
              >
                This one suits me
              </button>
            </div>
          </div>

          <p className="text-sm text-[var(--color-muted)]">
            Men usually settle between C and D (1 to 2 kattai); women between F and A
            (4 to 6). These are starting points, not rules — your voice decides.
          </p>
        </>
      )}

      {step === 'settled' && (
        <>
          <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-turmeric)]">
            Your sruti is {labelFor(picked)}
          </h2>
          <p className="text-[15px] leading-relaxed">
            Every exercise from here will be pitched from it, and the drone will play at
            it. Nothing is locked in — as your voice opens up over the coming months it
            is normal to move your sruti, and you can change it in Settings whenever you
            like.
          </p>
          <p className="text-sm text-[var(--color-muted)]">
            One habit worth starting today: turn the drone on before you sing anything,
            and leave it running. Singing without it is the single most common reason a
            beginner's pitch drifts without them noticing.
          </p>
        </>
      )}
    </div>
  )

  async function shift(direction: -1 | 1) {
    const index = SHRUTI_OPTIONS.findIndex((o) => o.id === picked)
    const next = SHRUTI_OPTIONS[Math.min(SHRUTI_OPTIONS.length - 1, Math.max(0, index + direction))]
    setPicked(next.id)
    await playDroneAt(next.id)
  }
}

function HumStep({
  source,
  latest,
  micError,
  setMicError,
  onHeard,
  onBack,
}: {
  source: React.RefObject<MicPitchSource | null>
  latest: React.RefObject<PitchFrame | null>
  micError: string
  setMicError: (s: string) => void
  onHeard: (hz: number) => void
  onBack: () => void
}) {
  const [phase, setPhase] = useState<'ready' | 'listening'>('ready')
  const [secondsLeft, setSecondsLeft] = useState(5)
  const [live, setLive] = useState<number | null>(null)
  const collected = useRef<number[]>([])

  async function begin() {
    setMicError('')
    try {
      const mic = (source.current ??= new MicPitchSource())
      // The tonic only sets the window the detector favours; the hum being
      // measured here is deliberately unconstrained by it.
      await mic.start(shrutiHz('C#3'))
      mic.subscribe((frame) => {
        latest.current = frame
      })
      setPhase('listening')
    } catch {
      setMicError(
        'The microphone could not be opened. Check that your browser is allowed to use it, then try again.',
      )
    }
  }

  useEffect(() => {
    if (phase !== 'listening') return
    collected.current = []
    setSecondsLeft(5)

    const sample = setInterval(() => {
      const f = latest.current
      if (f?.hz != null) {
        collected.current.push(f.hz)
        setLive(f.hz)
      }
    }, 50)
    const tick = setInterval(() => setSecondsLeft((s) => s - 1), 1000)
    const finish = setTimeout(() => {
      clearInterval(sample)
      clearInterval(tick)
      const heard = collected.current
      if (heard.length < 15) {
        setMicError('Not enough sound was picked up. Sing a little louder and try again.')
        setPhase('ready')
        return
      }
      const sorted = [...heard].sort((a, b) => a - b)
      onHeard(sorted[Math.floor(sorted.length / 2)])
    }, 5000)

    return () => {
      clearInterval(sample)
      clearInterval(tick)
      clearTimeout(finish)
    }
  }, [phase, latest, onHeard, setMicError])

  return (
    <>
      <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-turmeric)]">
        Now hum a note that feels easy
      </h2>
      <p className="text-[15px] leading-relaxed">
        Not high, not low, not impressive — the pitch your voice falls into on its own
        when you hum without thinking. Hold it steady for five seconds on "aa" or a
        closed hum. The app listens and works out where your Sa should sit.
      </p>

      {phase === 'ready' && (
        <>
          {micError && <p className="text-sm text-[var(--color-vermilion)]">{micError}</p>}
          <div className="flex flex-wrap gap-3">
            <button onClick={() => void begin()} className="btn-primary">
              Start listening
            </button>
            <button onClick={onBack} className="btn-ghost">
              Back
            </button>
          </div>
          <p className="text-sm text-[var(--color-muted)]">
            Your voice is analysed on this device and never leaves it.
          </p>
        </>
      )}

      {phase === 'listening' && (
        <div className="flex flex-col items-center gap-2 py-4">
          <p className="font-[family-name:var(--font-mono)] text-5xl text-[var(--color-turmeric)]">
            {secondsLeft}
          </p>
          <p className="text-sm text-[var(--color-muted)]">
            {live ? `hearing ${live.toFixed(0)} Hz` : 'listening…'}
          </p>
        </div>
      )}
    </>
  )
}

function StepDots({ step }: { step: Step }) {
  const steps: Step[] = ['why', 'listen', 'hum', 'judge', 'settled']
  const at = steps.indexOf(step)
  return (
    <div className="flex items-center gap-2" aria-hidden>
      {steps.map((s, i) => (
        <span
          key={s}
          className="h-1.5 flex-1 rounded-full transition-colors"
          style={{
            background:
              i <= at ? 'var(--color-brass)' : 'color-mix(in srgb, var(--color-muted) 25%, transparent)',
          }}
        />
      ))}
    </div>
  )
}

function TermLink({
  id,
  onOpenTerm,
  children,
}: {
  id: string
  onOpenTerm?: (termId: string) => void
  children: React.ReactNode
}) {
  if (!onOpenTerm) return <strong>{children}</strong>
  return (
    <button
      onClick={() => onOpenTerm(id)}
      className="border-b border-dotted border-[var(--color-brass)] text-[var(--color-brass)] hover:text-[var(--color-turmeric)]"
    >
      {children}
    </button>
  )
}

/** "D3 — 2 kattai", the way a teacher would name it. */
function labelFor(id: string): string {
  const option = findShruti(id)
  return option ? `${option.id} (${option.kattai} kattai)` : id
}
