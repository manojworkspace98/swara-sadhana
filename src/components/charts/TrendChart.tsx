import { useMemo } from 'react'

export interface TrendPoint {
  day: string
  value: number | null
}

/**
 * A single measure over time, with a rolling mean laid over the daily points.
 *
 * Daily singing scores are noisy — a hoarse morning is not a loss of skill.
 * The faint points are what actually happened; the solid line is the seven-day
 * mean, which is the part that answers "am I getting better?".
 */
export function TrendChart({
  points,
  label,
  unit = '',
  min,
  max,
  height = 160,
  colour = 'var(--color-brass)',
  rollingDays = 7,
}: {
  points: TrendPoint[]
  label: string
  unit?: string
  min?: number
  max?: number
  height?: number
  colour?: string
  rollingDays?: number
}) {
  const { path, dots, lo, hi, latest, change } = useMemo(() => {
    const values = points.map((p) => p.value).filter((v): v is number => v != null)
    if (values.length === 0) {
      return { path: '', dots: [], lo: 0, hi: 1, latest: null, change: null }
    }

    const lo = min ?? Math.min(...values)
    const hi = max ?? Math.max(...values)
    const span = hi - lo || 1

    const w = 100
    const x = (i: number) => (points.length === 1 ? w / 2 : (i / (points.length - 1)) * w)
    const y = (v: number) => 100 - ((v - lo) / span) * 100

    const rolled = points.map((_, i) => {
      const window = points
        .slice(Math.max(0, i - rollingDays + 1), i + 1)
        .map((p) => p.value)
        .filter((v): v is number => v != null)
      return window.length ? window.reduce((a, b) => a + b, 0) / window.length : null
    })

    let path = ''
    let pen = false
    rolled.forEach((v, i) => {
      if (v == null) {
        pen = false
        return
      }
      path += `${pen ? 'L' : 'M'}${x(i).toFixed(2)},${y(v).toFixed(2)} `
      pen = true
    })

    const dots = points
      .map((p, i) => (p.value == null ? null : { x: x(i), y: y(p.value) }))
      .filter((d): d is { x: number; y: number } => d !== null)

    const firstRolled = rolled.find((v) => v != null) ?? null
    const lastRolled = [...rolled].reverse().find((v) => v != null) ?? null

    return {
      path: path.trim(),
      dots,
      lo,
      hi,
      latest: lastRolled,
      change: firstRolled != null && lastRolled != null ? lastRolled - firstRolled : null,
    }
  }, [points, min, max, rollingDays])

  const empty = dots.length === 0

  return (
    <figure className="m-0">
      <figcaption className="mb-2 flex items-baseline justify-between gap-3">
        <span className="eyebrow">{label}</span>
        {latest != null && (
          <span className="font-[family-name:var(--font-mono)] text-sm">
            {latest.toFixed(latest >= 100 ? 0 : 1)}
            {unit}
            {change != null && Math.abs(change) >= 0.05 && (
              <span
                className="ml-2"
                style={{ color: change > 0 ? 'var(--color-leaf)' : 'var(--color-kumkum)' }}
              >
                {change > 0 ? '▲' : '▼'} {Math.abs(change).toFixed(1)}
              </span>
            )}
          </span>
        )}
      </figcaption>

      {empty ? (
        <div
          className="grid place-items-center rounded-lg border border-dashed border-[var(--color-line)] text-xs text-[var(--color-muted)]"
          style={{ height }}
        >
          Not enough practice yet to plot.
        </div>
      ) : (
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ width: '100%', height }}
          role="img"
          aria-label={`${label}: currently ${latest?.toFixed(1)}${unit}`}
        >
          {[0, 50, 100].map((g) => (
            <line
              key={g}
              x1="0"
              x2="100"
              y1={g}
              y2={g}
              stroke="var(--color-line)"
              strokeWidth="0.4"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {dots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r="0.9" fill={colour} opacity="0.35" />
          ))}
          <path
            d={path}
            fill="none"
            stroke={colour}
            strokeWidth="1.6"
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      )}

      {!empty && (
        <div className="mt-1 flex justify-between font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-muted)]">
          <span>
            {lo.toFixed(0)}
            {unit}
          </span>
          <span>
            {hi.toFixed(0)}
            {unit}
          </span>
        </div>
      )}
    </figure>
  )
}

/**
 * Vocal range over time, drawn as the band between the lowest and highest
 * notes held steadily. Range opening up is the slowest and most encouraging
 * thing a beginner can watch, which is why it gets its own chart rather than a
 * number.
 */
