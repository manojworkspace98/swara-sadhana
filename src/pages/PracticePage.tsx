import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { PageHeader } from '../components/PageHeader'
import { NotationView } from '../components/NotationView'
import { SwaraLadder } from '../components/SwaraLadder'
import { TalaBar } from '../components/TalaBar'
import { LivePitchCanvas } from '../components/LivePitchCanvas'
import { NoteVerdictStrip } from '../components/NoteVerdictStrip'
import { SCORING_PRESETS } from '../engine/scoring/pitchScore'
import { useApp } from '../state/appStore'
import { shrutiHz } from '../engine/shruti'
import { RAGAS, ragaSemitones } from '../content/ragas'
import { TALAS } from '../content/talas'
import { lessonById } from '../content/generators/varisai'
import { usePracticeSession } from '../practice/usePracticeSession'
import { useWakeLock } from '../state/usePracticeTimer'
import { recordPractice } from '../state/recordPractice'
import { saveTake } from '../state/recordings'
import { getProgress } from '../state/profiles'
import { goalForProfile } from '../state/goals'
import type { Kalam } from '../state/types'

/** Aksharas per minute at each speed. Slow enough to be singable, not sluggish. */
const DEFAULT_BPM: Record<Kalam, number> = { 1: 60, 2: 60, 3: 60 }

export function PracticePage() {
  const { lessonId } = useParams()
  const { activeProfile, settings, setProgress } = useApp()
  const [kalam, setKalam] = useState<Kalam>(1)
  const [record, setRecord] = useState(false)
  const [saved, setSaved] = useState<string | null>(null)

  const lesson = lessonId ? lessonById(lessonId) : undefined
  const raga = lesson ? RAGAS[lesson.ragaId] : undefined
  const tala = lesson ? TALAS[lesson.talaId] : undefined
  const saHz = shrutiHz(activeProfile?.shruti ?? 'C#3')
  const semitones = useMemo(() => (raga ? ragaSemitones(raga) : []), [raga])

  const session = usePracticeSession({
    lesson: lesson!,
    raga: raga!,
    tala: tala!,
    saHz,
    kalam,
    aksharaBpm: DEFAULT_BPM[kalam],
    droneVolume: settings?.droneVolume ?? 0.45,
    referenceVolume: settings?.referenceVolume ?? 0.6,
    metronomeVolume: settings?.metronomeVolume ?? 0.5,
    latencyOffsetMs: settings?.latencyOffsetMs ?? 0,
    preset: settings?.scoringPreset ?? 'beginner',
    record,
  })

  useWakeLock(session.phase === 'singing' || session.phase === 'listen')

  // Keyboard shortcuts, so a singer with a tablet on a stand can drive it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return
      if (e.key === ' ') {
        e.preventDefault()
        session.phase === 'idle' ? void session.sing() : session.abort()
      } else if (e.key === 'd') void session.toggleDrone()
      else if (e.key === 'l') void session.listen()
      else if (['1', '2', '3'].includes(e.key)) setKalam(Number(e.key) as Kalam)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [session])

  // Save the attempt once, when a run finishes.
  useEffect(() => {
    const r = session.result
    if (!r || !lesson || !activeProfile || saved === lessonKey(lesson.id, r)) return
    setSaved(lessonKey(lesson.id, r))

    const now = Date.now()
    const durationSec = Math.round(
      session.timeline.current.at(-1)
        ? session.timeline.current.at(-1)!.t1 - session.timeline.current[0].t0
        : 60,
    )

    void (async () => {
      const outcome = await recordPractice({
        profileId: activeProfile.id,
        goal: goalForProfile(activeProfile),
        session: {
          lessonId: lesson.id,
          activity: 'lesson',
          startedAt: now - durationSec * 1000,
          endedAt: now,
          durationSec,
          pitchAccuracy: r.pitchAccuracy,
          rhythmAccuracy: r.rhythmAccuracy,
          kalam,
        },
        attempt: {
          lessonId: lesson.id,
          pitchAccuracy: r.pitchAccuracy,
          rhythmAccuracy: r.rhythmAccuracy,
          kalam,
          durationSec,
          clean: r.clean,
        },
        lessonKinds: { [lesson.id]: lesson.kind },
      })

      if (r.take) {
        await saveTake({
          profileId: activeProfile.id,
          lessonId: lesson.id,
          title: `${lesson.title} · speed ${kalam}`,
          saHz,
          pitchAccuracy: r.pitchAccuracy,
          rhythmAccuracy: r.rhythmAccuracy,
          take: r.take,
        })
      }

      await setProgress(await getProgress(activeProfile.id))
      void outcome
    })()
  }, [session.result, lesson, activeProfile, kalam, saHz, saved, setProgress, session.timeline])

  if (!lesson || !raga || !tala) {
    return (
      <>
        <PageHeader eyebrow="Practice" title="Lesson not found" />
        <Link to="/learn" className="text-[var(--color-brass)] underline underline-offset-4">
          Back to the curriculum
        </Link>
      </>
    )
  }

  const busy = session.phase !== 'idle' && session.phase !== 'done'

  return (
    <>
      <PageHeader
        eyebrow={`${raga.name} · ${tala.name}`}
        title={lesson.title}
        lead={lesson.subtitle}
      />

      <div className="grid max-w-5xl gap-6 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-5">
          <section className="card p-5">
            <TalaBar
              tala={tala}
              activeAkshara={busy ? session.akshara : -1}
              avartana={session.avartana}
            />
          </section>

          <section className="card p-4">
            <div className="mb-2 flex items-baseline justify-between">
              <p className="eyebrow">Live</p>
              <p className="text-xs text-[var(--color-muted)]">
                Stay inside the gold lane and the note counts.
              </p>
            </div>
            <LivePitchCanvas
              timeline={session.timeline}
              latest={session.latest}
              ragaSemitones={semitones}
              now={session.now}
              toleranceCents={SCORING_PRESETS[settings?.scoringPreset ?? 'beginner'].bandCents}
              height={250}
            />
            <div className="mt-3">
              <NoteVerdictStrip
                timeline={session.timeline}
                frames={session.frames}
                now={session.now}
                config={SCORING_PRESETS[settings?.scoringPreset ?? 'beginner']}
                active={session.phase === 'singing' || session.phase === 'scoring'}
              />
            </div>
          </section>

          <section className="card overflow-hidden p-5">
            <NotationView
              lines={lesson.notation}
              ragaSemitones={semitones}
              aksharaCount={tala.aksharaCount}
              angaStartIndices={tala.angaStartIndices}
            />
          </section>

          {session.error && (
            <p className="card border-[var(--color-kumkum)]/50 p-4 text-sm text-[var(--color-kumkum)]">
              {session.error}
            </p>
          )}

          {session.result && session.phase === 'done' && (
            <ScoreCard result={session.result} onAgain={session.reset} />
          )}
        </div>

        <aside className="flex flex-col gap-5">
          <section className="card p-4">
            <p className="eyebrow mb-2">Your voice</p>
            <SwaraLadder
              saHz={saHz}
              ragaSemitones={semitones}
              latest={session.latest}
              height={260}
            />
          </section>

          <section className="card flex flex-col gap-3 p-4">
            <div>
              <p className="eyebrow mb-2">Speed</p>
              <div className="flex gap-2">
                {([1, 2, 3] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => setKalam(k)}
                    disabled={busy}
                    aria-pressed={k === kalam}
                    className={`min-h-10 flex-1 rounded-lg border text-sm ${
                      k === kalam
                        ? 'border-[var(--color-brass)] bg-[var(--color-ink-3)]'
                        : 'border-[var(--color-line)]'
                    } disabled:opacity-40`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => void session.toggleDrone()}
              className={`min-h-11 rounded-lg border px-3 py-2 text-sm ${
                session.droneOn
                  ? 'border-[var(--color-brass)] text-[var(--color-turmeric)]'
                  : 'border-[var(--color-line)]'
              }`}
            >
              {session.droneOn ? 'Drone on' : 'Start the drone'}
            </button>

            <button
              onClick={() => void session.listen()}
              disabled={busy}
              className="min-h-11 rounded-lg border border-[var(--color-line)] px-3 py-2 text-sm disabled:opacity-40"
            >
              Play it for me
            </button>

            <label className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
              <input
                type="checkbox"
                checked={record}
                onChange={(e) => setRecord(e.target.checked)}
                disabled={busy}
              />
              Record this take
            </label>

            <button
              onClick={() => (busy ? session.abort() : void session.sing())}
              className={`min-h-12 rounded-lg px-4 py-2.5 font-medium ${
                busy
                  ? 'border border-[var(--color-line)]'
                  : 'bg-[var(--color-brass)] text-[var(--color-ink)]'
              }`}
            >
              {phaseLabel(session.phase)}
            </button>

            <p className="text-xs text-[var(--color-muted)]">
              Space to start or stop, D for the drone, L to hear it, 1–3 for speed.
            </p>
          </section>
        </aside>
      </div>
    </>
  )
}

