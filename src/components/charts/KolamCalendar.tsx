import { addDays, dayKey, weekStart } from '../../state/day'

export interface CalendarDay {
  day: string
  minutes: number
  frozen?: boolean
}

/**
 * The practice year, drawn as a kolam.
 *
 * A kolam is laid at the threshold every morning: dots first, then one
 * continuous line looped around them. That is the same shape as a practice
 * habit, so the calendar uses it literally — each day is a pulli, and the line
 * threads only through days actually practised. A streak draws itself; a gap
 * is a place the line could not reach.
 */
export function KolamCalendar({
  days,
  weeks = 26,
  endDay = dayKey(Date.now()),
}: {
  days: CalendarDay[]
  weeks?: number
  endDay?: string
}) {
  const byDay = new Map(days.map((d) => [d.day, d]))

  const CELL = 14
  const GAP = 4
  const step = CELL + GAP
  const padX = 26
  const padY = 18

  // Columns are weeks running Monday to Sunday, oldest on the left.
  const lastMonday = weekStart(endDay)
  const columns: string[][] = []
  for (let w = weeks - 1; w >= 0; w--) {
    const monday = addDays(lastMonday, -w * 7)
    columns.push(Array.from({ length: 7 }, (_, i) => addDays(monday, i)))
  }

  const width = padX + columns.length * step
  const height = padY + 7 * step

  const cx = (col: number) => padX + col * step + CELL / 2
  const cy = (row: number) => padY + row * step + CELL / 2

  // The thread: it enters a day only if that day was practised, and only joins
  // to an immediately adjacent practised day, so it breaks exactly where the
  // habit did.
  const segments: string[] = []
  columns.forEach((col, ci) => {
    col.forEach((day, ri) => {
      if (!practised(byDay.get(day))) return
      const next = addDays(day, 1)
      const nextRi = ri === 6 ? 0 : ri + 1
      const nextCi = ri === 6 ? ci + 1 : ci
      if (nextCi >= columns.length) return
      if (columns[nextCi][nextRi] !== next) return
      if (!practised(byDay.get(next))) return
      // A shallow arc rather than a straight line — a kolam curves.
      const x1 = cx(ci)
      const y1 = cy(ri)
      const x2 = cx(nextCi)
      const y2 = cy(nextRi)
      const mx = (x1 + x2) / 2 + (y2 - y1) * 0.18
      const my = (y1 + y2) / 2 - (x2 - x1) * 0.18
      segments.push(`M${x1},${y1} Q${mx},${my} ${x2},${y2}`)
    })
  })

  const dayLabels = ['M', '', 'W', '', 'F', '', 'S']

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        role="img"
        aria-label={`Practice calendar for the last ${weeks} weeks`}
      >
        {dayLabels.map((label, ri) =>
          label ? (
            <text
              key={ri}
              x={padX - 8}
              y={cy(ri) + 3}
              textAnchor="end"
              fontSize="9"
              fill="var(--color-muted)"
              fontFamily="var(--font-mono)"
            >
              {label}
            </text>
          ) : null,
        )}

        <path
          d={segments.join(' ')}
          fill="none"
          stroke="var(--color-brass)"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.75"
        />

        {columns.map((col, ci) =>
          col.map((day, ri) => {
            const d = byDay.get(day)
            const future = day > endDay
            return (
              <circle
                key={day}
                cx={cx(ci)}
                cy={cy(ri)}
                r={radius(d)}
                fill={fill(d, future)}
                stroke={d?.frozen ? 'var(--color-brass)' : 'none'}
                strokeWidth={d?.frozen ? 1 : 0}
                strokeDasharray={d?.frozen ? '2 2' : undefined}
              >
                <title>{describe(day, d)}</title>
              </circle>
            )
          }),
        )}
      </svg>
    </div>
  )
}

function practised(d?: CalendarDay): boolean {
  return !!d && d.minutes > 0
}

function radius(d?: CalendarDay): number {
  if (!practised(d)) return 1.8
  const m = d!.minutes
  if (m >= 45) return 5.5
  if (m >= 30) return 4.8
  if (m >= 15) return 4
  return 3.2
}

function fill(d: CalendarDay | undefined, future: boolean): string {
  if (future) return 'rgba(43,48,87,0.35)'
  if (d?.frozen) return 'transparent'
  if (!practised(d)) return 'rgba(139,140,173,0.28)'
  const m = d!.minutes
  if (m >= 45) return 'var(--color-turmeric)'
  if (m >= 30) return 'var(--color-brass)'
  if (m >= 15) return '#a07f3c'
  return '#6d5528'
}

function describe(day: string, d?: CalendarDay): string {
  if (d?.frozen) return `${day} — missed, streak held`
  if (!practised(d)) return `${day} — no practice`
  return `${day} — ${Math.round(d!.minutes)} min`
}