export function RangeBandChart({
  points,
  height = 170,
}: {
  points: { day: string; lowMidi: number | null; highMidi: number | null }[]
  height?: number
}) {
  const usable = points.filter((p) => p.lowMidi != null && p.highMidi != null)
  if (usable.length < 2) {
    return (
      <figure className="m-0">
        <figcaption className="eyebrow mb-2">Vocal range</figcaption>
        <div
          className="grid place-items-center rounded-lg border border-dashed border-[var(--color-line)] text-xs text-[var(--color-muted)]"
          style={{ height }}
        >
          Practise on a few more days to see your range open up.
        </div>
      </figure>
    )
  }

  const lows = usable.map((p) => p.lowMidi!)
  const highs = usable.map((p) => p.highMidi!)
  const lo = Math.min(...lows) - 2
  const hi = Math.max(...highs) + 2
  const span = hi - lo || 1

  const x = (i: number) => (i / (points.length - 1)) * 100
  const y = (m: number) => 100 - ((m - lo) / span) * 100

  const top = points
    .map((p, i) => (p.highMidi == null ? null : `${x(i)},${y(p.highMidi)}`))
    .filter(Boolean)
  const bottom = points
    .map((p, i) => (p.lowMidi == null ? null : `${x(i)},${y(p.lowMidi)}`))
    .filter(Boolean)
    .reverse()

  const last = usable.at(-1)!
  const first = usable[0]
  const semitones = Math.round(last.highMidi! - last.lowMidi!)
  const grown = semitones - Math.round(first.highMidi! - first.lowMidi!)

  return (
    <figure className="m-0">
      <figcaption className="mb-2 flex items-baseline justify-between">
        <span className="eyebrow">Vocal range</span>
        <span className="font-[family-name:var(--font-mono)] text-sm">
          {noteName(last.lowMidi!)}–{noteName(last.highMidi!)}
          <span className="ml-2 text-[var(--color-muted)]">
            {semitones} semitones
          </span>
          {grown > 0 && (
            <span className="ml-2" style={{ color: 'var(--color-leaf)' }}>
              ▲ {grown}
            </span>
          )}
        </span>
      </figcaption>
      <div className="relative">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ width: '100%', height }}
          role="img"
          aria-label={`Vocal range, currently ${noteName(last.lowMidi!)} to ${noteName(
            last.highMidi!,
          )}, ${semitones} semitones wide`}
        >
          <defs>
            <linearGradient id="range-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-turmeric)" stopOpacity="0.32" />
              <stop offset="100%" stopColor="var(--color-brass)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <polygon points={[...top, ...bottom].join(' ')} fill="url(#range-fill)" />
          <polyline
            points={top.join(' ')}
            fill="none"
            stroke="var(--color-turmeric)"
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
          />
          <polyline
            points={[...bottom].reverse().join(' ')}
            fill="none"
            stroke="var(--color-brass)"
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span className="pointer-events-none absolute top-0 left-0 rounded bg-[var(--color-ink)]/75 px-1 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-turmeric)]">
          {noteName(hi)}
        </span>
        <span className="pointer-events-none absolute bottom-0 left-0 rounded bg-[var(--color-ink)]/75 px-1 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-brass)]">
          {noteName(lo)}
        </span>
      </div>
      <p className="mt-1 text-xs text-[var(--color-muted)]">
        The band is every note you held steadily that day. It widens as your voice opens.
      </p>
    </figure>
  )
}

const PITCH_CLASSES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

function noteName(midi: number): string {
  const m = Math.round(midi)
  return `${PITCH_CLASSES[((m % 12) + 12) % 12]}${Math.floor(m / 12) - 1}`
}

/** Minutes practised per week — the plainest measure of whether it is happening. */
export function WeeklyBars({
  weeks,
  goalMinPerWeek,
  height = 130,
}: {
  weeks: { label: string; minutes: number }[]
  goalMinPerWeek?: number
  height?: number
}) {
  if (weeks.length === 0) return null
  const max = Math.max(...weeks.map((w) => w.minutes), goalMinPerWeek ?? 0, 1)

  return (
    <figure className="m-0">
      <figcaption className="eyebrow mb-2">Minutes each week</figcaption>
      <div className="flex items-end gap-1" style={{ height }}>
        {weeks.map((w) => (
          <div key={w.label} className="group relative flex flex-1 flex-col justify-end">
            <div
              className="rounded-t-sm bg-[var(--color-brass)] transition-all"
              style={{
                height: `${(w.minutes / max) * 100}%`,
                opacity: w.minutes >= (goalMinPerWeek ?? 0) ? 0.95 : 0.5,
              }}
              title={`${w.label}: ${Math.round(w.minutes)} min`}
            />
          </div>
        ))}
      </div>
      {goalMinPerWeek != null && (
        <p className="mt-1 text-xs text-[var(--color-muted)]">
          Solid bars are weeks you met your daily goal on average.
        </p>
      )}
    </figure>
  )
}
