import type { NotationLine } from '../content/schema'
import { labelWithSthayi, resolveSwara } from '../engine/swara'

/**
 * Notation as a Carnatic book sets it: swaras in a monospaced grid, the octave
 * carried by a dot above or below, a comma for each extra akshara a note is
 * held, and a danda where the tala's angas divide.
 */
export function NotationView({
  lines,
  ragaSemitones,
  aksharaCount,
  angaStartIndices,
  activeIndex,
  onSelectLine,
}: {
  lines: NotationLine[]
  ragaSemitones: readonly number[]
  aksharaCount: number
  angaStartIndices: readonly number[]
  /** Index into the flattened element list, for the note sounding now. */
  activeIndex?: number
  onSelectLine?: (lineIndex: number) => void
}) {
  let flat = 0

  return (
    <div className="flex flex-col gap-4 overflow-x-auto">
      {lines.map((line, li) => {
        let akshara = 0
        const cells: React.ReactNode[] = []

        line.elements.forEach((el, ei) => {
          const index = flat++
          const isAngaStart =
            angaStartIndices.includes(akshara % aksharaCount) && akshara % aksharaCount !== 0
          const isAvartanaStart = akshara % aksharaCount === 0 && akshara > 0

          if (isAvartanaStart) {
            cells.push(
              <span key={`dd${ei}`} className="px-1.5 text-[var(--color-brass)]">
                ‖
              </span>,
            )
          } else if (isAngaStart) {
            cells.push(
              <span key={`d${ei}`} className="px-1.5 text-[var(--color-line)]">
                |
              </span>,
            )
          }

          const label = el.rest
            ? '–'
            : el.swara
              ? labelWithSthayi(
                  resolveSwara(semitoneFor(el.swara, ragaSemitones), ragaSemitones).name,
                  el.octave,
                )
              : ','

          cells.push(
            <span
              key={ei}
              className={`inline-block min-w-[2.1ch] px-0.5 text-center transition-colors ${
                index === activeIndex
                  ? 'rounded bg-[var(--color-turmeric)] text-[var(--color-ink)]'
                  : el.janta
                    ? 'text-[var(--color-turmeric)]'
                    : ''
              }`}
            >
              {label}
              {/* Karvai: each extra akshara of a held note is one comma. */}
              {el.duration > 1 && ','.repeat(Math.round(el.duration) - 1)}
            </span>,
          )

          akshara += el.duration
        })

        return (
          <div key={line.id}>
            {line.label && <p className="eyebrow mb-1">{line.label}</p>}
            <div
              className="font-[family-name:var(--font-mono)] text-[15px] leading-8 whitespace-nowrap md:text-base"
              onClick={() => onSelectLine?.(li)}
              role={onSelectLine ? 'button' : undefined}
              tabIndex={onSelectLine ? 0 : undefined}
            >
              {cells}
            </div>
            {line.elements.some((e) => e.sahitya) && (
              <div className="mt-0.5 font-[family-name:var(--font-mono)] text-sm whitespace-nowrap text-[var(--color-muted)]">
                {line.elements.map((el, ei) => (
                  <span key={ei} className="inline-block min-w-[2.1ch] px-0.5 text-center">
                    {el.sahitya ?? ''}
                  </span>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/** The raga spends each letter once, so the first match is the only match. */
function semitoneFor(letter: string, ragaSemitones: readonly number[]): number {
  for (const s of ragaSemitones) {
    if (resolveSwara(s, ragaSemitones).name.letter === letter) return s
  }
  return 0
}
