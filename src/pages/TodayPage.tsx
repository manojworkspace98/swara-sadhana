import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { PageHeader } from '../components/PageHeader'
import { Diya, KolamDivider } from '../components/Ornament'
import { KolamCalendar, type CalendarDay } from '../components/charts/KolamCalendar'
import { useApp } from '../state/appStore'
import { addDays, dayKey } from '../state/day'
import { fillDays, voiceDailyRange } from '../state/sessions'
import { currentStreak, streakAtRisk } from '../state/streaks'
import { buildPlan } from '../state/practicePlan'
import {
  describeGoal,
  goalForProfile,
  goalMet,
  goalProgress,
  isRestDay,
  remainingText,
} from '../state/goals'
import type { PracticePlanItem, VoiceDaily } from '../state/types'

const MINI_WEEKS = 8

export function TodayPage() {
  const { activeProfile, progress } = useApp()
  const [rows, setRows] = useState<VoiceDaily[] | null>(null)

  useEffect(() => {
    if (!activeProfile) return
    const today = dayKey(Date.now())
    void voiceDailyRange(activeProfile.id, addDays(today, -MINI_WEEKS * 7), today).then(
      setRows,
    )
  }, [activeProfile])

  if (!activeProfile || !progress) return null

  const today = dayKey(Date.now())
  const from = addDays(today, -MINI_WEEKS * 7)
  const filled = fillDays(rows ?? [], from, today)
  const frozen = new Set(progress.streak.freezeUsedOn)
  const calendar: CalendarDay[] = filled.map(({ day, row }) => ({
    day,
    minutes: (row?.practiceSec ?? 0) / 60,
    frozen: frozen.has(day),
  }))

  const todayMin = (rows?.find((r) => r.day === today)?.practiceSec ?? 0) / 60
  const goal = goalForProfile(activeProfile)
  // Exercises and clean passes come from today's sessions; until those are
  // wired through, minutes carry the day and the other rules read as zero.
  const totals = { minutes: todayMin, exercises: 0, cleanPasses: 0 }
  const met = goalMet(goal, totals, Date.now())
  const resting = isRestDay(goal, Date.now())
  const streak = currentStreak(progress.streak)
  const atRisk = streakAtRisk(progress.streak) && !met

  // The curriculum is still being wired in; until then the plan is built from
  // whatever lesson ids progress already knows about.
  const plan = buildPlan({
    minutes: goal.rules.find((r) => r.metric === 'minutes')?.target ?? 30,
    scores: progress.lessonScores,
    availableLessonIds: Object.keys(progress.lessonScores),
    warmupLessonId: null,
  })

  return (
    <>
      <PageHeader
        eyebrow={greeting()}
        title={activeProfile.name}
        lead={
          resting
            ? 'A rest day. Sing only if you feel like it — the streak is safe either way.'
            : met
              ? "Today's goal is met. Anything more is a bonus."
              : 'Warm up, work the current lesson, revisit one older one.'
        }
      />

      <div className="grid max-w-4xl gap-6 lg:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-6">
          <section className="card p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-lg">Today's practice</h2>
              <span className="font-[family-name:var(--font-mono)] text-sm text-[var(--color-muted)]">
                {remainingText(goal, totals) ?? describeGoal(goal) + ' done'}
              </span>
            </div>

            <GoalBar progress={resting ? 1 : goalProgress(goal, totals)} />

            {plan.length === 0 ? (
              <div className="mt-5">
                <p className="mb-4 text-sm text-[var(--color-muted)]">
                  Nothing scheduled yet. Start with the tuner: find the sruti that suits
                  your voice, and hold a steady Sa against the drone.
                </p>
                <Link
                  to="/tuner"
                  className="inline-block min-h-11 rounded-lg bg-[var(--color-brass)] px-5 py-2.5 font-medium text-[var(--color-ink)]"
                >
                  Open the tuner
                </Link>
              </div>
            ) : (
              <ol className="mt-5 flex flex-col gap-3">
                {plan.map((item, i) => (
                  <PlanRow key={i} item={item} />
                ))}
              </ol>
            )}
          </section>

          <section className="card p-5 md:p-6">
            <div className="mb-3 flex items-baseline justify-between gap-4">
              <h2 className="text-lg">Last eight weeks</h2>
              <Link to="/progress" className="text-sm text-[var(--color-muted)] underline underline-offset-4">
                See everything
              </Link>
            </div>
            {rows === null ? (
              <p className="text-sm text-[var(--color-muted)]">Reading your practice book…</p>
            ) : (
              <KolamCalendar days={calendar} weeks={MINI_WEEKS} endDay={today} />
            )}
          </section>
        </div>

        <aside className="flex flex-col gap-6">
          <section className="card flex flex-col items-center p-6 text-center">
            <Diya lit={streak > 0} className="h-14 w-12 text-[var(--color-brass)]" />
            <p className="mt-3 font-[family-name:var(--font-mono)] text-4xl">{streak}</p>
            <p className="eyebrow mt-1">
              {streak === 1 ? 'day running' : 'days running'}
            </p>
            <KolamDivider className="my-4 text-[var(--color-brass)] opacity-50" width={120} />
            <p className="text-xs text-[var(--color-muted)]">
              {atRisk
                ? 'Practise today to keep the lamp lit.'
                : progress.streak.freezesRemaining > 0
                  ? 'One missed day this week is covered.'
                  : 'This week’s spare day is already used.'}
            </p>
          </section>

          <section className="card p-5">
            <p className="eyebrow mb-2">Sruti</p>
            <p className="font-[family-name:var(--font-mono)] text-2xl">
              {activeProfile.shruti}
            </p>
            <Link
              to="/tuner"
              className="mt-3 inline-block text-sm text-[var(--color-muted)] underline underline-offset-4"
            >
              Check it against your voice
            </Link>
          </section>
        </aside>
      </div>
    </>
  )
}

function PlanRow({ item }: { item: PracticePlanItem }) {
  const label: Record<PracticePlanItem['kind'], string> = {
    warmup: 'Warm up',
    review: 'Revise',
    lesson: 'Lesson',
    stretch: 'Free singing',
  }
  const body = (
    <>
      <span className="flex items-baseline gap-2">
        <span className="eyebrow">{label[item.kind]}</span>
        <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)]">
          {item.targetMin} min
        </span>
      </span>
      <span className="mt-1 block text-sm">{item.reason}</span>
    </>
  )

  return (
    <li className="rounded-lg border border-[var(--color-line)] p-3">
      {item.lessonId ? (
        <Link to={`/practice/${item.lessonId}`} className="block">
          {body}
        </Link>
      ) : (
        <div>{body}</div>
      )}
    </li>
  )
}

function GoalBar({ progress }: { progress: number }) {
  const pct = Math.min(100, progress * 100)
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-ink-3)]"
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progress toward today's goal"
    >
      <div
        className="h-full rounded-full transition-[width] duration-500"
        style={{
          width: `${pct}%`,
          background:
            pct >= 100
              ? 'var(--color-leaf)'
              : 'linear-gradient(90deg, var(--color-brass-dim), var(--color-turmeric))',
        }}
      />
    </div>
  )
}

function greeting(): string {
  const h = new Date().getHours()
  if (h < 5) return 'Still up'
  if (h < 12) return 'This morning'
  if (h < 17) return 'This afternoon'
  return 'This evening'
}