function phaseLabel(phase: string): string {
  switch (phase) {
    case 'arming':
      return 'Opening the microphone…'
    case 'countIn':
      return 'Counting in — stop'
    case 'singing':
      return 'Singing — stop'
    case 'listen':
      return 'Playing — stop'
    case 'scoring':
      return 'Scoring…'
    default:
      return 'Sing it'
  }
}

function ScoreCard({
  result,
  onAgain,
}: {
  result: NonNullable<ReturnType<typeof usePracticeSession>['result']>
  onAgain: () => void
}) {
  const rushing = result.tendencyMs < -40
  const dragging = result.tendencyMs > 40

  return (
    <section className="card p-5">
      <h2 className="mb-4 text-lg">How that went</h2>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <p className="eyebrow">In tune</p>
          <p className="font-[family-name:var(--font-mono)] text-3xl">
            {Math.round(result.pitchAccuracy)}%
          </p>
        </div>
        <div>
          <p className="eyebrow">In time</p>
          <p className="font-[family-name:var(--font-mono)] text-3xl">
            {Math.round(result.rhythmAccuracy)}%
          </p>
        </div>
      </div>

      {(rushing || dragging) && (
        <p className="mb-3 text-sm text-[var(--color-muted)]">
          You are {rushing ? 'ahead of' : 'behind'} the beat by about{' '}
          {Math.abs(Math.round(result.tendencyMs))} ms on average.
        </p>
      )}

      {result.worst.length > 0 && (
        <div className="mb-4">
          <p className="eyebrow mb-2">Worth another look</p>
          <ul className="flex flex-col gap-1 text-sm">
            {result.worst.map((w, i) => (
              <li key={i} className="text-[var(--color-muted)]">
                Note {w.index + 1}:{' '}
                {w.score.verdict === 'not-sung'
                  ? 'not sung'
                  : w.score.centsError != null
                    ? `${Math.abs(Math.round(w.score.centsError))}¢ ${
                        w.score.centsError < 0 ? 'flat' : 'sharp'
                      }`
                    : w.score.verdict}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onAgain}
        className="min-h-11 rounded-lg bg-[var(--color-brass)] px-5 py-2 font-medium text-[var(--color-ink)]"
      >
        Again
      </button>
    </section>
  )
}

function lessonKey(id: string, r: { pitchAccuracy: number }): string {
  return `${id}:${r.pitchAccuracy.toFixed(3)}`
}
