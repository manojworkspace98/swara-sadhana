import type { Tala } from '../content/talas'

/**
 * The tala, shown as the hand keeps it.
 *
 * Carnatic time is counted with the hand — a clap, then finger counts, then a
 * wave — so the bar shows which action belongs to each akshara rather than
 * generic beats. Learning to keep tala is half of learning the music, and a
 * row of identical dots teaches none of it.
 */
export function TalaBar({
  tala,
  activeAkshara,
  avartana,
}: {
  tala: Tala
  /** −1 when nothing is playing. */
  activeAkshara: number
  avartana: number
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <p className="eyebrow">{tala.name}</p>
        <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)]">
          {tala.aksharaCount} aksharas
          {activeAkshara >= 0 && ` · cycle ${avartana + 1}`}
        </p>
      </div>

      <ol className="flex flex-wrap gap-1.5">
        {tala.kriya.map((action, i) => {
          const isSam = i === 0
          const isAngaStart = tala.angaStartIndices.includes(i)
          const active = i === activeAkshara
          return (
            <li
              key={i}
              className={`grid h-9 w-9 place-items-center rounded-md border text-xs transition-colors ${
                active
                  ? 'border-[var(--color-turmeric)] bg-[var(--color-turmeric)] text-[var(--color-ink)]'
                  : isSam
                    ? 'border-[var(--color-brass)] text-[var(--color-brass)]'
                    : isAngaStart
                      ? 'border-[var(--color-line)] text-[var(--color-jasmine)]'
                      : 'border-transparent text-[var(--color-muted)]'
              }`}
              title={`${label(action)}${isSam ? ' (sam)' : ''}`}
            >
              {glyph(action)}
            </li>
          )
        })}
      </ol>

      <p className="mt-2 text-xs text-[var(--color-muted)]">
        ● clap · ✋ wave · ▪ finger count
      </p>
    </div>
  )
}

function glyph(action: Tala['kriya'][number]): string {
  switch (action) {
    case 'beat':
      return '●'
    case 'wave':
      return '✋'
    default:
      return '▪'
  }
}

function label(action: Tala['kriya'][number]): string {
  switch (action) {
    case 'beat':
      return 'Clap'
    case 'wave':
      return 'Wave'
    default:
      return 'Finger count'
  }
}
