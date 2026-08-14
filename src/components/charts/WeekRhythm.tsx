import {
  WEEKDAY_SHORT,
  type DayRecord,
  type HourBucket,
  type TrendPoint,
  type WeekRow,
  type WeekdayStat,
} from '../../state/rhythm'

/**
 * The week, four ways.
 *
 * Each view answers a different question a singer cannot answer from a streak:
 * which day fails, at what hour practice happens, whether a weak day is a
 * lasting shape or a bad fortnight, and whether consistency itself is moving.
 */

export function WeekdayBars({ stats }: { stats: WeekdayStat[] }) {
  const anyHistory = stats.some((s) => s.elapsed > 0)
  if (!anyHistory) return <Empty>No days recorded yet.</Empty>

  return (
    <div>
      <div className="flex items-end justify-between gap-2" style={{ height: 132 }}>
        {stats.map((stat) => {
          const height = stat.elapsed === 0 ? 0 : Math.max(3, stat.rate * 116)
          const strong = stat.rate >= 0.7
          const weak = stat.rate < 0.4 && stat.elapsed > 0
          return (
            <div key={stat.weekday} className="flex flex-1 flex-col items-center justify-end gap-1">
              <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-muted)]">
                {stat.elapsed === 0 ? '–' : `${Math.round(stat.rate * 100)}%`}
              </span>
              <div
                className="w-full rounded-t-sm transition-[height]"
                style={{
                  height,
                  background: strong
                    ? 'var(--color-turmeric)'
                    : weak
                      ? 'color-mix(in srgb, var(--color-vermilion) 70%, transparent)'
                      : 'var(--color-brass)',
                }}
                title={`${stat.met} of ${stat.elapsed} met · median ${Math.round(stat.medianMinutes)} min`}
              />
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex justify-between gap-2">
        {stats.map((stat) => (
          <span
            key={stat.weekday}
            className="flex-1 text-center text-[11px] text-[var(--color-muted)]"
          >
            {WEEKDAY_SHORT[stat.weekday]}
          </span>
        ))}
      </div>
    </div>
  )
}

export function TimeOfDayChart({ buckets }: { buckets: HourBucket[] }) {
  const peak = Math.max(...buckets.map((b) => b.sessions), 1)
  if (buckets.every((b) => b.sessions === 0)) return <Empty>No sittings recorded yet.</Empty>

  return (
    <div>
      <div className="flex items-end gap-[2px]" style={{ height: 96 }}>
        {buckets.map((bucket) => (
          <div
            key={bucket.hour}
            className="flex-1 rounded-t-[2px]"
            style={{
              height: bucket.sessions === 0 ? 2 : Math.max(4, (bucket.sessions / peak) * 92),
              background:
                bucket.sessions === 0
                  ? 'color-mix(in srgb, var(--color-muted) 25%, transparent)'
                  : 'var(--color-brass)',
            }}
            title={`${formatHour(bucket.hour)} — ${bucket.sessions} sitting${bucket.sessions === 1 ? '' : 's'}`}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-[var(--color-muted)]">
        <span>12am</span>
        <span>6am</span>
        <span>noon</span>
        <span>6pm</span>
        <span>12am</span>
      </div>
    </div>
  )
}

export function WeekGrid({ rows }: { rows: WeekRow[] }) {
  return (
    <div>
      <div className="mb-1 grid grid-cols-[auto_repeat(7,1fr)] gap-1">
        <span />
        {[1, 2, 3, 4, 5, 6, 0].map((d) => (
          <span key={d} className="text-center text-[10px] text-[var(--color-muted)]">
            {WEEKDAY_SHORT[d][0]}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        {rows.map((row) => (
          <div key={row.weekStart} className="grid grid-cols-[auto_repeat(7,1fr)] items-center gap-1">
            <span className="w-10 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-muted)]">
              {row.weekStart.slice(5).replace('-', '/')}
            </span>
            {row.cells.map((cell, i) => (
              <div
                key={i}
                className="aspect-square rounded-[3px]"
                style={{ background: cellColour(cell) }}
                title={cell ? `${cell.day} — ${Math.round(cell.minutes)} min` : ''}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function cellColour(cell: DayRecord | null): string {
  if (!cell) return 'transparent'
  if (cell.met) return 'var(--color-turmeric)'
  if (cell.minutes > 0) return 'color-mix(in srgb, var(--color-brass) 55%, transparent)'
  return 'color-mix(in srgb, var(--color-muted) 20%, transparent)'
}

export function ConsistencyTrend({ points }: { points: TrendPoint[] }) {
  if (points.length < 2) return <Empty>Not enough history to plot yet.</Empty>

  const w = 320
  const h = 96
  const step = w / (points.length - 1)
  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i * step).toFixed(1)} ${(h - p.score * h).toFixed(1)}`)
    .join(' ')
  const latest = points.at(-1)!.score

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-24 w-full" preserveAspectRatio="none">
        {[0.25, 0.5, 0.75].map((y) => (
          <line
            key={y}
            x1={0}
            x2={w}
            y1={h - y * h}
            y2={h - y * h}
            stroke="color-mix(in srgb, var(--color-muted) 22%, transparent)"
            strokeWidth={1}
          />
        ))}
        <path d={path} fill="none" stroke="var(--color-leaf)" strokeWidth={2} />
        <circle cx={w} cy={h - latest * h} r={3} fill="var(--color-leaf)" />
      </svg>
      <p className="mt-1 text-xs text-[var(--color-muted)]">
        Share of each trailing four weeks that met the goal — {Math.round(latest * 100)}% now.
      </p>
    </div>
  )
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-6 text-center text-sm text-[var(--color-muted)]">{children}</p>
}

function formatHour(hour: number): string {
  if (hour === 0) return '12am'
  if (hour === 12) return 'noon'
  return hour < 12 ? `${hour}am` : `${hour - 12}pm`
}
