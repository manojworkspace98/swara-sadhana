import { useEffect, useRef, useState } from 'react'
import { scoreNote, type ScoringConfig } from '../engine/scoring/pitchScore'
import type { ExpectedNote } from '../state/types'
import type { PitchFrame } from '../engine/types'

export type Mark = 'pending' | 'hit' | 'near' | 'miss' | 'silent'

/**
 * The line's accuracy accumulating as it is sung.
 *
 * Each note is judged the moment it has passed, using the same scoring
 * function the final result uses, so the strip and the score always agree. It
 * exists because a number at the end tells you how the line went; this tells
 * you which note went wrong while you can still remember singing it.
 */
export function NoteVerdictStrip({
  timeline,
  frames,
  now,
  config,
  active,
}: {
  timeline: React.RefObject<ExpectedNote[]>
  frames: React.RefObject<PitchFrame[]>
  now: () => number
  config: ScoringConfig
  active: boolean
}) {
  const [marks, setMarks] = useState<Mark[]>([])
  const judged = useRef(0)

  useEffect(() => {
    if (!active) {
      judged.current = 0
      setMarks([])
      return
    }

    const id = setInterval(() => {
      const notes = timeline.current ?? []
      if (notes.length === 0) return

      setMarks((prev) => {
        const next = prev.length === notes.length ? [...prev] : notes.map(() => 'pending' as Mark)
        const t = now()

        // Judge every note whose slot has closed and which has not been judged.
        while (judged.current < notes.length && notes[judged.current].t1 <= t) {
          const i = judged.current
          const note = notes[i]
          if (note.rest) {
            next[i] = 'hit'
          } else {
            const score = scoreNote(frames.current ?? [], note, config)
            next[i] =
              score.verdict === 'not-sung'
                ? 'silent'
                : score.score >= 0.75
                  ? 'hit'
                  : score.score >= 0.5
                    ? 'near'
                    : 'miss'
          }
          judged.current++
        }
        return next
      })
    }, 120)

    return () => clearInterval(id)
  }, [active, timeline, frames, now, config])

  if (!active || marks.length === 0) return null

  const done = marks.filter((m) => m !== 'pending')
  const hits = done.filter((m) => m === 'hit').length

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="eyebrow">As you sing</span>
        {done.length > 0 && (
          <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)]">
            {hits} of {done.length} clean
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1" aria-live="polite">
        {marks.map((m, i) => (
          <span
            key={i}
            title={describe(m)}
            className="grid h-5 w-5 place-items-center rounded text-[11px] transition-colors"
            style={{ background: bg(m), color: fg(m) }}
          >
            {glyph(m)}
          </span>
        ))}
      </div>
    </div>
  )
}

function glyph(m: Mark): string {
  switch (m) {
    case 'hit':
      return '✓'
    case 'near':
      return '≈'
    case 'miss':
      return '✗'
    case 'silent':
      return '·'
    default:
      return ''
  }
}

function bg(m: Mark): string {
  switch (m) {
    case 'hit':
      return 'rgba(123,160,91,0.9)'
    case 'near':
      return 'rgba(232,179,61,0.85)'
    case 'miss':
      return 'rgba(199,71,47,0.85)'
    case 'silent':
      return 'rgba(139,140,173,0.3)'
    default:
      return 'rgba(43,48,87,0.7)'
  }
}

function fg(m: Mark): string {
  return m === 'pending' || m === 'silent' ? '#8b8cad' : '#0e1020'
}

function describe(m: Mark): string {
  switch (m) {
    case 'hit':
      return 'On the note'
    case 'near':
      return 'Close, but drifting'
    case 'miss':
      return 'Off the note'
    case 'silent':
      return 'Nothing sung here'
    default:
      return 'Not yet sung'
  }
}
