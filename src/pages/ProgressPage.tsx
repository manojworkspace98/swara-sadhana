import { useEffect, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { KolamCalendar, type CalendarDay } from '../components/charts/KolamCalendar'
import { RangeBandChart, TrendChart, WeeklyBars } from '../components/charts/TrendChart'
import { Diya } from '../components/Ornament'
import {
  ConsistencyTrend,
  TimeOfDayChart,
  WeekGrid,
  WeekdayBars,
} from '../components/charts/WeekRhythm'
import { useApp } from '../state/appStore'
import { addDays, dayKey } from '../state/day'
import { dailyHistory, fillDays, groupByWeek, voiceDailyRange } from '../state/sessions'
import type { DayHistoryRow } from '../state/sessions'
import { currentStreak } from '../state/streaks'
import { goalForProfile, goalMet } from '../state/goals'
import {
  consistencyTrend,
  rhythmInsights,
  timeOfDay,
  toDayRecords,
  weekGrid,
  weekdayStats,
  type Insight,
} from '../state/rhythm'
import type { VoiceDaily } from '../state/types'

const WINDOW_DAYS = 182 // 26 weeks

export function ProgressPage() {
  const { activeProfile, progress } = useApp()
  const [rows, setRows] = useState<VoiceDaily[] | null>(null)
  const [history, setHistory] = useState<DayHistoryRow[] | null>(null)

  useEffect(() => {
    if (!activeProfile) return
    const today = dayKey(Date.now())
    const from = addDays(today, -WINDOW_DAYS)
    void voiceDailyRange(activeProfile.id, from, today).then(setRows)
    void dailyHistory(activeProfile.id, from, today).then(setHistory)
  }, [activeProfile])

  if (!activeProfile || !progress) return null

  const today = dayKey(Date.now())
  const from = addDays(today, -WINDOW_DAYS)
  const filled = fillDays(rows ?? [], from, today)
  const frozen = new Set(progress.streak.freezeUsedOn)

  const calendar: CalendarDay[] = filled.map(({ day, row }) => ({
    day,
    minutes: (row?.practiceSec ?? 0) / 60,
    frozen: frozen.has(day),
  }))

  const accuracy = filled.map(({ day, row }) => ({
    day,
    value: row?.avgPitchAccuracy ?? null,
  }))
  const steadiness = filled.map(({ day, row }) => ({
    day,
    value: row?.steadiness ?? null,
  }))
  const range = filled.map(({ day, row }) => ({
    day,
    lowMidi: row?.rangeLowMidi ?? null,
    highMidi: row?.rangeHighMidi ?? null,
  }))
  const weeks = groupByWeek(
    filled.map(({ day, row }) => ({ day, practiceSec: row?.practiceSec ?? 0 })),
  ).slice(-26)

  const totalMin = filled.reduce((s, f) => s + (f.row?.practiceSec ?? 0) / 60, 0)
  const daysPractised = filled.filter((f) => (f.row?.practiceSec ?? 0) > 0).length
  const streak = currentStreak(progress.streak)
  const loading = rows === null

  // The week's shape, judged against the goal in force now. Older days are
  // measured against today's goal rather than the one they were lived under,
  // which is the only comparison the data supports and is stated as such.
  const goal = goalForProfile(activeProfile)
  const historyRows = history ?? []
  const dayRecords = toDayRecords(
    historyRows.map((row) => ({
      day: row.day,
      minutes: row.minutes,
      met: goalMet(
        goal,
        { minutes: row.minutes, exercises: row.exercises, cleanPasses: row.cleanPasses },
        new Date(`${row.day}T12:00:00`),
      ),
    })),
    // Start the window at the first day with any history, so a new singer is
    // not shown five months of manufactured misses.
    historyRows[0]?.day ?? addDays(today, -27),
    today,
  )
  const sessionTimes = historyRows.flatMap((row) =>
    row.startedAt.map((startedAt) => ({ startedAt, durationSec: 0 })),
  )
  const stats = weekdayStats(dayRecords)
  const insights = rhythmInsights({
    days: dayRecords,
    sessions: sessionTimes,
    goal,
    today,
    hour: new Date().getHours(),
  })
  const rhythmLoading = history === null

  return (
    <>
      <PageHeader
        eyebrow="Sadhana"
        title="Progress"
        lead="What the practice has actually done to your voice, measured rather than guessed."
      />

      <div className="flex max-w-5xl flex-col gap-6">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Current streak"
            value={String(streak)}
            unit={streak === 1 ? 'day' : 'days'}
            icon={<Diya lit={streak > 0} className="h-7 w-6 text-[var(--color-brass)]" />}
          />
          <Stat label="Longest streak" value={String(progress.streak.longest)} unit="days" />
          <Stat
            label="Practised"
            value={String(daysPractised)}
            unit={`of last ${WINDOW_DAYS} days`}
          />
          <Stat label="Time at it" value={formatHours(totalMin)} unit="in six months" />
        </section>

        <section className="card p-5 md:p-6">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 className="text-lg">Practice calendar</h2>
            <p className="text-xs text-[var(--color-muted)]">
              The line joins days you practised, the way a kolam joins its dots.
            </p>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <>
              <KolamCalendar days={calendar} weeks={26} endDay={today} />
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[var(--color-muted)]">
                <Legend colour="#6d5528" text="Under 15 min" />
                <Legend colour="var(--color-brass)" text="30 min" />
                <Legend colour="var(--color-turmeric)" text="45 min and over" />
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-full border border-dashed border-[var(--color-brass)]" />
                  Streak held through a missed day
                </span>
              </div>
            </>
          )}
        </section>

        <section className="card p-5 md:p-6">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 className="text-lg">The shape of your week</h2>
            <p className="text-xs text-[var(--color-muted)]">
              Measured against your goal as it stands today.
            </p>
          </div>

          {rhythmLoading ? (
            <Loading />
          ) : (
            <>
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <p className="eyebrow mb-2">Which days hold</p>
                  <WeekdayBars stats={stats} />
                  <p className="mt-2 text-xs text-[var(--color-muted)]">
                    How often each weekday met the goal. The day that dips is the one
                    worth planning around.
                  </p>
                </div>
                <div>
                  <p className="eyebrow mb-2">When you sing</p>
                  <TimeOfDayChart buckets={timeOfDay(sessionTimes)} />
                  <p className="mt-2 text-xs text-[var(--color-muted)]">
                    A fixed hour is what turns practice into a habit. This shows whether
                    you have one yet.
                  </p>
                </div>
                <div>
                  <p className="eyebrow mb-2">Last eight weeks</p>
                  <WeekGrid rows={weekGrid(dayRecords, 8, today)} />
                  <p className="mt-2 text-xs text-[var(--color-muted)]">
                    Weeks run down, weekdays across — a weak day shows up as a column.
                  </p>
                </div>
                <div>
                  <p className="eyebrow mb-2">Consistency itself</p>
                  <ConsistencyTrend points={consistencyTrend(dayRecords, today)} />
                </div>
              </div>

              {insights.length > 0 && (
                <div className="mt-6 flex flex-col gap-3 border-t border-[var(--color-line)] pt-5">
                  {insights.map((insight) => (
                    <InsightCard key={insight.id} insight={insight} />
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="card p-5 md:p-6">
            {loading ? <Loading /> : <RangeBandChart points={range} />}
          </div>
          <div className="card p-5 md:p-6">
            {loading ? (
              <Loading />
            ) : (
              <>
                <TrendChart
                  points={accuracy}
                  label="Pitch accuracy"
                  unit="%"
                  min={0}
                  max={100}
                  colour="var(--color-leaf)"
                />
                <p className="mt-2 text-xs text-[var(--color-muted)]">
                  Faint dots are single days. The line is the seven-day average, which is
                  the part worth reading.
                </p>
              </>
            )}
          </div>
          <div className="card p-5 md:p-6">
            {loading ? (
              <Loading />
            ) : (
              <>
                <TrendChart
                  points={steadiness}
                  label="Steadiness of held notes"
                  unit=""
                  min={0}
                  max={100}
                  colour="var(--color-turmeric)"
                />
                <p className="mt-2 text-xs text-[var(--color-muted)]">
                  How little your pitch wanders on a karvai. Rising means the voice is
                  settling.
                </p>
              </>
            )}
          </div>
          <div className="card p-5 md:p-6">
            {loading ? (
              <Loading />
            ) : (
              <WeeklyBars
                weeks={weeks}
                goalMinPerWeek={activeProfile.dailyGoalMin * 7}
              />
            )}
          </div>
        </section>
      </div>
    </>
  )
}

const INSIGHT_STYLE: Record<Insight['tone'], { border: string; dot: string; label: string }> = {
  good: { border: 'var(--color-leaf)', dot: 'var(--color-leaf)', label: 'Holding' },
  watch: { border: 'var(--color-brass)', dot: 'var(--color-brass)', label: 'Watch' },
  act: { border: 'var(--color-vermilion)', dot: 'var(--color-vermilion)', label: 'Act on this' },
}

function InsightCard({ insight }: { insight: Insight }) {
  const style = INSIGHT_STYLE[insight.tone]
  return (
    <div
      className="rounded-md border-l-2 bg-[color-mix(in_srgb,var(--color-line)_28%,transparent)] px-4 py-3"
      style={{ borderLeftColor: style.border }}
    >
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: style.dot }}
          aria-hidden
        />
        <span className="eyebrow" style={{ color: style.border }}>
          {style.label}
        </span>
      </div>
      <p className="mt-1 text-sm text-[var(--color-ink)]">{insight.title}</p>
      <p className="mt-1 text-xs leading-relaxed text-[var(--color-muted)]">{insight.detail}</p>
    </div>
  )
}

function Stat({
  label,
  value,
  unit,
  icon,
}: {
  label: string
  value: string
  unit?: string
  icon?: React.ReactNode
}) {
  return (
    <div className="card flex items-center gap-3 p-4">
      {icon}
      <div>
        <p className="eyebrow">{label}</p>
        <p className="font-[family-name:var(--font-mono)] text-2xl">
          {value}
          {unit && (
            <span className="ml-1 text-xs text-[var(--color-muted)]">{unit}</span>
          )}
        </p>
      </div>
    </div>
  )
}

function Legend({ colour, text }: { colour: string; text: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="inline-block h-2.5 w-2.5 rounded-full"
        style={{ background: colour }}
      />
      {text}
    </span>
  )
}

function Loading() {
  return <p className="text-sm text-[var(--color-muted)]">Reading your practice book…</p>
}

function formatHours(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)}m`
  const h = minutes / 60
  return h >= 10 ? `${Math.round(h)}h` : `${h.toFixed(1)}h`
}
